webpackJsonp([1],{

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./GRAnalytics-pixel-facebook": 15,
		"./GRAnalytics-pixel-facebook.js": 15
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 14;


/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRAnalytics-pixel-facebook module.
	 * 
	 * specific implementation for facebook pixel (old method)
	 * 
	 */

	window.fb_param = {};
	path = '//connect.facebook.net/en_US/fp.js';

	function showPixel(id, transactionData) {
	    fb_param.pixel_id = id; 
	    if(transactionData instanceof Object) {
	        fb_param.value = transactionData.revenue; 
	        fb_param.currency = transactionData.currency;
	    }
	    $.getScript(path);
	}

	module.exports = {
	    showPixel: showPixel
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

});