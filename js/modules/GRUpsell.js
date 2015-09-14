/**
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
    initialAmount = parseFloat(options.donationAmountField.val());

    if(options.enabled === false || initialAmount >= options.maxGift || options.recurringField.val()=='Y') 
        return false;

    upsellAmount = calculateUpsell(initialAmount);

    $(options.upsellContentSelector).find("."+options.donationAmountClass).text(initialAmount.toLocaleString());
    $(options.upsellContentSelector).find("."+options.upsellAmountClass).text(upsellAmount.toLocaleString());

    console.log('launching upsell');
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
        amt = parseFloat(amt);
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
    options.recurringField.val('');
    options.form.trigger("grupsell.declined", [initialAmount, upsellAmount]);
    $(options.upsellContentSelector).modal('hide');
    options.form.submit();
}

function handleUpsell(e) {
    e.preventDefault();
    options.recurringField.val('Y');
    options.donationAmountField.val(upsellAmount);
    options.form.trigger("grupsell.upsold", [initialAmount, upsellAmount]);
    $(options.upsellContentSelector).modal('hide');
    options.form.submit();
}


module.exports = GRUpsell;