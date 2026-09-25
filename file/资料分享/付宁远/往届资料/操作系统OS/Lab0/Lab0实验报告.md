# Lab0 实验报告

## 思考题

### Thinking 0.1

第一次add前文件只进行了更改，处于未追踪状态；

第二次文件已经提交过一次，但修改后的内容没有add，处于修改但为暂存状态。

### Thinking 0.2

add the file: git add

stage the file: git add

commit: git commit

### Thinking 0.3

git checkout printf.c

git reset HEAD printf.c

git rm --cached Tucao.txt

### Thinking 0.4

git reset可以通过HEAD^的形式将版本恢复到一次或几次以前的版本，也可以通过某次提交的哈希值来把版本回退或前进到某次提交。所以可以记录一些重要版本的提交哈希值，这样可以轻松回到该版本。

### Thinking 0.5

1.正确。clone会把远程仓库整个克隆，但在本地只创建一个HEAD分支；

2.正确。clone后的操作都只在本地完成，不影响远程仓库；

3.错误。整个仓库都会被克隆；

正确。

### Thinking 0.6

命令行中输出first

output.txt中内容为：

third

forth

### Thinking 0.7

![image-20220320221538258](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220320221538258.png)

![image-20220320221556820](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220320221556820.png)

test中的命令分为两类，echo开头的会将后面内容输出至终端，其他命令对a,b,c赋值然后将结果存至四个文件，最后把file4内容保存到result

echo echo Shell Start 与 echo 'echo Shell Start'效果没有区别，

echo echo \$c>file1是在file1中输入echo $c    

echo  'echo \\$c>file1'是在终端输出echo \$c>file1

## 实验难点

Exercise 0.4中需要补全两个Makefile文件，用一个调用另一个来完成编译，并且要注意makefile的命令没有继承关系，所以上一命令cd完之后会自动回退到原目录。可采用&&以同时执行两个命令。

## 体会与感想

初次接触Linux命令，需要花一定时间理解和掌握语法，其中$的使用和转义字符的使用比较多细节需要加深理解。初次接触git，了解git的使用和原理也花了不少时间。总体来说本次实验难度不高，但接触的都是全新的内容，花了大约15小时（不是很记得了纯估计）。
