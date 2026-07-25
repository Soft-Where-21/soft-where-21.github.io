import assert from 'node:assert/strict';
import test from 'node:test';

import {readCachedPostgradGpa} from '../src/lib/comprehensive/cache.js';
import {calculateComprehensive} from '../src/lib/comprehensive/calculator.js';
import {
  createComprehensiveItem,
  normalizeItemValues,
} from '../src/lib/comprehensive/rules.js';
import {grade23Calculator} from '../src/lib/postgrad/grade23.js';

let nextId = 1;

function item(kind, values = {}, grade = '21') {
  const created = createComprehensiveItem(kind, `test-${nextId++}`, grade);
  return {
    ...created,
    values: normalizeItemValues(
      kind,
      {...created.values, ...values},
      grade
    ),
  };
}

test('four category weights fold raw scores into GPA addition', () => {
  const items = [
    item('manual-technology', {name: '科技', score: '0.1'}),
    item('manual-discipline', {name: '学科', score: '0.1'}),
    item('manual-service', {name: '社会', score: '0.1'}),
    item('manual-culture', {name: '文体', score: '0.1'}),
  ];
  const result = calculateComprehensive(items, '21', 3);

  assert.equal(result.weightedAddition.toFixed(4), '0.1000');
  assert.equal(result.finalScore.toFixed(4), '3.1000');
});

test('technology category uses the 0.2784 lifetime cap', () => {
  const result = calculateComprehensive(
    [item('manual-technology', {name: '认定项目', score: '0.4'})],
    '21'
  );

  assert.equal(result.categories.technology.cappedScore, 0.2784);
  assert.equal(result.weightedAddition, 0.1392);
  assert.equal(result.entries[0].finalScore, 0.2784);
});

test('Fengru awards in the same academic year only keep the highest score', () => {
  const result = calculateComprehensive(
    [
      item('fengru', {
        track: 'main',
        award: '1',
        author: '1',
        academicYear: '1',
      }),
      item('fengru', {
        track: 'red',
        award: '1',
        author: '1',
        academicYear: '1',
      }),
    ],
    '21'
  );

  assert.equal(result.categories.technology.cappedScore, 0.1392);
  assert.equal(result.entries.filter((entry) => entry.excluded).length, 1);
});

test('discipline competition applies same-event highest, yearly cap, then lifetime cap', () => {
  const result = calculateComprehensive(
    [
      item('discipline', {
        competition: 'english',
        level: 'national',
        award: 'special',
        academicYear: '1',
      }),
      item('discipline', {
        competition: 'english',
        level: 'national',
        award: 'first',
        academicYear: '2',
      }),
      item('discipline', {
        competition: 'math',
        level: 'national',
        award: 'special',
        academicYear: '1',
      }),
      item('discipline', {
        competition: 'modeling',
        level: 'national',
        award: 'special',
        academicYear: '2',
      }),
    ],
    '21'
  );

  assert.equal(result.categories.discipline.ruleAdjustedScore, 0.348);
  assert.equal(result.categories.discipline.cappedScore, 0.3132);
  assert.equal(result.entries[1].excluded, true);
});

test('social work keeps two roles per semester and applies the semester cap', () => {
  const result = calculateComprehensive(
    [
      item('service-position', {
        position: 'a',
        rating: 'outstanding',
        semester: '1',
      }),
      item('service-position', {
        position: 'b',
        rating: 'outstanding',
        semester: '1',
      }),
      item('service-position', {
        position: 'c',
        rating: 'outstanding',
        semester: '1',
      }),
    ],
    '21'
  );

  assert.equal(result.categories.service.cappedScore, 0.0696);
  assert.equal(result.entries.filter((entry) => entry.excluded).length, 1);
});

test('volunteer hours use full 50-hour increments above 200 and cap at 0.0464', () => {
  const at250 = calculateComprehensive(
    [item('volunteering', {hours: '250'})],
    '21'
  );
  const capped = calculateComprehensive(
    [item('volunteering', {hours: '1000'})],
    '21'
  );

  assert.equal(at250.entries[0].rawScore.toFixed(4), '0.0290');
  assert.equal(capped.entries[0].rawScore, 0.0464);
});

test('sports item exposes both project and team weights', () => {
  const result = calculateComprehensive(
    [
      item('sports', {
        level: 'school',
        placement: 'first',
        projectType: 'mass',
        form: 'team',
      }),
    ],
    '21'
  );

  assert.equal(result.entries[0].baseScore, 0.0696);
  assert.equal(result.entries[0].factor, 0.4);
  assert.equal(result.entries[0].rawScore.toFixed(5), '0.02784');
  assert.equal(result.entries[0].weightedScore.toFixed(6), '0.002784');
});

test('2022 rules move the national software innovation contest from C to B', () => {
  const values = {
    competition: 'software-innovation',
    awardRank: '1',
    author: '1',
    specialTrack: 'regular',
  };
  const grade21 = calculateComprehensive(
    [item('technology-competition', values, '21')],
    '21'
  );
  const grade22 = calculateComprehensive(
    [item('technology-competition', values, '22')],
    '22'
  );

  assert.equal(grade21.entries[0].rawScore, 0.1392);
  assert.equal(grade22.entries[0].rawScore, 0.2088);
});

test('2022 national innovation adds the annual meeting outcome', () => {
  const grade21 = calculateComprehensive(
    [item('innovation', {level: 'national', outcome: 'annual'}, '21')],
    '21'
  );
  const grade22 = calculateComprehensive(
    [item('innovation', {level: 'national', outcome: 'annual'}, '22')],
    '22'
  );

  assert.equal(grade21.entries[0].rawScore, 0.1044);
  assert.equal(grade22.entries[0].rawScore, 0.2088);
});

test('postgrad cache reader does not apply a different grade calculator', () => {
  const storage = {
    getItem() {
      return JSON.stringify({23: {}});
    },
  };

  assert.equal(readCachedPostgradGpa(storage, '21'), null);
  assert.equal(readCachedPostgradGpa(storage, '22'), null);
});

test('postgrad cache reader recalculates a matching cached grade GPA', () => {
  const data = grade23Calculator.createInitialData();
  data.A[0].score = '90';
  const values = {
    'tool:postgrad:data:v11': JSON.stringify({23: data}),
    'tool:postgrad:groups:v1': JSON.stringify({23: {}}),
  };
  const storage = {
    getItem(key) {
      return values[key] || null;
    },
  };
  const cached = readCachedPostgradGpa(storage, '23');

  assert.equal(cached.grade, '23');
  assert.equal(cached.totalCredits, data.A[0].credits);
  assert.equal(cached.value > 0, true);
});
