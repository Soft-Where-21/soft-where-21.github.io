import {
  applyImportAssignments,
  buildInitialData,
  buildRecognitionAssignments,
  calculateByGroups,
  detectRequiredGroupChoice,
  getPendingRows,
  mergeStoredData,
  toCourseKey,
} from './shared.js';

export const grade23Groups = [
  {
    module: 'I 基础课',
    categories: [
      {id: 'A', name: '数理基础课', requirement: '最低 6 门', minCount: 6},
      {id: 'B', name: '工程基础课', requirement: '最低 4 门', minCount: 4},
      {
        id: 'C',
        name: '外语课',
        requirement: '英语阅读/写作 + 大英 A(1)(2) 或大英 B(1)(2)',
        requiredMode: 'score',
        requiredNames: ['英语阅读（1）', '英语写作（1）'],
        requiredGroups: [
          {
            id: 'A',
            label: '大学英语 A（1）（2）',
            names: ['大学英语A（1）', '大学英语A（2）'],
          },
          {
            id: 'B',
            label: '大学英语 B（1）（2）',
            names: ['大学英语B（1）', '大学英语B（2）'],
          },
        ],
      },
    ],
  },
  {
    module: 'II 通修课',
    categories: [
      {id: 'D1', name: '思政课', requirement: '最低 12 门', minCount: 12},
      {id: 'D2', name: '军理课', requirement: '最低 1 门', minCount: 1},
      {id: 'F', name: '体育课', requirement: '最低 6 门', minCount: 6},
      {
        id: 'G',
        name: '综合素养课',
        requirement: '大类概论课择优 1 门，另 3 门必修',
        minCount: 1,
        selectable: true,
        requiredMode: 'score',
        optionalNames: [
          '电子信息工程导论',
          '自动化科学与电气工程导论',
          '计算机导论与伦理学',
          '仪器科学概览',
          '走进软件',
          '网络空间安全导论',
          '集成电路导论',
        ],
        requiredNames: ['航空航天概论B', '经济管理', '互联网软件创新创意创业'],
      },
      {id: 'H', name: '一般通识课', requirement: '最低 0 门', minCount: 0, selectable: true},
      {id: 'I-2', name: '素质教育实践必修课', requirement: '最低 6 门', minCount: 6},
    ],
  },
  {
    module: 'III 专业课',
    categories: [
      {id: 'I-3', name: '核心专业类', requirement: '最低 14 门', minCount: 14},
      {
        id: 'J',
        name: '一般专业类',
        requirement: '方向课计入不少于 6 学分，指定 4 门仅需通过',
        note:
          '指定：英文科技写作（软件工程）/ 跨文化交流/ 软件工程伦理与职业规范/ 学科前沿讲座',
        minCredits: 6,
        selectable: true,
        requiredMode: 'passfail',
        requiredNames: [
          '英文科技写作（软件工程）',
          '跨文化交流',
          '软件工程伦理与职业规范',
          '学科前沿讲座',
        ],
      },
    ],
  },
];

export const grade23Presets = {
  A: [
    {name: '工科数学分析（1）', credits: 6},
    {name: '工科高等代数', credits: 6},
    {name: '工科数学分析（2）', credits: 6},
    {
      name: '基础物理学A(1)',
      aliases: ['基础物理学（1）', '基础物理学A（1）'],
      credits: 4,
    },
    {name: '概率统计A', credits: 3},
    {name: '基础物理实验（1）', aliases: ['基础物理实验(1)'], credits: 1},
  ],
  B: [
    {name: '程序设计基础', credits: 2},
    {name: '电子设计基础训练', credits: 2},
    {name: '离散数学（信息类）', credits: 2},
    {name: '数据结构与程序设计（信息类）', credits: 3},
  ],
  C: [
    {name: '大学英语A（1）', credits: 2},
    {name: '大学英语A（2）', credits: 2},
    {name: '大学英语B（1）', credits: 2},
    {name: '大学英语B（2）', credits: 2},
    {name: '英语阅读（1）', aliases: ['英语阅读（3）'], credits: 1},
    {name: '英语写作（1）', aliases: ['英语写作（3）'], credits: 1},
  ],
  D1: [
    {name: '思想道德与法治', credits: 3},
    {name: '习近平新时代中国特色社会主义思想概论', credits: 3},
    {name: '中国近现代史纲要', credits: 3},
    {name: '毛泽东思想和中国特色社会主义理论体系概论', credits: 3},
    {name: '社会实践', credits: 2, scoreType: 'five'},
    {name: '马克思主义基本原理', credits: 3},
    {name: '形势与政策（1）', credits: 0.2, scoreType: 'five'},
    {name: '形势与政策（2）', credits: 0.3, scoreType: 'five'},
    {name: '形势与政策（3）', credits: 0.2, scoreType: 'five'},
    {name: '形势与政策（4）', credits: 0.3, scoreType: 'five'},
    {name: '形势与政策（5）', credits: 0.2, scoreType: 'five'},
    {name: '形势与政策（6）', credits: 0.3, scoreType: 'five'},
  ],
  D2: [{name: '军事理论', credits: 2}],
  F: [
    {name: '体育（1）', credits: 0.5},
    {name: '体育（2）', credits: 0.5},
    {name: '体育（3）', credits: 0.5},
    {name: '体育（4）', credits: 0.5},
    {name: '体育（5）', credits: 0.5},
    {name: '体育（6）', credits: 0.5},
  ],
  G: [
    {name: '电子信息工程导论', credits: 1.5},
    {name: '自动化科学与电气工程导论', credits: 1.5},
    {name: '计算机导论与伦理学', credits: 1.5},
    {name: '仪器科学概览', aliases: ['仪器科学概论'], credits: 1.5},
    {name: '走进软件', credits: 1.5},
    {name: '网络空间安全导论', credits: 1.5},
    {name: '集成电路导论', credits: 1.5},
    {name: '航空航天概论B', credits: 1.5},
    {name: '经济管理', credits: 2},
    {name: '互联网软件创新创意创业', credits: 1.5},
  ],
  H: [],
  'I-2': [
    {name: '素质教育（博雅课程）（1）', credits: 0.2, scoreType: 'five'},
    {name: '素质教育（博雅课程）（2）', credits: 0.3, scoreType: 'five'},
    {name: '素质教育（博雅课程）（3）', credits: 0.2, scoreType: 'five'},
    {name: '素质教育（博雅课程）（4）', credits: 0.3, scoreType: 'five'},
    {name: '素质教育（博雅课程）（5）', credits: 0.2, scoreType: 'five'},
    {name: '素质教育（博雅课程）（6）', credits: 0.3, scoreType: 'five'},
  ],
  'I-3': [
    {name: '离散数学（2）', credits: 2},
    {name: '计算机硬件基础（软件专业）', credits: 4},
    {name: '算法分析与设计', credits: 3},
    {name: '面向对象程序设计（Java）', credits: 2.5},
    {name: '数据管理技术', credits: 3},
    {name: '软件工程基础', credits: 3},
    {name: '操作系统', credits: 4.5},
    {name: '人工智能', credits: 2},
    {name: '计算机网络与应用', credits: 3},
    {name: '编译技术', credits: 4.5},
    {name: '软件系统分析与设计', credits: 3},
    {name: '软件过程与质量', credits: 3},
    {name: '程序设计实践', credits: 2},
    {name: '软件工程基础实践', credits: 2},
  ],
  J: [
    {name: '分布式系统导论', credits: 2},
    {name: '并行程序设计', credits: 2},
    {name: '云计算技术基础', credits: 2},
    {name: '嵌入式软件设计', credits: 2},
    {name: '数值计算与算法', credits: 2},
    {name: '计算机辅助设计与制造', credits: 2},
    {name: '工业互联网技术基础', credits: 2},
    {name: '工业大数据技术', credits: 2},
    {name: '物联网技术基础', credits: 2},
    {name: '智能计算系统', credits: 2},
    {name: '图像处理和计算机视觉', credits: 2},
    {name: '智能软件工程', credits: 2},
    {name: '开源软件开发导论', credits: 2},
    {name: '英文科技写作（软件工程）', credits: 2},
    {name: '跨文化交流', credits: 1},
    {name: '软件工程伦理与职业规范', credits: 1},
    {name: '学科前沿讲座', credits: 0.5},
  ],
};

function eligibleSpecialRecord(record) {
  return !record.attempt || record.attempt === '正考';
}

function comparisonScore(record) {
  if (record.scoreType === 'percent' && Number.isFinite(record.score)) return record.score;
  return {优秀: 90, 良好: 80, 中等: 70, 通过: 70, 及格: 60, 不及格: 50}[
    record.scoreRaw
  ] ?? -1;
}

function bestRecord(records) {
  return records
    .slice()
    .sort((a, b) => comparisonScore(b) - comparisonScore(a))[0];
}

function isGradeThreeEnglish(record) {
  return /^大学英语[ab]\(3\)$/.test(toCourseKey(record.name));
}

function isBasicPhysicsTwo(record) {
  return /^基础物理学[ab]?\(2\)$/.test(toCourseKey(record.name));
}

function isEngineeringPhysicsOne(record) {
  return toCourseKey(record.name) === '工科大学物理(1)';
}

function buildGrade23Assignments(records) {
  const assignments = buildRecognitionAssignments(records);
  const gradeThreeEnglish = bestRecord(
    records.filter((record) => eligibleSpecialRecord(record) && isGradeThreeEnglish(record))
  );
  if (gradeThreeEnglish) {
    assignments.push({
      sourceIds: [gradeThreeEnglish.id],
      sourceName: gradeThreeEnglish.name,
      targetNames: ['英语阅读（1）', '英语写作（1）'],
      targetCodes: [],
      record: gradeThreeEnglish,
      priority: 20,
      reportable: true,
    });
  }

  const basicPhysicsTwo = bestRecord(
    records.filter(
      (record) =>
        eligibleSpecialRecord(record) &&
        isBasicPhysicsTwo(record) &&
        record.scoreType === 'percent'
    )
  );
  const engineeringPhysicsOne = bestRecord(
    records.filter(
      (record) =>
        eligibleSpecialRecord(record) &&
        isEngineeringPhysicsOne(record) &&
        record.scoreType === 'percent'
    )
  );
  if (basicPhysicsTwo && engineeringPhysicsOne) {
    const average = (basicPhysicsTwo.score + engineeringPhysicsOne.score) / 2;
    assignments.push({
      sourceIds: [basicPhysicsTwo.id, engineeringPhysicsOne.id],
      sourceName: `${basicPhysicsTwo.name} + ${engineeringPhysicsOne.name}`,
      targetNames: ['基础物理学A(1)'],
      targetCodes: [],
      record: {
        scoreType: 'percent',
        score: average,
        scoreRaw: String(average),
        passStatus: '',
      },
      priority: 20,
      reportable: true,
    });
  }
  return assignments;
}

function migrateLegacyData(storedData) {
  if (!storedData || typeof storedData !== 'object') return storedData;
  const migrated = {...storedData};
  if (migrated.D && !migrated.D1) migrated.D1 = migrated.D;
  if (migrated.E && !migrated.D2) migrated.D2 = migrated.E;
  delete migrated.D;
  delete migrated.E;
  return migrated;
}

export const grade23Calculator = {
  grade: '23',
  label: '23 级',
  groups: grade23Groups,
  presets: grade23Presets,
  createInitialData() {
    return buildInitialData(grade23Groups, grade23Presets);
  },
  hydrateData(storedData) {
    return mergeStoredData(this.createInitialData(), migrateLegacyData(storedData));
  },
  importTranscript(data, records) {
    return applyImportAssignments(
      data,
      grade23Groups,
      buildGrade23Assignments(records)
    );
  },
  detectGroupChoices(records, currentChoice) {
    return detectRequiredGroupChoice(records, grade23Groups, currentChoice);
  },
  calculate(data, groupChoices) {
    return calculateByGroups(data, grade23Groups, groupChoices);
  },
  getPendingRows(data, groupChoices) {
    return getPendingRows(data, grade23Groups, groupChoices);
  },
};
