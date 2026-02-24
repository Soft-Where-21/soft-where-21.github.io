# Linux 快速上手教程：从入门到进阶

本教程参考了 DigitalOcean 的核心指南，旨在帮助初学者快速掌握 Linux 命令行（CLI）的基本操作。
参考链接：指南：https://www.digitalocean.com/community/tutorials/linux-commands。实操视频：https://www.bilibili.com/video/BV1by4y1F7mm/?spm_id_from=333.1387.favlist.content.click&vd_source=2ab56a6343cb4312aabf478c5ce12125

<Callout type="info">
  **提示：** 在 Linux 中，命令通常遵循 `command [options] [arguments]` 的格式。
</Callout>

## 1. 文件与目录操作 (File & Directory)

这是最基础的部分，用于在文件系统中穿梭和管理文件。

- `ls`：列出目录内容。常用 `ls -la` 查看所有隐藏文件和详细信息。
- `cd`：切换目录。`cd ..` 返回上一级。
- `pwd`：显示当前所在的全路径。
- `mkdir`：创建新目录。
- `rm`：删除文件。使用 `rm -rf` 强制删除目录及其内容（需谨慎）。
- `cp`：复制文件或目录。
- `mv`：移动或重命名文件/目录。
- `touch`：创建一个新的空文件。

## 2. 查看文件内容 (Viewing Files)

无需打开重量级编辑器即可查看内容。

- `cat`：将文件内容打印到屏幕。
- `less`：分页查看大文件（按 `q` 退出）。
- `head` / `tail`：查看文件的前 10 行或后 10 行。常用 `tail -f` 实时监控日志。
- `grep`：强大的文本搜索工具。例如：`grep "error" log.txt`。

## 3. 权限管理 (Permissions)

Linux 是一个多用户系统，权限至关重要。

- `sudo`：以超级用户（Root）权限执行命令。
- `chmod`：修改文件权限（如 `chmod 755 script.sh`）。
- `chown`：修改文件所有者。

## 4. 系统信息与监控 (System Information)

了解服务器的运行状态。

- `top` / `htop`：实时显示系统进程和资源占用。
- `df -h`：查看磁盘空间使用情况。
- `free -m`：查看内存使用情况（以 MB 为单位）。
- `uname -a`：显示内核及系统信息。
- `uptime`：查看系统运行了多久。

## 5. 网络操作 (Networking)

- `ping`：检查与主机的连接性。
- `curl` / `wget`：从网络下载文件或发起请求。
- `ip addr`：查看本机的 IP 地址。
- `ssh`：通过安全外壳协议远程登录服务器。

## 6. 软件包管理 (Package Management)

根据你的发行版（Ubuntu/Debian 使用 `apt`，CentOS/Fedora 使用 `yum` 或 `dnf`）。

```bash
# 更新软件包列表
sudo apt update

# 安装新软件
sudo apt install git
```
