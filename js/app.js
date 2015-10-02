webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {//Beautifier configuration
	var leftColumnSelector = '.js-left-column';
	var formSelector = '.form';
	var ENFormSelector = '.eaform';
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
	  ".js-supporters": ".js-supportersText",
	  ".js-formOpen-label": ".js-formOpen-labelText" };
	var ENBeautifierFillersContainers = {
	  '#gr_donation': [/*'#Payment_CurrencyDiv',*/ '#Recurring_PaymentDiv', '#Donation_AmountDiv'],
	  '#gr_details': ['.js-billingDetails', '#First_NameDiv', '#Last_NameDiv', '#Email_AddressDiv', '#Address_1Div', '#CityDiv','#PostcodeDiv', '#CountryDiv', '#ProvinceDiv', '#Accepts_Electronic_CommunicationsDiv'],
	  '#gr_payment': ['.js-paymentDetails', '#Payment_TypeDiv', '#CC_ImagesDiv', '#Credit_Card_NumberDiv', '#Card_CVVDiv', '#Credit_Card_ExpirationDiv'],
	};

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
	var $form = $("form.eaform");
	var $firstStepForm = $('#firstStepForm');
	var formOpenButton = ".js-formOpen";
	var formOpenButtonLabel = ".js-formOpen-label";
	var windowSize;

	//Upsell
	var GRUpsell = __webpack_require__(5);
	var grupsell;
	var upsellContentSelector = '#upsell-modal';
	var $upsellTrackingField = $("#Other_1");

	//Donation form
	var GRSteps = __webpack_require__(6);
	var formSteps;

	var GRGivingSupport = __webpack_require__(7);
	var grGiving;

	var GRAnalytics = __webpack_require__(14);
	var grAnalytics;

	var GRaygun = __webpack_require__(17);
	var raygunFilterFields = ['password', 'credit_card', 'credit Card Number', 'Credit Card Number', 'card CVV', 'Card CVV'];
	var graygunner = new GRaygun({filter: raygunFilterFields});

	var $ = __webpack_require__(1);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);

	// var $submit = $(".eaSubmitButton");
	var $error_modal = $("#error-modal");
	var $validErrModal = $("#validErrModal");
	var formErrors = [ ];
	var validatorObj;

	if(true){
		init_devtools();
	}

	//Main event
	$(document).ready(function() {
		try {
			init();
			init_validation();

	        //set pcode validation to Canadian at the start
	        handleCountryChange({target: 'select[name="Country"]'});
		}
		catch(error) {
			graygunner.sendError(error);
		}


	});

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	function init() {

	  setupTracking();

	  //listener above must be active to listen to ENBeautifier in setupPage
	  setupPage();

	  if(
	    $('input[name="ea.submitted.page"]').length 
	    && parseInt($('input[name="ea.submitted.page"]').val()) > 1
	    && (
	        typeof isPostaction === "undefined"
	        || isPostaction === true
	        )
	    ){
			ty = true;
			setupTY();
		}
	    else{
	        setupAction();        
	    }

		//do everything else

		modernize();
	    
	    function handleSizing(){
	        getBrowserSize();
	        makeAffix();
	    }

	    handleSizing();
	    $(window).on("resize",handleSizing());

	}

	/**
	 * [setupTracking description]
	 * @return {[type]} [description]
	 */
	function setupTracking(){
	    grAnalytics = new GRAnalytics({
	        form: $form,
	        'events': [ 
	            // {   
	            //     'selector': '[name="Payment Currency"]:not(a)', 
	            //     'event': 'change',
	            //     'virtualPageview': 'payment/currency-changed'
	            // },
	            // {   
	            //     'selector': '[name="Donation Amount"]:not(a)', 
	            //     'event': 'change',
	            //     'virtualPageview': 'payment/donation-changed'
	            // },
	            // {   
	            //     'selector': '[name="Recurring Payment"]:not(a)', 
	            //     'event': 'change',
	            //     'virtualPageview': 'payment/recurrence-changed'
	            // }
	        ]
	    });

	    $(formSelector).on('formError.enbeautifier', function(e, errors) {
	        $error_modal
	            .find(".modalErrorMessage")
	            .html(errors);
	        
	        $error_modal.modal( {
	            show:true
	        } );

	        var error_text = '';
	        errors.each(function() {
	            error_text += $(this).text();
	        });

	        // handle errors
	        try { throw new Error("EA Processing Error");}
	        catch(error) {
	            grAnalytics.analyticsReport('action-failure/'+$('input[name="ea.campaign.id"]').val());
	            graygunner.sendError(error, {
	                data: {'error': error_text},
	                forms: [ENFormSelector]
	            });
	        }
	    });    
	}

	/**
	 * [makeAffix description]
	 * @return {[type]} [description]
	 */
	function makeAffix(){
	    // we handle the mobile form without use of affix
	    var $affixForm = $(".form");
	    $(window).off(".affix");
	    $affixForm
	        .removeClass("affix affix-top affix-bottom")
	        .removeData("bs.affix");

	    if (windowSize !== "phone" && windowSize !== "mobile") {
	        if($(window).height() >  getFormHeight($affixForm)) {
	            $affixForm
	                // .filter(":not(.affix-top, .affix, .affix-bottom)")
	                .affix({
	                    offset: {
	                        top: header.outerHeight(),
	                        bottom: footer.outerHeight()
	                    }
	                });

	            // $affixForm.affix('checkPosition');
	        }
	        else {
	            $("#grdonation").css('height','auto');
	            $affixForm.addClass("no-affix");
	        }
	    }
	    else{
	    }
	}

	function getFormHeight($sourceForm) {
	    var height = 0;
	    $sourceForm
	        .css('height', 'auto')
	    height = $sourceForm.outerHeight();
	    $sourceForm.css('height', '');
	    return height;
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
	 * [setupPage description]
	 * @return {[type]} [description]
	 */
	function setupPage(){
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
	        enbeautifier.clearFillers();
	        enbeautifier.moveToTargets(ENBeautifierFillersContainers,true);

	    }
	    catch(error){
	        graygunner.sendError(error);
	    }
	}

	/**
	 * [setupAction description]
	 * @return {[type]} [description]
	 */
	function setupAction(){

		try{


			// slick
			$('.supporters-carousel').slick({
				dots: true,
				arrows: true,
				appendArrows: '.slick-list',
				prevArrow: '<button type="button" class="slick-prev"></button>',
				nextArrow: '<button type="button" class="slick-next"></button>'
			});

	        enbeautifier.addClasses({
	            '[name="First Name"]': {classes: "inline-block-field half", targetElement: "div.eaRightColumnContent"},
	            '[name="Last Name"]': { classes: "inline-block-field half last", targetElement: "div.eaRightColumnContent"},
	            '[name="City"]': { classes: "inline-block-field half", targetElement: "div.eaRightColumnContent"},
	            '[name="Postcode"]': { classes: "inline-block-field half last", targetElement: "div.eaRightColumnContent"},
	            '[name="Payment Type"]': { classes: "inline-block-field half", targetElement: "div.eaRightColumnContent"},
	            '#paypal': { classes: "inline-block-field half last", targetElement: "div.eaFormField"},
	            '[name="Credit Card Number"]': { classes: "inline-block-field three-quarter", targetElement: "div.eaRightColumnContent"},
	            '[name="Card CVV"]': { classes: "inline-block-field one-quarter last", targetElement: "div.eaRightColumnContent"},
	            '[name="Credit Card Expiration1"]': { classes: "inline-block-field half", targetElement: ".eaSplitSelectfield"},
	            '[name="Credit Card Expiration2"]': { classes: "inline-block-field half last", targetElement: ".eaSplitSelectfield"},
	            '[name="Country"]': {classes: "inline-block-field half", targetElement: "div.eaRightColumnContent"},
	            '[name="Province"]': {classes: "inline-block-field half last", targetElement: "div.eaRightColumnContent"},
	            '.eaSubmitButton':{ classes: "btn btn-danger btn-lg", targetElement: ".eaSubmitButton"},
	            'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect': {classes: 'form-control', targetElement: 'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect'}
	        });

	        $("#Credit_Card_ExpirationDiv").html( function(i,h) { 
	                    return h.replace(/&nbsp;/g,'');
	                });

	    	//Set up panel steps
	        formSteps = new GRSteps({
	          activeClass: 'active',
	          useCSSAnimation: false,
	          indicatorTarget: '.steps-list ul',
	          steps: $("#gr_donation,#gr_details,#gr_payment"),
	          stepLabels: ['1. Donate', '2. Details', '3. Payment'],
	          addButtons: true,
	          target: "#window",
	          stepHandler:[
	            //step 1 handler
	            function(){
	              formErrors = [ ];
	              $("#gr_donation").find("input,select,textarea").valid();
	              if(formErrors.length) {
	                handleErrors(formErrors);
	                return false;
	              } else {
	                grAnalytics.analyticsReport( 'payment/page1-complete' );
	                return true;
	              }
	               
	            },

	            //step 2 handler
	            function(){
	              formErrors = [ ];
	              $("#gr_details").find("input,select,textarea").valid();
	              if(formErrors.length) {
	                handleErrors(formErrors);
	                return false;
	              } else {
	                grAnalytics.analyticsReport( 'payment/page2-complete' );
	                return true;
	              }
	            },

	            //step 3 handler
	            function(){
	              formErrors = [ ];
	              //let the stepper handle any errors
	              if( !$("#gr_payment").find("input,select,textarea").valid() ){
	                handleErrors(formErrors);
	                return false;
	              } 
	              //If there are no errors, send the form
	              else {
	                $form.submit();
	              }

	            }
	          ]
	        });
	        
	        //prevent tabbing to next step
	        $("#gr_donation,#gr_details,#gr_payment").on('keydown', 'input, select, textarea, button', function(e) {
	            if(e.which == 9) {
	                var $stepPanel = $(this).parents('.page').first();
	                var $lastTabbable = $stepPanel.find('input, select, textarea, button').filter(":last");
	                var $firstTabbable = $stepPanel.find('input, select, textarea, button').filter(":first");
	                if(!e.shiftKey && $(this).is($lastTabbable)) {
	                    e.preventDefault();
	                    $firstTabbable.focus();
	                    //formSteps.nextStep();
	                } else if(e.shiftKey && $(this).is($firstTabbable)) {
	                    e.preventDefault();
	                    $lastTabbable.focus();
	                    //formSteps.previousStep();
	                }
	            }
	        });

	        $("#window").on('stepChanged.grsteps', function(e, step) {
	            $("#window").promise().done(function() {
	                $("#gr_donation,#gr_details,#gr_payment")
	                    .filter(function(index) {
	                        return (step.currentStep == index);
	                    })
	                    .find('input, select, textarea, button')
	                    .first()
	                    .focus();
	            });
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
	                    // selector: '[name="Payment Currency"]:not(a)',
	                    urlParam: 'curr',
	                    defaultVal: 'CAD'
	                },
	                recurrence: {
	                    selector: '[name="Recurring Payment"]:not(a)',
	                    defaultVal: ''
	                },
	                amount: {
	                    selector: '[name="Donation Amount"]:not(a)',
	                    urlParam: 'amt',
	                    defaultVal: '50',
	                    name: 'Donation Amount'
	                },
	                other: {
	                    selector: '[name="Donation Amount Other"][type="text"]:not(a)',
	                    name: 'Donation Amount Other',
	                    targetName: 'Donation Amount',
	                    label: 'Other amount'
	                },
	                processor: {
	                    selector: '[name="Payment Type"]:not(a)',
	                    urlParam: 'country',
	                    defaultVal: 'CA'
	                }
	            },
	            //activeRegionLists: ['CA'], //disabling since Ecojustice already has a dropdown for region that includes US and CA options
	            askStringSelector: '#donation-ranges',
	            askStringContainerClass: 'levels',
	            recurrenceOptions: [
	                {label: 'Single', 'value': ''},
	                {label: 'Monthly', 'value': 'Y'}
	            ],
	            processorFields: { 
	                'PayPal': {
	                    hide: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationField']
	                },
	                'Visa': {
	                    show: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationField']
	                },
	                'MasterCard': {
	                    show: ['#Credit_Card_NumberDiv', '#Credit_Card_Verification_ValueDiv', '#Credit_Card_ExpirationField']
	                }

	            }

	        });

	        //change the submit button when the amount changes
	        $submit = $("#gr_payment").find(".btn-next").addClass("button-submit");
	        $form
	          .on(
	            'change',
	            'input[name="Donation Amount"], input[name="Donation Amount Other"], input[name="Recurring Payment"], [name="Payment Currency"]:not(a)',
	            function(e) {
	                $submit.text("Donate " + grGiving.getAmount(true) + (grGiving.isRecurring() ? ' Monthly' : ''));
	            })
	          .on(
	            'change',
	            'select[name="Country"]',
	            handleCountryChange)
	          .on('submit', sendDonation);

	        //add name to submit button for EN
	        $submit.attr("name", "submitter");
	        
	        //Remove the original donate input
	        //TODO: integrate this in to the actual form code
	        $('input[name="Donation Amount"][type="text"]').remove();


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
	            },
	            declineCallback: function(){
	                grAnalytics.analyticsReport( 'payment/upsell-declined' );
	            },
	            upsellCallback: function(){
	                grAnalytics.analyticsReport( 'payment/upsell-accepted' );
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

	        $form.removeAttr('onsubmit');
	        $('[data-toggle="popover"]').popover();

			//things to do just on load
			setupMobileButton();

		} catch(error) {
			graygunner.sendError(error);
		}
	}

	function handleCountryChange(e){
	    var countryField = $(e.target);
	    var countryCode = countryField.val();
	    var regionField = $('[name="Province"]:not(a)');
	    var countriesRequiringPcodes = ['US', 'CA'];

	    if(countryCode == 'CA'){
	        $('input[name="Postcode"]').rules("add","isPostcodeCA");
	    }
	    else{
	        $('input[name="Postcode"]').rules("remove","isPostcodeCA");
	    }

	    if(countriesRequiringPcodes.indexOf(countryCode) !== -1){
	        regionField.rules("add",{required: true});
	        regionField.show();
	    }
	    else{
	        regionField.rules("remove","required");
	        regionField.hide();
	        regionField.val('');
	    }
	}

	/**
	 * [setupTY description]
	 * @return {[type]} [description]
	 */
	function setupTY(){
	    try{
	        //add the post-action class
	        $("body").addClass("post-action");
	        $transaction_details = $(".js-transactionDetails");


	        var transactionData = {
	            'id': $transaction_details.find(".transaction_id").text(),
	            'affiliation': 'Engaging Networks', // any extra piece of information can be stored here
	            'revenue': $transaction_details.find(".donation_amount").text().replace(/[^0-9\.]/g, ""),
	            'currency': $transaction_details.find(".currency").text().toUpperCase()
	        };

	        var campaignData = {
	            'id': $transaction_details.find(".transaction_id").text(),
	            'name': $transaction_details.find(".campaign_name").text(),
	            'sku': $transaction_details.find(".campaign_id").text(),
	            'category': ($transaction_details.find(".frequency").length ? ($transaction_details.find(".frequency").text() === "ACTIVE" ? "Monthly" : "Single") : "Single"),
	            'price': $transaction_details.find(".donation_amount").text().replace(/[^0-9\.]/g, ""),
	            'quantity': 1
	        };

	        var itemData = [campaignData];

	        //get the social links module
	        var GRSocialize = __webpack_require__(22);
	                
	        var section = getURLParameter('s');
	        grAnalytics.analyticsReport('action-complete/'+$('input[name="ea.campaign.id"]').val()+ (section ? '/' + section : ''))
	        //Ecommerce not installed on client's analytics
	        // grAnalytics.eCommerceReport(transactionData, itemData);


	        $(leftColumnSelector).find('header .logo').after($(leftColumnSelector).children("div:first").children());
	        $(leftColumnSelector).children("div:first").remove();    


	        //init social links
	        socialbuttons = new GRSocialize({
	            target: ".social",
	            newWindow: true,
	            facebook: {
	                appID: 1003792509664879
	            },
	            onOpen: function(network, spec, target){
	                //do tracking stuff
	            }
	        });
	    } catch(error) {
	        graygunner.sendError(error);
	    }

	}

	/**
	 * [setupMobileButton description]
	 * @return {[type]} [description]
	 */
	function setupMobileButton(){
		// var actionButton = $(formSelector).find(".button");
		var mobileButton = $(formOpenButton);

		//Set the open button to use the same copy as the action button
		// mobileButton.find(formOpenButtonLabel).text(actionButton.text());
	    //***Not required, or good, for donation forms 

		mobileButton
			.on("click",function(){
				$(formSelector).addClass("is-active");
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

				if( 
	                Math.abs(topMove / windowHeight ) > 0.25 
	                || Math.abs(topMove / windowHeight ) < 0.1
	                ){
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
				graygunner.sendError(error, {
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

	/**
	 * [sendDonation description]
	 * @param  {[type]} form [description]
	 * @return {[type]}      [description]
	 */
	function sendDonation(e) {
	  
	    grAnalytics.analyticsReport( 'payment/donate-'+grGiving.getProcessor().toLowerCase() );
	    // if (payment == "PayPal") {
	    //     $paypalForm = $('.js-paypal-'+donation_type+'-form');
	    //     for(var i=0; i < paypal_field_map.length; i++) {
	    //         $paypalForm.find('[name="'+paypal_field_map[i]['pp-'+donation_type]+'"]').val($(form).find('[name="'+paypal_field_map[i].en+'"]').not('a').val());
	    //     }
	    //     $paypalForm.submit();
	    // }
	    // else
	    //     form.submit();
	    e.preventDefault();

	    //detach ourselves
	    $form.off("submit");

	    //if not a recurring donation, launch the upsell.
	    if(!grGiving.isRecurring()){
	        grupsell.launch();
	    }
	    //if it is a recurring donation already, submit
	    else{
	        $form.submit();
	    }
	    return false;
	}


	function processForm() {
	    $('.eaSubmitButton').prop('disabled', true);
	    $('.eaSubmitButton').val("Processing...");
	}

	// Tracking
	//---------------------------------------
	// function analyticsReport( event, title ){
	// 	try {
	// 		//UA
	// 		if( typeof ga !== 'undefined' ){

	// 		    var data = {};
	// 		    if( event ){
	// 		      data[ 'page'] = '/virtual/'+event;
	// 		    }
	// 		    if( title ){
	// 		      data[ 'title' ] = title;
	// 		    }

	// 		    ga( 'send', 'pageview', data );

	// 		}

	// 		//Traditional GA
	// 		if( typeof _gaq !== 'undefined' ){
	// 		    _gaq.push(['_trackPageview', '/virtual/'+event]);
	// 		}

	// 		//Tag Manager
	// 		if( typeof _gaq !== 'undefined' ){

	// 		}
	// 	} catch (error) {
	// 		graygunner.sendError(error);
	// 	}
	// }

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
			if($(selector).length && $.trim($(selector).text()) != '') {
				$error_modal
	                .find(".modalErrorMessage")
	                .html($('#eaerrors')
	                .html());
	            
	            $error_modal.modal( {
	                show:true
	            } );

	            try { throw new Error("EA Processing Error");}
				catch(error) {
					grAnalytics.analyticsReport('action-failure/'+$('input[name="ea.campaign.id"]').val());
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
			__webpack_require__(23);

	        var errorMessages = {
	                invalidMonth: 'Invalid month',
	                invalidCVV: 'Invalid verification number',
	                invalidAmount: 'We only accept online donations between $5 and $10,000',
	                invalidDate: 'Date is invalid',
	                invalidEmail: 'Please enter a valid email address.',
	                invalidPcode: 'Please enter a valid postcode'
	            },
	            nowDate = new Date();

	        $.validator.addMethod('isValidDonation', function (value, element) {
	            // Converts to string for processing.
	            value += '';

	            // Only numbers or digits. 
	            // Allows use currency symbol in the start of line or in the end.
	            var regExp = /^\s?([$£€]?\s{0,1}(\d+[\d\s,]+\.?\d+|\d+)|(\d+[\d\s,]+\.?\d+|\d+)\s{0,1}[$£€]?)\s?$/g;

	            if (!regExp.test(value)) {
	                return false;
	            }

	            // Removes all wrong symbols.
	            value = parseFloat(
	                value.replace(/[$£€,\s]/g, '')
	            );

	            // var min = + $ranges.find('ul.'+currency).find('li').first().html();;
	            var min = 5,
	                max = 10000;

	            return (value >= min && value <= max);
	        }, errorMessages.invalidAmount);

	        $.validator.addMethod("emailTLD", function (value, element) {
	            value = value.replace(/\s/g,'');
	            $(element).val(value);
	            return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	        }, errorMessages.invalidEmail);
	        
	        $.validator.addMethod('isMonth', function (value, element) {
	            return value.length == 2
	                && parseInt(value) > 0
	                && parseInt(value) <= 12;
	        }, errorMessages.invalidMonth);

	        $.validator.addMethod('isNowOrFutureYear', function (value, element) {
	            var year = '';
	            if(value.length >= 4){
	                year = parseInt(value);
	            }
	            else if(value.length == 2){
	                year = parseInt('20'+value);
	            }
	            else{
	                return false;
	            }

	            return year >= nowDate.getFullYear();
	        }, errorMessages.invalidDate);

	        $.validator.addMethod('isFuture', function (value, element) {
	            //Reject if the month and year together are in the past
	            var month = $(element)
	                .closest("form")
	                .find("#Credit_Card_Expiration1")
	                .val();

	            //for two-digit years, assume it's in this century
	            if(value.length === 2){
	                value = '20'+value;
	            }

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

	        $.validator.addMethod('isPostcodeCA', function (value, element) {
	            value = $.trim(value);
	            $(element).val(value);
	            var regexPcode = /^([a-zA-Z]\d[a-zA-z]( )?\d[a-zA-Z]\d)$/;
	            return regexPcode.test(value);
	        }, errorMessages.invalidPcode);

	        $.validator.addMethod('stripspaces', function (value,element) {
	            value = value.replace(/\s/g, '');
	            $(element).val(value);
	            return true
	        });

	        var validation_rules = {
	            "First Name": "required",
	            "Last Name": "required",
	            "Address 1": {
	                required: true
	            },
	            "City": "required",
	            "Province": "required",
	            "Country": "required",
	            "Email Address": {
	                required: true,
	                emailTLD: true
	            },
	            "Postcode": {
	                required: true
	            },
	            "Payment Type": "required",
	            "Credit Card Number": {
	                required: true,
	                stripspaces: true,
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
	                isValidDonation: true
	            }
	        };
	        $form.validate({
	            rules: validation_rules,
	            unhighlight: function (element, errorClass, validClass) {
	                var $el = $(element);
	                if($el.attr("type")=="checkbox") return;
	                $el.removeClass(validClass).removeClass(errorClass);

	                if ($el.val() != ''&& ($el.attr('id') !== 'setcurrency')) {
	                    $el.addClass(validClass);
	                }
	            },
	            highlight: function (element, errorClass, validClass) {
	                var $el = $(element);
	                if($el.attr("type")=="checkbox") return;
	                $el.removeClass(validClass).addClass(errorClass);
	            },
	            success: function (element, label) {
	                var $el = $(element);
	            },
	            groups: {
	                demoGroup: "First Name",
	                ccExpiryDate: "Credit Card Expiration 1 "
	            },
	            invalidHandler: function(e, validator) {
	                var errors = validator.errorList;
	                    //$errorList = $('<ul>');
	                handleErrors(errors, validator);
	                validatorObj = validator;
	                
	            },
	            showErrors: function (errorMap, errorList) {
	                if(errorList.length) {
	                    formErrors = formErrors.concat(errorList);
	                }
	                /*if (this.numberOfInvalids() > 0) {
	                    $("#donor_errors").html("<div class='alert alert-danger'><i class='glyphicon glyphicon-exclamation-sign'></i> Please correct the <b>" + this.numberOfInvalids() + "</b> errors indicated below.</div>").show(300);

	                    if (typeof errorMap['Donation Amount'] !== 'undefined') {
	                        $("#donor_errors").append("<div class='alert alert-warning' role='alert'><i class='glyphicon glyphicon-info-sign'></i><a class='btn-prev' href='#'>" + errorMap['Donation Amount'] + "</a></div>");
	                    }

	                } else {
	                    $("#donor_errors").hide(300);
	                }*/
	                this.defaultShowErrors();
	            },
	            errorPlacement: function () {
	                return false; // <- kill default error labels
	            },
	            onkeyup: function(element, event) {
	                var rules = $(element).rules();
	                if(typeof rules.isPostcodeCA == "undefined" && typeof rules.emailTLD == "undefined" && event.which != 9)
	                    $(element).valid();
	            }            
	        });

		}
		catch(error){
			graygunner.sendError(error);
		}
	}

	function handleErrors(errors, validator) {
	    var errorElements = [ ];
	    $errorList = $('<ul>');

	    // Used for customization of input names in error message.
	    var inputNamesMapper = {
	        'Postal Code': 'Postal Code',
	        'City': 'City / Town',
	        'Address 1': 'Address 1',
	        'Payment Type': 'Payment Option',
	        'Province': 'State / Province / Region',
	        'Credit Card Expiration1': 'Credit Card Expiration MM',
	        'Credit Card Expiration2': 'Credit Card Expiration YYYY',
	        'Credit Card Verification Value': 'CVV2 Code'
	    };

	    for (var i in errors) {
	        var inputName = $(errors[i].element)
	                .attr('id')
	                .replace(/_/g, ' '),
	            errorType = errors[i].method,
	            errorMessage = '';

	        inputName = inputNamesMapper[inputName] || inputName;

	        if(errorElements.indexOf(inputName) != -1) {
	            continue;
	        } else {
	            errorElements.push(inputName);
	        }

	        // Checking and replacing standart error message.
	        if (errorType === 'required'
	            && errors[i].message === 'This field is required.') {
	            errorMessage = inputName + ' is required.';
	        } else {
	            errorMessage = errors[i].message;
	        }

	        var $error = $('<li>')
	            .html(errorMessage);

	        $errorList
	            .append($error)
	    }

	    $validErrModal
	        .find('.error-list')
	        .html($errorList);

	    $validErrModal
	        .modal('show');

	    grAnalytics.analyticsReport("payment/validation-error");

	    try {
	        throw new Error("failed validation");
	    }
	    catch (error) {
	        graygunner.sendError(error, {
	            data: {
	                errors: $errorList.text()
	            },
	            forms: [ENFormSelector]
	        });

	        /*var fieldData = $(this).serializeArray();
	        for(var i = 0; i < fieldData.length; i++ ) {
	            if(fieldData[i].name == "Credit Card Number")
	                fieldData.splice(i, 1);
	        }
	        if(typeof validator !== "undefined"){
	            Raygun.send(err, {errors: validator.invalid, values: fieldData});    
	        }
	        else{
	            Raygun.send(err, {values: fieldData});
	        }*/
	    }
	}

	/**
	 * [getBrowserSize description]
	 * @return {[type]} [description]
	 */
	function getBrowserSize(){
	    if(window.getComputedStyle){
	        windowSize = window
	            .getComputedStyle(document.body,':after')
	            .getPropertyValue('content');
	        windowSize = windowSize.replace(/["']/g,'');
	    }           
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRUpsell module
	 * requires jQuery, Bootstrap
	 */
	var requiredOptions = [
	    'form',
	    'donationAmountField',
	    'recurringField',
	    'upsellContentSelector'
	];

	var defaults = {
	    'declineClass': 'js-single-donation',
	    'upsellClass': 'js-monthly-donation',
	    'upsellMethod': 'range', //can be range, function, or formula
	    'maxGift': 300,
	    'donationAmountClass': 'js-single-donation-amount',
	    'upsellAmountClass': 'js-monthly-donation-amount',
	    'enabled': true
	}
	var initialAmount = 0;
	var upsellAmount = 0;

	var options;

	/**
	 * GRUpsell constructor
	 * @param Object options with the following properties:
	 *        string upsellContentSelector - selector for container of upsell content
	 *        jQuery recurringField - collection of form field names desired in the order of preference - Email should always be included and be the first in the array
	 *        jQuery form - a jQuery object of the form where the fields will be added 
	 */
	function GRUpsell(opt) {

	    if(this.hasRequiredOptions(opt)) {

	        options = $.extend(true, {}, defaults, opt);
	        this.init();
	    }
	    else
	        throw new Error("[GRUpsell] Missing required options: " + this.missingOptions.join(', '));
	}

	/**
	 * GRUpsell hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	GRUpsell.prototype.hasRequiredOptions = function(options) {
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

	GRUpsell.prototype.init = function() {
	    $(options.upsellContentSelector).appendTo($('body'));
	    $('body').on('click', "."+options.declineClass, $.proxy(handleDecline, this));
	    $('body').on('click', "."+options.upsellClass, $.proxy(handleUpsell, this));
	}

	GRUpsell.prototype.launch = function() {
	    var field = options.donationAmountField;

	    //get the active field
	    if( field.length > 1){
	        checkedField = field.filter(":checked");
	        if(checkedField.length === 1){
	            field = checkedField;
	        }
	    }

	    initialAmount = parseFloat(field.val().replace(/[^0-9\.]/g, ''));

	    if(options.enabled === false || initialAmount >= options.maxGift || options.recurringField.val()=='Y') 
	        return false;

	    upsellAmount = calculateUpsell(initialAmount);

	    $(options.upsellContentSelector).find("."+options.donationAmountClass).text(initialAmount.toLocaleString());
	    $(options.upsellContentSelector).find("."+options.upsellAmountClass).text(upsellAmount.toLocaleString());

	    $(options.upsellContentSelector).modal({
	        backdrop: 'static',
	        keyboard: false
	    });
	    $(options.upsellContentSelector).modal('show');
	    options.enabled = false;
	    return true;
	}

	function calculateUpsell(amt) {
	    switch(options.upsellMethod) {
	        case 'range':
	            if(typeof options.range != "undefined")
	                return getUpsellFromRange(amt);
	        break;
	        case 'function':
	            if(typeof options.calcFunction != "undefined")
	                return options.calcFunction(amt);
	        break;
	        case 'formula':
	            if(typeof options.formula != "undefined") 
	                return eval(options.formula);
	        break;
	    }
	    return amt;   
	}

	function getUpsellFromRange(amt) {
	    try {
	        amt = parseFloat(amt.replace(/[^0-9\.]/g, ''));
	        for(var i = 0; i < options.range.length; i++) {
	            if(amt >= options.range[i].min && amt < options.range[i].max)
	                return options.range[i].amount;
	        }
	    }
	    catch(err) { }
	    
	    return amt;
	}

	function handleDecline(e) {
	    e.preventDefault();
	    options.recurringField.val('N');
	    options.form.trigger("grupsell.declined", [initialAmount, upsellAmount]);
	    $(options.upsellContentSelector).modal('hide');

	    if(typeof options.declineCallback === "function"){
	        options.declineCallback.call(this);
	    }

	    options.form.submit();
	}

	function handleUpsell(e) {
	    e.preventDefault();
	    options.recurringField.val('Y');
	    options.donationAmountField.val(upsellAmount);
	    options.form.trigger("grupsell.upsold", [initialAmount, upsellAmount]);
	    $(options.upsellContentSelector).modal('hide');

	    if(typeof options.upsellCallback === "function"){
	        options.upsellCallback.call(this);
	    }

	    options.form.submit();
	}


	module.exports = GRUpsell;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRSteps module
	 * 
	 * Creates and handles a multi-step form
	 * Note: uses ES6 module syntax
	 * 
	 * @module  GRSteps
	 * @requires jQuery
	 */
	var requiredOptions = [ 'steps' ];

	var defaults = {
	    'indicatorTarget': '.steps-list',
	    'activeClass': "is-active",
	    'completeClass': "is-complete",
	    'target': '.js-formSteps',
	    'stepHandler': [],
	    'stepLabels': [],
	    'currentStep': false,
	    'startStep': 0,
	    'useCSSAnimation': true,
	    'addButtons': false
	};

	var protect = {
	    'prependPath': [ ]
	};

	/**
	 * Step constructor
	 * Note: uses ES6 module syntax
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	function GRSteps(options){

	  //step constructor
	  if(this.hasRequiredOptions(options)) {
	    this.options = $.extend(true, {}, defaults, options, protect);
	    this.init();
	  }
	}

	/**
	 * Initialize GRSteps
	 * @return {[type]} [description]
	 */
	GRSteps.prototype.init = function(){
	  //initalizer
	  var steps = this;
	  this.stepIndicators = $();
	  this.$container = $(this.options.target);
	  this.addSteps(this.options.steps);

	  //add a frame to the parent
	  this.$container.parent().addClass("window--frame");

	  //add step buttons if so configured
	  if(this.options.addButtons){
	    this.buttonify.call(this.options.steps);
	  }

	  //button handlers
	  this.$container
	    .on("click", ".btn-next", function(e){
	      e.stopPropagation();

	      steps.nextStep();
	    })
	    .on("click",".btn-prev", function(e){
	      e.stopPropagation();

	      steps.previousStep();
	    });

	  this.switchTo(this.options.startStep);

	}

	/**
	 * GRAnalytics hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	GRSteps.prototype.hasRequiredOptions = function(options, req) {
	    var missingOptions = [ ];
	    if(typeof req == "undefined") req = requiredOptions;
	    for(var i = 0; i < req.length; i++) {
	        if(typeof options[req[i]] === 'undefined') {
	            missingOptions.push(req[i]);
	        }
	    }
	    if(missingOptions.length) {
	        this.missingOptions = missingOptions;
	        return false;
	    }
	    return true;
	}

	/**
	 * [addSteps description]
	 * @param {[type]} steps [description]
	 */
	GRSteps.prototype.addSteps = function(newSteps){
	  //stepIndicators should be a jQuery object; adding allows us to create new objects on it
	  //here, we loop from the the current length of the list to the length including the new items
	  
	  var currentLength = this.stepIndicators.length;

	  for(
	    var i = currentLength;
	    i < currentLength + newSteps.length;
	    i++
	    ){

	    //set the indicator label as either an integer or the indicated label
	    var label = i+1;
	    if(typeof this.options.stepLabels[i] !== 'undefined'){
	      label = this.options.stepLabels[i];
	    }

	    this.stepIndicators = this.stepIndicators.add('<li class="step'+i+'">'+label+'</li>');
	  }

	  //after the first time stepIndicators is appended, it becomes part of the DOM. So when you re-append, it acts as though you're moving the whole set, effectively just adding the new things (apparently)
	  $(this.options.indicatorTarget).append(this.stepIndicators);

	  //change the container width to match the number of panels
	  var containerWidthPercentage = 100 * this.stepIndicators.length;
	  var panelWidthPercentage = 100 * (1/this.stepIndicators.length);
	  this.$container.css("width", containerWidthPercentage + "%" );
	  this.$container.children().css("width",panelWidthPercentage + "%");
	}

	/**
	 * [switchTo description]
	 * @param  {[type]} stepNumber [description]
	 * @return {[type]}            [description]
	 */
	GRSteps.prototype.switchTo = function(stepNumber){
	  this.stepIndicators
	    .removeClass(this.options.activeClass);

	  //TODO: validate the current panel
	  
	  //run any interrupting processes
	  //prevent the panel from advancing if it returns false (going back should be OK)
	  if(
	    typeof this.options.stepHandler[this.options.currentStep] === "function"
	    && this.options.currentStep < stepNumber
	    && this.options.stepHandler[this.options.currentStep].call(this.$container) === false
	    ){
	    return;
	  }

	  //add the complete class to the current indicator
	  //this is probably OK.
	  if(this.options.currentStep !== false){
	    this.stepIndicators.eq(this.options.currentStep)
	      .addClass(this.options.completeClass);
	  }

	  if(stepNumber > this.stepIndicators.length || stepNumber < 0){
	    return;
	  }

	  //switch the indicator
	  this.options.currentStep = stepNumber;
	  this.stepIndicators.eq(this.options.currentStep)
	    .addClass(this.options.activeClass);

	  //actually switch to the panel
	  var newMargin = (this.options.currentStep * -100).toString() + '%';
	  
	  if(this.options.useCSSAnimation){
	    this.$container.css({marginLeft: newMargin});
	  }
	  else{
	    this.$container
	      .animate({
	        "marginLeft": newMargin
	      }, 300);
	  }

	  //let the world know what's happened
	  this.$container.trigger("stepChanged.grsteps",{currentStep:this.options.currentStep});
	}

	/**
	 * [addButtons description]
	 */
	GRSteps.prototype.buttonify = function(){
	  var lastIndex = this.length-1;
	  this.each(function(index, step) {
	    if(index == lastIndex) {
	      $(step).append(
	        '<p class="pull-right"> \
	          <button type="button" class="btn btn-danger btn-lg btn-next">Donate<span class="glyphicon glyphicon-chevron-right"></span></button> \
	        </p>'
	      );
	    } else {
	      $(step).append(
	        '<p class="pull-right"> \
	          <button type="button" class="btn btn-danger btn-lg btn-next">Donate<span class="glyphicon glyphicon-chevron-right"></span></button> \
	        </p>'
	      );
	    }

	    if(index>0) {
	      $(step).append(
	        '<p class="pull-left back-button"> \
	          <button type="button" class="go-back btn-prev"><span class="glyphicon glyphicon-chevron-left"></span> Back</button> \
	        </p>'
	      );
	    }
	  });
	}

	/**
	 * [next description]
	 * @return {Function} [description]
	 */
	GRSteps.prototype.nextStep = function(){
	  this.switchTo(this.options.currentStep + 1)
	}

	GRSteps.prototype.previousStep = function(){
	  this.switchTo(this.options.currentStep - 1)
	}

	//step validator


	module.exports = GRSteps;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRGivingSupport module
	 *
	 * Manages common aspects required for building a donation form
	 * 
	 * requires jQuery
	 */
	var requiredOptions = [ 'form' ];

	//expected
	var defaults = {
	    autoSelectCurrency: false,
	    components: {
	        country: {  },
	        region: {  },
	        currency: {  },
	        recurrence: {  },
	        amount: {  },
	        other: { },
	        processor: {  }
	    },
	    activeRegionLists: [ ],
	    askStringSelector: '.js-donation-amounts',
	    askStringContainerClass: 'js-ask-string-container',
	    currencySymbol: '$',
	    recurrenceOptions: [ ],
	    processorFields: { }
	};

	var protect = {
	    components: {
	        other: { urlParam: null, defaultVal: null }
	    }
	};

	var options;

	var $form;
	var askStringIndex = { };
	var availableRegionLists = [
	    'US',
	    'CA',
	    'AU',
	    'IN'
	];
	var currencyMap = __webpack_require__(8);
	var currencySymbols = __webpack_require__(9);
	var grHelpers = __webpack_require__(10);
	var processorFields = { };
	var regionLists = { };
	var setDefaultsOrder = [
	    'country',
	    'region',
	    'currency',
	    'recurrence',
	    'amount',
	    'processor'
	];

	function isActive(component) {
	    if(
	      typeof component !="undefined" 
	      && typeof component.selector != "undefined"
	      ){
	      return true;  
	    }
	    else return false;
	}

	function exists(component) {
	    if(isActive(component) && $form.find(component.selector).length)
	        return true;
	    return false;
	}


	function setValue(component, value, strict) {
	    if(strict == null) strict = false;
	    var $component = $form.find(component.selector);
	    switch($component.prop("tagName").toLowerCase()) {
	        case 'select':
	            if($component.find('option[value="'+value+'"]').length == 0) {
	                if(strict) return false;
	                else $component.append('<option value="'+value+'">'+value+'</option>');
	            }
	            $component.val(value);
	        break;
	        default:
	            switch($component.attr('type').toLowerCase()) {
	                case 'checkbox':
	                case 'radio':
	                    if($component.filter('[value="'+value+'"]').length)
	                        $component.filter('[value="'+value+'"]').prop('checked', true);
	                    else
	                        return false;
	                break;
	                default:
	                    $component.val(value);
	                break;
	            }
	        break;
	    }
	    return true;
	}

	/**
	 * getValue gets the current value after any DOM manipulation
	 * @param Object component
	 * @return Array|string|null
	 */
	function getValue(component) {
	    var $component = $form.find(component.selector);
	    switch($component.prop("tagName").toLowerCase()) {
	        case 'select':
	            return $component.val();
	        break;
	        default:
	            switch($component.attr('type').toLowerCase()) {
	                case 'checkbox':
	                    var val = [];
	                    $component.filter(':checked').each(function(i){
	                        val[i] = $(this).val();
	                    });
	                    return val;
	                break;
	                case 'radio':
	                    return ($component.filter(':checked').length ? $component.filter(':checked').val() : "");
	                break;
	                default:
	                    return $component.val();
	                break;
	            }
	        break;
	    }
	}
	/**
	 * getHTMLValue gets the value from the html code regardless of DOM manipulation
	 * @param Object component
	 */
	function getHTMLValue(component) {
	    var $component = $form.find(component.selector);
	    switch($component.prop("tagName").toLowerCase()) {
	        case 'select':
	            var selectedOption = null;
	            $component.children('option').each(function() {
	                if(this.getAttribute("selected"))
	                    selectedOption = $(this).attr('value');
	            });
	            return selectedOption;
	        break;
	        default:
	            switch($component.attr('type').toLowerCase()) {
	                case 'checkbox':
	                case 'radio':
	                    var checkedOption = null;
	                    $component.each(function() {
	                        if(this.getAttribute("checked"))
	                            checkedOption = $(this).val();
	                    });
	                    return checkedOption;
	                break;
	                default:
	                    return ($component[0].getAttribute('value') == "" ? null : $component[0].getAttribute('value'));
	                break;
	            }
	        break;
	    }
	}

	/**
	 * GRGivingSupport constructor
	 * @param Object opt options with the following properties:
	 *        string donationCampaignId - The campaign id of the donation form to be embedded
	 *        pageTargetContainer
	 *        donationFormContainer
	 */
	function GRGivingSupport(opts) {
	    if((missing = grHelpers.hasMissingOptions(opts, requiredOptions))) {
	        throw new Error("[GRGivingSupport] Missing required options: " + missing.join(', '));
	    }
	    else {
	        options = $.extend(true, {}, defaults, opts, protect);
	        this.init();
	    }

	}

	GRGivingSupport.prototype.init = function() { 
	    $form = options.form;
	    this.getDefaults();
	    if(isActive(options.components.region)) {
	        //attach region input details onchange
	        if(options.activeRegionLists) 
	            this.activateCountryRegions(options.activeRegionLists);
	        else
	            regionLists["default"] = $('<div>').append($form.find(options.components.region.selector).clone()).html();
	        if(isActive(options.components.country)) {
	            $form.find(options.components.country.selector).on('change', function(e) {
	                e.preventDefault();
	                var regionElement;
	                if(typeof regionLists[$(this).val()] == 'undefined') {
	                    regionElement = regionLists["default"];
	                }
	                else {
	                    regionElement = regionLists[$(this).val()];
	                }
	                $form.find(options.components.region.selector).replaceWith(regionElement);
	            });
	        }
	    }

	    //check if recurrence should be setup
	    if(isActive(options.components.recurrence)) { 
	        if(options.recurrenceOptions.length)
	            this.buildRecurrenceSelector(options.recurrenceOptions);
	        $form.find(options.components.recurrence.selector).on('change', $.proxy(this.updateAskString, this));
	    }

	    //if processorFields setup field hide and show on processor change
	    if(isActive(options.components.processor)) {
	        if(options.processorFields)
	            this.setProcessorFields(options.processorFields);
	        $form.find(options.components.processor.selector).on('change', function(e) {
	            if(typeof processorFields[$(this).val()] != "undefined") {
	                if(processorFields[$(this).val()]['hide'])
	                    $(processorFields[$(this).val()]['hide'].join(', ')).hide();
	                if(processorFields[$(this).val()]['show'])
	                    $(processorFields[$(this).val()]['show'].join(', ')).show();
	            }
	        });
	    }

	    //add container around amount for ask string buttons
	    if(isActive(options.components.amount) || isActive(options.components.other)) {
	        var $amountInput = $form.find(options.components.amount.selector+','+options.components.other.selector);
	        $amountInput.first().wrap('<div class="'+options.askStringContainerClass+'"></div>');
	        $form
	            .on('change', options.components.amount.selector, function(e) { //clear other box when not selected
	                e.stopPropagation();
	                if($form.find(options.components.amount.selector).val() != 'other')
	                    $form.find(options.components.other.selector).val('');
	            })
	            .on('change','[name="'+options.components.other.name+'"]', function(e){
	                e.stopPropagation();

	                var donationValue = parseFloat($(this).val().replace(/[^0-9.]/g,''));

	                $(this).closest("label").siblings("input[type=radio]").val(donationValue);
	            });
	    }

	    //when other is active, ensure clicking on the field selects the 'other' radio
	    if(isActive(options.components.other)) {
	        $form.on('focus', options.components.other.selector, function(e) {
	            e.preventDefault();
	            $form.find('#'+$(this).parent().attr('for')).prop('checked',true);
	        });
	    }

	    //check if currency is available and add change event
	    if(isActive(options.components.currency)) { 
	        $form.find(options.components.currency.selector).on('change', $.proxy(this.updateAskString, this));
	    }
	    
	    this.setDefaults();

	    if(options.askStringSelector && !isActive(options.components.recurrence) && !isActive(options.components.currency))
	        this.updateAskString();
	    
	}

	GRGivingSupport.prototype.getDefaults = function() {
	    for(var component in options.components) {
	        if(exists(options.components[component])) {
	            var $component = $form.find(options.components[component].selector);
	            
	            //check for HTML value [i.e. set by the server - likely a postback]
	            var value = getHTMLValue(options.components[component]);
	        }
	            
	        //check of URL Parameter
	        if(!value && typeof options.components[component].urlParam !="undefined" && options.components[component].urlParam)
	            value = grHelpers.getURLParameter(options.components[component].urlParam);
	            
	        //finally check for default
	        /*if(!value && typeof options.components[component].defaultVal !="undefined" && options.components[component].defaultVal)
	            value = options.components[component].defaultVal;*/
	            
	        options.components[component].startingValue = value
	    }
	}

	GRGivingSupport.prototype.setDefaults = function() {
	    var components = options.components;
	    var value = null;

	    for(var i=0; i<setDefaultsOrder.length; i++) {
	        var component = setDefaultsOrder[i];
	        if(!isActive(components[component]))
	            continue;
	        switch(component) {
	            case 'currency': 
	                if( !components.currency.startingValue && isActive(components.country) && options.autoSelectCurrency)
	                    this.setCurrencyByCountry($form.find(components.country.selector).val());
	                else if(!components.currency.startingValue && components.currency.defaultVal)
	                    this.setCurrency(components.currency.defaultVal);
	            break;
	            default:
	                if(components[component].startingValue || typeof components[component].defaultVal != "undefined")
	                    this['set'+grHelpers.ucFirst(component)]( (components[component].startingValue ? components[component].startingValue : components[component].defaultVal) );
	            break;

	        }
	        
	    }
	}


	GRGivingSupport.prototype.activateCountryRegions = function(countries) {
	    //add to object regionLists
	    if(isActive(options.components.region)) {
	        var $region = $form.find(options.components.region.selector);
	        
	        regionLists = { 
	            "default": $('<div>').append($region.clone()).html()
	        };

	        for(var i=0; i<countries.length; i++) {
	            if(availableRegionLists.indexOf(countries[i]) != -1) {
	                //include region object
	                var regions = __webpack_require__(11)("./GRRegions-"+countries[i]);
	                //build selector and assign to 
	                regionLists[countries[i]] = grHelpers.createSelectComponent({
	                    name: $region.attr('name'),
	                    placeholder: regions.name,
	                    classes: $region.attr('class'),
	                    options: regions.regions
	                });
	            }
	        }
	    }
	}

	GRGivingSupport.prototype.getAmount = function(formatted) {
	    if(typeof formatted == "undefined") formatted = false;

	    var amt = 0;
	    var symbol = options.currencySymbol;
	    if(exists(options.components.amount) && $form.find(options.components.amount.selector).filter(':checked').length){
	        amt = $form.find(options.components.amount.selector).filter(':checked').val();
	    }

	    amt = parseFloat(amt.replace(/[^0-9.]/g,''));

	    if(isNaN(amt))
	        amt = 0;

	    if(exists(options.components.currency)) {
	        var currency = $form.find(options.components.currency.selector).val();
	        if(typeof currencySymbols[currency] !='undefined')
	            symbol = currencySymbols[currency];
	    }

	    if(formatted)
	        return symbol + amt.toString();
	    else
	        return amt;
	    
	}

	GRGivingSupport.prototype.setAmount = function(amt, currency) {
	    amt = amt.replace(/[^0-9\.]/g, '');

	    var ask = options.components.amount;
	    var other = options.components.other;

	    if(currency)
	        this.setCurrency(currency);

	    if(exists(ask) && setValue(ask, amt) == false) { //amount doesn't match any ask string value
	        setValue(ask,'other');
	    }
	    else if(exists(ask)) {
	        $form.find(ask.selector).trigger("change");
	        amt = "";
	    }
	    
	    if(exists(other)) {
	        setValue(other, amt);
	        $form.find(other.selector).trigger("change");
	    }
	    
	}



	GRGivingSupport.prototype.updateAskString = function() {

	    if(isActive(options.components.amount)) {
	        var index = getAskStringIndex();
	        if(!askStringIndex[index])
	            askStringIndex[index] = getAskString(index);

	        if(askStringIndex[index]) {
	            var $container = $('.'+options.askStringContainerClass);
	            if(!askStringIndex[index].buttons)
	                askStringIndex[index].buttons = getAskButtons(askStringIndex[index].amounts);
	            
	            $container.children().remove();
	            $container.append(askStringIndex[index].buttons);
	            
	            //Show the label for this group of fields
	            this.showLabel.call($container);
	        }
	        else
	            throw new Error('[GRGivingSupport] No ask string defined for: '+index.toString());
	    }
	}

	function getAskStringIndex() {
	    var index = [ ];
	    var currency, recurrence;
	    if(isActive(options.components.currency) && (currency = $form.find(options.components.currency.selector).val())){
	        index.push(currency);
	    }
	    else if(typeof options.components.currency.defaultVal !== "undefined"){
	        currency = options.components.currency.defaultVal;
	        index.push(currency);
	    }

	    if(isActive(options.components.recurrence) && (recurrence = $form.find(options.components.recurrence.selector+':checked').siblings('label:eq(0)').text().toLowerCase()))
	        index.push(recurrence);

	    if(index.length == 0)
	        return 'default';
	    else
	        return index.join('-');

	}

	GRGivingSupport.prototype.setComponent = function(component, value) {
	    if(isActive(options.components[component]) && setValue(options.components[component], value, true)) {
	        $form.find(options.components[component].selector).trigger('change');
	    }
	}

	GRGivingSupport.prototype.getComponent = function(component) {
	    var value = '';
	    if(isActive(options.components[component])) {
	        value = getValue(options.components[component]);
	    }
	    return value;
	}

	GRGivingSupport.prototype.getCurrency = function() {
	    return this.getComponent('currency');
	}

	GRGivingSupport.prototype.getProcessor = function() {
	    return this.getComponent('processor');
	}

	GRGivingSupport.prototype.getRegion = function() {
	    return this.getComponent('region');
	}

	GRGivingSupport.prototype.getRecurrence = function() {
	    return this.getComponent('recurrence');
	}

	GRGivingSupport.prototype.getCountry = function() {
	    return this.getComponent('country');
	}

	GRGivingSupport.prototype.setCountry = function(country) {
	    this.setComponent('country', country);
	}

	GRGivingSupport.prototype.setCurrencyByCountry = function(country) {
	    if(typeof currencyMap[country] != "undefined")
	        this.setCurrency(currencyMap[country]);
	}

	GRGivingSupport.prototype.setCurrency = function(currency) {
	    this.setComponent('currency', currency);
	}

	GRGivingSupport.prototype.setProcessor = function(processor) {
	    this.setComponent('processor', processor);
	}

	GRGivingSupport.prototype.setProcessorFields = function(fields) {
	    processorFields = fields;
	}

	GRGivingSupport.prototype.setRegion = function(region) {
	    this.setComponent('region', region);
	}

	GRGivingSupport.prototype.setRecurrence = function(recurrence) {
	    this.setComponent('recurrence', recurrence);
	}

	GRGivingSupport.prototype.isRecurring = function() {
	    if(isActive(options.components.recurrence))
	        return ($form.find(options.components.recurrence.selector).filter(':checked').val() == "Y");
	    return false;
	}

	/**
	 * buildAskString 
	 * @param Object|string should either be a selector of a source of ask string values per currency per recurrence
	 * or an object of the same
	 *      
	 */
	function getAskString(index) {    
	    var $askStringList = $(options.askStringSelector).find('ul.'+index);
	    if($askStringList.length) {
	        var amounts = [ ];
	        $askStringList.find('li').each(function() {
	            amounts.push($(this).text());
	        });
	    }
	    else
	        amounts = false;

	    return {amounts: amounts};
	}



	function getAskButtons(amounts) {
	    var selectorButtons = [ ];
	    // var $amount = $form.find(options.components.amount.selector);

	    if(typeof amounts != "undefined" && amounts) {
	        for(var i=0; i<amounts.length; i++) {
	            var choice = amounts[i];
	            selectorButtons.push(
	                grHelpers.createRadioComponent({
	                    name:  options.components.amount.name,
	                    label: choice,
	                    value: choice.replace(/[^0-9\.]/g,''),
	                    wrap:  "<div class='amountbutton'></div>",
	                    atts: (i==1 ? ['checked="checked"'] : '')
	                })
	            );
	        }
	    }
	    if(exists(options.components.other)) {
	        selectorButtons.push(
	            grHelpers.createRadioComponent({
	                name:  options.components.other.targetName,
	                label: $('<div>').append($form.find(options.components.other.selector).clone()).html(),
	                value: 'other',
	                wrap:  "<div class='amountbutton'></div>"
	            })
	        );
	    }
	    else if(isActive(options.components.other) && !exists(options.components.other)) {
	        var textInput = grHelpers.createTextComponent({
	            name: options.components.other.name, 
	            id: (options.components.other.name).replace(/[^a-zA-Z0-9\-\_]/g,'-'),
	            placeholder: (typeof options.components.other.label !== "undefined" ? options.components.other.label : '')
	        });
	        selectorButtons.push(
	            grHelpers.createRadioComponent({
	                name:  options.components.other.targetName,
	                label: $('<div>').append(textInput.clone()).html(),
	                value: 'other',
	                wrap:  "<div class='amountbutton'></div>"
	            })
	        );
	    }

	    return selectorButtons;
	}

	GRGivingSupport.prototype.buildRecurrenceSelector = function(opt) {
	    //check if isActive
	    if(isActive(options.components.recurrence)) {
	        var selectorButtons = [ ];
	        var $recurrence = $form.find(options.components.recurrence.selector);
	        for(var i=0; i<opt.length; i++) {
	            var choice = opt[i];
	            selectorButtons.push(
	                grHelpers.createRadioComponent({
	                    name: $recurrence.attr('name'),
	                    label: choice.label,
	                    value: choice.value,
	                    wrap: "<div class='radiobutton'></div>"
	                })
	            );
	        }

	        //get and show the label for this
	        this.showLabel.call($recurrence);

	        $recurrence.replaceWith(selectorButtons);

	    }
	}

	GRGivingSupport.prototype.showLabel = function(){
	    this.closest(".eaFormField")
	        .prev(".eaFormElementLabel")
	        .show();
	}

	module.exports = GRGivingSupport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * GRCurrencies module.
	 * 
	 * A list of country codes mapped to currency key->value pair
	 * 
	 */

	module.exports = {
	    "BD": "BDT",
	    "BE": "EUR",
	    "BF": "XOF",
	    "BG": "BGN",
	    "BA": "BAM",
	    "BB": "BBD",
	    "WF": "XPF",
	    "BL": "EUR",
	    "BM": "BMD",
	    "BN": "BND",
	    "BO": "BOB",
	    "BH": "BHD",
	    "BI": "BIF",
	    "BJ": "XOF",
	    "BT": "BTN",
	    "JM": "JMD",
	    "BV": "NOK",
	    "BW": "BWP",
	    "WS": "WST",
	    "BQ": "USD",
	    "BR": "BRL",
	    "BS": "BSD",
	    "JE": "GBP",
	    "BY": "BYR",
	    "BZ": "BZD",
	    "RU": "RUB",
	    "RW": "RWF",
	    "RS": "RSD",
	    "TL": "USD",
	    "RE": "EUR",
	    "TM": "TMT",
	    "TJ": "TJS",
	    "RO": "RON",
	    "TK": "NZD",
	    "GW": "XOF",
	    "GU": "USD",
	    "GT": "GTQ",
	    "GS": "GBP",
	    "GR": "EUR",
	    "GQ": "XAF",
	    "GP": "EUR",
	    "JP": "JPY",
	    "GY": "GYD",
	    "GG": "GBP",
	    "GF": "EUR",
	    "GE": "GEL",
	    "GD": "XCD",
	    "GB": "GBP",
	    "GA": "XAF",
	    "SV": "USD",
	    "GN": "GNF",
	    "GM": "GMD",
	    "GL": "DKK",
	    "GI": "GIP",
	    "GH": "GHS",
	    "OM": "OMR",
	    "TN": "TND",
	    "JO": "JOD",
	    "HR": "HRK",
	    "HT": "HTG",
	    "HU": "HUF",
	    "HK": "HKD",
	    "HN": "HNL",
	    "HM": "AUD",
	    "VE": "VEF",
	    "PR": "USD",
	    "PS": "ILS",
	    "PW": "USD",
	    "PT": "EUR",
	    "SJ": "NOK",
	    "PY": "PYG",
	    "IQ": "IQD",
	    "PA": "PAB",
	    "PF": "XPF",
	    "PG": "PGK",
	    "PE": "PEN",
	    "PK": "PKR",
	    "PH": "PHP",
	    "PN": "NZD",
	    "PL": "PLN",
	    "PM": "EUR",
	    "ZM": "ZMK",
	    "EH": "MAD",
	    "EE": "EUR",
	    "EG": "EGP",
	    "ZA": "ZAR",
	    "EC": "USD",
	    "IT": "EUR",
	    "VN": "VND",
	    "SB": "SBD",
	    "ET": "ETB",
	    "SO": "SOS",
	    "ZW": "ZWL",
	    "SA": "SAR",
	    "ES": "EUR",
	    "ER": "ERN",
	    "ME": "EUR",
	    "MD": "MDL",
	    "MG": "MGA",
	    "MF": "EUR",
	    "MA": "MAD",
	    "MC": "EUR",
	    "UZ": "UZS",
	    "MM": "MMK",
	    "ML": "XOF",
	    "MO": "MOP",
	    "MN": "MNT",
	    "MH": "USD",
	    "MK": "MKD",
	    "MU": "MUR",
	    "MT": "EUR",
	    "MW": "MWK",
	    "MV": "MVR",
	    "MQ": "EUR",
	    "MP": "USD",
	    "MS": "XCD",
	    "MR": "MRO",
	    "IM": "GBP",
	    "UG": "UGX",
	    "TZ": "TZS",
	    "MY": "MYR",
	    "MX": "MXN",
	    "IL": "ILS",
	    "FR": "EUR",
	    "IO": "USD",
	    "SH": "SHP",
	    "FI": "EUR",
	    "FJ": "FJD",
	    "FK": "FKP",
	    "FM": "USD",
	    "FO": "DKK",
	    "NI": "NIO",
	    "NL": "EUR",
	    "NO": "NOK",
	    "NA": "NAD",
	    "VU": "VUV",
	    "NC": "XPF",
	    "NE": "XOF",
	    "NF": "AUD",
	    "NG": "NGN",
	    "NZ": "NZD",
	    "NP": "NPR",
	    "NR": "AUD",
	    "NU": "NZD",
	    "CK": "NZD",
	    "XK": "EUR",
	    "CI": "XOF",
	    "CH": "CHF",
	    "CO": "COP",
	    "CN": "CNY",
	    "CM": "XAF",
	    "CL": "CLP",
	    "CC": "AUD",
	    "CA": "CAD",
	    "CG": "XAF",
	    "CF": "XAF",
	    "CD": "CDF",
	    "CZ": "CZK",
	    "CY": "EUR",
	    "CX": "AUD",
	    "CR": "CRC",
	    "CW": "ANG",
	    "CV": "CVE",
	    "CU": "CUP",
	    "SZ": "SZL",
	    "SY": "SYP",
	    "SX": "ANG",
	    "KG": "KGS",
	    "KE": "KES",
	    "SS": "SSP",
	    "SR": "SRD",
	    "KI": "AUD",
	    "KH": "KHR",
	    "KN": "XCD",
	    "KM": "KMF",
	    "ST": "STD",
	    "SK": "EUR",
	    "KR": "KRW",
	    "SI": "EUR",
	    "KP": "KPW",
	    "KW": "KWD",
	    "SN": "XOF",
	    "SM": "EUR",
	    "SL": "SLL",
	    "SC": "SCR",
	    "KZ": "KZT",
	    "KY": "KYD",
	    "SG": "SGD",
	    "SE": "SEK",
	    "SD": "SDG",
	    "DO": "DOP",
	    "DM": "XCD",
	    "DJ": "DJF",
	    "DK": "DKK",
	    "VG": "USD",
	    "DE": "EUR",
	    "YE": "YER",
	    "DZ": "DZD",
	    "US": "USD",
	    "UY": "UYU",
	    "YT": "EUR",
	    "UM": "USD",
	    "LB": "LBP",
	    "LC": "XCD",
	    "LA": "LAK",
	    "TV": "AUD",
	    "TW": "TWD",
	    "TT": "TTD",
	    "TR": "TRY",
	    "LK": "LKR",
	    "LI": "CHF",
	    "LV": "EUR",
	    "TO": "TOP",
	    "LT": "LTL",
	    "LU": "EUR",
	    "LR": "LRD",
	    "LS": "LSL",
	    "TH": "THB",
	    "TF": "EUR",
	    "TG": "XOF",
	    "TD": "XAF",
	    "TC": "USD",
	    "LY": "LYD",
	    "VA": "EUR",
	    "VC": "XCD",
	    "AE": "AED",
	    "AD": "EUR",
	    "AG": "XCD",
	    "AF": "AFN",
	    "AI": "XCD",
	    "VI": "USD",
	    "IS": "ISK",
	    "IR": "IRR",
	    "AM": "AMD",
	    "AL": "ALL",
	    "AO": "AOA",
	    "AQ": "",
	    "AS": "USD",
	    "AR": "ARS",
	    "AU": "AUD",
	    "AT": "EUR",
	    "AW": "AWG",
	    "IN": "INR",
	    "AX": "EUR",
	    "AZ": "AZN",
	    "IE": "EUR",
	    "ID": "IDR",
	    "UA": "UAH",
	    "QA": "QAR",
	    "MZ": "MZN"
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * GRCurrencySymbols module.
	 * 
	 * A list of single-character symbols for currencies that have them
	 * 
	 */

	module.exports = {
	    'USD': '$', // US Dollar
	    'CAD': '$', // Canadian Dollar
	    'AUD': '$', // Australian Dollar
	    'NZD': '$', // New Zealand Dollar
	    'EUR': '€', // Euro
	    'CRC': '₡', // Costa Rican Colón
	    'GBP': '£', // British Pound Sterling
	    'ILS': '₪', // Israeli New Sheqel
	    'INR': '₹', // Indian Rupee
	    'JPY': '¥', // Japanese Yen
	    'KRW': '₩', // South Korean Won
	    'NGN': '₦', // Nigerian Naira
	    'PHP': '₱', // Philippine Peso
	    'PLN': 'zł', // Polish Zloty
	    'PYG': '₲', // Paraguayan Guarani
	    'THB': '฿', // Thai Baht
	    'UAH': '₴', // Ukrainian Hryvnia
	    'VND': '₫', // Vietnamese Dong
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRHelpers module.
	 * 
	 * A list of static functions that are useful throughout our projects
	 * 
	 */

	function createSelectComponent(opts) {
	    if((missing = hasMissingOptions(opts, ['name', 'placeholder', 'options'])))
	        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

	    var html = '%label%<select name="%name%" %id% %class% %atts%>%placeholder%</select>'
	                .replace(/%label%/g, (opts.label ? '<label for="%id%">'+opts.label+'</label>' : ''))
	                .replace(/%name%/g, (opts.name ? opts.name : ''))
	                .replace(/%id%/g, (opts.id ? 'id="'+opts.id+'"' : 'id="'+opts.name.replace(/[^a-zA-Z0-9\-\_]/g, '-')+'"'))
	                .replace(/%placeholder%/g, (opts.placeholder ? '<option value="">'+opts.placeholder+'</option>' : '<option value="">'+opts.label+'</option>' ))
	                .replace(/%class%/g, (opts.classes ? 'class="'+opts.classes+'"' : ''))
	                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));
	                
	    var select;
	    if(typeof opts.wrap != "undefined")
	        select = $(opts.wrap).html(html);         
	    else
	        select = $(html);

	    for(var i=0; i<opts.options.length; i++) {
	        select.filter('select').append('<option value="'+opts.options[i].code+'">'+opts.options[i].name+'</option>')
	    }
	    return select;
	}

	function createRadioComponent(opts) {
	    if((missing = hasMissingOptions(opts, ['name', 'value', 'label'])))
	        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

	    var html = '<input type="radio" name="%name%" value="%value%" id="%id%" %class% %atts%/><label for="%id%">%label%</label>'
	                .replace(/%label%/g, (opts.label ? opts.label : ''))
	                .replace(/%name%/g, (opts.name ? opts.name : ''))
	                .replace(/%value%/g, (opts.value ? opts.value : ''))
	                .replace(/%id%/g, (opts.id ? opts.id : (opts.name+opts.value).replace(/[^a-zA-Z0-9\-\_]/g, '-')))
	                .replace(/%class%/g, (opts.classNames ? 'class="'+opts.classNames.join(' ')+'"' : ''))
	                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));

	    var radio;
	    if(typeof opts.wrap != "undefined")
	        radio = $(opts.wrap).html(html);         
	    else
	        radio = $(html);

	    return radio;
	}

	function createTextComponent(opts) {
	    if((missing = hasMissingOptions(opts, ['name'])))
	        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

	    var html = '%label%<input type="text" name="%name%" value="%value%" id="%id%" %placeholder% %class% %atts%/>'
	                .replace(/%label%/g, (opts.label ? '<label for="%id%">'+opts.label+'</label>' : ''))
	                .replace(/%name%/g, (opts.name ? opts.name : ''))
	                .replace(/%value%/g, (opts.value ? opts.value : ''))
	                .replace(/%id%/g,  (opts.id ? opts.id : opts.name.replace(/[^a-zA-Z0-9\-\_]/g, '-')))
	                .replace(/%placeholder%/g, (opts.placeholder ? 'placeholder="'+opts.placeholder+'"' : '' ))
	                .replace(/%class%/g, (opts.classNames ? 'class="'+opts.classNames.join(' ')+'"' : ''))
	                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));

	    var text;
	    if(typeof opts.wrap != "undefined")
	        text = $(opts.wrap).html(html);         
	    else
	        text = $(html);

	    return text;
	}

	function addURLParameter(url,name,value){
	    var val;
	    if(typeof url !== 'string'){
	        return false;
	    } else if (val = getAnyURLParameter(url,name)){
	        //new value is different than what came before
	        if( val !== value ){
	            var param = new RegExp(name+'='+'([^&;])');
	            return url.replace(param, name+'='+value);
	        } else {
	        //new value is the same as what came before
	            return;
	        }
	    } else if (url.indexOf("?") >= 0){
	        return url + "&" + name + "=" + value;
	    } else {
	        return url + "?" + name + "=" + value;
	    }
	}

	function getURLParameter(name) {
	    // return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	    return getAnyURLParameter(location.search,name);
	}

	function getAnyURLParameter(url,name){
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	/**
	 * hasMissingOptions
	 * @param {Object} options list of options
	 *
	 * @return array|false whether all necessary fields are provided in the options
	 */
	function hasMissingOptions(opts, req) {
	    var missingOptions = [ ];
	    for(var i = 0; i < req.length; i++) {
	        if(typeof opts[req[i]] === 'undefined') {
	            missingOptions.push(req[i]);
	        }
	    }
	    if(missingOptions.length) {
	        return missingOptions;
	    }
	    return false;
	}

	function ucFirst(str) {
	  //  discuss at: http://phpjs.org/functions/ucFirst/
	  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // bugfixed by: Onno Marsman
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  //   example 1: ucFirst('kevin van zonneveld');
	  //   returns 1: 'Kevin van zonneveld'

	  str += '';
	  var f = str.charAt(0)
	    .toUpperCase();
	  return f + str.substr(1);
	}


	module.exports = {
	    addURLParameter: addURLParameter,
	    createRadioComponent: createRadioComponent,
	    createSelectComponent: createSelectComponent,
	    createTextComponent: createTextComponent,
	    getURLParameter: getURLParameter,
	    getAnyURLParameter: getAnyURLParameter,
	    hasMissingOptions: hasMissingOptions,
	    ucFirst: ucFirst
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./GRRegions-CA": 12,
		"./GRRegions-CA.js": 12,
		"./GRRegions-US": 13,
		"./GRRegions-US.js": 13
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
	webpackContext.id = 11;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * GRRegions module.
	 * 
	 * A list of Canadian provinces
	 * 
	 */

	module.exports = {
	    name: "Province",
	    regions: [ 
	        {
	            "name":"Alberta",
	            "code":"AB"
	        },
	        {
	            "name":"British Columbia",
	            "code":"BC"
	        },
	        {
	            "name":"Manitoba", 
	            "code":"MB"
	        },
	        {
	            "name":"New Brunswick",
	            "code":"NB"
	        },
	        {
	            "name":"Newfoundland",
	            "code":"NL"
	        },
	        {
	            "name":"Northwest Territories",
	            "code":"NT"
	        },
	        {
	            "name":"Nova Scotia",
	            "code":"NS"
	        },
	        {
	            "name":"Nunavut",
	            "code":"NU"
	        },
	        {
	            "name":"Ontario",
	            "code":"ON"
	        },
	        {
	            "name":"Prince Edward Island",
	            "code":"PE"
	        },
	        {
	            "name":"Quebec",
	            "code":"QC"
	        },
	        {
	            "name":"Saskatchewan",
	            "code":"SK"
	        },
	        {
	            "name":"Yukon Territory",
	            "code":"YT"
	        }

	    ]
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * GRRegions module.
	 * 
	 * A list of US states
	 * 
	 */

	module.exports = {
	    name: "State",
	    regions: [ 
	        {
	            "name":"Alabama",
	            "code":"AL"
	        },
	        {
	            "name":"Alaska",
	            "code":"AK"
	        },
	        {
	            "name":"Arizona",
	            "code":"AZ"
	        },
	        {
	            "name":"Arkansas",
	            "code":"AR"
	        },
	        {
	            "name":"California",
	            "code":"CA"
	        },
	        {
	            "name":"Colorado",
	            "code":"NC"
	        },
	        {
	            "name":"Connecticut",
	            "code":"CT"
	        },
	        {
	            "name":"Delaware",
	            "code":"DE"
	        },
	        {
	            "name":"District of Columbia",
	            "code":"DC"
	        },
	        {
	            "name":"Florida",
	            "code":"FL"
	        },
	        {
	            "name":"Georgia",
	            "code":"GA"
	        },
	        {
	            "name":"Hawaii",
	            "code":"HI"
	        },
	        {
	            "name":"Idaho",
	            "code":"ID"
	        },
	        {
	            "name":"Illinois",
	            "code":"IL"
	        },
	        {
	            "name":"Indiana",
	            "code":"IN"
	        },
	        {
	            "name":"Iowa",
	            "code":"IA"
	        },
	        {
	            "name":"Kansas",
	            "code":"KS"
	        },
	        {
	            "name":"Kentucky",
	            "code":"KY"
	        },
	        {
	            "name":"Louisiana",
	            "code":"LA"
	        },
	        {
	            "name":"Maine",
	            "code":"ME"
	        },
	        {
	            "name":"Maryland",
	            "code":"MD"
	        },
	        {
	            "name":"Massachusetts",
	            "code":"MA"
	        },
	        {
	            "name":"Michigan",
	            "code":"MI"
	        },
	        {
	            "name":"Minnesota",
	            "code":"Mn"
	        },
	        {
	            "name":"Mississippi",
	            "code":"MS"
	        },
	        {
	            "name":"Missouri",
	            "code":"MO"
	        },
	        {
	            "name":"Montana",
	            "code":"MT"
	        },
	        {
	            "name":"Nebraska",
	            "code":"NE"
	        },
	        {
	            "name":"Nevada",
	            "code":"NV"
	        },
	        {
	            "name":"New Hampshire",
	            "code":"NH"
	        },
	        {
	            "name":"New Jersey",
	            "code":"NJ"
	        },
	        {
	            "name":"New Mexico",
	            "code":"NM"
	        },
	        {
	            "name":"New York",
	            "code":"NY"
	        },
	        {
	            "name":"North Carolina",
	            "code":"NC"
	        },
	        {
	            "name":"North Dakota",
	            "code":"ND"
	        },
	        {
	            "name":"Ohio",
	            "code":"OH"
	        },
	        {
	            "name":"Oklahoma",
	            "code":"OK"
	        },
	        {
	            "name":"Oregon",
	            "code":"OR"
	        },
	        {
	            "name":"Pennsylvania",
	            "code":"PA"
	        },
	        {
	            "name":"Rhode Island",
	            "code":"RI"
	        },
	        {
	            "name":"South Carolina",
	            "code":"SC"
	        },
	        {
	            "name":"South Dakota",
	            "code":"SD"
	        },
	        {
	            "name":"Tennessee",
	            "code":"TN"
	        },
	        {
	            "name":"Texas",
	            "code":"TX"
	        },
	        {
	            "name":"Utah",
	            "code":"UT"
	        },
	        {
	            "name":"Vermont",
	            "code":"VT"
	        },
	        {
	            "name":"Virginia",
	            "code":"VA"
	        },
	        {
	            "name":"Washington",
	            "code":"WA"
	        },
	        {
	            "name":"West Virginia",
	            "code":"WV"
	        },
	        {
	            "name":"Wisconsin",
	            "code":"WI"
	        },
	        {
	            "name":"Wyoming",
	            "code":"WY"
	        }

	    ]
	};

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRSocialize
	 *
	 * Note: For the Facebook Share Dialog, your app will need to use the same domain for the hosting page and the sharing link (which should be specified as the Site URL)
	 * 
	 */

	var defaults = {
	  'target': '.grsocial',
	  'newWindow': true,
	  'popupSpec': ",location=0,menubar=0,status=0,toolbar=0,left=50,top=50", //note the starting comma - this will be important when combining it with the network-specific specs below
	  'networks': {
	    }
	};

	var networks = {
	  'pinterest': {
	    name: 'Pinterest',
	    height: 333,
	    width: 783
	  },
	  'gplus': {
	    name: 'Google+',
	    height: 341,
	    width: 482
	  },
	  'facebook': {
	    name: 'Facebook',
	    height: 217,
	    width: 521
	  },
	  'twitter': {
	    name: 'Twitter',
	    height: 300,
	    width: 498
	  },
	  "linkedin": {
	    name:"LinkedIn",
	    width: 783,
	    height: 538
	  }
	}

	var requiredOptions = {};
	var protect = {};
	var self;

	function GRSocialize(options){
	  //step constructor
	  if(this.hasRequiredOptions(options)) {
	    this.options = $.extend(true, {}, defaults, options, protect);
	    this.networks = $.extend(true,{},networks,this.options.networks);
	    this.init();

	    self = this;
	  }  
	}

	/**
	 * ENBeautifier hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	GRSocialize.prototype.hasRequiredOptions = function(options, req) {
	    var missingOptions = [ ];
	    if(typeof req == "undefined") req = requiredOptions;
	    for(var i = 0; i < req.length; i++) {
	        if(typeof options[req[i]] === 'undefined') {
	            missingOptions.push(req[i]);
	        }
	    }
	    if(missingOptions.length) {
	        this.missingOptions = missingOptions;
	        return false;
	    }
	    return true;
	}

	/**
	 * Initialize GRSteps
	 * @return {[type]} [description]
	 */
	GRSocialize.prototype.init = function(){
	  //send clicks to handleClick
	  $(this.options.target)
	    .on("click","a",this.handleClick);

	  if(typeof this.options.facebook !== "undefined"){
	    this.facebookInit();
	  }

	}

	/**
	 * [facebookInit description]
	 * @return {[type]} [description]
	 */
	GRSocialize.prototype.facebookInit = function(){
	  var self = this;

	  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
	    FB.init({
	      appId: self.options.facebook.appID,
	      version: 'v2.3'
	    });

	    self.options.facebook.handler = function(url){
	      var clickEvent = this;

	      FB.ui({
	        method: 'share',
	        href: url
	      },
	      function(response){

	        if(
	          response && !response.error_code //submitted without error
	          && typeof self.options.onOpen !== "undefined"
	        ){
	          self.options.onOpen.call(clickEvent,'facebook','',url);
	        }
	      })

	      return;
	    }
	  });
	}

	/**
	 * [handleClick description]
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	GRSocialize.prototype.handleClick = function(e){
	  var $this = $(this);
	  var spec,
	    network,
	    networkClass;

	  e.preventDefault();

	  //loop through each registered network and assemble the right spec
	  $.each(self.networks,function(className,networkSpec){
	    if($this.hasClass(className)){
	      spec = "height="+networkSpec.height+",width="+networkSpec.width;
	      network = networkSpec.name;
	      networkClass = className
	      return false;
	    }
	  });

	  console.log(self.options.newWindow);

	  //quit if the specified network wasn't actually defined
	  if(
	    typeof spec === "undefined" 
	    || typeof network === "undefined"
	    ){
	    return;
	  }

	  e.preventDefault();

	  //get the target
	  var target = e.currentTarget.href;

	  //call any registered callbacks
	  if(typeof self.options.beforeOpen === "function"){
	    self.options.beforeOpen.call(this,network,spec,target);
	  }

	  //hand off to any network specific handlers, if they exist
	  if(
	    typeof self.options[networkClass] !== "undefined"
	    && typeof self.options[networkClass].handler !== "undefined"
	    ){
	    return self.options[networkClass].handler.call(this,target);
	  }

	  //open in new window if setting is true
	  if(self.options.newWindow){
	    window.open(target,'sharingIsCaring',spec);  
	  }
	  else{
	    window.location(target);
	  }

	  //call any registered callbacks
	  //NOTE: will only fire for open options that don't redirect the browser
	  if(typeof self.options.onOpen === "function"){
	    self.options.onOpen.call(this,network,spec,target);
	  }

	}

	module.exports = GRSocialize;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);