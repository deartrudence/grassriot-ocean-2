/**
 * GRAnalytics module.
 * 
 * Uses for interaction whith Google Analytics service.
 * 
 * @requires jQuery
 */
var requiredOptions = [ ];

var defaults = {
    'prefix': '/virtual',
    'events': [ ],
    'trackingPixels': { }
};

var protect = {
    'prependPath': [ ]
};

var options;

/**
 * GRAnalytics constructor
 * @param Object opt options with the following properties:
 *        string prefix prepended to the beginning of pageview sent to GA
 *        array events a collection of objects defining events that should trigger a GA pageview
 *        object trackingPixels a collection of tracking pixels to register
 */
function GRAnalytics(opt) {
    if(this.hasRequiredOptions(opt)) {
        options = $.extend(true, {}, defaults, opt, protect);
        this.init();
    }
    else
        throw new Error("[GRAnalytics] Missing required options: " + this.missingOptions.join(', '));
}

/**
 * GRAnalytics hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
GRAnalytics.prototype.hasRequiredOptions = function(options, req) {
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

GRAnalytics.prototype.init = function() {
    setPrefix(options.prefix);
    
    //activate all event-based analytics reports passed on initialization
    if(options.events.length)
        this.setEventListeners(options.events);

    //register all tracking pixels passed on initialization
    for(var pixel in options.trackingPixels) {
        if(options.trackingPixels[pixel] instanceof Object && this.hasRequiredOptions(options.trackingPixels[pixel], pixelRequiredOptions)) {
            this.registerPixel(pixel, options.trackingPixels[pixel].id.toString(), options.trackingPixels[pixel].showPixel);
        }
        else if(['string','number'].indexOf((typeof options.trackingPixels[pixel]).toLowerCase()) != -1) {
            this.registerPixel(pixel, options.trackingPixels[pixel].toString());
        }
    }
}

function setPrefix(prefix) {
    if(options.prefix.charAt(0) != "/")
        options.prefix = "/" + options.prefix;
    options.prependPath[0] = options.prefix;
}
    
/**
 * Initialization of pageviews which will be 
 * automatically executed when some event triggered.
 * 
 * @param (Array) views An array of options. 
 * Each options should contain parameters:
 * - 'event': event name (click, scroll, etc.)
 * - 'selector': Element's selector.
 * - 'virtualPageview': Name of virtualPageview.
 * @public
 */
GRAnalytics.prototype.setEventListeners = function( views ) {
    if(typeof options.form == 'undefined') 
        throw new Error('"form" option needs to be specified to use the auto-event-listener functionality');
    var analyticsReport = this.analyticsReport;
    for(var i=0; i<views.length; i++) {
        var view = views[i];

        options.form.on(view['event'], view.selector, function(e) { analyticsReport( view.virtualPageview ); });
    }
}

GRAnalytics.prototype.addToPrefix = function( toAdd ) {
    options.prepend.push(toAdd.toString());
}

/**
 * Makes call to Google Analytics (virtual eComerce reort).
 * 
 * @param Object transactionData
 * @param Object itemData
 * @public
 */
GRAnalytics.prototype.eCommerceReport = function(transactionData, itemData) {
    // Universal GA
    if (typeof ga !== 'undefined') {
        ga('ecommerce:addTransaction', transactionData);

        for (var i = 0; i < itemData.length; i++) {
            ga('ecommerce:addItem', itemData[i]);
        }

        ga('ecommerce:send');
    }

    // Traditional GA
    if (typeof _gaq !== 'undefined') {
        _gaq.push(['_set', 'currencyCode', transactionData.currency]);
        _gaq.push(['_trackPageview']);
        _gaq.push(['_addTrans',
            transactionData.id, // transaction ID - required
            transactionData.affiliation, // affiliation or store name
            transactionData.revenue, // total - required
            '0', // tax
            '0'
        ]);

        for (var i = 0; i < itemData.length; i++) {
            _gaq.push(['_addItem',
                itemData[i].id, // transaction ID - required
                itemData[i].sku, // SKU/code - required
                itemData[i].name, // product name
                itemData[i].category, // category or variation
                itemData[i].price, // unit price - required
                itemData[i].quantity // quantity - required
            ]);
        }

        // Submits transaction to the Analytics servers.
        _gaq.push(['_trackTrans']); 
    }
}

/**
 * Makes call to Google Analytics (virtual page view).
 * 
 * @param String viewName Page view name.
 * @param String title Event title.
 * @public
 */
GRAnalytics.prototype.analyticsReport = function(viewName, title) {
    var fullPageViewName = options.prependPath.join('/') + '/' + viewName,
        data = {};
        
    data['page'] = fullPageViewName;

    if ( title ){
        data['title'] = title;
    }

    // Universal GA
    if( typeof ga !== 'undefined' ) {
        
        ga( 'send', 'pageview', data );
    }

    // Traditional GA
    if( typeof _gaq !== 'undefined' ){
        _gaq.push( ['_trackPageview', fullPageViewName ] ); 
    }
}

var pixelRequiredOptions = [
    'id',
    'showPixel'
];

var supportedPixels = [
    'facebook'
];

var registeredPixels = { };

var firePixelQueue = { };


GRAnalytics.prototype.registerPixel = function(name, id, callback) {
    if(typeof callback == "function") {
        registeredPixels[name] = {id: id, showPixel: callback};
    }
    else if(supportedPixels.indexOf(name.toLowerCase()) != -1 ) {
        registeredPixels[name] = 'pending';
        require.ensure([], function(require) {
            var pixel = require('./GRAnalytics-pixel-'+name);
            registeredPixels[name] = {id: id,
                showPixel: pixel.showPixel};
            if(typeof firePixelQueue[name] != "undefined") {
                for(var i=0; i<firePixelQueue[name].length; i++) {
                    console.log(firePixelQueue[name][i]);
                    registeredPixels[name].showPixel(registeredPixels[name].id, firePixelQueue[name][i]);
                }
            }
        });
    }
}


GRAnalytics.prototype.fireTrackingPixels = function(pixels, data) {
    var toProcess = pixels;
    if(pixels == null) {
        toProcess = registeredPixels.keys;
    }
    else if(typeof toProcess == "string") {
        toProcess = [toProcess];
    }

    for(var i=0; i<toProcess.length; i++) {
        if(typeof registeredPixels[toProcess[i]] == "undefined") continue;
        else if(typeof registeredPixels[toProcess[i]] == "string") {
            if(typeof firePixelQueue[toProcess[i]] == "undefined")
                firePixelQueue[toProcess[i]] = [ ];
            firePixelQueue[toProcess[i]].push(data);
            console.log(firePixelQueue);
        }
        else if(typeof registeredPixels[toProcess[i]].showPixel == "function") {
            registeredPixels[toProcess[i]].showPixel(registeredPixels[toProcess[i]].id, data);
        }
    }
}

/**
 * Public interface.
 */
module.exports = GRAnalytics;