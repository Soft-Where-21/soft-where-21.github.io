import styles from './styles.module.css';

const FeatureList = [
  {
    icon: 'R',
    title: '文档资源',
    description: '作业模板、竞赛资料、课程笔记都在这里！',
  },
  {
    icon: 'T',
    title: '工具链接',
    description: '常用开发、学习、科研工具合集，助力效率提升。',
  },
  {
    icon: 'O',
    title: '开源仓库',
    description: '优质开源项目索引，聚合学院同学优质Repo，鼓励共享与协作。',
  },
  {
    icon: 'W',
    title: '实用工具',
    description: 'GPA计算器、保研综测计算器...各种工具陆续上线！',
  },
  {
    icon: 'D',
    title: '官方文件',
    description: '培养方案？校历？校园地图？官方文件一键访问，方便查阅不再迷路。',
  },
  // {
  //   icon: 'L',
  //   title: '老师与实验室',
  //   description: '导师方向、实验室介绍与科研入口，助力科研之路不再迷茫！',
  // },
];

function Feature({icon, title, description}) {
  return (
    <article className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}

export default function HomepageFeatures() {
  return (
    <div className={styles.features}>
      <div className={styles.grid}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}
