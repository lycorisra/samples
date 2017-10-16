## Vue.js使用注意事项

### 1. 单个页面不要多次实例化Vue对象
在一个页面中，只需要实例化一次Vue对象即可，尽量避免多次实例化，并且在最外层实例化，例如：
``` javascript
<script type="text/javascript">
	$(function () {
	    taxSubjectEdit.GetTaxSubject();
	});
	
	var taxSubjectEdit = {
		Save: function () {
		},
		Cancel: function () {
		},
		GetTaxSubject: function () {
			var code = Form.GetQueryString("Code");
            if (code != "undefined") {
                $("[Name='Code']").val(code);
                $.ajax({
                    type: 'POST',
                    url: '../../AjaxHandler/SystemHandler.ashx?OpType=GetTaxSubject',
                    data: $("#TaxSubjectEditForm").serializeArray(),
                    dataType: 'json',
                    success: function (response) {
                        if (response.Result) {
	                        // 每一次请求完数据后在这里重新实例化Vue对象，实现界面元素的更新
                            var app = new Vue({
                                el: '#app',
                                data: {
                                    code: response.Result.Code,
                                    name: response.Result.Name,
                                    type: response.Result.Type,
                                    state: response.Result.State,
                                    note: response.Result.Note
                                }
                            })
                        }
                        $("[Name='Code']").attr("disabled", "true");
                    },
                    error: function (error, msg) {
                    }
                });
            }
		},
	}
</script>  
```
​　　以上例子，GetTaxSubject方法的主要作用是通过ajax请求向后台数据，然后，将返回的数据显示的界面上，该方法虽然使用了Vue的双向绑定特性，实现界面元素的更新，但存在如下几个问题，
- 1、在每次成功请求后，重新实例化了Vue对象，这不符合Vue最佳实践；
- 2、整段代码中夹杂DOM元素操作，除了成功返回后实例化Vue实现界面视图更新外，其他操作基本都是DOM操作，这里仅仅是把Vue当作数据绑定的工具来使用了
完善后的代码：
``` javascript 
<script type="text/javascript">
	$(function () {
		var app = new Vue({
			el: '#app',
		    data: {
		        code: response.Result.Code,
		        name: response.Result.Name,
		        type: response.Result.Type,
		        state: response.Result.State,
		        note: response.Result.Note
		    },
		    methods: {
			    Save: function () {
				    // todo
				},
				Cancel: function () {
					// todo
				},
				GetTaxSubject: function () {
					var self = this,
						param = this.param;
					$.ajax({
		                    type: 'POST',
		                    url: '../../AjaxHandler/SystemHandler.ashx?OpType=GetTaxSubject',
		                    data: param,
		                    dataType: 'json',
		                    success: function (response) {
		                        if (response.Result) {
			                        self.model = response.Result; // 更新模型
			                        self.disabled = true; // 设置元素不可用
		                        }
		                    }
		             });
		         }
			});
		}
</script>  
```
### 2、尽量避免DOM元素操作
　　使用Vue最大的好处之一就是可以省去大量繁琐的DOM操作，开发人员只需要对数据（模型）进行修改实现视图的更新，这样可以有更多的精力实现业务逻辑方面的代码，以下是有待完善的使用方式：
``` javascript
var vm = new Vue({
    el: '#app',
    mounted: function () {
    },
    data: {
    },
    computed: {
        Sum: function () {
        }
    },
    methods: {
        init: function () {
            var vm = this;
            $.getJSON("../../AjaxHandler/SystemHandler.ashx?OpType=GetTaxSubjectDic", "", function (response) {
                if (response.TaxSubject != null) {
                    var tC = "";
                    $(response.TaxSubject).each(function () {
                        tC += "<option value=" + this.Code + ">" + this.Name + "</option>";
                    })
                    $("[Name='TaxSubject']").html("<option value=''></option>" + tC);
                    $("[Name='QueryTaxSubject']").html("<option value=''>请选择</option>" + tC);
                    $("[Name='UpdateTaxSubject']").html("<option value=''>请选择</option>" + tC);
                }

                if (response.NewTaxSubject != null) {
                    var ntC = "";
                    $(response.NewTaxSubject).each(function () {
                        ntC += "<option value=" + this.Code + ">" + this.Name + "</option>";
                    })
                    $("[Name='NewTaxSubject']").html("<option value=''></option>" + ntC);
                    $("[Name='QueryNewTaxSubject']").html("<option value=''>请选择</option>" + ntC);
                    $("[Name='UpdateNewTaxSubject']").html("<option value=''>请选择</option>" + ntC);
                }

                vm.options = response.TaxSubject;
                vm.options1 = response.NewTaxSubject;

                vm.querySplitTax();
            });
        },
```
　　以上代码中，init方法主要作用是从后台请求数据，然后填充到select下拉框控件中，但实现方式却依然采用之前通过JQuery操作DOM的思维模式。
　　这里最佳实践方式是在select元素添加v-for指令，然后通过ajax请求完数据后更新模型，比如：
1、首先添加v-for指令，将视图绑定到模型上
``` html
<select>
	<option v-for="(item,index) in options" value="item.Code" v-text="item.Name"></option>
</select>
```
2、请求数据，然后更新模型
``` javascript
methods: {
        init: function () {
            var vm = this;
            $.getJSON('../../AjaxHandler/SystemHandler.ashx?OpType=GetTaxSubjectDic', ', function (response) {
                vm.options = response.TaxSubject;
            });
        }
```
这样的例子还有，比如
``` javascript
// 实现列表全选功能
chkAll: function () {
     if ($('[Name="chkAll"]').attr('checked'))
         $('[Name="chkItem"]').attr('checked', 'checked');
     else
         $('[Name="chkItem"]').removeAttr('checked');
 },
 // 更新选中项
 updateSubject: function () {
     var ids = "";
     var sids = "";//拆分明细id组
     var vm = this;
     $('input[name="chkItem"]:checked').each(function () {
         var item = vm.invoices[$(this).val()];

         if (item.SID != 0 && item.SID != null && item.SID != '') {
             if (sids == "")
                 sids = item.SID.toString();
             else
                 sids += "," + item.SID;
         }
         else {
             if (ids == "")
                 ids = item.ID.toString();
             else
                 ids += "," + item.ID;
         }

     });
     //console.log(ids);
     var updateSubjectForm = document.getElementById('UpdateSubjectForm');
     var valid = $.html5Validate.isAllpass(updateSubjectForm);

     var dataParm = {
         Ids: ids,
         SIds: sids,
         TaxSubjectCode: $('[Name="UpdateTaxSubject"]').val(),
         NewTaxSubjectCode: $('[Name="UpdateNewTaxSubject"]').val()
     }
     if (valid) {
         $.post(updateSubjectForm.action, dataParm, function (response) {
             if (response.Result > 0) {
                 vm.querySplitTax();
                 layer.alert("操作成功！", {
                     icon: 1, shade: 0.4, end: function () {
                         layer.closeAll();
                     }
                 });
             }
             else {
                 layer.alert("操作失败," + response.Message, { icon: 2, shade: 0.4 });
             }
         }, 'json');
     }
 },
```
### 3、其他
1、当使用v-if、v-show和插值符等指令和表达式的时候，如果页面渲染比较慢，可能会出现闪烁的效果，解决办法是添加v-cloak指令，然后在css中设置如下样式，可以避免页面闪烁
``` css
[v-cloak] {
  display: none;
}
```
2、对于列表渲染，如果通过数组进行列表渲染，需要注意：
>由于Javascript的限制，Vue不能检测以下变动的数组：
>当你利用索引直接设置一个项时，例如： vm.items[indexOfItem] = newValue当你修改数组的长度时，例如： vm.items.length = newLength
>为了避免第一种情况，以下两种方式将达到像 vm.items[indexOfItem] = newValue 的效果， 同时也将触发状态更新：
>Vue.set(example1.items, indexOfItem, newValue)
>避免第二种情况，使用 splice：example1.items.splice(newLength)