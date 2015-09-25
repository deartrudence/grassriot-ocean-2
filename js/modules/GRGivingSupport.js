/**
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
var currencyMap = require('./GRCurrencies');
var currencySymbols = require('./GRCurrencySymbols');
var grHelpers = require('./GRHelpers');
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
                var regions = require('./GRRegions-'+countries[i]);
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
