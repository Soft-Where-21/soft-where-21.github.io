/* 2019 年北航复试上机 题目二：按优先级送客户并输出每段路径
 * 考点：树上的唯一路径 = 两点的 LCA 上溯 + 下行；优先级排序
 * 输入 n（< 10000）和 n 行「分叉结点 孩子1 孩子2 孩子3」（-1 表示无；第一行第一个是根）
 *      再输入 m 和 m 行「目标叶结点 优先级」（数值越小越优先，不并列）
 * 输出：把整条行车路线按“一段一行”展开：起点先单独打印，之后每段打印
 *       「从上一个位置到目标」经过的结点（不含起点、含目标）；最后一段是「从最后一个目标回起点」
 *
 * ★ 建树四步（本题最麻烦的地方，和 2018 年题目二同一套路）
 *   ① 读入时把「分叉结点编号」和「孩子编号」全部收集进 all[]——只是攒编号，还没建树；
 *   ② all[] 排序 + 原地去重，得到全树的编号集合；vid[i] = 第 i 个编号（输出时要靠它还原）；
 *   ③ 二分 idx(编号) 把每条边翻译成「下标」：kid[u][k] 存孩子下标，同时 par[孩子] = u；
 *   ④ 从根 BFS 一遍算出 dep[]（有了 par[] 和 dep[]，后面 LCA 才能用）。
 * 为什么要这么绕：题面没限定结点编号范围，既可能从 1 开始也可能从 100 开始、还可能不连续，
 *   所以不能拿编号直接当数组下标（那样会开出一个巨大的空洞数组）。
 *   一律翻译成 0..nid-1 的下标再做事，输出时用 vid[] 换回编号。
 */
#include <stdio.h>
#include <stdlib.h>

#define MAXN 40005                      /* n < 10000：节点池 3n+1；all[] 要装 4n 个编号（每行 1 父 + 至多 3 子） */

/* ================= 第 ① ② 步用到的表（原始输入与编号集合） ================= */
static int fid[MAXN], ch[MAXN][3];      /* ① 原始输入：fid[i] = 第 i 行的分叉结点，ch[i][0..2] = 它三个孩子（-1 为空） */
static int all[MAXN], na = 0;           /* ① 所有出现过的编号（父和子都塞进来），后面排序去重 */
static int vid[MAXN];                   /* ② 下标 → 编号：vid[下标] = 原始编号，输出时用它换回来 */
static int nid = 0;                     /* ② 去重后的编号个数 = 树的实际结点数 */

/* ================= 第 ③ ④ 步真正要用的树（全部用下标表达，不用指针） ================= */
static int kid[MAXN][3];                /* ③ 孩子表：kid[u][k] = 孩子下标，-1 表示该位为空 */
static int par[MAXN];                   /* ③ 父指针：par[v] = v 的父亲下标（LCA 上溯全靠它） */
static int dep[MAXN];                   /* ④ 深度：dep[根] = 0，BFS 一层层算出来 */

static int cid[MAXN], cpri[MAXN];       /* 客户：目标叶子（原始编号）+ 优先级 */
static int q[MAXN];                     /* BFS 用的队列（静态数组，不写 STL） */

static int cmp(const void *A, const void *B) { return *(const int *)A - *(const int *)B; }

static int idx(int v) {                 /* ③ 编号 → 下标：在去重后的 all[] 里二分查找 */
    int lo = 0, hi = na - 1, mid;
    while (lo <= hi) {
        mid = (lo + hi) / 2;
        if (all[mid] == v) return mid;
        if (all[mid] < v) lo = mid + 1; else hi = mid - 1;
    }
    return -1;                          /* 理论上查不到（编号都收集过了），留个返回值防身 */
}

/* 打印从 u 到 v 的路径：跳过 u、包含 v。
 * sep=1 表示本行前面已有内容（每个数前面补空格）；sep=0 表示本行从空开始。 */
static void walk(int u, int v, int sep) {
    static int st[MAXN];
    int x, a = u, b = v, sp = 0;

    while (dep[a] > dep[b]) a = par[a];                 /* 先对齐深度 */
    while (dep[b] > dep[a]) b = par[b];
    while (a != b) { a = par[a]; b = par[b]; }          /* a = LCA */

    if (u != a) {                                       /* 起点就是 LCA 时没有上行段 */
        for (x = par[u]; x != a; x = par[x]) {
            if (sep) putchar(' ');
            printf("%d", vid[x]);
            sep = 1;                                    /* 上行段（不含 LCA） */
        }
        if (sep) putchar(' ');
        printf("%d", vid[a]);                           /* LCA 本身 */
        sep = 1;
    }
    for (x = v; x != a; x = par[x]) st[sp++] = x;       /* 下行段自下而上收集 */
    while (sp > 0) {
        if (sep) putchar(' ');
        printf("%d", vid[st[--sp]]);                    /* 倒着打就是下行顺序 */
        sep = 1;
    }
}

int main(void) {
    int n, m, i, j, k, root, head, tail, cur, t;

    /* ---------- 第 ① 步：读入 + 把编号全部收集起来 ---------- */
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        scanf("%d %d %d %d", &fid[i], &ch[i][0], &ch[i][1], &ch[i][2]);
        all[na++] = fid[i];                                 /* 分叉结点编号 */
        for (k = 0; k < 3; k++)
            if (ch[i][k] >= 0) all[na++] = ch[i][k];        /* -1 不是编号，不收进来 */
    }
    scanf("%d", &m);
    for (i = 0; i < m; i++) scanf("%d %d", &cid[i], &cpri[i]);
    /* 客户的目标是叶结点，它一定已作为某行的孩子被收进 all[] 了，所以这里不必再收一次 */

    /* ---------- 第 ② 步：编号排序 + 原地去重 → 得到下标的取值范围 ---------- */
    qsort(all, na, sizeof all[0], cmp);                     /* 排序 */
    for (i = 1, k = 1; i < na; i++)                         /* 原地去重：只留不相邻重复的 */
        if (all[i] != all[i - 1]) all[k++] = all[i];
    na = k;
    nid = na;                                               /* nid = 树的结点数，0..nid-1 就是合法下标 */

    /* 顺手准备 vid[]（下标 → 编号）和 kid[]（先全刷 -1）。
     * ⚠️ static 数组是零初始化的，而「空孩子」要的是 -1 而不是 0，
     *    所以必须在这里显式刷一遍，不能指望默认值。 */
    for (i = 0; i < nid; i++) {
        vid[i] = all[i];
        kid[i][0] = kid[i][1] = kid[i][2] = -1;
    }

    /* ---------- 第 ③ 步：把每条边的「编号」翻译成「下标」，同时建孩子表和父指针 ---------- */
    for (i = 0; i < n; i++) {
        int u = idx(fid[i]);                                /* 本行分叉结点对应的下标 */
        for (k = 0; k < 3; k++) {
            kid[u][k] = (ch[i][k] < 0) ? -1 : idx(ch[i][k]);/* -1 留空，否则翻译成下标 */
            if (kid[u][k] >= 0) par[kid[u][k]] = u;         /* 孩子的父亲就是这个下标 u */
        }
    }
    root = idx(fid[0]);                                     /* 题面：第一行第一个结点是根 */
    /* 这一步只依赖「编号 → 下标」的映射，和输入行的先后顺序无关：
     * 某个分叉可能先作为别人的孩子出现、之后才有自己那一行，也可能反过来，都不影响结果。
     * 父指针直接赋值（而不是「判断是否已有父亲再挂」）的依据是题面保证「输入的结点至多有一个父节点」。 */

    /* ---------- 第 ④ 步：从根 BFS 一遍，算出每个结点的深度 ---------- */
    /* 为什么必须「建完树再 BFS」，而不能边读边算 dep：
     *   输入行的顺序不保证父在子之前（题面只保证了「至多一个父亲」），
     *   读到某个子结点时，它的父可能还没被翻译成下标、深度自然也推不出来。
     *   先建完树，再从根出发，就一定是父先于子，深度就对了。
     * 用 BFS 而不是递归的原因：树可能退化成一条长链，BFS 不占调用栈。 */
    head = tail = 0;
    dep[root] = 0;                                          /* 根深度记 0（记 1 也行，LCA 只用到差值） */
    q[tail++] = root;
    while (head < tail) {
        int u = q[head++];
        for (k = 0; k < 3; k++)
            if (kid[u][k] >= 0) {
                dep[kid[u][k]] = dep[u] + 1;
                q[tail++] = kid[u][k];
            }
    }
    /* 孩子按 0→2 的顺序入队，所以出队顺序天然就是「从上到下、同层从左到右」的层次遍历序。 */

    for (i = 0; i < m; i++) {                           /* 按优先级升序（m 很小，选择排序够用） */
        int bi = i;
        for (j = i + 1; j < m; j++) if (cpri[j] < cpri[bi]) bi = j;
        if (bi != i) {
            t = cpri[i]; cpri[i] = cpri[bi]; cpri[bi] = t;
            t = cid[i];  cid[i]  = cid[bi];  cid[bi]  = t;
        }
    }

    cur = root;
    printf("%d", vid[cur]);                             /* 起点先单独打一次 */
    for (i = 0; i < m; i++) {
        walk(cur, idx(cid[i]), i == 0);                 /* 第 1 段接着起点那一行往后写 */
        putchar('\n');
        cur = idx(cid[i]);                              /* 本段终点变下一段起点（下标形式） */
    }
    walk(cur, root, 0); putchar('\n');                  /* 最后把车送回起点 */
    return 0;
}
