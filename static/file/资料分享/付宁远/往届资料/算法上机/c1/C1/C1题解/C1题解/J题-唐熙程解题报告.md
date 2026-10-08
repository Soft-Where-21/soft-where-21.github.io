# 查找解题报告

如果能用`C++`，直接`sort+lower_bound`，但是不能。

两种方案：

1. qsort+手写二分

2. hash

我使用的链式`hash`解决冲突，散列函数和模数随意选择，不太能卡。正确性显然。时间复杂度为$O(n+T)$。

代码：

```c++
#include<stdio.h>
#include<string.h>
#define MN (1000000+5)
#define P (1423333)
//typedef long long ll;
int n,m;
int a[MN];
int to[MN*2],nxt[MN*2],h[MN*2],cnt,w[MN];
void add(int u,int v,int _w){w[cnt]=_w,to[cnt]=v,nxt[cnt]=h[u],h[u]=cnt++;}
int mix(int k){
	return ((((k<<4)|(k<<6))^(k>>2))%P+P)%P;
}
void ins(int k,int p){
	int val=mix(k);
	for(int e=h[val],v=to[e];~e;e=nxt[e],v=to[e]){
		if(v==k)return;
	}
	add(val,k,p);
}
int find(int k){
	int val=mix(k);
	for(int e=h[val],v=to[e];~e;e=nxt[e],v=to[e]){
		if(v==k)return w[e];
	}
	return -1;
}
void trump(){
	memset(h,-1,sizeof h);
	scanf("%d",&n);
	for(int i=1;i<=n;++i)
		scanf("%d",&a[i]),ins(a[i],i);
	int x;
	while(~scanf("%d",&x)){
		int f=find(x);
		if(~f)printf("%d\n",f);
		else puts("NO");
	}
}
int main(){
	trump();
	return 0;
}
```

*Author: 唐熙程20373114*

