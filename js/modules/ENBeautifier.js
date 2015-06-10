/**
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