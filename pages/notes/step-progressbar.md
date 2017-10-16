<link rel="stylesheet" href="src/css/step.css">

<div class="steps"> 
	<ul> 
		<li class="start done">第一步</li> 
		<li class="arrow arrow1"></li>
		<li class="done second step">第二步</li> 
		<li class="arrow arrow2"></li>
		<li class="done third step">第三步</li> 
		<li class="arrow arrow3"></li>
		<li class="undone fourth step">第四步</li> 
		<li class="arrow arrow4"></li>
		<li class="undone fifth step">第五步</li> 
	</ul> 
</div> 

### 说明
- 1、本示例通过li元素实现每个步骤效果
- 2、中间的箭头通过绝对定位的li元素，并分别设置丄右下左四个边框的颜色实现向右的箭头效果，并设置left属性来定位到指定的位置
- 3、本示例每一步骤和箭头大小及位置都是固定尺寸，所以不方便灵活扩展