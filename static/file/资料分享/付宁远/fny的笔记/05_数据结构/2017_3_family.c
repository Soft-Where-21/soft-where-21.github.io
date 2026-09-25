/* 2017 年北航复试上机 题目三：找家谱成员
 * 考点：二叉树 + LCA（只要父指针 + 深度：先把深的那个提到同一层，再一起往上走）
 * 输入：若干行「成员 孩子1 孩子2」（第一行第一个成员是根；父成员一定先出现过）
 *       最后一行为查询，且这行只有两个名字
 * 输出：最近共同祖先的名字 + 两人的层次差
 */
#include <stdio.h>
#include <string.h>

#define MAXN 10005
#define MAXL 64

static char nm[MAXN][MAXL];
static int  par[MAXN], dep[MAXN];
static int  n = 0;

static int find(const char *s) {
    int i;
    for (i = 0; i < n; i++) if (strcmp(nm[i], s) == 0) return i;
    return -1;
}

static int get(const char *s) {              /* 按名字取结点，不存在就新建 */
    int i = find(s);
    if (i >= 0) return i;
    strcpy(nm[n], s);
    par[n] = -1;
    dep[n] = 1;                              /* 根那一行先建，随后会被 father 覆盖为正确深度 */
    return n++;
}

int main(void) {
    static char line[4096];
    char tok[3][MAXL];
    int  a, b, d, u, v;

    while (fgets(line, sizeof line, stdin) != NULL) {
        int i = 0, nt = 0, k;

        while (line[i] != '\0' && nt < 3) {                 /* 拆出这一行的名字（最多 3 个） */
            while (line[i] == ' ' || line[i] == '\t'
                   || line[i] == '\n' || line[i] == '\r') i++;
            if (line[i] == '\0') break;
            k = 0;
            while (line[i] != '\0' && line[i] != ' ' && line[i] != '\t'
                   && line[i] != '\n' && line[i] != '\r' && k < MAXL - 1)
                tok[nt][k++] = line[i++];
            tok[nt][k] = '\0';
            nt++;
        }
        if (nt < 2) continue;                               /* 空行 */

        if (nt == 2) {                                      /* 只有两个名字 → 查询行 */
            a = find(tok[0]);
            b = find(tok[1]);
            if (a < 0 || b < 0) continue;
            d = dep[a] - dep[b];
            if (d < 0) d = -d;                              /* 层次差（取正） */
            u = a; v = b;
            while (dep[u] > dep[v]) u = par[u];             /* 深的先上溯到同层 */
            while (dep[v] > dep[u]) v = par[v];
            while (u != v) { u = par[u]; v = par[v]; }      /* 同步上溯，相遇处即 LCA */
            printf("%s %d\n", nm[u], d);
            break;                                          /* 查询只有一次 */
        }

        v = get(tok[0]);                                    /* 建树：父 + 两个孩子 */
        u = get(tok[1]); par[u] = v; dep[u] = dep[v] + 1;
        if (nt == 3) { u = get(tok[2]); par[u] = v; dep[u] = dep[v] + 1; }
    }
    return 0;
}
