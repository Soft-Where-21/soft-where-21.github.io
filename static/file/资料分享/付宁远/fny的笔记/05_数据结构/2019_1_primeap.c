/* 2019 年北航复试上机 题目一：相邻素数组成的等差数列
 * 考点：素数筛（埃氏筛打表）+ 线性扫描
 * 输入 a b（1 <= a,b < 100000）
 * 输出所有「由相邻素数组成、长度 >= 3」的等差数列，一行一个，
 *       每个数后跟一个空格；长度超过 3 的只输出最长的那一个（不输出其子序列）
 * 坑：1 不是素数（筛法里天然满足）；尾巴要卡住 b 这个上界
 */
#include <stdio.h>

#define MAXV 100005

static char comp[MAXV];        /* comp[i]=1 表示 i 不是素数 */
static int  pr[10000], np = 0; /* 素数表 */

int main(void) {
    int a, b, i, j;

    comp[1] = 1;                                  /* 特判 1 */
    for (i = 2; i < MAXV; i++)                    /* 埃氏筛 */
        if (!comp[i]) {
            pr[np++] = i;
            for (j = 2 * i; j < MAXV; j += i) comp[j] = 1;
        }

    if (scanf("%d %d", &a, &b) != 2) return 0;

    i = 0;
    while (i < np && pr[i] < a) i++;              /* 定位到区间内的第一个素数 */

    while (i + 2 < np && pr[i + 2] <= b) {
        if (pr[i] + pr[i + 2] == 2 * pr[i + 1]) { /* 相邻三个素数成等差 */
            printf("%d %d %d ", pr[i], pr[i + 1], pr[i + 2]);
            while (i + 3 < np && pr[i + 3] <= b && pr[i + 1] + pr[i + 3] == 2 * pr[i + 2]) {
                i++;                              /* 还能延长，就接着往后吃 */
                printf("%d ", pr[i + 2]);
            }
            printf("\n");                         /* i 停在最后一个已输出的素数上 */
        }
        i++;                                      /* 跳到下一个没输出过的素数 */
    }
    return 0;
}
