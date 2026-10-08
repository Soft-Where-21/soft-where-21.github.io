# I.对抗

笔者结合二分与归并思想，书写了本题的AC代码

以当前序列的区间中点为界，将当前序列分为左右两个子序列A、B，A B之间形成对抗分组。类似的，对每一层子序列进行以中点为界的分组，并将中点左侧子序列与同一层其他子序列进行归并，直至子序列无法再分割（即区间长度为一）

对每个子序列进行对半分组后再对同一层进行合并，故本题最小轮数为
$$
\log_2^{n}
$$
时间复杂度为O(nlogn)

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
int ans[1005][1005];
int y;//y为最少轮数
void divide(int l,int r,int depth){//l,r分别为区间左右端点，depth标记当前递归层数
    if(l>=r){
        return;
    }
    int cur=(l+r)/2;
    divide(l,cur,depth+1);//对左侧子序列进行划分
    divide(cur+1,r,depth+1);//对右侧子序列进行划分
    int ind=ans[depth][0];//二维数组每行的第一个元素用于记录该行当前数组元素的个数，当递归进行到该层时，通过这行代码获取元素个数
    for(int i=l;i<=cur;i++){//将分组按层数存入二维数组对应行
        ans[depth][++ind]=i;
    }
    ans[depth][0]=ind;//更行当前层数元素个数
}

int main()
{
    int n;
    scanf("%d",&n);
    double x=ceil(log(n)/log(2));//计算最小轮数
    y=(int)x;
    printf("%d\n",y);
    divide(1,n,0);
  //将ans数组打印输出
    for(int i=0;i<y;i++){
        printf("%d ",ans[i][0]);
        for(int j=1;j<=ans[i][0];j++){
            printf("%d ",ans[i][j]);
        }
        printf("\n");
    }
    return 0;
}
```

