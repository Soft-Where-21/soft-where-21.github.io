# C1-G Matrix 53 的博弈
## 题目描述：

    甲乙两个人下棋，用一个“决策树”的形式给出棋局的所有可能状态，在叶子结点处附上行棋至此甲的胜率。
    两人总作出最优选择（即“绝顶聪明”），甲希望你求出让ta可到达最好局面的胜率
## 核心算法

对于甲而言，ta希望自己达到胜率尽可能大的叶子结点（尽可能赢）

对于乙而言，ta希望自己达到胜率尽可能小的叶子结点（尽可能阻止甲赢）

翻译过来就是：  **胜率（当前节点） = max或min（所有子节点）**

为了知道子节点胜率的最值，我们必须知道子节点的子节点胜率的最值。这种套娃求解令人想到递归的解法。

实质上，先递归求解子节点再求解本节点就是树的后序遍历

**后序遍历的时间复杂度是O(n)**


至此，可以构建出求解的核心算法
```
求解（当前节点，轮甲）：
    if（是叶节点） return 胜率 //边界条件

    if（轮甲）
        for（所有子节点）
            答案 = max（答案，求解（子节点，!轮甲））
    else
        for（所有子节点）
            答案 = min（答案，求解（子节点，!轮甲））
    return 答案
```
## 完成所有功能
程序 = 算法 + 数据结构
算法有了，主要就是完善一下数据结构部分
### 数据存储结构
分析题目，它给出叶节点胜率的方式更适合使用线性方式（即一个数组）存储所有节点
```
节点{胜率，子女[]，是叶节点}

节点数组[大小10^6]
```
### 数据读入
本题将给出叶节点胜率与建树分开，并且叶节点胜率的给出按编号顺序，这就无法在遍历同时读叶节点值

因此分两步读入所有数据
```
//输入较大，建议将此代码展开在主函数里以提速
建树：
    读入》亲节点，子节点
    亲节点.子女.add(子节点)
    亲节点.是叶节点 = 否
    子节点.是叶节点 = 是

读入概率：
    for(i从2到n)
        if(节点i.是叶节点)
            读入》节点i.胜率
```

### 主函数
```
main:
    初始化节点1
    for(i从2到n)
        建树
    读入概率
    求解(节点1，是)
    输出《答案
```

#   翻译成Cpp
偷懒使用stl vector存储子节点
```cpp
#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;

struct TreeNode {
	int val;
	bool  is_leaf = true;
	vector<int> child;
};
TreeNode node[1000005];

//后序遍历
void SufOrder(int curNode, bool isOdd)
{
	int size = node[curNode].child.size();
	if (size == 0)
		return;//基本情况
	int maxmin = isOdd ? -1 : 9999999999;//初始化答案变量用于求最大/最小值
	int curChild;
	for (int i = 0; i < size; i++)
	{
		curChild = node[curNode].child[i];
		SufOrder(curChild, !isOdd);
		maxmin = isOdd ? max(maxmin, node[curChild].val) : min(maxmin, node[curChild].val);
        //是奇数层吗？是选最大，否则选最小
	}
	node[curNode].val = maxmin;
	return;
}

//主函数
//因为读入的量比较大，数据读入放到主函数里了
int main()
{
	int n;
	cin >> n;
	int parent, child;
	node[1].is_leaf = false;//初始化节点1
    //建树
	for (int i = 2; i <= n; i++)
	{
		scanf("%d %d", &parent, &child);
		node[parent].child.push_back(child);
		node[parent].is_leaf = false;
	}
    //读入叶节点概率
	for (int i = 2; i <= n; i++)
		if (node[i].is_leaf)
			scanf("%d", &node[i].val);

	SufOrder(1, true);

	cout << node[1].val;
	return 0;
}
```
# 常见问题
## 使用节点深度判断轮谁下棋，并且在建树时就录入深度
大部分7、8号测试点wa就是因为这个

题干并没有保证建树时深度可求。在子节点连接到父节点时，父节点可能还没有与根节点接通
## MLE
本题需要存储的数据很大，应当尽可能节约空间

存储子节点可以手写一个链式结构节约空间，也可以把vector当做变长数组使用
## TLE
如果你没有使用O(n)的算法，这道题难以通过

如果使用了O(n)的算法，可能是常数太大了，需要优化常数。

可以尝试把函数在main里面展开、使用更快的读入方式
