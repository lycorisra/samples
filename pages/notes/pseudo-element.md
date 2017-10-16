## 伪元素应用

###### 伪元素实现容器内子元素平均分布

html代码：
``` html
<div class="demo01"> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
</div> 
```
css代码
``` css
.demo01 {
    width: 90%;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
	border: 1px solid #ddd;
	
    text-align: justify;
}
.demo01:after {
	content:'';
	display: inline-block;
    width: 100%;
}
.demo01 i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
	font-size: 18px;
	vertical-align: middle;
    background-color: chocolate;
}
```
<link rel="stylesheet" href="src/css/pseudo-element.css"/>
效果如下：
<div class="demo01"> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
	<i></i> 
</div> 

```说明```
在CSS3中可以使用弹性布局flex轻松实现以上效果