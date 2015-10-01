/**
 * GRaygun module.
 * 
 * Uses for interaction with Raygun service.
 * 
 * @requires jQuery
 */

var requiredOptions = [ ];

var defaults = { };

var protect = { };

var options;

function GRaygun(opt) {
    if(this.hasRequiredOptions(opt)) {
        options = $.extend(true, {}, defaults, opt, protect);
    }
    else
        throw new Error("[GRaygun] Missing required options: " + this.missingOptions.join(', '));
}

/**
 * GRaygun hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
GRaygun.prototype.hasRequiredOptions = function(options, req) {
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
 * Sends prepared information (error) to raygun service.
 * 
 * @param {String} error Error description.
 * @param {Object} data An object of additional information.
 * @private
 */
function _send( error, data ) {
    if (typeof Raygun !== 'undefined') {
        Raygun.send(error, data);
    } else {
        // TODO: Not sure that this is needed for production..
        console.log(error);
        console.log(data);
    }
}

/**
 * Prepares forms fields to sending. 
 * Converts form fields to key => valye object.
 * 
 * @param {Array} forms An array of form selectors which would be processed.
 * @returns {Object} Prepared data.
 * @private
 */
function _prepareFormsData( forms ) {
    
    var formDataCollection = { };
    for(var i = 0; i < forms.length; i++) {
        var $forms = $(forms[i]);
        formDataCollection[forms[i]] = [ ];

        $forms.each(function() {
            formDataCollection[forms[i]].push(
                $(this).serializeArray().map(
                    function(obj) {
                        var returnObj = { };
                        returnObj[obj.name] = "";
                        if(typeof options.filter != "undefined" && options.filter.indexOf(obj.name) == -1 ) {
                            console.log('valid: '+obj.name);
                            returnObj[obj.name] = obj.value;
                        }
                        return returnObj;
                    }
                )
            )
        });
    }
    
    return formDataCollection;
}

/**
 * Prepares data to sending to 'raygun' service.
 * 
 * @param {String} error Error description.
 * @param {Object} options An object with error's additional data 
 * which will be processed and sended to 'raygun'.
 * @public
 */
GRaygun.prototype.sendError = function( error, options ) {
    var data = {};
    
    options = options || {};
    
    if (!options instanceof Object) {
        options = {};
    }

    // If forms are defined, pull in the 
    // form data for each listed form selector and store as an array of.
    if (options.forms && options.forms.length) {
        $.extend(true, data, {
            formData: _prepareFormsData( options.forms )
        });
    }

    if (options.data) {
        $.extend( true, data, options.data );
    }

    _send(error, data);
}

/**
 * Checking if there are any EN errors.
 * Throws an exception if any.
 * 
 * @param {String} selector Css selector which uses to indicate EN error.
 * @param {Array} formSelectors An array of css selectors of EN forms.
 * @public
 */
GRaygun.prototype.checkENErrors = function(selector, formSelectors) {
    try {
        if ( $(selector).length === 0 || $.trim($(selector).text()) == "" ) {
            return;
        }
        
        try {
            throw new Error("EA Processing Error");
        } catch (error) {
            var data = {};
            
            $(selector).trigger("en.error-response.GRaygun");
            
            data[selector] = $(selector).text();
            
            this.sendError(error, {
                data: data,
                forms: formSelectors
            });
        }
    } catch( error ) {
        this.sendError(error);
    }
}

/**
 * Public interface.
 */
module.exports = GRaygun;