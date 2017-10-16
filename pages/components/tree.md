# 树形控件

## 基本
``` html
<label>省份：</label>
<select class="dropdown w200">
	<option value="">请选择</option>
	<option value="">北京市</option>
	<option value="">上海市</option>
	<option value="">湖北省</option>
</select>
```
<div>
	<label>省份：</label>
	<select class="dropdown w200">
		<option value="">请选择</option>
		<option value="1">北京市</option>
		<option value="2">上海市</option>
		<option value="3">湖北省</option>
	</select>
</div>

## 显示树形下拉框
支持模糊搜索，支持级联选择、支持多选
* `注意`： 该组件还需要完善，
- 1）树节点展开和收缩时，前面的图标显示不一致；
- 2）树节点选择效果不大好，目前是第二次选择父节点时，会关闭选择器，并完成选择

``` html
<label>省份：</label>
<select id="demo02" class="w200" multiple></select>

<script>
	initTree('#demo02'); // demo02是树组件id
</script>
```
<div>
	<label>省份：</label>
	<select id="demo02" class="w200" multiple></select>
</div>


## 配置项
| 属性        |说明|类型|默认值|     
|:-------------:|:-------------:|:-----:|:-----:|
| multiple      |是否多选 | Boolean | false |
| width      |选择器宽度 | Boolean | auto |
| callback      |组建初始化完成后的回调函数 | Function | null |
| onselect      |下拉项选择后回调函数 | Function | null |
| editable      |是否支持模糊搜索 | Boolean | false |
| onlyleaf      |是否只选择子节点，如果是，则点击父节点时，展开或折叠下面的子节点；如果否，则点击父节点时，先展开下面子节点，如果子节点已展开，则选中父节点      |   Boolean | false |
| textfield |Select下拉项文本label字段名称      |    String | text |
| valuefield |Select下拉项文本value字段名称      |    String | value |

<script>
	seajs.use(['jquery'], function($) {
		seajs.use(['component'], function(dropdown){
			initTree('#demo02');
			console.log(222, $, dropdown)
		})
	});
</script>