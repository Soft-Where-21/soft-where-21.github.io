# 保研机试·数据结构考点 & Accoding 题目索引

> 生成时间：2026-09-12。数据来源：软院官网 2026 年推免复试方案、往年经验帖、accoding 平台「2023级-信息大类-程序设计基础」（group/101）与「2023级-软件学院-算法分析与设计」（group/109）两门课全部 30 场上机/练习赛共 349 题（含题面）。
> 🔗 可勾选的**刷题待办清单**（题号链接 + 考查内容 + 入选原因（6系/21系）+ 类似题，按优先级分批）：[[机试刷题待办清单]]

## 一、机试考什么

**官方口径**（软院 2026 推免复试方案）：
- 复试满分 300：**机试 100（C 语言上机编程）** + 面试 200（英语 40 / 数理 50 / 专业综合 60 / 综合 50 / 思政不合格一票否决）
- 机试通过 **online judge 在线评测**（就是 accoding 平台，学院官方明确建议用它练习），机房环境 CodeBlocks / Dev-C++，**建议标准 C（C99）**
- **机试后按成绩分学位层次确定面试名单，同分按罚时排名** → 机试是进面试的硬门槛，机试够高面试基本不会被刷

**往年经验帖总结的题型规律**：
- 一般 3~4 道编程题，难度递进；约 200 人参加、只有一半进面试
- **无非两类：字符串/数组操作 + 数据结构**（尤其**树，考频最高**）
- 第一题送分但坑多（格式、边界、多组输入），后面考数据结构应用
- 高频主题：链表/结构体/指针、树的遍历与 BST、栈与队列（含函数调用栈模拟）、排序与二分、DFS/BFS、DP（背包/LCS/区间）、贪心、图论基础（最短路/MST/拓扑）

## 二、题目索引（按考点）

> 题号 = accoding 题目 ID，**点击题号直达题目页，点击比赛名直达题目列表页**（需已登录 accoding）。
> 「C=上机赛，E=练习赛」全部 30 场比赛直达链接见文末[附录](#附全部-30-场比赛一览)。
> 🚫 = 该题属于 **Review 期末考试专项复习特别辑**，**该场次已关闭访问**（点进去会 302 跳转），实际做不了——已在 2026-09-17 逐题验证。
> 【尾】= 该题是所在场次的**最后三道（压轴题）**，当场通过率普遍偏低，备考优先级靠后（不列入任何推荐清单）。
> 
> **完成情况标记（只标了你自评的这 5 道）**：✅ = 自己想出思路并写对；❌ = 没想出思路 / 没写对 / 想太久写太慢。
> ⚠️ 这两个标记**只代表你自己的判断，和平台 AC 记录无关**——平台上通过的题很多是一两年前做的，不等于"现在能独立写对"，所以我没有拿平台记录去改这里的标记。平台记录另见文末「附 B」。
> 📌 另外注意：算法课 13 场里 **17 道题你提交过但没 AC**（清单见 §三 末尾），其中 **8944 收作业！** 交了 9 次仍没过，是最值得优先攻的一道。

### 1. 链表 / 结构体 / 指针
程序设计基础是 C 语言课，链表题不会写"链表"在标题里，而是以多项式、序列合并等形式出现——这正是机试链表题的经典包装：
- **[7388](https://accoding.buaa.edu.cn/problem/7388/index) 多项式相加 2023** —— C8 程序设计（期末模拟）：一元多项式相加（结构体数组或链表）
- **[8186](https://accoding.buaa.edu.cn/problem/8186/index) 多项式合并** —— C1 算法（题面注明"必须使用 C 语言提交"）
- **[8191](https://accoding.buaa.edu.cn/problem/8191/index)✅ 莫卡与一元多项式** —— C1 算法
- [7049](https://accoding.buaa.edu.cn/problem/7049/index) De：从向量开始 —— C1 程序设计（结构体入门）
- [7302](https://accoding.buaa.edu.cn/problem/7302/index) 数组的大小 —— E6 程序设计

### 2. 栈与队列
- **[8926](https://accoding.buaa.edu.cn/problem/8926/index)✅ 车厢调度** —— C7 算法（期末模拟）：Y 形轨道调度 = 经典**栈的进出序列合法性判定**
- **[8449](https://accoding.buaa.edu.cn/problem/8449/index)❌ Maze No.9** —— E2 算法：走迷宫（队列 BFS）
- [8180](https://accoding.buaa.edu.cn/problem/8180/index) 列队 —— C1 算法
- [7393](https://accoding.buaa.edu.cn/problem/7393/index)【尾】 哪吒玩汉诺塔 —— C8 程序设计（期末模拟）：递归/栈
- [7291](https://accoding.buaa.edu.cn/problem/7291/index) 戎璎花的汉诺塔 —— C5 程序设计

### 3. 树 / 二叉树
- **[8235](https://accoding.buaa.edu.cn/problem/8235/index)【尾】✅ tree tree de** —— E1 算法：满二叉树编号 ↔ 父子坐标关系
- **[8475](https://accoding.buaa.edu.cn/problem/8475/index)❌ 2024-OBST？OBST！** —— C3 算法：最优二叉搜索树（区间 DP）
- [7274](https://accoding.buaa.edu.cn/problem/7274/index) Catalan —— C5 程序设计：卡特兰数（二叉树形态计数）
- [8281](https://accoding.buaa.edu.cn/problem/8281/index)【尾】 2024-三叉卡特兰数 —— C2 算法
- [8477](https://accoding.buaa.edu.cn/problem/8477/index)【尾】 不含月铃姐妹 —— C3 算法

### 4. 堆 / 优先队列 / Top-K
- **[8279](https://accoding.buaa.edu.cn/problem/8279/index) 2024-简单的堆** —— C2 算法：直接考二叉堆
- **[7415](https://accoding.buaa.edu.cn/problem/7415/index) 最小的K个数** —— E8 程序设计：Top-K（堆或排序）
- [7449](https://accoding.buaa.edu.cn/problem/7449/index)🚫 顺序统计量 2023 —— Review：第 k 小（快排划分）

### 5. 图论（算法课 C4 一整场都在考图）
- **[8606](https://accoding.buaa.edu.cn/problem/8606/index) 2024-简单的图图** —— C4：有向图多源最短路（n≤300，Floyd）
- **[8608](https://accoding.buaa.edu.cn/problem/8608/index)【尾】 2024-TOPO!** —— C4：拓扑排序
- **[8602](https://accoding.buaa.edu.cn/problem/8602/index) 2024-负环** —— C4：判负环（Bellman-Ford/SPFA）
- **[8871](https://accoding.buaa.edu.cn/problem/8871/index) 2024-克鲁斯卡尔与普莱姆** —— C6：MST 两种实现（并查集 + 堆优化）
- **[8559](https://accoding.buaa.edu.cn/problem/8559/index) 2024-半连通图** —— E3：Tarjan 缩点
- [8956](https://accoding.buaa.edu.cn/problem/8956/index) 2024-Complete Graph —— E6
- [8690](https://accoding.buaa.edu.cn/problem/8690/index) 2024-妮妮和补图 —— E4
- [8616](https://accoding.buaa.edu.cn/problem/8616/index)【尾】 莫卡的最远点对 —— C4
- [8955](https://accoding.buaa.edu.cn/problem/8955/index)【尾】 2024-Complete Matching —— E6：二分图匹配
- [8964](https://accoding.buaa.edu.cn/problem/8964/index) 路线规划 —— C7 算法（期末模拟）
- [8689](https://accoding.buaa.edu.cn/problem/8689/index) 2024-妮妮与自来水厂 —— E4
- [8447](https://accoding.buaa.edu.cn/problem/8447/index) 此处即是勇者试炼之殿堂 —— E2 算法

### 6. 排序 / 查找 / 哈希
- **[7421](https://accoding.buaa.edu.cn/problem/7421/index)🚫 散列查找-线性探测法** —— Review：哈希表构造，最直接的哈希题
- **[8188](https://accoding.buaa.edu.cn/problem/8188/index)【尾】 k-逆序对** —— C1 算法：归并排序/树状数组
- **[8287](https://accoding.buaa.edu.cn/problem/8287/index) 2024-排序？数数！** —— C2 算法：计数排序
- [8262](https://accoding.buaa.edu.cn/problem/8262/index) sort —— E1 算法
- [7420](https://accoding.buaa.edu.cn/problem/7420/index)🚫 坐标去重输出23 —— Review：去重（哈希/排序）
- [7379](https://accoding.buaa.edu.cn/problem/7379/index) a+b与字典序 —— C8 程序设计
- [7456](https://accoding.buaa.edu.cn/problem/7456/index)🚫 后缀排序 —— Review
- [7454](https://accoding.buaa.edu.cn/problem/7454/index)🚫 区间合并 1.0 / [7457](https://accoding.buaa.edu.cn/problem/7457/index)🚫 区间合并 2.0 —— Review：排序+贪心
- [7455](https://accoding.buaa.edu.cn/problem/7455/index)🚫 OJ排行榜 —— Review：多关键字排序
- [7364](https://accoding.buaa.edu.cn/problem/7364/index) 川川爬山 —— E7 程序设计

### 7. 递归 / 分治 / 数论
- **[8193](https://accoding.buaa.edu.cn/problem/8193/index) 莫卡与阿克曼函数** —— C1 算法：阿克曼函数（递归）
- [7283](https://accoding.buaa.edu.cn/problem/7283/index)【尾】 哪吒的递归函数 —— C5 程序设计
- [7362](https://accoding.buaa.edu.cn/problem/7362/index) Ex-GCD —— C7 程序设计：扩展欧几里得
- [8874](https://accoding.buaa.edu.cn/problem/8874/index) 同余方程（exgcd）—— C6 算法
- [7103](https://accoding.buaa.edu.cn/problem/7103/index) 格雷码2023 —— E5：递归构造
- [8875](https://accoding.buaa.edu.cn/problem/8875/index) 位逆序置换 —— C6 算法：FFT 蝶形变换前置
- [7254](https://accoding.buaa.edu.cn/problem/7254/index) 连分数与辗转相除 —— C4 程序设计

### 8. 动态规划（算法课 C3 整场都是《算法导论》DP 章节）
- **[8471](https://accoding.buaa.edu.cn/problem/8471/index) 2024-钢管切割** / **[8607](https://accoding.buaa.edu.cn/problem/8607/index) 2024-切钢条** —— rod cutting
- **[8474](https://accoding.buaa.edu.cn/problem/8474/index) 2024-矩阵链乘** / [8286](https://accoding.buaa.edu.cn/problem/8286/index)【尾】 2024-矩阵连乘 —— 矩阵链乘
- **[8503](https://accoding.buaa.edu.cn/problem/8503/index) 2024-LCS** —— 最长公共子序列
- **[8557](https://accoding.buaa.edu.cn/problem/8557/index) 背……包？**（E3）/ **[8846](https://accoding.buaa.edu.cn/problem/8846/index) 背包糕手**（C6）—— 背包
- [8469](https://accoding.buaa.edu.cn/problem/8469/index) / [8470](https://accoding.buaa.edu.cn/problem/8470/index)【尾】 2024-流水线调度1/2 —— C3
- [8242](https://accoding.buaa.edu.cn/problem/8242/index) 莫卡寻宝 —— E1 算法
- [8604](https://accoding.buaa.edu.cn/problem/8604/index) 2024-Jade Star —— C4 算法
- [7235](https://accoding.buaa.edu.cn/problem/7235/index)【尾】 循环的能量块 —— E4 程序设计

### 9. 贪心
- **[8942](https://accoding.buaa.edu.cn/problem/8942/index) 复习安排** —— C7 算法（期末模拟）：区间调度经典贪心（最多选多少不重叠区间）
- **[8601](https://accoding.buaa.edu.cn/problem/8601/index) 2024-贪心の食客** —— C4 算法
- [7341](https://accoding.buaa.edu.cn/problem/7341/index)🚫 选拔 —— Review

### 10. 前缀和 / 数学性质
- [8278](https://accoding.buaa.edu.cn/problem/8278/index)【尾】 序列询问 —— C2 算法：区间奇数次出现（前缀异或）
- [8966](https://accoding.buaa.edu.cn/problem/8966/index)【尾】 数列询问 —— C7 算法（期末模拟）：卷积求和
- [7277](https://accoding.buaa.edu.cn/problem/7277/index) a^b Problem —— C5 程序设计：快速幂
- [8285](https://accoding.buaa.edu.cn/problem/8285/index) 2024-大数相乘 —— C2 算法：高精度

### 11. 字符串处理（程序设计基础课的绝对主力 ≈ 机试第一题的常见形态）
程序设计基础 8 次上机+练习赛里约 1/3 是字符串/数组操作题，机试第一题大概率长这样：
- **编码/解码类**：[7228](https://accoding.buaa.edu.cn/problem/7228/index) HDB3编码、[7227](https://accoding.buaa.edu.cn/problem/7227/index) AMI编码、[7160](https://accoding.buaa.edu.cn/problem/7160/index)/[7209](https://accoding.buaa.edu.cn/problem/7209/index) 补码、[7259](https://accoding.buaa.edu.cn/problem/7259/index)🚫 均匀量化编码、[7078](https://accoding.buaa.edu.cn/problem/7078/index) 小亮的乱码书信、[7079](https://accoding.buaa.edu.cn/problem/7079/index) 高低位对调、[7203](https://accoding.buaa.edu.cn/problem/7203/index) 从十进制数到2421码、[7162](https://accoding.buaa.edu.cn/problem/7162/index)🚫 Triangle：恐怖游轮
- **格式解析类**：[7370](https://accoding.buaa.edu.cn/problem/7370/index) 自定义格式化、[7205](https://accoding.buaa.edu.cn/problem/7205/index)🚫 从科学计数法回归数字！、[7253](https://accoding.buaa.edu.cn/problem/7253/index) 分数四则运算、[7322](https://accoding.buaa.edu.cn/problem/7322/index)【尾】 Cirno 的完美函数教室 2023、[7229](https://accoding.buaa.edu.cn/problem/7229/index)【尾】 有理数2023
- **算法课字符串**：[8957](https://accoding.buaa.edu.cn/problem/8957/index) 字符串自动机（AC 自动机/SAM）、[8958](https://accoding.buaa.edu.cn/problem/8958/index) 2024-对称字符串、[8959](https://accoding.buaa.edu.cn/problem/8959/index) 2024-字符串转转转、[8961](https://accoding.buaa.edu.cn/problem/8961/index)【尾】 2024-字符串能否制服字符串？、[8456](https://accoding.buaa.edu.cn/problem/8456/index) 2024-回文串串文回、[8454](https://accoding.buaa.edu.cn/problem/8454/index) 2024-7sozx 特有的字符串、[7223](https://accoding.buaa.edu.cn/problem/7223/index)🚫 violet 的跳跃子串、[8960](https://accoding.buaa.edu.cn/problem/8960/index) 2024-集合和集合的和还是集合
- [7346](https://accoding.buaa.edu.cn/problem/7346/index) 寻找字符、[7092](https://accoding.buaa.edu.cn/problem/7092/index)【尾】 摩卡背单词、[7215](https://accoding.buaa.edu.cn/problem/7215/index) czx 学字符串

### 12. 模拟（坑多，练仔细度）
- [7270](https://accoding.buaa.edu.cn/problem/7270/index)🚫 孤注一掷：百家乐 —— Review
- [7330](https://accoding.buaa.edu.cn/problem/7330/index) 水獭密码 —— E6 程序设计
- [7087](https://accoding.buaa.edu.cn/problem/7087/index) 生成扫雷地图 —— C7 程序设计
- [7337](https://accoding.buaa.edu.cn/problem/7337/index) 摩卡与水獭乐团派对 2.0 —— C8（期末模拟）

## 三、10 道重点题（考察重点互不重复）

> 选法：① 十道题对应**十种不同的思路/考点**；② 贴合真题风格（字符串解析、模拟、栈、基础数据结构）；③ 优先挑你没做过的；④ 每道后面是「同类题」——思路相通，做通一道即可迁移，不必全刷。
> **难度口径（重要）**：题后的「正确率 / 通过率」一律取自**比赛页当场数据**（`acceptedPeopleCount / triedSubCount`、`acceptedPeopleCount / triedPeopleCount`），**不是**题目详情页那个赛后累计的「总通过率」——后者含赛后来补的提交，会明显虚高。选取时**排除每场比赛的最后三题（压轴题）**；Review 期末复习卷的 39 题也已全部排除（该场已关闭，点进去 302 跳转）。

**1. ⭐ ✅字符串解析 + 多组数据 + 格式细节 —— [7253](https://accoding.buaa.edu.cn/problem/7253/index) 分数四则运算**（C4 程序设计）
- 思路：读 `a/b c/d op` → 按 op 算 → gcd 约分 → 输出时判断"是否为整数"决定输出整数还是 `p/q`
- 坑：**多组数据读到 EOF**、最简分数的负号位置、结果为整数时的特判——和 21 系 A 题（读单词）、6系"提取函数调用"是同一类基本功
- 同类：[7370](https://accoding.buaa.edu.cn/problem/7370/index) 自定义格式化、[8959](https://accoding.buaa.edu.cn/problem/8959/index) 2024-字符串转转转（E6 第7/11，通过率 75%，**你还没做过**）、[8958](https://accoding.buaa.edu.cn/problem/8958/index) 2024-对称字符串（E6 第6/11，你还没做过）、真题 6系2021「提取函数调用及参数」

**2. ⭐ ✅位运算 —— [7079](https://accoding.buaa.edu.cn/problem/7079/index) 高低位对调**（C3 程序设计）
- 思路：低 16 位左移 16 拼上高 16 位右移 16——**一行搞定**：`(x << 16) | (x >> 16)`
- 坑：必须用 `unsigned int`（有符号右移补符号位）；别真去转 01 字符串（能过但慢且易错）
- 同类：[7203](https://accoding.buaa.edu.cn/problem/7203/index) 从十进制数到2421码、[7160](https://accoding.buaa.edu.cn/problem/7160/index)/[7209](https://accoding.buaa.edu.cn/problem/7209/index) 补码、真题 6系2022"二进制序列操作"

**3. ⭐ ✅大模拟：多步规则翻译成代码（真题最爱的风格）—— [7228](https://accoding.buaa.edu.cn/problem/7228/index) HDB3编码**（E6 程序设计）
- 思路：规则分四步（加 V → 加 B → 极性交替 → 合成），**先在纸上把规则翻成状态机再敲代码**，别边读题边写
- 坑：连 0 计数会跨组边界；V/B 极性依赖"上一个非零码的极性"——用变量存状态
- 同类：[7227](https://accoding.buaa.edu.cn/problem/7227/index) AMI编码、[8305](https://accoding.buaa.edu.cn/problem/8305/index) 莫卡的龙（C2 第8/11，正确率 41%、通过率 78%，**你还没做过**——蛇身跟随移动，规则多但不难）、真题 6系2020 第1题

**4. ⭐ ✅二维数组模拟 + 边界判断 —— [7087](https://accoding.buaa.edu.cn/problem/7087/index) 生成扫雷地图**（C7 程序设计）
- 思路：逐个非雷格统计 8 邻居里的雷数，边界用 `for dx in -1..1` 加范围判断，比写 8 个 if 稳
- 坑：边界格子只统计存在的邻居（题目特别提示）；输入用字符读，别用 `%d`
- 同类：[7330](https://accoding.buaa.edu.cn/problem/7330/index) 水獭密码、[7328](https://accoding.buaa.edu.cn/problem/7328/index) 摩卡与数独 2023（E7 第5/10，逐行/逐列/逐宫校验）、[7335](https://accoding.buaa.edu.cn/problem/7335/index) 小亮学矩阵加减法

**5. ⭐ 有序序列归并 / 结构体 —— [7388](https://accoding.buaa.edu.cn/problem/7388/index) 多项式相加 2023**（C8 程序设计·期末模拟）
- 思路：两个多项式按指数**归并**，指数相同则系数相加、和为 0 的项不输出；指数大就存 hash/排序后归并
- 坑：零系数项必须跳过；N,M ≤ 1e5 不能 O(N·M)；输出格式（第一项负号、`x` 的系数为 1 时省略）
- 同类：[8186](https://accoding.buaa.edu.cn/problem/8186/index) 多项式合并（可对比做法）、[8191](https://accoding.buaa.edu.cn/problem/8191/index) 莫卡与一元多项式、真题 6系2020"空闲块"（循环链表模拟）

**6. ⭐✅🕳️(通过冒泡实现的，并没有练堆) 堆 / Top-K（含复杂度意识）—— [7415](https://accoding.buaa.edu.cn/problem/7415/index) 最小的K个数**（E8 程序设计）
- 思路：n ≤ 1e6、K ≤ 5——**不需要全排序**：维护一个大小为 K 的大根堆（或直接暴力扫描 O(nK)）
- 坑：题目明说"注意时间限制"，`qsort` 全排可能 TLE；负数边界
- 同类：[8279](https://accoding.buaa.edu.cn/problem/8279/index) 2024-简单的堆（重写一遍当模板）、[8557](https://accoding.buaa.edu.cn/problem/8557/index) 背……包？（E3 第3/10，通过率 77%）、真题 6系2022「数组与堆」（判断大/小根堆）

**7. ⭐ 哈希 / 前缀统计 —— [8946](https://accoding.buaa.edu.cn/problem/8946/index) Jvav糕手**（E6 算法 第 5/11 题）
> 这位置原本放的是 Review 卷的「散列查找-线性探测法」（[7421](https://accoding.buaa.edu.cn/problem/7421/index)），但 **Review 场次已关闭访问**（39 题全部 302 跳转），实际做不了，所以换成这道。
- 比赛内：正确率 52/110 = 47%，通过率 52/62 = 84%
- 思路：n 条历史记录 + m 次询问「以 prefix 为前缀的**不同**记录数」——把记录**去重**后按字典序排序，每次询问**二分**出该前缀覆盖的区间长度；或建 Trie（前缀树），节点存子树计数
- 坑：①「不同」必须去重；② n,m ≤ 1e4，每次询问 O(n) 会到 1e8；③ 前缀比较用 `strncmp(s, prefix, strlen(prefix))`，别用 `strcmp`
- 同类：[8287](https://accoding.buaa.edu.cn/problem/8287/index) 2024-排序？数数！（C2 第6/11，你未过——计数/离散化）、[8962](https://accoding.buaa.edu.cn/problem/8962/index) 这是真孔明篇（E6 第2/11，KMP 模板，通过率 96%）、真题 6系2022「通讯录查询」

**8. ⭐✅🕳️(写的比较慢) DP：多重背包 —— [8846](https://accoding.buaa.edu.cn/problem/8846/index) 背包糕手**（C6 算法，平台记录里这题你没通过，优先补）
- 思路：每种武器有**数量上限 k_i**（不是 0/1 也不是完全背包）→ 多重背包：二进制拆分物品 或 按余数分组用单调队列优化；朴素写法 `dp[j] = max(dp[j], dp[j-c*i] + d*i)` 在 m ≤ 1e5、n ≤ 100 下需要拆分才稳
- 坑：**每组数据要清 dp 数组**；k_i 可能远大于 m/c_i（要取 min）；伤害/成本都是 int 但答案可能超 int32 → 用 long long
- 同类：[8503](https://accoding.buaa.edu.cn/problem/8503/index) 2024-LCS（C3 第6/10，通过率 69%，**你还没做过**）、[8472](https://accoding.buaa.edu.cn/problem/8472/index) 2024-导弹轰炸（C3 第4/10，通过率 85%，打家劫舍式线性 DP）、[8474](https://accoding.buaa.edu.cn/problem/8474/index) 矩阵链乘（C3 第3/10）

**9. ⭐ 单调栈 —— [8446](https://accoding.buaa.edu.cn/problem/8446/index) Who can I see?**（E2 算法 第 4/11 题）
> 原第 9 条是「树 + 思维」的 [8616](https://accoding.buaa.edu.cn/problem/8616/index) 莫卡的最远点对——那是 C4 的**压轴题**（当场正确率 5/34、通过率 5/13），你当时就没做出来，性价太低，换成同属「基础结构」但难度正常的单调栈。
- 比赛内：正确率 91/380 = 24%，通过率 91/118 = 77%（当场想做的人里 3/4 都过了）
- 思路：每个位置 i 想知道「能看到几个人」。向左看能看到的 j 满足区间内所有人都不高于 a_i，等价于**左侧第一个比自己高的人之后的所有人**；向右同理。做法：从左往右扫，维护**单调递减栈**，当前元素入栈前弹出所有比它矮的并结算它们「向右能看到的数量」；反向再扫一遍算左边，两边相加
- 坑：n ≤ 3e5，O(n²) 必超时；题目保证身高**互不相同**（省掉相等判断）；累计答案开 long long
- 同类：[8180](https://accoding.buaa.edu.cn/problem/8180/index) 列队（C1 第2/10，正确率 26%、通过率 85%，同一个「第一个比自己高」模型）、[7364](https://accoding.buaa.edu.cn/problem/7364/index) 川川爬山（E7 第6/10）、真题 6系2022「学生身高分配问题」（POJ 3250 变体）

**10. ⭐ 图论：单源最短路（必经指定点）—— [8688](https://accoding.buaa.edu.cn/problem/8688/index) 打印准考证**（E4 算法 第 3/10 题）
> 原第 10 条是 [8278](https://accoding.buaa.edu.cn/problem/8278/index) 序列询问（C2 的**压轴题**，当场正确率 2/30、通过率 2/11），靠"随机哈希 + 前缀异或"的灵光，性价比低，换成套路清晰的最短路。
- 比赛内：正确率 51/305 = 17%，通过率 51/74 = 69%；**你还没提交过这题**
- 思路：无向图，从 1 走到 n，**中途至少要经过一家打印店**（给出 k 家）。别去枚举打印店跑 k 遍最短路——反过来算：答案 = min over p∈打印店 ( dist(1,p) + dist(p,n) )。所以**从 1 跑一遍 Dijkstra 得 d1[]、从 n 跑一遍得 dn[]**，再对每个打印店取和的最小值
- 坑：① 边权非负 → 用 Dijkstra，别写 SPFA；② 要能判断"走不到"（无解输出按题面）；③ 重边取最小；④ C 语言没有优先队列，要么手写小根堆，要么邻接矩阵 + O(n²) 朴素 Dijkstra
- 同类：[8684](https://accoding.buaa.edu.cn/problem/8684/index) 2024-魔法舞步（E4 第6/10，通过率 85%，BFS 分层图，**你还没做过**）、[8608](https://accoding.buaa.edu.cn/problem/8608/index) 2024-TOPO!【尾】（C4 第8/10，拓扑排序，你已 AC）、[8606](https://accoding.buaa.edu.cn/problem/8606/index) 2024-简单的图图（C4 第5/10，Floyd）、真题 6系2025「三叉树的最短路径」

**建议盲写复现的模板题**（机试罚时靠手速，重敲一遍比刷新题划算）：[8926](https://accoding.buaa.edu.cn/problem/8926/index) 车厢调度（栈）、[8186](https://accoding.buaa.edu.cn/problem/8186/index) 多项式合并（归并）、[8279](https://accoding.buaa.edu.cn/problem/8279/index) 简单的堆（堆模板）、[8871](https://accoding.buaa.edu.cn/problem/8871/index) Kruskal（并查集+排序）、[8606](https://accoding.buaa.edu.cn/problem/8606/index) Floyd（三重循环）、[8475](https://accoding.buaa.edu.cn/problem/8475/index) OBST（区间 DP + 方案输出）、[8449](https://accoding.buaa.edu.cn/problem/8449/index) Maze No.9（滑动 BFS）。

**备选（刷完上面再碰）**：[8942](https://accoding.buaa.edu.cn/problem/8942/index) 复习安排（区间调度贪心，C7 第5/11，通过率 83%）、[8741](https://accoding.buaa.edu.cn/problem/8741/index) 三点共线（思维分类，C5 第1/10，通过率 99%）、[7254](https://accoding.buaa.edu.cn/problem/7254/index) 连分数与辗转相除（程设 C4 第6/10）、[7103](https://accoding.buaa.edu.cn/problem/7103/index) 格雷码2023（E5 第7/10，递归构造）、[8806](https://accoding.buaa.edu.cn/problem/8806/index) A Frog Jumps · II（E5 **第3/10**，计数 DP + 前缀和优化，当场正确率 13%、通过率 66%，**你全平台无提交记录**）。

> **你未通过的题（完整版，按平台记录）**：算法课 13 场共 271 条提交，其中 **17 道题提交过但没 AC**。非压轴的 10 道是：**8846 背包糕手**（多重背包，见第 8 条）、**8944 收作业！**（9 次 CE/WA 没过，最值得重做）、**8287 排序？数数！**、**8478 方案数 I**、**8564 Flip**、**8555 Swamp**、**8865 线性袋鼠**、**8867 MIPS 计算机**（大数乘法模拟）、**8943 数字魔法**、**8964 路线规划**（本质最大流，超纲）；压轴 7 道（8188、8862、8868、8869、8966、8967、8968）投入产出比低，知道套路就行。

### 补充：按 6系 / 21系 常考题型配的题

> **难度口径**：题后「正确率」= 比赛页**当场**数据（`acceptedPeopleCount / triedSubCount`），括号里「通过率」= `acceptedPeopleCount / triedPeopleCount`（当场想做的人里多少做出来了）。**每场最后三题已排除**，Review 卷 39 题因已关闭访问（302）也排除。
> **状态**：★ = 你在全平台（**含赛后**）都没有提交记录 → 真正的新题（已用单题页按昵称逐题核实）；✅ = 已 AC；❌ = 提交过但没过。
> **想自己核对当场正确率**：打开 `https://accoding.buaa.edu.cn/contest-ng/index.html#/{比赛ID}/problems`（如 8278 那场是 `#/1106/problems`），每题旁边显示的就是**比赛期间**的通过率/正确率；题目详情页显示的「总通过人数/总提交人数」是赛后累计值，会偏高。

**① 大模拟（长题面 + 多步规则）** —— 6系 2020 第2题、2025 三叉树，真题最爱
- ★ [8305](https://accoding.buaa.edu.cn/problem/8305/index) 莫卡的龙（C2 第8/11，正确率 41%、通过率 78%）—— 蛇身跟随头部移动，坑在「身体各段依次跟随」的更新顺序
- [7228](https://accoding.buaa.edu.cn/problem/7228/index) HDB3编码（程设 E6 第7/10）= §三 第 3 条；[7337](https://accoding.buaa.edu.cn/problem/7337/index) 摩卡与水獭乐团派对 2.0（程设 C8 第6/10）

**② 字符串解析 / 格式细节** —— 6系 2021「提取函数调用及参数」、21系 A「歌词加速」
- ★ [8959](https://accoding.buaa.edu.cn/problem/8959/index) 字符串转转转（E6 第7/11，正确率 17%、通过率 75%）
- ★ [8958](https://accoding.buaa.edu.cn/problem/8958/index) 对称字符串（E6 第6/11，25%、65%）—— 求所有「前缀 = 后缀」的长度，KMP 的 next 数组或字符串哈希
- [8962](https://accoding.buaa.edu.cn/problem/8962/index) 这是真孔明篇（E6 第2/11，通过率 96%）—— KMP 模板，机试前要能盲写；[7253](https://accoding.buaa.edu.cn/problem/7253/index) 分数四则运算 = §三 第 1 条

**③ 素数筛 / 数论** —— 6系 2024「素数」、2025 一场出 3 道
- [7279](https://accoding.buaa.edu.cn/problem/7279/index) 孪生素数猜想（程设 C5 第6/10）—— 区间筛 + 输出所有相差 2 的素数对
- [7174](https://accoding.buaa.edu.cn/problem/7174/index) 质数，异或和一（程设 C3 第5/10）—— 第 m、n 个素数异或是否为 1（关键：除 2 外素数都是奇数）
- [8874](https://accoding.buaa.edu.cn/problem/8874/index) 同余方程 exgcd（C6 第5/10，通过率 96%）

**④ 栈** —— 6系 2025「函数调用深度分析」「复杂计算器」
- ✅ [8926](https://accoding.buaa.edu.cn/problem/8926/index) 车厢调度（C7 第3/11，正确率 28%、通过率 74%）—— 已列入「盲写复现」清单
- [7291](https://accoding.buaa.edu.cn/problem/7291/index) 戎璎花的汉诺塔（程设 C5 第7/10）—— 递归/栈的典型包装

**⑤ 单调栈** —— 6系 2022「学生身高分配」（POJ 3250 变体）
- [8446](https://accoding.buaa.edu.cn/problem/8446/index) Who can I see?（E2 第4/11）= §三 第 9 条；同类 [8180](https://accoding.buaa.edu.cn/problem/8180/index) 列队、[7364](https://accoding.buaa.edu.cn/problem/7364/index) 川川爬山

**⑥ 图论：最短路 / 拓扑 / BFS** —— 6系 2025「三叉树最短路径」、2022「图的连通性」
- ★ [8688](https://accoding.buaa.edu.cn/problem/8688/index) 打印准考证（E4 第3/10）= §三 第 10 条
- ★ [8684](https://accoding.buaa.edu.cn/problem/8684/index) 魔法舞步（E4 第6/10，26%、85%）—— 「每次恰好走 3 条边」→ 拆点/分层 BFS
- [8608](https://accoding.buaa.edu.cn/problem/8608/index) TOPO!【尾】（C4 第8/10，通过率 72%，你已 AC）—— 题库里唯一的拓扑排序题，虽属压轴但值得会；[8606](https://accoding.buaa.edu.cn/problem/8606/index) 简单的图图（C4 第5/10，Floyd）

**⑦ 并查集 / 最小生成树** —— 6系 2022「图的连通性查询」
- ✅ [8871](https://accoding.buaa.edu.cn/problem/8871/index) 克鲁斯卡尔与普莱姆（C6 第1/10，通过率 95%）—— Kruskal 模板
- ❌ [8944](https://accoding.buaa.edu.cn/problem/8944/index) 收作业！（C7 第7/11，24%、56%）—— **你交过 9 次没过，最值得重做的一道**

**⑧ 堆 / 优先队列** —— 6系 2022「数组与堆」
- ✅ [8279](https://accoding.buaa.edu.cn/problem/8279/index) 简单的堆（C2 第3/11，通过率 74%）—— 已列入「盲写复现」清单

**⑨ 树 / BST / 层序遍历 / Huffman** —— ⚠️ **两门课题库几乎空缺，必须外部补**
- 题库内只有 [8235](https://accoding.buaa.edu.cn/problem/8235/index) tree tree de（E1 压轴）和 [8475](https://accoding.buaa.edu.cn/problem/8475/index) OBST（区间 DP，不是树的遍历）
- 6系明确考过：**完全二叉排序树的层序遍历**（2025）、**Huffman 编码解码 + 层序输出**（2024）、**三叉树最短路径 + 优先级路径输出**（2025 / 2020 同源）
- 练法：拿 `13_保研/往届资料/6系2020年推免复试参考资料.pdf` 第 2 题 + 2024/2025 回忆题面手写；LeetCode 对照刷 [102 层序遍历]、[98 验证 BST]、[108 有序数组转 BST]、[1167 连接棒材的最低费用]（哈夫曼思想）

**⑩ 矩阵 / 二维模拟** —— 6系 2024「旋转矩阵」「八皇后」
- [7087](https://accoding.buaa.edu.cn/problem/7087/index) 生成扫雷地图 = §三 第 4 条；[7328](https://accoding.buaa.edu.cn/problem/7328/index) 摩卡与数独 2023（程设 E7 第5/10，逐行/列/宫校验）；[7335](https://accoding.buaa.edu.cn/problem/7335/index) 小亮学矩阵加减法（程设 C7 第2/10）

**⑪ 链表 / 结构体模拟** —— 6系 2021「空闲块」（循环链表模拟）
- [7388](https://accoding.buaa.edu.cn/problem/7388/index) 多项式相加 2023 = §三 第 5 条；[8186](https://accoding.buaa.edu.cn/problem/8186/index) 多项式合并（C1 第6/10）；[8191](https://accoding.buaa.edu.cn/problem/8191/index) 莫卡与一元多项式（C1 第5/10）

**⑫ 贪心** —— 21系 D「完全图 MST」实为数学分类讨论
- ✅ [8942](https://accoding.buaa.edu.cn/problem/8942/index) 复习安排（C7 第5/11，通过率 83%）—— 区间调度
- ✅ [8941](https://accoding.buaa.edu.cn/problem/8941/index) 数列配对（C7 第4/11，85%）—— 排序 + 双指针
- ✅ [8601](https://accoding.buaa.edu.cn/problem/8601/index) 贪心の食客（C4 第1/10，98%）—— 按单位价值排序（分数背包）

**⑬ 思维 / 分类讨论（没板子可套，21系最爱）**
- ✅ [8741](https://accoding.buaa.edu.cn/problem/8741/index) 三点共线（C5 第1/10，通过率 99%）
- ✅ [8243](https://accoding.buaa.edu.cn/problem/8243/index) 莫卡和序列（E1 第4/10，84%）
- ✅ [8455](https://accoding.buaa.edu.cn/problem/8455/index) 2024-杀戮尖塔（E2 第3/11，85%）

**⑭ 高精度** —— 6系 2024「阶乘和」
- ✅ [8285](https://accoding.buaa.edu.cn/problem/8285/index) 大数相乘（C2 第4/11，通过率 72%）

**如果只挑 3 道新题做**：★ [8305] 莫卡的龙（大模拟，通过率 78%）→ ★ [8684] 魔法舞步（分层 BFS，85%）→ ★ [8959] 字符串转转转（字符串，75%）；外加 ❌ [8944] 收作业！作为「必须攻克」的一道。



## 四、与往年真题（6系 & 21系）难度对标

> 依据：`13_保研/往届资料/` 四份 PDF——6系2020复试参考资料（机试2道真题全题面）、北航保研/考研机试题集（2021–2025 回忆题）、2023北航推免回忆（21系机试 10 题 + 6系机试 2 题）。

**真题长什么样**（按年份）：
- **6系 2020**：① 提取 C 语句中的函数调用及参数（字符串解析，含空格/表达式去空格等细节）；② 机场送站大模拟（树形结构 + 旅客优先级 + 最短路径顺序输出）——**第2题是树+模拟的综合大题**
- **6系 2022**：二进制序列四则模拟、图的连通性查询（**并查集**）、m 段不相交子段最大和（DP）、神奇的 2 的幂（DP 计数）、二维蓄水池接雨水（堆/思维）、数组与堆（判断 Max/Min heap）、通讯录查询（哈希）、数字塔中位数、老鼠回溯路径
- **6系 2024**：Huffman 编码解码 + 树的层序输出、八皇后第 b 个字典序解、带中括号模式的字符串匹配
- **6系 2025**：**三叉树最短路径 + 优先级送站（与 2020 第2题同源，6系爱复用"树+优先级路径"大模拟）**、函数调用深度分析（栈）、复杂计算器（表达式求值=栈）、完全二叉排序树的层序遍历（BST 建树）、素数筛类（个位1素数/等差素数段/连续合数段）、旋转矩阵
- **21系 2023**（2 小时 10 题，只能 C）：A 歌词加速（scanf 读单词+模拟）；B 魔法序列（gcd 思维，题干有坑）；C 01 翻转子串变回文（思维）；D 完全图 MST 权重（表面 Kruskal 实为数学分类讨论）。当事人总结："**题目比较基础和考察思维，板子几乎没用**"。过 2~3 题即可进面试，A 题不到半数人 AC

**难度画像**：真题 ≈ Codeforces 900–1400——**字符串/模拟解析 + 思维题为主**，数据结构只用到栈、并查集、哈希、堆、BST 这类基础结构；没有 Tarjan、SPFA 判负环、AC 自动机、计算几何、FFT 这类竞赛内容；**最大的坑在实现细节、题干歧义和边界分类，不在算法本身**。

**两院"数据结构"分量对比**（6系题单按四份真题集归类去重后 31 道）：

| | [6系] 计算机学院 | [21系] 软件学院 |
|---|---|---|
| 题量 | 2 题（2020/2023 均明确） | 10 题 / 2 小时（2023） |
| 数据结构题占比 | 核心 10/31 ≈ **1/3**；含"顺带用一下"≈ **45%**（2022、2025 两年 ≥50%） | 2023 回忆出的 A–D 四题**无一道真结构题**；课程母题库 349 题中题面涉结构词仅 ≈ 1/5 |
| 原话 | "两个题，**考察数据结构**，第一题一般送分，第二题大模拟会比较复杂" | "题目比较基础和考察思维，**板子几乎没用**" |

- **6系是"真写结构"且稳定每年 1~2 道**：空闲块（链表）、图的连通性（并查集）、学生身高分配（单调栈）、数组与堆（堆）、老鼠路径/三叉树（树）、Huffman（哈夫曼+优先队列）、函数调用深度（栈）、复杂计算器（表达式求值）、完全 BST 层序（BST）。2 题制下，结构题几乎顶一半分值 → **对计院而言数据结构是主科**
- **软院是"轻量使用"**：2023 的 D 题披着 MST 皮，正解其实是数学分类讨论。但软院早年经验帖（3~4 题年份）说"字符串/数组 + 数据结构（树考频最高）"，题型在变，**别完全放掉树**
- 数据口径：6系题单来自 `往届资料/` 的保研/考研两份题集（年份为回忆标注，个别可能串年）+ 6系2020复试参考资料；21系来自 2023 推免回忆 + 两门课程题库

**与两门课题库的对齐度**：

| 对齐情况 | 说明 |
|---|---|
| 高度对齐 | 程序设计基础 C1–C8/E1–E8 的字符串解析题（对应 A 题和 6系解析题）；[8279](https://accoding.buaa.edu.cn/problem/8279/index) 简单的堆 ≈ 真题"判断 Max/Min heap"；[7421](https://accoding.buaa.edu.cn/problem/7421/index) 散列查找 ≈ 通讯录查询；[8926](https://accoding.buaa.edu.cn/problem/8926/index) 车厢调度/栈 ≈ 函数调用深度分析；[8186](https://accoding.buaa.edu.cn/problem/8186/index) 多项式合并（链表）≈ 真题"空闲块"循环链表模拟；Floyd/MST/拓扑（C4/C6）≈ 真题完全图 MST 一档 |
| ⚠️ 略超纲但值得刷 | DP 专场 C3（钢条/矩阵链/LCS/背包）——真题 2022 出过 m 段最大和，DP 是两系共同爱出的**思维题**载体，练思想不练偏题 |
| 明显超纲，时间紧可跳过 | Tarjan 缩点（8559）、SPFA 判负环（8602）、字符串自动机（8957）、二分图匹配（8955）、计算几何 C5、FFT 位逆序（8875）、半连通图/补图（E3/E4）——真题从没考到这个深度 |

**真题特有、课程题库覆盖不足的风格**（需用真题集+LeetCode 补）：
1. **大模拟**：题面长、规则多、要按规则一步步实现（6系第2题的传统艺能，2025 又考了同源题）——用 6系2020 第2题、Huffman 解码题练手感
2. **思维/分类讨论题**：21系 B/C/D 那种"看完题没板子可套"的题——刷 Codeforces 1100–1300 div3 补
3. **细节坑**：多组输入、行末空格、输出格式、题干歧义——21系 A 题"scanf 读单词"和 B 题"题干表述有误"都是死在这
4. 6系真题里反复出现**素数筛**类小题（2025 一场出 3 道）——10 分钟写完的水平要保证

## 五、备考优先级建议（结合真题对标修正）

1. **字符串/数组模拟**（程序设计基础 C1–C8）→ 对应机试第一题（21系2023 A题、6系解析题同款），务必练到手熟，坑在边界与格式；**scanf("%s") 读单词、多组输入、行末空格这些细节要形成肌肉记忆**
2. **思维/分类讨论题**（21系 B/C/D 风格）→ 课程库里对应 Special 国庆思维训练 + Review 卷；理解"板子几乎没用"的真题风格
3. **DP**（算法课 C3 全场 + 散布各场）→ 大题主力：钢条切割、矩阵链乘、LCS、背包、OBST；真题爱出 m 段最大和这类 DP 思维题
4. **图论基础**（算法课 C4–C6）→ Floyd/拓扑/MST 够用；Tarjan/负环/二分图匹配为超纲项，时间紧可跳
5. **排序/查找/哈希**（两门课都有）→ 手写快排、归并求逆序对、计数排序、线性探测哈希（真题通讯录查询同款）
6. **树**（真题高频：BST 层序、Huffman、树+优先级路径大模拟）→ 重点补：遍历（递归+非递归）、BST 构建/判定、层序、哈夫曼；**用 6系2020 第2题和 2025 三叉树题练"树+模拟"大题**
7. **栈/队列/链表**（车厢调度、多项式、汉诺塔、迷宫）→ 对应真题函数调用深度分析/表达式求值/空闲块，机试 C 语言实现要能盲写
8. **素数筛与简单数论**（6系 2025 一场 3 道）→ 埃氏筛 10 分钟成型的水平要保证
9. **Review 期末专项复习特别辑（39 题）**仍是两门课的精选复习卷，最适合直接当机试模拟卷刷

> ⚠️ 注意：链表和树在课程题库中题量偏少，但经验帖明确说机试爱考——这两块需要额外用 LeetCode/王道补充（链表反转、合并、删重；树的四种遍历、BST、LCA、深度/直径）。

## 附：全部 30 场比赛一览（点击直达题目列表）

**2023级-信息大类-程序设计基础**（17 场）：C1–C8 上机赛、E1–E8 练习赛、Special 国庆思维训练特别赛（26 题）、Review 期末专项复习特别辑（39 题）

**2023级-软件学院-算法分析与设计**（13 场）：C1–C7 上机赛（C7 为期末模拟）、E1–E6 练习赛

课程页：[程序设计基础](https://accoding.buaa.edu.cn/group/101/contest)、[23级算法](https://accoding.buaa.edu.cn/group/109/contest)

| 比赛 | 题数 | 主要考点 |
|---|---|---|
| [程程 C1](https://accoding.buaa.edu.cn/contest-ng/index.html#/997/problems) | 10 | 取模、Hello World、向量、分割平面 |
| [程程 C2](https://accoding.buaa.edu.cn/contest-ng/index.html#/1000/problems) | 10 | ASCII、乱码书信、向量计算器、Permutation |
| [程程 C3](https://accoding.buaa.edu.cn/contest-ng/index.html#/1004/problems) | 10 | 位运算、进制、异或、身份证验证 |
| [程程 C4](https://accoding.buaa.edu.cn/contest-ng/index.html#/1010/problems) | 10 | 进制、编码（AMI）、分数四则、连分数 |
| [程程 C5](https://accoding.buaa.edu.cn/contest-ng/index.html#/1013/problems) | 10 | Catalan、递归函数、汉诺塔、快速幂 |
| 程程 C6* | — | （数据缺失，平台上未抓到该场） |
| [程程 C7](https://accoding.buaa.edu.cn/contest-ng/index.html#/1019/problems) | 10 | 扫雷模拟、矩阵加减、Ex-GCD、寻找字符 |
| [程程 C8（期末模拟）](https://accoding.buaa.edu.cn/contest-ng/index.html#/1022/problems) | 10 | 期末模拟：多项式相加（链表）、汉诺塔、字典序 |
| [程程 E1](https://accoding.buaa.edu.cn/contest-ng/index.html#/999/problems) / [E2](https://accoding.buaa.edu.cn/contest-ng/index.html#/1001/problems) / [E3](https://accoding.buaa.edu.cn/contest-ng/index.html#/1007/problems) / [E4](https://accoding.buaa.edu.cn/contest-ng/index.html#/1012/problems) / [E5](https://accoding.buaa.edu.cn/contest-ng/index.html#/1015/problems) / [E6](https://accoding.buaa.edu.cn/contest-ng/index.html#/1017/problems) / [E7](https://accoding.buaa.edu.cn/contest-ng/index.html#/1021/problems) / [E8](https://accoding.buaa.edu.cn/contest-ng/index.html#/1023/problems) | 各10 | 字符串解析、格雷码、分形、矩阵乘法、数独… |
| [Special 国庆思维训练](https://accoding.buaa.edu.cn/contest-ng/index.html#/1008/problems) | 26 | 思维训练：骰子、博弈、01串、五子棋 |
| [Review 期末专项复习 ⭐](https://accoding.buaa.edu.cn/contest-ng/index.html#/1027/problems) | 39 | 两门课精选复习卷（含散列查找、后缀排序、区间合并） |
| [算法 C1](https://accoding.buaa.edu.cn/contest-ng/index.html#/1095/problems) | 10 | 多项式合并（链表）、k-逆序对、阿克曼、异或 |
| [算法 C2](https://accoding.buaa.edu.cn/contest-ng/index.html#/1106/problems) | 11 | 堆、矩阵乘法/连乘、卡特兰、大数相乘、计数排序 |
| [算法 C3（DP 专场）](https://accoding.buaa.edu.cn/contest-ng/index.html#/1116/problems) | 10 | **DP 专场**：钢条切割、矩阵链乘、OBST、LCS、流水线 |
| [算法 C4（图论专场）](https://accoding.buaa.edu.cn/contest-ng/index.html#/1128/problems) | 10 | **图论专场**：最短路、拓扑、负环、贪心、切钢条 |
| [算法 C5](https://accoding.buaa.edu.cn/contest-ng/index.html#/1140/problems) | 10 | 计算几何（寄蒜几盒系列）、三点共线 |
| [算法 C6](https://accoding.buaa.edu.cn/contest-ng/index.html#/1151/problems) | 10 | 背包、MST（Kruskal/Prim）、exgcd、位逆序、多边形面积 |
| [算法 C7（期末模拟）](https://accoding.buaa.edu.cn/contest-ng/index.html#/1159/problems) | 11 | **期末模拟**：车厢调度（栈）、复习安排（贪心）、路线规划、卷积 |
| [算法 E1](https://accoding.buaa.edu.cn/contest-ng/index.html#/1101/problems) / [E2](https://accoding.buaa.edu.cn/contest-ng/index.html#/1112/problems) / [E3](https://accoding.buaa.edu.cn/contest-ng/index.html#/1124/problems) / [E4](https://accoding.buaa.edu.cn/contest-ng/index.html#/1138/problems) / [E5](https://accoding.buaa.edu.cn/contest-ng/index.html#/1148/problems) / [E6](https://accoding.buaa.edu.cn/contest-ng/index.html#/1158/problems) | 各10–11 | 树、字符串自动机、回文、二分图匹配、补图、半连通图、贝叶斯网络 |


## 附 B：平台提交记录（机器抓取 2026-09-16，非自评）

> ⚠️ 这只是 accoding 平台上的评测记录，**只说明"平台上过没过"，不代表"现在能不能独立写出来"**（很多题是一两年前做的）。**不要和上面你自己标的 ✅/❌ 混为一谈。**
> 抓取范围：§二 索引内 96 题。程序设计基础那 17 场的提交记录在平台侧是空的（你自己清过），所以程设题大多显示"无记录"——不是你没做，是记录没了。
> 例：8449、8475 你自己标的是 ❌（当时没想出思路 / 写太慢），平台上后来是过了的——**两者说的不是一回事**，不冲突。

**① 平台显示已通过（36 题）**

8186、8191、8926、8449、8180、8235、8475、8279、8606、8608、
8602、8871、8559、8956、8689、8447、8188、8287、8262、8193、
8874、8875、8471、8607、8474、8286、8557、8469、8242、8604、
8942、8601、8285、8957、8456、8454

**② 平台显示提交未通过（3 题）**

- [8846] 背包糕手 —— 多重背包，值得补（§三 第 8 条）
- [8964] 路线规划 —— 本质是最大流，超纲
- [8966] 数列询问 —— 本质是 FFT 卷积，超纲

**③ 平台无记录（57 题，括号里是该题平台通过率）**

7388(12/12)、7049(33/33)、7302(9/9)、7393(6/6)、7291(10/10)、7274(9/9)、8281(26/32)、8477(15/22)、7415(10/12)、7449、
8690(15/26)、8616(12/20)、8955(4/5)、7421、7420、7379(13/14)、7456、7454、7457、7455、
7364(8/11)、7283(2/3)、7362(5/6)、7103(5/5)、7254(9/9)、8503(80/89)、8470(24/29)、7235(2/2)、7341、8278(14/26)、
7277(5/5)、7228(2/2)、7227(12/12)、7160(5/6)、7209(8/8)、7259、7078(20/21)、7079(13/14)、7203(6/6)、7162、
7370(6/6)、7205、7253(5/7)、7322(4/5)、7229(2/2)、8958(43/61)、8959(29/35)、8961(14/18)、7223、8960(15/19)、
7346(13/13)、7092(6/7)、7215(7/8)、7270、7330(7/7)、7087(6/7)、7337(11/12)

> 通过率的分母是**全平台**做过该题的人；程设课分母很小（信息大类只有 2~33 人做过），**别拿它当难度参照**。