import React, {useEffect, useMemo, useState} from 'react';

const STORAGE_KEY = 'tool:postgrad:data:v10';

const FIVE_LEVEL_OPTIONS = [
  {label: '优秀', value: 'excellent', gp: 4},
  {label: '良好', value: 'good', gp: 3.5},
  {label: '中等', value: 'medium', gp: 2.8},
  {label: '及格', value: 'pass', gp: 1.7},
  {label: '不及格', value: 'fail', gp: 0},
];

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map((row) => {
    let name = row.name;
    if (name === '基础物理学（1）（2）') name = '基础物理学（1）';
    if (name === '基础物理实验（1）（2）') name = '基础物理实验（1）';
    const scoreType =
      name === '社会实践' ? 'five' : row.scoreType ? row.scoreType : 'percent';
    return {...row, name, scoreType};
  });
}

function normalizeGradeData(gradeData) {
  if (!gradeData || typeof gradeData !== 'object') return gradeData;
  const next = {...gradeData};
  Object.keys(next).forEach((key) => {
    next[key] = normalizeRows(next[key]);
  });
  return next;
}

const CATEGORY_GROUPS_BY_GRADE = {
  '23': [
    {
      module: 'I 基础课',
      categories: [
        {id: 'A', name: '数理基础课', requirement: '最低 6 门', minCount: 6},
        {id: 'B', name: '工程基础课', requirement: '最低 4 门', minCount: 4},
        {
          id: 'C',
          name: '外语课',
          requirement: '英语阅读/写作必修 + 大英A(1)(2) 或 大英B(1)(2)',
          requiredMode: 'score',
          requiredNames: ['英语阅读（1）', '英语写作（1）'],
          requiredGroups: [
            {
              id: 'A',
              label: '大学英语A（1）（2）',
              names: ['大学英语A（1）', '大学英语A（2）'],
            },
            {
              id: 'B',
              label: '大学英语B（1）（2）',
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
          requirement: '前 7 门择优 1 门，后 3 门必修',
          minCount: 1,
          selectable: true,
          requiredMode: 'score',
          optionalNames: [
            '电子信息工程导论',
            '自动化科学与电气工程导论',
            '计算机导论与伦理学',
            '仪器科学概论',
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
          requirement: '含方向课 6 学分（≥6 学分部分） 指定 4 门',
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
  ],
  '24': [
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
          requirement: '含方向课 6 学分（≥6 学分部分） 指定 4 门',
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
  ],
};

const COURSE_PRESETS = {
  '23': {
    A: [
      {name: '工科数学分析（1）', credits: 6},
      {name: '工科高等代数', credits: 6},
      {name: '工科数学分析（2）', credits: 6},
      {name: '基础物理学（1）', credits: 4},
      {name: '概率统计A', credits: 3},
      {name: '基础物理实验（1）', credits: 1},
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
      {name: '英语阅读（1）', credits: 1},
      {name: '英语写作（1）', credits: 1},
    ],
    D1: [
      {name: '思想道德与法治', credits: 3},
      {name: '习近平新时代中国特色社会主义思想概论', credits: 3},
      {name: '中国近现代史纲要', credits: 3},
      {name: '毛泽东思想和中国特色社会主义理论体系概论', credits: 3},
      {name: '社会实践', credits: 2, scoreType: 'five'},
      {name: '马克思主义基本原理', credits: 3},
      {name: '形势与政策（1）', credits: 0.2},
      {name: '形势与政策（2）', credits: 0.3},
      {name: '形势与政策（3）', credits: 0.2},
      {name: '形势与政策（4）', credits: 0.3},
      {name: '形势与政策（5）', credits: 0.2},
      {name: '形势与政策（6）', credits: 0.3},
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
      {name: '仪器科学概论', credits: 1.5},
      {name: '走进软件', credits: 1.5},
      {name: '网络空间安全导论', credits: 1.5},
      {name: '集成电路导论', credits: 1.5},
      {name: '航空航天概论B', credits: 1.5},
      {name: '经济管理', credits: 2},
      {name: '互联网软件创新创意创业', credits: 1.5},
    ],
    H: [],
    'I-2': [
      {name: '素质教育（博雅课程）（1）', credits: 0.2},
      {name: '素质教育（博雅课程）（2）', credits: 0.3},
      {name: '素质教育（博雅课程）（3）', credits: 0.2},
      {name: '素质教育（博雅课程）（4）', credits: 0.3},
      {name: '素质教育（博雅课程）（5）', credits: 0.2},
      {name: '素质教育（博雅课程）（6）', credits: 0.3},
    ],
    'I-3': [
      {name: '离散数学（1）', credits: 2},
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
  },
  '24': {
    A: [
      {name: '工科数学分析（1）', credits: 5},
      {name: '工科高等代数', credits: 6},
      {name: '工科数学分析（2）', credits: 5},
      {name: '基础物理学（1）', credits: 4},
      {name: '概率统计A', credits: 3},
      {name: '基础物理实验（1）', credits: 1},
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
      {name: '离散数学（1）', credits: 2},
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
  },
};

function getCategoryGroups(grade) {
  return CATEGORY_GROUPS_BY_GRADE[grade] || CATEGORY_GROUPS_BY_GRADE['23'];
}

function scoreToGp(score) {
  if (!Number.isFinite(score)) return null;
  if (score < 60) return 0;
  const x = Math.min(100, Math.max(60, score));
  return 4 - (3 * Math.pow(100 - x, 2)) / 1600;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}

function isFilledScore(row) {
  return String(row.score || '').trim() !== '';
}

function isCountable(row) {
  return row.scoreType !== 'five' && row.scoreType !== 'passfail';
}

function getRowGpa(row, baseAvgGpa) {
  if (row.scoreType === 'five') {
    const found = FIVE_LEVEL_OPTIONS.find((opt) => opt.value === row.score);
    if (found) return found.gp;
    return baseAvgGpa;
  }
  const scoreNum = Number(row.score);
  if (Number.isFinite(scoreNum)) return scoreToGp(scoreNum);
  return baseAvgGpa;
}

function selectTopByCredits(rows, targetCredits, baseAvgGpa) {
  const candidates = rows
    .map((row) => ({
      row,
      gpa: getRowGpa(row, baseAvgGpa),
    }))
    .filter((item) => Number.isFinite(item.gpa));

  candidates.sort((a, b) => b.gpa - a.gpa);

  const selected = new Set();
  let credits = 0;
  let qp = 0;
  for (const item of candidates) {
    if (credits >= targetCredits) break;
    const c = Number(item.row.credits) || 0;
    selected.add(item.row.id);
    credits += c;
    qp += c * (item.gpa ?? 0);
  }
  return {selected, credits, qp};
}

function selectTopByCount(rows, targetCount, baseAvgGpa) {
  const candidates = rows
    .map((row) => ({
      row,
      gpa: getRowGpa(row, baseAvgGpa),
    }))
    .filter((item) => Number.isFinite(item.gpa));

  candidates.sort((a, b) => b.gpa - a.gpa);

  const selected = new Set();
  let count = 0;
  let credits = 0;
  let qp = 0;
  for (const item of candidates) {
    if (count >= targetCount) break;
    const c = Number(item.row.credits) || 0;
    selected.add(item.row.id);
    count += 1;
    credits += c;
    qp += c * (item.gpa ?? 0);
  }
  return {selected, count, credits, qp};
}

function buildRowsFromEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return [];
  return entries.map((entry, index) => ({
    id: index + 1,
    name: entry.name,
    credits: entry.credits,
    score: '',
    passStatus: '',
    selected: false,
    scoreType: entry.scoreType || 'percent',
  }));
}

function buildInitialDataForGrade(grade) {
  const data = {};
  const presets = COURSE_PRESETS[grade] || {};
  const groups = getCategoryGroups(grade);
  groups.forEach((group) => {
    group.categories.forEach((cat) => {
      const rows = buildRowsFromEntries(presets[cat.id]);
      const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
      if (!cat.selectable) {
        rows.forEach((row) => {
          row.selected = true;
        });
      } else if (Array.isArray(cat.requiredNames)) {
        rows.forEach((row) => {
          row.selected = cat.requiredNames.includes(row.name);
        });
      }
      if (cat.requiredMode === 'passfail' && requiredNames.length) {
        rows.forEach((row) => {
          if (requiredNames.includes(row.name)) {
            row.scoreType = 'passfail';
          }
        });
      }
      data[cat.id] = rows;
    });
  });
  return data;
}

function normalizeDataByGroups(gradeData, groups) {
  if (!gradeData || typeof gradeData !== 'object') return gradeData;
  const next = {...gradeData};
  groups.forEach((group) => {
    group.categories.forEach((cat) => {
      const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
      if (cat.requiredMode !== 'passfail' || !requiredNames.length) return;
      const rows = next[cat.id];
      if (!Array.isArray(rows)) return;
      next[cat.id] = rows.map((row) =>
        requiredNames.includes(row.name) ? {...row, scoreType: 'passfail'} : row
      );
    });
  });
  return next;
}

export default function PostgradTool() {
  const [grade, setGrade] = useState('23');
  const [dataByGrade, setDataByGrade] = useState(() => ({
    '23': buildInitialDataForGrade('23'),
    '24': buildInitialDataForGrade('24'),
  }));
  const [groupChoiceByGrade, setGroupChoiceByGrade] = useState(() => ({
    '23': {},
    '24': {},
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed['23'] && typeof parsed['23'] === 'object') {
          if (parsed['23'].D && !parsed['23'].D1) parsed['23'].D1 = parsed['23'].D;
          if (parsed['23'].E && !parsed['23'].D2) parsed['23'].D2 = parsed['23'].E;
          delete parsed['23'].D;
          delete parsed['23'].E;
          parsed['23'] = normalizeGradeData(parsed['23']);
          parsed['23'] = normalizeDataByGroups(parsed['23'], getCategoryGroups('23'));
        }
        if (parsed['24'] && typeof parsed['24'] === 'object') {
          parsed['24'] = normalizeGradeData(parsed['24']);
          parsed['24'] = normalizeDataByGroups(parsed['24'], getCategoryGroups('24'));
        }
        setDataByGrade((prev) => ({
          '23': parsed['23'] || prev['23'],
          '24': parsed['24'] || prev['24'],
        }));
      }
    } catch (e) {
      // ignore broken cache
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('tool:postgrad:groups:v1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setGroupChoiceByGrade((prev) => ({
          '23': parsed['23'] || prev['23'],
          '24': parsed['24'] || prev['24'],
        }));
      }
    } catch (e) {
      // ignore broken cache
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataByGrade));
    } catch (e) {
      // ignore storage errors
    }
  }, [dataByGrade]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        'tool:postgrad:groups:v1',
        JSON.stringify(groupChoiceByGrade)
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [groupChoiceByGrade]);

  const currentData = dataByGrade[grade];
  const groups = getCategoryGroups(grade);

  const baseAvgGpa = useMemo(() => {
    let totalCredits = 0;
    let totalQp = 0;
    Object.values(currentData).forEach((rows) => {
      rows.forEach((row) => {
        if (!isFilledScore(row) || !isCountable(row)) return;
        const gp = getRowGpa(row, 0);
        if (gp === null) return;
        const credits = Number(row.credits) || 0;
        totalCredits += credits;
        totalQp += gp * credits;
      });
    });
    if (totalCredits <= 0) return 0;
    return totalQp / totalCredits;
  }, [currentData]);

  function updateRows(categoryId, updater) {
    setDataByGrade((prev) => {
      const next = {...prev};
      next[grade] = {...next[grade], [categoryId]: updater(next[grade][categoryId])};
      return next;
    });
  }

  function updateRow(categoryId, id, patch) {
    updateRows(categoryId, (rows) =>
      rows.map((row) => (row.id === id ? {...row, ...patch} : row))
    );
  }

  function computeSelectable(rows, cat) {
    const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
    const requiredMode = cat.requiredMode || 'passfail';
    const optionalNames = Array.isArray(cat.optionalNames) ? cat.optionalNames : null;
    const requiredRows = rows.filter((r) => requiredNames.includes(r.name));
    const requiredOk =
      requiredMode === 'passfail'
        ? requiredRows.every((r) => r.passStatus === 'pass')
        : requiredRows.every((r) => isFilledScore(r));
    const requiredIncluded = new Set(
      requiredMode === 'passfail'
        ? requiredRows.filter((r) => r.passStatus === 'pass').map((r) => r.id)
        : requiredRows.filter((r) => isFilledScore(r)).map((r) => r.id)
    );

    const optionalRows = rows.filter((r) => {
      if (requiredNames.includes(r.name)) return false;
      if (!r.selected) return false;
      if (!isFilledScore(r)) return false;
      if (optionalNames) return optionalNames.includes(r.name);
      return true;
    });

    const targetCount = typeof cat.minCount === 'number' ? cat.minCount : 0;
    const targetCredits = typeof cat.minCredits === 'number' ? cat.minCredits : 0;
    const picked =
      targetCount > 0
        ? selectTopByCount(optionalRows, targetCount, baseAvgGpa)
        : selectTopByCredits(optionalRows, targetCredits, baseAvgGpa);

    const requiredCredits =
      requiredMode === 'passfail'
        ? 0
        : requiredRows
            .filter((r) => isFilledScore(r))
            .reduce((s, r) => s + (Number(r.credits) || 0), 0);
    const requiredQp =
      requiredMode === 'passfail'
        ? 0
        : requiredRows
            .filter((r) => isFilledScore(r))
            .reduce((s, r) => {
              const gp = getRowGpa(r, baseAvgGpa);
              return s + (Number(r.credits) || 0) * (gp ?? 0);
            }, 0);

    const included = new Set([...requiredIncluded, ...picked.selected]);
    const hasEnough =
      targetCount > 0 ? picked.count >= targetCount : picked.credits >= targetCredits;
    const ok = requiredOk && hasEnough;
    return {
      included,
      ok,
      credits: requiredCredits + picked.credits,
      qp: requiredQp + picked.qp,
    };
  }

function computeRequiredGroups(rows, cat, baseAvgGpa, selectedGroupId) {
  const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
  const requiredGroups = Array.isArray(cat.requiredGroups) ? cat.requiredGroups : [];
  const requiredRows = rows.filter((r) => requiredNames.includes(r.name));
  const requiredOk = requiredRows.every((r) => isFilledScore(r));
  const selectedGroup = requiredGroups.find((g) => g.id === selectedGroupId);
  const groupRows = selectedGroup
    ? rows.filter((r) => selectedGroup.names.includes(r.name))
    : [];
  const groupOk = selectedGroup ? groupRows.every((r) => isFilledScore(r)) : false;

    const includedRows = [
      ...requiredRows.filter((r) => isFilledScore(r) && isCountable(r)),
      ...groupRows.filter((r) => isFilledScore(r) && isCountable(r)),
    ];
  const included = new Set(includedRows.map((r) => r.id));
    const credits = includedRows.reduce((s, r) => s + (Number(r.credits) || 0), 0);
    const qp = includedRows.reduce((s, r) => {
      const gp = getRowGpa(r, baseAvgGpa);
      return s + (Number(r.credits) || 0) * (gp ?? 0);
    }, 0);

  const ok = requiredOk && groupOk;
  return {included, ok, credits, qp};
}

  const computed = useMemo(() => {
    const categoryResults = {};
    let totalCredits = 0;
    let totalQp = 0;
    let allOk = true;

    groups.forEach((group) => {
      group.categories.forEach((cat) => {
        const rows = currentData[cat.id] || [];
        if (cat.requiredGroups) {
          const selectedGroupId = groupChoiceByGrade[grade]?.[cat.id];
          const best = computeRequiredGroups(rows, cat, baseAvgGpa, selectedGroupId);
          categoryResults[cat.id] = best;
          totalCredits += best.credits;
          totalQp += best.qp;
          if (!best.ok) {
            allOk = false;
          }
        } else if (cat.selectable) {
          const best = computeSelectable(rows, cat);
          categoryResults[cat.id] = best;
          totalCredits += best.credits;
          totalQp += best.qp;
          if (!best.ok) {
            allOk = false;
          }
        } else {
          const minCount = typeof cat.minCount === 'number' ? cat.minCount : rows.length;
          const minCredits = typeof cat.minCredits === 'number' ? cat.minCredits : 0;
          const filledRows = rows.filter((r) => isFilledScore(r));
          const filledCredits = filledRows.reduce((s, r) => s + (Number(r.credits) || 0), 0);
          const countOk = filledRows.length >= minCount;
          const creditsOk = filledCredits >= minCredits;
          const isOk = countOk && creditsOk;

          const countableRows = filledRows.filter((r) => isCountable(r));
          const credits = countableRows.reduce((s, r) => s + (Number(r.credits) || 0), 0);
          const qp = countableRows.reduce((s, r) => {
            const gp = getRowGpa(r, baseAvgGpa);
            return s + (Number(r.credits) || 0) * (gp ?? 0);
          }, 0);

          const includedSet = new Set(
            rows.filter((r) => isFilledScore(r) && isCountable(r)).map((r) => r.id)
          );
          categoryResults[cat.id] = {
            included: includedSet,
            ok: isOk,
            credits,
            qp,
          };
          totalCredits += credits;
          totalQp += qp;
          if (!isOk) {
            allOk = false;
          }
        }
      });
    });

    const avg = totalCredits > 0 ? totalQp / totalCredits : 0;
    return {categoryResults, totalCredits, avg, allOk};
  }, [currentData, groups, baseAvgGpa, groupChoiceByGrade, grade]);

  function clearCurrentGrade() {
    setDataByGrade((prev) => {
      const next = {...prev};
      const cleared = {};
      const gradeGroups = getCategoryGroups(grade);
      gradeGroups.forEach((group) => {
        group.categories.forEach((cat) => {
          const rows = next[grade][cat.id] || [];
          const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
          cleared[cat.id] = rows.map((row) => {
            const isRequired = requiredNames.includes(row.name);
            return {
              ...row,
              score: '',
              passStatus: '',
              selected: cat.selectable ? isRequired : true,
            };
          });
        });
      });
      next[grade] = cleared;
      return next;
    });
  }

  return (
    <div style={{padding: 18}}>
      <div style={{marginBottom: 12, fontSize: '0.85rem', opacity: 0.65, lineHeight: 1.6}}>
        说明：左侧勾选表示“是否选修该课程”，保研成绩由算法自动计算。
        可选课程会在已勾选且已填成绩的课程中自动择优纳入（按模块要求），并在课程后显示绿色√。
        必修部分全部纳入；达标判断以“已填写成绩/合格”为准。
      </div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 12,
          padding: 12,
          borderRadius: 12,
          border: '1px solid var(--ifm-color-emphasis-200)',
          background: 'var(--ifm-color-emphasis-100)',
        }}
      >
        <div style={{fontWeight: 650}}>年级</div>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
          <input type="radio" checked={grade === '23'} onChange={() => setGrade('23')} />
          23 届
        </label>
        <label style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
          <input type="radio" checked={grade === '24'} onChange={() => setGrade('24')} />
          24 届
        </label>
        <div style={{opacity: 0.6, fontSize: '0.9rem'}}>平均 GPA：{formatNumber(computed.avg, 3)}</div>
        <button type="button" className="button button--secondary" onClick={clearCurrentGrade}>
          一键清空
        </button>
        <div
          style={{
            marginLeft: 'auto',
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid var(--ifm-color-emphasis-200)',
            background: computed.allOk ? 'rgba(30, 160, 90, 0.12)' : 'var(--ifm-color-emphasis-100)',
            color: computed.allOk ? 'rgb(24, 120, 70)' : 'inherit',
          }}
        >
          {computed.allOk ? '已达标' : '未达标'}
        </div>
      </div>

      <div style={{display: 'grid', gap: 16}}>
        {groups.map((group) => (
          <section
            key={group.module}
            style={{
              border: '1px solid var(--ifm-color-emphasis-200)',
              borderRadius: 12,
              padding: 14,
              background: 'var(--ifm-card-background-color)',
            }}
          >
            <div style={{fontWeight: 700, marginBottom: 10}}>{group.module}</div>
            <div style={{display: 'grid', gap: 12}}>
              {group.categories.map((cat) => {
                const rows = currentData[cat.id] || [];
                const result = computed.categoryResults[cat.id] || {included: new Set(), ok: false};
                const requiredNames = Array.isArray(cat.requiredNames) ? cat.requiredNames : [];
                const selectedGroupId = groupChoiceByGrade[grade]?.[cat.id] || '';
                return (
                  <div
                    key={cat.id}
                    style={{
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      borderRadius: 10,
                      padding: 12,
                      background: 'var(--ifm-background-color)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                        marginBottom: 8,
                      }}
                    >
                      <div style={{minWidth: 220}}>
                        <div style={{fontWeight: 650}}>
                          {cat.name}（{cat.id}）
                        </div>
                        <div style={{fontSize: '0.85rem', opacity: 0.6}}>
                          {cat.requirement}
                          {cat.note ? `，${cat.note}` : ''}
                        </div>
                      </div>
                      {Array.isArray(cat.requiredGroups) && (
                        <select
                          value={selectedGroupId}
                          onChange={(e) =>
                            setGroupChoiceByGrade((prev) => ({
                              ...prev,
                              [grade]: {...prev[grade], [cat.id]: e.target.value},
                            }))
                          }
                          style={{
                            minWidth: 200,
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1px solid var(--ifm-color-emphasis-200)',
                            background: 'var(--ifm-background-color)',
                            height: 36,
                          }}
                        >
                          <option value="">请选择大英 A / B</option>
                          {cat.requiredGroups.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <div
                        style={{
                          fontSize: '0.85rem',
                          padding: '4px 10px',
                          borderRadius: 999,
                          border: '1px solid var(--ifm-color-emphasis-200)',
                          background: result.ok ? 'rgba(30, 160, 90, 0.12)' : 'var(--ifm-color-emphasis-100)',
                          color: result.ok ? 'rgb(24, 120, 70)' : 'inherit',
                        }}
                      >
                        {result.ok ? '已达标' : '未达标'}
                      </div>
                    </div>

                    <div style={{display: 'grid', gap: 10}}>
                      {rows.length === 0 && (
                        <div style={{opacity: 0.6, fontSize: '0.85rem'}}>暂无课程</div>
                      )}
                      {rows.map((row) => {
                        const isRequired = requiredNames.includes(row.name);
                        const requiredMode = cat.requiredMode || 'passfail';
                        const included = result.included.has(row.id) && isCountable(row);
                        return (
                          <div
                            key={row.id}
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'center',
                              padding: '6px 0',
                              borderBottom: '1px dashed var(--ifm-color-emphasis-200)',
                            }}
                          >
                            {cat.selectable && !isRequired && (
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={(e) =>
                                  updateRow(cat.id, row.id, {selected: e.target.checked})
                                }
                              />
                            )}
                            <div
                              style={{
                                fontWeight: 600,
                                flex: '1 1 320px',
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                              }}
                            >
                              <span>{row.name}</span>
                              {included && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 18,
                                    height: 18,
                                    borderRadius: 999,
                                    background: 'rgba(30, 160, 90, 0.12)',
                                    color: 'rgb(24, 120, 70)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                  }}
                                  aria-label="已纳入计算"
                                  title="已纳入计算"
                                >
                                  √
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                gap: 10,
                                alignItems: 'center',
                              }}
                            >
                              <div style={{fontSize: '0.9rem', opacity: 0.85, minWidth: 90}}>
                                学分 {row.credits ?? '-'}
                              </div>
                              {isRequired && requiredMode === 'passfail' ? (
                                <select
                                  value={row.passStatus}
                                  onChange={(e) =>
                                    updateRow(cat.id, row.id, {passStatus: e.target.value})
                                  }
                                  style={{
                                    width: 140,
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: '1px solid var(--ifm-color-emphasis-200)',
                                    background: 'var(--ifm-background-color)',
                                    height: 40,
                                  }}
                                >
                                  <option value="">请选择</option>
                                  <option value="pass">合格</option>
                                  <option value="fail">不合格</option>
                                </select>
                              ) : row.scoreType === 'five' ? (
                                <select
                                  value={row.score}
                                  onChange={(e) =>
                                    updateRow(cat.id, row.id, {score: e.target.value})
                                  }
                                  style={{
                                    width: 140,
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: '1px solid var(--ifm-color-emphasis-200)',
                                    background: 'var(--ifm-background-color)',
                                    height: 40,
                                  }}
                                >
                                  <option value="">请选择</option>
                                  {FIVE_LEVEL_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  value={row.score}
                                  onChange={(e) => updateRow(cat.id, row.id, {score: e.target.value})}
                                  placeholder="成绩"
                                  inputMode="decimal"
                                  style={{
                                    width: 140,
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: '1px solid var(--ifm-color-emphasis-200)',
                                    background: 'var(--ifm-background-color)',
                                    height: 40,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
