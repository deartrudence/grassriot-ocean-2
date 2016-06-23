/**
 * GRUpsell module
 *
 * Managed functionality relating to upsell modals
 *
 * @version  0.3  !!MODIFIED20160211-MAJOR!! !!MODIFIED20160623-MAJOR!!
 * @requires jQuery, Bootstrap
 */
var requiredOptions = [
    'form',
    'donationAmountFieldSelector',
    'recurringFieldSelector',
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
    },
    'preventLaunch': function() { //@since v__
        return (
            (
            this.options.recurringField.val()=='Y'
            && ['checkbox','radio'].indexOf(this.options.recurringField.attr('type').toLowerCase()) === -1
            )
        || (
            this.options.recurringField.filter(':checked').length
            && this.options.recurringField.filter(':checked').val() == 'Y'
            && ['checkbox','radio'].indexOf(this.options.recurringField.attr('type').toLowerCase()) !== -1
            )
        );
    }
}

var protect = {
    initialAmount: 0,
    upsellAmount: 0
}

var grHelpers = require('./GRHelpers');

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

    //@since __ saving jQuery objects of fields
    this.options.donationAmountField = $(this.options.donationAmountFieldSelector);
    this.options.recurringField = $(this.options.recurringFieldSelector);
}

/**
 * Re-queries DOM for recurring and donation amount fields based on set selectors
 * @return null
 */
GRUpsell.prototype.refreshFields = function() {
    this.options.donationAmountField = $(this.options.donationAmountFieldSelector);
    this.options.recurringField = $(this.options.recurringFieldSelector);
}

GRUpsell.prototype.launch = function() {
    //@since __ re-query DOM during launch to confirm fields are still present and accurate
    this.refreshFields();
    
    var field = this.options.donationAmountField;
    var self = this;

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
        //@since __ removed hard-coded launch prevention based on recurring value and moved into a callback preventLaunch
        this.options.enabled === false 
        || this.initialAmount >= this.options.maxGift 
        || !this.exists
        || (typeof this.options.preventLaunch == "function" && this.options.preventLaunch.call(this))
         ) {
        
        return false;
    }

    this.upsellAmount = calculateUpsell.call(this, this.initialAmount);

    if(typeof this.options.preLaunchCallback === "function") {
        this.options.preLaunchCallback.call(this);
    }

    $(this.options.upsellContentSelector).find("."+this.options.donationAmountClass).text(this.initialAmount.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    //@since 0.3 assumes upsell amount is an input, not a span, updates upsellAmount based on input
    $(this.options.upsellContentSelector).find("."+this.options.upsellAmountClass)
        .val(this.upsellAmount.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2}))
        .on("change", function(e){
            var $target = $(e.target);
            var customValue = $target.val();
            this.upsellAmount = parseFloat(customValue);
            $target.val(this.upsellAmount.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2}));
        });

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