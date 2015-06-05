/**
 * ENcrementData module
 * requires jQuery, Stringer
 */
var requiredOptions = [
    'clientId',
    'campaignId',
    'formId',
    'formFields',
    'fieldContainer',
    'form'
];

var enURL = 'https://e-activist.com/ea-action/action';
var fieldObtained = false;

var Stringer = require('./Stringer');
var stringer;

/**
 * ENcrementData constructor
 * @param Object options with the following properties:
 *        string clientId - unique EN client id
 *        string campaignId - unique EN campaign id to pull user data
 *        array formField - collection of form field names desired in the order of preference - Email should always be included and be the first in the array
 *        jQuery form - a jQuery object of the form where the fields will be added 
 */
function ENcrementData(options) {
    if(this.hasRequiredOptions(options)) {
        this.clientId = options.clientId;
        this.resultCampaignId = options.campaignId;
        this.resultFormId = options.formId;
        this.desiredFormFields = options.formFields;
        this.emailFieldName = (options.emailField ? options.emailField : this.desiredFormFields[0]);
        this.formFieldContainer = (options.fieldContainer ? options.fieldContainer : 'js-form-field-container');
        this.formFieldIgnoreContainer = (options.ignoreContainer ? options.ignoreContainer : 'is-selfHandling');
        this.targetForm = options.form;

        this.init();
    }
    else
        throw new Error("[ENcrementData] Missing required options: " + this.missingOptions.join(', '));
}

ENcrementData.prototype.init = function() {
    var fields = $(this.targetForm).find(this.formFieldContainer);

    for(var i = 0; i < fields.length; i++) {
        if(
            !$(fields[i]).find('.eaMandatoryFieldMarker').length
            && !(
                typeof this.formFieldIgnoreContainer !== 'undefined'
                && $(fields[i]).hasClass(this.formFieldIgnoreContainer)
                )
        ) {
            this.dectivateField($(fields[i]).find('input, select, textarea').attr('name'));
        } else {
            $(this).trigger("left.active.ENcrement");
        }
    }
    stringer = new Stringer({
            clientId: this.clientId
        })
}

/**
 * ENcrementData hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
ENcrementData.prototype.hasRequiredOptions = function(options) {
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

/*ENcrementData.prototype.getUserData = function(email) {
    if(email == '' || fieldObtained) return;
    
    data[this.emailFieldName] = email;

    $.ajax({
        type: "GET",
        url: enURL,
        data: data,
        dataType: 'jsonp',
        cache: false,
        context: this,
        crossDomain: true,
        error: function( xhr, status, errorThrown ) {
            
        },
        success: function( data, status, xhr) {
            var $userDataForm = $($.parseHTML(data.pages[0].form.fields[0].value));
            var fieldname = this.getNextField($userDataForm.serializeArray());
            if(fieldname) 
                this.activateField(fieldname);
            fieldObtained = true;
        }
    })
}*/

/**
 * ENcrementData showNextField Checks field value status for supporter record in EN
 * @param {string} email value of the email input field
 *
 * @return void
 */
ENcrementData.prototype.showNextField = function(email) {
    if(email == '' || fieldObtained) return;

    stringer.getUserData({
        email: email,
        context: this,
        callback: parseFieldStatus
    });

    
}

/**
 * ENcrementData private parseFieldStatus
 * @param {Object} response from Stringer API call
 *
 * @return void
 */
function parseFieldStatus(response) {
    fieldObtained = true;
    if(response.status == "success") {
        for(i = 0; i < this.desiredFormFields.length; i++) {
            if(!$(this.targetForm).find('[name="' + this.desiredFormFields[i] + '"]').not('[disabled="disabled"]').length && response.data[this.desiredFormFields[i]] == 'N') {
                //console.log(this.desiredFormFields[i]);
                this.activateField(this.desiredFormFields[i]);
                return;
            }
        }
    }
}

ENcrementData.prototype.activateField = function(fieldname) {
    $(this.targetForm).find('[name="' + fieldname + '"]')
        .removeAttr('disabled')
        .trigger("made.active.ENcrement")
        .closest(this.formFieldContainer).show(200);
}

ENcrementData.prototype.dectivateField = function(fieldname) {
    $(this.targetForm).find('[name="' + fieldname + '"]')
        .attr('disabled', 'disabled')
        .trigger("made.inactive.ENcrement")
        .closest(this.formFieldContainer).hide();
}
 
module.exports = ENcrementData;