/**
 * GRAnalytics module.
 * 
 * Used for interaction whith Google Analytics service.
 *
 * @version  0.4 !!MODIFIED20160224!!
 * @requires jQuery
 */
var requiredOptions = [ ];

var defaults = {
    'prefix': '/virtual',
    'events': [ ],
    'trackingPixels': { },
    'ignoreGTM': false, //@since __
    'gtmTrackerName': false, //@since __
    'gtm': {
        'socialAction': 'socialAction',
        'socialNetwork': 'socialNetwork',
        'socialTarget': 'socialTarget',
        'virtualPageURL': 'virtualPageURL',
        'virtualPageTitle': 'virtualPageTitle',
        'eCommerceEvent': 'eCommerceTransaction',
        'virtualPageviewEvent': 'VirtualPageview',
        'socialActivityEvent': 'SocialActivity'
    }
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

    //@since __ - add a dot to the tracker name for easier usage without a bunch of conditionals
    if(options.gtmTrackerName !== false) {
        options.gtmTrackerName = options.gtmTrackerName + '.';
    } else {
        options.gtmTrackerName = '';
    }
    
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
    options.prependPath.push(toAdd.toString());
}

/**
 * Makes call to Google Analytics (virtual eComerce reort).
 * 
 * @param Object transactionData
 * @param Object itemData
 * @public
 */
GRAnalytics.prototype.eCommerceReport = function(transactionData, itemData) {
    //@since 0.4
    //GTM
    if(typeof dataLayer !== 'undefined' && !options.ignoreGTM) {
        dataLayer.push({
            'transactionId': transactionData.id,
            'transactionAffiliation': transactionData.affiliation,
            'transactionTotal': transactionData.revenue,
            'transactionTax': 0,
            'transactionShipping': 0,
            'transactionProducts': itemData,
            'event': options.gtm.eCommerceEvent
        });
        return;
        
    }

    // Universal GA
    if (typeof ga !== 'undefined') {
        ga(options.gtmTrackerName+'require','ecommerce');
        
        ga(options.gtmTrackerName+'ecommerce:addTransaction', transactionData);

        for (var i = 0; i < itemData.length; i++) {
            ga(options.gtmTrackerName+'ecommerce:addItem', itemData[i]);
        }

        ga(options.gtmTrackerName+'ecommerce:send');
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

    //@since 0.4
    //GTM
    if(typeof dataLayer !== 'undefined' && !options.ignoreGTM) {
        var gtmData = {
            'event': options.gtm.virtualPageviewEvent
        };
        gtmData[options.gtm.virtualPageURL] = fullPageViewName;
        gtmData[options.gtm.virtualPageTitle] = title;
        
        dataLayer.push(gtmData);
        return;
    }

    // Universal GA
    if( typeof ga !== 'undefined' ) {
        
        ga( options.gtmTrackerName+'send', 'pageview', data );
    }

    // Traditional GA
    if( typeof _gaq !== 'undefined' ){
        _gaq.push( ['_trackPageview', fullPageViewName ] ); 
    }
}

/**
 * Makes call to Google Analytics (social).
 * 
 * @param Object networkDetails should include socialNetwork, socialAction, and socialTarget properties
 * @public
 * @since  0.2
 */
GRAnalytics.prototype.socialReport = function(networkDetails) {
    //@since 0.4
    //GTM
    if(typeof dataLayer !== 'undefined' && !options.ignoreGTM) {
         var gtmData = {
            'event': options.gtm.socialActivityEvent
        };

        gtmData[options.gtm.socialNetwork] = networkDetails.socialNetwork;
        gtmData[options.gtm.socialAction] = networkDetails.socialAction;
        gtmData[options.gtm.socialTarget] = networkDetails.socialTarget;

        dataLayer.push(gtmData);
        return;
    }

    // Universal GA only
    if( typeof ga !== 'undefined' ) {
        ga( options.gtmTrackerName+'send', 'social', networkDetails.socialNetwork, networkDetails.socialAction, networkDetails.socialTarget);
    }
}

var pixelRequiredOptions = [
    'id',
    'showPixel'
];

var supportedPixels = [
    'facebook',
    'facebookv2' //@since 0.3
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