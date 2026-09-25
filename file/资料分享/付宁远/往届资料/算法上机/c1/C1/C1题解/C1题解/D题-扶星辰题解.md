# `D` Ashane算日期 (easy version)

## 题意

输入两个表示日期的八位数字$a、b$，找出表示日期的数字$x$满足$a\leq x\leq b$ ，且$x$是回文数。

## 题解

##### 思路

由于$1000\leq year \leq 9999$，数字量级小于$10^4$，所以可以考虑枚举年份来获得对应年份的回文数字（例如年份为$2021$，则回文数字为$20211202$），再判断该回文数字是否可以表示日期即可。

##### 复杂度分析

枚举年份复杂度$O(10^4)$，对于每个年份获得回文数字$O(1)$，判断数字是否可以表示日期$O(1)$，故总复杂度$O(10^4)$。

## 代码

```c
#include <stdio.h>
int days[]={31,28,31,30,31,30,31,31,30,31,30,31};
int judge_run(int x)//返回1代表是闰年，0代表不是闰年
{
    if(x%4!=0)return 0;
    if(x%100==0){
        if(x%400!=0)return 0;
    }
    return 1;
}
int get_date(int x)//如果年份x得到的回文数字不是日期，则返回-1，否则返回回文数字
{
    int t=x,month=0,day=0;
    month=t%10;             t/=10;
    month=month*10+t%10;    t/=10;
    day=t%10;               t/=10;
    day=day*10+t%10;        t/=10;
    if(1<=month&&month<=12){
        if(day>=1&&day<=days[month-1]+((month==2&&judge_run(x))?1:0)) 
        return x*10000+month*100+day;
    }
    return -1;
}
int main()
{
    int a,b,year1,year2,temp,ans=0;
    scanf("%d%d",&a,&b);
    if(a>b) a^=b^=a^=b;
    year1=a/10000; year2=b/10000;
    for(int i=year1;i<=year2;i++){//枚举年份
        temp=get_date(i);
        if(temp>0&&a<=temp&&temp<=b) ans++;//如果年份i得到的回文数字是日期且该日期介于a，b之间，则ans++
    }
    printf("%d",ans);
}

```

