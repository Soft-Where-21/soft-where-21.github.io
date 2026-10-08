/* 2021 年北航复试上机 题目一：空闲块链表的 Best Fit 分配
 * 考点：双向循环链表模拟（用数组 + next/prev 下标即可）
 * 规则：从当前位置开始沿循环链表走一圈，找「长度 >= 请求」的最小块（并列取先遇到的）；
 *       恰好相等 → 删除该块，当前位置 = 被删块的下一块；
 *       大于 → 长度减去请求值，起点不变，当前位置 = 该块；
 *       找不到 → 忽略本次请求，当前位置不变。
 * 输出：从当前位置开始沿链表打印每个空闲块的「起始位置 长度」
 */
#include <stdio.h>

#define MAXN 1005

static int st[MAXN], ln[MAXN], nxt[MAXN], prv[MAXN];

int main(void) {
    int n, i, q, best, x, cur;

    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) scanf("%d %d", &st[i], &ln[i]);
    for (i = 0; i < n; i++) {                      /* 建成循环双向链表 */
        nxt[i] = (i + 1) % n;
        prv[i] = (i - 1 + n) % n;
    }
    cur = 0;                                       /* 初始位置：地址最小的第一块 */

    while (scanf("%d", &q) == 1 && q != -1) {
        best = -1;
        x = cur;                                   /* 从当前位置开始，恰好走一圈 */
        do {
            if (ln[x] >= q && (best < 0 || ln[x] < ln[best])) best = x;
            x = nxt[x];
        } while (x != cur);

        if (best >= 0) {
            ln[best] -= q;                         /* 剩余部分留在原位置（起点不变） */
            if (ln[best] == 0) {                   /* 恰好用完 → 从链表中摘掉 */
                nxt[prv[best]] = nxt[best];
                prv[nxt[best]] = prv[best];
                cur = nxt[best];
                n--;                               /* 注意：删除后别再用 nxt[best] 之外的旧指针 */
            } else {
                cur = best;
            }
        }
    }

    x = cur;
    for (i = 0; i < n; i++) {                      /* 从当前位置开始打印 */
        printf("%d %d\n", st[x], ln[x]);
        x = nxt[x];
    }
    return 0;
}
