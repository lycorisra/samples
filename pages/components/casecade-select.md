## 层级选择器
该选择器分为三部分：左边树形结构、右边上部分待选项和右边下部分已选项。支持模糊搜索和多选

``` html
<div>
	<li>
		<label for="demo01">选择器1：</label>
		<input id="demo01" type="text" name="demo01" />
	</li>
	<li>
		<label for="demo02">选择器2：</label>
		<input id="demo02" type="text" name="demo02"/>
	</li>
	<li>
		<label for="demo03">选择器3：</label>
		<input id="demo03" type="text" name="demo03" />
	</li>
</div>

var options = {
	elementIds: ['demo01', 'demo02', 'demo03'],
	staffs: {
		demo01: '10',
		demo02: '216',
		demo03: '8'
	},
	onSelect: {
		demo01: function(e, checkedStaffs){
			console.log(e, checkedStaffs);
		}
	}
};
new CasecadeSelector(options);
```
<div>
	<li>
		<label for="demo01">选择器1：</label>
		<input id="demo01" type="text" name="demo01" />
	</li>
	<li>
		<label for="demo02">选择器2：</label>
		<input id="demo02" type="text" name="demo02"/>
	</li>
	<li>
		<label for="demo03">选择器3：</label>
		<input id="demo03" type="text" name="demo03" />
	</li>
</div>

<script>
	seajs.use(['jquery'], function($) {
		seajs.use(['CasecadeSelector'], function(selector){
			var options = {
				url: './src/js/area.json',
				elementIds: ['demo01', 'demo02', 'demo03'],
				staffs: {
					demo01: '10',
					demo02: '216',
					demo03: '8'
				},
				onSelect: {
					demo01: function(e, checkedStaffs){
						console.log(e, checkedStaffs);
					}
				}
			};
			new CasecadeSelector(options);
		})
	});
</script>