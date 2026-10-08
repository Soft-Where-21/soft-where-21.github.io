## 题解

​       由于要输入n个int型整数x，且要去重，能够想到使用hashmap来存储数字，那么key:value=数字的hash值：数字节点，数字节点中包含了出现的顺序信息和下一个节点的指针。在插入的时候，如果key不存在，就直接进行插入；如果key存在，那么判断一下数字是否重复，如果重复则获取下一个输入，如果不重复，则在链表上加上一个新的节点。当我们要查找的时候，就直接在map中查找有无key，如果有，则输出节点中包含的顺序信息，如果没有则输出NO。

时间复杂度分析：如果在插入的时候没有发生哈希碰撞，那么插入的时间复杂度为O(n)，查找的时间复杂度也为O(n),所以总体的时间复杂度为O(n)。那么如果发生哈希碰撞，那么时间复杂度会大于O(n)，所以我们要尽可能地使得哈希碰撞发生的可能性减小。所以我开辟的数组大小是480000左右，hash值的计算方式为:
$$
code=number\%240000+240000
$$

## 代码

```c
#include <stdio.h>
#include <stdlib.h>
#define num 240000

typedef struct Node{
    int number;
    int index;
    struct Node *next;
} Node;

static Node *hashmap[num * 2 + 10000] = { 0 };

int find(int answer) {
    int hashcode = answer % num + num;
    Node *p = hashmap[hashcode];
    while (p) {
        if (answer == p->number) {
            return p->index;
        }
        p = p->next;
    }
    return 0;
}

int main(void)
{
    int n, tmp, hashcode;
    scanf("%d", &n);
    // 读取输入到hashmap中
    for (int i = 0; i < n; i++) {
        int flag = 0;
        Node *l, *p;
        scanf("%d", &tmp);
        hashcode = tmp % num + num;
        //下面我们为这个数建立节点
        l = (Node *)malloc(sizeof(Node));
        l->number = tmp;
        l->index = i + 1;
        l->next = NULL;
        if (hashmap[hashcode]) {
            //如果这个位置不是空的的情况下，需要判断一下有没有重复的元素，如果没有就直接把节点放在头的位置上
            p = hashmap[hashcode];
            while (p) {
                if (p->number == tmp) {
                    flag = 1;
                    break;
                }
                p = p->next;
            }
            if (flag == 1) {
                continue;
            }
            else {
                l->next = hashmap[hashcode];
                hashmap[hashcode] = l;
            }
        }
        else {
            //如果这个位置是空的的情况下，就直接把节点放进去即可
            hashmap[hashcode] = l;
        }
    }

    int answer, index;
    char c;
    c = getchar();
    int x = 0;
    while (scanf("%d", &answer) != EOF) {
        index = find(answer);
        if (x != 0) {
            printf("\n");
        }
        if (index == 0) {
            printf("NO");
        }
        else {
            printf("%d", index);
        }
        x += 1;
    }
    return 0;
}
```

