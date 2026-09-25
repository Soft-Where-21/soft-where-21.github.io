# 第一次上机赛 C 求逆序对个数

时间限制: 1000 ms 内存限制: 65536 kb

### 题目描述

​		给定一个整数序列，求逆序对的个数

## 思路

​		本题对于 $10^5$量级的数据限制时间1000ms，如果直接使用搜索的话肯定会TLE，但是如果通过归并排序的思路进行逆序对的求解，则可以在 *O(nlgn)* 的时间复杂度下得出答案。

### 借鉴归并排序

##### 1.首先回顾一下使用归并排序的流程：

​		在学习归并排序的思想后，我们主要关注于合并的过程中，假设说，我们已经获得了下图的两个数组，同时已经分别求得了这两个数组中的逆序对，则会有如下的合并过程。同时对于合并后的大数组而言，整个大数组中新增的逆序对个数一定是由于左右两个数组之间（非内部关系）而造成的。（例如由左数组的7与右数组的3产生的逆序对）

因此，我们只需要求出由两个数组（非内部关系）而新产生的逆序对，并和两个小数组自身的逆序对个数相加，就能够得出大数组的逆序对了。

##### 2.通过数组合并求逆序对个数

​		合并过程中，设左右数组分别的指针为i, j，则合并过程可以进行简单描述：比较 *left_arr[i]* 和 *right_arr[j]* ，将小的放入大数组arr中，随后对应的指针（i或j）后移。并不断重复上述过程。

​		以上是标准的归并排序过程，但是如何计算两数组之间的逆序对个数呢？

​		简单分析可知，对于左侧数组 *left_arr* 来说，其中的每一个元素在初始数组中的位置都要比右侧数组*right_arr*更靠前，则如果存在一个左侧数组中的元素 *left_arr[i]>right_arr[j]* 来说，由于左侧数组已经完成了排序，对于任意的k>0且i+k<len(left_arr)，均有 *left_arr[i+k]>right_arr[j]* ，即会有新增的len(left_arr)-i+1个逆序对新产生。

​		因此，在合并过程中的每一次 *right_arr[j]>left_arr[i]* 的情况中逆序对计数器加上 len(left_arr)-i+1 即可

## 注意事项

​		逆序对计数器应当使用long long定义

---

``````c++
#include<stdio.h>
#include<stdlib.h>
int data[100010];
int tmp[100010];
void mSort(int k[],int tmp[],int left,int right);
long long merge(int k[],int tmp[],int left,int mid,int right);
long long num=0;
int main()
{
	int i,n;
	long long count=0;
	scanf("%d",&n);//数组大小 
	for(i=0;i<n;i++)
	  scanf("%d",&data[i]);//接受该数组数据 
	mSort(data,tmp,0,n-1);//分治函数 
	
	printf("%lld",num);// 输出逆序对的个数 
}

void mSort(int s[],int tmp[],int left,int right)//分治函数
{
	int mid;
	long long n;
	if(left<right)
	{
		mid=(left+right)/2;
		mSort(s,tmp,left,mid);
		mSort(s,tmp,mid+1,right);
		n=merge(s,tmp,left,mid,right);
		num+=n;//计数
	}
}

long long merge(int s[],int t[],int left,int mid,int right)//合并函数
{
	long long i=left,j=mid+1,k=left;
	long long count=0;
	while( i<=mid && j<=right )
	{
		if(s[i]<=s[j])
		  t[k++]=s[i++];
		else
		{
			count+=mid-i+1;//计数
			t[k++]=s[j++];
		}
	}
	while(i<=mid)
	  t[k++]=s[i++];
	while(j<=right)
	  t[k++]=s[j++];
	for(i=left;i<=right;i++)//将t的新数组全部赋给s
	  s[i]=t[i];
	return count;//返回数字
}
``````



## 总结

相比归并排序增加了计数功能，总的来说相对容易。