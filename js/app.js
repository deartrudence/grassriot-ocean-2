webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {//Beautifier configuration
	var leftColumnSelector = '.js-left-column';
	var formSelector = '.form';
	var formFieldContainerClass = 'js-form-field-container';
	var formFieldContainerIgnoreClass = 'is-selfHandling';
	var formFieldWrapperClass = 'js-form-field-wrapper';
	var footer = $('footer');
	var header = $('header');

	//Key:Value :: Target:Content
	var ENBeautifierFillers = {
		".js-hero": ".js-heroContent",
		".js-campaign": ".js-campaignText",
		".js-highlights": ".js-highlightsText",
		".js-hero-image": ".js-heroImage",
		".js-financial": ".js-financialText",
		".js-supporters": ".js-supportersText"
	}

	var ENBeautifier = __webpack_require__(3);
	var enbeautifier;

	// slick carousel slider
	var slick = __webpack_require__(4);

	//hero configuration
	var hero = ".hero-image";
	var heroImage = ".js-hero-image img";
	var heroText = ".js-hero-text";
	var heroImageRatio = false;

	//mobile form button
	var form = ".form";
	var formOpenButton = ".js-formOpen";
	var formOpenButtonLabel = ".js-formOpen-label";
	var windowSize;

	var $ = __webpack_require__(1);
	__webpack_require__(5);

	if(true){
		init_devtools();
	}

	//Main event
	$(document).ready(function() {
		try {
			init();
			init_validation();
		}
		catch(error) {
			raygunSendError(error);
		}


	});

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	function init() {
		//determine if we're on a thank you page
		if($('input[name="ea.submitted.page"]').length && $('input[name="ea.submitted.page"]').val() === "2"){
			ty = true;
			setupTY();
		}

		//do everything else
		setupAction();
		modernize();
		raygunCheckErrorContainer("#eaerrors", [formSelector]);
	}

	/**
	 * [modernize description]
	 * @return {[type]} [description]
	 */
	function modernize(){
		if(!window.Modernizr.input.placeholder){
			$("html").addClass("no-placeholder");
		}
	}

	/**
	 * [setupAction description]
	 * @return {[type]} [description]
	 */
	function setupAction(){
		try{
			//form beauitfication
			enbeautifier = new ENBeautifier({
				form: $(formSelector),
				fieldWrapperClass: formFieldWrapperClass,
				fieldContainerClass: formFieldContainerClass
			});
			enbeautifier.tagFieldContainers();
			enbeautifier.usePlaceholders();
			enbeautifier.buildColumns({
				leftColumn:  leftColumnSelector
			});

			//move text to the right places
			enbeautifier.moveToTargets(ENBeautifierFillers);



			// slick
			$('.supporters-carousel').slick({
				dots: true,
				arrows: true,
				appendArrows: '.slick-list',
				prevArrow: '<button type="button" class="slick-prev"></button>',
				nextArrow: '<button type="button" class="slick-next"></button>'
			});

			// we handle the mobile form (<620px) without use of affix
			if (header.width() > 620) {
				$('.form').affix({
		      offset: {
		        top: header.outerHeight(),
						bottom: footer.outerHeight()
		      }
				});
			}

			//things to do just on load
			setupMobileButton();


		} catch(error) {
			raygunSendError(error);
		}
	}

	/**
	 * [setupMobileButton description]
	 * @return {[type]} [description]
	 */
	function setupMobileButton(){
		var actionButton = $(formSelector).find(".button");
		var mobileButton = $(formOpenButton);

		//Set the open button to use the same copy as the action button
		mobileButton.find(formOpenButtonLabel).text(actionButton.text());
		mobileButton
			.on("click",function(){
				$(formSelector).toggleClass("is-active");
			})
			.on("mousedown touchstart", handleDrag);

		$(".formClose").on("click",function(){
			$(this).parent().removeClass("is-active");
		});
	}

	/**
	 * [handleDrag description]
	 * Based on https://gist.github.com/Arty2/11199162
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	function handleDrag(e){
		var $this = $(this);
		var $pane = $this.parent();

		var $window = $(window);
		var windowHeight = $window.outerHeight();
		var scrollTop = $window.scrollTop();

		var topMove = 0;

		$(window)
			.on("mousemove.draggable touchmove.draggable", function(e){

				$pane.addClass("is-dragging");

				if( e.originalEvent.touches ){
					var touch = e.originalEvent.touches[0];
				}

				var posY = e.pageY || touch.pageY;
				topMove = (posY - scrollTop) - windowHeight;

				$(".form").css("top", windowHeight + topMove);

				e.preventDefault();
			})
			.one("mouseup touchend touchcancel",function(){
				$(window).off("mousemove touchmove");

				$pane.removeClass("is-dragging");

				//if the user has dragged the panel more than halfway, open it
				$(".form")
						.removeAttr("style");

				if( Math.abs(topMove / windowHeight ) > 0.25 ){
					$(".form")
						.addClass("is-active");
				}
			});

		e.preventDefault();
	}


	/**
	 * [init_devtools description]
	 * @return {[type]} [description]
	 */
	function init_devtools(){
	}

	/**
	 * [addStringerStat description]
	 * @param {[type]} response [description]
	 */
	function addStringerStat(response){
		if(response.status == "success") {
			try {
				var actions = parseInt(response.data);
				var useText;
				$(counterSelector).text(actions.toLocaleString());
				$(counterRangeSelector).find('div').each(function() {
					var limit = $(this).find(counterRangeLimitSelector).text();
					if(actions < parseInt(limit))
						return false;
					useText = $(this).find(counterRangeTextSelector).html();
				});
				$(counterTextSelector).html(useText);
			}
			catch(error) {
				raygunSendError(error, {
					data: {
						response: response,
						range: limit
					}
				});
			}
		}
	}

	//////////////////////////////
	// Everything else goes here
	//////////////////////////////

	// Tracking
	//---------------------------------------
	function analyticsReport( event, title ){
		try {
			//UA
			if( typeof ga !== 'undefined' ){

			    var data = {};
			    if( event ){
			      data[ 'page'] = '/virtual/'+event;
			    }
			    if( title ){
			      data[ 'title' ] = title;
			    }

			    ga( 'send', 'pageview', data );

			}

			//Traditional GA
			if( typeof _gaq !== 'undefined' ){
			    _gaq.push(['_trackPageview', '/virtual/'+event]);
			}

			//Tag Manager
			if( typeof _gaq !== 'undefined' ){

			}
		} catch (err) {
			raygunSendError(err);
		}
	}

	function analyticsGetSection(container) {
		var currentSection = null;
		$(container).children().each(function() {
			if($(window).scrollTop() > $(this).offset().top)
				currentSection = $(this).attr("data-section");
		});
		return currentSection;
	}

	// Error Reporting
	// ---------------------------------------
	function raygunSendError(error, options) {
		try {
			__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"raygun\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
			var data = { };
			if(!options instanceof Object || typeof options == 'undefined') {
				options = { };
			}

			//if forms are defined, pull in the form data for each listed form selector and store as an array of
			if(options.forms && options.forms.length) {
				var formDataCollection = { };
				for(var i = 0; i < options.forms.length; i++) {
					var $forms = $(options.forms[i]);
					formDataCollection[options.forms[i]] = $forms.map(function(index, form) {
						return [$(form).serializeArray().map(
							function(obj) {
								var returnObj = { };
								returnObj[obj.name] = obj.value;
								return returnObj;
							}
						)];
						return [];
					});
				}
				//console.log(formDataCollection);
				$.extend(true, data, {forms: formDataCollection});
			}

			if(options.data) {
				$.extend(true, data, options.data);
			}

			/*if(typeof Raygun !== 'undefined')
				Raygun.send(error, data);
			else {*/
				console.log(error);
				console.log(data);
			//}
		}
		catch(error) {
			if(typeof Raygun !== 'undefined')
				Raygun.send(error);
		}
	}

	function raygunCheckErrorContainer(selector, formSelectors) {
		try {
			if($(selector).length) {
				try { throw new Error("EA Processing Error");}
				catch(error) {
					analyticsReport('action-failure/'+$('input[name="ea.campaign.id"]').val());
					var data = {};
					data[selector] = $(selector).text();
					raygunSendError(error, {
						data: data,
						forms: formSelectors
					});
				}
			}
		}
		catch(error) {
			raygunSendError(error);
		}
	}

	function getURLParameter(name){
	    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}

	function init_validation(){
		try{
			__webpack_require__(6);

			// $.validator.addMethod("emailTLD", function (value, element) {
	  //     return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	  //     }, "Invalid email address");

			// var validation_rules = {
			// 	"Email": {
			// 		emailTLD: true
			// 	}
			// }

			// var settings = {
		 //    ignore: [],
		 //    rules: validation_rules,
		 //    invalidHandler: function(e, validator) {
	  //       try {
	  //         throw new Error("Validation Failure");
	  //       }
	  //       catch (error) {
	  //         raygunSendError(error, {
	  //         	data: {
	  //         		errors: validator.invalid
	  //         	},
	  //         	forms: [formSelector]
	  //         });
	  //       }
		 //    },
		 //    submitHandler: function (form) {
	  //       $(form).attr('action', formAction+"?s="+analyticsGetSection(leftColumnSelector));
	  //       form.submit();
	  //     }
			// };

	  //   $form = $(formSelector);
	  //   $form.validate(settings);

	  //   $form.find("input").each( function(){
	  //   	$(this).rules("add","required");
	  //   });
		}
		catch(error){
			raygunSendError(error);
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * ENBeautifier module
	 * requires jQuery, jQuery Placeholder
	 */
	var requiredOptions = [
	    'form'
	];

	var fieldObtained = false;

	/**
	 * ENBeautifier constructor
	 * @param Object options with the following properties:
	 *        string clientId - unique EN client id
	 *        string campaignId - unique EN campaign id to pull user data
	 *        array formField - collection of form field names desired in the order of preference - Email should always be included and be the first in the array
	 *        jQuery form - a jQuery object of the form where the fields will be added 
	 *
	 *        It can optionally include these additional properties:
	 *        string fieldWrapperClass - the class to be added to the wrapper div for each input (default: "js-form-field-wrapper")
	 *        string fieldContainerClass - the class to be added to the broader wrapper (including the label) (default: "js-form-field-container")
	 *        boolean willBuildColumns - whether to hide content with EN's left/right column classes (default: false)
	 *        string errorContainer - the selector for EN errors (default: #eaerrors)
	 *        string pageSelector - the selector for the input with the page number
	 *        string postactionIndicator - the variable name to check for explicit post-action selection
	 *        string postactionClass - the class name to add to the body if it's a post-action page
	 */
	function ENBeautifier(options) {
	    if(this.hasRequiredOptions(options)) {
	        this.targetForm = options.form;
	        this.fieldWrapperClass = (options.fieldWrapperClass ? options.fieldWrapperClass : 'js-form-field-wrapper');
	        this.fieldContainerClass = (options.fieldContainerClass ? options.fieldContainerClass : 'js-form-field-container');
	        this.willBuildColumns = (typeof options.willBuildColumns != 'undefined' ? options.willBuildColumns : false);
	        this.errorContainer = (options.errorContainer ? options.errorContainer : '#eaerrors');
	        this.pageSelector = (options.pageSelector ? options.pageSelector : 'input[name="ea.submitted.page"]');
	        this.postactionIndicator = (options.postactionIndicator ? options.postactionIndicator : 'isPostaction');
	        this.postactionClass = (options.postactionClass ? options.postactionClass : 'is-postAction')

	        //default values
	        this.reportedErrors = [];
	        this.currentPage = false;
	        this.isPostaction = false;

	        this.init();
	    }
	    else
	        throw new Error("[ENBeautifier] Missing required options: " + this.missingOptions.join(', '));
	}

	/**
	 * ENBeautifier hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	ENBeautifier.prototype.hasRequiredOptions = function(options) {
	    var missingOptions = [ ];
	    for(var i = 0; i < requiredOptions.length; i++) {
	        if(typeof options[requiredOptions[i]] === 'undefined') {
	            missingOptions.push(requiredOptions[i]);
	        }
	    }
	    if(missingOptions.length) {
	        this.missingOptions = missingOptions;
	        return false;
	    }
	    return true;
	}

	ENBeautifier.prototype.init = function() {
	    if(this.willBuildColumns) {
	        $('.eaLeftColumnContent, .eaRightColumnContent').addClass('hide');
	    }
	    this.checkErrors();
	}

	ENBeautifier.prototype.tagFieldContainers = function() {
	    var fields = $(this.targetForm).find('input, select, textarea').not('[type="hidden"], .eaSubmitButton');
	    fields
	        .closest('div').addClass(this.fieldWrapperClass)
	        .parent().closest('div').addClass(this.fieldContainerClass);

	    fields.each(function() {
	        var $this = $(this);
	        var fieldName = (typeof $this.attr('name') !== 'undefined') ? $this.attr('name') : 'unnamed';
	        $(this).addClass('js-' + fieldName.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
	    });
	}

	/**
	 * Puts everything in its right place
	 * @param  Object options An object - Names are selectors for the destination, values are selectors for the content. Values can be arrays of selectors
	 */
	ENBeautifier.prototype.moveToTargets = function(fillers, includeSource){
	    if(typeof includeSource == 'undefined') includeSource = false;
	    //move text to the right places
	    $.each(fillers, function(target,source){
	        //if we just have a simple selector, select it and let's get going
	        if(typeof source === "string" ){
	            $(target).append( (includeSource ? $(source) : $(source).contents()) );    
	        }
	        //but if we have an array of selectors, loop through that array
	        else if (Array.isArray(source)){
	            var $target = $(target);
	            for (var i = 0; i < source.length; i++){
	                $target.append( (includeSource ? $(source[i]) : $(source[i]).contents()) );
	            }
	        }

	        //Something else? ¯\_(ツ)_/¯        
	    });
	}

	/**
	 * Adds classes to a bulk collection
	 * @param  Object fieldCollection An object - selectors as the key and an object containing the target element and classes to add to it
	 */
	ENBeautifier.prototype.addClasses = function(elementCollection) {
	    var $form = this.targetForm;
	    $.each(elementCollection, function (selector, data) {
	        $form.find(selector).closest(data.targetElement).addClass(data.classes);
	    });
	}


	/**
	 * [buildColumns description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	ENBeautifier.prototype.buildColumns = function(options) {
	    // var target, source;
	    // if(typeof options.leftColumn != "undefined") {
	    //     target = options.leftColumn;
	    //     source = '.eaLeftColumnContent';
	    // }
	    // else if(typeof options.rightColumn != "undefined") {
	    //     target = options.rightColumn;
	    //     source = '.eaRightColumnContent';
	    // }
	    // $(source).appendTo(target);
	    // $('.eaLeftColumnFiller, .eaRightColumnFiller').remove();
	    // $('.eaLeftColumnContent, .eaRightColumnContent').removeClass('hide');
	     
	    var fillers = {};
	    if(typeof options.leftColumn !== "undefined"){
	        fillers[options.leftColumn] = ".eaLeftColumnContent";
	    }

	    if(typeof options.rightColumn !== "undefined"){
	        fillers[options.rightColumn] = ".eaRightColumnContent";
	    }

	    this.moveToTargets(fillers);    
	}

	/**
	 * Takes labels provided by Engaging Networks and sets them as the field's placeholder attribute instead
	 * @return {[type]} [description]
	 */
	ENBeautifier.prototype.usePlaceholders = function() {
	    var fieldContainers = $(this.targetForm).find('.'+this.fieldContainerClass);
	    if(!fieldContainers.length) {
	        this.tagFieldContainers();
	        fieldContainers = $(this.targetForm).find('.'+this.fieldContainerClass);
	    }

	    $(fieldContainers).each(function() {
	        var label = $(this).find('label');
	        var asterisk = /( )+\*/;
	        $(this)
	            .find('input, textarea')
	            .attr('placeholder', label.text().replace(asterisk,''));
	        if(
	            typeof window.Modernizr === 'undefined'
	            || window.Modernizr.input.placeholder
	            ){
	            label.closest('.eaFormElementLabel').hide();    
	        }
	    });
	}

	/**
	 * Finds errors reported by Engaging Networks and reports them 
	 * It 1) Emits an event on the form, 2) Stores the contents for later use
	 * @return {[type]} [description]
	 */
	ENBeautifier.prototype.checkErrors = function(){
	    var $errors = $(this.errorContainer);
	    if( $errors.length > 0){
	        var errors = $errors.map(function(){
	            return $(this).contents();
	        });

	        //Let the rest of the page know there's an error
	        $(this.targetForm).trigger("error.enbeautifier", errors);

	        //store it for later use
	        this.reportedErrors = this.reportedErrors.concat(errors);
	    }
	}

	/**
	 * An accessor function for recorded EN errors
	 * @param  {boolean} preserveErrors True by default; if false, it will empty the array after
	 * @return {array}                The reported errors
	 */
	ENBeautifier.prototype.getErrors = function(preserveErrors){
	    if(typeof preserveErrors !== "boolean"){
	        preserveErrors = true;
	    }

	    var errors = this.reportedErrors;

	    if(!preserveErrors){
	        this.reportedErrors = [];
	    }

	    return errors;
	}

	/**
	 * Gets and stores the page count and whether it's a post-action page
	 * If the current page is a post-action page, add the class to the page
	 */
	ENBeautifier.prototype.checkPage = function(){
	    //get the page number
	    var pageInput = $(this.pageSelector);
	    this.currentPage = pageInput.length ? parseInt(pageInput.val()) : 0;

	    //determine if we're on a post-action page
	    //if there's an explicit post-action indicator, then we've got an answer
	    if(typeof window[this.thankyouIndicator] === "boolean"){
	        this.isPostaction = window[this.thankyouIndicator];
	    }
	    //if not, then we should just assume that any page > 1 is a post-action
	    else if(this.currentPage > 1){
	        this.isPostaction = true;
	    }

	    //if it's the post-action, add the post-action class
	    if(this.isPostaction){
	        $("body").addClass(this.postactionClass);
	    }
	}

	module.exports = ENBeautifier;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);