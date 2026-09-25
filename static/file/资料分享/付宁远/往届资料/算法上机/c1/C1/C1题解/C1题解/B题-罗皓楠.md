# 题意

利用秦九韶算法解决多项式的求值问题。

**勘误**：原题目背景指出“秦九韶出生于鲁郡（今山东曲阜一带人）”，但事实秦九韶出生于普州（今资阳市安岳县），而祖籍为鲁郡（今河南省范县）。秦九韶为作者家乡的名人，在此正名。



# 题解

原多项式：

$f(x) =a_nx^n + a_{n-1}x^{n-1} + a_{n-2}x^{n-2} +  ...  + a_{1}x^{1} + a_0$

可以变形为

$f(x) =(...((a_nx + a_{n-1})x + a_{n - 2})x+...+a_1)x + a_0$



因此设定初始值为 $base = a_n$ ，从$a_{n - 1}$循环到$a_0$，每次更新$base$值：$base = base*x + a_{i}$ 即可。



# 代码

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>

#define max(a,b) (((a) > (b)) ? (a) : (b))
#define min(a,b) (((a) < (b)) ? (a) : (b))

#define N 998244353

int main(void)
{
	int i,j,k;
	long long int n = 0,base = 0,x = 0;
	scanf("%lld",&n);
	long long int *a = (long long int*)malloc(sizeof(long long int)*(n + 1));
	
	for(i = n; i >= 0; --i)
    scanf("%lld",&a[i]);
	scanf("%lld",&x);
	
	base = a[n];
	for(i = n- 1; i >= 0; --i)
	base = ((base*x)%N + a[i]%N)%N;
		
	printf("%d",(int)base);
	return 0;
}
```

