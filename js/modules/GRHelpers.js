/**
 * GRHelpers module.
 * 
 * A list of static functions that are useful throughout our projects
 * 
 */

function createSelectComponent(opts) {
    if((missing = hasMissingOptions(opts, ['name', 'placeholder', 'options'])))
        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

    var html = '%label%<select name="%name%" %id% %class% %atts%>%placeholder%</select>'
                .replace(/%label%/g, (opts.label ? '<label for="%id%">'+opts.label+'</label>' : ''))
                .replace(/%name%/g, (opts.name ? opts.name : ''))
                .replace(/%id%/g, (opts.id ? 'id="'+opts.id+'"' : 'id="'+opts.name.replace(/[^a-zA-Z0-9\-\_]/g, '-')+'"'))
                .replace(/%placeholder%/g, (opts.placeholder ? '<option value="">'+opts.placeholder+'</option>' : '<option value="">'+opts.label+'</option>' ))
                .replace(/%class%/g, (opts.classNames ? 'class="'+opts.classNames.join(' ')+'"' : ''))
                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));
    var select;
    if(typeof opts.wrap != "undefined")
        select = $(opts.wrap).html(html);         
    else
        select = $(html);

    for(var i=0; i<opts.options.length; i++) {
        select.filter('select').append('<option value="'+opts.options[i].code+'">'+opts.options[i].name+'</option>')
    }
    return select;
}

function createRadioComponent(opts) {
    if((missing = hasMissingOptions(opts, ['name', 'value', 'label'])))
        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

    var html = '<input type="radio" name="%name%" value="%value%" id="%id%" %class% %atts%/><label for="%id%">%label%</label>'
                .replace(/%label%/g, (opts.label ? opts.label : ''))
                .replace(/%name%/g, (opts.name ? opts.name : ''))
                .replace(/%value%/g, (opts.value ? opts.value : ''))
                .replace(/%id%/g, (opts.id ? opts.id : (opts.name+opts.value).replace(/[^a-zA-Z0-9\-\_]/g, '-')))
                .replace(/%class%/g, (opts.classNames ? 'class="'+opts.classNames.join(' ')+'"' : ''))
                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));

    var radio;
    if(typeof opts.wrap != "undefined")
        radio = $(opts.wrap).html(html);         
    else
        radio = $(html);

    return radio;
}

function createTextComponent(opts) {
    if((missing = hasMissingOptions(opts, ['name'])))
        throw new Error("[GRHelpers] Missing required options: " + missing.join(', '));

    var html = '%label%<input type="text" name="%name%" value="%value%" id="%id%" %placeholder% %class% %atts%/>'
                .replace(/%label%/g, (opts.label ? '<label for="%id%">'+opts.label+'</label>' : ''))
                .replace(/%name%/g, (opts.name ? opts.name : ''))
                .replace(/%value%/g, (opts.value ? opts.value : ''))
                .replace(/%id%/g,  (opts.id ? opts.id : opts.name.replace(/[^a-zA-Z0-9\-\_]/g, '-')))
                .replace(/%placeholder%/g, (opts.placeholder ? 'placeholder="'+opts.placeholder+'"' : '' ))
                .replace(/%class%/g, (opts.classNames ? 'class="'+opts.classNames.join(' ')+'"' : ''))
                .replace(/%atts%/g, (opts.atts ? opts.atts.join(' ') : ''));

    var text;
    if(typeof opts.wrap != "undefined")
        text = $(opts.wrap).html(html);         
    else
        text = $(html);

    return text;
}

function addURLParameter(url,name,value){
    var val;
    if(typeof url !== 'string'){
        return false;
    } else if (val = getAnyURLParameter(url,name)){
        //new value is different than what came before
        if( val !== value ){
            var param = new RegExp(name+'='+'([^&;])');
            return url.replace(param, name+'='+value);
        } else {
        //new value is the same as what came before
            return;
        }
    } else if (url.indexOf("?") >= 0){
        return url + "&" + name + "=" + value;
    } else {
        return url + "?" + name + "=" + value;
    }
}

function getURLParameter(name) {
    // return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    return getAnyURLParameter(location.search,name);
}

function getAnyURLParameter(url,name){
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

/**
 * hasMissingOptions
 * @param {Object} options list of options
 *
 * @return array|false whether all necessary fields are provided in the options
 */
function hasMissingOptions(opts, req) {
    var missingOptions = [ ];
    for(var i = 0; i < req.length; i++) {
        if(typeof opts[req[i]] === 'undefined') {
            missingOptions.push(req[i]);
        }
    }
    if(missingOptions.length) {
        return missingOptions;
    }
    return false;
}

function ucFirst(str) {
  //  discuss at: http://phpjs.org/functions/ucFirst/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: ucFirst('kevin van zonneveld');
  //   returns 1: 'Kevin van zonneveld'

  str += '';
  var f = str.charAt(0)
    .toUpperCase();
  return f + str.substr(1);
}


module.exports = {
    addURLParameter: addURLParameter,
    createRadioComponent: createRadioComponent,
    createSelectComponent: createSelectComponent,
    createTextComponent: createTextComponent,
    getURLParameter: getURLParameter,
    getAnyURLParameter: getAnyURLParameter,
    hasMissingOptions: hasMissingOptions,
    ucFirst: ucFirst
}