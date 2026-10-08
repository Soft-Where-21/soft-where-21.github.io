# `G` Matrix53的博弈

## 题意

给出一个有根树，从根节点依次进行最大最小选择，输出走到的叶节点的胜率。最大最小选择指：每次选择具有最大/最小胜率的叶节点的子树。

## 题解

##### 思路

树形DP。

记录每个节点从当前节点出发时最终的胜率。对于每个节点$i$，有两种出发状态，分别为当前是Matrix53行棋与Alex行棋，故每个节点存两个胜率,分别存在$dp[i][0]$与$dp[i][1]$。

对于任一节点$f$，当$f$为叶节点时，$dp[f][0]=dp[f][1]=win\_rate_f$；当$f$不为叶节点时，令其子节点为$p_i$，当$f$点为Matrix53行棋时，他会选择具有最大胜率的子节点,而子节点是由Alex行棋，也即有$dp[f][0]=max(dp[p_i][1])$，同理，当f点为Alex行棋时，有$dp[f][1]=min(dp[p_i][0])$。

最后使用拓扑排序依次把状态从叶节点转移至根节点，输出$dp[1][0]$即可。

##### 复杂度分析

由于一共n个节点，所以需要转移n次状态，每次状态转移需要$O(1)$，故总复杂度$O(n)$。

## 代码

```cpp
#include <iostream>
#include <cstdio>
#include <ctime>

using namespace std;

char buf[1<<15],*fs,*ft;
inline char gc(){
    return (fs==ft&&(ft=(fs=buf)+fread(buf,1,1<<15,stdin),fs==ft))?0:*fs++;}

inline int gint(){
    int x=0,ch=gc();
    while(ch<'0'||ch>'9') ch=gc();
    while(ch>='0'&&ch<='9') x=(x<<1)+(x<<3)+ch-'0',ch=gc();
    return x;
}
const int MAXN=1000005;
int n,a,b;
int f[MAXN],dp[MAXN][2],degree[MAXN];
//f数组记录第i个节点的父节点，degree数组记录第i个节点的出度
int queue[MAXN],front,rear;
int main()
{
    n=gint();
    for(int i=1;i<n;i++){
        a=gint(); 		b=gint();
        degree[a]++; 	f[b]=a;
    }
    for(int i=1;i<=n;i++){//出度为0，则为叶节点，读取其胜率，否则初始化当前节点胜率
        if(!degree[i]) 	{dp[i][0]=dp[i][1]=gint(); 	queue[front++]=i; }
        else 			{dp[i][0]=0;				dp[i][1]=10000;}
    }
    while(front-rear){//！topo排序状态转移
        a=queue[rear++];
        dp[f[a]][0]=max(dp[f[a]][0],dp[a][1]);
        dp[f[a]][1]=min(dp[f[a]][1],dp[a][0]);
        if(!--degree[f[a]]) queue[front++]=f[a];
    }
    printf("%d",dp[1][0]);
}
```

