import assert from 'node:assert/strict';

import {calculateComprehensive} from '../src/lib/comprehensive/calculator.js';
import {
  createComprehensiveItem,
  evaluateComprehensiveItem,
  getFieldOptions,
  getItemRule,
  GRADE_OPTIONS,
  normalizeItemValues,
} from '../src/lib/comprehensive/rules.js';

let itemIndex = 0;

function makeItem(kind, grade, values = {}) {
  const item = createComprehensiveItem(kind, `test-${itemIndex++}`, grade);
  return {
    ...item,
    values: normalizeItemValues(kind, {...item.values, ...values}, grade),
  };
}

function evaluate(kind, grade, values = {}) {
  return evaluateComprehensiveItem(makeItem(kind, grade, values), grade);
}

function options(kind, fieldKey, grade, values = {}) {
  const item = makeItem(kind, grade, values);
  const field = getItemRule(kind).fields.find(({key}) => key === fieldKey);
  return getFieldOptions(field, item.values, grade);
}

function closeTo(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) < 1e-10,
    `${message}: expected ${expected}, received ${actual}`
  );
}

assert.deepEqual(
  GRADE_OPTIONS.map(({value}) => value),
  ['23', '22', '21']
);
assert.equal(GRADE_OPTIONS[0].pdfUrl, '/file/综测方案-2023.pdf');

const grade23FengruTracks = options('fengru', 'track', '23');
assert.ok(grade23FengruTracks.some(({value}) => value === 'discipline-agent'));
assert.ok(grade23FengruTracks.some(({value}) => value === 'industry-special'));
assert.ok(grade23FengruTracks.some(({value}) => value === 'innovation-cup'));
assert.ok(!options('fengru', 'track', '22').some(({value}) => value === 'discipline-agent'));
closeTo(
  evaluate('fengru', '23', {
    track: 'discipline-agent',
    award: '1',
    author: '1',
  }).rawScore,
  0.1044,
  '2023 学科智能体专项冯如杯得分'
);
closeTo(
  evaluate('fengru', '23', {
    track: 'industry-special',
    award: '1',
    author: '1',
  }).rawScore,
  0.0696,
  '2023 主赛道专项冯如杯得分'
);
const innovationCup = evaluate('fengru', '23', {track: 'innovation-cup'});
closeTo(innovationCup.rawScore, 0, '2023 创新杯专项不额外加分');
assert.match(innovationCup.warnings[0], /不额外加分/);

const grade23TechnologyCompetitions = options(
  'technology-competition',
  'competition',
  '23'
);
assert.equal(grade23TechnologyCompetitions.length, 27);
closeTo(
  evaluate('technology-competition', '23', {
    competition: 'huawei-ict-international',
    awardRank: '1',
    author: '1',
    specialTrack: 'regular',
  }).rawScore,
  0.2088,
  '2023 国际级华为 ICT 大赛得分'
);
closeTo(
  evaluate('technology-competition', '23', {
    competition: 'huawei-ict-national',
    awardRank: '1',
    author: '1',
    specialTrack: 'regular',
  }).rawScore,
  0.1392,
  '2023 国家级华为 ICT 大赛得分'
);

assert.ok(
  options('innovation', 'outcome', '23', {level: 'national'}).some(
    ({value}) => value === 'annual'
  )
);
assert.ok(
  !options('innovation', 'outcome', '21', {level: 'national'}).some(
    ({value}) => value === 'annual'
  )
);
closeTo(
  evaluate('innovation', '23', {
    level: 'national',
    outcome: 'annual',
    author: '3',
  }).rawScore,
  0.0261,
  '2023 国家级大创入围年会第三作者得分'
);

closeTo(
  evaluate('paper', '23', {
    level: 'ccf-a',
    authorship: 'cofirst',
    coauthorCount: '4',
  }).rawScore,
  0.0435,
  '2023 四人共同一作论文得分'
);
const cofirstResult = calculateComprehensive(
  [
    makeItem('paper', '23', {
      level: 'ccf-a',
      authorship: 'cofirst',
      coauthorCount: '2',
      paperName: 'Paper A',
    }),
    makeItem('paper', '23', {
      level: 'ccf-b',
      authorship: 'cofirst',
      coauthorCount: '2',
      paperName: 'Paper B',
    }),
  ],
  '23'
);
assert.equal(cofirstResult.entries.filter(({excluded}) => excluded).length, 1);
closeTo(
  cofirstResult.categories.technology.ruleAdjustedScore,
  0.087,
  '2023 共同一作论文至多计入一篇'
);

assert.equal(options('discipline', 'competition', '23').length, 15);
closeTo(
  evaluate('discipline', '23', {
    competition: 'baidu-star',
    level: 'national',
    award: 'first',
  }).rawScore,
  0.1392,
  '2023 百度之星国家级一等奖得分'
);

assert.match(
  options('service-position', 'position', '23').find(({value}) => value === 'b')
    .label,
  /五星社团/
);
closeTo(
  evaluate('service-position', '23', {
    position: 'b',
    rating: 'outstanding',
  }).rawScore,
  0.0522,
  '2023 B 类岗位表现突出得分'
);

const grade23SchoolHonors = options('individual-honor', 'honor', '23', {
  level: 'school',
});
assert.ok(grade23SchoolHonors.some(({value}) => value === 'shen-yuan'));
assert.ok(!grade23SchoolHonors.some(({value}) => value === 'zhuhang'));
assert.ok(
  options('individual-honor', 'honor', '22', {level: 'school'}).some(
    ({value}) => value === 'zhuhang'
  )
);
closeTo(
  evaluate('individual-honor', '23', {
    level: 'school',
    honor: 'shen-yuan',
  }).rawScore,
  0.0464,
  '2023 校级沈元奖章得分'
);

const grade23PracticeOptions = options(
  'social-practice',
  'achievementType',
  '23'
);
assert.equal(grade23PracticeOptions.length, 3);
closeTo(
  evaluate('social-practice', '23', {achievementType: 'individual'}).rawScore,
  0.0232,
  '2023 社会实践先进个人得分'
);
closeTo(
  evaluate('social-practice', '23', {achievementType: 'team-school'}).rawScore,
  0.0116,
  '2023 校级优秀实践队得分'
);
closeTo(
  evaluate('social-practice', '23', {achievementType: 'team-college'}).rawScore,
  0.0086,
  '2023 院级优秀实践队得分'
);
closeTo(
  evaluate('social-practice', '22', {achievementType: 'individual'}).rawScore,
  0.0116,
  '2022 社会实践先进个人得分保持不变'
);

assert.ok(
  options('sports', 'placement', '23').some(({value}) => value === 'completed')
);
assert.ok(
  !options('sports', 'placement', '22').some(({value}) => value === 'completed')
);
closeTo(
  evaluate('sports', '23', {
    level: 'school',
    placement: 'completed',
    projectType: 'mass',
    form: 'team',
  }).rawScore,
  0.00348,
  '2023 校级群众体育集体项目完赛得分'
);

const example = calculateComprehensive(
  [
    makeItem('manual-technology', '23', {name: '示例科技', score: '0.1392'}),
    makeItem('manual-discipline', '23', {name: '示例学科', score: '0.0348'}),
    makeItem('manual-service', '23', {name: '示例社会', score: '0.0696'}),
    makeItem('manual-culture', '23', {name: '示例文体', score: '0.0348'}),
  ],
  '23',
  3.2667
);
closeTo(example.weightedAddition, 0.09396, '2023 方案示例综测折合加分');
closeTo(example.finalScore, 3.36066, '2023 方案示例最终综合成绩');

console.log('Comprehensive calculator rules: all assertions passed.');
