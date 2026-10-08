# 题意

Minimax 博弈树。

两人博弈，可以抽象为一棵树，其中点表示状态，指向子态的边表示决策。两人轮流进行回合，初态为树根，目标是决策以使自己能达到最优终态。



# 题解

**数据结构：树**

这个决策树是个不定叉的树，用邻接表可以实现，使用 C++ 的 vector 更为方便，故本题使用后者。

**思路**

二人博弈，二人的目的都是最优化自己的解，可以等价于最劣化对手的解。

于是将采用以下决策方式：

- 先手的决策：子状态后手决策的最优终局。
- 后手的决策：子状态先手决策的最劣终局。

注：上述的优劣都是针对先手而言。

换言之，树中节点的深度为奇数时，选择最优解；为偶数时，选择最劣解。



**对了，这道题别用同步下的 cin 输入！！！我 6 次都是因为用 cin TLE 的！**



# 代码

```cpp
#include<iostream>
#include<vector>
#include<set>
#include<stdio.h>
#define ll long long
using namespace std;

const ll MAX = 1e6 + 10;

vector<int> son[MAX];
int minimax[MAX];
int n;

int getval(int node, bool ismax) {
    if (minimax[node] != -1) return minimax[node];
    if (ismax) {
        int v = -1;
        for (vector<int>::iterator it = son[node].begin();it != son[node].end();it++) {
            int sonval = getval(*it, false);
            if (v < sonval) v = sonval;
        }
        return v;
    }
    else {
        int v = 20000;
        for (vector<int>::iterator it = son[node].begin();it != son[node].end();it++) {
            int sonval = getval(*it, true);
            if (v > sonval) v = sonval;
        }
        return v;
    }
}

int main() {
    scanf("%d", &n);
    for (int i = 1;i <= n;i++) minimax[i] = -1;
    for (int i = 0;i < n - 1;i++) {
        int p, s;
        scanf("%d%d", &p, &s);
        son[p].push_back(s);
    }
    // cout << leaf.size() << endl;
    for (int i = 1;i <= n;i++) {
        if (son[i].size() != 0) continue;
        // printf("INPUT i=%d:\n", i);
        scanf("%d", minimax + i);
    }
    printf("%d", getval(1, true));
}
```



*Solution by Jerydeak(Yu Hao)*