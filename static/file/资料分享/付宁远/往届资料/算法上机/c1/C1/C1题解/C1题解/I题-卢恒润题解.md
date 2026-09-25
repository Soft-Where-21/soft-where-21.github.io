# C1-I题题解

> 19231224 卢恒润

## 题意

输入一个数字n，代表n个同学，之后输出一个数字m，代表总的分组数

然后输出m行，每行代表一个分组，每行第一个数字是分组中一组的同学书，之后是一组中的同学编号，不同的数字间用空格分隔

你要找出最少的分组数，以满足所有的同学间都能存在一次对抗关系

注：对抗关系及两个同学在不同的组。

## 解题思路

主要是理解二叉树：
这里代码创建了一颗二叉树，节点存储在定义的结构体node中，

- node里的array存储当前节点数据，
- length是数组的长度，也就是数据的数量，
- floor是层数，代表数据位于树的第几层（树有几层，就会有几行输出，树的根节点位于第0层）
- left和right分别就是左子节点指针和右子节点指针
这里手动实现一颗二叉树帮助大家理解为什么要创建二叉树：（每次分一半，类似于归并排序的方法）
				1 2 3 4 5 6 7
				         |
		     1 2 3 	   4 5 6 7
			    |                |
		 1      2 3     4 5    6 7
				     |        |         |
			     2   3   4   5     6   7
这里一颗关于n = 7，同学编号是1 2 3 4 5 6 7的二叉树的实现过程就实现了，输出时，我们只需要输出每一层中全部的左子树或者全部的右子树即可，比如我们可以这么输出：
3
3 1 2 3
3 1 4 5
3 2 4 6
(第一行的输出是总共的分组数，每行的第一个数字是本行的元素数量)
> **那么为什么每次分一半最后找出来的组数是最少的呢？**

这里用到助教老师的一个提醒：只有每次两组人数基本相等，才能使得每次的分组增加的对抗关系最多，也就是说，每次分组尽量平均分组。

> **那么为什么这样的二叉树能保证每两个同学都存在一对对抗关系呢？**

每次分组都是类似于二分法的分组，也就保证了A组的同学中的每一位已经与B组中的同学对抗过了，因此只需要考虑每组自己的对抗关系即可，所以接下来就A组再分，B组再分，一直循环下去，直到人数变为1，代表着当前路线分组结束。

### 其他提醒
- int save[1000][1000] 数组作为存放最终输出的数据存在，数组从下标1开始存储数据，每行元素的0号位存储着当前行的有效数据数量
- 不要忘记区分.与->在结构体中的使用方法
- 不要忘记使用malloc函数为新创建的结构体指针赋值存储空间，我因为这个错误检查了好久
- 代码的解释具体见代码注释

## C代码

```c
/* 
 Author: 卢恒润
 Result: AC	Submission_id: 3630938
 Created at: Sat Sep 25 2021 02:16:55 GMT+0000 (Coordinated Universal Time)
 Problem_id: 4567	Time: 37	Memory: 17452
*/

#include <stdio.h>
#include<stdlib.h>

int save[1000][1000] = {0};

struct node {
    int array[1000];
    int length;
    int floor;
    struct node *left;
    struct node *right;
};

int frequence(int n) {
    int fre = 0;
    while (n != 1) {
        if (n % 2 != 0) {
            n = (n / 2) + 1;
        } else if (n % 2 == 0) {
            n = n / 2;
        }
        fre++;
    }
    return fre;
}

// addNode方法：以根节点为中心，添加所有子节点
void addNode(struct node *fatherNode) {
    struct node *cn_left, *cn_right;	//两个子节点，cn的意思是childnode子节点
    cn_left = (struct node *) malloc(sizeof(struct node));
    cn_right = (struct node *) malloc(sizeof(struct node));
    int n = fatherNode->length;
    if (fatherNode->length == 1) {
        return;
    } else if (n % 2 != 0) {
		// 奇数个元素时，左子节点分配n / 2个元素，右子节点分配(n / 2) + 1个元素
		// 左子节点赋值
        cn_left->length = n / 2;
        cn_left->floor = fatherNode->floor + 1;
        for (int i = 0; i < cn_left->length; ++i) {
            cn_left->array[i] = fatherNode->array[i];
        }
        cn_left->left = NULL;
        cn_left->right = NULL;

		// 右子节点赋值
        cn_right->length = (n / 2) + 1;
        cn_right->floor = fatherNode->floor + 1;
        for (int i = 0; i < cn_right->length; ++i) {
            cn_right->array[i] = fatherNode->array[i + (n / 2)];
        }
        cn_right->left = NULL;
        cn_right->right = NULL;

		// 确认父子节点关系
        fatherNode->left = cn_left;
        fatherNode->right = cn_right;

		// 递归赋值
        addNode(cn_left);
        addNode(cn_right);

    } else if (n % 2 == 0) {
		// 元素个数为偶数个，左子节点和右子节点平均分配元素数量
		// 左子节点赋值
        cn_left->length = n / 2;
        cn_left->floor = fatherNode->floor + 1;
        for (int i = 0; i < cn_left->length; ++i) {
            cn_left->array[i] = fatherNode->array[i];
        }
        cn_left->left = NULL;
        cn_right->right = NULL;

		// 右子节点赋值
        cn_right->length = n / 2;
        cn_right->floor = fatherNode->floor + 1;
        for (int i = 0; i < cn_right->length; ++i) {
            cn_right->array[i] = fatherNode->array[i + (n / 2)];
        }
        cn_right->left = NULL;
        cn_right->right = NULL;

		// 确认父子节点关系
        fatherNode->left = cn_left;
        fatherNode->right = cn_right;

		// 递归赋值
        addNode(cn_left);
        addNode(cn_right);

    }
}

// search方法用于检索所有的节点，并将信息存储在save数组中
void search(struct node *fatherNode) {
    // array数组下标从1开始，每行数组的第一个元素存放当前行有多少个元素，从下标1开始才是元素内容
    if ((fatherNode->left == NULL || fatherNode->right == NULL)) {
//        printf("just end!\n");
        return;
    }
    struct node *cn_left,*cn_right;
//    cn_left = (struct node *) malloc(sizeof(struct node));
    cn_left = fatherNode->left;
    cn_right = fatherNode->right;

    int index = cn_left->floor;
//    printf("index = %d\n", index);
    int length = cn_left->length;
    int length_start = save[index][0];

    save[index][0] += length;
    for (int i = 1 + length_start, j = 0; i <= length + length_start; ++i, ++j) {
        save[index][i] = cn_left->array[j];

    }

    search(cn_left);
    search(cn_right);

}

int main() {
//    printf("please input a number for n :");
    int n = 0, fre;
    scanf("%d", &n);

    int array_main[n];
    for (int i = 0; i < n; ++i) {
        array_main[i] = i + 1;
    }

    struct node mainNode;
    for (int i = 0; i < n; ++i) {
        mainNode.array[i] = i + 1;
    }
    mainNode.length = n;
    mainNode.floor = 0;

    fre = frequence(n);
    printf("%d\n", fre);

    addNode(&mainNode);
    search(&mainNode);
	// 遍历输出save数组
    for (int i = 1; i <= fre; ++i) {
        printf("%d ", save[i][0]);
        for (int j = 1; j <= save[i][0]; ++j) {
            printf("%d ", save[i][j]);
        }
        printf("\n");
    }

}

```