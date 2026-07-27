import assert from 'node:assert/strict';
import test from 'node:test';

import {calculateComprehensive} from '../src/lib/comprehensive/calculator.js';
import {
  createComprehensiveItem,
  normalizeItemValues,
} from '../src/lib/comprehensive/rules.js';

let nextId = 1;

function evaluate(kind, values = {}, grade = '21') {
  const created = createComprehensiveItem(kind, `policy-${nextId++}`, grade);
  const item = {
    ...created,
    values: normalizeItemValues(
      kind,
      {...created.values, ...values},
      grade
    ),
  };
  return calculateComprehensive([item], grade).entries[0];
}

function close(actual, expected, message = '') {
  assert.ok(
    Math.abs(actual - expected) < 1e-10,
    `${message} expected ${expected}, received ${actual}`
  );
}

function assertMatrix({kind, baseValues, rowKey, columnKey, matrix, grade = '21'}) {
  matrix.forEach((row, rowIndex) => {
    row.forEach((expected, columnIndex) => {
      const entry = evaluate(
        kind,
        {
          ...baseValues,
          [rowKey]: String(rowIndex + 1),
          [columnKey]: String(columnIndex + 1),
        },
        grade
      );
      close(
        entry.rawScore,
        expected,
        `${kind} row ${rowIndex + 1}, column ${columnIndex + 1}`
      );
    });
  });
}

test('Fengru tables 1-4 and philosophy factor match both policies', () => {
  const main = [
    [0.1392, 0.0522, 0.0174],
    [0.1044, 0.0261, 0.0087],
    [0.0696, 0.0131, 0.0043],
  ];
  const red = [
    [0.1044, 0.0261, 0.0087],
    [0.0696, 0.0131, 0.0043],
    [0.0464, 0.0087, 0.0029],
  ];
  const industry = [
    [0.0696, 0.0174, 0.0058],
    [0.0522, 0.0087, 0.0029],
    [0.0348, 0.0043, 0.0017],
  ];

  for (const grade of ['21', '22']) {
    assertMatrix({
      kind: 'fengru',
      baseValues: {track: 'main'},
      rowKey: 'award',
      columnKey: 'author',
      matrix: main,
      grade,
    });
    assertMatrix({
      kind: 'fengru',
      baseValues: {track: 'red'},
      rowKey: 'award',
      columnKey: 'author',
      matrix: red,
      grade,
    });
    assertMatrix({
      kind: 'fengru',
      baseValues: {track: 'industry'},
      rowKey: 'award',
      columnKey: 'author',
      matrix: industry,
      grade,
    });
    main.forEach((row, awardIndex) => {
      row.forEach((score, authorIndex) => {
        close(
          evaluate(
            'fengru',
            {
              track: 'philosophy',
              award: String(awardIndex + 1),
              author: String(authorIndex + 1),
            },
            grade
          ).rawScore,
          score * 0.5
        );
      });
    });
    [0.0464, 0.0348, 0.0232, 0.0174].forEach((score, index) => {
      close(
        evaluate('fengru', {track: 'creative', award: String(index)}, grade)
          .rawScore,
        score
      );
    });
    close(evaluate('fengru', {track: 'valid'}, grade).rawScore, 0.0025);
  }
});

test('A, B and C technology competition matrices match attachment one', () => {
  const matrices = {
    'challenge-national': [
      [0.2784, 0.1044, 0.0348],
      [0.2088, 0.0522, 0.0174],
      [0.1392, 0.0261, 0.0087],
    ],
    'internet-application': [
      [0.2088, 0.0783, 0.0261],
      [0.1392, 0.0348, 0.0116],
      [0.1044, 0.0196, 0.0065],
    ],
    'software-cup': [
      [0.1392, 0.0522, 0.0174],
      [0.1044, 0.0261, 0.0087],
      [0.0696, 0.0131, 0.0043],
    ],
  };

  Object.entries(matrices).forEach(([competition, matrix]) => {
    assertMatrix({
      kind: 'technology-competition',
      baseValues: {competition, specialTrack: 'regular'},
      rowKey: 'awardRank',
      columnKey: 'author',
      matrix,
    });
  });
});

test('every technology competition keeps its year-specific A, B or C class', () => {
  const classScores = {A: 0.2784, B: 0.2088, C: 0.1392};
  const competitionsByGrade = {
    '21': {
      A: ['challenge-national', 'innovation-national'],
      B: ['internet-application', 'chuangqingchun', 'asc-champion'],
      C: [
        'software-cup',
        'information-security',
        'huawei-ai',
        'innovation-beijing',
        'capital-challenge',
        'jingcai',
        'software-innovation',
        'zhongwang',
        'global-innovation',
        'asc-award',
        'college-computer',
        'computer-design',
      ],
    },
    '22': {
      A: ['challenge-national', 'innovation-national'],
      B: [
        'internet-application',
        'chuangqingchun',
        'asc-champion',
        'capital-challenge',
        'innovation-beijing',
        'software-innovation',
      ],
      C: [
        'software-cup',
        'information-security',
        'huawei-ai',
        'jingcai',
        'global-innovation',
        'asc-award',
        'college-computer',
        'computer-design',
      ],
    },
  };

  Object.entries(competitionsByGrade).forEach(([grade, classes]) => {
    Object.entries(classes).forEach(([scoreClass, competitions]) => {
      competitions.forEach((competition) => {
        close(
          evaluate(
            'technology-competition',
            {
              competition,
              awardRank: '1',
              author: '1',
              specialTrack: 'regular',
            },
            grade
          ).rawScore,
          classScores[scoreClass],
          `${grade} grade ${competition}`
        );
      });
    });
  });
});

test('special track uses the selected author table score before its author factor', () => {
  const secondAuthor = evaluate('technology-competition', {
    competition: 'challenge-national',
    awardRank: '2',
    author: '2',
    specialTrack: 'special',
  });
  close(secondAuthor.baseScore, 0.0522);
  close(secondAuthor.factor, 1 / 3);
  close(secondAuthor.rawScore, 0.0522 / 3);
  close(secondAuthor.weightedScore, 0.0522 / 3 * 0.5);

  const firstAuthor = evaluate('technology-competition', {
    competition: 'challenge-national',
    awardRank: '2',
    author: '1',
    specialTrack: 'special',
  });
  close(firstAuthor.baseScore, 0.2088);
  close(firstAuthor.factor, 0.5);
  close(firstAuthor.weightedScore, 0.2088 * 0.5 * 0.5);

  const thirdAuthor = evaluate('technology-competition', {
    competition: 'challenge-national',
    awardRank: '2',
    author: '3',
    specialTrack: 'special',
  });
  close(thirdAuthor.baseScore, 0.0174);
  close(thirdAuthor.factor, 1 / 3);
  close(thirdAuthor.weightedScore, 0.0174 / 3 * 0.5);
});

test('innovation table 6 matches the year-specific policy', () => {
  const cases = [
    ['21', 'national', 'excellent', [0.1044, 0.0261, 0.0087]],
    ['21', 'national', 'good', [0.0261, 0, 0]],
    ['22', 'national', 'annual', [0.2088, 0.0783, 0.0261]],
    ['22', 'national', 'excellent', [0.1044, 0.0261, 0.0087]],
    ['22', 'national', 'good', [0.0261, 0, 0]],
    ['21', 'city', 'excellent', [0.0522, 0.013, 0]],
    ['21', 'city', 'good', [0.013, 0, 0]],
    ['21', 'school', 'excellent', [0.0174, 0.0032, 0]],
  ];
  cases.forEach(([grade, level, outcome, scores]) => {
    scores.forEach((score, authorIndex) => {
      close(
        evaluate(
          'innovation',
          {level, outcome, author: String(authorIndex + 1)},
          grade
        ).rawScore,
        score
      );
    });
  });
});

test('ACM table 7 and paper table 8 match both policies', () => {
  const acm = {
    ccpc: [0.0773, 0.0619, 0.0464],
    regional: [0.116, 0.0928, 0.0696],
    'ec-final': [0.174, 0.1392, 0.1044],
    'world-final': [0.2784, 0.232, 0.174],
  };
  const medals = ['gold', 'silver', 'bronze'];
  Object.entries(acm).forEach(([level, scores]) => {
    scores.forEach((score, index) => {
      close(evaluate('acm', {level, medal: medals[index]}).rawScore, score);
    });
  });

  const papers = {
    'ccf-a': 0.174,
    'ccf-b': 0.1392,
    'ccf-c': 0.1276,
    sci: 0.116,
    'ei-journal': 0.0928,
    'ei-conference': 0.0464,
  };
  Object.entries(papers).forEach(([level, score]) => {
    close(evaluate('paper', {level, authorship: 'first'}).rawScore, score);
    close(evaluate('paper', {level, authorship: 'second'}).rawScore, score);
  });
  close(
    evaluate(
      'paper',
      {level: 'ccf-a', authorship: 'cofirst', coauthorCount: '4'},
      '22'
    ).rawScore,
    0.174 / 4
  );
});

test('discipline table 10 and MCM mappings match both policies', () => {
  const table = {
    national: [0.174, 0.1392, 0.0696, 0.0348],
    provincial: [0.1392, 0.0696, 0.0348, 0.0174],
    school: [0.0696, 0.0348, 0.0174, 0.0087],
  };
  const awards = ['special', 'first', 'second', 'third'];
  Object.entries(table).forEach(([level, scores]) => {
    scores.forEach((score, index) => {
      close(
        evaluate('discipline', {
          competition: 'english',
          level,
          award: awards[index],
        }).rawScore,
        score
      );
    });
  });
  close(
    evaluate('discipline', {competition: 'mcm', award: 'outstanding'}).rawScore,
    0.1392
  );
  close(
    evaluate('discipline', {competition: 'mcm', award: 'finalist'}).rawScore,
    0.0696
  );
  close(
    evaluate('discipline', {competition: 'mcm', award: 'meritorious'}).rawScore,
    0.0348
  );
});

test('social work table 11 and individual honor table 12 match both policies', () => {
  const positions = {a: 0.0348, b: 0.0261, c: 0.0174, d: 0.0087};
  const ratings = {
    outstanding: 2,
    excellent: 1.5,
    good: 1,
    pass: 0.5,
    fail: 0,
  };
  Object.entries(positions).forEach(([position, base]) => {
    Object.entries(ratings).forEach(([rating, factor]) => {
      const entry = evaluate('service-position', {position, rating});
      close(entry.baseScore, base);
      close(entry.factor, factor);
      close(entry.rawScore, base * factor);
    });
  });

  const honors = {
    'three-good': [0.0261, 0.0087],
    zhuhang: [null, 0.0087],
    'student-leader': [0.0464, 0.0116],
    'league-member': [0.0348, 0.0087],
    'league-leader': [0.0464, 0.0116],
    'annual-person': [0.0928, 0.0464],
    'may-fourth': [0.0928, 0.0464],
    volunteer: [0.0464, 0.0232],
  };
  Object.entries(honors).forEach(([honor, [city, school]]) => {
    if (city != null) {
      close(evaluate('individual-honor', {level: 'city', honor}).rawScore, city);
    }
    close(
      evaluate('individual-honor', {level: 'school', honor}).rawScore,
      school
    );
  });
});

test('volunteer thresholds, sports tables and art tables match the policies', () => {
  const volunteerCases = [
    [0, 0],
    [49.5, 0],
    [50, 0.0116],
    [99.5, 0.0116],
    [100, 0.0232],
    [200, 0.0232],
    [249.5, 0.0232],
    [250, 0.029],
    [400, 0.0464],
  ];
  volunteerCases.forEach(([hours, score]) => {
    close(evaluate('volunteering', {hours: String(hours)}).rawScore, score);
  });

  const sports = {
    city: [0.1392, 0.1044, 0.0696, 0.0348],
    school: [0.0696, 0.0522, 0.0348, 0.0174],
  };
  const placements = ['first', 'second', 'third', 'four-eight'];
  Object.entries(sports).forEach(([level, scores]) => {
    scores.forEach((score, index) => {
      close(
        evaluate('sports', {
          level,
          placement: placements[index],
          projectType: 'standard',
          form: 'individual',
        }).rawScore,
        score
      );
      close(
        evaluate('sports', {
          level,
          placement: placements[index],
          projectType: 'mass',
          form: 'team',
        }).rawScore,
        score * 0.8 * 0.5
      );
    });
  });

  const arts = {
    city: [0.1392, 0.1044, 0.0696],
    school: [0.0696, 0.0522, 0.0348],
  };
  const awards = ['first', 'second', 'third'];
  Object.entries(arts).forEach(([level, scores]) => {
    scores.forEach((score, index) => {
      close(
        evaluate('arts', {level, award: awards[index], form: 'individual'})
          .rawScore,
        score
      );
      close(
        evaluate('arts', {level, award: awards[index], form: 'team'}).rawScore,
        score * 0.5
      );
    });
  });
});

test('identical paper and identical honor entries are not counted twice', () => {
  const paperA = createComprehensiveItem('paper', 'paper-a', '22');
  const paperB = createComprehensiveItem('paper', 'paper-b', '22');
  paperA.values = {...paperA.values, paperName: '同一篇论文'};
  paperB.values = {...paperB.values, paperName: ' 同一篇 论文 '};
  const paperResult = calculateComprehensive([paperA, paperB], '22');
  assert.equal(paperResult.entries.filter((entry) => entry.excluded).length, 1);

  const honorA = createComprehensiveItem('individual-honor', 'honor-a', '21');
  const honorB = createComprehensiveItem('individual-honor', 'honor-b', '21');
  const honorResult = calculateComprehensive([honorA, honorB], '21');
  assert.equal(honorResult.entries.filter((entry) => entry.excluded).length, 1);
});
