//Beautifier configuration
var leftColumnSelector = '.js-left-column';
var formFieldContainerClass = 'js-form-field-container';
var formFieldContainerIgnoreClass = 'is-selfHandling';
var formFieldWrapperClass = 'js-form-field-wrapper';

var ENcrementData = require('./modules/ENcrementData'); 
var encrementdata; 

var ENBeautifier = require('./modules/ENBeautifier');
var enbeautifier;

var Stringer = require('./modules/Stringer');
var stringer;

require('jquery');
require('raygun');
require('jqueryvalidate');


//Main event
$(document).ready(function() {
	try {
		init();
	}
	catch(error) {
		raygunSendError(error);
	} 


});

/**
 * [init description]
 * @return {[type]} [description]
 */
function init() {
	//form beauitfication
	enbeautifier = new ENBeautifier({
		form: $(formSelector),
		fieldWrapperClass: formFieldWrapperClass,
		fieldContainerClass: formFieldContainerClass
	});
	enbeautifier.tagFieldContainers();
	enbeautifier.usePlaceholders();
	enbeautifier.buildColumns({
		leftColumn:  leftColumnSelector
	});

	//stringer
	stringer = new Stringer({
		clientId: '1770'
	})
	stringer.getStat({
		datapoint: 'participations',
		campaignId: $('input[name="ea.campaign.id"]').val(),
		callback: addStringerStat
	});
}

/**
 * [addStringerStat description]
 * @param {[type]} response [description]
 */
function addStringerStat(response){
	if(response.status == "success") {
		try {
			var actions = parseInt(response.data);
			var useText;
			$(counterSelector).text(actions.toLocaleString());
			$(counterRangeSelector).find('div').each(function() {
				var limit = $(this).find(counterRangeLimitSelector).text();
				if(actions < parseInt(limit))
					return false;
				useText = $(this).find(counterRangeTextSelector).html();
			});
			$(counterTextSelector).html(useText);
		}
		catch(error) {
			raygunSendError(error, {
				data: {
					response: response,
					range: limit
				}
			});
		}
	}
}

//////////////////////////////
// Everything else goes here
//////////////////////////////

// Tracking
//---------------------------------------
function analyticsReport( event, title ){
	try {
		//UA
		if( typeof ga !== 'undefined' ){
		  
		    var data = {};
		    if( event ){
		      data[ 'page'] = '/virtual/'+event;
		    }
		    if( title ){
		      data[ 'title' ] = title;
		    }

		    ga( 'send', 'pageview', data );

		}

		//Traditional GA
		if( typeof _gaq !== 'undefined' ){
		    _gaq.push(['_trackPageview', '/virtual/'+event]);
		}

		//Tag Manager
		if( typeof _gaq !== 'undefined' ){

		}       
	} catch (err) {
		raygunSendError(err);
	}
}

function analyticsGetSection(container) {
	var currentSection = null;
	$(container).children().each(function() {
		if($(window).scrollTop() > $(this).offset().top)
			currentSection = $(this).attr("data-section");
	});
	return currentSection;
}

// Error Reporting
// ---------------------------------------
function raygunSendError(error, options) {
	try {
		var data = { };
		if(!options instanceof Object || typeof options == 'undefined') {
			options = { };
		}

		//if forms are defined, pull in the form data for each listed form selector and store as an array of
		if(options.forms && options.forms.length) {
			var formDataCollection = { };
			for(var i = 0; i < options.forms.length; i++) {
				var $forms = $(options.forms[i]);
				formDataCollection[options.forms[i]] = $forms.map(function(index, form) {
					return [$(form).serializeArray().map(
						function(obj) {
							var returnObj = { };
							returnObj[obj.name] = obj.value;
							return returnObj;
						}
					)];
					return [];
				});
			}
			//console.log(formDataCollection);
			$.extend(true, data, {forms: formDataCollection});
		}

		if(options.data) {
			$.extend(true, data, options.data);
		}

		/*if(typeof Raygun !== 'undefined')
			Raygun.send(error, data);
		else {*/
			console.log(error);
			console.log(data);
		//}
	}
	catch(error) {
		if(typeof Raygun !== 'undefined')
			Raygun.send(error);
		console.log(error);
	}
}

function raygunCheckErrorContainer(selector, formSelectors) {
	try {
		if($(selector).length) {
			try { throw new Error("EA Processing Error");}
			catch(error) {
				analyticsReport('action-failure/'+$('input[name="ea.campaign.id"]').val());
				var data = {};
				data[selector] = $(selector).text();
				raygunSendError(error, {
					data: data,
					forms: formSelectors
				});
			}
		}
	}
	catch(error) {
		raygunSendError(error);
	}
}

function getURLParameter(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}
        