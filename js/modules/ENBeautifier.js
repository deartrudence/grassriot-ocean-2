/**
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

var grHelpers = require('./GRHelpers');

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