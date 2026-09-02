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
      },
      {
        "title": "2025级",
        "description": "软件学院软件工程2025级培养方案",
        "link": "/docs/training-program/software-engineering-2025",
        "isCategory": false
      }
    ]
  },
  {
    "title": "推免细则",
    "description": "软件学院推荐免试研究生实施细则。",
    "link": "/docs/postgraduate-recommendation",
    "isCategory": true,
    "items": [
      {
        "title": "2023级",
        "description": "软件学院2023年推荐免试研究生实施细则",
        "link": "/docs/postgraduate-recommendation/2023",
        "isCategory": false
      },
      {
        "title": "2024级",
        "description": "软件学院2024年推荐免试研究生实施细则",
        "link": "/docs/postgraduate-recommendation/2024",
        "isCategory": false
      }
    ]
  },
  {
    "title": "综测方案",
    "description": "软件学院学生综合素质测评方案。",
    "link": "/docs/comprehensive-assessment",
    "isCategory": true,
    "items": [
      {
        "title": "2023级",
        "description": "软件学院2023年学生综合素质测评方案",
        "link": "/docs/comprehensive-assessment/2023",
        "isCategory": false
      },
      {
        "title": "2022级",
        "description": "软件学院2022年学生综合素质测评方案",
        "link": "/docs/comprehensive-assessment/2022",
        "isCategory": false
      },
      {
        "title": "2021级",
        "description": "软件学院2021年学生综合素质测评方案",
        "link": "/docs/comprehensive-assessment/2021",
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
        "title": "Git 安装与配置",
        "description": "Git 安装、全局配置与 SSH 密钥",
        "link": "/docs/commands/git/install-config",
        "isCategory": false
      },
      {
        "title": "Git 本地版本管理",
        "description": "提交、回退与本地分支管理",
        "link": "/docs/commands/git/local-version-control",
        "isCategory": false
      },
      {
        "title": "Git 远程协作",
        "description": "远程仓库、分支协作与 Pull Request",
        "link": "/docs/commands/git/remote-collaboration",
        "isCategory": false
      },
      {
        "title": "Git 备忘清单",
        "description": "常用 Git 命令速查",
        "link": "/docs/commands/git/cheatsheet",
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
        "title": "Tmux 安装与配置",
        "description": "Tmux 安装配置与会话管理",
        "link": "/docs/commands/tmux/install-config",
        "isCategory": false
      },
      {
        "title": "Tmux 使用教程",
        "description": "Tmux 常用操作与使用场景示例",
        "link": "/docs/commands/tmux/usage",
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
