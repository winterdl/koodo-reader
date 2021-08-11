<div align="left">

简体中文 | [English](https://github.com/troyeguo/koodo-reader/blob/master/README.md)

</div>

<div align="center">

  <img src="https://i.loli.net/2021/07/30/ZKNMmz54Q3uqlrW.png" width="96px" height="96px"/>
</div>

<h1 align="center">
  Koodo Reader
</h1>

<h3 align="center">
  一个跨平台的电子书阅读器
</h3>

<div align="center">

[下载](https://koodo.960960.xyz/download) | [预览](https://koodo-reader.vercel.app/) | [反馈](https://koodo.960960.xyz/support) | [文档](https://www.notion.so/troyeguo/e9c4e5755d564b0db6340eeba6d9ece9?v=7c8fcbed9adf4592ada95cfd593868c9)

</div>

## 预览

<div align="center">
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/I37WPYFJcC1jltn.png" >
  </a>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/G7WvUQFTrEpSCKg.png" >
  </a>
</div>

## 特色

- 支持阅读格式：
  - EPUB (.epub)
  - 扫描文档 (.pdf, .djvu)
  - Kindle (.azw3, .mobi)
  - 纯文本 (.txt)
  - 漫画 (.cbr, .cbz, .cbt)
  - 富文本 (.md, .docx, .rtf)
  - 超文本 (.html, .xml)
  - FB2 (.fb2)
- 支持 **Windows**，**macOS**，**Linux** 和 **网页版**
- 备份数据到 **Dropbox** 和 **Webdav**
- 自定义源文件夹，利用 OneDrive、百度网盘、iCloud、Dropbox 等进行多设备同步
- 双页模式，单页模式，滚动模式
- 听书功能，翻译功能，触控屏支持，批量导入图书
- 支持目录，书签，笔记，高亮，书架，标签
- 自定义字体，字体大小，行间距，段落间距，阅读背景色，文字颜色，屏幕亮度，文字下划线、斜体、文字阴影、字体粗细
- 黑夜模式和主题色设置

## 使用方法

- 桌面端：[Github](https://github.com/troyeguo/koodo-reader/releases/latest) | [蓝奏云](https://wwa.lanzoui.com/b0c90cieb) 密码：1234 | [历史版本](https://wwa.lanzoui.com/b0c97tupi) 密码：1234
- 网页版：[前往](https://koodo-reader.vercel.app/)
- 使用 [Homebrew](https://brew.sh/) 安装：

```shell
brew install --cask koodo-reader
```

- 使用 Docker 安装：

```bash
docker-compose up -d
```

## 截图

<div align="center">
  <b>列表模式</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/JyNHfThMs184Um2.png" >
  </a>
  <b>封面模式</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/76zkDEAobd4qsmR.png" >
  </a>
  <b>阅读菜单</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/LeEN9gnOvFmfVWA.png" >
  </a>
  <b>备份和恢复</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/aRIAiYT2dGJQhC1.png" >
  </a>
  <b>黑夜模式和主题色</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/08/ynqUNpX93xZefdw.png" >
  </a>
  <b>笔记管理</b>
  <a href="https://github.com/troyeguo/koodo-reader/releases/latest">
    <img src="https://i.loli.net/2021/08/09/sARQBoefvGklHwC.png" >
  </a>
</div>

## 运行源码

请确保您电脑的 node 的版本大于 10.0.0，已配置好 yarn，git 的运行环境。

1. 将项目源码下载到本地

   ```
   git clone https://github.com/troyeguo/koodo-reader.git
   ```

2. cd 到项目文件夹，运行以下代码进入客户端模式

   ```
   yarn
   yarn dev
   ```

3. 运行以下代码进入网页模式

   ```
   yarn
   yarn start
   ```

## 许可说明

本项目禁止任何商业项目二开使用，任何组织和个人不得修改本软件名字和 logo 后重新分发。在不违背上述条件的前提下，本项目采用 AGPL3.0 协议。
