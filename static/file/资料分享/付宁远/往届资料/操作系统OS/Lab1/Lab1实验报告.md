# Lab1实验报告

## 思考题

### Thinking 1.1

objdump参数解析：

-D disassemble-all 全部反汇编

[-S|--source]
[--source-comment[=text]]

重复教程步骤如下：

/OSLAB/compiler/usr/bin/mips_4KC-gcc -E main.c >result.txt命令后得到

![image-20220401153226961](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401153226961.png)

/OSLAB/compiler/usr/bin/mips_4KC-gcc -c main.c 进行编译

/OSLAB/compiler/usr/bin/mips_4KC-objdump -DS main.o >result.txt 进行反汇编后得到result.txt结果

```
main.o:     file format elf32-tradbigmips

Disassembly of section .text:

00000000 <main>:
   0:   3c1c0000    lui gp,0x0
   4:   279c0000    addiu   gp,gp,0
   8:   0399e021    addu    gp,gp,t9
   c:   27bdffe0    addiu   sp,sp,-32
  10:   afbf001c    sw  ra,28(sp)
  14:   afbe0018    sw  s8,24(sp)
  18:   03a0f021    move    s8,sp
  1c:   afbc0010    sw  gp,16(sp)
  20:   8f820000    lw  v0,0(gp)
  24:   24440000    addiu   a0,v0,0
  28:   8f990000    lw  t9,0(gp)
  2c:   0320f809    jalr    t9
  30:   00000000    nop
  34:   8fdc0010    lw  gp,16(s8)
  38:   00001021    move    v0,zero
  3c:   03c0e821    move    sp,s8
  40:   8fbf001c    lw  ra,28(sp)
  44:   8fbe0018    lw  s8,24(sp)
  48:   27bd0020    addiu   sp,sp,32
  4c:   03e00008    jr  ra
  50:   00000000    nop
    ...
Disassembly of section .reginfo:

00000000 <.reginfo>:
   0:   f2000014    0xf2000014
    ...
Disassembly of section .pdr:

00000000 <.pdr>:
   0:   00000000    nop
   4:   c0000000    ll  zero,0(zero)
   8:   fffffffc    sdc3    $31,-4(ra)
    ...
  14:   00000020    add zero,zero,zero
  18:   0000001e    0x1e
  1c:   0000001f    0x1f
Disassembly of section .rodata:

00000000 <.rodata>:
   0:   68656c6c    0x68656c6c
   4:   6f000000    0x6f000000
    ...
Disassembly of section .comment:

00000000 <.comment>:
   0:   00474343    0x474343
   4:   3a202847    xori    zero,s1,0x2847
   8:   4e552920    c3  0x552920
   c:   342e302e    ori t6,at,0x302e
  10:   30202844    andi    zero,at,0x2844
  14:   454e5820    0x454e5820
  18:   454c444b    0x454c444b
  1c:   20342e31    addi    s4,at,11825
  20:   20342e30    addi    s4,at,11824
  24:   2e302900    sltiu   s0,s1,10496
```

接下来在用mips_4KC-gcc进行正常编译时报错：

/OSLAB/compiler/usr/bin/../lib/gcc/mips-linux/4.0.0/../../../../mips-linux/bin/ld: crt1.o: No such file: No such file or directory
collect2: ld returned 1 exit status

### Thinking 1.2

用`readelf -h`解析vmlinux文件，得到结果如下：

```
ELF Header:
  Magic:   7f 45 4c 46 01 02 01 00 00 00 00 00 00 00 00 00 
  Class:                             ELF32
  Data:                              2's complement, big endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              EXEC (Executable file)
  Machine:                           MIPS R3000
  Version:                           0x1
  Entry point address:               0x80010000
  Start of program headers:          52 (bytes into file)
  Start of section headers:          37916 (bytes into file)
  Flags:                             0x1001, noreorder, o32, mips1
  Size of this header:               52 (bytes)
  Size of program headers:           32 (bytes)
  Number of program headers:         2
  Size of section headers:           40 (bytes)
  Number of section headers:         14
  Section header string table index: 11
```

发现vmlinux为大端存储，而readelf只能对小端存储文件进行解析。

### Thinking 1.3

Bootloader的第一部分运行在存放bootloader的存储设备上，为stage 2准备RAM空间并设置堆栈，而stage 2运行在RAM中，此时有足够的运行环境用C语言实现功能，所以可以正确跳转至内存布局的内核地址。

### Thinking 1.4

可以将每个程序段的加载的起始地址都设为页对齐。

### Thinking 1.5

内核入口在0x00000000，main函数在0x80001000，通过jal跳转进入main，跨文件调用时现在栈上保存当前数据的值，再jal跳转至需要调用的函数处。

### Thinking 1.6

mtc0 zero, CP0_STATUS 将cp0寄存器置零，使中断功能失效。

mfc0 t0, CP0_CONFIG 将cp0的第一位和第三位置0，使看门狗失效。

## 实验难点

Exercise 1.1

![image-20220401172201161](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401172201161.png)

注意模仿交叉编译器的地址引用方式，较简单。

Exercise 1.2

![image-20220401185645582](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401185645582.png)

主要难点在于理解elf文件内容以及结构体变量的含义，理解后注意指针的运算如何指向每个section，有一定理解难度。

Exercise 1.3

![image-20220401185917474](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401185917474.png)

这题需要仔细阅读指导书，找到内核地址KERNBASE就很容易了

![image-20220401185830476](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401185830476.png)

Exercise 1.4

同上题，在内核布局中找到KSTACKTOP地址，li后jal跳转即可

![image-20220401190055228](C:\Users\95716\AppData\Roaming\Typora\typora-user-images\image-20220401190055228.png)

Exercise 1.5

这题比较考验C语言基本功，理解了printf中每个参数的含义后逐个判断输入的字符即可完成part1，然后模仿其他case的思路即可完成part2整数的输出，要注意num是负数时要把negFlag置1后把num设为相反数，这点与其他case不同。

## 体会与感想

本次实验难度较Lab0稍有提升，但总体还算不太难，主要难点在于看懂别人写的代码和理解整个体系，自己动手写的代码量不大，难度也不高，在指导书和文件中仔细寻找都可以找到相关信息。但感觉做完之后我对操作系统启动部分的理解还不是很深刻，很多内容看完指导书之后就忘了。总体花了大约10h。

## 指导书反馈

```c
/* we found a '%' */  
/* check for long */ 	
/* check for other prefixes */ 	
/* check format flag */
```

printf实战中part1给的一部分注释比较容易迷惑人，发现%后应该先后对flag，width，precision，length进行检查，而注释中第一部分给的check for long不知所云，容易误导同学。