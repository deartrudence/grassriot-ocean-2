//Beautifier configuration
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

var ENBeautifier = require('./modules/ENBeautifier');
var enbeautifier;

// slick carousel slider
// var slick = require('slick');

//hero configuration
var hero = ".js-hero";
var heroImage = ".js-hero-image";
var heroText = ".js-hero-text";
var heroVideo = ".js-hero-video";
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
var formLanguage = $('html').attr('lang');
var monthlyText = (formLanguage == 'fr-ca' ? ' Chaque&nbsp;mois' : ' Monthly');
var windowSize;

//Upsell
var GRUpsell = require('./modules/GRUpsell');
var grupsell;
var upsellContentSelector = '#upsell-modal';
var $upsellOfferCeiling = $('.js-offerUpsellBelow');

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
    email:      'Email Address',
    fname:      'First Name',
    //mname:      'Middle_Name', 
    lname:      'Last Name',
    street1:    'Address 1',
    street2:    'Address 2',
    city:       'City',
    region:     'Province',
    postal:     'Postal Code',
    country:    'Country',
    phone:      'Mobile Phone',
    pay_type:   'Payment Type',
    cardholder: 'Card Holder Name',
    cc_num:     'Credit Card Number',
    cc_cvv:     'CVV Code',
    cc_exp:     'Credit Card Expiration',
    /*bank_name:  'DD Bank Name',
    bank_acct:  'DD Bank Account Number',
    bank_branch:'DD Branch Number',
    bank_inst:  'DD Institution Number',
    bank_day:   'DD Pref Processing Date',
    bank_amt:   'DD Donation Amount',
    bank_restrict: 'DD Direct Gift',
    bank_auth:  'Accept Terms',*/
    amt:        'Donation Amount',
    currency:   'Currency',
    recur_pay:  'Recurring Payment',
    recur_freq: 'Recurring Frequency',
    recur_day:  'Recurring Day',
    optin:      'opt-in-cem',
    optin_fr:   'Opt-In French',
    /*restrict:   'Direct Gift',
    comments:   'Additional Comments',*/
    upsell_track: 'Upsell Status',
    /*giftaid:    'Gift Aid',
    ref_camp_id:'Referring Campaign Id',
    matching:   'Matching Gift', */
    /*from_org:   'Company Gift',
    org_fname:  'Contact Persons Name',
    org_lname:  'Contact Last Name',
    org_email:  'Other Email',
    employer:   'Organization Name',
    inmem_type:  'Tribute Options',    //'In honour or in memoriam',
    inmem_inhon: 'In Memoriam',
    inmem_name:     'Memoriam Name',
    inmem_msg:      'Memoriam Message',
    inmem_from:     'Memoriam Sender',
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
    addrtype:       'Addr_Type'*/
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
  ".js-hero": [".js-heroContent",".js-raygunMonthlyDDError"],
  ".js-campaign": ".js-campaignText",
  ".js-impact": ".js-impactText",
  ".js-cta-ask": ".js-ctaAskText",
  ".js-other-ways": ".js-otherWaysToGive", 
  ".js-response": ".js-responseText",
  ".js-accountable": ".js-accountableText",
  ".js-gift": ".js-giftText",
  ".js-policy": ".js-policyText",
  ".js-footer": ".js-footerText",
  '.js-formOpen-label': '.js-formOpen-labelText'
};
var ENBeautifierFillersContainers = {
  '#gr_donation': [
    '.js-formHeader',
    '#'+fields.recur_pay.nameNoSpace+'Div', 
    '#'+fields.amt.nameNoSpace+'Div',
    //'#'+fields.bank_amt.nameNoSpace+'Div',
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
    '#'+fields.optin.nameNoSpace+'Div',
    '#'+fields.optin_fr.nameNoSpace+'Div'
  ],
  /*'#gr_options': [
    '#'+fields.restrict.nameNoSpace+'Div',
    '.js-donationOptions',
    '#'+fields.from_org.nameNoSpace+'Div',
    '#'+fields.inmem_inhon.nameNoSpace+'Div',
    '#'+fields.inmem_type.nameNoSpace+'Div'
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
  ],*/
  '#gr_payment': [
    '.js-paymentInformation', 
    '#'+fields.pay_type.nameNoSpace+'Div', 
    //'#CC_ImagesDiv', 
    '#'+fields.cardholder.nameNoSpace+'Div', 
    '#'+fields.cc_num.nameNoSpace+'Div', 
    '#'+fields.cc_cvv.nameNoSpace+'Div', 
    '#'+fields.cc_exp.nameNoSpace+'Div',
    /*'#'+fields.bank_name.nameNoSpace+'Div', 
    '#'+fields.bank_acct.nameNoSpace+'Div', 
    '#'+fields.bank_branch.nameNoSpace+'Div', 
    '#'+fields.bank_inst.nameNoSpace+'Div',
    '#'+fields.bank_day.nameNoSpace+'Div',
    '#'+fields.bank_auth.nameNoSpace+'Div',
    '.js-donationSummary',
    '.js-instructionsAndComment',
    '#'+fields.comments.nameNoSpace+'Div'*/
  ],
};

var campaignIdMap = {};

var GRaygun = require('./modules/GRaygun');
var raygunFilterFields = ['password', 'credit_card', fields.cc_num.name, fields.cc_cvv.name];
var graygunner = new GRaygun({filter: raygunFilterFields});

var $ = require('jquery');
require("modernizr");
require("modal");
require("tooltip");
require("popover");

var $submit;
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
    var trackerName = false;
    //this doesn't work due to asynchronous loading - not necessary because regular google analytics is installed
    /*if(typeof ga !== "undefined" && ga.getAll().length) {
      trackerName = ga.getAll()[0].get('name');
    }
    console.log(trackerName);*/
    grAnalytics = new GRAnalytics({
        form: $form,
        ignoreGTM: true,
        gtmTrackerName: trackerName,
        'events': [ 
            
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
                        //bottom: 0
                    }
                });
            $("#grdonation").css('height','');
            // $affixForm.affix('checkPosition');
        }
        else {
            $("#grdonation").css('height','auto');
            $affixForm.css('right','');
            $affixForm.addClass("no-affix");
        }
    }
    else{
    }
}

function setContainerOffset($affixForm, $container) {
//    $affixForm.css('right', (Math.round($(window).width()) - Math.round($container.offset().left) - $container.outerWidth() + 1).toString() + 'px'); //(parseInt($container.css('margin-right')) + parseInt($container.css('padding-right'))).toString() + 'px');
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
        //NCC only - throw error if class denoting the Bank Direct Debit page 1 is present [users should never land on this page]
        /*if($('.js-raygunMonthlyDDError').length) {
          try {
              throw new Error("Direct Debit Page 1");
          }
          catch (error) {
            graygunner.sendError(error, {
                data: {
                    errors: ($('#eaerrors').length ? $('#eaerrors').text() : 'none reported')
                },
                forms: [ENFormSelector]
            });
          }
        }*/

        //look for campaign id settings, if missing, assign a default value
        /*campaignIdMap = {
          CA: ($('.js-campaignId-CA').length ? $('.js-campaignId-CA').text() : $('input[name="ea.campaign.id"]').val()),
          US: ($('.js-campaignId-USINT').length ? $('.js-campaignId-USINT').text() : $('input[name="ea.campaign.id"]').val()),
          DD: ($('.js-campaignId-BANK').length ? $('.js-campaignId-BANK').text() : null)
        }*/

        //complete remove bank direct deposit as a payment option if no campaign id is set
        /*if(campaignIdMap.DD === null) {
          $(fields.pay_type.selector).children().filter( function() {
            return this.value.toLowerCase() == 'bank direct deposit';
          }).remove();
        }*/

        //payment processor-related fields
        var paymentTypeOptions = $(fields.pay_type.selector).children('option');
        var ccFields = ['#'+fields.cardholder.nameNoSpace+'Div','#'+fields.cc_num.nameNoSpace+'Div', '#'+fields.cc_cvv.nameNoSpace+'Div', '#'+fields.cc_exp.nameNoSpace+'Field'];
        /*var ddFields = ['#'+fields.bank_name.nameNoSpace+'Div', '#'+fields.bank_auth.nameNoSpace+'Div', '#'+fields.bank_day.nameNoSpace+'Div', '#'+fields.bank_acct.nameNoSpace+'Div', '#'+fields.bank_branch.nameNoSpace+'Div', '#'+fields.bank_inst.nameNoSpace+'Div'];*/

        //set recurring day automatically when form loads
        var recurringDay = 1;
        var todaysDay = new Date().getDate();
        if(todaysDay > 1 && todaysDay <=15) {
          recurringDay = 15;
        } else if(todaysDay > 15) {
          recurringDay = 29;
        }
        $(fields.recur_day.selector).val(recurringDay);

        /*if(formLanguage == 'fr-ca') {
          $(fields.sec_billing.selector).sibling('label').text('Utiliser cette adresse pour la facturation');
          $(fields.inmem_inhon.selector).sibling('label').text('En l’honneur de ou In memoriam');
        }*/
        

        $(hero).css('background-image', 'url('+$(heroImage).attr('src')+')');
        $(cta).css('background-image', 'url('+$(ctaImage).attr('src')+')');
        if ( $('#slider #slides').length ) {
          $('#slider #slides').cycle({
            next: $('#slider .nav .next'),
            prev: $('#slider .nav .prev'),
            slides: $('#slides > li'),
            timeout: 5000,
            pager: '.pager',
            pagerActiveClass: 'activeSlide',
            pagerTemplate: '<a href="#" class="dot"></a>',
            pauseOnHover: true
          });
        }

        //Swap fields on post-back
        /*if(
          typeof fields.sec_billing != "undefined"
          && $(fields.sec_billing.selector).length 
          && !$(fields.sec_billing.selector).prop('disabled')
          && $(fields.sec_billing.selector).is(":checked")) {
          swapFields();
        }*/

        enbeautifier.addClasses(getFormClasses());
        //var selectorClasses = {};
        //selectorClasses[fields.from_org.selector] = { classes: "radiobutton", targetElement: "div.eaFormField"};
        //selectorClasses[fields.inmem_inhon.selector] = { classes: "radiobutton", targetElement: "div.eaFormField"};
        //enbeautifier.addClasses(selectorClasses);

        $("#"+fields.cc_exp.nameNoSpace+"Div").html( function(i,h) { 
                    return h.replace(/&nbsp;/g,'');
                });

    	  //Set up panel steps
        formSteps = new GRSteps({
          activeClass: 'active',
          useCSSAnimation: false,
          indicatorTarget: '.steps-list ul',
          steps: $("#gr_donation,#gr_details,#gr_payment"),
          stepLabels: [
            ($('.js-step1-labelText').length ? $('.js-step1-labelText').text() : 'Amount'), 
            ($('.js-step2-labelText').length ? $('.js-step2-labelText').text() : 'Billing'), 
            ($('.js-step3-labelText').length ? $('.js-step3-labelText').text() : 'Payment')
          ],
          addButtons: true,
          backButton: ($('.js-backButton-labelHTML').length ? $('.js-backButton-labelHTML').html() : 'go back'),
          stepButton: ($('.js-nextButton-labelHTML').length ? $('.js-nextButton-labelHTML').html() : 'Next'),
          //actionButton: ($('.js-actionButton-labelText').length ? $('.js-actionButton-labelText').html() : 'Donate'),
          target: "#window",
          stepHandler:[
            //step 1 handler
            function(){
              formErrors = [ ];
              $("#gr_donation").find("input,select,textarea").not(':disabled').valid();
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
              $("#gr_details").find("input,select,textarea").not(':disabled').valid();
              if(formErrors.length) {
                handleErrors(formErrors);
                return false;
              } else {
                grAnalytics.analyticsReport( 'payment/page2-complete' );
                return true;
              }
            },
            //step 6 handler
            function(){
              formErrors = [ ];
              //let the stepper handle any errors
              if( !$("#gr_payment").find("input,select,textarea").not(':disabled').valid() ){
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

        //add the message
        //$("#gr_donation").append($(".js-form-explainer"));

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
                {label: 'One-time<br /> Donation', 'value': ''},
                {label: 'Give<br /> monthly', 'value': 'Y'}
            ],
            processorFields: { 
                'Paypal': {
                    hide: ccFields//.concat(ddFields)
                },
                'Visa': {
                    show: ccFields,
                    //hide: ddFields
                },
                'MasterCard': {
                    show: ccFields,
                    //hide: ddFields
                },
                'AMEX': {
                    show: ccFields,
                    //hide: ddFields
                },
                /*'Bank Direct Deposit': {
                    show: ddFields,
                    hide: ccFields
                },*/
                '': { //hide fields if no payment type is selected
                  hide: ccFields//.concat(ddFields)
                }
            }

        });
        //bank payment option
        /*$(fields.pay_type.selector).on('change', function() {
          if($(this).val() == 'Bank Direct Deposit') {
            $(fields.bank_restrict.selector).val($(fields.restrict.selector).val());
            $(fields.bank_amt.selector).val(grGiving.getAmount());
            $('input[name="ea.campaign.id"]').val(campaignIdMap.DD);
          } else {
            $(fields.bank_restrict.selector).val('');
            $(fields.bank_amt.selector).val('');
            updateCampaignId();
          }
        }).trigger('change');*/

        //change the submit button when the amount changes
        $submit = $("#gr_payment").find(".btn-next").addClass("button-submit");    
        $form
          .on(
            'change',
            'input[name="'+fields.amt.name+'"], input[name="Donation Amount Other"], input[name="'+fields.recur_pay.name+'"]',
            function(e) { 
                updateButtonText();
            })
          /*.on(
            'change',
            fields.country.selector,
            handleCountryChange)*/
          .on('submit', sendDonation);
        updateButtonText();

        //add name to submit button for EN
        $submit.attr("name", "submitter");
        
        //Remove the original donate input
        //TODO: integrate this in to the actual form code
        $('input[name="'+fields.amt.name+'"][type="text"]').remove();

        grupsell = new GRUpsell({
            form: $form,
            recurringFieldSelector: fields.recur_pay.selector,
            donationAmountFieldSelector: fields.amt.selector,
            upsellContentSelector: upsellContentSelector,
            upsellMethod: 'function',
            maxGift: ($upsellOfferCeiling.length && !isNaN(parseFloat($upsellOfferCeiling.text())) ? parseFloat($upsellOfferCeiling.text()) : 500),
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
                $(fields.upsell_track.selector).val('N-'+this.initialAmount);
                grAnalytics.analyticsReport( 'payment/upsell-declined/' );
                $(".se-pre-con").fadeIn("slow");
            },
            upsellCallback: function(){
                $(fields.upsell_track.selector).val('Y-'+this.initialAmount);
                grAnalytics.analyticsReport( 'payment/upsell-accepted/' );
                $(".se-pre-con").fadeIn("slow");
            },
            preventLaunch: function() {
              return (
                grGiving.isRecurring() 
                || $(fields.pay_type.selector).val().toLowerCase() == 'paypal'
              );
            },
            onDeclineFormUpdates: function() { 
                this.options.recurringField.filter(':checked').val('');
            },
            onUpsellFormUpdates: function() {
                this.options.recurringField.filter(':checked').val('Y');
                this.options.donationAmountField.val(this.upsellAmount);
            },
            preLaunchCallback: function() {
                grAnalytics.analyticsReport( 'payment/upsell-launched/' );
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
    grupsell.launch();

    $form.removeAttr('onsubmit');
    setupSecurityNotice();

    //setupDonationOptions();

		setupMobileButton();

    //if the video is requested, show it
    
    require.ensure([],function(require){
      var browser = require("bowser");

      if($(heroVideo).length && $.trim($(heroVideo).text()) != "") {

        var $video = $(heroVideo);
        var $container = $video.parent();
        $container.addClass("is-videoPlaceholder");
        //$container.find(".heroTitle").prepend('<span class="glyphicon glyphicon-play"></span><br />');
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
              .removeClass("hide");

            $container.addClass("is-videoContainer");
            $(".page-header").hide();
          }
        });
        
      }
    }, 'app-video');
	} catch(error) {
		graygunner.sendError(error);
	}
}

function updateButtonText() {
  $submit.html(($('.js-actionButton-labelText').length ? $('.js-actionButton-labelText').text() : 'Donate')+" " + grGiving.getAmount(true, formLanguage) + (grGiving.isRecurring() ? monthlyText : ''));
}

function setupDonationOptions() {
  /*var initialState = true;

  $donationSummary.after($donationSummaryRaw);

  $('#'+fields.comments.nameNoSpace+'Div').find('textarea').prop('disabled', true);
  $form.on('click', '.js-toggleComments', function(e) {
    e.preventDefault();
    $('#'+fields.comments.nameNoSpace+'Div').slideToggle();
    $('#'+fields.comments.nameNoSpace+'Div').find('textarea').prop('disabled', !$('#'+fields.comments.nameNoSpace+'Div').find('textarea').prop('disabled'));
  });
  if($(fields.comments.selector).val() != '') {
    $('.js-toggleComments').click();
  }*/

  /*$(fields.inmem.selector).data('deselect',fields.inhonor.selector);
  $(fields.inhonor.selector).data('deselect',fields.inmem.selector);

  if($(fields.inmem.selector+','+fields.inhonor.selector).filter(':checked').length == 0) {
    $(fields.inmem.selector).prop('checked',true).change();
  }*/

  //show/hide optional steps based on user selections
  /*$form.on('change', fields.inmem_inhon.selector, function(e) {
    var actionName;
    if($(this).is(":checked")) {
        formSteps.showStep(3);
        $(fields.inmem_type.selector).closest('.'+formFieldContainerClass).show();
        actionName = 'payment/selected-in-memorial-in-honour';
    } else {
        formSteps.hideStep(3);
        $(fields.inmem_type.selector).prop('checked', false).closest('.'+formFieldContainerClass).hide();
        $('.js-honourGift,.js-memorialGift').hide();
        actionName = 'payment/unselected-in-memorial-in-honour';
    }
    if(!initialState) {
      grAnalytics.analyticsReport( actionName );
    }
  });
  $form.on('change', fields.from_org.selector, function(e) {
    var actionName;
    if($(this).is(":checked")) {
        formSteps.showStep(4);
        $('.js-personalGift').hide();
        $('.js-orgGift').show();
        actionName = 'payment/selected-company-gift';
    } else {
        formSteps.hideStep(4);
        $('.js-orgGift').hide();
        $('.js-personalGift').show();
        actionName = 'payment/unselected-company-gift';
    }
    if(!initialState) {
      grAnalytics.analyticsReport( actionName );
    }
  });

  //

  $form.on('change', fields.inmem_type.selector, function(e) {
      switch($(this).filter(':checked').val()) {
          case 'inmemoriam':
              $('.js-memorialGift').show().find('input, select, textarea').prop('disabled', false);
              $('.js-honourGift').hide().find('input, select, textarea').prop('disabled', true);

          break;
          case 'inhonour':
              $('.js-memorialGift').hide().find('input, select, textarea').prop('disabled', true);
              $('.js-honourGift').show().find('input, select, textarea').prop('disabled', false);
          break;
      }

      /*if($(this).is(':checked')) {
          $($(this).data('deselect')).prop("checked", false);
      }*/
  /*});

  $form.on('change', fields.inform.selector+":checked", function() {
    switch($(this).filter(':checked').val()) {
      case 'mail':
        $('.js-informMail').removeClass('hide').find('input, select, textarea').prop('disabled', false);
      break;

      case 'no': 
        $('.js-informMail').addClass('hide').find('input, select, textarea').prop('disabled', true);
      break;
    }

  });

  $form.find(fields.inmem_inhon.selector+','+fields.from_org.selector).trigger('change');
  $form.find(fields.inmem_type.selector+','+fields.inform.selector).filter(':checked').trigger('change');
  initialState = false;*/
}

/**
 * Swaps the values of a set of fields to another.  The fieldsToSwap is an Object with only key/value pairs where the keys are one field indentifier and the values are the other field identifier [both strings].
 */
/*function swapFields() {
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

function updateCampaignId() {
  var selectedCampaignId = campaignIdMap.CA;

  if(getBillingCountry() != "Canada") {
    selectedCampaignId = campaignIdMap.US;
  }

  $('input[name="ea.campaign.id"]').val(selectedCampaignId);
}

function getBillingCountry() {
  var billingCountryField = fields.country;

  if($(fields.sec_billing.selector).is(':checked')) {
    billingCountryField = fields.sec_country;
  }

  return $(billingCountryField.selector).val();
}*/

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
        $(hero).css('background-image', 'url('+$(heroImage).attr('src')+')');
        $("body").addClass("post-action");
        $('.heroLogo img').addClass('page-logo').attr('src', $('.page-logo').attr('src').replace('logo', 'logo-post-action') ).wrap('<a href="http://rethinkbreastcancer.com/"></a>');
        $('.heroLogo').addClass('mobile-center').removeClass('heroLogo');
        $transaction_details = $(".js-transactionDetails");

        //handle post action summary text
        var $heroSummary = $('.js-heroSummary');
        $heroSummary.find('.js-dynamicField').each(function() {
          if($.trim($(this).text()).length === 0) {
            $(this).closest('.js-dynamicFieldContainer').hide();
          }
        });
        if($.trim($heroSummary.find('.js-orgGift').text()).length) {
          $heroSummary.find('.js-personalGift').hide();
        }
        if($transaction_details.find(".frequency").text() === "ACTIVE") {
          $('.js-heroSummary').find('.js-frequency').text(' '+monthlyText.toLowerCase());
        }


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
        grAnalytics.eCommerceReport(transactionData, itemData);


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
          '.js-campaign': '.eaFullWidthContent',
          //'.js-campaign': '.eaLeftColumnContent',
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

/*function buildDonationSummary() {
  $donationSummary.html($donationSummaryRaw.html());
  gr.replaceENTemplateTags($form, $donationSummary,fields,{start: "`", end: "`"});
  $donationSummary.find('.js-amount').text(grGiving.getAmount(true));

  if(grGiving.isRecurring()) {
    $donationSummary.find('.js-frequency').text(' monthly');
  } else {
    $donationSummary.find('.js-frequency').text('');
  }

}*/

/**
 * [setupSecurityNotice description]
 * @return {[type]} [description]
 */
function setupSecurityNotice(){
  var $security = $(".security");
  var $text = $security.find(".security-fulltext");
  var text = $text.text();
  $text.remove();

  $security.find(".security-text").popover({
      content: text,
      placement: 'bottom'
    })
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
		$(this).closest(".is-active").removeClass("is-active");
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
/*function addStringerStat(response){
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
}*/

//////////////////////////////
// Everything else goes here
//////////////////////////////

/**
 * [sendDonation description]
 * @param  {[type]} form [description]
 * @return {[type]}      [description]
 */
function sendDonation(e) {
  
    grAnalytics.analyticsReport( 'payment/donate-'+grGiving.getProcessor().toLowerCase().replace(/\s/g, '') );
    // if (payment == "PayPal") {
    //     $paypalForm = $('.js-paypal-'+donation_type+'-form');
    //     for(var i=0; i < paypal_field_map.length; i++) {
    //         $paypalForm.find('[name="'+paypal_field_map[i]['pp-'+donation_type]+'"]').val($(form).find('[name="'+paypal_field_map[i].en+'"]').not('a').val());
    //     }
    //     $paypalForm.submit();
    // }
    // else
    //     form.submit();
    gr.disableButtons($form);
    e.preventDefault();

    //detach ourselves
    $form.off("submit");

    //if not a recurring donation, launch the upsell.
    if(
        //validated
        grupsell.exists 
        && grupsell.launch()
    ) {
        return false;
    }
    else/* if(validated)*/ {
        $(".se-pre-con").fadeIn("slow");
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
                invalidPhone: 'Please specify a valid phone number',
                invalidBranch: 'Invalid branch number',
                invalidInstitution: 'Invalid institution number'
            },
            nowDate = new Date();

        if(formLanguage=='fr-ca') {
          errorMessages = {
                invalidMonth: 'Mois invalide',
                invalidCVV: 'Numéro de vérification invalide',
                invalidAmount: 'Seulement les dons de 5 à 10 000 $ sont acceptés en ligne',
                invalidDate: 'Date invalide',
                invalidEmail: 'Veuillez saisir une adresse courriel valide',
                invalidPcode: 'Veuillez saisir un code postal valide',
                invalidPhone: 'Veuillez saisir un numéro de téléphone valide',
                invalidBranch: 'Invalid branch number',
                invalidInstitution: 'Invalid institution number'
            };

        }

        $.validator.addMethod('isValidDonation', function (value, element) {
            // Converts to string for processing.
            value += '';

            // Only numbers or digits. 
            // Allows use currency symbol in the start of line or in the end.
            var regExp = /^\s?([$£€]?\s{0,1}(\d+[\d\s,]*\.?\d+|\d+)|(\d+[\d\s,]*\.?\d+|\d+)\s{0,1}[$£€]?)\s?$/g;

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

        $.validator.addMethod('isBankBranch', function (value, element) {
            var regexBranch = /^\d{5}$/;
            return regexBranch.test(value);
        }, errorMessages.invalidBranch);

        $.validator.addMethod('isBankInstitution', function (value, element) {
            var regexInstitution = /^\d{3}$/;
            return regexInstitution.test(value);
        }, errorMessages.invalidInstitution);

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
            return $(fields.country.selector).val() == "CA";
          }
        };
        validation_rules[fields.pay_type.name] = "required";

        //credit card fields
        validation_rules[fields.cardholder.name] = {
            required: function(element) {
              return (
                $(fields.pay_type.selector).val().toLowerCase() != 'paypal' 
                && $(fields.pay_type.selector).val().toLowerCase() != 'bank direct deposit'
              ) 
            }
        };
        validation_rules[fields.cc_num.name] = {
            required: function(element) {
              return (
                $(fields.pay_type.selector).val().toLowerCase() != 'paypal' 
                && $(fields.pay_type.selector).val().toLowerCase() != 'bank direct deposit'
              ) 
            },
            stripspaces: true,
            creditcard: true
        };
        validation_rules[fields.cc_cvv.name] = {
            required: function(element) {
              return (
                $(fields.pay_type.selector).val().toLowerCase() != 'paypal' 
                && $(fields.pay_type.selector).val().toLowerCase() != 'bank direct deposit'
              ) 
            },
            isCVV: true //note: AMEX CVVs are 4 digits but currently handled through PayPal
        };
        validation_rules[fields.cc_exp.name+"1"] = {
            required: function(element) {
              return (
                $(fields.pay_type.selector).val().toLowerCase() != 'paypal' 
                && $(fields.pay_type.selector).val().toLowerCase() != 'bank direct deposit'
              ) 
            },
            isMonth: true
        };
        validation_rules[fields.cc_exp.name+"2"] = {
            required: function(element) {
              return (
                $(fields.pay_type.selector).val().toLowerCase() != 'paypal' 
                && $(fields.pay_type.selector).val().toLowerCase() != 'bank direct deposit'
              ) 
            },
            isNowOrFutureYear: true,
            isFuture: true
        };

        //bank fields
        /*validation_rules[fields.bank_name.name] = {
            required: function(element) {
              return ($(fields.pay_type.selector).val().toLowerCase() == 'bank direct deposit') 
            }
        };
        validation_rules[fields.bank_acct.name] = {
            required: function(element) {
              return ($(fields.pay_type.selector).val().toLowerCase() == 'bank direct deposit') 
            },
            number: true
        };
        validation_rules[fields.bank_branch.name] = {
            required: function(element) {
              return ($(fields.pay_type.selector).val().toLowerCase() == 'bank direct deposit') 
            },
            isBankBranch: true
        };
        validation_rules[fields.bank_inst.name] = {
            required: function(element) {
              return ($(fields.pay_type.selector).val().toLowerCase() == 'bank direct deposit') 
            },
            isBankInstitution: true
        };
        validation_rules[fields.bank_auth.name] = {
            required: function(element) {
              return ($(fields.pay_type.selector).val().toLowerCase() == 'bank direct deposit') 
            }
        };*/

        validation_rules[fields.amt.name] = {
            required: true,
            isValidDonation: true
        };
        /*validation_rules[fields.employer.name] = {
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
        validation_rules[fields.inmem_type.name] = {
            required: function(element) {
                return $(fields.inmem_inhon.selector).is(':checked');
            }
        }
        validation_rules[fields.inhonor.name] = {
            required: function(element) {
                return $(fields.inmem_inhon.selector).is(':checked') && !$(fields.inmem.selector).is(':checked');
            }
        }
        validation_rules[fields.inmem_name.name] = {
            required: function(element) {
                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inmem_type.selector).filter(':checked').val() == 'inmemoriam';
            }
        }
        validation_rules[fields.inmem_msg.name] = {
            required: function(element) {
                return $(fields.inform.selector).filter(':checked').val() == "mail";
            }
        }
        validation_rules[fields.inmem_from.name] = {
            required: function(element) {
                return $(fields.inform.selector).filter(':checked').val() == "mail";
            }
        }
        validation_rules[fields.inhonor_name.name] = {
            required: function(element) {
                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inmem_type.selector).filter(':checked').val() == 'inhonour';
            }
        }
        validation_rules[fields.inhonor_occ.name] = {
            required: function(element) {
                return $(fields.inmem_inhon.selector).is(':checked') && $(fields.inmem_type.selector).filter(':checked').val() == 'inhonour';
            }
        }
        validation_rules[fields.inhonor_msg.name] = {
            required: function(element) {
                return $(fields.inform.selector).filter(':checked').val() == "mail";
            }
        }
        validation_rules[fields.inhonor_from.name] = {
            required: function(element) {
                return $(fields.inform.selector).filter(':checked').val() == "mail";
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
                //demoGroup: "First Name",
                //ccExpiryDate: "Credit Card Expiration 1 "
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
    var inputNamesMapper = { };
    var isRequired = ' is required.';

    //standard fields
    /*inputNamesMapper[fields.postal.name] = 'Postal Code';
    inputNamesMapper[fields.city.name] = 'City / Town';
    inputNamesMapper[fields.street1.name] = 'Address 1';
    inputNamesMapper[fields.region.name] = 'State / Province / Region';
    inputNamesMapper[fields.pay_type.name] = 'Payment Method';*/
    inputNamesMapper[fields.cc_exp.name+'1'] = 'Credit Card Expiration MM';
    inputNamesMapper[fields.cc_exp.name+'2'] = 'Credit Card Expiration YYYY';
    inputNamesMapper[fields.cc_cvv.name] = 'CVV2 Code';

    //donation option fields
    //inputNamesMapper[fields.inmem_type.name] = 'In honour/in memoriam selection';

    //bank payment
    //inputNamesMapper[fields.bank_auth.name] = 'Accepting NCC\'s Pre-authorized Debit Agreement';

    if(formLanguage=='fr-ca') {
      inputNamesMapper[fields.cc_exp.name+'1'] = 'Le mois d’expiration de la carte de crédit est';
      inputNamesMapper[fields.cc_exp.name+'2'] = 'L’année d’expiration de la carte de crédit est';
      inputNamesMapper[fields.cc_cvv.name] = 'Le code CVV2 de la carte de crédit est';
      inputNamesMapper[fields.inmem_type.name] = 'Veuillez sélectionner En l’honneur de ou In memoriam';
      inputNamesMapper[fields.bank_auth.name] = 'Veuillez accepter les conditions du prélèvement automatique par CNC';
      isRequired = ' requis';
    }

    for (var i in errors) {
        var inputName = $(errors[i].element)
                .attr('name'),
            errorType = errors[i].method,
            errorMessage = '';

        var inputLabel = $.trim($('label[for="'+$(errors[i].element).attr('id')+'"]').text().replace(/\*$/, ''));

        inputName = inputNamesMapper[inputName] || inputLabel || inputName;

        if(errorElements.indexOf(inputName) != -1) {
            continue;
        } else {
            errorElements.push(inputName);
        }

        // Checking and replacing standard error message.
        if (errorType === 'required'
            && errors[i].message === 'This field is required.') {
            errorMessage = inputName + isRequired;
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
    
    //Credit card payment fields
    classes[fields.pay_type.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.cc_num.selector] = { classes: "inline-block-field-wrap three-fifths-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.cc_cvv.selector] = { classes: "inline-block-field-wrap two-fifths-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
    classes['[name="'+fields.cc_exp.name+'1"]'] = { classes: "inline-block-field-wrap half-wrap", targetElement: ".eaSplitSelectfield"};
    classes['[name="'+fields.cc_exp.name+'2"]'] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: ".eaSplitSelectfield"};
    classes['#'+fields.cc_exp.nameNoSpace+'1'] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
    classes['#'+fields.cc_exp.nameNoSpace+'1'] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};

    //Bank fields
    /*classes[fields.bank_name.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.bank_day.selector] = { classes: "inline-block-field-wrap full-wrap show-label", targetElement: "div.eaFullWidthContent"};
    classes[fields.bank_acct.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.bank_branch.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.bank_inst.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.bank_auth.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};*/

    //Donation option fields
    /*classes[fields.restrict.selector] = { classes: "inline-block-field-wrap full-wrap show-label label-100", targetElement: "div.eaFullWidthContent"};
    classes[fields.from_org.selector] = { classes: "show-label", targetElement: "div.eaFullWidthContent"};
    classes[fields.inmem_inhon.selector] = { classes: "hide-label ", targetElement: "div.eaFullWidthContent"};*/

    //In memorial fields
    /*classes[fields.inmem_type.selector] = { classes: "inline-block-field-wrap full-wrap hide-label", targetElement: "div.eaFullWidthContent"};
    classes[fields.inmem_name.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift", targetElement: "div.eaFullWidthContent"};
    classes[fields.inmem_msg.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inmem_from.selector] = { classes: "inline-block-field-wrap full-wrap js-memorialGift hide js-informMail", targetElement: "div.eaFullWidthContent"};*/

    //In honour fields
    /*classes[fields.inhonor_name.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift", targetElement: "div.eaFullWidthContent"};
    classes[fields.inhonor_occ.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift", targetElement: "div.eaFullWidthContent"};
    classes[fields.inhonor_msg.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inhonor_from.selector] = { classes: "inline-block-field-wrap full-wrap js-honourGift hide js-informMail", targetElement: "div.eaFullWidthContent"};*/

    //Inform fields
    /*classes[fields.inform_recip.selector] = { classes: "inline-block-field-wrap full-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_street1.selector] = { classes: "inline-block-field-wrap hide js-informMail three-quarter-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_street2.selector] = { classes: "inline-block-field-wrap last-wrap hide js-informMail one-quarter-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_city.selector] = { classes: "inline-block-field-wrap half-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_postal.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_country.selector] = { classes: "inline-block-field-wrap half-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};
    classes[fields.inform_region.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap hide js-informMail", targetElement: "div.eaFullWidthContent"};*/

    //Company fields
    /*classes[fields.org_fname.selector] = { classes: "inline-block-field-wrap half-wrap ", targetElement: "div.eaFullWidthContent"};
    classes[fields.org_lname.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.org_email.selector] = { classes: "inline-block-field-wrap full-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_street1.selector] = { classes: "inline-block-field-wrap three-quarter-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_street2.selector] = { classes: "inline-block-field-wrap last-wrap one-quarter-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_city.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_postal.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_country.selector] = { classes: "inline-block-field-wrap half-wrap", targetElement: "div.eaFullWidthContent"};
    classes[fields.sec_region.selector] = { classes: "inline-block-field-wrap half-wrap last-wrap", targetElement: "div.eaFullWidthContent"};*/
    

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