/* 2016 年北航复试上机 题目一：逆序数
 * 考点：字符串 ↔ 整数（关键在于倒序后的前导 0）
 * 输入 n（0 < n < 1000000），m = n 各位倒过来
 *   m 是 n 的整数倍（k = m/n）→ 输出「n*k=m」
 *   否则输出「n m」，其中 m 要按“数字串”打印，比如 23200 → 00232
 */
#include <stdio.h>
#include <string.h>

int main(void) {
    static char s[32], r[32];
    int n = 0, m = 0, i, len;

    if (scanf("%s", s) != 1) return 0;
    len = (int)strlen(s);
    for (i = 0; i < len; i++) n = n * 10 + (s[i] - '0');
    for (i = 0; i < len; i++) r[i] = s[len - 1 - i];     /* 倒序后的数字串 */
    r[len] = '\0';
    for (i = 0; i < len; i++) m = m * 10 + (r[i] - '0'); /* 前导 0 在读成整数时自动消失 */

    if (m % n == 0) printf("%d*%d=%d\n", n, m / n, m);
    else            printf("%d %s\n", n, r);             /* 必须按串打印，保住前导 0 */
    return 0;
}
