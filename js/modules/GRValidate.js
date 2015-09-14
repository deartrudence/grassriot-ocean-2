/**
 * ENBeautifier module
 * requires jQuery, jQueryvalidate
 */
var requiredOptions = [
    'form',
    'rules'
];

var options;

var defaults = {
    ignore: ['#setcurrency'],
    unhighlight: function (element, errorClass, validClass) {
        var $el = $(element);
        if($el.attr("type")=="checkbox") return;
        $el.parent().find('.glyphicon').remove();
        $el.removeClass(validClass).removeClass(errorClass);

        if ($el.val() != ''&& ($el.attr('id') !== 'setcurrency')) {
            $el.before($('<span class="glyphicon glyphicon-ok"></span>'));
            $el.addClass(validClass);
        }
    },
    highlight: function (element, errorClass, validClass) {
        var $el = $(element);
        if($el.attr("type")=="checkbox") return;
        $el.parent().find('.glyphicon').remove();
        $el.before($('<span class="glyphicon glyphicon-remove"></span>'));
        $el.removeClass(validClass).addClass(errorClass);
    },
    success: function (element, label) {
        var $el = $(element);
        $el.parent().find('.glyphicon').remove();
        $el.before($('<span class="glyphicon glyphicon-ok"></span>'));
    },
    groups: {
        demoGroup: "First Name",
        ccExpiryDate: "Credit Card Expiration 1 "
    },
    invalidHandler: function(e, validator) {
        var errors = validator.errorList,
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

        //console.log(validator);
        try {
            throw new Error("failed validation");
        }
        catch (err) {
            var fieldData = $(this).serializeArray();
            for(var i = 0; i < fieldData.length; i++ ) {
                if(fieldData[i].name == "Credit Card Number")
                    fieldData.splice(i, 1);
            }
            Raygun.send(err, {errors: validator.invalid, values: fieldData});
        }
    },
    showErrors: function (errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#donor_errors").html("<div class='alert alert-danger'><i class='glyphicon glyphicon-exclamation-sign'></i> Please correct the <b>" + this.numberOfInvalids() + "</b> errors indicated below.</div>").show(300);

            if (typeof errorMap['Donation Amount'] !== 'undefined') {
                $("#donor_errors").append("<div class='alert alert-warning' role='alert'><i class='glyphicon glyphicon-info-sign'></i><a class='btn-prev' href='#'>" + errorMap['Donation Amount'] + "</a></div>");
            }

        } else {
            $("#donor_errors").hide(300);
        }
        this.defaultShowErrors();
    },
    errorPlacement: function () {
        return false; // <- kill default error labels
    },
    submitHandler: function (form) {
        $('[name="Credit Card Number"]').val($('[name="Credit Card Number"]').val().replace(/[\-\s]/g,''));
        processForm();
        if(grupsell.launch())
            return false;
        else
            sendDonation(form);
    },
    errorMessages: {
        invalidMonth: 'Invalid month',
        invalidCVV: 'Invalid verification number',
        invalidAmount: 'Invalid donation amount',
        invalidDate: 'Date is invalid',
        invalidEmail: 'Please enter a valid email address.'
    }
}

var protect = {};

function GRValidate(opt){
    if(this.hasRequiredOptions(opt)) {
        options = $.extend(true, {}, defaults, opt, protect);
        this.init();
    }
    else
        throw new Error("[GRValidate] Missing required options: " + this.missingOptions.join(', '));
}

/**
 * [init description]
 * @return {[type]} [description]
 */
GRValidate.prototype.init = function(){
    require("jqueryvalidate");

    //add rules
    $.validator.addMethod("emailTLD", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }, options.errorMessages.invalidEmail);
    
    $.validator.addMethod('isMonth', function (value, element) {
        return value.length == 2
            && parseInt(value) > 0
            && parseInt(value) <= 12;
    }, options.errorMessages.invalidMonth);

    $.validator.addMethod('isNowOrFutureYear', function (value, element) {
        return value.length >= 4
            && parseInt(value) >= nowDate.getFullYear();
    }, options.errorMessages.invalidDate);

    $.validator.addMethod('isFuture', function (value, element) {
        //Reject if the month and year together are in the past
        var month = $(element)
            .closest("form")
            .find("#Credit_Card_Expiration1")
            .val();

        if (parseInt(value) == nowDate.getFullYear()
            && parseInt(month) < nowDate.getMonth() + 1) {
            return false;
        }

        //Looks like the future
        return true;
    }, options.errorMessages.invalidDate);

    $.validator.addMethod('isCVV', function (value, element) {
        var regexCVV = /^\d{3}$/;
        return regexCVV.test(value);
    }, options.errorMessages.invalidCVV);

    //initialize the actual validation
    options.form.validate(options);

    //extra event handlers
    options.form
        .on("change", "input,select", function (e) {
            $(e.target).valid();
        })
        .on("change", "#Credit_Card_Expiration1", function ( ) {
            var ccExpiryYear = $("#Credit_Card_Expiration2");
            if (ccExpiryYear.val()) {
                $("#Credit_Card_Expiration2").valid();
            }

        })
        .on("keypress", function(e) { //disables Enter key for form
            if (e.which == 13) {
                e.preventDefault();
                return false;
            }
        })
        .on("grupsell.upsold", function(e, initialAmount, upsellAmount) {
            $upsellTrackingField.val('YES: '+initialAmount.toString());
            donation_type = 'monthly';
            grAnalytics.analyticsReport( 'payment/upsell' );
        })
        .on("keypress", function(e) { //disables Enter key for form
            if (e.which == 13) {
                e.preventDefault();
                return false;
            }
        });;
}

/**
 * GRAnalytics hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
GRValidate.prototype.hasRequiredOptions = function(options, req) {
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
 * [addRules description]
 * @param {[type]} newRules [description]
 */
GRValidate.prototype.addRules = function(newRules) {
    for (var i in newRules) {
        var $elem = $('[name="' + i + '"]').not("a");
        $elem.rules('add', newRules[i]);
    }
}

/**
 * [removeRules description]
 * @param  {[type]} existingRules [description]
 * @return {[type]}               [description]
 */
GRValidate.prototype.removeRules = function(existingRules) {
    for (var i in existingRules) {
        var $elem = $('[name="' + i + '"]').not("a");
        $elem.rules('remove');
    }
}

GRValidate.prototype.groupValid = function(elements){
    var isGroupValid = true;
    $(elements).find('input,select,textarea')
        .each(function(){
            var isThisValid = $(this).valid();
            if(isGroupValid && !isThisValid){
                isGroupValid = false;
            }
        });
    return isGroupValid;
}

module.exports = GRValidate;