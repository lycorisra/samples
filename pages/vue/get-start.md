
[TOC]
## Node.js环境下Vue项目开发
　　本文主要介绍在Node.js环境下，如何进行Vue项目（移动app）开发，包括开发环境的搭建、新建Vue项目、运行项目、Webpack打包、访问移动设备和真机调试及打包发布为app等内容，尽量在每一步过程中详细、清晰明了，让人可以快速上手。　
### 1. 开发环境搭建
　　相较于传统的Web开发，Node.js环境下开发方式最大的区别在于运行环境、模块加载和开发工具等方面，所以，首先熟悉下基于Node.js开发所需的开发环境，包括JavaScript运行环境、打包工具和IDE等，以Windows系统为例，下面是Node.js开发所需的工具：
　　
- [Node.js](http://nodejs.cn/)：Node.js诞生于2009年3月，官网介绍如下：
> Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 Node.js 的包管理器 npm，是全球最大的开源库生态系统。

- [NPM](https://www.npmjs.com/)：NPM的全称是Node Package Manager，是一个NodeJS包管理和分发工具。在Node.js实际开发过程中，会使用到大量的模块，使用NPM可以帮助我们安装和管理这些模块包。

- [Webpack](http://webpack.github.io/)：Webpack是一个模块加载器兼打包工具，它能把各种资源，JS（含JSX）、CSS（含less/sass）、图片和文本等作为模块来使用和处理。文档地址：http://webpack.github.io/docs/

- [VS Code](http://www.vscode.org/)：全称Visual Studio Code，是微软在[Build 2015](http://www.iplaysoft.com/build-2015.html)大会上推出来的开源且跨平台的现代轻量级代码编辑器，是一款主要用于进行前端开发的IDE，支持几乎所有主流的开发语言的语法高亮、代码智能提示、Git、终端和代码调试及VS常用特性。由于是微软推出的，所以在界面和使用习惯上延续了Visual Studio的风格，对于熟练使用Visual Studio的开发者可以更容易使用。其他比较主流的类似IDE还有[Sublime Text](http://www.sublimetext.com/)和[Atom](https://atom.io/)，点击相应链接可以详细了解。

- [HBuilder](http://dcloud.io/index.html)：Hbuilder是DCloud（数字天堂）推出的一款支持HTML5的Web开发IDE。其本身主体是由Java编写，基于Eclipse，所以兼容Eclipse的插件。这里我们主要使用它来进行app的调试和发布打包。

- [vue-cli](https://github.com/vuejs/vue-cli)：基于Vue.js的命令行工具，官方发布 vue.js 项目脚手架，使用 它可以快速创建、运行和发布Vue项目。

- [Git](https://git-scm.com/downloads/)：是一个开源的分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理

#### 1.1. 安装Node.js
　　首先，下载好所需的安装包后，先安装Node.js，安装完成后需要注意：
- 1、设置Node.js全局模块安装路径：这一步的作用在于设置npm全局模块安装的路径，这样以后项目中这些全局模块就可以不用反复安装了，设置方法如下，在cmd命令中输入如下命令：
```
npm config set prefix "F:\nodejs\node_modules\" // 这里设置模块路径，改成自己的路径
npm config set prefix "F:\nodejs\node_cache\" // 这里设置缓存文件的路径
```
更改完后输入“npm config list”查看命令是否生效，如下：
![Alt text](asset/img/vue/1495004539680.png)

- 2、设置Node.js的环境变量；设置Node.js全局模块加载的环境变量NODE_PATH：F:\webfrontend\nodejs\node_modules，该路径为上一步设置的全局安装路径

　　由于新版的Node.js安装完成后，已经自带NPM功能，所以，NPM不需要单独安装，在系统命令行工具中输入npm -v可以查看npm的当前版本来判断是否成功安装
#### 1.2. 安装Webpack和vue-cli
　　前面设置好Node.js模块全局路径后，打开cmd窗口（Win+R，输入cmd），输入“npm install webpack -g”，-g表示安装到全局的目录，这样以后在任何目录下都可以使用webpack命令。然后回车，即开始下载Webpack，下载完成后，输入“webpack -v”，查看安装的webpack的版本，判断是否成功。同样，再安装vue-cli，安装完后用“vue -V”查看当前vue-cli版本判断是否安装成功。
注意：
- 1、如果遇到网络问题，出现安装缓慢或出错的情况，可以参考：[ 解决国内NPM安装依赖速度慢问题](http://blog.csdn.net/rongbo_j/article/details/52106580)，或安装“cnpm”，然后使用cnpm进行安装其他模块；
- 2、可以一次安装多个模块，例如：“npm install webpack vue-cli -g”模块之间使用空格隔开。
#### 1.3. 安装VS Code
　　安装完成后，可以进行一些个性化设置，例如，
- 更改主题：打开“文件 - >首选项 -＞颜色主题”，然后选择一套自己喜欢的主题
- 用户设置：快捷键“Ctrl+Shift+P”，然后输入“setting”，选择“首选项-打开用户设置”，然后在，右侧栏中输入相应的配置项，例如“”
``` javascript
// Place your settings in this file to overwrite the default settings
{
	// 配置 glob 模式以排除文件和文件夹。
	"files.exclude": {
		"**/.git": true,
		"**/.gitignore": true,
		"**/.gitattributes": true,
		"**/.gitkeep": true,
		"**/.eslintignore": true,
		"**/..eslintrc.js": true,
		"**/.eslintrc.js": true,
		"**/.editorconfig": true,
		"**/.svn": true,
		"**/*.DS_Store": true,
		// "**/.vscode": true,
		"**/node_modules": true,
		"**/bin": true,
		"**/obj": true,
		"**/Properties": true,
		"*.csproj": true,
		"*.sln": true,
		"*.user": true,
		"*.suo": true,
		"LICENSE": true
	},
	"files.autoSave": "off",
	"window.zoomLevel": 0,
	"workbench.editor.enablePreview": false,
	"workbench.statusBar.visible": true,
	// "files.associations": {"*.vue":"vue"},
	"workbench.activityBar.visible": true,
	"workbench.colorTheme": "One Dark+ (Sublime)",
	"workbench.iconTheme": "vs-seti",
	// 控制是否显示 minimap
	"editor.minimap.enabled": true,
	// Controls if the editor should allow to move selections via drag and drop.
	"editor.dragAndDrop": true,
	// 按 "Tab" 时插入空格。该设置在 `editor.detectIndentation` 启用时根据文件内容进行重写。
	"editor.insertSpaces": false,
	"editor.detectIndentation": false,
	"terminal.integrated.shell.windows": "C:\\Windows\\Sysnative\\WindowsPowerShell\\v1.0\\powershell.exe",
	"[csharp]": {}
}
```
- 设置快捷键
快捷键“Ctrl+Shift+P”，然后输入“setting”，选择“首选项-打开用户设置”，然后在，右侧栏中输入相应的配置项 

例如：
``` javascript
// 将键绑定放入此文件中以覆盖默认值
[
	{
		"key": "ctrl+m o",
		"command": "editor.foldAll",
		"when": "editorFocus"
	},
	{
		"key": "ctrl+m l",
		"command": "editor.unfoldAll",
		"when": "editorFocus"
	},
	{
		"key": "ctrl+e c",
		"command": "editor.action.addCommentLine",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+e u",
		"command": "editor.action.removeCommentLine",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 0",
		"command": "editor.foldAll",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 1",
		"command": "editor.foldLevel1",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 2",
		"command": "editor.foldLevel2",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 3",
		"command": "editor.foldLevel3",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 4",
		"command": "editor.foldLevel4",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 5",
		"command": "editor.foldLevel5",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 6",
		"command": "editor.foldLevel6",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 7",
		"command": "editor.foldLevel7",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 8",
		"command": "editor.foldLevel8",
		"when": "editorTextFocus"
	},
	{
		"key": "ctrl+m 9",
		"command": "editor.foldLevel9",
		"when": "editorTextFocus"
	}
]
```
- 安装插件
快捷键“Ctrl+Shift+P”，然后输入“install”，选择“扩展-安装扩展”，搜索要安装的插件，比如，输入“vue”，然后会列出vue相关的插件，点击“安装”进行安装，然后重新加载窗口使扩展生效
![Alt text](asset/img/vue/1494990877880.png)
#### 1.4. 安装Git
 由于Git是可选安装的，所以暂时先不叙述！
#### 1.5. 安装HBuilder
　　官方提供的安装包下载完成后，直接解压就能用，所以不需要安装，双击“HBuilder.exe”就能打开HBuilder就能打开编辑器，由于只用它来真机调试和发布打包，所以这部分内容后面再介绍。
　　
　　到目前为止，Node.js开发所需的环境基本已搭建完毕，后面开发过程中需要用到的npm模块包用到的时候再安装，下面开始以移动端MIS为例，创建一个Vue项目。

### 2. 创建Vue项目
打开cmd工具，输入cd命令，进入项目创建的目录，例如：
![Alt text](asset/img/vue/1494991746075.png)

然后，输入“vue init webpack mis-mobile”，表示使用vue-cli命令行工具在当前目录下创建一个基于webpack的项目，这个项目名为“mis-mobile”，然后，进行一系列设置，如下：
![Alt text](asset/img/vue/1494992287347.png)
#### 2.1. 项目结构
完成后，使用打开VS Code，在启动页中“开始”下面点击“打开文件夹”，打开刚才创建的Vue项目所在的目录，项结构如图所示：
![Alt text](asset/img/vue/1494992749898.png)
- .vscode ：该文件夹包含一个launch.json文件，用于vs code调试信息的配置
- build和config：这两个文件夹包含开发环境运行配置和生产环境下打包发布配置，主要包括webpack配置项的设置和一些参数配置
- node_modules：该文件夹存放本项目特有的通过NPM安装的所有模块包
- server：服务端代码目录，vue初始化的时候没有这个目录，该目录是后面手动添加的
- src：源代码目录，包含静态资源目录（assets）、组件（components）、路由（router）、视图（views），主视图（App.vue）和js入口文件（main.js）
- static：静态资源目录
- .babelrc：babel配置，主要是es6语法转化为es5语法的配置
- index.html：主页
- package.json：整个项目（模块包）的全局配置文件，主要包含项目名称、版本、作者，项目地址，依赖的模块，执行脚本等配置内容，更多的配置项可参考文档：http://www.mujiang.info/translation/npmjs/files/package.json.html

#### 2.2. 安装项目依赖包
　　打开VS Code终端窗口（快捷键Ctrl+J，也可以使用cmd窗口，但需要切换到项目根目录下），输入“npm install”，然后回车，即开始安装（下载）项目所依赖的所有模块，如果出现红色字体，说明安装出错，检查具体错误原因，重新下载，如果成功，则会以黄色字体列出本次安装的模块。
　　**说明**：该命令会检查项目根目录下的package.json文件，然后安装“dependencies”和“devDependencies”参数指定的所有依赖包，由于是局部安装，所有该安装会把这些所有依赖包下载到项目的“node_modules”目录下，下载完成后，会发现该目录下的模块包非常多
#### 2.3. 项目运行
　　在VS Code终端窗口，输入“npm run dev”，回车后开始编译，编译完成后将自动打开系统默认浏览器显示主页，如图：
**注意**：首次运行该命令，可能会提示如下错误，其中关键的错误信息已经标出来了，该提示表示webpack运行项目的默认端口8080已经被占用了，解决办法：打开文件“config/index.js”，将dev.port默认的8080端口重新设置为新的端口，例如：6060，然后重新执行命令：“npm run dev”，成功后提示如下：
![Alt text](asset/img/vue/1495001009648.png)
![Alt text](asset/img/vue/1495000295332.png)
![Alt text](asset/img/vue/1495000932985.png)
**说明**：“npm run dev”命令会监听项目文件的变化，所以每次更改代码后，页面无需手动刷新即可立即看见更改的效果
#### 2.4. 断点调试
　　打开文件“build/webpack.dev.conf.js”，找到配置项“devtool”，将该参数设置为“#source-map”，然后，重新运行项目（需要Ctrl+C先停止运行，如果正在运行的话），然后，打开Chrome浏览器的调试窗口，在指定代码处加上断点即可实现源代码的调试，效果如图
　　![Alt text](asset/img/vue/1495002149028.png)
关于devtool的几种模式可以参考：[[webpack] devtool配置对比](http://www.cnblogs.com/hhhyaaon/p/5657469.html)
#### 2.5. 打包发布
　　这里的打包是指利用Webpack将ES6语法和vue文件编译成浏览器能识别和执行的js语法，并且将css、js和html等内容进行合并和压缩等处理，最终形成正是环境上的发布包。
　　打开VS Code终端窗口，输入“npm run build”，然后回车，打包成功后的界面和文件如下：
![Alt text](asset/img/vue/1495003506542.png)
![Alt text](asset/img/vue/1495003586976.png)
