/* 2017 年北航复试上机 题目二：查找未定义的变量
 * 考点：字符串扫描。只认“合法字符”（字母/数字/下划线），其余全当分隔符；
 *       只要一个 token 以数字开头，就整块当常数跳过（这样 a[30]、456.78 自动免疫）。
 * 输入：第 1 行变量定义语句（跳过开头的类型名，其余标识符都是已定义变量）
 *       第 2 行运算语句
 * 输出：第 2 行里出现、但第 1 行没定义的变量，每个后面跟一个空格，最后换行
 *       （一个都没有时只输出一个换行）
 */
#include <stdio.h>
#include <string.h>

#define MAXT 1005
#define MAXL 1005

static char tab[MAXT][MAXL];          /* 第 1 行定义出的变量名 */
static int  nt = 0;
static char line[1000005];            /* 变量可以很多，行缓冲开大一点 */

static int isId(int c)  { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'; }
static int isIdc(int c) { return isId(c) || (c >= '0' && c <= '9'); }

/* 把一行里的标识符收进 tab[]；skipType=1 时先跳过开头的类型名 */
static void collect(const char *s, int skipType) {
    int i = 0, len = (int)strlen(s), k;

    if (skipType) {
        while (i < len && s[i] == ' ') i++;
        while (i < len && isIdc((unsigned char)s[i])) i++;       /* 类型名（int/double/...） */
    }
    while (i < len) {
        if (isId((unsigned char)s[i])) {                          /* 标识符：不能数字开头 */
            k = 0;
            while (i < len && isIdc((unsigned char)s[i]) && k < MAXL - 1) tab[nt][k++] = s[i++];
            tab[nt][k] = '\0';
            nt++;
        } else if (s[i] >= '0' && s[i] <= '9') {                  /* 常数：整块吃掉 */
            while (i < len && ((s[i] >= '0' && s[i] <= '9') || s[i] == '.')) i++;
        } else {
            i++;                                                  /* = + - * ( ) [ ] ; & 等一律跳过 */
        }
    }
}

static int defined(const char *s) {
    int i;
    for (i = 0; i < nt; i++) if (strcmp(tab[i], s) == 0) return 1;
    return 0;
}

int main(void) {
    int i, len, k;
    char nm[MAXL];

    if (fgets(line, sizeof line, stdin) == NULL) return 0;
    collect(line, 1);                       /* 第 1 行：跳过类型，其余都是已定义变量 */

    if (fgets(line, sizeof line, stdin) == NULL) { putchar('\n'); return 0; }  /* 第 2 行可能没有分号 */
    len = (int)strlen(line);
    for (i = 0; i < len; ) {
        if (isId((unsigned char)line[i])) {
            k = 0;
            while (i < len && isIdc((unsigned char)line[i]) && k < MAXL - 1) nm[k++] = line[i++];
            nm[k] = '\0';
            if (!defined(nm)) printf("%s ", nm);      /* 未定义就打印，后面跟空格 */
        } else if (line[i] >= '0' && line[i] <= '9') {
            while (i < len && ((line[i] >= '0' && line[i] <= '9') || line[i] == '.')) i++;
        } else {
            i++;
        }
    }
    putchar('\n');
    return 0;
}
