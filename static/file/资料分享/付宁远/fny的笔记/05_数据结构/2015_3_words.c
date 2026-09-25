/* 2015 年北航复试上机 题目三：统计词语
 * 考点：字符串扫描 + 去重 + 字典序排序（多点输入，读到 EOF）
 * 输入：若干行英文语段（到 EOF 结束）；单词只由小写字母组成，且不会被换行切开
 * 输出：所有不同的单词按字典序，每行一个
 */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAXW 1005      /* 单词总数 <= 1000 */
#define MAXL 105       /* 单词长度 <= 100 */

static char w[MAXW][MAXL];
static int nw = 0;

static int cmp(const void *A, const void *B) {
    return strcmp((const char *)A, (const char *)B);
}

int main(void) {
    static char line[100005];      /* 每行 <= 100000 字符，必须放静态区 */
    int i, k, j, dup;

    while (fgets(line, sizeof line, stdin) != NULL) {
        int len = (int)strlen(line);
        i = 0;
        while (i < len) {
            while (i < len && !(line[i] >= 'a' && line[i] <= 'z')) i++;   /* 跳过非字母 */
            if (i >= len) break;
            k = 0;
            while (i < len && line[i] >= 'a' && line[i] <= 'z' && k < MAXL - 1)
                w[nw][k++] = line[i++];                                   /* 取下一个单词 */
            w[nw][k] = '\0';
            if (nw >= MAXW - 1) continue;   /* 表满就丢弃后面的词，别越界 */
            dup = 0;
            for (j = 0; j < nw; j++) if (strcmp(w[j], w[nw]) == 0) { dup = 1; break; }
            if (!dup) nw++;                 /* 没有出现过才收下 */
        }
    }

    qsort(w, nw, sizeof w[0], cmp);
    for (i = 0; i < nw; i++) printf("%s\n", w[i]);
    return 0;
}
