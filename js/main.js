//Beautifier configuration
var leftColumnSelector = '.js-left-column';
var formSelector = '.form';
var formFieldContainerClass = 'js-form-field-container';
var formFieldContainerIgnoreClass = 'is-selfHandling';
var formFieldWrapperClass = 'js-form-field-wrapper';

//Key:Value :: Target:Content
var ENBeautifierFillers = {
	".js-hero": ".js-heroContent",
	".js-campaign": ".js-campaignText",
	".js-highlights": ".js-highlightsText",
	".js-hero-image": ".js-heroImage",
	".js-financial": ".js-financialText",
	".js-supporters": ".js-supportersText"
}

var ENBeautifier = require('./modules/ENBeautifier');
var enbeautifier;

// slick carousel slider
var slick = require('slick');

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

var $ = require('jquery');
require("modernizr");

if(__DEV__){
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
		// $('.supporters-carousel').slick();

	} catch(error) {
		raygunSendError(error);
	}
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
		require('raygun');
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
		require('jqueryvalidate');

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
