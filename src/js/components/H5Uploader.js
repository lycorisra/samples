; (function (window, $) {
    Array.prototype.exists = function (name,value) {
        for (var i = 0, item; item = this[i]; i++) {
            if (item[name] == value) {
                return true;
            }
        }
        return false;
    }
    var defaults = {
        fileInput: null,				    //html file控件
        dragDrop: null,					    //拖拽敏感区域
        btnUpload: null,					//提交按钮
        url: '',						    //ajax地址
        blob: false,                        //是否是大文件，默认为否，大文件上传需要分段读取和上传 

        onSelect: function () { },		    //文件选择后
        onDelete: function () { },		    //文件删除后
        onDrop: function () { },
        onProgress: function () { },		//文件上传进度
        onComplete: function () { },		//文件全部上传完毕时
    };
    var H5Uploader = function (options) {
        options = $.extend({}, defaults, options);

        this.uploadForm = options.uploadForm;
        this.fileInput = options.fileInput;
        this.displayer = options.displayer || $('.file-display'),
        this.dragDrop = options.dragDrop;
        this.btnUpload = options.btnUpload;
        this.url = options.url;
        this.params = options.params;           // 额外的参数，参数
        this.files = [];                        // 当前选择（或拖拽）的文件列表，FileList对象
        this.blob = options.blob;
        this.blobsize = 10 * 1024 * 1024;
        this.accept = options.accept,

        this.onSelect = options.onSelect;
        this.onDragOver = options.onDragOver;
        this.onDrop = options.onDrop;
        this.onProgress = options.onProgress;
        this.onComplete = options.onComplete;
        this.remind = options.remind;

        this._uploader = new Uploader(this);
        this._uploader.init();
    };

    function Uploader(instance) {
        this.uploader = instance;
    }
    Uploader.prototype = {
        init: function () {
            var self = this,
                uploader = this.uploader;

            if (uploader.dragDrop) {

                uploader.dragDrop.addEventListener('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }, false);

                uploader.dragDrop.addEventListener('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }, false);

                uploader.dragDrop.addEventListener('drop', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // 将选择的文件添加到files数组中【也可以使用数组的concat方法来合并两个数组】
                    var files = self.getFilterFiles(e.dataTransfer.files);
                    Array.prototype.push.apply(uploader.files, files);
                    self.onDrop(files);
                }, false);
            }
            //文件选择控件选择
            if (uploader.fileInput) {
                uploader.fileInput.addEventListener('change', function (e) {
                    // 将选择的文件添加到files数组中【也可以使用数组的concat方法来合并两个数组】
                    var files = self.getFilterFiles(e.target.files);
                    Array.prototype.push.apply(uploader.files, files);
                    uploader.onSelect(files);
                }, false);
            }
        },
        uploadByForm: function () {
            var self = this,
                url = self.uploader.url,
                formId = 'H5UploadForm',
                target = 'iframe_result',
                form = self.uploader.uploadForm,
                iframe = document.getElementById(target);

            if (!form) {
                form = document.getElementById(formId) || document.createElement('form');

                form.style.display = 'none';
                form.id = formId;
                form.action = url;
                form.method = 'POST';
                form.encoding = 'multipart/form-data';
                //form.enctype && (form.enctype = 'multipart/form-data');

                if (self.uploader.fileInput) {
                    var copy = self.uploader.fileInput.cloneNode(false);
                    copy.id = '';
                    form.appendChild(copy);

                    document.body.appendChild(form);
                }
            }
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.id = target;
                iframe.name = target;
                document.body.appendChild(iframe);
            }
            form.target = target;

            iframe.onload = function () {
                self.afterUpload(this);

                //document.body.removeChild();
            };
            form.submit();
        },
        uploadByAjax: function (data, callback) {
            var self = this;
            $.ajax({
                url: self.uploader.url,
                data: data,
                async: false,
                processData: false,
                contentType: false,
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    callback && callback(response);
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        afterUpload: function (iframe) {
            var content = iframe.contentWindow.document || iframe.contentDocument.document,
                responseText = content.body.innerHTML;

            this.uploader.onComplete(responseText);
            this.uploader.fileInput.value = '';
        },
        uploadFile: function (file, index) {
            var self = this,
                reader = new FileReader(),
                params = self.uploader.params,
                fileSize = file.size,
                start = 0,
                block = 2 * 1024 * 1024, // 每次读取1M大小
                loaded = 0;

            var tid,
                run = function () {
                    var data = new FormData();
                    data.append('name', file.name);
                    data.append('size', block);
                    data.append('content', file.slice(start, start + block));
                    for (var name in params) {
                        data.append(name, params[name]);
                    }

                    self.uploadByAjax(data, function (response) {
                        var result = response.result;
                        if (!result) {
                            self.reset();
                            self.uploader.remind && self.uploader.remind(response.msg);
                            clearTimeout(tid);
                            return false;
                        }
                        start += block;
                        loaded += response.count;
                        var percent = loaded / fileSize;
                        self.uploader.onProgress && self.uploader.onProgress(percent, index);

                        if (loaded < fileSize) {
                            tid = setTimeout(run, 0);
                        }
                        else {
                            params.filename = file.name;
                            self.uploader.onComplete && self.uploader.onComplete(params, index);
                            clearTimeout(tid);
                        }
                    });
                };
            run();
        },
        getFilterFiles: function (files) {
            var self = this,
                name = '',
                ext = '',
                array = [];
            for (var i = 0, file; file = files[i]; i++) {
                name = file.name;
                ext = name.substr(name.lastIndexOf('.')).toLowerCase(),
                accept=self.uploader.accept;
                
                if (accept instanceof Array && accept.indexOf(ext) == -1)
                    continue;
                if (self.uploader.files.exists('name', name))
                    continue;
                
                array.push(file);
            }
            return array;
        },
        reset: function () {
            this.uploader.fileInput.value = '';
            this.uploader.displayer.val('');
        }
    }

    var fn = {
        upload: function () {
            var self = this,
                uploader = this._uploader;

            for (var i = 0, file; file = self.files[i]; i++) {
                uploader.uploadFile(file, i);
            }
            self.files = []; // 上传完后，清除文件列表
        }
    };
    H5Uploader.prototype = fn;

    window.H5Uploader = H5Uploader;



})(window, jQuery);


$(function () {
    var page = {
        init: function () {
            this.initUploader();
            $('#channel').dropdown().reload({
                url: '../../AjaxHandler/CommonHandler.ashx?OpType=GetSupplierListInfo',
                textfield: 'Name',
                valuefield: 'ID'
            });
            $('a.redirect').click(function (e) {
                e.preventDefault();
                var href = 'url' + $(this).attr('href');
                CMP.FM.open("文件管理", href);
            })
        },
        initUploader: function () {
            var self = this;
            var addFiles = function (files) {
                var html = '',
                    names = [],
                    templateHtml = document.getElementById('template').innerHTML || '';

                for (var i = 0, file; file = files[i]; i++) {
                    var data = {
                        name: file.name,
                        size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + 'M' : (file.size / 1024).toFixed(1) + 'KB',
                        status: '等待上传',
                        operate: '删除'
                    };
                    html += templateHtml.render(data);
                    names.push(file.name);
                }
                $('.list-view ul').append(html);
                $('.file-display').val($('.file-display').val() + names.join(','));
            };

            var uploader = new H5Uploader({
                fileInput: document.getElementById('fileinput'),
                btnUpload: document.getElementById('btnupload'),
                dragDrop: filecontainer,
                url: '../../AjaxHandler/ImportHander.ashx?OpType=upload',
                blob: true,
                accept: ['.xls', '.xlsx', '.csv'],

                onDrop: function (files) {
                    addFiles(files);
                },
                onSelect: function (files) {
                    addFiles(files);
                },
                onComplete: function (data, index) {
                    var $ul = $('.list-view ul');

                    uploader.remind('正在导入文件【' + data.filename + '】...');
                    $ul.find('li').eq(index).find('.status').html('上传完成').css({ color: 'green' });
                    $.ajax({
                        url: '../../AjaxHandler/ImportHander.ashx?OpType=import',
                        data: data,
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            uploader.remind(data.msg);
                            //uploadform.reset();
                            layer.closeAll();
                        },
                        error: function (e) {
                            uploader.remind(e.error);
                            uploader.uploader.reset();
                            layer.closeAll();
                        }
                    });
                },
                onProgress: function (percent, index) {
                    percent = (percent * 100).toFixed(2) + '%';
                    $('.list-view .progress').eq(index).width(percent);
                },
                remind: function (msg) {
                    var $ul = $('.list-view ul'),
                        html = '<li>' + msg + '</li>';
                    $ul.append(html);
                }
            });

            $('.file-list').delegate(' .del', 'click', function (e) {
                var $li = $(this).parents('li'),
                    fileinput = document.getElementById('fileinput'),
                    filename = $li.find('.title').html();

                var self = this,
                    files = uploader.files,
                    item = files.find('name', filename);

                var index = files.indexOf(item);
                files.splice(index, 1);
                $li.remove();
                fileinput.value = '';
                var names = [];
                for (var i = 0, file; file = files[i]; i++) {
                    names.push(file.name);
                }
                $('.file-display').val(names.join(','));
            });

            $('#uploadform').html5Validate(function (e) {
                
                self.Import(uploader);
                //uploader.files = [];
            })
        },
        Import: function (uploader) {
            if (uploader.files.length == 0) {
                layer.msg('请选择要导入的文件！', { icon: 2, time: 2000 });
                return false;
            }
            var params = form.get('#uploadform');
            var index = layer.load(0, { shade: 0.6 }); //0代表加载的风格，支持0-2
            $.ajax({
                url: '../../AjaxHandler/ImportHander.ashx?OpType=before-upload',
                data: params,
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (!data.result) {
                        uploader.remind(data.msg);
                        uploader.uploader.reset();
                        return false;
                    }
                    params.PeriodId = data.periodid;
                    uploader.params = params;
                    uploader.upload();
                }
            });
        }
    };
    page.init();
});