/* 2018 年北航复试上机 题目二：三叉树前序遍历统计
 * 考点：多叉树建树（编号 → 下标映射，用“编号排序 + 二分”代替 map）+ 前序遍历
 * 输入 n（< 10000）和 n 行「根 左孩子 中孩子 右孩子」（-1 表示无；根一定在之前出现过）
 * 输出：前序遍历里「子分支（非空孩子）最多」的结点编号，以及它第几次被遍历到
 *       并列时取深度更深者，再并列取先遍历到的
 */
#include <stdio.h>
#include <stdlib.h>

#define MAXN 10005

static int kid[MAXN][3];        /* 三个孩子的下标，-1 表示空 */
static int vid[MAXN];           /* 下标 → 结点编号 */
static int all[MAXN], na = 0;   /* 所有出现过的编号（排序后二分查找） */
static int nid = 0;
static int dep[MAXN], cnt[MAXN], hgt[MAXN];
static int order = 0;
static int bc = -1, bd = -1, bn = -1, bo = 0;   /* 目前最好的：孩子数 / 深度 / 编号 / 遍历序号 */

static int fid[MAXN], ch[MAXN][3];              /* 原始输入 */

static int cmp(const void *A, const void *B) { return *(const int *)A - *(const int *)B; }

static int idx(int v) {                         /* 编号 → 下标 */
    int lo = 0, hi = na - 1, mid;
    while (lo <= hi) {
        mid = (lo + hi) / 2;
        if (all[mid] == v) return mid;
        if (all[mid] < v) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}

static int height(int u) {                      /* 子树高度（叶子为 0），记忆化 */
    int k, h = -1, t;
    if (hgt[u] >= 0) return hgt[u];
    for (k = 0; k < 3; k++)
        if (kid[u][k] >= 0) { t = height(kid[u][k]); if (t > h) h = t; }
    return hgt[u] = h + 1;
}

static void pre(int u, int d) {                 /* 前序：根、左、中、右 */
    int k;
    if (u < 0) return;
    dep[u] = d;
    order++;
    cnt[u] = 0;
    for (k = 0; k < 3; k++) if (kid[u][k] >= 0) cnt[u]++;

    /* 先比孩子数，再比深度（更深者优先）；先遍历到的自然先占位，并列时不替换 */
    if (cnt[u] > bc || (cnt[u] == bc && d > bd)) { bc = cnt[u]; bd = d; bn = u; bo = order; }

    for (k = 0; k < 3; k++) pre(kid[u][k], d + 1);
}

int main(void) {
    int n, i, k, root;

    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        scanf("%d %d %d %d", &fid[i], &ch[i][0], &ch[i][1], &ch[i][2]);
        all[na++] = fid[i];
        for (k = 0; k < 3; k++) if (ch[i][k] >= 0) all[na++] = ch[i][k];
    }
    root = fid[0];                              /* 第一行第一个是树根 */

    qsort(all, na, sizeof all[0], cmp);         /* 编号排序去重，之后用二分映射 */
    for (i = 1, k = 1; i < na; i++) if (all[i] != all[i - 1]) all[k++] = all[i];
    na = k;
    nid = na;
    for (i = 0; i < nid; i++) {
        vid[i] = all[i];
        kid[i][0] = kid[i][1] = kid[i][2] = -1;
    }
    for (i = 0; i < n; i++) {
        int u = idx(fid[i]);
        for (k = 0; k < 3; k++) kid[u][k] = (ch[i][k] < 0) ? -1 : idx(ch[i][k]);
    }

    height(idx(root));                          /* 先算好每个结点的子树高度（本题其实用不到） */
    pre(idx(root), 1);                          /* 深度从 1 开始数 */

    printf("%d %d\n", vid[bn], bo);
    return 0;
}
