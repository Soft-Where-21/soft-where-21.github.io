# 推免计算器结构

每个年级的课程框架、课程清单和特殊认定逻辑放在独立脚本中：

- `grade23.js`：2023 级规则，以及大英 A/B（3）双课程替代、物理平均分替代。
- `grade24.js`：2024 级规则，只使用常规课程名和“替代课程名”认定。
- `shared.js`：无年级差异的绩点公式、择优计算、待补全检测和导入赋值。
- `transcript.js`：本研系统成绩表解析，按表头读取字段，保留空列。
- `index.js`：年级计算器注册表。

新增年级时，复制最接近的年级脚本，修改 `groups`、`presets` 和该年级的
`importTranscript`，再把计算器注册到 `index.js`。页面会自动生成对应年级选项，
不需要把新规则写回页面组件。

运行回归测试：

```bash
rtk proxy node --test tests/postgrad-calculators.test.mjs
```
