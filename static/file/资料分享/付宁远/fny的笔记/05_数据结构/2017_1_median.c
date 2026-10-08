/* 2017 年北航复试上机 题目一：中位数的位置
 * 考点：结构体排序（值 + 原始输入次序）
 * 输入 N（1 <= N < 10^6）和 N 个无序数
 * 输出非递减序的中位数，以及它在输入里的次序：
 *   N 为奇数 → 一行（最中间那个）；N 为偶数 → 两行（中间两个，先小后大）
 *   数值相同时，先输入的排前面
 */
#include <stdio.h>
#include <stdlib.h>

#define MAXN 1000005

typedef struct { int v, t; } P;        /* v：数值；t：输入次序（从 1 开始） */

static P a[MAXN];

static int cmp(const void *A, const void *B) {
    const P *x = (const P *)A, *y = (const P *)B;
    if (x->v != y->v) return x->v < y->v ? -1 : 1;
    return x->t - y->t;                /* 同值时按输入次序，稳定 */
}

int main(void) {
    int n, i;

    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) { scanf("%d", &a[i].v); a[i].t = i + 1; }
    qsort(a, n, sizeof a[0], cmp);

    if (n % 2 == 1) {
        printf("%d %d\n", a[n / 2].v, a[n / 2].t);
    } else {
        printf("%d %d\n", a[n / 2 - 1].v, a[n / 2 - 1].t);
        printf("%d %d\n", a[n / 2].v, a[n / 2].t);
    }
    return 0;
}
