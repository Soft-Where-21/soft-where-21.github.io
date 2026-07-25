export const GRADE_OPTIONS = [
  {
    value: '21',
    label: '2021 级',
    pdfUrl: '/file/综测方案-2021.pdf',
  },
  {
    value: '22',
    label: '2022 级',
    pdfUrl: '/file/综测方案-2022.pdf',
  },
];

export const CATEGORY_RULES = [
  {
    id: 'technology',
    label: '科技创新与学术研究',
    shortLabel: '科技创新',
    weight: 0.5,
    cap: 0.2784,
  },
  {
    id: 'discipline',
    label: '学科竞赛',
    shortLabel: '学科竞赛',
    weight: 0.2,
    cap: 0.3132,
  },
  {
    id: 'service',
    label: '社会工作与思想道德',
    shortLabel: '社会工作与思想道德',
    weight: 0.2,
    cap: 0.3132,
  },
  {
    id: 'culture',
    label: '文体活动',
    shortLabel: '文体活动',
    weight: 0.1,
    cap: 0.2784,
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORY_RULES.map((category) => [category.id, category])
);

const ACADEMIC_YEAR_OPTIONS = [
  {value: '1', label: '第 1 学年'},
  {value: '2', label: '第 2 学年'},
  {value: '3', label: '第 3 学年'},
];

const SEMESTER_OPTIONS = Array.from({length: 6}, (_, index) => ({
  value: String(index + 1),
  label: `第 ${index + 1} 学期`,
}));

const AUTHOR_OPTIONS = [
  {value: '1', label: '第一作者'},
  {value: '2', label: '第二作者'},
  {value: '3', label: '第三作者'},
];

const FENGRU_TRACKS = [
  {value: 'main', label: '主赛道制作组 / 论文组'},
  {value: 'philosophy', label: '主赛道哲社组'},
  {value: 'red', label: '红旅赛道'},
  {value: 'industry', label: '产业赛道'},
  {value: 'creative', label: '学生创意赛道'},
  {value: 'valid', label: '有效项目但未获奖'},
];

const FENGRU_AWARDS = {
  main: [
    {value: '1', label: '一等奖'},
    {value: '2', label: '二等奖'},
    {value: '3', label: '三等奖'},
  ],
  philosophy: [
    {value: '1', label: '一等奖'},
    {value: '2', label: '二等奖'},
    {value: '3', label: '三等奖'},
  ],
  red: [
    {value: '1', label: '金奖'},
    {value: '2', label: '银奖'},
    {value: '3', label: '铜奖'},
  ],
  industry: [
    {value: '1', label: '一等奖'},
    {value: '2', label: '二等奖'},
    {value: '3', label: '三等奖'},
  ],
  creative: [
    {value: '0', label: '特等奖'},
    {value: '1', label: '一等奖'},
    {value: '2', label: '二等奖'},
    {value: '3', label: '三等奖'},
  ],
  valid: [{value: 'valid', label: '未获奖'}],
};

const FENGRU_SCORES = {
  main: [
    [0.1392, 0.0522, 0.0174],
    [0.1044, 0.0261, 0.0087],
    [0.0696, 0.0131, 0.0043],
  ],
  red: [
    [0.1044, 0.0261, 0.0087],
    [0.0696, 0.0131, 0.0043],
    [0.0464, 0.0087, 0.0029],
  ],
  industry: [
    [0.0696, 0.0174, 0.0058],
    [0.0522, 0.0087, 0.0029],
    [0.0348, 0.0043, 0.0017],
  ],
  creative: [0.0464, 0.0348, 0.0232, 0.0174],
};

const TECHNOLOGY_SCORE_MATRICES = {
  A: [
    [0.2784, 0.1044, 0.0348],
    [0.2088, 0.0522, 0.0174],
    [0.1392, 0.0261, 0.0087],
  ],
  B: [
    [0.2088, 0.0783, 0.0261],
    [0.1392, 0.0348, 0.0116],
    [0.1044, 0.0196, 0.0065],
  ],
  C: [
    [0.1392, 0.0522, 0.0174],
    [0.1044, 0.0261, 0.0087],
    [0.0696, 0.0131, 0.0043],
  ],
};

const TECHNOLOGY_COMPETITIONS = {
  '21': [
    {value: 'challenge-national', label: '全国挑战杯', scoreClass: 'A'},
    {
      value: 'innovation-national',
      label: '中国国际大学生创新大赛（国家级）',
      scoreClass: 'A',
    },
    {
      value: 'internet-application',
      label: '全国高校互联网应用创新大赛（国家级）',
      scoreClass: 'B',
    },
    {
      value: 'chuangqingchun',
      label: '创青春全国大学生创业大赛（国家级）',
      scoreClass: 'B',
    },
    {
      value: 'asc-champion',
      label: 'ASC 世界大学生超级计算机竞赛（冠亚季军）',
      scoreClass: 'B',
    },
    {value: 'software-cup', label: '中国软件杯（国家级）', scoreClass: 'C'},
    {
      value: 'information-security',
      label: '全国大学生信息安全竞赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'huawei-ai',
      label: '“华为杯”中国大学生智能设计竞赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'innovation-beijing',
      label: '中国国际大学生创新大赛（北京赛区）',
      scoreClass: 'C',
    },
    {value: 'capital-challenge', label: '首都挑战杯', scoreClass: 'C'},
    {
      value: 'jingcai',
      label: '“京彩大创”北京大学生创新创业大赛',
      scoreClass: 'C',
    },
    {
      value: 'software-innovation',
      label: '全国大学生软件创新大赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'zhongwang',
      label: '“中望杯”工业软件大赛（国家级）',
      scoreClass: 'C',
    },
    {value: 'global-innovation', label: '北航全球科创大赛', scoreClass: 'C'},
    {
      value: 'asc-award',
      label: 'ASC 世界大学生超级计算机竞赛（一二三等奖）',
      scoreClass: 'C',
    },
    {
      value: 'college-computer',
      label: '中国高校计算机大赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'computer-design',
      label: '全国大学生计算机设计大赛（国家级）',
      scoreClass: 'C',
    },
  ],
  '22': [
    {value: 'challenge-national', label: '全国挑战杯', scoreClass: 'A'},
    {
      value: 'innovation-national',
      label: '中国国际大学生创新大赛（国家级）',
      scoreClass: 'A',
    },
    {
      value: 'internet-application',
      label: '全国高校互联网应用创新大赛（国家级）',
      scoreClass: 'B',
    },
    {
      value: 'chuangqingchun',
      label: '创青春全国大学生创业大赛（国家级）',
      scoreClass: 'B',
    },
    {
      value: 'asc-champion',
      label: 'ASC 世界大学生超级计算机竞赛（冠亚季军）',
      scoreClass: 'B',
    },
    {value: 'capital-challenge', label: '首都挑战杯', scoreClass: 'B'},
    {
      value: 'innovation-beijing',
      label: '中国国际大学生创新大赛（北京赛区）',
      scoreClass: 'B',
    },
    {
      value: 'software-innovation',
      label: '全国大学生软件创新大赛（国家级）',
      scoreClass: 'B',
    },
    {value: 'software-cup', label: '中国软件杯（国家级）', scoreClass: 'C'},
    {
      value: 'information-security',
      label: '全国大学生信息安全竞赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'huawei-ai',
      label: '“华为杯”中国大学生智能设计竞赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'jingcai',
      label: '“京彩大创”北京大学生创新创业大赛',
      scoreClass: 'C',
    },
    {value: 'global-innovation', label: '北航全球科创大赛', scoreClass: 'C'},
    {
      value: 'asc-award',
      label: 'ASC 世界大学生超级计算机竞赛（一二三等奖）',
      scoreClass: 'C',
    },
    {
      value: 'college-computer',
      label: '中国高校计算机大赛（国家级）',
      scoreClass: 'C',
    },
    {
      value: 'computer-design',
      label: '全国大学生计算机设计大赛（国家级）',
      scoreClass: 'C',
    },
  ],
};

const TECHNOLOGY_RANK_OPTIONS = [
  {value: '1', label: '第一档（一等奖；设特等奖时选特等奖）'},
  {value: '2', label: '第二档'},
  {value: '3', label: '第三档'},
];

const INNOVATION_LEVEL_OPTIONS = [
  {value: 'national', label: '国家级大创'},
  {value: 'city', label: '市级大创'},
  {value: 'school', label: '校级大创'},
];

const INNOVATION_OUTCOMES = {
  national21: [
    {value: 'excellent', label: '优秀'},
    {value: 'good', label: '良好'},
  ],
  national22: [
    {value: 'annual', label: '入围年会'},
    {value: 'excellent', label: '优秀'},
    {value: 'good', label: '良好'},
  ],
  city: [
    {value: 'excellent', label: '优秀'},
    {value: 'good', label: '良好'},
  ],
  school: [{value: 'excellent', label: '优秀'}],
};

const INNOVATION_SCORES = {
  national: {
    annual: [0.2088, 0.0783, 0.0261],
    excellent: [0.1044, 0.0261, 0.0087],
    good: [0.0261, 0, 0],
  },
  city: {
    excellent: [0.0522, 0.013, 0],
    good: [0.013, 0, 0],
  },
  school: {
    excellent: [0.0174, 0.0032, 0],
  },
};

const ACM_LEVEL_OPTIONS = [
  {value: 'ccpc', label: 'CCPC'},
  {value: 'regional', label: 'ICPC 亚洲区域赛'},
  {value: 'ec-final', label: 'EC-Final'},
  {value: 'world-final', label: 'ICPC 全球总决赛'},
];

const MEDAL_OPTIONS = [
  {value: 'gold', label: '金奖'},
  {value: 'silver', label: '银奖'},
  {value: 'bronze', label: '铜奖'},
];

const ACM_SCORES = {
  ccpc: {gold: 0.0773, silver: 0.0619, bronze: 0.0464},
  regional: {gold: 0.116, silver: 0.0928, bronze: 0.0696},
  'ec-final': {gold: 0.174, silver: 0.1392, bronze: 0.1044},
  'world-final': {gold: 0.2784, silver: 0.232, bronze: 0.174},
};

const PAPER_LEVEL_OPTIONS = [
  {value: 'ccf-a', label: 'CCF A 类', score: 0.174},
  {value: 'ccf-b', label: 'CCF B 类', score: 0.1392},
  {value: 'ccf-c', label: 'CCF C 类', score: 0.1276},
  {value: 'sci', label: 'SCI 检索', score: 0.116},
  {value: 'ei-journal', label: 'EI 检索（期刊）', score: 0.0928},
  {value: 'ei-conference', label: 'EI 检索（会议）', score: 0.0464},
];

const DISCIPLINE_COMPETITIONS = {
  '21': [
    {value: 'english', label: '全国大学生英语竞赛'},
    {value: 'math', label: '全国大学生数学竞赛（非数学类）'},
    {value: 'modeling', label: '全国大学生数学建模竞赛'},
    {value: 'physics', label: '全国部分地区大学生物理竞赛（非物理类 A 组）'},
    {value: 'mcm', label: '美国大学生数学建模竞赛'},
    {value: 'fltrp', label: '“外研社·国才杯”全国大学生英语挑战赛'},
    {value: 'systems', label: '全国大学生计算机系统能力大赛（华为毕昇杯）'},
  ],
  '22': [
    {value: 'english', label: '全国大学生英语竞赛'},
    {value: 'math', label: '全国大学生数学竞赛（非数学类）'},
    {value: 'modeling', label: '全国大学生数学建模竞赛'},
    {value: 'physics', label: '全国部分地区大学生物理竞赛（非物理类 A 组）'},
    {value: 'mcm', label: '美国大学生数学建模竞赛'},
    {value: 'fltrp', label: '“外研社·国才杯”全国大学生英语挑战赛'},
    {value: 'systems', label: '全国大学生计算机系统能力大赛（华为毕昇杯）'},
    {value: 'zhongwang', label: '“中望杯”工业软件大赛'},
  ],
};

const DISCIPLINE_LEVEL_OPTIONS = [
  {value: 'national', label: '国家级'},
  {value: 'provincial', label: '省部级'},
  {value: 'school', label: '校级'},
];

const DISCIPLINE_AWARD_OPTIONS = [
  {value: 'special', label: '特等奖'},
  {value: 'first', label: '一等奖'},
  {value: 'second', label: '二等奖'},
  {value: 'third', label: '三等奖'},
];

const MCM_AWARD_OPTIONS = [
  {value: 'outstanding', label: 'Outstanding Winner'},
  {value: 'finalist', label: 'Finalist'},
  {value: 'meritorious', label: 'Meritorious Winner'},
];

const DISCIPLINE_SCORES = {
  national: {special: 0.174, first: 0.1392, second: 0.0696, third: 0.0348},
  provincial: {special: 0.1392, first: 0.0696, second: 0.0348, third: 0.0174},
  school: {special: 0.0696, first: 0.0348, second: 0.0174, third: 0.0087},
};

const MCM_SCORES = {
  outstanding: 0.1392,
  finalist: 0.0696,
  meritorious: 0.0348,
};

const SERVICE_POSITION_OPTIONS = [
  {
    value: 'a',
    label: 'A 类岗位：执行主席团成员 / 学院宣媒中心部长',
    score: 0.0348,
  },
  {
    value: 'b',
    label: 'B 类岗位：部长 / 十佳社团社长 / 大班长等',
    score: 0.0261,
  },
  {
    value: 'c',
    label: 'C 类岗位：副部长 / 班委 / 党支部支委等',
    score: 0.0174,
  },
  {
    value: 'd',
    label: 'D 类岗位：B 类社团社长 / 小班班委 / 学生会干事',
    score: 0.0087,
  },
];

const SERVICE_RATING_OPTIONS = [
  {value: 'outstanding', label: '表现突出', factor: 2},
  {value: 'excellent', label: '优秀', factor: 1.5},
  {value: 'good', label: '良好', factor: 1},
  {value: 'pass', label: '基本合格', factor: 0.5},
  {value: 'fail', label: '不称职', factor: 0},
];

const HONOR_LEVEL_OPTIONS = [
  {value: 'city', label: '市级（含市级以上）'},
  {value: 'school', label: '校级'},
];

const HONOR_OPTIONS = [
  {value: 'three-good', label: '三好学生', city: 0.0261, school: 0.0087},
  {value: 'zhuhang', label: '助航之星', city: null, school: 0.0087},
  {value: 'student-leader', label: '优秀学生干部', city: 0.0464, school: 0.0116},
  {value: 'league-member', label: '优秀团员', city: 0.0348, school: 0.0087},
  {value: 'league-leader', label: '优秀团干部', city: 0.0464, school: 0.0116},
  {value: 'annual-person', label: '大学生年度人物', city: 0.0928, school: 0.0464},
  {value: 'may-fourth', label: '五四奖章', city: 0.0928, school: 0.0464},
  {value: 'volunteer', label: '十佳志愿者', city: 0.0464, school: 0.0232},
];

const SPORTS_LEVEL_OPTIONS = [
  {value: 'city', label: '市级（含市级以上）'},
  {value: 'school', label: '校级'},
];

const SPORTS_PLACEMENT_OPTIONS = [
  {value: 'first', label: '第一名'},
  {value: 'second', label: '第二名'},
  {value: 'third', label: '第三名'},
  {value: 'four-eight', label: '第四至第八名'},
];

const SPORTS_SCORES = {
  city: {first: 0.1392, second: 0.1044, third: 0.0696, 'four-eight': 0.0348},
  school: {first: 0.0696, second: 0.0522, third: 0.0348, 'four-eight': 0.0174},
};

const ART_AWARD_OPTIONS = [
  {value: 'first', label: '一等奖'},
  {value: 'second', label: '二等奖'},
  {value: 'third', label: '三等奖'},
];

const ART_SCORES = {
  city: {first: 0.1392, second: 0.1044, third: 0.0696},
  school: {first: 0.0696, second: 0.0522, third: 0.0348},
};

function selectField(key, label, options, extra = {}) {
  return {key, label, type: 'select', options, ...extra};
}

function textField(key, label, placeholder, extra = {}) {
  return {key, label, type: 'text', placeholder, ...extra};
}

function numberField(key, label, placeholder, extra = {}) {
  return {key, label, type: 'number', placeholder, ...extra};
}

function optionByValue(options, value) {
  return options.find((option) => option.value === value);
}

function fieldOptions(field, values, grade) {
  return typeof field.options === 'function'
    ? field.options(values, grade)
    : field.options || [];
}

function optionLabel(rule, key, values, grade) {
  const field = rule.fields.find((candidate) => candidate.key === key);
  if (!field) return '';
  return optionByValue(fieldOptions(field, values, grade), values[key])?.label || '';
}

function cleanKey(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('zh-CN')
    .replace(/\s+/g, '');
}

function result({
  baseScore = 0,
  factor = 1,
  detail = '',
  dedupeKeys = [],
  constraints = [],
  warnings = [],
}) {
  return {
    baseScore,
    factor,
    rawScore: baseScore * factor,
    detail,
    dedupeKeys,
    constraints,
    warnings,
  };
}

function achievementDedupeKey(value) {
  const normalized = cleanKey(value);
  return normalized ? `technology-achievement:${normalized}` : '';
}

const commonAchievementField = textField(
  'achievement',
  '成果名称',
  '同一成果请填写完全相同的名称'
);

const ITEM_RULES = {
  fengru: {
    id: 'fengru',
    categoryId: 'technology',
    label: '冯如杯',
    fields: [
      selectField('track', '赛道', FENGRU_TRACKS),
      selectField('award', '奖项', (values) => FENGRU_AWARDS[values.track] || []),
      selectField('author', '作者顺序', AUTHOR_OPTIONS, {
        visible: (values) => !['creative', 'valid'].includes(values.track),
      }),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      commonAchievementField,
    ],
    evaluate(values, grade, rule) {
      const track = values.track;
      const authorIndex = Math.max(0, Number(values.author || 1) - 1);
      let baseScore = 0;
      let factor = 1;
      if (track === 'valid') {
        baseScore = 0.0025;
      } else if (track === 'creative') {
        const awardIndex = Number(values.award);
        baseScore = FENGRU_SCORES.creative[awardIndex] || 0;
      } else {
        const scoreTrack = track === 'philosophy' ? 'main' : track;
        const awardIndex = Math.max(0, Number(values.award) - 1);
        baseScore = FENGRU_SCORES[scoreTrack]?.[awardIndex]?.[authorIndex] || 0;
        if (track === 'philosophy') factor = 0.5;
      }
      const achievementKey = achievementDedupeKey(values.achievement);
      return result({
        baseScore,
        factor,
        detail: [
          optionLabel(rule, 'track', values, grade),
          optionLabel(rule, 'award', values, grade),
          optionLabel(rule, 'author', values, grade),
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys: [
          `fengru-year:${values.academicYear}`,
          achievementKey,
        ].filter(Boolean),
      });
    },
  },
  'technology-competition': {
    id: 'technology-competition',
    categoryId: 'technology',
    label: '专业相关科技竞赛',
    fields: [
      selectField(
        'competition',
        '竞赛',
        (_values, grade) => TECHNOLOGY_COMPETITIONS[grade] || []
      ),
      selectField('awardRank', '奖项档次', TECHNOLOGY_RANK_OPTIONS),
      selectField('author', '作者顺序', AUTHOR_OPTIONS),
      selectField('specialTrack', '成果类型', [
        {value: 'regular', label: '常规赛道'},
        {value: 'special', label: '经认定的专项赛道'},
      ]),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      commonAchievementField,
    ],
    evaluate(values, grade, rule) {
      const competitions = TECHNOLOGY_COMPETITIONS[grade] || [];
      const competition = optionByValue(competitions, values.competition);
      const awardIndex = Math.max(0, Number(values.awardRank) - 1);
      const authorIndex = Math.max(0, Number(values.author) - 1);
      const matrix =
        TECHNOLOGY_SCORE_MATRICES[competition?.scoreClass] ||
        TECHNOLOGY_SCORE_MATRICES.C;
      let baseScore = matrix[awardIndex]?.[authorIndex] || 0;
      let factor = 1;
      if (values.specialTrack === 'special') {
        baseScore = matrix[awardIndex]?.[0] || 0;
        factor = authorIndex === 0 ? 0.5 : 1 / 3;
      }
      return result({
        baseScore,
        factor,
        detail: [
          competition?.label,
          optionLabel(rule, 'awardRank', values, grade),
          optionLabel(rule, 'author', values, grade),
          values.specialTrack === 'special' ? '专项赛道' : '',
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys: [achievementDedupeKey(values.achievement)].filter(Boolean),
      });
    },
  },
  innovation: {
    id: 'innovation',
    categoryId: 'technology',
    label: '大创项目',
    fields: [
      selectField('level', '项目级别', INNOVATION_LEVEL_OPTIONS),
      selectField('outcome', '结题结果', (values, grade) => {
        if (values.level === 'national') {
          return grade === '22'
            ? INNOVATION_OUTCOMES.national22
            : INNOVATION_OUTCOMES.national21;
        }
        return INNOVATION_OUTCOMES[values.level] || [];
      }),
      selectField('author', '作者顺序', AUTHOR_OPTIONS),
      selectField('academicYear', '认定学年', ACADEMIC_YEAR_OPTIONS),
      commonAchievementField,
    ],
    evaluate(values, grade, rule) {
      const authorIndex = Math.max(0, Number(values.author) - 1);
      const baseScore =
        INNOVATION_SCORES[values.level]?.[values.outcome]?.[authorIndex] || 0;
      return result({
        baseScore,
        detail: [
          optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'outcome', values, grade),
          optionLabel(rule, 'author', values, grade),
        ].join(' · '),
        dedupeKeys: [
          'innovation-undergraduate',
          achievementDedupeKey(values.achievement),
        ].filter(Boolean),
      });
    },
  },
  acm: {
    id: 'acm',
    categoryId: 'technology',
    label: 'ACM 竞赛',
    fields: [
      selectField('level', '赛事', ACM_LEVEL_OPTIONS),
      selectField('medal', '奖牌', MEDAL_OPTIONS),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
    ],
    evaluate(values, grade, rule) {
      const baseScore = ACM_SCORES[values.level]?.[values.medal] || 0;
      return result({
        baseScore,
        detail: [
          optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'medal', values, grade),
        ].join(' · '),
        dedupeKeys: ['acm-undergraduate'],
      });
    },
  },
  paper: {
    id: 'paper',
    categoryId: 'technology',
    label: '发表学术论文',
    fields: [
      selectField('level', '论文级别', PAPER_LEVEL_OPTIONS),
      selectField(
        'authorship',
        '署名方式',
        (_values, grade) => [
          {value: 'first', label: '第一作者'},
          {value: 'second', label: '第二作者（第一作者为软件学院教师）'},
          ...(grade === '22'
            ? [{value: 'cofirst', label: '共同一作'}]
            : []),
        ]
      ),
      numberField('coauthorCount', '共同一作人数', '人数', {
        min: 1,
        max: 20,
        step: 1,
        default: '2',
        visible: (values) => values.authorship === 'cofirst',
      }),
      textField('paperName', '论文名称', '用于区分不同论文'),
    ],
    evaluate(values, grade, rule) {
      const level = optionByValue(PAPER_LEVEL_OPTIONS, values.level);
      const coauthorCount = Math.max(1, Number(values.coauthorCount) || 1);
      const factor = values.authorship === 'cofirst' ? 1 / coauthorCount : 1;
      return result({
        baseScore: level?.score || 0,
        factor,
        detail: [
          level?.label,
          optionLabel(rule, 'authorship', values, grade),
          values.authorship === 'cofirst' ? `${coauthorCount} 人共同一作` : '',
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys:
          grade === '22' && values.authorship === 'cofirst'
            ? ['paper-cofirst']
            : [],
      });
    },
  },
  discipline: {
    id: 'discipline',
    categoryId: 'discipline',
    label: '学科竞赛',
    fields: [
      selectField(
        'competition',
        '竞赛',
        (_values, grade) => DISCIPLINE_COMPETITIONS[grade] || []
      ),
      selectField('level', '竞赛级别', DISCIPLINE_LEVEL_OPTIONS, {
        visible: (values) => values.competition !== 'mcm',
      }),
      selectField(
        'award',
        '奖项',
        (values) =>
          values.competition === 'mcm'
            ? MCM_AWARD_OPTIONS
            : DISCIPLINE_AWARD_OPTIONS
      ),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
    ],
    evaluate(values, grade, rule) {
      const competition = optionByValue(
        DISCIPLINE_COMPETITIONS[grade] || [],
        values.competition
      );
      const isMcm = values.competition === 'mcm';
      const baseScore = isMcm
        ? MCM_SCORES[values.award] || 0
        : DISCIPLINE_SCORES[values.level]?.[values.award] || 0;
      return result({
        baseScore,
        detail: [
          competition?.label,
          isMcm ? '' : optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'award', values, grade),
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys: [`discipline-competition:${values.competition}`],
        constraints: [
          {
            kind: 'cap',
            key: `discipline-year:${values.academicYear}`,
            cap: 0.174,
            label: `${optionLabel(rule, 'academicYear', values, grade)}学科竞赛`,
          },
        ],
      });
    },
  },
  'service-position': {
    id: 'service-position',
    categoryId: 'service',
    label: '社会工作岗位',
    fields: [
      selectField('position', '岗位', SERVICE_POSITION_OPTIONS),
      selectField('rating', '考评等级', SERVICE_RATING_OPTIONS),
      selectField('semester', '任职学期', SEMESTER_OPTIONS),
    ],
    evaluate(values, grade, rule) {
      const position = optionByValue(SERVICE_POSITION_OPTIONS, values.position);
      const rating = optionByValue(SERVICE_RATING_OPTIONS, values.rating);
      const semesterLabel = optionLabel(rule, 'semester', values, grade);
      const key = `service-semester:${values.semester}`;
      return result({
        baseScore: position?.score || 0,
        factor: rating?.factor ?? 0,
        detail: [position?.label, rating?.label, semesterLabel]
          .filter(Boolean)
          .join(' · '),
        constraints: [
          {
            kind: 'topN',
            key,
            count: 2,
            label: `${semesterLabel}社会工作岗位`,
          },
          {
            kind: 'cap',
            key,
            cap: 0.0696,
            label: `${semesterLabel}社会工作岗位`,
          },
        ],
      });
    },
  },
  'collective-honor': {
    id: 'collective-honor',
    categoryId: 'service',
    label: '先进集体称号',
    fields: [
      selectField('level', '称号级别', HONOR_LEVEL_OPTIONS),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      textField('collectiveName', '集体名称', '同一集体请填写完全相同的名称'),
    ],
    evaluate(values, grade, rule) {
      const baseScore = values.level === 'city' ? 0.0232 : 0.0116;
      const collective = cleanKey(values.collectiveName);
      return result({
        baseScore,
        detail: [
          optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'academicYear', values, grade),
        ].join(' · '),
        dedupeKeys: collective
          ? [`collective:${values.academicYear}:${collective}`]
          : [],
      });
    },
  },
  'individual-honor': {
    id: 'individual-honor',
    categoryId: 'service',
    label: '个人先进称号',
    fields: [
      selectField('level', '称号级别', HONOR_LEVEL_OPTIONS),
      selectField(
        'honor',
        '荣誉称号',
        (values) =>
          HONOR_OPTIONS.filter((honor) => honor[values.level] != null)
      ),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
    ],
    evaluate(values, grade, rule) {
      const honor = optionByValue(HONOR_OPTIONS, values.honor);
      const constraints =
        values.level === 'school'
          ? [
              {
                kind: 'topN',
                key: `school-honor-year:${values.academicYear}`,
                count: 2,
                label: `${optionLabel(rule, 'academicYear', values, grade)}校级个人先进称号`,
              },
            ]
          : [];
      return result({
        baseScore: honor?.[values.level] || 0,
        detail: [
          optionLabel(rule, 'level', values, grade),
          honor?.label,
          optionLabel(rule, 'academicYear', values, grade),
        ]
          .filter(Boolean)
          .join(' · '),
        constraints,
      });
    },
  },
  volunteering: {
    id: 'volunteering',
    categoryId: 'service',
    label: '志愿服务时长',
    fields: [
      numberField('hours', '认证服务时长', '小时', {
        min: 0,
        max: 10000,
        step: 0.5,
        default: '50',
        suffix: '小时',
      }),
    ],
    evaluate(values) {
      const hours = Math.max(0, Number(values.hours) || 0);
      let baseScore = 0;
      if (hours >= 50 && hours < 100) {
        baseScore = 0.0116;
      } else if (hours >= 100 && hours <= 200) {
        baseScore = 0.0232;
      } else if (hours > 200) {
        baseScore = Math.min(
          0.0464,
          0.0232 + Math.floor((hours - 200) / 50) * 0.0058
        );
      }
      return result({
        baseScore,
        detail: `${hours} 小时`,
        dedupeKeys: ['volunteering-total'],
        warnings: hours > 200 && hours < 250
          ? ['超过 200 小时后，每满 50 小时才增加 0.0058。']
          : [],
      });
    },
  },
  'social-practice': {
    id: 'social-practice',
    categoryId: 'service',
    label: '社会实践',
    fields: [
      selectField('achievementType', '认定类型', [
        {value: 'individual', label: '校级及以上先进个人 / 先进工作者', score: 0.0116},
        {
          value: 'team',
          label: '校级及以上优秀实践队主要材料准备者 / 答辩者',
          score: 0.0086,
        },
      ]),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      textField('projectName', '实践项目', '同一项目请填写完全相同的名称'),
    ],
    evaluate(values, grade, rule) {
      const type = optionByValue(
        fieldOptions(rule.fields[0], values, grade),
        values.achievementType
      );
      const project = cleanKey(values.projectName);
      return result({
        baseScore: type?.score || 0,
        detail: [
          type?.label,
          optionLabel(rule, 'academicYear', values, grade),
        ].join(' · '),
        dedupeKeys: project
          ? [`social-practice:${values.academicYear}:${project}`]
          : [],
      });
    },
  },
  sports: {
    id: 'sports',
    categoryId: 'culture',
    label: '体育活动',
    fields: [
      selectField('level', '赛事级别', SPORTS_LEVEL_OPTIONS),
      selectField('placement', '名次', SPORTS_PLACEMENT_OPTIONS),
      selectField('projectType', '项目类别', [
        {value: 'standard', label: '学院代表队 / 田径项目', factor: 1},
        {value: 'mass', label: '定向越野 / 毽绳 / 棋类 / 游泳等', factor: 0.8},
      ]),
      selectField('form', '参赛形式', [
        {value: 'individual', label: '个人项目', factor: 1},
        {value: 'team', label: '集体项目', factor: 0.5},
      ]),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      textField('projectName', '比赛项目', '同一项目请填写完全相同的名称'),
    ],
    evaluate(values, grade, rule) {
      const projectType = optionByValue(
        fieldOptions(rule.fields[2], values, grade),
        values.projectType
      );
      const form = optionByValue(
        fieldOptions(rule.fields[3], values, grade),
        values.form
      );
      const baseScore =
        SPORTS_SCORES[values.level]?.[values.placement] || 0;
      const project = cleanKey(values.projectName);
      return result({
        baseScore,
        factor: (projectType?.factor || 0) * (form?.factor || 0),
        detail: [
          optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'placement', values, grade),
          projectType?.label,
          form?.label,
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys: project
          ? [`culture-project:${values.academicYear}:${project}`]
          : [],
      });
    },
  },
  arts: {
    id: 'arts',
    categoryId: 'culture',
    label: '文艺活动',
    fields: [
      selectField('level', '活动级别', SPORTS_LEVEL_OPTIONS),
      selectField('award', '奖项', ART_AWARD_OPTIONS),
      selectField('form', '节目形式', [
        {value: 'individual', label: '个人项目', factor: 1},
        {value: 'team', label: '集体项目', factor: 0.5},
      ]),
      selectField('academicYear', '获奖学年', ACADEMIC_YEAR_OPTIONS),
      textField('projectName', '活动项目', '同一项目请填写完全相同的名称'),
    ],
    evaluate(values, grade, rule) {
      const form = optionByValue(
        fieldOptions(rule.fields[2], values, grade),
        values.form
      );
      const baseScore = ART_SCORES[values.level]?.[values.award] || 0;
      const project = cleanKey(values.projectName);
      return result({
        baseScore,
        factor: form?.factor || 0,
        detail: [
          optionLabel(rule, 'level', values, grade),
          optionLabel(rule, 'award', values, grade),
          form?.label,
        ]
          .filter(Boolean)
          .join(' · '),
        dedupeKeys: project
          ? [`culture-project:${values.academicYear}:${project}`]
          : [],
      });
    },
  },
};

function manualRule(categoryId, label, fields = []) {
  return {
    id: `manual-${categoryId}`,
    categoryId,
    label: `${label}（审核认定）`,
    manual: true,
    fields: [
      textField('name', '加分项名称', '填写评审认定的项目名称'),
      numberField('score', '认定原始分', '0.0000', {
        min: 0,
        max: 10,
        step: 0.0001,
        default: '',
      }),
      ...fields,
    ],
    evaluate(values, grade, rule) {
      const constraints =
        categoryId === 'discipline'
          ? [
              {
                kind: 'cap',
                key: `discipline-year:${values.academicYear}`,
                cap: 0.174,
                label: `${optionLabel(rule, 'academicYear', values, grade)}学科竞赛`,
              },
            ]
          : [];
      const manualName = cleanKey(values.name);
      return result({
        baseScore: Math.max(0, Number(values.score) || 0),
        detail: values.name || '审核认定项',
        dedupeKeys:
          categoryId === 'discipline' && manualName
            ? [`discipline-manual:${manualName}`]
            : [],
        constraints,
        warnings: ['该分值由用户按评审结果手动填写。'],
      });
    },
  };
}

Object.assign(ITEM_RULES, {
  'manual-technology': manualRule('technology', '科技创新'),
  'manual-discipline': manualRule('discipline', '学科竞赛', [
    selectField('academicYear', '认定学年', ACADEMIC_YEAR_OPTIONS),
  ]),
  'manual-service': manualRule('service', '社会工作与思想道德'),
  'manual-culture': manualRule('culture', '文体活动'),
});

export const ITEM_RULE_ORDER = [
  'fengru',
  'technology-competition',
  'innovation',
  'acm',
  'paper',
  'manual-technology',
  'discipline',
  'manual-discipline',
  'service-position',
  'collective-honor',
  'individual-honor',
  'volunteering',
  'social-practice',
  'manual-service',
  'sports',
  'arts',
  'manual-culture',
];

export function getItemRule(kind) {
  return ITEM_RULES[kind] || null;
}

export function getItemRulesForCategory(categoryId) {
  return ITEM_RULE_ORDER.map((kind) => ITEM_RULES[kind]).filter(
    (rule) => rule?.categoryId === categoryId
  );
}

export function getFieldOptions(field, values, grade) {
  return fieldOptions(field, values, grade);
}

export function isFieldVisible(field, values, grade) {
  return field.visible ? field.visible(values, grade) : true;
}

export function normalizeItemValues(kind, values, grade) {
  const rule = getItemRule(kind);
  if (!rule) return values;
  const normalized = {...values};
  rule.fields.forEach((field) => {
    if (field.type !== 'select') return;
    const options = getFieldOptions(field, normalized, grade);
    if (!options.some((option) => option.value === normalized[field.key])) {
      normalized[field.key] = options[0]?.value || '';
    }
  });
  return normalized;
}

export function createComprehensiveItem(kind, id, grade) {
  const rule = getItemRule(kind);
  if (!rule) throw new Error(`Unknown comprehensive item kind: ${kind}`);
  const values = {};
  rule.fields.forEach((field) => {
    if (field.default != null) {
      values[field.key] = String(field.default);
      return;
    }
    if (field.type === 'select') {
      values[field.key] = getFieldOptions(field, values, grade)[0]?.value || '';
      return;
    }
    values[field.key] = '';
  });
  return {
    id,
    kind,
    categoryId: rule.categoryId,
    values: normalizeItemValues(kind, values, grade),
  };
}

export function evaluateComprehensiveItem(item, grade) {
  const rule = getItemRule(item.kind);
  if (!rule) {
    return {
      baseScore: 0,
      factor: 1,
      rawScore: 0,
      detail: '未知加分项',
      dedupeKeys: [],
      constraints: [],
      warnings: ['该加分项已不受当前规则支持。'],
    };
  }
  const values = normalizeItemValues(item.kind, item.values || {}, grade);
  return rule.evaluate(values, grade, rule);
}
