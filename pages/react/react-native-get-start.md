
## React Native开发环境搭建
### Android开发环境
#### 软件安装
需要安装Java JDK、Android Studio、Python 2和react-native-cli及yarn工具包
- [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)：Java开发工具包（Java Development Kit），是一种用于构建在Java平台上发布的应用程序、applet和组件的开发环境，包括Java编译器、JVM、大量的Java工具以及Java基础API里面的Java类库和语言规范
- [Android Studio](http://www.android-studio.org/)：包含用于构建Android应用所需的所有工具，推荐选择包含Android SDK的安装包，否则需要单独安装Android SDK
- [Python 2](https://www.python.org/download/releases/2.7.2/)：目前不支持Python 3版本
- react-native-cli及yarn工具包：使用npm进行安装：npm i react-native-cli yarn -g
#### 环境变量设置
安装完成后手动设置相应的环境变量，如下
- 用户环境变量PATH末尾追加如下：
``` cmd
PATH：C:\Users\xxx\AppData\Local\Android\sdk\tools;C:\Users\xxx\AppData\Local\Android\sdk\platform-tools
```
- 系统环境变量新增ANDROID_HOME：
``` cmd
ANDROID_HOME：C:\Users\xxx\AppData\Local\Android\sdk
```
- 系统环境变量新增CLASSPATH：
``` cmd
CLASSPATH：.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
```
- 系统环境变量新增JAVA_HOME：
```
JAVA_HOME：D:\software\java\jdk1.8.0_131
```
- 用户环境变量PATH末尾追加如下：
```
Path：%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin
```
#### 真机调试
手机打开开发者调试，并通过数据线连接到电脑（是否需要安装手机助手，例如小米手机助手，还未确认），然后，在项目根目录下打开命令行窗口，运行react-native run-android命令，首次运行该命令耗费的时间比较长，如果一切顺利，在手机上就能看到效果。
注意：
- react-native默认使用8081端口，如果该端口被占用，需要手动更改端口，更改方法：左右摇晃手机，打开Dev Tool界面，找到，手动输入电脑上的IP地址和端口，然后重新加载
- react-native start 命令后面跟 “--port 端口号”可以手动更改端口，例如：
```
react-native start --port 8083
```
- 运行react-native run-android命令前，请先运行adb devices命令确保已经连接手机，并且，确保通过react-native start命令已经开启了服务端

### IOS开发环境
由于没有mac，所以暂时先搭建一套“黑苹果”开发环境
#### 工具
- VMware：
- [unlocker206(密码：dp2g)](http://pan.baidu.com/s/1bpftVjT)：vmware12解锁os x系统的工具，注意需要关闭UAC，且unlocker释放路径不要包含任何中文和特殊符号！
- [Mac OS X 10.11 镜像文件(密码：cq4d)](http://pan.baidu.com/s/1pL8HE59)


**注意事项**
- 安装vmware workstation12，然后输入许可证，安装完后，打开Windows任务管理器-》服务，找到与VMware相关的服务，全部停止
- 解压unlocker206安装包，找到win-install.cmd，以管理员身份运行，这一步很关键
注意：如果运行后出现cmd窗口一闪而过的现象，说明可能没有执行成功，解决办法：用记事本打开“win-install.cmd”文件，找到以下代码，并删除
``` cmd
if %errorlevel% neq 0 (
    echo Administrator privileges required! 
    exit
)
```
保存后，相关服务重新停止，然后重新管理员运行该批处理命令
- 打开运行vmware workstation12，选择创建新的虚拟机

##### 参考
- [vmware12用 unlocker206能不能解锁 OS X系统](https://zhidao.baidu.com/question/1542240416740344187.html)
- [Windows下 VM12虚拟机安装OS X 10.11(详细教程)](https://jingyan.baidu.com/article/363872ec206a356e4ba16f30.html)
- [VMware 12安装Mac OS X 10.11](https://jingyan.baidu.com/article/bea41d4388a8c4b4c51be6ab.html)
- [在VMware上装完苹果系统后不能全屏怎么办](https://jingyan.baidu.com/article/a501d80cf43fc2ec630f5ed0.html)
- [VMware 12安装虚拟机Mac OS X 10.10不能上网问题](http://www.cnblogs.com/Dr-Hao/p/4940711.html)
