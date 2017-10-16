
(function () {
	'use strict';

	function handleExternalScript() {
		var container = Docsify.dom.getNode('#main');
		var scripts = Docsify.dom.findAll(container, 'script');

		for (var i = scripts.length; i--;) {
			var script = scripts[i];

			if (script && script.src) {
				var newScript = document.createElement('script');

				Array.prototype.slice.call(script.attributes).forEach(function (attribute) {
					newScript[attribute.name] = attribute.value;
				});

				script.parentNode.insertBefore(newScript, script);
				script.parentNode.removeChild(script);
			}
		}
	}

	var install = function (hook) {
		hook.doneEach(handleExternalScript);
	};

	window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());

function insertScript(scriptSource) {
	var head = document.getElementsByTagName('head')[0],
		scripts = document.getElementsByTagName('script');

	scripts = Array.prototype.slice.call(scripts);

	if (scripts.length === 0) return;

	var array = [];
	scripts.forEach(function (item, index) {
		array.push(item.src)
	});

	for (var i = 0, src; src = scriptSource[i]; i++) {
		if (array.indexOf(src) > -1) {
			continue;
		}

		var script = document.createElement('script');
		head.appendChild(script);
		script.type = "text/javascript";
		script.src = src;
		// document.body.appendChild(script);
	}
}