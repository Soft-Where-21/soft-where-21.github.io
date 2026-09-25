# 题意

题目要求一定数量的2分球和3分球恰好组成一个分数，同时，2分球的数量有一定限制；我们可以将其等效为一个只有两件物品的背包问题求方案数的变种。

# 题解

众所周知，背包问题大多数时候我们选择用dp（动态规划）来解决；而dp最重要的就是状态转移方程。我们类似背包问题，设score[i] [j]为得分恰好为i，投掷了j个2分球时的方案总数；首先设置初始状态，显然一个球都没投时的方案数为1，即score[0] [0] = 1;然后列出状态转移方程：得分恰好为i的方案数为得分i-2时投一个2分球和得分i-3时投一个3分球的方案数的和，即score[i] [j] = score[i-2] [j-1]+score[i - 3] [j];列出状态转移方程后，我们按顺序枚举i j即可求得得分为i，投了j个2分球时的方案数如下。

```c
score[0][0] = 1;
for (int i = 0; i <= n - 2; i++)
{
	for (int j = 0; j < m; j++)
	{
		score[i + 2][j + 1] += score[i][j];
		score[i + 3][j] += score[i][j];
	}
	score[i + 3][m] += score[i][m];
}
```

那么，最终的答案就是得分为n时，投掷2分球个数为0~m的方案数的总和。

```c
int ans = 0;
for (int i = 0; i <= m; i++)
{
	ans += score[n][i];
}
```

# 代码

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
int score[100][10];
int main()
{
	int n , m;
	scanf("%d%d" , &n , &m);
	score[0][0] = 1;
	for (int i = 0; i <= n - 2; i++)
	{
		for (int j = 0; j < m; j++)
		{
			score[i + 2][j + 1] += score[i][j];
			score[i + 3][j] += score[i][j];
		}
		score[i + 3][m] += score[i][m];
	}
	int ans = 0;
	for (int i = 0; i <= m; i++)
	{
		ans += score[n][i];
	}
	printf("%d\n" , ans);
	return 0;
}
```
