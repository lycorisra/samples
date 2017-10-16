;(function () {
    document.write('<link href="../../css/normalize.css" rel="stylesheet" />');
    document.write('<link href="../../css/main.css" rel="stylesheet" />');

    document.write('<script src="../../js/lib/jquery-1.8.3.min.js"></script>');
    document.write('<script src="../../js/lib/jquery.pager.js"></script>');
    document.write('<script src="../../js/lib/jquery-render-1.0.js"></script>');
    document.write('<script src="../../js/lib/layer-2.0/layer-min.js"></script>');

    document.write('<script src="../../js/base/utils.js"></script>');
    document.write('<script src="../../js/base/calendar.js"></script>');
    document.write('<script src="../../js/base/component.js"></script>');

})();

; (function (global) {
    var require = {},
        jsbase = '',
        cssbase = '';

    var onloaded = function (script, callback) {//绑定加载完的回调函数
        if (script.readyState) { //ie
            script.attachEvent('onreadystatechange', function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.className = 'loaded';
                    typeof callback === 'function' && callback();
                }
            });
        }
        else {
            script.addEventListener('load', function () {
                script.className = "loaded";
                typeof callback === 'function' && callback();
            }, false);
        }
    };

    require.use = function (url, callback) {
        var isJs = /\/.+\.js($|\?)/i.test(url) ? true : false;

        if (!isJs) { //加载css
            var links = document.getElementsByTagName('link');
            for (var i = 0, len = links.length; i < len; i++) {//是否已加载
                if (links[i].href.indexOf(url) > -1) {
                    return;
                }
            }
            var link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = jsbase + url;
            var head = document.getElementsByTagName('head')[0];
            head.insertBefore(link, head.getElementsByTagName('link')[0] || null);
        }
        else { //加载js
            var scripts = document.getElementsByTagName('script');
            for (var i = 0, len = scripts.length; i < len; i++) {//是否已加载
                if (scripts[i].src.indexOf(url) > -1 && typeof callback === 'function') {
                    //已创建script
                    if (scripts[i].className === 'loaded') {//已加载
                        callback();
                    }
                    else {//加载中
                        onloaded(scripts[i], callback);
                    }
                    return;
                }
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = jsbase + url;
            document.body.appendChild(script);
            onloaded(script, callback);
        }
    };
    require.initHead = function () {
        var headHtml = '',
            menuHtml = '';
        if (typeof(menus) == 'object') {
            for (var i = 0, menu; menu = menus[i]; i++) {
                menuHtml += '<li><span class="menu ' + menu.classname + '">' + menu.text + '</span></li>';
            }
        }
        headHtml = headHtml.concat(
            '<div class="menu-head">',
                '<ul>',
                    menuHtml == '' ? '' : menuHtml,
                    '<li>',
                        '<span class="menu feed">问题反馈</span>',
                        '<div class="menu-content">',
                            '<h5 class="innTit">联系人信息</h5>',
                        '</div>',
                    '</li>',
                '</ul>',
             '</div>'
        );
        document.write(headHtml);
    }
    require.initHead();
    this.require = require;
})(this);