/* 2018 年北航复试上机 题目一：首尾相接的最长线段链
 * 考点：排序 + DP（按终点接起点做记忆化，别写纯暴搜）
 * 连接规则：只能「某条线段的左端点」接「另一条线段的右端点」，且两个端点坐标完全相同
 * 输入 n（< 10000）和 n 行「左x 左y 右x 右y」（保证 右x > 左x）
 * 输出「最长链的线段条数 链起点x 链起点y」
 */
#include <stdio.h>
#include <stdlib.h>

#define MAXN 10005

typedef struct { int sx, sy, tx, ty; } S;

static S seg[MAXN];
static int f[MAXN];                     /* f[i]：以第 i 条线段开头的最长链长度 */

static int cmp(const void *A, const void *B) {
    const S *x = (const S *)A, *y = (const S *)B;
    if (x->sx != y->sx) return x->sx - y->sx;
    return x->sy - y->sy;
}

int main(void) {
    int n, i, j, best, mx = -1, mi = 0;

    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++)
        scanf("%d %d %d %d", &seg[i].sx, &seg[i].sy, &seg[i].tx, &seg[i].ty);

    qsort(seg, n, sizeof seg[0], cmp);   /* 按起点横坐标排序：后继的起点 > 本段起点 → 必在后面 */

    for (i = n - 1; i >= 0; i--) {       /* 从右往左算，后继的 f 一定已经算好 */
        best = 0;
        for (j = i + 1; j < n; j++)
            if (seg[j].sx == seg[i].tx && seg[j].sy == seg[i].ty && f[j] > best)
                best = f[j];
        f[i] = best + 1;
    }

    for (i = 0; i < n; i++)              /* 取最长链；长度并列取排序后靠前的起点 */
        if (f[i] > mx) { mx = f[i]; mi = i; }

    printf("%d %d %d\n", mx, seg[mi].sx, seg[mi].sy);
    return 0;
}
