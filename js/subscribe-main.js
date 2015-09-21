var ENFormSelector = '.eaform';
var ENBeautifier = require('./modules/ENBeautifier');
var beautifier;

var GRaygun = require('./modules/GRaygun');
// var graygunner = new GRaygun();
var formErrors = [ ];

var GRAnalytics = require('./modules/GRAnalytics');
var grAnalytics;

var $form = $('.eaform');
var $columnContainer;
var $leftColumn;
var $rightColumn;
var $validErrModal = $("#validErrModal");
var isUnsubscribe = false;

//Main event
$(document).ready(init);

function init() {
    grAnalytics = new GRAnalytics({
        form: $form,
        'events': [ 
        ]
    });


    sortTwoColumn();
    $columnContainer = $(".en_wrapper");
    $leftColumn = $("#left_wrapper1");
    $rightColumn = $("#right_wrapper1");

    $(".eaQuestionTextareaFormFieldContainer").prev(".eaQuestionLabel").addClass("fullwidth");
    if ( $('.eaRightColumnContent').length != 0 )
    {
        var sub = $(".eaSubmitResetButtonGroup").detach();
        $(".en_right_wrapper:last").append(sub);
    }
    
    beautifier = new ENBeautifier({
        form: $form
    });
    beautifier.usePlaceholders(false);

    //handle image and caption
    $('.hero').css('background-image', 'url('+$leftColumn.children("div:first").find("img").attr("src")+')');
    $('.hero').append($leftColumn.children("div:first").find("p").addClass("heroCaption"));
    //$leftColumn.children("div:first").remove();
    
    if(typeof window.unsubscribePage !== "undefined" && window.unsubscribePage == true) {
        init_unsubscribe();
        $("body").addClass("is-unsubscribe");
        isUnsubscribe = true;
    }
    else{
        $("body").addClass("not-unsubscribe");
    }

    init_validation();
}

/**
 * [init_unsubscribe description]
 * @return {[type]} [description]
 */
function init_unsubscribe() {
    $form.find('input[name="Accepts Electronic Communications"]').not('[type="hidden"]').remove();
    $form.find('input[type="checkbox"]').prop("checked", true);
}

/**
 * [init_validation description]
 * @return {[type]} [description]
 */
function init_validation(){
    try{
        require('jqueryvalidate');

        var errorMessages = {
                invalidMonth: 'Invalid month',
                invalidCVV: 'Invalid verification number',
                invalidAmount: 'Invalid donation amount',
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
            //allow empty values
            if(value.length === 0){
                return true;
            }

            var regexPcode = /^([a-zA-Z]\d[a-zA-z]( )?\d[a-zA-Z]\d)$/;
            return regexPcode.test(value);
        }, errorMessages.invalidPcode);

        if(isUnsubscribe){
            var validation_rules = {
                "Email Address": {
                    required: true,
                    emailTLD: true
                }
            };
        }
        else{
            var validation_rules = {
                "First Name": "required",
                "Last Name": "required",
                "Email Address": {
                    required: true,
                    emailTLD: true
                },
                "Postcode": {
                    isPostcodeCA: true
                }
            };   
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
            groups: {
                demoGroup: "First Name",
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
            }            
        });

    }
    catch(error){
        // graygunner.sendError(error);
    }
}

/**
 * [handleErrors description]
 * @param  {[type]} errors    [description]
 * @param  {[type]} validator [description]
 * @return {[type]}           [description]
 */
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

    $(".eaSubmitButton")
        .removeClass("isDisabled")
        .removeAttr("disabled");

    grAnalytics.analyticsReport("payment/validation-error");

    try {
        throw new Error("failed validation");
    }
    catch (error) {
        // graygunner.sendError(error, {
        //     data: {
        //         errors: $errorList.text()
        //     },
        //     forms: [ENFormSelector]
        // });
    }
}