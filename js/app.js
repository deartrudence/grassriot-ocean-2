webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//Beautifier configuration
	var leftColumnSelector = '.js-left-column';
	var formSelector = '.form';
	var formFieldContainerClass = 'js-form-field-container';
	var formFieldContainerIgnoreClass = 'is-selfHandling';
	var formFieldWrapperClass = 'js-form-field-wrapper';

	var ENcrementData = __webpack_require__(6); 
	var encrementdata; 

	var ENBeautifier = __webpack_require__(8);
	var enbeautifier;

	var Stringer = __webpack_require__(7);
	var stringer;

	var $ = __webpack_require__(1);
	__webpack_require__(5);


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

		//stringer
		stringer = new Stringer({
			clientId: '1770'
		})
		stringer.getStat({
			datapoint: 'participations',
			campaignId: $('input[name="ea.campaign.id"]').val(),
			callback: addStringerStat
		});
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
			__webpack_require__(4);		
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
			console.log(error);
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
			__webpack_require__(3);

			$.validator.addMethod("emailTLD", function (value, element) {
	      return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	      }, "Invalid email address");

			var validation_rules = {
				"Email": {
					emailTLD: true
				}
			}

			var settings = {
		    ignore: [],
		    rules: validation_rules,
		    invalidHandler: function(e, validator) {
	        try {
	          throw new Error("Validation Failure");
	        }
	        catch (error) {
	          raygunSendError(error, {
	          	data: {
	          		errors: validator.invalid
	          	},
	          	forms: [formSelector]
	          });
	        }
		    },
		    submitHandler: function (form) {
	        $(form).attr('action', formAction+"?s="+analyticsGetSection(leftColumnSelector));
	        form.submit();
	      }
			};

	    $form = $(formSelector);
	    $form.validate(settings);

	    $form.find("input").each( function(){
	    	$(this).rules("add","required");
	    });
		}
		catch(error){
			raygunSendError(error);
		}
	}

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * ENcrementData module
	 * requires jQuery, Stringer
	 */
	var requiredOptions = [
	    'clientId',
	    'campaignId',
	    'formId',
	    'formFields',
	    'fieldContainer',
	    'form'
	];

	var enURL = 'https://e-activist.com/ea-action/action';
	var fieldObtained = false;

	var Stringer = __webpack_require__(7);
	var stringer;

	/**
	 * ENcrementData constructor
	 * @param Object options with the following properties:
	 *        string clientId - unique EN client id
	 *        string campaignId - unique EN campaign id to pull user data
	 *        array formField - collection of form field names desired in the order of preference - Email should always be included and be the first in the array
	 *        jQuery form - a jQuery object of the form where the fields will be added 
	 */
	function ENcrementData(options) {
	    if(this.hasRequiredOptions(options)) {
	        this.clientId = options.clientId;
	        this.resultCampaignId = options.campaignId;
	        this.resultFormId = options.formId;
	        this.desiredFormFields = options.formFields;
	        this.emailFieldName = (options.emailField ? options.emailField : this.desiredFormFields[0]);
	        this.formFieldContainer = (options.fieldContainer ? options.fieldContainer : 'js-form-field-container');
	        this.formFieldIgnoreContainer = (options.ignoreContainer ? options.ignoreContainer : 'is-selfHandling');
	        this.targetForm = options.form;

	        this.init();
	    }
	    else
	        throw new Error("[ENcrementData] Missing required options: " + this.missingOptions.join(', '));
	}

	ENcrementData.prototype.init = function() {
	    var fields = $(this.targetForm).find(this.formFieldContainer);

	    for(var i = 0; i < fields.length; i++) {
	        if(
	            !$(fields[i]).find('.eaMandatoryFieldMarker').length
	            && !(
	                typeof this.formFieldIgnoreContainer !== 'undefined'
	                && $(fields[i]).hasClass(this.formFieldIgnoreContainer)
	                )
	        ) {
	            this.dectivateField($(fields[i]).find('input, select, textarea').attr('name'));
	        } else {
	            $(this).trigger("left.active.ENcrement");
	        }
	    }
	    stringer = new Stringer({
	            clientId: this.clientId
	        })
	}

	/**
	 * ENcrementData hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	ENcrementData.prototype.hasRequiredOptions = function(options) {
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

	/*ENcrementData.prototype.getUserData = function(email) {
	    if(email == '' || fieldObtained) return;
	    
	    data[this.emailFieldName] = email;

	    $.ajax({
	        type: "GET",
	        url: enURL,
	        data: data,
	        dataType: 'jsonp',
	        cache: false,
	        context: this,
	        crossDomain: true,
	        error: function( xhr, status, errorThrown ) {
	            
	        },
	        success: function( data, status, xhr) {
	            var $userDataForm = $($.parseHTML(data.pages[0].form.fields[0].value));
	            var fieldname = this.getNextField($userDataForm.serializeArray());
	            if(fieldname) 
	                this.activateField(fieldname);
	            fieldObtained = true;
	        }
	    })
	}*/

	/**
	 * ENcrementData showNextField Checks field value status for supporter record in EN
	 * @param {string} email value of the email input field
	 *
	 * @return void
	 */
	ENcrementData.prototype.showNextField = function(email) {
	    if(email == '' || fieldObtained) return;

	    stringer.getUserData({
	        email: email,
	        context: this,
	        callback: parseFieldStatus
	    });

	    
	}

	/**
	 * ENcrementData private parseFieldStatus
	 * @param {Object} response from Stringer API call
	 *
	 * @return void
	 */
	function parseFieldStatus(response) {
	    fieldObtained = true;
	    if(response.status == "success") {
	        for(i = 0; i < this.desiredFormFields.length; i++) {
	            if(!$(this.targetForm).find('[name="' + this.desiredFormFields[i] + '"]').not('[disabled="disabled"]').length && response.data[this.desiredFormFields[i]] == 'N') {
	                //console.log(this.desiredFormFields[i]);
	                this.activateField(this.desiredFormFields[i]);
	                return;
	            }
	        }
	    }
	}

	ENcrementData.prototype.activateField = function(fieldname) {
	    $(this.targetForm).find('[name="' + fieldname + '"]')
	        .removeAttr('disabled')
	        .trigger("made.active.ENcrement")
	        .closest(this.formFieldContainer).show(200);
	}

	ENcrementData.prototype.dectivateField = function(fieldname) {
	    $(this.targetForm).find('[name="' + fieldname + '"]')
	        .attr('disabled', 'disabled')
	        .trigger("made.inactive.ENcrement")
	        .closest(this.formFieldContainer).hide();
	}
	 
	module.exports = ENcrementData;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Stringer module
	 * requires jQuery
	 */
	var requiredOptions = [
	    'clientId'
	];

	var stringerBaseURL = "http://stringer.grassriots.com/api/v1";

	/**
	 * Stringer constructor
	 * @param Object options with the following properties:
	 *        string clientId - unique EN client id
	 */
	function Stringer(options) {
	    if(this.hasRequiredOptions(options)) {
	        this.clientId = options.clientId;

	        //this.init();
	    }
	    else
	        throw new Error("[Stringer] Missing required options: " + this.missingOptions.join(', '));
	}

	/**
	 * Stringer hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	Stringer.prototype.hasRequiredOptions = function(options) {
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


	/**
	 * Stringer getStat Pulls a statistics from the Stringer service
	 * @param Object options with the following properties:
	 *        string datapoint - the name of the statistic to pull
	 *        string campaignId - unique EN client id
	 *        function callback - to be executed once the datapoint is obtained
	 */
	Stringer.prototype.getStat = function(options) {
	    if(typeof options.datapoint == "undefined" || typeof options.callback == "undefined")
	        throw new Error("[Stringer.getStat] A datapoint and callback are required");

	    var requestURL = stringerBaseURL + '/stats/client/' + encodeURIComponent(this.clientId) + (options.campaignId ? '/campaign/' + encodeURIComponent(options.campaignId) : '') + '/datapoint/' + encodeURIComponent(options.datapoint)

	    callAPI(requestURL, options.callback);
	}

	/**
	 * Stringer getUserData Pulls a collection of user fields with their status from the Stringer service
	 * @param Object options with the following properties:
	 *        string email - email of the user
	 *        Object context - assign 'this'
	 *        function callback - to be executed once the user data is obtained
	 */
	Stringer.prototype.getUserData = function(options) {
	    if(typeof options.email == "undefined" || typeof options.callback == "undefined")
	        throw new Error("[Stringer.getUserData] An email and callback are required");

	    var requestURL = stringerBaseURL + '/encrementer/client/' + encodeURIComponent(this.clientId) + '/email/' + encodeURIComponent(options.email)

	    callAPI(requestURL, options.callback, options.context);

	}

	/**
	 * private callAPI sends a JSONP AJAX request to to the Stringer serverfrom the Stringer service
	 * @param string url - RESTful API URL
	 * @param function callback - to be executed once the user data is obtained
	 */
	function callAPI(url, callback, context) {
	    $.ajax({ 
	        type: "GET",
	        url: url,
	        dataType: 'jsonp',
	        cache: false,
	        context: (context ? context : this),
	        crossDomain: true,
	        error: function(/* xhr, status, errorThrown */) {
	            
	        },
	        success: callback
	    })
	}


	module.exports = Stringer;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
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
	 */
	function ENBeautifier(options) {
	    if(this.hasRequiredOptions(options)) {
	        this.targetForm = options.form;
	        this.fieldWrapperClass = (options.fieldWrapperClass ? options.fieldWrapperClass : 'js-form-field-wrapper');
	        this.fieldContainerClass = (options.fieldContainerClass ? options.fieldContainerClass : 'js-form-field-container');
	        this.willBuildColumns = (typeof options.willBuildColumns != 'undefined' ? options.willBuildColumns : false);

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
	    //this.tagFieldContainers();
	    //this.makeColumns();
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

	ENBeautifier.prototype.buildColumns = function(options) {
	    var target, source;
	    if(typeof options.leftColumn != "undefined") {
	        target = options.leftColumn;
	        source = '.eaLeftColumnContent';
	    }
	    else if(typeof options.rightColumn != "undefined") {
	        target = options.rightColumn;
	        source = '.eaRightColumnContent';
	    }
	    $(source).appendTo(target);
	    $('.eaLeftColumnFiller, .eaRightColumnFiller').remove();
	    $('.eaLeftColumnContent, .eaRightColumnContent').removeClass('hide');
	}

	ENBeautifier.prototype.usePlaceholders = function() {
	    var fieldContainers = $(this.targetForm).find('.'+this.fieldContainerClass);
	    if(!fieldContainers.length) {
	        this.tagFieldContainers();
	        fieldContainers = $(this.targetForm).find('.'+this.fieldContainerClass);
	    }

	    $(fieldContainers).each(function() {
	        var label = $(this).find('label');
	        $(this).find('input, textarea').attr('placeholder', label.text());
	        label.closest('.eaFormElementLabel').hide();
	    });

	}


	module.exports = ENBeautifier;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);