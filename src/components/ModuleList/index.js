import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// 硬编码配置模块数据
const modules = [
  {
    "title": "北航常用工具导航",
    "description": "BUAA常用工具以及链接",
    "link": "/docs/buaa-tools",
    "isCategory": false
  },
  {
    "title": "北航校历",
    "description": "北航 2025-2026 校历",
    "link": "/docs/calendar",
    "isCategory": false
  },
  {
    "title": "贡献指南",
    "description": "一起共建资源库：提交内容、完善文档与开源协作入口",
    "link": "/docs/contribute",
    "isCategory": false
  },
  {
    "title": "培养方案",
    "description": "关于 培养方案 的相关资料。",
    "link": "/docs/training-program",
    "isCategory": true,
    "items": [
      {
        "title": "2023级",
        "description": "软件学院软件工程2023级培养方案",
        "link": "/docs/training-program/software-engineering-2023",
        "isCategory": false
      },
      {
        "title": "2024级",
        "description": "软件学院软件工程2024级培养方案",
        "link": "/docs/training-program/software-engineering-2024",
        "isCategory": false
      }
    ]
  },
  {
    "title": "常用指令",
    "description": "关于 常用指令 的相关资料。",
    "link": "/docs/commands",
    "isCategory": true,
    "items": [
      {
        "title": "Git",
        "description": "Git 安装配置 / 本地版本管理 / 远程协作",
        "link": "/docs/commands/git/install-config",
        "isCategory": false
      },
      {
        "title": "Bash",
        "description": "Linux 命令行快速上手教程",
        "link": "/docs/commands/linux/shell",
        "isCategory": false
      },
      {
        "title": "Vim",
        "description": "Vim 基础模式与常用编辑指令",
        "link": "/docs/commands/linux/vim",
        "isCategory": false
      },
      {
        "title": "Docker",
        "description": "Docker 常用指令与速查",
        "link": "/docs/commands/docker",
        "isCategory": false
      },
      {
        "title": "Tmux",
        "description": "Tmux 安装与使用教程",
        "link": "/docs/commands/tmux/install-config",
        "isCategory": false
      }
    ]
  },
  {
    "title": "校园地图",
    "description": "关于 校园地图 的相关资料。",
    "link": "/docs/campus-map",
    "isCategory": true,
    "items": [
      {
        "title": "学院路",
        "description": "北航学院路校区校园地图",
        "link": "/docs/campus-map/xueyuan-road",
        "isCategory": false
      },
      {
        "title": "沙河",
        "description": "北航沙河校区校园地图",
        "link": "/docs/campus-map/shahe",
        "isCategory": false
      }
    ]
  },
  {
    "title": "科研工具",
    "description": "常用科研工具与使用建议",
    "link": "/docs/research-tools",
    "isCategory": false
  }
];

function ModuleCard({ title, description, link }) {
  return (
    <Link to={link} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span className={styles.arrow}>立即阅读 →</span>
      </div>
    </Link>
  );
}

function CategorySection({ title, items }) {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <ModuleCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ModuleList() {
  const standaloneItems = modules.filter(m => !m.isCategory);
  const categoryItems = modules.filter(m => m.isCategory);

  return (
    <div className={styles.modules}>
      {/* First show categories and their sub-items */}
      {categoryItems.map((cat, idx) => (
        <CategorySection key={idx} title={cat.title} items={cat.items} />
      ))}

      {/* Then show standalone top-level items */}
      {standaloneItems.length > 0 && (
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>其他资源</h2>
          </div>
          <div className={styles.grid}>
            {standaloneItems.map((item, idx) => (
              <ModuleCard key={idx} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}