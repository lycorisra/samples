(function ($, window, document, undefined) {
    /*
        自定义dropdown控件，用户替换原生的select元素，支持单选和多选功能，提供美观简洁的UI和方便的api操作
        dropdown控件主要由三部分组成：
        第一个部分是由input元素和i元素组成的兼具输入和显示的输入框，这两个元素共同作为父元素.inputwrap的子元素；
        第二个部分是由自定义列表dd元素组成的下拉项列表；
        第三个部分是模糊搜索结果下拉项列表，其HTML结构与第二部分类似。
        这三部分共同被div元素包裹组成dropdown控件
    */
    var Dropdown = function (el, opt) {
        this.defaults = {
            multiple: false,
            editable: true,
            textfield: 'text',
            valuefield: 'value',
            optionHtml: '<dd data-value="{value}">{text}</dd>'
        };
        this.config = $.extend({}, this.defaults, opt);
        this.$frame = $(''.concat(
            '<div class="dropdown">',
                '<div class="inputwrap">',
		            '<input type="text" data-value="" placeholder="请选择项">',
                    '<i class="arrow"></i>',
                '</div>',
                this.config.multiple ? '<div class="tags"></div>' : '',
                '<div class="downwrap">',
		            '<dl class="options"></dl>',
                    this.config.editable ? '<dl class="options result"></dl>' : '',
                    //this.config.multiple ? '<span class="btn-ok">确 定</span>' : '',
                '</div>',
	        '</div>'));                                   // dropdown控件实例
        this.config.multiple && this.$frame.addClass('multiple');
        this.$element = $(el);                              // 页面最初的元素，后面会依据该元素生成dropdown控件，一般为select元素，也支持input元素
        this.$input = this.$frame.find('input').focus();    // dropdown输入框元素
        this.$arrow = this.$frame.find('.arrow');           // 下拉箭头元素
        this.$options = this.$frame.find('.options').eq(0); // dropdown下拉列表容器
        this.$downwrap = this.$frame.find('.downwrap').eq(0); // dropdown下拉列表容器
        this.$result = this.$frame.find('.result');         // dropdown模糊搜索结果列表

        var type = typeof (this.config.value);
        this.value = type == 'string' ? this.config.value.split(',') : [];
    };
    Dropdown.prototype = {
        //组件初始化
        init: function () {
            var $e = this.$element.hide(),
                children = $e[0] && $e[0].children,
                options = '',
                width = this.$element.outerWidth(),
                callback = this.config.callback;

            for (var i = 0, e; i < children.length; i++) {
                e = children[i];
                if (e.nodeType == 1) {
                    options += '<dd data-value="' + e.value + '">' + (e.innerText || e.innerHTML) + '</dd>';
                }
            }

            this.$frame.insertAfter($e);
            this.$input.css({ width: width });
            this.$result.css({ width: width });
            this.$options.css({ width: width }).html(options);
            this.$frame.css({ width: width });
            this.$options.html(options);
   
            var value = this.value.join(',');
            if (this.config.multiple) {
                this.setMultipleValue(value);
                this.setTags();
            }
            else {
                this.setValue(value);
            }
            this.bindEvent();
            callback && callback();
        },
        //注册事件
        bindEvent: function () {
            var self = this;
            // 点击下拉箭头显示或隐藏下拉列表事件
            self.$arrow.unbind().click(function () {
                var el = self.$options[0];
                $('.dropdown .options').not(self.$options).hide();
                //self.setPos(el);
                self.$options.toggle();
                self.$options.eq(0).show();
                self.$options.eq(1).hide();
                return false;
            });
            // 下拉项选中事件
            self.$frame.delegate('dd', 'click', function () {
                var disabled = $(this).hasClass('disabled');
                if (disabled) return false;

                var value = $(this).attr('data-value');
                self.onSelect(this);
                self.$input.focus();

                return false;
            });
            // dropdown输入框change事件
            self.$input.change(function (e) {
                //IE10以下（包括IE10）不支持自定义属性，因此dataset返回的是undefined
                var text = e.currentTarget.value,
                    value = text == '' ? '' : e.currentTarget.dataset.value;

                if (self.$options.eq(1).is(':visible') === false)
                    self.$input.val('');

                self.config.multiple ? self.setMultipleValue(value) : self.setValue(value);
            });
            // 根据配置项，决定dropdown是否支持模糊搜索
            self.config.editable && (self.$input.keyup(function (e) {
                setTimeout(function () {
                    var text = e.currentTarget.value.trim();
                    self.query(text);
                }, 0)
            }));
            self.config.multiple && ($('.tags').delegate('i', 'click', function (event) {
                self.removeItem($(this));
                self.$input.focus();
                return false;
            }));
        },
        // 设置下拉框坐标位置
        setPos: function (el) {
            var offset = this.$frame[0].getBoundingClientRect(),
                winW = $(window).width(),
		        winH = $(window).height(),
		        right = 0,
		        bottom = 0,
		        style = {
		            top: (offset.top + 22) + 'px',
		            left: offset.left + 'px'
		        };

            bottom = winH - offset.bottom - el.offsetHeight;
            right = winW - offset.right - el.offsetWidth;

            if (bottom < 0) {
                style.top = offset.top - el.offsetHeight + 'px';
            }
            if (right < 0) {
                style.left = offset.left - el.offsetWidth + 'px';
            }
            $(el).css(style);

        },
        //设置value
        setValue: function (value) {
            if (!value) {
                this.setEmpty();
            }
            else {
                var self = this,
                    onselect = self.config.onselect,
                    $option = self.$options.find('dd[data-value="' + value + '"]').eq(0);

                if ($option.length > 0) {
                    var val = $option.attr('data-value'),
                        text = $option.text().trim();
                    if (val) {
                        self.$element.val(val);
                        self.$input.val(text);
                        self.$input.attr('data-value', val);
                    }
                }
            }
            onselect && onselect(value);
        },
        // 设置多选值
        setMultipleValue: function (value) {
            var self = this,
                values = value && value.split(',') || [],
                array = [],
                option = null;

            if (values.length === 0) {
                self.setEmpty();
                return;
            }
            for (var i = 0, val; val = values[i]; i++) {
                $option = self.$element.find('option[value="' + val + '"]');

                if ($option.length > 0) {
                    array.push(val);
                    $option[0].selected = true;
                }
            }
            self.$input.attr('data-value', array.join(','));
        },
        //重置
        setEmpty: function () {
            var self = this;

            self.value = [];
            self.$input.val('');
            self.$input.attr('data-value', '');
            self.$options.find('dd').removeClass('selected');
            self.$element.val('');
        },
        getValue: function () {
            return this.value.join(',');
        },
        setTags: function () {
            var self = this,
                $tags = $('.tags', self.$frame).show();

            for (var i = 0, val; val = self.value[i]; i++) {
                var $option = $('option[value="' + val + '"]', self.$element);
                if ($option.length > 0) {
                    var tag = '<span data-value="' + val + '">' + $option.html().trim() + '<i>x</i></span>',
                        exists = $('span[data-value="' + val + '"]', $tags).length > 0;

                    !exists && $tags.append(tag);
                }
            }
        },
        addItems: function ($el) {
            var self = this,
                value = $el.attr('data-value'),
                selected = $el.hasClass('selected'),
                $tags = $('.tags', self.$frame);

            if (selected) {
                var tag = '<span data-value="' + value + '">' + $el.text().trim() + '<i>x</i></span>',
                    exists = self.value.indexOf(value) > -1;

                if (!exists) {
                    $tags.append(tag);
                    self.value.push(value);
                }
            }
            else {
                $('.tags span[data-value="' + value + '"]', self.$frame).remove();
                var index = self.value.indexOf(value);
                index > -1 && self.value.splice(index, 1);
            }
            var text = $tags.text().replace(/x/g, ',');
            $tags.attr('title', text);
        },
        removeItem: function ($el) {
            var self = this,
                $parent = $el.parent(),
                value = $parent.attr('data-value'),
                index = self.value.indexOf(value),
                $option = $('dd[data-value="' + value + '"]', self.$options);

            index > -1 && self.value.splice(index, 1);
            $parent.remove();
            $option.removeClass('selected');
            self.setMultipleValue();
        },
        /*
          Dropdown下拉项选中事件处理函数，用户选择项后，执行的操作有：
            1、设置input元素显示的内容（text），设置自定义属性data-value，记录选中的value值；
            2、更新原始select元素的value值；
            3、设置选中项的样式，隐藏下拉列表；
            4、触发input元素的onselect回调函数

          @el：被选中的元素，默认为dd元素
        */
        onSelect: function (el) {
            var self = this,
                $this = $(el),
                value = $this.attr('data-value');

            $('dd[data-value="' + value + '"]', $(el).parent()).toggleClass('selected');
            if (self.config.multiple === true) {
                self.addItems($this);
                self.setMultipleValue(self.value.join(','));
            }
            else {
                self.setValue(value);
                $this.parent().toggle();
                $this.addClass('selected').siblings().removeClass('selected');
            }
        },
        /*
          远程加载dropdown下拉项数据
          @option：各种参数集合的对象
        */
        reload: function (option) {
            option = $.extend({}, this.config, option);
            var self = this,
                url = option.url,
                value = self.config.value,
                textfield = option.textfield,
                valuefield = option.valuefield,
                items = '',
                options = '<option value="">请选择</option>';

            $.ajax({
                type: 'post',
                url: url,
                data: {},
                dataType: 'json',
                async: false,
                success: function (data) {
                    $(data).each(function (i, e) {
                        options += '<option value="' + e[valuefield] + '">' + e[textfield] + '</option>';
                        items += '<dd data-value="' + e[valuefield] + '">' + e[textfield] + '</dd>';
                    });
                    self.$options.html(items);
                    self.$element.html(options);
                    option.callback && option.callback();

                    if (self.config.multiple) {
                        self.setTags();
                        self.setMultipleValue(value);
                    }
                    else {
                        self.setValue(value);
                    }
                }
            });
        },
        //注册onchange事件处理程序
        change: function (onchange) {
            var self = this;
            self.$input.change(function (e) {
                var id = e.currentTarget.dataset.value;
                onchange && onchange(id);
            });
        },
        //模糊搜索，目前只支持中文，后期完善拼音搜索
        query: function (text) {
            var self = this,
                item = null,
                items = [];

            self.$options.eq(0).find('dd').each(function (i, e) {
                if (e.innerText.indexOf(text) > -1) {
                    item = e.cloneNode();
                    item.innerText = e.innerText;
                    items.push(item);
                }
            });
            if (items.length > 0) {
                items[0].focus();
                self.$options.hide()
                self.$result.html(items).show();
                self.$result.find('dd').show();
            }
            return items;
        }
    };
    /*
        下拉树组件
    */
    var Droptree = function (el, opt) {
        Dropdown.call(this, el, opt);
    };
    Droptree.prototype = new Dropdown();
    //加载树
    Droptree.prototype.load = function () {
        var option = this.config || {},
            self = this,
            url = option.url,
            items = '',
            icon = '<i class="spread"></i>',
            options = '<option value="">请选择</option>';

        $.getJSON(url, function (data) {
            $(data).each(function (i, e) {
                options += '<option value="' + e.Id + '">' + e.Name + '</option>';
                if (e.IsLeaf > 0) {
                    items += '<dd data-value="' + e.Id + '" data-group="' + e.ParentId + '" class="level' + e.Level + '">' + icon + '' + e.Name + '</dd>';
                }
                else {
                    items += '<dd data-value="' + e.Id + '" data-group="' + e.ParentId + '" class="level' + e.Level + ' leaf">　' + e.Name + '</dd>';
                }
            });
            self.$options.html(items);
            self.$element.html(options);

            if (self.config.multiple) {
                self.setTags();
                self.setMultipleValue(self.value.join(','));
            }
            else {
                self.setValue(self.value.join(','));
            }
        });
    };
    /*
        由于Droptree继承自Dropdown，所以Droptree下拉项（这里叫节点）选中事件处理程序与Dropdown选择事件类似，唯一的不同是如果选中的是父节点，则需要特殊处理
        @el：被选中的元素，默认为dd元素
    */
    Droptree.prototype.onSelect = function (el) {
        var self = this,
            $this = $(el),
            value = $this.attr('data-value'),
            classes = el.className,
            group = $this.attr('data-group'),
            $children = $this.siblings('[data-group="' + value + '"]');

        //如果不是叶子节点，则判断子节点是否已经展开，如果是，则选中该节点，结束本次click事件；如果否，则展开子节点，不选择任何节点，结束click事件
        if (classes.indexOf('leaf') === -1) {
            $this.siblings().find('i').removeClass('down');
            $this.find('i').toggleClass('down');
            if (self.getParents) {
                var parents = self.getParents(el);
                $(parents).each(function (i, e) {
                    $(e).find('i').addClass('down');
                })
            }
            var isShow = $children.eq(0).is(':visible');//$children.eq(0).isVisible();
            if ($children.eq(0).length > 0 && !isShow) {
                $this.siblings().not('[data-group="' + group + '"]').removeClass('show');
                $children.toggleClass('show');
                return false;
            }
        }
        //调用基类的onSelect方法
        Dropdown.prototype.onSelect.call(self, el);
    };
    /*
        从下往上（逻辑上）找当前节点的所有父节点
        @el：被选中的节点
    */
    Droptree.prototype.getParents = function (el) {
        var group = $(el).attr('data-group'),
            $parent = null,
            parents = [];

        $parent = this.$options.find('dd[data-value="' + group + '"]');
        while ($parent.length > 0) {
            parents.push($parent);
            $parent = this.$options.find('dd[data-value="' + $parent.attr('data-group') + '"]');
        }
        return parents;
    };

    // 注册document点击事件，即实现点击选择器区域之外的地方后隐藏选择器
    document.onclick = function (event) {
        var target = event.target;
        $('.dropdown .options').hide();
    };
    $.fn.dropdown = function (options) {
        var $obj = null,
            dropdown = null;

        options = options || {};
        $obj = this.each(function (i, e) {
            dropdown = $(this).data('instance');
            if (!dropdown) {
                var multiple = $(this).prop('multiple'),
                    value = $(this).attr('data-value');

                options.value = value;
                options.multiple = multiple;
                dropdown = new Dropdown(e, options);
                dropdown.init();
                $(this).data('instance', dropdown);
            }
        });
        return $.extend({}, $obj, dropdown);
    };
    $.fn.droptree = function (options) {
        var $obj = null,
            droptree = null;

        options = options || {};
        $obj = this.each(function (i, e) {
            droptree = $(this).data('instance');
            if (!droptree) {
                var multiple = $(this).prop('multiple'),
                    value = $(this).attr('data-value');

                options.value = value;
                options.multiple = multiple;
                droptree = new Droptree(e, options);
                droptree.init();
                options.url && droptree.load();
                $(this).data('instance', droptree);
            }
        });
        return $.extend({}, $obj, droptree);
    };
    $.fn.setForm = function (data) {
        var elements = [],
            field = null,
            name = '';

        elements = this[0].elements;
        for (var i = 0, len = elements.length; i < len; i++) {
            field = elements[i];
            name = field.name;
            if (!name) continue;
            switch (field.type) {
                case 'select-one':
                case 'select-multiple':
                    $(field).dropdown().setValue(data[name]);
                    break;
                default:
                    $(field).val(data[name]);

            }
        }
    };
})(jQuery, window, document);

$(function () {
    $('select.dropdown').dropdown();
});
var loadStaff = function (selector,deptid) {
    var url = '../AjaxHandler/CommonHandler.ashx?OpType=GetUser&DeptId=' + deptid;
    var tree = $(selector).dropdown({ editable: true });
    tree && tree.reload({
        url: url,
        textfield: 'text',
        valuefield: 'id'
    });
};
var initTree = function (depttree, stafftree) {
    $(depttree).droptree({
        editable: true,
        url: 'src/js/area.json',
        callback: function (id) {
            if (stafftree) {
                var self = this;
                loadStaff(stafftree, id);
            }
        },
        onselect: function (id) {
            stafftree && loadStaff(stafftree, id);
        }
    });
};

