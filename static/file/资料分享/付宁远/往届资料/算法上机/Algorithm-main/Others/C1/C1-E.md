# C1 E题题解

题目懒得复制粘贴了，直接题解。

先说一句题外话，讲题课上同学讲的方法虽然没问题，但我们其实理应是卡了这种直接存起来的方法的，但由于给的数据和范围不够强，以及那位同学不懈努力优化算法的原因，他成功AC了。其他同学也可以学习他的精神，说不定刚好能卡过AC，得一些暴力的部分分也不亏。

那么话归正题，正确的方法应是用空间换时间，将单词转化为一个二十七进制数（注意这二十六个字母没有真正意义上的0，若转化为二十六进制数，这样a,aa,aaa均为0，有误），存起来进行运算。计算时从0循环到$27^4$,也不会超时。

需要注意的是，用空间换时间是一种重要的算法思想，具体操作是将本该存入的数作为数组下标，并使值加1，代表出现次数加1。计算时则从最小数循环到最大数，适用于数据数目多但范围较小的情况。其实这种思想在E1练习赛的某道题也有所涉及（给看了这份题解的同学一个福利，就是E1-D）。

当然，这里的长度限制4也稍微简化了题目，若不限长度，用讲题课同学的方法直接存起来，其实比较字符串`strcmp`时也有复杂度O(n)，更加会超时。而对于本题正解，则不能直接用二十七进制数，而是需要用到字符串哈希的知识，转化为类似的结果，有兴趣的同学可以了解一下。

实现代码如下：

```c++
#include<bits/stdc++.h>
using namespace std;
int a[600000][3];
char s[10];
int ans[3];
int tr(char s[])
{
	int res=0;
	int len=strlen(s);
	for(int i=0;i<len;i++)
	{
		res=res*27+s[i]-'a'+1;
	}
	return res;
}
int main()
{
	int t,n;
//	freopen("4.in","r",stdin);
//	freopen("4.out","w",stdout);
	scanf("%d",&t);
	while(t--)
	{
		memset(a,0,sizeof(a));
		memset(ans,0,sizeof(ans));
		scanf("%d",&n);
		for(int j=0;j<3;j++)
		{
			for(int i=0;i<n;i++)
			{
				scanf("%s",s);
				a[tr(s)][j]++;
			}
		}
		for(int i=0;i<27*27*27*27;i++)
		{
			if(a[i][0]&&a[i][1]&&a[i][2])
			{
				continue;
			}
			else if(a[i][0]&&a[i][1])
			{
				ans[0]++;
				ans[1]++;
			}
			else if(a[i][0]&&a[i][2])
			{
				ans[0]++;
				ans[2]++;
			}
			else if(a[i][1]&&a[i][2])
			{
				ans[1]++;
				ans[2]++;
			}
			else if(a[i][0])
			{
				ans[0]+=3;
			}
			else if(a[i][1])
			{
				ans[1]+=3;
			}
			else if(a[i][2])
			{
				ans[2]+=3;
			}
		}
		for(int i=0;i<3;i++)
		{
			printf("%d ",ans[i]);
		}
		puts("");
	}
}
```

*Author:张家源*