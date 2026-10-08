/* 2019 年北航复试上机 题目二：按优先级送客户并输出每段路径
 * ★ 本版前提（题面已声明）：叶结点编号 < 100，全树结点编号 < 300
 *   → 编号可以直接当数组下标，不需要「收集编号 → 排序去重 → 二分翻译」那整套离散化。
 *
 * 求路径仍是父指针 + 深度做 LCA（与 2019_2_deliver.c 的算法完全一致），
 * 区别只在于：kid 的第一维、par/dep 的下标、输出时打印的东西，
 * 这里全都是「编号本身」，所以连 vid[] 还原都不需要。
 *
 * 编译：cc -std=c89 -Wall -Wextra -o 2019_2_deliver_byid 2019_2_deliver_byid.c
 */
#include <stdio.h>

#define MAXV 305                    /* 题面保证编号 < 300，开 305 留余量 */

/* ==================== 树：编号即下标，不做任何翻译 ==================== */
static int kid[MAXV][3];            /* kid[u][k] = 孩子编号；-1 表示该位为空 */
static int par[MAXV];               /* par[v] = 父亲的编号 */
static int dep[MAXV];               /* dep[v] = 深度，根记 0 */

/* ==================== 运行时用的表 ==================== */
static int q[MAXV];                 /* BFS 队列 */
static int stk[MAXV];               /* 打印下行段时用的栈 */
static int cid[MAXV], cpri[MAXV];   /* 客户：目标叶结点编号 + 优先级 */

/* 打印从 u 到 v 的路径：跳过 u、包含 v。
 * sep=1 表示本行前面已有内容（每个数前补空格）。 */
static void walk(int u, int v, int sep) {
    int x, a = u, b = v, sp = 0;

    while (dep[a] > dep[b]) a = par[a];                 /* ① 对齐深度 */
    while (dep[b] > dep[a]) b = par[b];
    while (a != b) { a = par[a]; b = par[b]; }          /* ② 同步上溯，相遇点 a 就是 LCA */

    if (u != a) {                                       /* 起点本身就是 LCA 时没有上行段 */
        for (x = par[u]; x != a; x = par[x]) {          /* 上行段：从起点的父走到 LCA 的父 */
            if (sep) putchar(' ');
            printf("%d", x);                            /* ★ 编号即下标，直接打印，无 vid[] */
            sep = 1;
        }
        if (sep) putchar(' ');
        printf("%d", a);                                /* LCA 本身 */
        sep = 1;
    }
    for (x = v; x != a; x = par[x]) stk[sp++] = x;      /* 下行段：自下而上收集 */
    while (sp > 0) {                                    /* 倒着弹出就是下行顺序 */
        if (sep) putchar(' ');
        printf("%d", stk[--sp]);
        sep = 1;
    }
}

int main(void) {
    int n, m, i, j, k, u, root = 0, head, tail, t, bi;

    if (scanf("%d", &n) != 1) return 0;

    /* ⚠️ static 数组是零初始化的，而「空孩子」要的是 -1 而不是 0，必须显式刷一遍 */
    for (i = 0; i < MAXV; i++) kid[i][0] = kid[i][1] = kid[i][2] = -1;

    /* ---------- 读入即建树：编号就是下标，一次遍历搞定 ----------
     * 对比原版：原版要先把 fid[]/ch[][] 存下来 → 收集 all[] → qsort → 去重
     *           → 再遍历一遍用 idx() 翻译；这里全部省掉。 */
    for (i = 0; i < n; i++) {
        int f, c0, c1, c2;
        scanf("%d %d %d %d", &f, &c0, &c1, &c2);
        if (i == 0) root = f;                           /* 题面：第一行第一个结点是根 */
        kid[f][0] = c0; kid[f][1] = c1; kid[f][2] = c2; /* -1 原样存着，遍历时用 >= 0 判 */
        if (c0 >= 0) par[c0] = f;                       /* 题面保证至多一个父，可直接赋值 */
        if (c1 >= 0) par[c1] = f;
        if (c2 >= 0) par[c2] = f;
    }

    scanf("%d", &m);
    for (i = 0; i < m; i++) scanf("%d %d", &cid[i], &cpri[i]);

    /* ---------- 从根 BFS 一遍算出深度 ----------
     * 必须等树建完再算：输入行的顺序不保证父在子之前。 */
    head = tail = 0;
    dep[root] = 0;
    q[tail++] = root;
    while (head < tail) {
        u = q[head++];
        for (k = 0; k < 3; k++)
            if (kid[u][k] >= 0) {
                dep[kid[u][k]] = dep[u] + 1;
                q[tail++] = kid[u][k];
            }
    }

    /* ---------- 客户按优先级升序（m 很小，选择排序够用） ---------- */
    for (i = 0; i < m; i++) {
        bi = i;
        for (j = i + 1; j < m; j++) if (cpri[j] < cpri[bi]) bi = j;
        if (bi != i) {
            t = cpri[i]; cpri[i] = cpri[bi]; cpri[bi] = t;
            t = cid[i];  cid[i]  = cid[bi];  cid[bi]  = t;
        }
    }

    /* ---------- 逐段输出 ---------- */
    u = root;
    printf("%d", u);                                    /* 起点先单独打一次 */
    for (i = 0; i < m; i++) {
        walk(u, cid[i], i == 0);                        /* 第 1 段接在起点那一行往后写 */
        putchar('\n');
        u = cid[i];                                     /* 本段终点变成下一段起点 */
    }
    walk(u, root, 0); putchar('\n');                    /* 最后把车送回起点 */
    return 0;
}
