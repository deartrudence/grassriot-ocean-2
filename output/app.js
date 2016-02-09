webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, jQuery) {//Beautifier configuration
	var leftColumnSelector = '.js-left-column';
	var formSelector = '.form';
	var ENFormSelector = '.eaform';
	var formFieldContainerClass = 'js-form-field-container';
	var formFieldContainerIgnoreClass = 'is-selfHandling';
	var formFieldWrapperClass = 'js-form-field-wrapper';
	var footer = $('footer');
	var header = $('header');

	var $donationSummary = $('.js-donationSummary');
	var $donationSummaryRaw = $donationSummary.clone().removeClass('js-donationSummary').addClass('js-donationSummaryRaw hide');

	var ENBeautifier = __webpack_require__(3);
	var enbeautifier;

	// slick carousel slider
	// var slick = require('slick');

	//hero configuration
	var hero = ".js-hero";
	var heroImage = ".js-hero-image";
	var heroText = ".js-hero-text";
	var heroImageRatio = false;

	//cta configuration
	var cta = '.js-ctaAskTextWrapper';
	var ctaImage = '.js-ctaAskTextWrapper img';

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

	var GRAnalytics = __webpack_require__(13);
	var grAnalytics;

	var gr = __webpack_require__(4);

	var fields = gr.buildFieldNameObject({
	    title:      'Title', 
	    email:      'Primary_Email',
	    fname:      'First_Name',
	    mname:      'Middle_Name', 
	    lname:      'Last_Name',
	    street1:    'Addrline1',
	    street2:    'Addrline2',
	    city:       'City',
	    region:     'Province',
	    postal:     'Postal_Code',
	    country:    'Country',
	    phone:      'Home_Phone',
	    pay_type:   'Payment Type',
	    cardholder: 'Card Holder Name',
	    cc_num:     'Credit Card Number',
	    cc_cvv:     'CVV Code',
	    cc_exp:     'Credit Card Expiration',
	    amt:        'Donation Amount',
	    currency:   'Currency',
	    recur_pay:  'Recurring Payment',
	    recur_freq: 'Recurring Frequency',
	    recur_day:  'Recurring Day',
	    optin:      'Opt-In_English',
	    restrict:   'Direct Gift',
	    comments:   'Additional Comments',
	    /*giftaid:    'Gift Aid',
	    ref_camp_id:'Referring Campaign Id',
	    matching:   'Matching Gift', */
	    from_org:   'Company Gift',
	    org_fname:  'Contact Persons Name',
	    org_lname:  'Contact Last Name',
	    org_email:  'Other Email',
	    employer:   'Organization Name',
	    inmem:      'In Memoriam',
	    inmem_inhon: 'In honour or in memoriam',
	    inmem_name:     'Memoriam Name',
	    inmem_msg:      'Memoriam Message',
	    inmem_from:     'Memoriam Sender',
	    inhonor:        'Tribute Options',
	    inhonor_name:   'Honoree Name',
	    inhonor_occ:    'Occasion',
	    inhonor_msg:    'Honoree Message',
	    inhonor_from:   'Honoree Signature',
	    inform:         'Recognize Gift',
	    inform_recip:    'Inform Name',
	    inform_street1:  'Inform Address 1',
	    inform_street2:  'Inform Address 2',
	    inform_city:     'Inform City',
	    inform_region:   'Inform Region',
	    inform_postal:   'Inform Postcode',
	    inform_country:  'Inform Country',
	    sec_street1:    'Other Addrline1',
	    sec_street2:    'Other Addrline2',
	    sec_city:       'Other City',
	    sec_region:     'Other Province',
	    sec_postal:     'Other Postal_Code',
	    sec_country:    'Other Country',
	    sec_billing:    'Use as billing address',
	    sec_addrtype:   'Other Address Type',
	    addrtype:       'Addr_Type'
	});

	var fieldsToSwap = {
	  fname:   'org_fname',
	  lname:   'org_lname',
	  email:   'org_email',
	  street1: 'sec_street1',
	  street2: 'sec_street2',
	  city:    'sec_city',
	  region:  'sec_region', 
	  postal:  'sec_postal', 
	  country: 'sec_country',
	  addrtype:'sec_addrtype'
	};

	//Key:Value :: Target:Content
	var ENBeautifierFillers = {
	  ".js-page-header": ".js-languageToggle", 
	  ".js-hero": ".js-heroContent",
	  ".js-campaign": ".js-campaignText",
	  ".js-impact": ".js-impactText",
	  ".js-cta-ask": ".js-ctaAskText",
	  ".js-other-ways": ".js-otherWaysToGive", 
	  ".js-response": ".js-responseText",
	  ".js-accountable": ".js-accountableText",
	  ".js-gift": ".js-giftText",
	  ".js-policy": ".js-policyText",
	  '.js-formOpen-label': '.js-formOpen-labelText'
	};
	var ENBeautifierFillersContainers = {
	  '#gr_donation': [
	    '.js-formHeader',
	    '#'+fields.recur_pay.nameNoSpace+'Div', 
	    '#'+fields.amt.nameNoSpace+'Div',
	  ],
	  '#gr_details': [
	    '.js-donorInformation', 
	    '#'+fields.fname.nameNoSpace+'Div', 
	    '#'+fields.lname.nameNoSpace+'Div', 
	    '#'+fields.email.nameNoSpace+'Div', 
	    '#'+fields.street1.nameNoSpace+'Div', 
	    '#'+fields.street2.nameNoSpace+'Div', 
	    '#'+fields.city.nameNoSpace+'Div',
	    '#'+fields.postal.nameNoSpace+'Div', 
	    '#'+fields.country.nameNoSpace+'Div', 
	    '#'+fields.region.nameNoSpace+'Div', 
	    '#'+fields.phone.nameNoSpace+'Div',
	    '#'+fields.optin.nameNoSpace+'Div'
	  ],
	  '#gr_options': [
	    '#'+fields.restrict.nameNoSpace+'Div',
	    '.js-donationOptions',
	    '#'+fields.from_org.nameNoSpace+'Div',
	    '#'+fields.inmem_inhon.nameNoSpace+'Div',
	    '#'+fields.inmem.nameNoSpace+'Div',
	    '#'+fields.inhonor.nameNoSpace+'Div'
	  ],
	  '#gr_inmem': [
	    '.js-honourMemorialInformation', 
	    //'#'+fields.inmem_type.nameNoSpace+'Div', 
	    '#'+fields.inmem_name.nameNoSpace+'Div', 
	    '#'+fields.inhonor_name.nameNoSpace+'Div', 
	    '#'+fields.inhonor_occ.nameNoSpace+'Div',
	    '#'+fields.inform.nameNoSpace+'Div',
	    '#'+fields.inform_recip.nameNoSpace+'Div', 
	    '#'+fields.inform_street1.nameNoSpace+'Div', 
	    '#'+fields.inform_street2.nameNoSpace+'Div', 
	    '#'+fields.inform_city.nameNoSpace+'Div', 
	    '#'+fields.inform_postal.nameNoSpace+'Div',
	    '#'+fields.inform_country.nameNoSpace+'Div',
	    '#'+fields.inform_region.nameNoSpace+'Div',
	    '#'+fields.inmem_msg.nameNoSpace+'Div', 
	    '#'+fields.inhonor_msg.nameNoSpace+'Div',
	    '#'+fields.inmem_from.nameNoSpace+'Div', 
	    '#'+fields.inhonor_from.nameNoSpace+'Div'
	  ],
	  '#gr_company': [
	    '.js-companyInformation',
	    '#'+fields.employer.nameNoSpace+'Div',
	    '#'+fields.org_fname.nameNoSpace+'Div',
	    '#'+fields.org_lname.nameNoSpace+'Div',
	    '#'+fields.org_email.nameNoSpace+'Div',
	    '#'+fields.sec_street1.nameNoSpace+'Div', 
	    '#'+fields.sec_street2.nameNoSpace+'Div', 
	    '#'+fields.sec_city.nameNoSpace+'Div',
	    '#'+fields.sec_postal.nameNoSpace+'Div', 
	    '#'+fields.sec_country.nameNoSpace+'Div', 
	    '#'+fields.sec_region.nameNoSpace+'Div', 
	    '#'+fields.sec_billing.nameNoSpace+'Div',
	  ],
	  '#gr_payment': [
	    '.js-paymentInformation', 
	    '#'+fields.pay_type.nameNoSpace+'Div', 
	    //'#CC_ImagesDiv', 
	    '#'+fields.cardholder.nameNoSpace+'Div', 
	    '#'+fields.cc_num.nameNoSpace+'Div', 
	    '#'+fields.cc_cvv.nameNoSpace+'Div', 
	    '#'+fields.cc_exp.nameNoSpace+'Div',
	    '.js-donationSummary',
	    '.js-instructionsAndComment',
	    '#'+fields.comments.nameNoSpace+'Div'
	  ],
	};

	var GRaygun = __webpack_require__(16);
	var raygunFilterFields = ['password', 'credit_card', fields.cc_num.name, fields.cc_cvv.name];
	var graygunner = new GRaygun({filter: raygunFilterFields});

	var $ = __webpack_require__(1);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);

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
	        //handleCountryChange({target: fields.country.selector});
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

	  //redirect older browsers
	  var browser = __webpack_require__(21);
	  if(
	    (browser.firefox && parseFloat(browser.version) < 9)
	    || (browser.chrome && parseFloat(browser.version) < 16)
	    ){
	    var backupForm = backupForm ? backupForm : "";
	    window.location = backupForm;
	  }


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
	        //setupCounter();    
	    }

		//do everything else
		modernize();
	    
	    function handleSizing(){
	        getBrowserSize();
	        makeAffix();
	    }

	    handleSizing();
	    $(window).on("resize",handleSizing);

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
	        if(typeof errors.each === "function"){
	          errors.each(function() {
	              error_text += $(this).text();
	          });
	        }
	        else{
	          error_text = errors;
	        }

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
	    var $container = $(".donation-form-wrapper");
	    //$(window).off(".affix");
	    $affixForm.off('affix.bs.affix');
	    $affixForm
	        .removeClass("no-affix affix affix-top affix-bottom")
	        .removeData("bs.affix");

	    if (windowSize !== "phone" && windowSize !== "mobile" && windowSize !== "tablet") {
	        if($(window).height() >  getFormHeight($affixForm)) {
	            setContainerOffset($affixForm, $container);
	            $affixForm
	                // .filter(":not(.affix-top, .affix, .affix-bottom)")
	                .affix({
	                    offset: {
	                        top: 0,
	                        //bottom: 0
	                    }
	                });
	            $("#grdonation").css('height','');
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

	function setContainerOffset($affixForm, $container) {
	    $affixForm.css('right', (Math.round($(window).width()) - Math.round($container.offset().left) - $container.outerWidth() + 1).toString() + 'px'); //(parseInt($container.css('margin-right')) + parseInt($container.css('padding-right'))).toString() + 'px');
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
	 * [setupCounter description]
	 * @return {[type]} [description]
	 */
	/*function setupCounter(){
	  var refresh = 1200;
	  var scroll = 2000;
	  var maxstep = 30;
	  var currentCount = 0;
	  var currentTotal = 0;
	  var tickerCount = 0;
	  var startingValue = 0;
	  var offset; 
	  var currentCountSet = false;
	  var isStarted = false;
	  var isPaused = false;
	  var $counter = $(".js-seconds-counter");
	  var oldAdditional = 0;
	  var newAdditional = 0;
	  var ticker;
	  var refreshInterval;
	  var refresher;
	  var contentClass;
	  //corresponds to set amounts at 30 seconds per 250$
	  //TODO: Set these based on the actual donation ranges
	  // var timeAmounts = [1,1,1,4,4,4,10,10,10,10,10,15,15,15,20]; 

	  // require('jqueryeasing');
	  // require('ticker');

	  var version = gr.getURLParameter('s');
	  var variant = gr.getURLParameter('v');

	  switch(version){
	    case "1843":      
	      startingValue = 1843;
	      contentClass = "doc";
	      break;
	    case "2105":
	      startingValue = 2105;
	      contentClass = "sea";
	      break;
	    case "586":
	      startingValue = 586;
	      contentClass = "delivery";
	      break;    
	    default:
	      startingValue = 1843;
	      contentClass = "doc";
	      break;
	  }
	  
	  $(".js-content-version").addClass(contentClass);

	  //set offset
	  if(typeof window.offset === "undefined"){
	    window.offset = 0;
	  }

	  updatecount(startingValue);*/
		
	  /**
	   * [updatecount description]
	   * @param  {[type]} count [description]
	   * @return {[type]}       [description]
	   */
	  /*function updatecount(count){

	    if(typeof count !== 'undefined'){
	      currentTotal = parseInt(count) + parseInt(window.offset);      
	    }

	    //if(currentCount == 0 && currentTotal != 0){
	    if(!currentCountSet){
	      // currentCount = Math.floor(currentTotal * 0.2) < 500 ? currentTotal - Math.floor(currentTotal * 0.2) : currentTotal - 500;
	      currentCount = currentTotal;
	      currentCountSet = true;
	      showCount();
	    }

	    // var randLimit = currentTotal - currentCount < 2 ? currentTotal - currentCount : 2;
	    // currentCount += timeAmounts[Math.floor(Math.random() * timeAmounts.length)];

	    if(typeof variant !== "undefined" && variant === "countdown"){
	      if(currentCount > 100){
	        currentCount -= 1;
	      }
	    }
	    else {
	      currentCount += 1;  
	    }

	    if(!isStarted){
	      isStarted = true;
	      setCounter();
	    }
	  }*/

	  /**
	   * [gettotal description]
	   * Not used in this
	   * 
	   * @return {[type]} [description]
	   */
	  // function gettotal(){

	  //   // currentTotal += timeAmounts[Math.floor(Math.random()*timeAmounts.length)];
	  //   if(typeof variant !== "undefined" && variant === "countdown"){
	  //     currentTotal -= 1;
	  //   }
	  //   else {
	  //     currentTotal += 1;  
	  //   }
	    
	  //   updatecount(currentTotal);
	  // }

	  /**
	   * [setStartCount description]
	   */
	  /*function setStartCount(){
	    currentTotal = $counter.html().replace(',', '');
	    
	    if(currentCount == 0){
	      currentCount = Math.floor(currentTotal * 0.2) < 500 ? currentTotal - Math.floor(currentTotal * 0.2) : currentTotal - 500;
	    } 
	    // var orig = counter.html().replace(',', '');
	  }*/

	  /**
	   * [addCommas description]
	   * @param {[type]} nStr [description]
	   */
	  /*function addCommas(nStr){
	    nStr += '';
	    var x = nStr.split('.');
	    var x1 = x[0];
	    var x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    return x1 + x2;
	  }

	  function doRefresh(){
	    if(isPaused) return;

	    updatecount();
	    showCount();

	    //set refresh interval to between 2 and 4 seconds
	    // refresh = (Math.floor(Math.random() * 2) + 2) * 1000;
	    // refresher = window.setTimeout(doRefresh,refresh);
	  }*/

	  /**
	   * [setCounter description]
	   */
	  /*function setCounter() {
	    setStartCount();
	    // setTimeout( doRefresh, refresh );
	    setInterval(doRefresh, refresh);

	    // ticker = $counter.ticker({
	    //   delay:  1000,
	    //   separators: true,
	    //   incremental: function(){
	    //     return currentCount;
	    //     // if(tickerCount == 0){
	    //     //   tickerCount = currentCount;
	    //     // }else if(tickerCount < currentCount){
	    //     //   tickerCount++;
	    //     // }
	    //     // return tickerCount;
	    //   }
	    // });
	  }*/

	  /**
	   * [showCount description]
	   * @return {[type]} [description]
	   */
	  /*function showCount(){
	    $counter.html(currentCount);
	  }*/

	  /**
	   * [getSecondsAdded description]
	   * @return {[type]} [description]
	   */
	  /*function getSecondsAdded(){
	    //get the dollar amount difference
	    newAdditional = grGiving.getAmount();
	    var diff = newAdditional - oldAdditional;

	    //convert to a time difference
	    diff = Math.floor(diff/100 * 60);
	    
	    //Add the offset to the counter
	    currentCount += diff;

	    //save our new value
	    oldAdditional = newAdditional;


	    showCount();

	    //force a refresh
	    //Set refresh delay to zero to improve response time
	    // var normalRefresh = ticker[0].options.delay;
	    // ticker[0].options.delay = 0;
	    // ticker[0].update_container();
	    // ticker[0].options.delay = normalRefresh;
	  }

	  function pauseTicker(){
	    isPaused = true;
	  }

	  function unpauseTicker(){
	    isPaused = false;
	    doRefresh();
	  }

	  getSecondsAdded();
	  $("#Donation_AmountField")
	    .on("change",getSecondsAdded);
	    // .on("mouseenter",pauseTicker)
	    // .on("mouseleave",unpauseTicker);

	}*/

	/**
	 * [setupAction description]
	 * @return {[type]} [description]
	 */
	function setupAction(){

		try{
	        $(hero).css('background-image', 'url('+$(heroImage).attr('src')+')');
	        $(cta).css('background-image', 'url('+$(ctaImage).attr('src')+')');
	        if ( $('#slider #slides').length ) {
	          $('#slider #slides').cycle({
	            next: $('#slider .nav .next'),
	            prev: $('#slider .nav .prev'),
	            slides: $('#slides > li'),
	            timeout: 5000,
	            pager: '#pager',
	            pagerActiveClass: 'activeSlide',
	            pagerTemplate: '<a href="#" class="dot"></a>',
	            pauseOnHover: true
	          });
	        }

	        //Swap fields on post-back - this moves the 
	        if(
	          typeof fields.sec_billing != "undefined"
	          && $(fields.sec_billing.selector).length 
	          && $(fields.sec_billing.selector).is(":checked")) {
	          swapFields();
	        }

	        enbeautifier.addClasses(getFormClasses());

	        $("#"+fields.cc_exp.nameNoSpace+"Div").html( function(i,h) { 
	                    return h.replace(/&nbsp;/g,'');
	                });

	    	  //Set up panel steps
	        formSteps = new GRSteps({
	          activeClass: 'active',
	          useCSSAnimation: false,
	          indicatorTarget: '.steps-list ul',
	          steps: $("#gr_donation,#gr_details,#gr_options,#gr_inmem,#gr_company,#gr_payment"),
	          stepLabels: ['Amount', 'Billing', 'Options', '', '', 'Payment'],
	          addButtons: true,
	          target: "#window",
	          stepPreSwitchCallback: [
	            null,
	            null,
	            null,
	            null,
	            null,
	            buildDonationSummary
	          ],
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
	              $("#gr_options").find("input,select,textarea").valid();
	              if(formErrors.length) {
	                handleErrors(formErrors);
	                return false;
	              } else {
	                grAnalytics.analyticsReport( 'payment/page3-complete' );
	                return true;
	              }
	            },
	            //step 4 handler
	            function(){
	              formErrors = [ ];
	              $("#gr_inmem").find("input,select,textarea").valid();
	              if(formErrors.length) {
	                handleErrors(formErrors);
	                return false;
	              } else {
	                grAnalytics.analyticsReport( 'payment/page4-complete' );
	                return true;
	              }
	            },
	            //step 5 handler
	            function(){
	              formErrors = [ ];
	              $("#gr_company").find("input,select,textarea").valid();
	              if(formErrors.length) {
	                handleErrors(formErrors);
	                return false;
	              } else {
	                grAnalytics.analyticsReport( 'payment/page5-complete' );
	                return true;
	              }
	            },
	            //step 6 handler
	            function(){
	              formErrors = [ ];
	              //let the stepper handle any errors
	              if( !$("#gr_payment").find("input,select,textarea").valid() ){
	                handleErrors(formErrors);
	                return false;
	              } 
	              //If there are no errors, send the form
	              else {
	                if(
	                  typeof fields.sec_billing != "undefined"
	                  && $(fields.sec_billing.selector).length 
	                  && $(fields.sec_billing.selector).is(":checked")) {
	                  swapFields();
	                }
	                $form.submit();
	              }

	            }
	          ]
	        });

	        // Setup Campaign Page
	        grGiving = new GRGivingSupport({
	            form: $form,
	            components: {
	                /*country: {
	                    selector: fields.country.selector,
	                    urlParam: 'country',
	                    defaultVal: 'US'
	                },
	                region: {
	                    selector: fields.region.selector
	                },*/
	                currency: {
	                    // selector: '[name="Payment Currency"]:not(a)',
	                    urlParam: 'curr',
	                    defaultVal: 'CAD'
	                },
	                recurrence: {
	                    selector: fields.recur_pay.selector,
	                    defaultVal: ''
	                },
	                amount: {
	                    selector: fields.amt.selector,
	                    urlParam: 'amt',
	                    name: fields.amt.name
	                },
	                other: {
	                    selector: '[name="Donation Amount Other"][type="text"]:not(a)',
	                    name: 'Donation Amount Other',
	                    targetName: fields.amt.name,
	                    label: 'Other amount'
	                },
	                processor: {
	                    selector: fields.pay_type.selector,
	                }
	            },
	            //activeRegionLists: ['CA'], //disabling since Ecojustice already has a dropdown for region that includes US and CA options
	            askStringSelector: '#donation-ranges',
	            askStringContainerClass: 'levels',
	            recurrenceOptions: [
	                {label: 'One-time Donation', 'value': ''},
	                {label: 'Give monthly', 'value': 'Y'}
	            ],
	            processorFields: { 
	                'PayPal': {
	                    hide: ['#'+fields.cardholder.nameNoSpace+'Div','#'+fields.cc_num.nameNoSpace+'Div', '#'+fields.cc_cvv.nameNoSpace+'Div', '#'+fields.cc_exp.nameNoSpace+'Field']
	                },
	                'Visa': {
	                    show: ['#'+fields.cardholder.nameNoSpace+'Div','#'+fields.cc_num.nameNoSpace+'Div', '#'+fields.cc_cvv.nameNoSpace+'Div', '#'+fields.cc_exp.nameNoSpace+'Field']
	                },
	                'MasterCard': {
	                    show: ['#'+fields.cardholder.nameNoSpace+'Div','#'+fields.cc_num.nameNoSpace+'Div', '#'+fields.cc_cvv.nameNoSpace+'Div', '#'+fields.cc_exp.nameNoSpace+'Field']
	                },
	                'AMEX': {
	                    show: ['#'+fields.cardholder.nameNoSpace+'Div','#'+fields.cc_num.nameNoSpace+'Div', '#'+fields.cc_cvv.nameNoSpace+'Div', '#'+fields.cc_exp.nameNoSpace+'Field']
	                }

	            }

	        });

	        //change the submit button when the amount changes
	        $submit = $("#gr_payment").find(".btn-next").addClass("button-submit");    
	        $form
	          .on(
	            'change',
	            'input[name="'+fields.amt.name+'"], input[name="Donation Amount Other"], input[name="'+fields.recur_pay.name+'"]',
	            function(e) {
	                $submit.text("Donate " + grGiving.getAmount(true) + (grGiving.isRecurring() ? ' Monthly' : ''));
	            })
	          /*.on(
	            'change',
	            fields.country.selector,
	            handleCountryChange)*/
	          .on('submit', sendDonation);
	        $form.find(fields.amt.selector).trigger('change');

	        //add name to submit button for EN
	        $submit.attr("name", "submitter");
	        
	        //Remove the original donate input
	        //TODO: integrate this in to the actual form code
	        $('input[name="'+fields.amt.name+'"][type="text"]').remove();


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

	    setupDonationOptions();

			setupMobileButton();

	    //if the video is requested, show it
	    
	    /*require.ensure([],function(require){
	      var browser = require("bowser");

	      if(gr.getURLParameter("showVideo") === "true"){

	        var $video = $(".js-hero-video");
	        if($video.length){

	          var $container = $video.parent();
	          $container.addClass("is-videoPlaceholder");
	          $container.find(".heroTitle").prepend('<span class="glyphicon glyphicon-play"></span><br />');
	          var videoURL = $video.text();

	          $container.on("click",function(e){

	            //for iOS 7 and older, treat the video as a link rather than an embed location
	            if(browser.ios && browser.version <= 7){
	              window.location = videoURL;
	            }

	            //for browsers that can handle embedded video, do it!
	            else{
	              $video
	                .html("<iframe src='"+videoURL+"?wmode=opaque&enablejsapi=1&autoplay=1' frameborder='0' allowfullscreen></iframe>")
	                .removeClass("hidden");

	              $container.addClass("is-videoContainer");
	              $(".page-header").hide();
	            }
	          });

	        }
	        
	      }
	    })*/
		} catch(error) {
			graygunner.sendError(error);
		}
	}

	function setupDonationOptions() {

	  $donationSummary.after($donationSummaryRaw);

	  $form.on('click', '.js-toggleComments', function(e) {
	    e.preventDefault();
	    $('#'+fields.comments.nameNoSpace+'Div').slideToggle();
	  });
	  if($(fields.comments.selector).val() != '') {
	    $('.js-toggleComments').click();
	  }

	  $(fields.inmem.selector).data('deselect',fields.inhonor.selector);
	  $(fields.inhonor.selector).data('deselect',fields.inmem.selector);

	  if($(fields.inmem.selector+','+fields.inhonor.selector).filter(':checked').length == 0) {
	    $(fields.inmem.selector).prop('checked',true).change();
	  }

	  //show/hide optional steps based on user selections
	  $form.on('change', fields.inmem_inhon.selector, function(e) {
	    if($(this).is(":checked")) {
	        formSteps.showStep(3);
	        $(fields.inmem.selector+','+fields.inhonor.selector).closest('.'+formFieldContainerClass).show();
	    } else {
	        formSteps.hideStep(3);
	        $(fields.inmem.selector+','+fields.inhonor.selector).prop('checked', false).closest('.'+formFieldContainerClass).hide();
	        $('.js-honourGift,.js-memorialGift').hide();
	    }
	  });
	  $form.on('change', fields.from_org.selector, function(e) {
	    if($(this).is(":checked")) {
	        formSteps.showStep(4);
	        $('.js-personalGift').hide();
	        $('.js-orgGift').show();
	    } else {
	        formSteps.hideStep(4);
	        $('.js-orgGift').hide();
	        $('.js-personalGift').show();
	    }
	  });

	  //

	  $form.on('change', fields.inmem.selector+","+fields.inhonor.selector, function(e) {
	      switch($(this).attr('name')) {
	          case fields.inmem.name:
	              $('.js-memorialGift').show();
	              $('.js-honourGift').hide();

	          break;
	          case fields.inhonor.name:
	              $('.js-memorialGift').hide();
	              $('.js-honourGift').show();
	          break;
	      }

	      if($(this).is(':checked')) {
	          $($(this).data('deselect')).prop("checked", false);
	      }
	  });

	  $form.on('change', fields.inform.selector+":checked", function() {
	    switch($(this).filter(':checked').val()) {
	      case 'mail':
	        $('.js-informMail').removeClass('hide');
	      break;

	      case 'no': 
	        $('.js-informMail').addClass('hide');
	      break;
	    }

	  });
	  $form.find(fields.inmem_inhon.selector+','+fields.from_org.selector).trigger('change');
	  $form.find(fields.inmem.selector+','+fields.inhonor.selector+','+fields.inform.selector).filter(':checked').trigger('change');
	}

	/**
	 * Swaps the values of a set of fields to another.  The fieldsToSwap is an Object with only key/value pairs where the keys are one field indentifier and the values are the other field identifier [both strings].
	 */
	function swapFields() {
	  var field1Value;

	  for(var field1 in fieldsToSwap) {
	    field2 = fieldsToSwap[field1];
	    if(
	      typeof fields[field2] != "undefined"
	      && typeof fields[field1]!= "undefined"
	      && $(fields[field2].selector).length
	      && $(fields[field1].selector).length
	    ) {
	      field1Value = $form.find(fields[field1].selector).eq(0).val();
	      $form.find(fields[field1].selector).eq(0).val($form.find(fields[field2].selector).eq(0).val());
	      $form.find(fields[field2].selector).eq(0).val(field1Value);
	    }
	  }
	}

	function handleCountryChange(e){
	    var countryField = $(e.target);
	    var countryCode = countryField.val();
	    var regionField = $form.find(fields.region.selector);
	    var countriesRequiringRegion = ['US'];

	    /*if(countryCode == 'CA'){
	        $form.find(fields.postal.selector).rules("add","isPostcodeCA");
	    }
	    else{
	       $form.find(fields.postal.selector).rules("remove","isPostcodeCA");
	    }*/

	    if(countriesRequiringRegion.indexOf(countryCode) !== -1){
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
	        console.log(hero, heroImage);
	        $(hero).css('background-image', 'url('+$(heroImage).attr('src')+')');


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
	                
	        var section = gr.getURLParameter('s');
	        grAnalytics.analyticsReport('action-complete/'+$('input[name="ea.campaign.id"]').val()+ (section ? '/' + section : ''))
	        //Ecommerce not installed on client's analytics
	        // grAnalytics.eCommerceReport(transactionData, itemData);


	        //init social links
	        //Most be above moveToTargets so we can get all the text before it's moved
	        socialbuttons = new GRSocialize({
	            source: ".social",
	            target: ".share-block",
	            newWindow: true,
	            onOpen: function(network, spec, target){
	                grAnalytics.analyticsReport('share/'+network);
	            }
	        });

	        enbeautifier.moveToTargets({
	          '.js-campaign': '.sharingSection-title',
	          '.js-campaign': '.eaFullWidthColumnContent',
	          '.js-campaign': '.eaLeftColumnContent',
	          // '.js-campaign': '.social-block',
	          '.share-block .twitter-text': ['.social .twitter .text', '.social .twitter .img'],
	          '.share-block .mail-subject': '.social .mail .subject',
	          '.share-block .mail-body': '.social .mail .body',
	          '.page-header': '.js-postaction-heroText'
	        });


	        //setup facebook share pieces from specific content or the meta tags
	        ['title', 'description', 'image'].forEach(function(element) {
	          var content = $('.social .facebook .'+element).length
	            ? $('.social .facebook .'+element).text()
	            : $('meta[property="og:'+element+'"]').attr('content');
	          if(element=='image') {
	            $('.share-block .facebook-'+element).css('background-image','url('+content+')');
	          } else {
	          $('.share-block .facebook-'+element).text(content);
	          }
	        });

	        var section = gr.getURLParameter('s');
	        grAnalytics.analyticsReport('action-complete/'+$(formSelector).find('input[name="ea.campaign.id"]').val()+ (section ? '/' + section : ''))
	        $('.main').addClass('post-action');
	        $('#gr_giving').show();//.addClass('content-wrap');
	        $('.js-left-column header').prependTo('.container');
	        
	        //include containers for these
	        enbeautifier.moveToTargets({
	          'header .wrap': leftColumnSelector+' > div:first .text-block',
	          'header': leftColumnSelector+' > div:first .subtext-block'
	        }, true); 

	        $('.page-header').css('background-image', 'url('+$(".js-postaction-heroBg").attr('src')+')');
	    } catch(error) {
	        graygunner.sendError(error);
	    }

	}

	function buildDonationSummary() {
	  $donationSummary.html($donationSummaryRaw.html());
	  gr.replaceENTemplateTags($form, $donationSummary,fields,{start: "`", end: "`"});
	  $donationSummary.find('.js-amount').text(grGiving.getAmount(true));

	  if(grGiving.isRecurring()) {
	    $donationSummary.find('.js-frequency').text(' monthly');
	  } else {
	    $donationSummary.find('.js-frequency').text('');
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
	    if(
	        !grGiving.isRecurring()
	        && grupsell.exists
	    ){
	        var upsellLaunched = grupsell.launch();

	      if(!upsellLaunched){
	        $form.submit();
	      }
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

	//Get the active section for analytics reporting
	function analyticsGetSection(container) {
		var currentSection = null;
		$(container).children().each(function() {
			if($(window).scrollTop() > $(this).offset().top)
				currentSection = $(this).attr("data-section");
		});
		return currentSection;
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
	                invalidPcode: 'Please enter a valid postcode',
	                invalidPhone: 'Please specify a valid phone number'
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
	                && parseInt(value, 10) > 0
	                && parseInt(value, 10) <= 12;
	        }, errorMessages.invalidMonth);

	        $.validator.addMethod('isNowOrFutureYear', function (value, element) {
	            var year = '';
	            value = value.replace('/','');
	            if(value.length >= 4){
	                year = parseInt(value, 10);
	            }
	            else if(value.length == 2){
	                year = parseInt('20'+value, 10);
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
	                .find("#"+fields.cc_exp.nameNoSpace+"1")
	                .val();

	            value = value.replace('/','');

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
	            var regexCVV = /^\d{3,4}$/;
	            return regexCVV.test(value);
	        }, errorMessages.invalidCVV);

	        $.validator.addMethod('isPhone', function (value, element) {
	            phone_number = phone_number.replace( /\s+/g, "" );
	            return this.optional( element ) || phone_number.length > 9 &&
	            phone_number.match( /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/ );
	        }, errorMessages.invalidPhone);

	        $.validator.addMethod("notEqual", function (value, element, param) {
	          return this.optional(element) || value !== param;
	        }, jQuery.validator.format("{0} is required."));

	        $.validator.addMethod('isPostcodeCA', function (value, element, param) {
	            if(param) {
	              value = $.trim(value);
	              $(element).val(value);
	              var regexPcode = /^([a-zA-Z]\d[a-zA-z]( )?\d[a-zA-Z]\d)$/;
	              return regexPcode.test(value);
	            } else {
	              return true;
	            }
	        }, errorMessages.invalidPcode);

	        $.validator.addMethod('stripspaces', function (value,element) {
	            value = value.replace(/\s/g, '');
	            $(element).val(value);
	            return true
	        });

	        //EN's receipt generator freaks out at ampersands in fields
	        $.validator.addMethod('replaceAmpersands',function(value,element){
	          value = value.replace(/&/g,'+')
	          $(element).val(value);
	          return true;
	        });

	        var validation_rules = { };
	        validation_rules[fields.fname.name] = {
	          required: true,
	          replaceAmpersands: true
	        };
	        validation_rules[fields.lname.name] = {
	          required: true,
	          replaceAmpersands: true
	        };
	        validation_rules[fields.street1.name] = { required: true };
	        validation_rules[fields.city.name] = "required";
	        validation_rules[fields.region.name] = "required";
	        validation_rules[fields.country.name] = "required";
	        validation_rules[fields.email.name] = {
	            required: true,
	            emailTLD: true
	        };
	        validation_rules[fields.postal.name] = { 
	          required: true,
	          isPostcodeCA: function(element) {
	            return $(fields.country.selector).val() == "Canada";
	          }
	        };
	        validation_rules[fields.pay_type.name] = "required";
	        validation_rules[fields.cc_num.name] = {
	            required: true,
	            stripspaces: true,
	            creditcard: true
	        };
	        validation_rules[fields.cc_cvv.name] = {
	            required: true,
	            isCVV: true //note: AMEX CVVs are 4 digits but currently handled through PayPal
	        };
	        validation_rules[fields.cc_exp.name+"1"] = {
	            required: true,
	            isMonth: true
	        };
	        validation_rules[fields.cc_exp.name+"2"] = {
	            required: true,
	            isNowOrFutureYear: true,
	            isFuture: true
	        };
	        validation_rules[fields.amt.name] = {
	            required: true,
	            isValidDonation: true
	        };
	        validation_rules[fields.employer.name] = {
	            required: function(element) {
	                return $(fields.from_org.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.org_fname.name] = {
	            required: function(element) {
	                return $(fields.from_org.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.org_lname.name] = {
	            required: function(element) {
	                return $(fields.from_org.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.org_email.name] = {
	            required: function(element) {
	                return $(fields.from_org.selector).is(':checked');
	            },
	            emailTLD: true
	        }
	        validation_rules[fields.sec_street1.name] = {
	            required: function(element) {
	                return $(fields.sec_billing.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.sec_city.name] = {
	            required: function(element) {
	                return $(fields.sec_billing.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.sec_region.name] = {
	            required: function(element) {
	                return $(fields.sec_billing.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.sec_postal.name] = {
	            required: function(element) {
	                return $(fields.sec_billing.selector).is(':checked');
	            },
	            isPostcodeCA: function(element) {
	              return $(fields.sec_country.selector).val() == "Canada";
	            }
	        }
	        validation_rules[fields.sec_country.name] = {
	            required: function(element) {
	                return $(fields.sec_billing.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.inmem.name] = {
	            required: function(element) {
	                return $(fields.inmem_inhon.selector).is(':checked') && !$(fields.inhonor.selector).is(':checked');
	            }
	        }
	        /*validation_rules[fields.inhonor.name] = {
	            required: function(element) {
	                return $(fields.inmem_inhon.selector).is(':checked') && !$(fields.inmem.selector).is(':checked');
	            }
	        }*/
	        validation_rules[fields.inmem_name.name] = {
	            required: function(element) {
	                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inmem.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.inhonor_name.name] = {
	            required: function(element) {
	                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inhonor.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.inhonor_occ.name] = {
	            required: function(element) {
	                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inhonor.selector).is(':checked');
	            }
	        }
	        validation_rules[fields.inform.name] = {
	            required: true
	        }
	        validation_rules[fields.inform_recip.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            }
	        }
	        validation_rules[fields.inform_street1.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            }
	        }
	        validation_rules[fields.inform_city.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            }
	        }
	        validation_rules[fields.inform_region.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            }
	        }
	        validation_rules[fields.inform_postal.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            },
	            isPostcodeCA: function(element) {
	              return $(fields.inform_country.selector).val() == "Canada";
	            }
	        }
	        validation_rules[fields.inform_country.name] = {
	            required: function(element) {
	                return $(fields.inform.selector).filter(':checked').val() == "mail";
	            }
	        }
	        
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

	function getFormClasses() {
	    var classes = {
	        '.eaSubmitButton':{ classes: "btn btn-danger btn-lg", targetElement: ".eaSubmitButton"},
	        '#paypal': { classes: "inline-block-field half last", targetElement: "div.eaFormField"},
	        'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect, textarea.eaFormTextArea': {classes: 'form-control', targetElement: 'input.eaFormTextfield, select.eaFormSelect, select.eaSplitSelectfield, input.eaQuestionTextfield, .eaQuestionSelect, textarea.eaFormTextArea'}
	    };
	    
	    //Gift fields
	    classes[fields.currency.selector] = {classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.amt.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.recur_pay.selector] = { classes: "inline-block-field-wrap full-wrap hide-label", targetElement: "div.eaFullWidthContent"};
	    
	    //Personal info fields
	    classes[fields.fname.selector] = {classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.lname.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.email.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
	    
	    //Main address fields
	    classes[fields.street1.selector] = { classes: "inline-block-field-wrap three-quarter-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.street2.selector] = { classes: "inline-block-field-wrap one-quarter-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.city.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.postal.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.country.selector] = {classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.region.selector] = {classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.phone.selector] = {classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
	    
	    //Payment fields
	    classes[fields.pay_type.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.cc_num.selector] = { classes: "inline-block-field-wrap three-fifths-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.cc_cvv.selector] = { classes: "inline-block-field-wrap two-fifths-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes['[name="'+fields.cc_exp.name+'1"]'] = { classes: "inline-block-field-wrap half-wrap", targetElement: ".eaSplitSelectfield"};
	    classes['[name="'+fields.cc_exp.name+'2"]'] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: ".eaSplitSelectfield"};
	    classes['#'+fields.cc_exp.nameNoSpace+'1'] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
	    classes['#'+fields.cc_exp.nameNoSpace+'1'] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};

	    //Donation option fields
	    classes[fields.restrict.selector] = { classes: "inline-block-field-wrap full-wrap show-label", targetElement: "div.eaFullWidthContent"};

	    //In memorial fields
	    classes[fields.inmem.selector] = { classes: "inline-block-field-wrap full-wrap hide-label", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inmem_name.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inmem_msg.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inmem_from.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift hide js-informMail", targetElement: "div.eaFullWidthContent"};

	    //In honour fields
	    classes[fields.inhonor.selector] = { classes: "inline-block-field-wrap full-wrap hide-label ", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inhonor_name.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inhonor_occ.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inhonor_msg.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inhonor_from.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift hide js-informMail", targetElement: "div.eaFullWidthContent"};

	    //Inform fields
	    classes[fields.inform_recip.selector] = { classes: "inline-block-field-wrap full-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_street1.selector] = { classes: "inline-block-field-wrap hide js-informMail three-quarter-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_street2.selector] = { classes: "inline-block-field-wrap last-wrap hide js-informMail one-quarter-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_city.selector] = { classes: "inline-block-field-wrap half-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_postal.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_country.selector] = { classes: "inline-block-field-wrap half-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
	    classes[fields.inform_region.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};

	    //Company fields
	    classes[fields.org_fname.selector] = { classes: "inline-block-field-wrap half-wrap ", targetElement: "div.eaFullWidthContent"};
	    classes[fields.org_lname.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.org_email.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_street1.selector] = { classes: "inline-block-field-wrap three-quarter-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_street2.selector] = { classes: "inline-block-field-wrap last-wrap one-quarter-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_city.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_postal.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_country.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
	    classes[fields.sec_region.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
	    

	    return classes;
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(1)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * ENBeautifier module.
	 * 
	 * Performs various functions on EN forms/pages
	 *
	 * @version  0.3
	 * @requires jQuery, jQuery Placeholder
	 */

	var requiredOptions = [
	    'form'
	];

	//@since 0.3
	var defaults = {
	    fieldWrapperClass: 'js-form-field-wrapper',
	    fieldContainerClass: 'js-form-field-container',
	    willBuildColumns: false,
	    errorContainer: '#eaerrors',
	    pageSelector: 'input[name="ea.submitted.page"]',
	    postactionIndicator : 'isPostaction',
	    postactionClass : 'is-postAction',
	    reportedErrors: null,
	    currentPage: false,
	    isPostaction: false
	}

	var protect = { };

	var options;

	var fieldObtained = false;

	var grHelpers = __webpack_require__(4);

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
	function ENBeautifier(opts) {
	    if((missing = grHelpers.hasMissingOptions(opts, requiredOptions))) {
	        throw new Error("[ENBeautifier] Missing required options: " + missing.join(', '));
	    }
	    else {
	        options = $.extend(true, {}, defaults, opts, protect);
	        this.init();
	    }

	    //removed @since 0.3
	    /*if(this.hasRequiredOptions(options)) {
	        this.form = options.form;
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
	        throw new Error("[ENBeautifier] Missing required options: " + this.missingOptions.join(', '));*/
	}

	ENBeautifier.prototype.init = function() {
	    if(options.willBuildColumns) {
	        $('.eaLeftColumnContent, .eaRightColumnContent').addClass('hide');
	    }
	    this.checkErrors();
	}

	ENBeautifier.prototype.tagFieldContainers = function() {
	    var fields = $(options.form).find('input, select, textarea').not('[type="hidden"], .eaSubmitButton');
	    fields
	        .closest('div').addClass(options.fieldWrapperClass)
	        .parent().closest('div').addClass(options.fieldContainerClass);

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
	    var $form = options.form;
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

	    //@since 0.2
	    var includeSource = (typeof options.includeSource != "undefined" ? options.includeSource : false);

	    this.moveToTargets(fillers, includeSource);   
	}

	ENBeautifier.prototype.clearFillers = function(){
	  $('.eaLeftColumnFiller, .eaRightColumnFiller').remove();
	}

	/**
	 * Takes labels provided by Engaging Networks and sets them as the field's placeholder attribute instead
	 * @return {[type]} [description]
	 */
	ENBeautifier.prototype.usePlaceholders = function(removeAsterisk) {
	    if(typeof removeAsterisk === "undefined") {
	        removeAsterisk = true;
	    }
	    var fieldContainers = $(options.form).find('.'+options.fieldContainerClass);
	    if(!fieldContainers.length) {
	        this.tagFieldContainers();
	        fieldContainers = $(options.form).find('.'+options.fieldContainerClass);
	    }

	    $(fieldContainers).each(function() {
	        var label = $(this).find('label');
	        var asterisk = /( )+\*/;
	        var labelText = '';
	        if(removeAsterisk) {
	            labelText = label.text().replace(asterisk,'');
	        } else {
	            labelText = label.text();
	        }

	        $(this)
	            .find('input, textarea')
	            .attr('placeholder', labelText);
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
	 * @param {jQuery Object} $form @since 0.3 the parent jQuery object to look for errors in - useful for AJAX HTML responses
	 * @return void
	 */
	ENBeautifier.prototype.checkErrors = function($form){
	    var $errors;

	    //@since 0.3
	    if(typeof $form == "undefined") {
	        $form = options.form;
	    }
	    $errors = $form.find(options.errorContainer);
	    
	    if( $errors.length > 0 && $.trim($errors.text()) != ""){
	        var errors = $errors.contents();

	        //Let the rest of the page know there's an error
	        $form.trigger("formError.enbeautifier", errors);

	        //store it for later use
	        options.reportedErrors = errors;
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

	    var errors = options.reportedErrors;
	    
	    if(!preserveErrors){
	        options.reportedErrors = null;
	    }

	    return errors;
	}

	/**
	 * Gets and stores the page count and whether it's a post-action page
	 * If the current page is a post-action page, add the class to the page
	 */
	ENBeautifier.prototype.checkPage = function(){
	    //get the page number
	    var pageInput = $(options.pageSelector);
	    options.currentPage = pageInput.length ? parseInt(pageInput.val()) : 0;

	    //determine if we're on a post-action page
	    //if there's an explicit post-action indicator, then we've got an answer
	    if(typeof window[options.thankyouIndicator] === "boolean"){
	        options.isPostaction = window[options.thankyouIndicator];
	    }
	    //if not, then we should just assume that any page > 1 is a post-action
	    else if(options.currentPage > 1){
	        options.isPostaction = true;
	    }

	    //if it's the post-action, add the post-action class
	    if(options.isPostaction){
	        $("body").addClass(options.postactionClass);
	    }
	}

	module.exports = ENBeautifier;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRHelpers module.
	 * 
	 * A list of static functions that are useful throughout our projects
	 *
	 * @version   0.3
	 * @requires  jQuery
	 */

	function createSelectComponent(opts) {
	    if((missing = hasMissingOptions(opts, ['name', 'options'])))
	        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

	    var html = '%label%<select name="%name%" %id% %class% %atts%>%placeholder%</select>'
	                .replace(/%label%/g, (opts.label ? '<label for="%id%">'+opts.label+'</label>' : ''))
	                .replace(/%name%/g, (opts.name ? opts.name : ''))
	                .replace(/%id%/g, (opts.id ? 'id="'+opts.id+'"' : 'id="'+opts.name.replace(/[^a-zA-Z0-9\-\_]/g, '-')+'"'))
	                .replace(/%placeholder%/g, (opts.placeholder ? '<option value="">'+opts.placeholder+'</option>' : (opts.label ? '<option value="">'+opts.label+'</option>' : '' ))) //@since 0.3
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

	/**
	 * Builds an object mapping EN field names onto convenient object references
	 * @param  {Object} fieldMap key->value store of object reference onto EN field name
	 * @return {Object}          an object of objects with the object reference as the main key
	 * @since  0.3
	 */
	function buildFieldNameObject(fieldMap) {
	    var fieldObject = {};
	    for (var grField in fieldMap) {
	        fieldObject[grField] = {
	            name: fieldMap[grField],
	            nameNoSpace: fieldMap[grField].replace(/\s/g, '_'),
	            selector: '[name="'+fieldMap[grField]+'"]:not(a)',
	        };
	    }
	    return fieldObject;
	}


	/**
	 * Disable both button and input[type=submit] on a specified form
	 * @param  {jQuery} $form     the form whose buttons will be enabled
	 * @param  {string} selectors selectors for the buttons - a default will be applied if not provided
	 * @param  {string} text      text to be put on the button when it is disabled - a default will be applied if not provided
	 * @return void
	 * @since  0.3
	 */
	function disableButtons($form, selectors, text) {
	    if(typeof $form == "undefined") {
	        throw new Error("[GRHelpers] Missing $form for disableButtons");
	    }
	    if(typeof selectors == "undefined") {
	        selectors = 'input[type="submit"], button.btn-next';
	    }
	    if(typeof text == "undefined") {
	        text = 'Sending...';
	    }
	    $form.find(selectors).each(function() {
	        $(this).attr("disabled","disabled");
	        switch($(this).prop("tagName").toLowerCase()) {
	            case 'input':
	                $(this).data('orignalLabel', $(this).val());
	                $(this).val(text);
	            break;
	            case 'button':
	                $(this).data('orignalLabel', $(this).html());
	                $(this).html(text);
	            break;
	        }
	    });
	}

	/**
	 * Enable both button and input[type=submit] on a specified form
	 * @param  {jQuery} $form     the form whose buttons will be enabled
	 * @param  {string} selectors selectors for the buttons - a default will be applied if not provided
	 * @return void
	 * @since  0.3
	 */
	function enableButtons($form, selectors) {
	    if(typeof $form == "undefined") {
	        throw new Error("[GRHelpers] Missing $form for enableButtons");
	    }
	    if(typeof selectors == "undefined") {
	        selectors = 'input[type="submit"], button.btn-next';
	    }
	    $form.find(selectors).each(function() {
	        $(this).removeAttr("disabled");
	        switch($(this).prop("tagName").toLowerCase()) {
	            case 'input':
	                $(this).val($(this).data('orignalLabel'));
	            break;
	            case 'button':
	                $(this).html($(this).data('orignalLabel'));
	            break;
	        }
	    });
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

	/**
	 * [replaceENTemplateTags description]
	 * @param  {jQuery} $source  form that has fields with source data to use
	 * @param  {jQuery} $target  container that has EN template tags in it
	 * @param  {Array} fieldMap  standard Grassriots array of objects field map
	 * @return void
	 * @since  0.3
	 */
	function replaceENTemplateTags($source, $target, fieldMap, delimiter) {
	    var html = $target.html();
	    delimiter = typeof delimiter !== "undefined" ? delimiter : {start:"{",end:"}"}
	    for(var field in fieldMap) {
	        var regex = new RegExp(delimiter.start+"user_data~"+fieldMap[field].name+delimiter.end, "g");
	        html = html.replace(regex, $source.find(fieldMap[field].selector).val());
	    }
	    $target.html(html);
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
	    buildFieldNameObject: buildFieldNameObject,
	    disableButtons: disableButtons,
	    enableButtons: enableButtons,
	    getURLParameter: getURLParameter,
	    getAnyURLParameter: getAnyURLParameter,
	    hasMissingOptions: hasMissingOptions,
	    replaceENTemplateTags: replaceENTemplateTags,
	    ucFirst: ucFirst
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRUpsell module
	 *
	 * Managed functionality relating to upsell modals
	 *
	 * @version  0.3
	 * @requires jQuery, Bootstrap
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
	    'enabled': true,
	    'onDeclineFormUpdates': function() { //@since v0.3
	        this.options.recurringField.val('N');
	    },
	    'onUpsellFormUpdates': function() { //@since v0.3
	        this.options.recurringField.val('Y');
	        this.options.donationAmountField.val(this.upsellAmount);
	    }
	}

	var protect = {
	    initialAmount: 0,
	    upsellAmount: 0
	}

	var grHelpers = __webpack_require__(4);

	/**
	 * GRUpsell constructor
	 * @param Object options with the following properties:
	 *        string upsellContentSelector - selector for container of upsell content
	 *        jQuery recurringField - collection of form field names desired in the order of preference - Email should always be included and be the first in the array
	 *        jQuery form - a jQuery object of the form where the fields will be added 
	 * @since 0.3 - Uses GR Helpers for missing options instead of local function
	 * @since 0.3 - switched options to be instance based rather than global within module
	 */
	function GRUpsell(opts) {
	    this.exists = false;

	    if((missing = grHelpers.hasMissingOptions(opts, requiredOptions))) {
	        throw new Error("[GRUpsell] Missing required options: " + missing.join(', '));
	    }
	    else {
	        this.options = $.extend(true, {}, defaults, opts, protect);
	        this.init();
	    }
	}

	GRUpsell.prototype.init = function() {
	    var upsellContent = $(this.options.upsellContentSelector);
	    if(upsellContent.length > 0){
	        this.exists = true;
	        upsellContent.appendTo($('body'));
	        $('body').on('click', "."+this.options.declineClass, $.proxy(handleDecline, this));
	        $('body').on('click', "."+this.options.upsellClass, $.proxy(handleUpsell, this));
	    }
	    else{
	        this.exists = false;
	    }
	}

	GRUpsell.prototype.launch = function() {
	    var field = this.options.donationAmountField;

	    //get the active field
	    if( field.length > 1){
	        checkedField = field.filter(":checked");
	        if(checkedField.length === 1){
	            field = checkedField;
	        }
	    }

	    this.initialAmount = parseFloat(field.val().replace(/[^0-9\.]/g, ''));
	    //@since 0.3 handle 'other' field [in EN way - we already handle GRGivingSupport way]
	    if(isNaN(this.initialAmount) && this.options.donationAmountField.filter('[type="text"]').length) {
	        this.initialAmount = parseFloat(this.options.donationAmountField.filter('[type="text"]').val().replace(/[^0-9\.]/g, ''));
	    } else if(isNaN(this.initialAmount)) {
	        this.initialAmount = 0;
	    }

	    if( //@since 0.3 flexible detection of recurring field type and value
	        this.options.enabled === false 
	        || this.initialAmount >= this.options.maxGift 
	        || (
	            this.options.recurringField.val()=='Y'
	            && ['checkbox','radio'].indexOf(this.options.recurringField.attr('type').toLowerCase()) === -1
	            )
	        || (
	            this.options.recurringField.filter(':checked').length
	            && this.options.recurringField.filter(':checked').val() == 'Y'
	            && ['checkbox','radio'].indexOf(this.options.recurringField.attr('type').toLowerCase()) !== -1
	            )
	        || !this.exists ) {
	        
	        return false;
	    }

	    this.upsellAmount = calculateUpsell.call(this, this.initialAmount);

	    if(typeof this.options.preLaunchCallback === "function") {
	        this.options.preLaunchCallback.call(this);
	    }

	    $(this.options.upsellContentSelector).find("."+this.options.donationAmountClass).text(this.initialAmount.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2}));
	    $(this.options.upsellContentSelector).find("."+this.options.upsellAmountClass).text(this.upsellAmount.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2}));

	    $(this.options.upsellContentSelector).modal({
	        backdrop: 'static',
	        keyboard: false
	    });
	    $(this.options.upsellContentSelector).modal('show');
	    this.options.enabled = false;
	    return true;
	}

	function calculateUpsell(amt) {
	    switch(this.options.upsellMethod) {
	        case 'range':
	            if(typeof this.options.range != "undefined")
	                return getUpsellFromRange.call(this, amt);
	        break;
	        case 'function':
	            if(typeof this.options.calcFunction != "undefined")
	                return this.options.calcFunction(amt);
	        break;
	        case 'formula':
	            if(typeof this.options.formula != "undefined") 
	                return eval(this.options.formula);
	        break;
	    }
	    return amt;   
	}

	function getUpsellFromRange(amt) {
	    try {
	        amt = parseFloat(amt.replace(/[^0-9\.]/g, ''));
	        for(var i = 0; i < this.options.range.length; i++) {
	            if(amt >= this.options.range[i].min && amt < this.options.range[i].max)
	                return this.options.range[i].amount;
	        }
	    }
	    catch(err) { }
	    
	    return amt;
	}

	function handleDecline(e) {
	    e.preventDefault();
	    this.options.onDeclineFormUpdates.call(this);
	    this.options.form.trigger("grupsell.declined", [this.initialAmount, this.upsellAmount]);
	    $(this.options.upsellContentSelector).modal('hide');

	    if(typeof this.options.declineCallback === "function"){
	        this.options.declineCallback.call(this);
	    }

	    this.options.form.submit();
	}

	function handleUpsell(e) {
	    e.preventDefault();
	    this.options.onUpsellFormUpdates.call(this);
	    this.options.form.trigger("grupsell.upsold", [this.initialAmount, this.upsellAmount]);
	    $(this.options.upsellContentSelector).modal('hide');

	    if(typeof this.options.upsellCallback === "function"){
	        this.options.upsellCallback.call(this);
	    }

	    this.options.form.submit();
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
	 * 
	 * @version  0.4 !!!MODIFIED20160119!!
	 * @requires jQuery
	 */
	var requiredOptions = [ 'steps' ];

	var defaults = {
	    'indicatorTarget': '.steps-list',
	    'activeClass': "is-active",
	    'completeClass': "is-complete",
	    'target': '.js-formSteps',
	    'stepHandler': [],
	    'stepPreSwitchCallback': [], //@since __
	    'stepLabels': [],
	    'stepButton': 'Next<span class="glyphicon glyphicon-chevron-right"></span>',
	    'actionButton': 'Donate<span class="glyphicon glyphicon-chevron-right"></span>',
	    'currentStep': false,
	    'startStep': 0,
	    'useCSSAnimation': true,
	    'addButtons': false,
	    'backButtons': true
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
	 * Initialize GRSteps !!MODIFIED 20151002!!
	 *
	 * @return {[type]} [description]
	 */
	GRSteps.prototype.init = function(){
	  //initalizer
	  var steps = this;
	  this.stepIndicators = $();
	  this.disabledSteps = [ ];  //@since 0.4
	  this.$container = $(this.options.target);
	  this.addSteps(this.options.steps);

	  //add a frame to the parent
	  this.$container.parent().addClass("window--frame");

	  //add step buttons if so configured
	  if(this.options.addButtons){
	    this.buttonify.call(this.options.steps, this);
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

	  //handle tabbing issue
	  $(this.options.steps).on('keydown', 'input, select, textarea, button', function(e) {
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
	  
	  this.$container.on('stepChanged.grsteps', function(e, step) {
	      steps.$container.promise().done(function() {
	          $(steps.options.steps)
	              .filter(function(index) {
	                  return (step.currentStep == index);
	              })
	              .find('input, select, textarea, button')
	              .first()
	              .focus();
	      });
	  });

	  //Allow switching steps by clicking the breadcrumb
	  $(this.options.indicatorTarget).on("click", '.'+this.options.completeClass, function(){
	    var index = $(this).index();

	    if(steps.options.currentStep > index){
	      steps.switchTo(index);
	    }
	  });

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
	 * Hides a step and its indicator
	 * @param  {int} index the index of the step to hide starting at 0
	 * @return void   
	 * @since 0.4    
	 */
	GRSteps.prototype.hideStep = function(index) {
	  if(this.disabledSteps.indexOf(index) === -1) {
	    this.disabledSteps.push(index);
	    $(this.options.steps[index]).children().css('visibility', 'hidden');
	    if(!this.stepIndicators.filter('.step'+index).hasClass("hidden-step")) { //@since  __ 
	      this.stepIndicators.filter('.step'+index).animate({width:'hide', paddingLeft: 'hide', paddingRight: 'hide'},400);
	    }
	  }
	}

	/**
	 * Shows a step and its indicator
	 * @param  {int} index the index of the step to show starting at 0
	 * @return void    
	 * @since  0.4   
	 */
	GRSteps.prototype.showStep = function(index) {
	  if(this.disabledSteps.indexOf(index) !== -1){
	    this.disabledSteps.splice(this.disabledSteps.indexOf(index),1);
	    $(this.options.steps[index]).children().css('visibility', '');
	    if(!this.stepIndicators.filter('.step'+index).hasClass("hidden-step")) { //@since  __ 
	      this.stepIndicators.filter('.step'+index).animate({width:'show', paddingLeft: 'show', paddingRight: 'show'},400);
	    }
	  }
	}

	/**
	 * recalculates the sizes of the panels and container
	 * @return void
	 * @since  0.4
	 */
	GRSteps.prototype.recalculate = function() {
	  //change the container width to match the number of panels
	  if(
	    typeof this.options.direction !== "string"
	    || this.options.direction === "right"
	    || this.options.direction === "left"
	    ){
	    var containerWidthPercentage = 100 * (this.stepIndicators.length);
	    var panelWidthPercentage = 100 * (1/(this.stepIndicators.length));
	    this.$container.css("width", containerWidthPercentage + "%" );
	    this.$container.children().css("width",panelWidthPercentage + "%"); 
	  }
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
	    //@since  __ - hidden classes and empty label support
	    var label = ""; //i+1;
	    var hiddenClasses = " hide hidden-step"; 
	    if(typeof this.options.stepLabels[i] !== 'undefined' && this.options.stepLabels[i].length){
	      label = this.options.stepLabels[i];
	      hiddenClasses = "";
	    }

	    this.stepIndicators = this.stepIndicators.add('<li class="step'+i+hiddenClasses+'">'+label+'</li>');
	  }

	  //after the first time stepIndicators is appended, it becomes part of the DOM. So when you re-append, it acts as though you're moving the whole set, effectively just adding the new things (apparently)
	  $(this.options.indicatorTarget).append(this.stepIndicators);

	  this.recalculate();  //moved to function @since 0.4
	}

	/**
	 * [switchTo description]
	 * @param  {[type]} stepNumber [description]
	 * @return {[type]}            [description]
	 */
	GRSteps.prototype.switchTo = function(stepNumber){

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

	  /**
	   * Prevent going to a step that doesn't exist
	   * @since v0.35 - 2015-12-04 - JH: this wasn't in v0.3 so I changed the version to v0.35 to note it strayed - not sure what projects it exists in, but if we always upgrade to v0.4 [or the latest] then we should be okay
	   */
	  if(this.$container.children().length <= stepNumber){
	    return;
	  }

	  //switch the indicator
	  this.options.currentStep = stepNumber;
	  this.updateIndicators();
	  
	  //@since __ - create a pre-panel load callback which can help with ensuring code fires before a panel loads especially in cases where there are hidden panels. There is no return value to stop the panel switch.
	  if(
	    typeof this.options.stepPreSwitchCallback[this.options.currentStep] === "function"
	    && this.options.currentStep > 0
	  ) {
	    this.options.stepPreSwitchCallback[this.options.currentStep].call(this.$container);
	  }

	  //actually switch to the panel
	  
	  //simulate scrolling right
	  if(
	    typeof this.options.direction !== "string"
	    || this.options.direction === "right"
	    ){
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
	  }

	  //simulate scrolling down
	  //@since 0.3
	  else if(this.options.direction === "down"){
	    //get the collective height of earlier elements
	    var activePage = this.$container.children().eq(this.options.currentStep);

	    var newScroll = activePage.prevAll()
	      .map(function(){
	        return $(this).outerHeight();
	      })
	      .get().reduce(function(sum, item){
	        return sum + item;
	      },0);

	    if(this.options.useCSSAnimation){
	      this.$container.css({
	        scrollTop: newScroll,
	        height: activePage.outerHeight()
	      })
	    }
	    else{
	      this.$container
	        .animate({
	          "scrollTop": newScroll,
	          "height": activePage.outerHeight()
	        }, 300);
	    }
	  }


	  //let the world know what's happened
	  this.$container.trigger("stepChanged.grsteps",{currentStep:this.options.currentStep});
	}

	/**
	 * Updates indicators by handling the varying logic needed to determine which should be 'active' and which should be 'complete' to support panels without their own indicators
	 *
	 * @since __
	 */
	GRSteps.prototype.updateIndicators = function(){
	  var currentClass = '', previousClass = '';
	  var previousIndicatorIndex = this.options.currentStep - 1;

	  this.stepIndicators
	    .removeClass(this.options.activeClass);

	  if($.trim(this.stepIndicators.eq(this.options.currentStep).text()) == "") {
	    previousClass = this.options.activeClass;
	  } else {
	    currentClass = this.options.activeClass;
	    previousClass = this.options.completeClass;
	  }

	  while(previousIndicatorIndex >= 0 && ($.trim(this.stepIndicators.eq(previousIndicatorIndex).text()) == "" || this.disabledSteps.indexOf(previousIndicatorIndex) !== -1)) {
	    previousIndicatorIndex--;
	  }

	  if(previousIndicatorIndex >= 0) {
	    this.stepIndicators.eq(previousIndicatorIndex).addClass(previousClass);
	  }
	  this.stepIndicators.eq(this.options.currentStep).addClass(currentClass);

	}

	/**
	 * [addButtons description]
	 */
	GRSteps.prototype.buttonify = function(self){
	  var lastIndex = self.options.actionStep;
	  this.each(function(index, step) {
	    if(index == lastIndex) {
	      $(step).append(
	        '<p class="pull-right"> \
	          <button type="button" class="btn btn-danger btn-lg btn-next">'+self.options.actionButton+'</button> \
	        </p>'
	      );
	    } else {
	      $(step).append(
	        '<p class="pull-right"> \
	          <button type="button" class="btn btn-danger btn-lg btn-next">'+self.options.stepButton+'</button> \
	        </p>'
	      );
	    }

	    if(
	      index>0
	      && self.options.backButtons === true
	      ) {
	      $(step).append(
	        '<p class="pull-left back-button"> \
	          <button type="button" class="go-back btn-prev"><span class="glyphicon glyphicon-chevron-left"></span> Back</button> \
	        </p>'
	      );
	    }
	  });
	}

	/**
	 *  switches to the next visiable step
	 * @since  0.4   Looks for hidden steps and jumps over them
	 * @return void
	 */
	GRSteps.prototype.nextStep = function(){
	  var offset = 1;
	  while(this.disabledSteps.indexOf(this.options.currentStep + offset) !== -1) {
	    offset++;
	  }
	  this.switchTo(this.options.currentStep + offset);
	}

	/**
	 * switches to the previous visiable step
	 * @since  0.4   Looks for hidden steps and jumps over them
	 * @return {[type]} [description]
	 */
	GRSteps.prototype.previousStep = function(){
	  var offset = 1;
	  while(this.disabledSteps.indexOf(this.options.currentStep - offset) !== -1) {
	    offset++;
	  }
	  this.switchTo(this.options.currentStep - offset);
	}

	/**
	 * Causes window to recalculate
	 * @return {[type]} [description]
	 *
	 * @since  0.3
	 */
	GRSteps.prototype.refresh = function(){
	  this.switchTo(this.options.currentStep);
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
	 * @version  0.5 !!MODIFIED20160119!!
	 * @requires jQuery
	 */
	var requiredOptions = [ 'form' ];

	//expected
	var defaults = {
	    autoSelectCurrency: false,
	    autoBuildCurrencyList: false,  //@since 0.3
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

	//prevent user from defining these
	var protect = {
	    components: {
	        other: { urlParam: null, defaultVal: null }
	    }
	};

	var options;

	var $form;
	var askStringIndex = { };
	var processorMasterOptions; //@since 0.3
	var availableRegionLists = [
	    'US',
	    'CA',
	    'AU',
	    'IN'
	];
	//TODO: Consider making these two conditional for when they are used
	var currencyMap = __webpack_require__(8);
	var currencySymbols = __webpack_require__(9);

	var grHelpers = __webpack_require__(4);
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

	/**
	 * Sets an input value based on the tagname or type values
	 * @param {Object}       component   Standard component object used throughout the module
	 * @param {string|float} value       the value that the component should be set to
	 * @param {boolean}      strict      In the case of <select> fields where the passed {value} doesn't have a corresponding <option>, it will add the <option> if set to false [default], or not do anything if set to true
	 *
	 * @return {boolean}                 true if the value was able to be set, false if it failed
	 */
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
	 * @param  {Object} component  Standard component object used throughout the module
	 * 
	 * @return {Array|string|null}
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
	 * @param  {Object} component  Standard component object used throughout the module
	 * 
	 * @return {Array|string|null}
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
	 *                   {jQuery Object}    form                    [required] The form that will be used with this module
	 *                   {Object}           components              Object with sub-Objects each that contain the properties: selector, urlParam, defaultVal; 'amount' and 'other' components accept the property 'name' and 'other' accepts the property 'targetName'
	 *                   {Array}            activeRegionLists       Array of ISO-2 Country Codes of desired, pre-defined region lists to support
	 *                   {string}           askStringSelector       Container that holds the unordered lists of ask amounts
	 *                   {string}           askStringContainerClass Class to be added to the container of the generated ask amount buttons/fields
	 *                   {Array}            recurrenceOptions       Array of Objects specifying the options available for the Recurrence input - each object has the properties: label and value
	 *                   {Object}           processorFields         Object with keys matching values of the 'processor' component and specifying which fields to hide or show when the processor is selected
	 *
	 * 
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
	        if(options.activeRegionLists) {
	            this.activateCountryRegions(options.activeRegionLists);
	        }
	        else {
	            regionLists["default"] = $('<div>').append($form.find(options.components.region.selector).clone()).html();
	        }
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
	        if(options.recurrenceOptions.length) {
	            this.buildRecurrenceSelector(options.recurrenceOptions);
	        }
	        $form.find(options.components.recurrence.selector).on('change', $.proxy(this.updateAskString, this));
	    }

	    //if processorFields setup field hide and show on processor change
	    if(isActive(options.components.processor)) {
	        if(options.processorFields) {
	            this.setProcessorFields(options.processorFields);
	        }
	        $form.find(options.components.processor.selector).on('change', function(e) {
	            if(typeof processorFields[$(this).val()] != "undefined") {
	                if(processorFields[$(this).val()]['hide']) {
	                    $(processorFields[$(this).val()]['hide'].join(', ')).hide();
	                }
	                if(processorFields[$(this).val()]['show']) {
	                    $(processorFields[$(this).val()]['show'].join(', ')).show();
	                }
	            }
	        });
	        //@since 0.3
	        if(typeof options.components.processor.countryMap != "undefined") {
	            if(typeof options.components.processor.countryMap["default"] == "undefined") {
	                throw new Error('[GRGivingSupport] No default processor list defined');
	            } else {
	                $(options.components.processor.selector).find('option').each(function() {
	                    $(this).attr("data-name", $(this).text());
	                })
	                processorMasterOptions = $(options.components.processor.selector).find('option');
	                $form.find(options.components.country.selector).on('change', function(e) {
	                    var $processor = $(options.components.processor.selector);
	                    var optionsList = options.components.processor.countryMap["default"];
	                    
	                    if(typeof options.components.processor.countryMap[$(this).val()] != "undefined") {
	                        optionsList = options.components.processor.countryMap[$(this).val()];
	                    }

	                    optionsList = optionsList.map(function(value) {
	                        return '[data-name="'+value+'"]';
	                    });

	                    if(processorMasterOptions.filter(optionsList.join(',')).length != $processor.children().length) {
	                        $processor.children().remove();
	                        $processor.append(
	                            processorMasterOptions.filter(
	                                optionsList.join(',')
	                            )
	                        );
	                        $processor.find('option:first').prop('selected', true);
	                        $processor.trigger('change');
	                    }
	                });
	            }
	        }
	    }

	    //add container around amount for ask string buttons
	    if(isActive(options.components.amount) || isActive(options.components.other)) {
	        var $amountInput = $form.find(options.components.amount.selector+','+options.components.other.selector);
	        $amountInput.first().wrap('<div class="'+options.askStringContainerClass+'"></div>');
	        $form
	            .on('change', options.components.amount.selector, function(e) { //clear other box when not selected
	                e.stopPropagation();
	                if($form.find(options.components.amount.selector).val() != 'other') {
	                    $form.find(options.components.other.selector).val('');
	                }
	            })
	            .on('change','[name="'+options.components.other.name+'"]', function(e){
	                e.stopPropagation();

	                $(this).closest("label").siblings("input[type=radio]").val($(this).val());
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
	        //@since 0.3
	        if(options.autoBuildCurrencyList && $(options.askStringSelector).length) {
	            this.buildCurrencyList();
	        }
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
	                if( !components.currency.startingValue && isActive(components.country) && options.autoSelectCurrency) {
	                    this.setCurrencyByCountry($form.find(components.country.selector).val());
	                } else if(!components.currency.startingValue && components.currency.defaultVal) {
	                    this.setCurrency(components.currency.defaultVal);
	                } else { //@since 0.5
	                    this.setCurrency(components.currency.startingValue);
	                }
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
	                var regions = __webpack_require__(10)("./GRRegions-"+countries[i]);
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
	    if(exists(options.components.amount) && $form.find(options.components.amount.selector).filter(':checked').length)
	        amt = $form.find(options.components.amount.selector).filter(':checked').val();

	    if(amt == 'other' || (!exists(options.components.amount) && exists(options.components.other))) 
	        amt = $form.find(options.components.other.selector).val().replace(/[^0-9\.]/g, '');

	    if(isNaN(parseFloat(amt)))
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

	    //@since 0.2 - updated to handle a single checkbox properly
	    //@since __ - updated recurrence variable to always be alphanumerics and underscores to allow for more complex labeling of the recurrence selector buttons
	    if(isActive(options.components.recurrence) && $form.find(options.components.recurrence.selector).length > 1 && (recurrence = $form.find(options.components.recurrence.selector+':checked').siblings('label:eq(0)').text().toLowerCase().replace(/[^a-z0-9]/g,"_"))) {
	        index.push(recurrence);
	    }

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
	 * Finds the ask string list defined in a unordered list and returns an Object with the array of values 
	 * @param {Object|string} should either be a selector of a source of ask string values per currency per recurrence
	 * or an object of the same
	 * @return {Object} Object with one property 'amount' which is an Array of string values of ask amounts
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

	/**
	 * Builds a dropdown of currencies based on the options provided in the ask range selector
	 * @return void
	 * @since  0.3
	 */
	GRGivingSupport.prototype.buildCurrencyList = function() {
	    var $askStringLists = $(options.askStringSelector).find('ul');
	    var $currency = $(options.components.currency.selector);
	    var currencies = [ ];
	    $askStringLists.each(function() {
	        var currency = $(this).attr('class').substring(0,3);
	        for(var iso2 in currencyMap) {
	            if(currencyMap[iso2] == currency) {
	                break;
	            }
	        }
	        if(currencies.indexOf(currency) == -1) {
	            currencies.push(currency);
	        }
	    });
	    currencies = currencies.map(function(currency) { 
	        return {name: currency, code: currency};
	    });
	    $currency.replaceWith(
	        grHelpers.createSelectComponent({
	            name: $currency.attr('name'),
	            classes: $currency.attr('class'),
	            options: currencies
	        })
	    );
	}

	/**
	 * Generates the HTML for the ask amount buttons based on a list of amounts and/or whether the 'other' component is defined
	 * @since  0.4 the default selected amount should have an asterisk as the last character
	 * @param  {Array} amounts Array of amount strings 
	 * @return {Array}         Array of HTML strings - one per button
	 */
	function getAskButtons(amounts) {
	    var selectorButtons = [ ];
	    // var $amount = $form.find(options.components.amount.selector);

	    if(typeof amounts != "undefined" && amounts) {
	        for(var i=0; i<amounts.length; i++) {
	            var choice = amounts[i];
	            selectorButtons.push(
	                grHelpers.createRadioComponent({
	                    name:  options.components.amount.name,
	                    label: choice.replace(/\*/g,''),
	                    value: choice.replace(/[^0-9\.]/g,''),
	                    wrap:  "<div class='amountbutton'></div>",
	                    atts: (choice.indexOf('*') != -1 ? ['checked="checked"'] : '')
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

	/**
	 * Builds radio buttons in place of the recurrence input field
	 * @param  {Array} opt  Array of Objects of recurrence options to display - has properties 'label' and 'value'
	 * @return {void}
	 */
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

	/**
	 * Unhides the label for a field
	 * @return {void} 
	 */
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
	 * @version 0.1
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
	 * @version 0.1
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

	var map = {
		"./GRRegions-CA": 11,
		"./GRRegions-CA.js": 11,
		"./GRRegions-US": 12,
		"./GRRegions-US.js": 12
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
	webpackContext.id = 10;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * GRRegions module.
	 * 
	 * A list of Canadian provinces
	 *
	 * @version  0.1
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
/* 12 */
/***/ function(module, exports) {

	/**
	 * GRRegions module.
	 * 
	 * A list of US states
	 *
	 * @version  0.1
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRAnalytics module.
	 * 
	 * Used for interaction whith Google Analytics service.
	 *
	 * @version  0.4
	 * @requires jQuery
	 */
	var requiredOptions = [ ];

	var defaults = {
	    'prefix': '/virtual',
	    'events': [ ],
	    'trackingPixels': { },
	    'gtm': {
	        'socialAction': 'socialAction',
	        'socialNetwork': 'socialNetwork',
	        'socialTarget': 'socialTarget',
	        'virtualPageURL': 'virtualPageURL',
	        'virtualPageTitle': 'virtualPageTitle',
	        'eCommerceEvent': 'eCommerceTransaction',
	        'virtualPageviewEvent': 'VirtualPageview',
	        'socialActivityEvent': 'SocialActivity'
	    }
	};

	var protect = {
	    'prependPath': [ ]
	};

	var options;

	/**
	 * GRAnalytics constructor
	 * @param Object opt options with the following properties:
	 *        string prefix prepended to the beginning of pageview sent to GA
	 *        array events a collection of objects defining events that should trigger a GA pageview
	 *        object trackingPixels a collection of tracking pixels to register
	 */
	function GRAnalytics(opt) {
	    if(this.hasRequiredOptions(opt)) {
	        options = $.extend(true, {}, defaults, opt, protect);
	        this.init();
	    }
	    else
	        throw new Error("[GRAnalytics] Missing required options: " + this.missingOptions.join(', '));
	}

	/**
	 * GRAnalytics hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	GRAnalytics.prototype.hasRequiredOptions = function(options, req) {
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

	GRAnalytics.prototype.init = function() {
	    setPrefix(options.prefix);
	    
	    //activate all event-based analytics reports passed on initialization
	    if(options.events.length)
	        this.setEventListeners(options.events);

	    //register all tracking pixels passed on initialization
	    for(var pixel in options.trackingPixels) {
	        if(options.trackingPixels[pixel] instanceof Object && this.hasRequiredOptions(options.trackingPixels[pixel], pixelRequiredOptions)) {
	            this.registerPixel(pixel, options.trackingPixels[pixel].id.toString(), options.trackingPixels[pixel].showPixel);
	        }
	        else if(['string','number'].indexOf((typeof options.trackingPixels[pixel]).toLowerCase()) != -1) {
	            this.registerPixel(pixel, options.trackingPixels[pixel].toString());
	        }
	    }
	}

	function setPrefix(prefix) {
	    if(options.prefix.charAt(0) != "/")
	        options.prefix = "/" + options.prefix;
	    options.prependPath[0] = options.prefix;
	}
	    
	/**
	 * Initialization of pageviews which will be 
	 * automatically executed when some event triggered.
	 * 
	 * @param (Array) views An array of options. 
	 * Each options should contain parameters:
	 * - 'event': event name (click, scroll, etc.)
	 * - 'selector': Element's selector.
	 * - 'virtualPageview': Name of virtualPageview.
	 * @public
	 */
	GRAnalytics.prototype.setEventListeners = function( views ) {
	    if(typeof options.form == 'undefined') 
	        throw new Error('"form" option needs to be specified to use the auto-event-listener functionality');
	    var analyticsReport = this.analyticsReport;
	    for(var i=0; i<views.length; i++) {
	        var view = views[i];

	        options.form.on(view['event'], view.selector, function(e) { analyticsReport( view.virtualPageview ); });
	    }
	}

	GRAnalytics.prototype.addToPrefix = function( toAdd ) {
	    options.prependPath.push(toAdd.toString());
	}

	/**
	 * Makes call to Google Analytics (virtual eComerce reort).
	 * 
	 * @param Object transactionData
	 * @param Object itemData
	 * @public
	 */
	GRAnalytics.prototype.eCommerceReport = function(transactionData, itemData) {
	    //@since 0.4
	    //GTM
	    if(typeof dataLayer !== 'undefined') {
	        dataLayer.push({
	            'transactionId': transactionData.id,
	            'transactionAffiliation': transactionData.affiliation,
	            'transactionTotal': transactionData.revenue,
	            'transactionTax': 0,
	            'transactionShipping': 0,
	            'transactionProducts': itemData,
	            'event': options.gtm.eCommerceEvent
	        });
	        return;
	        
	    }

	    // Universal GA
	    if (typeof ga !== 'undefined') {
	        ga('require','ecommerce');
	        
	        ga('ecommerce:addTransaction', transactionData);

	        for (var i = 0; i < itemData.length; i++) {
	            ga('ecommerce:addItem', itemData[i]);
	        }

	        ga('ecommerce:send');
	    }

	    // Traditional GA
	    if (typeof _gaq !== 'undefined') {
	        _gaq.push(['_set', 'currencyCode', transactionData.currency]);
	        _gaq.push(['_trackPageview']);
	        _gaq.push(['_addTrans',
	            transactionData.id, // transaction ID - required
	            transactionData.affiliation, // affiliation or store name
	            transactionData.revenue, // total - required
	            '0', // tax
	            '0'
	        ]);

	        for (var i = 0; i < itemData.length; i++) {
	            _gaq.push(['_addItem',
	                itemData[i].id, // transaction ID - required
	                itemData[i].sku, // SKU/code - required
	                itemData[i].name, // product name
	                itemData[i].category, // category or variation
	                itemData[i].price, // unit price - required
	                itemData[i].quantity // quantity - required
	            ]);
	        }

	        // Submits transaction to the Analytics servers.
	        _gaq.push(['_trackTrans']); 
	    }
	}

	/**
	 * Makes call to Google Analytics (virtual page view).
	 * 
	 * @param String viewName Page view name.
	 * @param String title Event title.
	 * @public
	 */
	GRAnalytics.prototype.analyticsReport = function(viewName, title) {
	    var fullPageViewName = options.prependPath.join('/') + '/' + viewName,
	        data = {};

	    data['page'] = fullPageViewName;

	    if ( title ){
	        data['title'] = title;
	    }

	    //@since 0.4
	    //GTM
	    if(typeof dataLayer !== 'undefined') {
	        var gtmData = {
	            'event': options.gtm.virtualPageviewEvent
	        };
	        gtmData[options.gtm.virtualPageURL] = fullPageViewName;
	        gtmData[options.gtm.virtualPageTitle] = title;
	        
	        dataLayer.push(gtmData);
	        return;
	    }

	    // Universal GA
	    if( typeof ga !== 'undefined' ) {
	        
	        ga( 'send', 'pageview', data );
	    }

	    // Traditional GA
	    if( typeof _gaq !== 'undefined' ){
	        _gaq.push( ['_trackPageview', fullPageViewName ] ); 
	    }
	}

	/**
	 * Makes call to Google Analytics (social).
	 * 
	 * @param Object networkDetails should include socialNetwork, socialAction, and socialTarget properties
	 * @public
	 * @since  0.2
	 */
	GRAnalytics.prototype.socialReport = function(networkDetails) {
	    //@since 0.4
	    //GTM
	    if(typeof dataLayer !== 'undefined') {
	         var gtmData = {
	            'event': options.gtm.socialActivityEvent
	        };

	        gtmData[options.gtm.socialNetwork] = networkDetails.socialNetwork;
	        gtmData[options.gtm.socialAction] = networkDetails.socialAction;
	        gtmData[options.gtm.socialTarget] = networkDetails.socialTarget;

	        dataLayer.push(gtmData);
	        return;
	    }

	    // Universal GA only
	    if( typeof ga !== 'undefined' ) {
	        ga( 'send', 'social', networkDetails.socialNetwork, networkDetails.socialAction, networkDetails.socialTarget);
	    }
	}

	var pixelRequiredOptions = [
	    'id',
	    'showPixel'
	];

	var supportedPixels = [
	    'facebook',
	    'facebookv2' //@since 0.3
	];

	var registeredPixels = { };

	var firePixelQueue = { };


	GRAnalytics.prototype.registerPixel = function(name, id, callback) {
	    if(typeof callback == "function") {
	        registeredPixels[name] = {id: id, showPixel: callback};
	    }
	    else if(supportedPixels.indexOf(name.toLowerCase()) != -1 ) {
	        registeredPixels[name] = 'pending';
	        __webpack_require__.e/* nsure */(1, function(require) {
	            var pixel = __webpack_require__(14)("./GRAnalytics-pixel-"+name);
	            registeredPixels[name] = {id: id,
	                showPixel: pixel.showPixel};
	            if(typeof firePixelQueue[name] != "undefined") {
	                for(var i=0; i<firePixelQueue[name].length; i++) {
	                    registeredPixels[name].showPixel(registeredPixels[name].id, firePixelQueue[name][i]);
	                }
	            }
	        });
	    }
	}


	GRAnalytics.prototype.fireTrackingPixels = function(pixels, data) {
	    var toProcess = pixels;
	    if(pixels == null) {
	        toProcess = registeredPixels.keys;
	    }
	    else if(typeof toProcess == "string") {
	        toProcess = [toProcess];
	    }

	    for(var i=0; i<toProcess.length; i++) {
	        if(typeof registeredPixels[toProcess[i]] == "undefined") continue;
	        else if(typeof registeredPixels[toProcess[i]] == "string") {
	            if(typeof firePixelQueue[toProcess[i]] == "undefined")
	                firePixelQueue[toProcess[i]] = [ ];
	            firePixelQueue[toProcess[i]].push(data);
	        }
	        else if(typeof registeredPixels[toProcess[i]].showPixel == "function") {
	            registeredPixels[toProcess[i]].showPixel(registeredPixels[toProcess[i]].id, data);
	        }
	    }
	}

	/**
	 * Public interface.
	 */
	module.exports = GRAnalytics;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRaygun module.
	 * 
	 * Used for interaction with Raygun service.
	 *
	 * @version  0.2
	 * @requires jQuery
	 */

	var requiredOptions = [ ];

	var defaults = { };

	var protect = { };

	var options;

	function GRaygun(opt) {
	    if(this.hasRequiredOptions(opt)) {
	        options = $.extend(true, {}, defaults, opt, protect);
	    }
	    else
	        throw new Error("[GRaygun] Missing required options: " + this.missingOptions.join(', '));
	}

	/**
	 * GRaygun hasRequiredOptions
	 * @param {Object} options list of options
	 *
	 * @return {bool} whether all necessary fields are provided in the options
	 */
	GRaygun.prototype.hasRequiredOptions = function(options, req) {
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
	 * Sends prepared information (error) to raygun service.
	 * 
	 * @param {String} error Error description.
	 * @param {Object} data An object of additional information.
	 * @private
	 */
	function _send( error, data ) {
	    if (typeof Raygun !== 'undefined') {
	        Raygun.send(error, data);
	    } else {
	        // TODO: Not sure that this is needed for production..
	        console.log(error);
	        console.log(data);
	    }
	}

	/**
	 * Prepares forms fields to sending. 
	 * Converts form fields to key => valye object.
	 * 
	 * @param {Array} forms An array of form selectors which would be processed.
	 * @returns {Object} Prepared data.
	 * @private
	 */
	function _prepareFormsData( forms ) {
	    
	    var formDataCollection = { };
	    for(var i = 0; i < forms.length; i++) {
	        var $forms = $(forms[i]);
	        formDataCollection[forms[i]] = [ ];

	        $forms.each(function() {
	            formDataCollection[forms[i]].push(
	                $(this).serializeArray().map(
	                    function(obj) {
	                        var returnObj = { };
	                        returnObj[obj.name] = "";
	                        if(typeof options.filter != "undefined" && options.filter.indexOf(obj.name) == -1 ) {
	                            returnObj[obj.name] = obj.value;
	                        }
	                        return returnObj;
	                    }
	                )
	            )
	        });
	    }
	    
	    return formDataCollection;
	}

	/**
	 * Generates a custom error to send to Raygun.
	 * 
	 * @param {String} errorName Error description.
	 * @param {Object} options An object with error's additional data 
	 * which will be processed and sent to 'raygun'.
	 * @public
	 * @since  0.2
	 */
	GRaygun.prototype.sendCustomError = function( errorName, options ) {
	    var self = this;

	    try { throw new Error(errorName);}
	    catch(error) {
	        self.sendError(error, options);
	    }
	}

	/**
	 * Prepares data to sending to 'raygun' service.
	 * 
	 * @param {String} error Error description.
	 * @param {Object} options An object with error's additional data 
	 * which will be processed and sended to 'raygun'.
	 * @public
	 */
	GRaygun.prototype.sendError = function( error, options ) {
	    var data = {};
	    
	    options = options || {};
	    
	    if (!options instanceof Object) {
	        options = {};
	    }

	    // If forms are defined, pull in the 
	    // form data for each listed form selector and store as an array of.
	    if (options.forms && options.forms.length) {
	        $.extend(true, data, {
	            formData: _prepareFormsData( options.forms )
	        });
	    }

	    if (options.data) {
	        $.extend( true, data, options.data );
	    }

	    _send(error, data);
	}

	/**
	 * Checking if there are any EN errors.
	 * Throws an exception if any.
	 * 
	 * @param {String} selector Css selector which uses to indicate EN error.
	 * @param {Array} formSelectors An array of css selectors of EN forms.
	 * @public
	 */
	GRaygun.prototype.checkENErrors = function(selector, formSelectors) {
	    try {
	        if ( $(selector).length === 0 || $.trim($(selector).text()) == "" ) {
	            return;
	        }
	        
	        try {
	            throw new Error("EA Processing Error");
	        } catch (error) {
	            var data = {};
	            
	            $(selector).trigger("en.error-response.GRaygun");
	            
	            data[selector] = $(selector).text();
	            
	            this.sendError(error, {
	                data: data,
	                forms: formSelectors
	            });
	        }
	    } catch( error ) {
	        this.sendError(error);
	    }
	}

	/**
	 * Public interface.
	 */
	module.exports = GRaygun;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * GRSocialize module
	 *
	 * Interacts with share buttons to generate a pop-up dialog
	 * Note: For the Facebook Share Dialog, your app will need to use the same domain for the hosting page and the sharing link (which should be specified as the Site URL)
	 *
	 * @version  0.3
	 * @requires jQuery
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
	    action: 'Pin',
	    height: 333,
	    width: 783,
	    baseURL: '',
	    elements: [ ]
	  },
	  'gplus': {
	    name: 'Google+',
	    action: 'Share',
	    height: 341,
	    width: 482,
	    baseURL: '',
	    elements: [ ]
	  },
	  'facebook': {
	    name: 'Facebook',
	    action: 'Share',
	    height: 217,
	    width: 521,
	    baseURL: 'https://www.facebook.com/sharer/sharer.php?',
	    elements: [
	      'u'
	    ]
	  },
	  'twitter': {
	    name: 'Twitter',
	    action: 'Tweet',
	    height: 300,
	    width: 498,
	    baseURL: 'https://twitter.com/intent/tweet?',
	    elements: [
	      'text',
	      'url'
	    ]
	  },
	  'linkedin': {
	    name: 'LinkedIn',
	    action: 'Share',
	    width: 783,
	    height: 538,
	    baseURL: 'https://www.linkedin.com/shareArticle?mini=true&',
	    elements: [ ]
	  },
	  'mail': {
	    name: 'Email',
	    action: 'Share',
	    baseURL: 'mailto:your@friends.com?',
	    elements: [
	      'subject',
	      'body'
	    ]
	  }
	};

	var requiredOptions = [
	  'target'
	];
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

	  if(typeof this.options.source !== "undefined") {
	    this.buildURLs(this.options.source);
	  }

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
	          self.options.onOpen.call(clickEvent, {
	            network: 'Facebook',
	            action: 'Post',
	            className: 'facebook',
	          },'',url);
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
	    action,
	    networkClass;

	  //loop through each registered network and assemble the right spec
	  $.each(self.networks,function(className,networkSpec){
	    if($this.hasClass(className)){
	      spec = "height="+networkSpec.height+",width="+networkSpec.width;
	      network = networkSpec.name;
	      action = networkSpec.action;
	      networkClass = className;
	      return false;
	    }
	  });

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
	    self.options.onOpen.call(this,{
	      network: network,
	      action: action,
	      className: networkClass
	    },spec,target);
	  }

	}

	/**
	 * buildURLs takes content-based unordered lists and turns them into proper share links
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	GRSocialize.prototype.buildURLs = function(source) {
	  var self = this;

	  //cycle through ul and look for social class
	  $(source).children('li').each(function() {
	    var network = false;
	    var networkData = this;
	    //check if class corresponds to an existing network 
	    $(networkData).attr('class').replace(/\s/g,' ').split(' ').forEach(function(className) {
	      if(typeof self.networks[className] != 'undefined') {
	        network = className;
	      }
	    });
	    if(network === false) {
	      return false;
	    }

	    if(typeof self.networks[network].elements !== 'undefined' && typeof self.networks[network].baseURL !== "undefined") {
	      var networkURL = self.networks[network].baseURL;
	      self.networks[network].elements.forEach(function(element) {
	        if($(networkData).find('.'+element).length > 0) {
	          if(network == 'facebook' && typeof self.options.facebook != "undefined") { //don't url encode the facebook element since it is a standalone URL
	            networkURL = $(networkData).find('.'+element).text();
	          } 
	          /**
	           * Don't URI encode mailto links
	           * @since  v0.3 - 01Dec15 
	           */
	          else if(network == "mail"){
	            networkURL += element + '=' + encodeURIComponent($(networkData).find('.'+element).text()) + '&';
	          } else {
	            networkURL += element + '=' + encodeURIComponent($(networkData).find('.'+element).text()) + '&amp;';
	          }
	        }
	      });
	      if($(self.options.target).find('a.'+network).length > 0) {
	        $(self.options.target).find('a.'+network).attr('href', networkURL);
	      }
	    }
	  });
	}

	module.exports = GRSocialize;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);