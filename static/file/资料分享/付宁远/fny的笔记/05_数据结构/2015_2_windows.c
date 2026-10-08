/* 2015 年北航复试上机 题目二：模拟鼠标点击窗口
 * 考点：模拟 + 顺序表（“把被点窗口提到最前”用数组搬移）
 * 输入 n，接着 n 行「ID 右下x 右下y 左上x 左上y」（先输入的在上层）
 *      再输入 m，接着 m 行点击坐标
 * 每次点击：从最上层往下找第一个包含该点的窗口（边框也算，即闭区间），
 *           命中则把它提到最上层（点到桌面或本来就最上层则什么都不做）
 * 输出：最终从上到下的窗口 ID，每个 ID 后跟一个空格，末尾换行
 */
#include <stdio.h>

#define MAXN 10005

static int id[MAXN], rx[MAXN], ry[MAXN], lx[MAXN], ly[MAXN];
static int ord[MAXN];                 /* ord[0] 是最上层窗口的下标 */

int main(void) {
    int n, m, i, k, px, py, hit, tmp;

    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        scanf("%d %d %d %d %d", &id[i], &rx[i], &ry[i], &lx[i], &ly[i]);
        ord[i] = i;                   /* 下标越小越靠上（先输入的在上） */
    }
    scanf("%d", &m);
    for (i = 0; i < m; i++) {
        scanf("%d %d", &px, &py);
        hit = -1;
        for (k = 0; k < n; k++) {     /* 从上往下扫，第一个命中的就是被点的那个 */
            int j = ord[k];
            if (px >= lx[j] && px <= rx[j] && py >= ry[j] && py <= ly[j]) { hit = k; break; }
        }
        if (hit > 0) {                /* 命中且不是最上层：搬到最前 */
            tmp = ord[hit];
            for (k = hit; k > 0; k--) ord[k] = ord[k - 1];
            ord[0] = tmp;
        }
    }
    for (k = 0; k < n; k++) printf("%d ", id[ord[k]]);
    putchar('\n');
    return 0;
}
