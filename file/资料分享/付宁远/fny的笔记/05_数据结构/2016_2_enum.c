/* 2016 年北航复试上机 题目二：enum 输出
 * 考点：字符串解析 —— 找 '{'，以 ',' 切项，遇到 '=' 显式赋值，否则前一项 +1
 * 输入一行 enum 定义语句（不超过 10^6 字符，项 <= 1000，每项 <= 1000 字符）
 * 输出：每项一行「名字 值」
 */
#include <stdio.h>

static char s[1000005], name[1005];

int main(void) {
    int c, len = 0, i = 0, k, j = 0, val, last = 0;

    while ((c = getchar()) != EOF && len < 1000000) s[len++] = (char)c;
    s[len] = '\0';

    while (i < len && s[i] != '{') i++;        /* 跳过 "enum 名字"，找到 '{' 才是起点 */
    if (i < len) i++;

    while (i < len && s[i] != '}') {
        while (i < len && (s[i] == ' ' || s[i] == ',')) i++;   /* 跳过分隔符/空格 */
        if (i >= len || s[i] == '}') break;

        k = 0;                                 /* 名字：读到 '=' ',' '}' 或空格为止 */
        while (i < len && s[i] != '=' && s[i] != ',' && s[i] != '}'
               && s[i] != ' ' && k < 1000)
            name[k++] = s[i++];
        name[k] = '\0';
        while (i < len && s[i] == ' ') i++;    /* 跳过名字与 '=' 之间可能的空格 */

        if (i < len && s[i] == '=') {          /* 显式赋值 */
            i++;
            while (i < len && s[i] == ' ') i++;
            val = 0;
            while (i < len && s[i] >= '0' && s[i] <= '9') { val = val * 10 + (s[i] - '0'); i++; }
        } else {
            val = (j == 0) ? 0 : last + 1;     /* 第一项默认 0，其余前项 +1 */
        }
        printf("%s %d\n", name, val);
        last = val;
        j++;
    }
    return 0;
}
