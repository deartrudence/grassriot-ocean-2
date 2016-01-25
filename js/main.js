//Beautifier configuration
var leftColumnSelector = '.js-left-column';
var formSelector = '.form';
var ENFormSelector = '.eaform';
var formFieldContainerClass = 'js-form-field-container';
var formFieldContainerIgnoreClass = 'is-selfHandling';
var formFieldWrapperClass = 'js-form-field-wrapper';
var footer = $('footer');
var header = $('header');

var donationSummary;

var ENBeautifier = require('./modules/ENBeautifier');
var enbeautifier;

// slick carousel slider
// var slick = require('slick');

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

var GRAnalytics = require('./modules/GRAnalytics');
var grAnalytics;

var gr = require('./modules/GRHelpers');

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
  ".js-hero": ".js-heroContent",
  ".js-campaign": ".js-campaignText",
  ".js-impact": ".js-impactText",
  ".js-cta-ask": ".js-ctaAskText",
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

var GRaygun = require('./modules/GRaygun');
var raygunFilterFields = ['password', 'credit_card', fields.cc_num.name, fields.cc_cvv.name];
var graygunner = new GRaygun({filter: raygunFilterFields});

var $ = require('jquery');
require("modernizr");
require("modal");
require("tooltip");
require("popover");

// var $submit = $(".eaSubmitButton");
var $error_modal = $("#error-modal");
var $validErrModal = $("#validErrModal");
var formErrors = [ ];
var validatorObj;

if(__DEV__){
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
  var browser = require('bowser');
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

    if (windowSize !== "phone" && windowSize !== "mobile") {
        if($(window).height() >  getFormHeight($affixForm)) {
            setContainerOffset($affixForm, $container);
            $affixForm
                // .filter(":not(.affix-top, .affix, .affix-bottom)")
                .affix({
                    offset: {
                        top: 0,
                        bottom: 0
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
        var GRSocialize = require('./modules/GRSocialize');
                
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
  gr.replaceENTemplateTags($form, $('.js-donationSummary'),fields,{start: "`", end: "`"});
  $('.js-amount').text(grGiving.getAmount(true));

  if(grGiving.isRecurring()) {
    $('.js-frequency').text(' monthly');
  } else {
    $('.js-frequency').text('');
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
		require('jqueryvalidate');

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
        validation_rules[fields.postal.name] = { required: true };
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
        /*validation_rules[fields.employer.name] = {
            required: function(element) {
                return $(fields.matching.selector).is(':checked');
            }
        }
        validation_rules[fields.inmem_type.name] = {
            required: function(element) {
                return $(fields.inmem.selector).is(':checked');
            },
            notEqual: 'Gift Type'
        }
        validation_rules[fields.inmem_name.name] = {
            required: function(element) {
                return $(fields.inmem.selector).is(':checked');
            }
        }*/

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
    classes[fields.recur_pay.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
    
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