# C1-I

## 题意

$n$ 个人，每次分成两组人，这两组的人分别进行对战，问最少分多少组使得每对人都进行过对战，并给出分组方式。$2 \le n \le 1000$

## 题解

设 $f_i$ 表示 $i$ 个人时所需要的最小轮次。感性理解可以发现 $f_i \le f_{i+1}$ ，下面给出一个证明：

> 考虑对于所有 $i + 1$ 人时所有的分组方式满足轮次为 $f_{i + 1}$ 。考虑除了第 $i + 1$ 个人，其余 $i$ 个人显然也在这种分组方式中两两对抗过，因此 $f_i \le f_{i + 1}$ 得证。 

我们再考虑 $f_i$ 如何由之前已经得知的状态得到，给出结论 $f_i = 1 + \min\limits_{j = 1}^{i - 1}(\max(f_j, f_{i - j}))$ ，证明如下：

> 首先考虑将 $i$ 分成 $j$ 与 $i - j$ 两部分，需要进行一次分组。由于我们已经知道了 $j$ 个人与 $i - j$ 个人的最优分组方案，并且 $j$ 与 $i - j$ 的分组显然没有交集，这样我们就可以将这两个分组合并起来，则此时的答案即为 $f_i = 1 + \max(f_j, f_{i - j})$ ，对于所有的 $j$ 取 $\min$ 即可得到 $f_i$ 。 

根据第一个证明即可得到 $f_i = 1 + f_{\lceil\frac{i}{2}\rceil}$，因此我们可以得出 $f_i = \lceil\log_2{i}\rceil$，即答案所需的最小轮次即为 $f_n = \lceil\log_2{n}\rceil$

考虑一种构造方案，根据这个 $\log$ 可以较为容易的想到二进制分组的方式。

考虑将所有数编号为 $0, 1,\dots, n - 1$，会发现 $n - 1$ 的二进制位数正好为 $\lceil\log_2{n}\rceil$ ，因此对于第 $i\in {0, \dots, \lceil\log_2{n}\rceil - 1}$  次分组，将 $0, 1, \dots, n - 1$ 的所有数中二进制第 $i$ 位为 $0$ 的分成一组， $1$ 分成另一组即可正好分 $\lceil\log_2{n}\rceil$ 次。

考虑这样分法的正确性，对于两个数 $i, j, i\not = j$ ，显然这两个数在二进制下至少有一位是不同的，因此一定会在某次分组中被分到不同的组，因此这样的分法是正确的。

由于要分 $O(\log n)$ 组，每组都要扫 $O(n)$ 次，因此总复杂度为 $O(n\log n)$ 。

注意由于我们将所有数编号为 $0, \dots, n - 1$ 了，因此输出需要加 $1$。

代码如下：

```cpp
#include<bits/stdc++.h>
#define inf 0x3f3f3f3f
#define maxm 4020005
#define maxn 1000005
#define PII pair<int, int>
#define fi first
#define mkp make_pair
#define se second
#define ls (tot << 1)
#define rs (tot << 1 | 1)
typedef long long ll;
typedef unsigned long long ull;
using namespace std;
const double pi = acos(-1);
const ll mod = 998244353;
const double eps = 1e-10; 
inline ll read(){
    ll x = 0, f = 1;char ch = getchar();
    while(ch > '9' || ch < '0'){if(ch == '-') f = -1;ch = getchar();}
    while(ch >= '0' && ch <= '9'){x = x * 10 + ch -'0';ch = getchar();}
    return x * f;
}
int st[maxn], tp;

int main() {
	int n = read() - 1;
	int i;
	for(i = 0; (1 << i) <= n; i++);
	i--;
	printf("%d\n", i + 1);
	for(int j = 0; j <= i; j++){
		tp = 0;
		for(int k = 0; k <= n; k++){
			if(k & (1 << j)) st[++tp] = k;
		}
		printf("%d ", tp);
		for(int k = 1; k <= tp ;k++) printf("%d%c", st[k] + 1, k == tp ? '\n' : ' ');
	}
    return 0;
}
```

