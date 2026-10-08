# 题意

本题题意很清晰，只需要判断输入的年份是否既是质数又是闰年即可。

# 题解

事实上，不存在某一个年份既是质数又是闰年，所以想通过本题只需要无脑输出```No```即可。
~~所以题解到这里就结束了~~
但是能不能既判断质数又判断闰年还不会喜提```TLE```的办法呢？当然是有的。

### 质数判断

如果使用试除法去寻找 $1$ 到 $n$ 每个数的因子，但这样做的时间复杂度是 $O\left(n\sqrt{n}\right)$，显然不能通过本题，需要找其他方法。

通过考察欧拉常数的定义：

$$\gamma=\lim_{n\to\infty}\left[\left(\sum_{i=1}^n \frac{1}{i}\right) - \ln\left(n\right)\right]\approx0.5772$$

$$\Longrightarrow\sum_{i=1}^n \frac{1}{i} \thicksim \ln\left(n\right) \left(n\to\infty\right)$$

$$\Longrightarrow\sum_{i=1}^n \frac{n}{i} \thicksim n\ln\left(n\right) \left(n\to\infty\right)$$

因此，当 $n$ 较大时，我们可以认为 $\sum_{i=1}^n \frac{n}{i}$ 近似和 $n\ln(n)$ 相等。考虑 $1$, $2$, $...$, $n$ 对于它的倍数的贡献，例如 $1$ 对 $1$, $2$, $...$, $n$ 有贡献，$2$ 对 $2$, $4$, $...$, $2\left\lfloor \frac{n}{2} \right\rfloor$ 有贡献，而且只需要计算到 $\sqrt{n}$ 对 这样总计算次数为

$$\left\lfloor \frac{n}{1} \right\rfloor + \left\lfloor \frac{n}{2} \right\rfloor + \cdots + \left\lfloor \frac{n}{n} \right\rfloor \leqslant \sum_{i=1}^n \frac{n}{i}$$

时间复杂度为$O\left(n\log{n}\right)$，仍然不能通过本题。

但是进一步想：

首先，如果已经把 $2$ 对于它的倍数的贡献考虑过了，那么所有 $2$ 的倍数的数，比如 $4$, $6$, ... 这些数的倍数的贡献自然已经计算过了，我们就没有必要重复考虑这些数产生的贡献，只要考虑没有被做过贡献的就可以啦。

其次，只需要考察到 $\left\lfloor \frac{n}{2} \right\rfloor$ 就可以停止，因为大于它的数不可能会在 $n$ 的范围里面。~~然后发现时间复杂度不会算了，但是通过本题已经足够了~~

### 闰年判断

闰年判断，事大家最熟悉的闰年判断，事时间复杂度为 $O\left(n\right)$ 的闰年判断。

### 结果输出

$T$ 组数据，时间复杂度显然 $O\left(T\right)$。

# 代码

```c
#include <stdio.h>
#define MAXL (10000086)

int ans[MAXL];

int main()
{
    int i, j, T, x;

    //初始化
    for (i = 2; i < MAXL; i++)
        ans[i] = 1;

    //考虑 i 对其倍数的贡献
    for (i = 2; i < MAXL / 2; i++)
        if (ans[i]) //已经是其他数的倍数，就不需要再考虑它对其倍数的贡献
            for (j = 2; i * j < MAXL; j++)
                ans[i * j] = 0;

    //判断闰年
    for (i = 1; i < MAXL; i++)
        if (i % 400 != 0 && (i % 4 != 0 || i % 100 == 0))
            ans[i] = 0;

    //输入、判断、输出
    scanf("%d", &T);
    while (T--)
    {
        scanf("%d", &x);
        printf(ans[x] ? "Yes\n" : "No\n");
    }
    return 0;
}
```


