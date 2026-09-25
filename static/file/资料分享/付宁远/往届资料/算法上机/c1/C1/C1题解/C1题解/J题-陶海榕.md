# 题意



***

简单，略。

# 题解



***



注意到，题目是要求输出 **被查询数的第一次出现位置** ，因此我们还需要在读入x的时候顺便记录一下位置。这里定义了一个结构体node把x和位置放在了一起，当然也可用二维数组等方法。  

~~~c
typedef  struct inode{
	int value;//x的值
	int num;//x的位置
}node;
~~~

因为题目要多次查找，所以我们最好先把data数组排序。可以用C语言里自带的qsort函数节约时间。这里把x的值作为第一关键字，位置作为第二关键字按升序排列。而题目要求输出被查询数t的第一次出现位置，所以我们只需要找到data数组里的第一个value == t的元素，输出它的num就行了。

观察数据规模：n <= 1000000, 而且要查询的个数也是n <= 1000000。用**时间复杂度为log(n)的查找算法**才能稳过。说到时间复杂度为log(n)的查找算法，首先想到的就是我们学过的二分查找。那么我们能不能通过改造一下二分查找来解决这个问题呢？

当然可以！我们只需要改变一下data[mid].value == key时候的执行语句就可以了。在二分查找中，value == key会直接返回结果。我们只需要把这个操作改为**用一个变量res保存这个结果，并把查询的右边界改为mid-1**即可。这样就可以继续在mid的左边查找,当mid左边没有value == key的元素后才停下。   

改造后的二分查找代码如下：

~~~C
int find(int l, int r, int key){
	int mid = 0;
	int res = -1; //默认值设为-1
	while(r-l >= 0){
		mid = l + (r-l)/2;
		if(data[mid].value > key) r = mid-1;
		else if(data[mid].value < key) l = mid+1;
		else if (data[mid].value == key){
			res = data[mid].num;//保存结果，并更改右边界
			r = mid-1;
		}
	}
	return res;
}
~~~

因为是二分查找的变种，时间复杂度也是O(logN)

# 代码



***



~~~c
#include <stdio.h>
#include <stdlib.h>
typedef  struct inode{
	int value;
	int num;
}node;
int MAXN = 1000005;
node data[MAXN];
node t[MAXN];
int cmp(const void*a , const void* b){
	node x = *(node*)a, y = *(node*)b;
	if(x.value > y.value)return 1;
	if(x.value < y.value)return -1;
	if(x.value == y.value){
		if(x.num > y.num)return 1;
		if(x.num < y.num)return -1;
	}
	return 0;
}
int find(int l, int r, int key){
	int mid = 0;
	int res = -1; 
	while(r-l >= 0){
		mid = l + (r-l)/2;
		if(data[mid].value > key) r = mid-1;
		else if(data[mid].value < key) l = mid+1;
		else if (data[mid].value == key){
			res = data[mid].num;
			r = mid-1;
		}
	}
	return res;
}

int main(){
	int n;
	scanf("%d", &n);
	int i;
	for(i = 0; i < n; i++){
		scanf("%d", &data[i].value);
		data[i].num = i+1;
	}
	qsort(data, n, sizeof(node), cmp);
	int num = 0;
	while(scanf("%d", &t[num].value) != EOF)num++;
	for(i = 0; i < num; i++){
		int flag = find(0, n-1, t[i].value);
		if(flag == -1)printf("NO\n");//注意不是No
		else{
			printf("%d\n", flag);
		}
	}
	return 0;
}

~~~

