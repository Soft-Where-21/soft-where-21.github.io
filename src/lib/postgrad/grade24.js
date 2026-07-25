import {
  applyImportAssignments,
  buildInitialData,
  buildRecognitionAssignments,
  calculateByGroups,
  detectRequiredGroupChoice,
  getPendingRows,
  mergeStoredData,
} from './shared.js';

export const grade24Groups = [
  {
    module: 'I 基础课',
    categories: [
      {id: 'A', name: '数理基础课', requirement: '最低 6 门', minCount: 6},
      {id: 'B', name: '工程基础课', requirement: '最低 4 门', minCount: 4},
      {id: 'C', name: '外语课', requirement: '最低 6 学分', minCredits: 6},
    ],
  },
  {
    module: 'II 通修课',
    categories: [{id: 'D', name: '思政课', requirement: '最低 6 门', minCount: 6}],
  },
  {
    module: 'III 专业课',
    categories: [
      {id: 'E', name: '核心专业类', requirement: '最低 14 门', minCount: 14},
      {
        id: 'F',
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

export const grade24Presets = {
  A: [
    {name: '工科数学分析（1）', credits: 5},
    {name: '工科高等代数', credits: 6},
    {name: '工科数学分析（2）', credits: 5},
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
    {name: '英语阅读（1）', credits: 1},
    {name: '英语写作（1）', credits: 0.5},
    {name: '英语口语（1）', credits: 0.5},
    {name: '英语阅读（2）', credits: 1},
    {name: '英语写作（2）', credits: 0.5},
    {name: '英语口语（2）', credits: 0.5},
    {name: '英语阅读（3）', credits: 1},
    {name: '英语写作（3）', credits: 1},
  ],
  D: [
    {name: '思想道德与法治', credits: 3},
    {name: '习近平新时代中国特色社会主义思想概论', credits: 3},
    {name: '中国近现代史纲要', credits: 3},
    {name: '毛泽东思想和中国特色社会主义理论体系概论', credits: 3},
    {name: '社会实践', credits: 2, scoreType: 'five'},
    {name: '马克思主义基本原理', credits: 3},
  ],
  E: [
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
  F: [
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

export const grade24Calculator = {
  grade: '24',
  label: '24 级',
  groups: grade24Groups,
  presets: grade24Presets,
  createInitialData() {
    return buildInitialData(grade24Groups, grade24Presets);
  },
  hydrateData(storedData) {
    return mergeStoredData(this.createInitialData(), storedData);
  },
  importTranscript(data, records) {
    return applyImportAssignments(
      data,
      grade24Groups,
      buildRecognitionAssignments(records)
    );
  },
  detectGroupChoices(records, currentChoice) {
    return detectRequiredGroupChoice(records, grade24Groups, currentChoice);
  },
  calculate(data, groupChoices) {
    return calculateByGroups(data, grade24Groups, groupChoices);
  },
  getPendingRows(data, groupChoices) {
    return getPendingRows(data, grade24Groups, groupChoices);
  },
};
