/*
    级联选择器
*/
function CasecadeSelector(options) {
	var id = '',                // 当前被激活（被点击）的选择器实例ID
		cueEl = null,        // 当前挂载选择器的元素  
		url = options.url,    // 数据源路径
		elementIds = options.elementIds || [],                      // 挂载元素数组
		checkedStaffs = options.staffs || {};                       // 初始化的人员信息

	// 获取当前选择器实例
	var $e = function (selector) {
		return $(selector, '#' + id);
	};
	//阻止默认浏览器动作(W3C)
	function stopDefault(e) {
		if (e && e.preventDefault) {
			e.preventDefault();//IE中阻止函数器默认动作的方式
		}
		else {
			window.event.returnValue = false;
		}
		return false;
	};
	//浏览器检测
	var navTest = function () {
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
				(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
					(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
						(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
							(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

		if (Sys.ie) $('span').text('IE: ' + Sys.ie);
		if (Sys.firefox) $('span').text('Firefox: ' + Sys.firefox);
		if (Sys.chrome) $('span').text('Chrome: ' + Sys.chrome);
		if (Sys.opera) $('span').text('Opera: ' + Sys.opera);
		if (Sys.safari) $('span').text('Safari: ' + Sys.safari);
	};
	//判断是否为IE浏览器
	var IsIE = function () {
		var ua = navigator.userAgent.toLowerCase();
		var result = ua.match(/msie ([\d.]+)/) || ua.match(/rv:([\d.]+)\) like gecko/);
		return !!result && result.length > 0;
	};

	/**********************选择器***********************/
	var selector = {
		staffs: [],     // 人员列表，人员信息包括（id,name,deptId,deptName）
		departs: [],    // 部门列表，部门信息包括（Id,Name,ParentId,Level）

		// 设置选择器的位置，默认在挂载元素的下方，该位置会自适应页面变化
		setPos: function (el) {
			$(el).css({
				right: '',
				bottom: ''
			});
			var body = document.body,
				winW = $(window).width(),
				winH = $(window).height(),
				elTop = el.offsetTop,
				elLeft = el.offsetLeft,
				elW = el.offsetWidth,
				elH = el.offsetHeight,
				isIe = IsIE(),
				offsetParent = this.getOffsetParent(el),
				parTop = isIe || !offsetParent ? 0 : offsetParent.offsetTop,
				parLeft = isIe || !offsetParent ? 0 : offsetParent.offsetLeft,
				right = 0,
				bottom = 0,
				isReset = false,
				style = {};

			bottom = winH - elTop - elH - parTop;
			right = winW - elLeft - elW - parLeft;

			if (bottom < 0) {
				isReset = true;
				style.bottom = '5px';
			}
			if (right < 0) {
				isReset = true;
				style.right = '5px';
			}
			isReset && $(el).css(style);
		},
		// 获取元素的offsetParent
		getOffsetParent: function (el) {
			var parent = null,
				parents = $(el).parents();

			parents.each(function (i, e) {
				if ($(e).css('position') === 'fixed') {
					parent = e;
					return parent;
				}
			});
			return parent;
		},
		// 初始化选择器
		init: function () {
			var self = this;
			// 初始化选择器骨架，作为ajax成功请求数据后回调函数
			var callback = function (data) {
				self.staffs = data.users || data;
				self.departs = data.depts || data;

				// staffs数据模拟 （id,name,deptId,deptName）
				var staffs = [];
				data.forEach(item => {
					staffs.push({
						id: item.Id,
						name: item.Name,
						deptId: item.ParentId,
						deptName: item.Name
					})
				});
				self.staffs = staffs;

				// 为每一个挂载元素单独实例化选择器
				$(elementIds).each(function (i, e) {
					var el = document.getElementById(e);

					id = e + '_Selector';
					self.initFrame(el);
					self.initLeftPanel(data.depts || data);
					self.initValue(checkedStaffs[e], el);
					self.bindEvent(el);
				});
				// 注册document点击事件，即实现点击选择器区域之外的地方后隐藏选择器
				$(document).click(function (event) {
					var target = event.target,
						length = $(target).parents('dl.CasecadeSelector').length;
					if (length === 0) {
						$e('.CasecadeSelector').hide();
						$e('.CasecadeSelector').css({ right: 'auto' });
					}
				});
				$(window).resize(function () {

				})
			};
			self.getStaffs(callback);
		},
		// 初始化选择器骨架
		initFrame: function (el) {
			var $el = $(el),
				self = this,
				html = '';

			html = html.concat(
				'<dl class="CasecadeSelector selector">',
				'<dd class="toolbar"><input class="query" placeholder="员工查找,逗号分割多个员工" type="text" /><a class="submit">确定</a><a class="cancel">取消</a></dd>',
				'<dt class="leftPanel"></dt>',
				'<dd class="rightPanel">',
				'<h5>待选人员列表</h5>',
				'<div class="waitingItems"></div>',
				'<h5 class="checkedCount">已选人员</h5>',
				'<div class="checkedItems"></div>',
				'</dd>',
				'</dl>'
			);
			// 将初始化后的选择器绑定到挂载元素上
			var width = $el.css('width');
			$el.css('width', width);
			$el.wrap('<div id="' + id + '" class="select disableselect"></div>');
			$el.parent().append(html);
		},
		// 初始化左边部分的部门列表
		initLeftPanel: function (data) {
			var self = this,
				items = '';

			$(data).each(function (i, e) {
				items += '<span data-id="' + e.Id + '" class="level' + e.Level + ' group' + e.ParentId + '">' + e.Name + '</span>';
			});
			$e('.leftPanel').html(items);
		},
		// 初始化待选列表
		initWaitingItems: function (staffs) {
			var self = this,
				items = '';

			$(staffs).each(function (i, e) {
				items += '<label><input type="checkbox" />' + e.name + '</label>';
			});
			$('.waitingItems').html(items);
		},
		// 初始化已选列表
		initCheckedItems: function () {
			var self = this,
				checkedItems = self.options.checkedItems,
				items = '';

			$(checkedItems).each(function (i, e) {
				items += '<span>' + e.name + '</span>';
			});
			$('.checkedItems').html(items);

		},
		// 初始化挂载元素的值，并同步到已选列表
		initValue: function (staffs, el) {
			if (staffs) {
				var self = this,
					html = '',
					items = (staffs && staffs.split(',')) || [],
					values = [];
				$(items).each(function (i, e) {
					var staff = self.getStaffById(e);
					if (staff) {
						html += '<span data-id="' + e + '" title="' + staff.deptName + '">' + staff.name + '<i>x</i></span>';
						values.push(staff.name);
					}
				});
				$e('.checkedItems').append(html);
				$(el).val(values.join(','));
			}
		},
		// 绑定操作元素事件，包括部门选择，人员选择，确定和取消等
		bindEvent: function (el) {
			var self = this,
				$el = $(el);

			// 挂载元素点击事件，点击后激活并弹出选择器
			$el.unbind('click').click(function (event) {
				$('.selector').hide();
				//$('.selector').not($(this).siblings('.selector')).hide();
				cueEl = el;
				id = el.id + '_Selector';
				$e('.CasecadeSelector').toggle();
				//$e('.query').focus();
				self.setPos($(this).siblings()[0]);
				return false;
			});
			// 挂载元素键盘keyup事件，实现手动输入与选择项同步
			$el[0].onkeyup = function () {
				setTimeout(function () {
					self.handleKeyup(el);
				}, 0);
			};
			$e('.query')[0].onkeyup = function () {
				var el = this;
				setTimeout(function () {
					self.handleKeyup(el, false);
				}, 0);
			};
			// 挂载元素change事件，对外提供change事件的回调处理接口
			$el.unbind('change').change(function () {
				if (typeof onchange == 'function') {
					onchange();
				}
				self.setHostElValue();
			});

			//$e('.CasecadeSelector').unbind('click');
			// 部门选择事件
			$e('.leftPanel').delegate('span', 'click', function () {
				self.selectDepart(this);
			});
			// 待选项点击事件（添加项）
			$e('.waitingItems').delegate('label input', 'click', function () {
				var id = el.id,
					onSelect = options.onSelect && options.onSelect[id];
				if (typeof onSelect === 'function') {
					var result = onSelect(this, api.getStaffs());
					result && self.checkItem(this);
				}
				else {
					self.checkItem(this);
				}
			});
			// 已选项点击事件（移除项）
			$e('.checkedItems').delegate('span i', 'click', function () {
				var id = $(this).parent().attr('data-id');
				$(this).parent().remove();
				$('.waitingItems input[value="' + id + '"]').prop('checked', false);

				var count = self.setHostElValue();
				self.setCheckedCount(count);
				return false;
			});
			// 确定选择
			$e('.CasecadeSelector').delegate('a.submit', 'click', function () {
				self.setHostElValue();
				$e('.CasecadeSelector').hide();
			});
			// 关闭（隐藏）选择器
			$e('.CasecadeSelector').delegate('a.cancel', 'click', function () {
				$e('.CasecadeSelector').hide().css({ right: 'auto' });
			});
		},
		// ajax请求，获取人员和部门列表
		getStaffs: function (callback) {
			var self = this;
			$.getJSON(url, function (data) {
				callback(data);
			}, 'json');
		},
		// 根据用户ID获取用户完整信息（id,name,deptId,deptName），返回结果唯一
		getStaffById: function (userid) {
			var info;
			for (var i = 0; i < this.staffs.length; i++) {
				if (this.staffs[i].id === userid) {
					info = this.staffs[i];
					break;
				}
			}
			return info;
		},
		// 根据用户名称获取用户完整信息（id,name,deptId,deptName）,支持模糊搜索，返回用户列表
		getStaffsByName: function (name, isFuzzy) {
			var staffs = [],
				username = '';

			if (!name && name == '') {
				return staffs;
			}
			isFuzzy = !!isFuzzy;
			for (var i = 0; i < this.staffs.length; i++) {
				username = this.staffs[i].name;
				if (!isFuzzy) {
					(username === name) && staffs.push(this.staffs[i]);
				}
				else {
					(username.indexOf(name) > -1) && staffs.push(this.staffs[i]);
				}
			}
			return staffs;
		},
		// 获取已选项列表（userid,username,depid,depname）
		getChecked: function () {
			var result = {},
				staffs = [];

			var staffs = [],
				items = $e('.checkedItems span');

			items.each(function (i, e) {
				var $el = $(e);
				staffs.push({
					userid: $el.attr('data-id'),
					username: $el.text().replace('x', ''),
					depid: $el.attr('data-depid'),
					depname: $el.attr('title')
				});
			});

			return staffs;
		},
		// 选择部门操作，并初始化该部门的人员待选列表
		selectDepart: function (e) {
			var self = this,
				id = $(e).attr('data-id');

			self.toggle(e);
			var items = '';
			$(self.staffs).each(function (i, e) {
				if (e.deptId == id && e.name != '') {
					items += '<label><input type="checkbox" value="' + e.id + '"/>' + e.name + '</label>';
				}
			});
			$e('.waitingItems').html(items).attr('data-id', id);

			self.setCheckedState();
		},
		// 选择人员，并初始化人员已选列表
		checkItem: function (e) {
			this.setCheckedItems(e);
			var count = this.setHostElValue();
			this.setCheckedCount(count);
		},
		// 设置待选列表中列表项的选中状态
		setCheckedState: function () {
			// 初始化复选框checked状态
			var self = this,
				checked = false;
			$e('.waitingItems input').each(function (i, e) {
				checked = $e('.checkedItems span[data-id="' + e.value + '"]').length > 0;
				e.checked = checked;
			});
		},
		// 设置挂载元素选中的项，手动输入时实时更新
		setHostElValue: function () {
			var items = $e('.checkedItems span'),
				values = [];
			items.each(function (i, e) {
				values.push($(e).text().replace('x', ''));
			})
			$(cueEl).val(values.join(','));
			return values.length;
		},
		// 更新已选列表，【选中】->【添加】，【未选中】->【移除】
		setCheckedItems: function (e) {
			var self = this,
				id = e.value,
				depid = $(e).parents('div.waitingItems').attr('data-id') || $(e).attr('data-deptId'),
				depname = $e('dt.leftPanel span[data-id="' + depid + '"]').text() || $(e).attr('data-deptname'),
				checked = e.checked,
				item = $e('.checkedItems').find('span[data-id="' + id + '"]'),
				exist = item.length > 0;

			if (!!checked) {
				if (!exist) {
					var html = '<span title="' + depname + '" data-id="' + id + '" data-depid="' + depid + '">' + $(e).parent().text() + '<i>x</span></i>';
					$e('.checkedItems').append(html);
				}
			}
			else {
				item.remove();
			}
		},
		// 更新选中项的数目
		setCheckedCount: function (count) {
			$e('.rightPanel h5.checkedCount').html('已选人员<span style="color:red">(' + count + ')</span>');
		},
		// 部门树点击事件 展开或折叠部门
		toggle: function (e) {
			var id = $(e).attr('data-id'),
				group = 'group' + id,
				children = $e('.leftPanel span.' + group),
				visible = children.hasClass('show');

			$(e).addClass('checked').siblings().removeClass('checked');
			if (visible) {
				children.each(function (i, e) {
					id = $(e).attr('data-id');
					$(e).removeClass('show');
					$e('.leftPanel span.group' + id).removeClass('show');
				})
			}
			else {
				children.addClass('show');
			}
		},
        /*
            处理键盘keyup事件
            @e：输入框元素
            @isclear：是否清除已选项，对于搜索框，不需要清除，而对于挂载元素需要同步用户输入，所以需要清除，默认是清除
        */
		handleKeyup: function (e, isclear) {
			var self = this,
				html = '',
				value = e.value = e.value.replace(/，/gi, ','),
				array = value.split(',') || [];

			(isclear == undefined || isclear == null) && (isclear = true);//默认清除已选项，保持与用户输入同步
			// 更新已选列表 - 移除未选项
			isclear && $e('.checkedItems span').each(function (i, e) {
				if (array.indexOf($(e).text().replace('x', '')) === -1) {
					$(e).remove();
				}
			});
			// 更新待选列表
			$e('.waitingItems').empty();
			$(array).each(function (i, e) {
				var staffs = self.getStaffsByName(e, true);
				$(staffs).each(function (i, s) {
					if (html.indexOf(s.id) === -1) {
						html += '<label title="' + s.deptName + '"><input type="checkbox" value="' + s.id + '" data-deptId="' + s.deptId + '" data-deptname="' + s.deptName + '"/>' + s.name + '</label>';
					}
				});
			});
			$e('.waitingItems').append(html);
			// 设置待选列表中已选项
			self.setCheckedState();
			// 更新选中项数目
			var count = $e('.checkedItems span').length;
			self.setCheckedCount(count);
		}
	};

	selector.init();

	/**********************对外提供的接口***********************/
	var api = {
		// 获取所有选择器已选择的人员列表，数据格式为{[ids:'1,2',name:'xxx,xxx'],[ids:'1,2',name:'xxx,xxx']}
		getStaffs: function () {
			var result = {};

			$(elementIds).each(function (i, e) {
				var ids = [],
					names = [],
					items = $('.checkedItems span', $('#' + e + '_Selector'));

				items.each(function (i, e) {
					ids.push($(e).attr('data-id'));
					names.push($(e).text().replace('x', ''));
				});
				result[e] = {
					ids: ids.join(','),
					names: names.join(',')
				};
			});
			return result;
		},
		// 获取所有选择器已选择的人员列表，人员信息包括userid,username,depid,depname
		getFullStaffs: function () {
			var result = {},
				staffs = [];
			$(elementIds).each(function (i, e) {
				var selectorId = e,
					staffs = [],
					items = $('.checkedItems span', $('#' + selectorId + '_Selector'));

				items.each(function (i, e) {
					staffs.push({
						userid: $(e).attr('data-id'),
						username: $(e).text().replace('x', ''),
						depid: $(e).attr('data-depid'),
						depname: $(e).attr('title')
					});
				});
				result[selectorId] = staffs;
			});
			return result;
		}
	};
	return api;
};