webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var ENBeautifier = __webpack_require__(3);
	var beautifier;

	var $form = $('.eaform');
	var $columnContainer;
	var $leftColumn;
	var $rightColumn;

	//Main event
	$(document).ready(init);

	function init() {
	    sortTwoColumn();
	    $columnContainer = $(".en_wrapper");
	    $leftColumn = $("#left_wrapper1");
	    $rightColumn = $("#right_wrapper1");

	    $(".eaQuestionTextareaFormFieldContainer").prev(".eaQuestionLabel").addClass("fullwidth");
	    if ( $('.eaRightColumnContent').length != 0 )
	    {
	        var sub = $(".eaSubmitResetButtonGroup").detach();
	        $(".en_right_wrapper:last").append(sub);
	    }
	    
	    beautifier = new ENBeautifier({
	        form: $form
	    });
	    beautifier.usePlaceholders();

	    //handle image and caption
	    $('.hero').css('background-image', 'url('+$leftColumn.children("div:first").find("img").attr("src")+')');
	    $('.hero').append($leftColumn.children("div:first").find("p").addClass("heroCaption"));
	    //$leftColumn.children("div:first").remove();
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);