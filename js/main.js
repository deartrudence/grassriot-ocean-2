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
	".js-supporters": ".js-supportersText",
  '#gr_donation': ['#Payment_CurrencyDiv', '#Recurring_PaymentDiv', '#Donation_AmountDiv'],
  '#gr_details': ['#Your_DetailsDiv', '#First_NameDiv', '#Last_NameDiv', '#EmailDiv', '#Address_1Div', '#CityDiv','#Postal_CodeDiv', '#CountryDiv', '#StateDiv', '#Opt_In_-_ENDiv'],
  '#gr_payment': ['#Payment_DetailsDiv', '#Payment_TypeDiv', '#CC_ImagesDiv', '#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationDiv', '.eaSubmitButton'],
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
var $form = $("form.eaform");
var $firstStepForm = $('#firstStepForm');
var formOpenButton = ".js-formOpen";
var formOpenButtonLabel = ".js-formOpen-label";
var windowSize;

//Upsell
var GRUpsell = require('./modules/GRUpsell');
var grupsell;
var upsellContentSelector = '#upsell-modal';
var $upsellTrackingField = $("#Other_1");

//Donation form
var GRSteps = require('./modules/GRSteps');
var formSteps;

var GRGivingSupport = require('./modules/GRGivingSupport');
var grGiving;

var $ = require('jquery');
require("modernizr");
require("modal");

var $submit = $(".eaSubmitButton");

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

    enbeautifier.addClasses({
        '[name="First Name"]': {classes: "inline-block-field half", targetElement: "div.eaFormField"},
        '[name="Last Name"]': { classes: "inline-block-field half last", targetElement: "div.eaFormField"},
        '[name="City"]': { classes: "inline-block-field half", targetElement: "div.eaFormField"},
        '[name="Postal Code"]': { classes: "inline-block-field half last", targetElement: "div.eaFormField"},
        '[name="Payment Type"]': { classes: "inline-block-field half", targetElement: "div.eaFormField"},
        '#paypal': { classes: "inline-block-field half last", targetElement: "div.eaFormField"},
        '[name="Credit Card Number"]': { classes: "inline-block-field three-quarter", targetElement: "div.eaFormField"},
        '[name="Credit Card Verification Value"]': { classes: "inline-block-field one-quarter last", targetElement: "div.eaFormField"},
        '[name="Credit Card Expiration1"]': { classes: "inline-block-field half", targetElement: ".eaSplitSelectfield"},
        '[name="Credit Card Expiration2"]': { classes: "inline-block-field half last", targetElement: ".eaSplitSelectfield"},
        '[name="Country"]': {classes: "inline-block-field half", targetElement: ".eaFormField"},
        '[name="Province"]': {classes: "inline-block-field half last", targetElement: ".eaFormField"},
        '.eaSubmitButton':{ classes: "btn btn-danger btn-lg", targetElement: ".eaSubmitButton"},
        'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect': {classes: 'form-control', targetElement: 'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect'}

    });

		//Set up panel steps
    formSteps = new GRSteps({
      activeClass: 'active',
      useCSSAnimation: false,
      indicatorTarget: '.steps-list ul',
      steps: $("#gr_donation,#gr_details,#gr_payment,#gr_sharing"),
      addButtons: true,
      target: "#window",
      stepHandler:[
        //step 1 handler
        function(){
          return $("#gr_donation").find("input,select,textarea").valid();
        },

        //step 2 handler
        function(){
          return $("#gr_details").find("input,select,textarea").valid();
        },

        //step 3 handler
        function(){
          //let the stepper handle any errors
          if( !$("#gr_payment").find("input,select,textarea").valid() ){
            return false;
          } 
          //If there are no errors, send the form
          else {
            $form.submit();
          }

        }
      ]
    });

    // Setup Campaign Page
    grGiving = new GRGivingSupport({
        form: $form,
        components: {
            country: {
                selector: '[name="Country"]:not(a)',
                urlParam: 'country',
                defaultVal: 'CA'
            },
            region: {
                selector: '[name="Province"]:not(a)'
            },
            currency: {
                selector: '[name="Payment Currency"]:not(a)',
                urlParam: 'curr',
                defaultVal: 'CAD'
            },
            recurrence: {
                selector: '[name="Recurring Payment"]:not(a)',
                defaultVal: ''
            },
            amount: {
                selector: '[name="Donation Amount"][type!="text"]:not(a)',
                urlParam: 'amt',
                defaultVal: '35'
            },
            other: {
                selector: '[name="Donation Amount"][type="text"]:not(a)'
            },
            processor: {
                selector: '[name="Payment Type"]:not(a)',
                urlParam: 'country',
                defaultVal: 'US'
            }
        },
        activeRegionLists: ['US', 'CA'],
        askStringSelector: '#donation-ranges',
        askStringContainerClass: 'levels',
        recurrenceOptions: [
            {label: 'Single', 'value': ''},
            {label: 'Monthly', 'value': 'Y'}
        ],
        processorFields: { 
            'PayPal': {
                hide: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationDiv']
            },
            'Visa': {
                show: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationDiv']
            },
            'MasterCard': {
                show: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationDiv']
            }

        }

    });

    grupsell = new GRUpsell({
        form: $form,
        recurringField: $('[name="Recurring Payment"]:not(a)'),
        donationAmountField: $('[name="Donation Amount"]:not(a)'),
        upsellContentSelector: upsellContentSelector,
        upsellMethod: 'function',
        maxGift: 500,
        calcFunction: function( amount ) {

            var amount = Math.floor(amount);
            var ret = amount;
            var mlt = 1.2;
            var min_week = 1;
        
            ret = Math.max(Math.round(Math.sqrt(amount/4.33)*mlt),min_week);        
            ret = Math.min(Math.round(ret*4.33),amount);        

            return ret;
        }
        /*range: [ //min is inclusive, max is not inclusive
            {min: 0, max: 20, amount: 6},
            {min: 20, max: 50, amount: 8},
            {min: 50, max: 80, amount: 10},
            {min: 80, max: 120, amount: 15},
            {min: 120, max: 200, amount: 25},
            {min: 200, max: 300, amount: 30}
        ]*/
    });

    $form.on('change', 'input[name="Donation Amount"], input[name="Recurring Payment"], [name="Payment Currency"]:not(a)', function(e) {
        $submit.val("Donate " + grGiving.getAmount(true) + (grGiving.isRecurring() ? ' Monthly' : ''));
    });

	// slick
	$('.supporters-carousel').slick({
		dots: true
	});

    $submit.attr("name", "submitter");
    $form.removeAttr('onsubmit');

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

//Donation handler
// var validation_rules = [{
        
//     }, {
//         "First Name": "required",
//         "Last Name": "required",
//         "Address 1": {
//             required: true
//         },
//         "City": "required",
//         "Province": "required",
//         "Country": "required",
//         "Email": {
//             required: true,
//             emailTLD: true
//         },
//         "Postal Code": {
//             required: true
//         }
//     }, {
//         "Payment Type": "required",
//         "Credit Card Number": {
//             required: true,
//             creditcard: true
//         },
//         "Credit Card Verification Value": {
//             required: true,
//             isCVV: true //note: AMEX CVVs are 4 digits but currently handled through PayPal
//         },
//         "Credit Card Expiration1": {
//             required: true,
//             isMonth: true
//         },
//         "Credit Card Expiration2": {
//             required: true,
//             isNowOrFutureYear: true,
//             isFuture: true
//         },
//         "Donation Amount": {
//             required: true,
//             isValidDonation: true
//         }
//     }
// ];

// var donation, country, payment;
// var currency, ref, sym, donation_type = 'single';

// var stepValidator = (function(){            
//     var settings = {
//         ignore: [],
//         rules: validation_rules[0],
//         unhighlight: function (element, errorClass, validClass) {
//             var $el = $(element);
//             if($el.attr("type")=="checkbox") return;
//             $el.parent().find('.glyphicon').remove();
//             $el.removeClass(validClass).removeClass(errorClass);

//             if ($el.val() != ''&& ($el.attr('id') !== 'setcurrency')) {
//                 $el.before($('<span class="glyphicon glyphicon-ok"></span>'));
//                 $el.addClass(validClass);
//             }
//         },
//         highlight: function (element, errorClass, validClass) {
//             var $el = $(element);
//             if($el.attr("type")=="checkbox") return;
//             $el.parent().find('.glyphicon').remove();
//             $el.before($('<span class="glyphicon glyphicon-remove"></span>'));
//             $el.removeClass(validClass).addClass(errorClass);
//         },
//         success: function (element, label) {
//             var $el = $(element);
//             $el.parent().find('.glyphicon').remove();
//             $el.before($('<span class="glyphicon glyphicon-ok"></span>'));
//         },
//         groups: {
//             demoGroup: "First Name",
//             ccExpiryDate: "Credit Card Expiration 1 "
//         },
//         invalidHandler: function(e, validator) {
//             var errors = validator.errorList,
//                 $errorList = $('<ul>');

//             // Used for customization of input names in error message.
//             var inputNamesMapper = {
//                 'Postal Code': 'Postal Code',
//                 'City': 'City / Town',
//                 'Address 1': 'Address 1',
//                 'Payment Type': 'Payment Option',
//                 'Province': 'State / Province / Region',
//                 'Credit Card Expiration1': 'Credit Card Expiration MM',
//                 'Credit Card Expiration2': 'Credit Card Expiration YYYY',
//                 'Credit Card Verification Value': 'CVV2 Code'
//             };

//             for (var i in errors) {
//                 var inputName = $(errors[i].element)
//                         .attr('id')
//                         .replace(/_/g, ' '),
//                     errorType = errors[i].method,
//                     errorMessage = '';

//                 inputName = inputNamesMapper[inputName] || inputName;

//                 // Checking and replacing standart error message.
//                 if (errorType === 'required'
//                     && errors[i].message === 'This field is required.') {
//                     errorMessage = inputName + ' is required.';
//                 } else {
//                     errorMessage = errors[i].message;
//                 }

//                 var $error = $('<li>')
//                     .html(errorMessage);

//                 $errorList
//                     .append($error)
//             }

//             $validErrModal
//                 .find('.error-list')
//                 .html($errorList);

//             $validErrModal
//                 .modal('show');

//             //console.log(validator);
//             try {
//                 throw new Error("failed validation");
//             }
//             catch (err) {
//                 var fieldData = $(this).serializeArray();
//                 for(var i = 0; i < fieldData.length; i++ ) {
//                     if(fieldData[i].name == "Credit Card Number")
//                         fieldData.splice(i, 1);
//                 }
//                 Raygun.send(err, {errors: validator.invalid, values: fieldData});
//             }
//         },
//         showErrors: function (errorMap, errorList) {
//             if (this.numberOfInvalids() > 0) {
//                 $("#donor_errors").html("<div class='alert alert-danger'><i class='glyphicon glyphicon-exclamation-sign'></i> Please correct the <b>" + this.numberOfInvalids() + "</b> errors indicated below.</div>").show(300);

//                 if (typeof errorMap['Donation Amount'] !== 'undefined') {
//                     $("#donor_errors").append("<div class='alert alert-warning' role='alert'><i class='glyphicon glyphicon-info-sign'></i><a class='btn-prev' href='#'>" + errorMap['Donation Amount'] + "</a></div>");
//                 }

//             } else {
//                 $("#donor_errors").hide(300);
//             }
//             this.defaultShowErrors();
//         },
//         errorPlacement: function () {
//             return false; // <- kill default error labels
//         },
//         submitHandler: function (form) {
//             $('[name="Credit Card Number"]').val($('[name="Credit Card Number"]').val().replace(/[\-\s]/g,''));
//             processForm();
//             if(grupsell.launch())
//                 return false;
//             else
//                 sendDonation(form);
//         }
//     };

//     $form.validate(settings);

//     settings.rules = {};
//     settings.ignore = ['#setcurrency'];
//     // $firstStepForm.validate(settings);

//     $form
//         .on("change", "input,select", function (e) {
//             $(e.target).valid();
//         })
//         .on("change", "#Credit_Card_Expiration1", function ( ) {
//             var ccExpiryYear = $("#Credit_Card_Expiration2");
//             if (ccExpiryYear.val()) {
//                 $("#Credit_Card_Expiration2").valid();
//             }

//         })
//         .on("keypress", function(e) { //disables Enter key for form
//             if (e.which == 13) {
//                 e.preventDefault();
//                 return false;
//             }
//         })
//         .on("grupsell.upsold", function(e, initialAmount, upsellAmount) {
//             $upsellTrackingField.val('YES: '+initialAmount.toString());
//             donation_type = 'monthly';
//             grAnalytics.analyticsReport( 'payment/upsell' );
//         });
//     $firstStepForm.on("keypress", function(e) { //disables Enter key for form
//         if (e.which == 13) {
//             e.preventDefault();
//             return false;
//         }
//     });

//     function addRules(newRules) {
//         for (var i in newRules) {
//             var $elem = $('[name="' + i + '"]').not("a");
//             $elem.rules('add', newRules[i]);
//         }
//     }
//     function removeRules(existingRules) {
//         for (var i in existingRules) {
//             var $elem = $('[name="' + i + '"]').not("a");
//             $elem.rules('remove');
//         }
//     }

//     return {
//         addRules: addRules,
//         removeRules: removeRules
//     };
// })();      

/**
 * [sendDonation description]
 * @param  {[type]} form [description]
 * @return {[type]}      [description]
 */
function sendDonation(form) {
  
    grAnalytics.analyticsReport( 'payment/donate-'+grGiving.getProcessor().toLowerCase() );
    if (payment == "PayPal") {
        $paypalForm = $('.js-paypal-'+donation_type+'-form');
        for(var i=0; i < paypal_field_map.length; i++) {
            $paypalForm.find('[name="'+paypal_field_map[i]['pp-'+donation_type]+'"]').val($(form).find('[name="'+paypal_field_map[i].en+'"]').not('a').val());
        }
        $paypalForm.submit();
    }
    else
        form.submit();
    return false;
}


function processForm() {
    $('.eaSubmitButton').prop('disabled', true);
    $('.eaSubmitButton').val("Processing...");
}

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

// Initiating of custom validation methods.
(function(){
    var errorMessages = {
            invalidMonth: 'Invalid month',
            invalidCVV: 'Invalid verification number',
            invalidAmount: 'Invalid donation amount',
            invalidDate: 'Date is invalid',
            invalidEmail: 'Please enter a valid email address.'
        },
        nowDate = new Date();

    $.validator.addMethod('isValidDonation', function (value, element) {
        // Converts to string for processing.
        value += '';

        // Only numbers or digits. 
        // Allows use currency symbol in the start of line or in the end.
        var regExp = /^\s?([$£€]?\s{0,1}(\d+[\d\s]+\.?\d+|\d+)|(\d+[\d\s]+\.?\d+|\d+)\s{0,1}[$£€]?)\s?$/g;

        if (!regExp.test(value)) {
            return false;
        }

        // Removes all wrong symbols.
        value = parseFloat(
            value.replace(/[$£€\s]/g, '')
        );

        // var min = + $ranges.find('ul.'+currency).find('li').first().html();;
        var min = 5,
            max = 10000;

        return (value >= min && value <= max);
    }, errorMessages.invalidAmount);

    $.validator.addMethod("emailTLD", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }, errorMessages.invalidEmail);
    
    $.validator.addMethod('isMonth', function (value, element) {
        return value.length == 2
            && parseInt(value) > 0
            && parseInt(value) <= 12;
    }, errorMessages.invalidMonth);

    $.validator.addMethod('isNowOrFutureYear', function (value, element) {
        return value.length >= 4
            && parseInt(value) >= nowDate.getFullYear();
    }, errorMessages.invalidDate);

    $.validator.addMethod('isFuture', function (value, element) {
        //Reject if the month and year together are in the past
        var month = $(element)
            .closest("form")
            .find("#Credit_Card_Expiration1")
            .val();

        if (parseInt(value) == nowDate.getFullYear()
            && parseInt(month) < nowDate.getMonth() + 1) {
            return false;
        }

        //Looks like the future
        return true;
    }, errorMessages.invalidDate);

    $.validator.addMethod('isCVV', function (value, element) {
        var regexCVV = /^\d{3}$/;
        return regexCVV.test(value);
    }, errorMessages.invalidCVV);
})();

//Get the active section for analytics reporting
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
		// require('raygun');
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

        var validation_rules = {
            "First Name": "required",
            "Last Name": "required",
            "Address 1": {
                required: true
            },
            "City": "required",
            "Province": "required",
            "Country": "required",
            "Email": {
                required: true,
                emailTLD: true
            },
            "Postal Code": {
                required: true
            },
            "Payment Type": "required",
            "Credit Card Number": {
                required: true,
                creditcard: true
            },
            "Credit Card Verification Value": {
                required: true,
                isCVV: true //note: AMEX CVVs are 4 digits but currently handled through PayPal
            },
            "Credit Card Expiration1": {
                required: true,
                isMonth: true
            },
            "Credit Card Expiration2": {
                required: true,
                isNowOrFutureYear: true,
                isFuture: true
            },
            "Donation Amount": {
                required: true,
                // isValidDonation: true
            }
        };
        $form.validate({
            rules: validation_rules
        });

	}
	catch(error){
		raygunSendError(error);
	}
}
