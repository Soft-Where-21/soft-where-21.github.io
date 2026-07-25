import assert from 'node:assert/strict';
import test from 'node:test';

import {grade23Calculator} from '../src/lib/postgrad/grade23.js';
import {grade24Calculator} from '../src/lib/postgrad/grade24.js';
import {getRowGpa, isCountable} from '../src/lib/postgrad/shared.js';
import {parseTranscriptText} from '../src/lib/postgrad/transcript.js';

const HEADERS = [
  '操作',
  '课程名',
  '课程号',
  '学分',
  '总成绩',
  '绩点',
  '是否有效',
  '重修重考',
  '获得学年学期',
  '课程类别',
  '课程性质',
  '通识选修课类别',
  '考试类型',
  '替代课程名',
  '替代课程号',
  '成绩认定方式',
];

function transcriptRow({
  name,
  code = 'B000000001',
  credits = '2',
  score,
  valid = '是',
  attempt = '正考',
  substituteName = '',
  substituteCode = '',
}) {
  const cells = Array(HEADERS.length).fill('');
  cells[1] = name;
  cells[2] = code;
  cells[3] = credits;
  cells[4] = String(score);
  cells[6] = valid;
  cells[7] = attempt;
  cells[13] = substituteName;
  cells[14] = substituteCode;
  return cells.join('\t');
}

function parseRows(rows) {
  return parseTranscriptText([HEADERS.join('\t'), ...rows].join('\n'));
}

function findRow(data, categoryId, name) {
  return data[categoryId].find((row) => row.name === name);
}

function fillCalculator(calculator) {
  const data = calculator.createInitialData();
  calculator.groups.forEach((group) => {
    group.categories.forEach((category) => {
      const rows = data[category.id] || [];
      rows.forEach((row) => {
        if (row.scoreType === 'passfail') row.passStatus = 'pass';
        else if (row.scoreType === 'five') row.score = 'excellent';
        else row.score = '90';
      });
      if (category.selectable) {
        const required = new Set(category.requiredNames || []);
        let selectedCredits = 0;
        let selectedCount = 0;
        rows.forEach((row) => {
          if (required.has(row.name)) return;
          if (
            selectedCredits < (category.minCredits || 0) ||
            selectedCount < (category.minCount || 0)
          ) {
            row.selected = true;
            selectedCredits += Number(row.credits) || 0;
            selectedCount += 1;
          }
        });
      }
    });
  });
  return data;
}

test('header-based import preserves empty columns and applies only the replacement target', () => {
  const records = parseRows([
    transcriptRow({
      name: 'C语言程序设计',
      code: 'B370012001',
      credits: '2.5',
      score: '100',
      substituteName: '程序设计基础',
      substituteCode: 'B060012003',
    }),
    transcriptRow({
      name: '航空航天概论A',
      code: 'B050026002',
      credits: '2',
      score: '96',
      substituteName: '航空航天概论B',
      substituteCode: 'B050026003',
    }),
  ]);
  const result = grade23Calculator.importTranscript(
    grade23Calculator.createInitialData(),
    records
  );

  const programming = findRow(result.data, 'B', '程序设计基础');
  const aerospace = findRow(result.data, 'G', '航空航天概论B');
  assert.equal(programming.score, '100');
  assert.equal(programming.credits, 2);
  assert.equal(aerospace.score, '96');
  assert.equal(aerospace.credits, 1.5);
  assert.equal(result.updatedRows, 2);
});

test('23 grade applies English and physics special replacements even when source rows are invalid', () => {
  const records = parseRows([
    transcriptRow({
      name: '大学英语A（3）',
      code: 'B1C12207A',
      score: '83',
      valid: '否',
    }),
    transcriptRow({
      name: '基础物理学B(2)',
      code: 'B190011006',
      credits: '4',
      score: '87',
      valid: '否',
    }),
    transcriptRow({
      name: '工科大学物理（1）',
      code: 'B1A19101B',
      credits: '4',
      score: '96',
      valid: '否',
    }),
  ]);
  const result = grade23Calculator.importTranscript(
    grade23Calculator.createInitialData(),
    records
  );

  assert.equal(findRow(result.data, 'C', '英语阅读（1）').score, '83');
  assert.equal(findRow(result.data, 'C', '英语写作（1）').score, '83');
  assert.equal(findRow(result.data, 'A', '基础物理学A(1)').score, '91.5');
});

test('24 grade does not apply the 23 grade English or physics special cases', () => {
  const records = parseRows([
    transcriptRow({name: '大学英语A（3）', score: '83', valid: '否'}),
    transcriptRow({name: '基础物理学B(2)', score: '87', valid: '否'}),
    transcriptRow({name: '工科大学物理（1）', score: '96', valid: '否'}),
  ]);
  const result = grade24Calculator.importTranscript(
    grade24Calculator.createInitialData(),
    records
  );

  assert.equal(findRow(result.data, 'C', '英语阅读（1）').score, '');
  assert.equal(findRow(result.data, 'A', '基础物理学A(1)').score, '');
});

test('all five-level courses use the direct GPA mapping from the rules', () => {
  const records = parseRows([
    transcriptRow({name: '形势与政策（1）', credits: '0.2', score: '通过'}),
    transcriptRow({name: '社会实践', credits: '2', score: '优秀'}),
    transcriptRow({name: '程序设计实践', credits: '2', score: '优秀'}),
  ]);
  const result = grade23Calculator.importTranscript(
    grade23Calculator.createInitialData(),
    records
  );

  const policy = findRow(result.data, 'D1', '形势与政策（1）');
  const practice = findRow(result.data, 'D1', '社会实践');
  const programmingPractice = findRow(result.data, 'I-3', '程序设计实践');
  assert.equal(policy.score, 'medium');
  assert.equal(practice.score, 'excellent');
  assert.equal(getRowGpa(policy), 2.8);
  assert.equal(getRowGpa(practice), 4);
  assert.equal(programmingPractice.scoreType, 'five');
  assert.equal(programmingPractice.score, 'excellent');
  assert.equal(getRowGpa(programmingPractice), 4);
  assert.equal(isCountable(programmingPractice), true);
});

test('numeric results satisfy pass-only required courses without adding GPA credits', () => {
  const records = parseRows([
    transcriptRow({name: '英文科技写作（软件工程）', score: '94'}),
  ]);
  const result = grade23Calculator.importTranscript(
    grade23Calculator.createInitialData(),
    records
  );
  const writing = findRow(result.data, 'J', '英文科技写作（软件工程）');
  assert.equal(writing.scoreType, 'passfail');
  assert.equal(writing.passStatus, 'pass');
  assert.equal(isCountable(writing), false);
});

test('pending rows include required and selected courses but exclude unused electives', () => {
  const data = grade23Calculator.createInitialData();
  const pending = grade23Calculator.getPendingRows(data, {C: 'A'});
  const optionalDirectionCourse = findRow(data, 'J', '分布式系统导论');
  const requiredProfessionalCourse = findRow(
    data,
    'J',
    '英文科技写作（软件工程）'
  );

  assert.equal(pending.has('A:1'), true);
  assert.equal(pending.has(`J:${requiredProfessionalCourse.id}`), true);
  assert.equal(pending.has(`J:${optionalDirectionCourse.id}`), false);
});

test('both grade calculators can reach a complete result under their own framework', () => {
  const grade23Data = fillCalculator(grade23Calculator);
  const grade24Data = fillCalculator(grade24Calculator);
  assert.equal(grade23Calculator.calculate(grade23Data, {C: 'A'}).allOk, true);
  assert.equal(grade24Calculator.calculate(grade24Data, {}).allOk, true);
});
