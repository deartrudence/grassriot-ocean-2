/**
 * Stringer module
 *
 * Interface to connect to Stringer web service
 *
 * @version  0.1
 * @requires jQuery
 */
var requiredOptions = [
    'clientId'
];

var stringerBaseURL = "http://stringer.grassriots.com/api/v1";

/**
 * Stringer constructor
 * @param Object options with the following properties:
 *        string clientId - unique EN client id
 */
function Stringer(options) {
    if(this.hasRequiredOptions(options)) {
        this.clientId = options.clientId;

        //this.init();
    }
    else
        throw new Error("[Stringer] Missing required options: " + this.missingOptions.join(', '));
}

/**
 * Stringer hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
Stringer.prototype.hasRequiredOptions = function(options) {
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


/**
 * Stringer getStat Pulls a statistics from the Stringer service
 * @param Object options with the following properties:
 *        string datapoint - the name of the statistic to pull
 *        string campaignId - unique EN client id
 *        function callback - to be executed once the datapoint is obtained
 */
Stringer.prototype.getStat = function(options) {
    if(typeof options.datapoint == "undefined" || typeof options.callback == "undefined")
        throw new Error("[Stringer.getStat] A datapoint and callback are required");

    var requestURL = stringerBaseURL + '/stats/client/' + encodeURIComponent(this.clientId) + (options.campaignId ? '/campaign/' + encodeURIComponent(options.campaignId) : '') + '/datapoint/' + encodeURIComponent(options.datapoint)

    callAPI(requestURL, options.callback);
}

/**
 * Stringer getUserData Pulls a collection of user fields with their status from the Stringer service
 * @param Object options with the following properties:
 *        string email - email of the user
 *        Object context - assign 'this'
 *        function callback - to be executed once the user data is obtained
 */
Stringer.prototype.getUserData = function(options) {
    if(typeof options.email == "undefined" || typeof options.callback == "undefined")
        throw new Error("[Stringer.getUserData] An email and callback are required");

    var requestURL = stringerBaseURL + '/encrementer/client/' + encodeURIComponent(this.clientId) + '/email/' + encodeURIComponent(options.email)

    callAPI(requestURL, options.callback, options.context);

}

/**
 * private callAPI sends a JSONP AJAX request to to the Stringer serverfrom the Stringer service
 * @param string url - RESTful API URL
 * @param function callback - to be executed once the user data is obtained
 */
function callAPI(url, callback, context) {
    $.ajax({ 
        type: "GET",
        url: url,
        dataType: 'jsonp',
        cache: false,
        context: (context ? context : this),
        crossDomain: true,
        error: function(/* xhr, status, errorThrown */) {
            
        },
        success: callback
    })
}


module.exports = Stringer;