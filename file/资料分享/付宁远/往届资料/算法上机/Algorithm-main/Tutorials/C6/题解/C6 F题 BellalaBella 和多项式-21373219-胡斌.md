



[TOC]

# `F` BellalaBella 和多项式

时间限制：1000ms  内存限制：65536kb

通过率：13/14 `(92.86%) `  正确率：13/23 `(56.52%)`

## 题目描述

![image-20221205030757258](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205030757258.png)

## 输入格式

![image-20221205030806121](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205030806121.png)

## 输出格式

![image-20221205030812235](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205030812235.png)

## 输入样例

```
3 1
1 2 1
```

## 输出样例

```
1 1 0
```

## 样例解释

![image-20221205030821988](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205030821988.png)



# 思路：

竖式计算

![image-20221205031837379](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205031837379.png)

![image-20221205031855166](C:\Users\胡斌\AppData\Roaming\Typora\typora-user-images\image-20221205031855166.png)

利用该竖式计算能获得唯一的解。

# 代码：

```C
#include <bits/stdc++.h>
using namespace std;
#define ll long long
ll n,c;
ll arr[1000005];
ll res[1000005];
int main(){
    scanf("%lld %lld",&n,&c);
    for(ll i=0;i<n;i++){
        scanf("%lld",&arr[i]);
    }
    for(ll i=n-1;i>0;i--){
        res[i-1]=arr[i];
        arr[i-1]-=c*arr[i];
    }
    for(ll i=0;i<n-1;i++){
        printf("%lld ",res[i]);
    }
    printf("%lld",arr[0]);
}
```

时间复杂度：

O（n），显然仅仅遍历了n