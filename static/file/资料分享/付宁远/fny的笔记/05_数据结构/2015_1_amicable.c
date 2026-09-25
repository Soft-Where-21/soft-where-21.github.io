/* 2015 年北航复试上机 题目一：相亲数（亲和数）
 * 考点：因子枚举（扫描到 n/2）
 * 输入 a b（1 < a,b < 1000000）
 * 输出：两行「a, 1+2+...+x=sum」，因子从小到大；再一行 1/0 表示是否互为对方因子和
 * 注意：1 是因子（要计入和），本身不算；输出是边枚举边打印，不用存因子
 */
#include <stdio.h>

int main(void) {
    int a, b, sumA = 1, sumB = 1, i;

    if (scanf("%d %d", &a, &b) != 2) return 0;

    printf("%d, 1", a);                       /* 1 必定是因子，先打出来 */
    for (i = 2; i <= a / 2; i++)
        if (a % i == 0) { sumA += i; printf("+%d", i); }
    printf("=%d\n", sumA);

    printf("%d, 1", b);
    for (i = 2; i <= b / 2; i++)
        if (b % i == 0) { sumB += i; printf("+%d", i); }
    printf("=%d\n", sumB);

    printf("%d\n", (sumA == b && sumB == a) ? 1 : 0);   /* 两个方向都要判 */
    return 0;
}
