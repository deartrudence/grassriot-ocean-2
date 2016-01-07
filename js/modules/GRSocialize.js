/**
 * GRSocialize module
 *
 * Interacts with share buttons to generate a pop-up dialog
 * Note: For the Facebook Share Dialog, your app will need to use the same domain for the hosting page and the sharing link (which should be specified as the Site URL)
 *
 * @version  0.3
 * @requires jQuery
 */

var defaults = {
  'target': '.grsocial',
  'newWindow': true,
  'popupSpec': ",location=0,menubar=0,status=0,toolbar=0,left=50,top=50", //note the starting comma - this will be important when combining it with the network-specific specs below
  'networks': {
    }
};

var networks = {
  'pinterest': {
    name: 'Pinterest',
    action: 'Pin',
    height: 333,
    width: 783,
    baseURL: '',
    elements: [ ]
  },
  'gplus': {
    name: 'Google+',
    action: 'Share',
    height: 341,
    width: 482,
    baseURL: '',
    elements: [ ]
  },
  'facebook': {
    name: 'Facebook',
    action: 'Share',
    height: 217,
    width: 521,
    baseURL: 'https://www.facebook.com/sharer/sharer.php?',
    elements: [
      'u'
    ]
  },
  'twitter': {
    name: 'Twitter',
    action: 'Tweet',
    height: 300,
    width: 498,
    baseURL: 'https://twitter.com/intent/tweet?',
    elements: [
      'text',
      'url'
    ]
  },
  'linkedin': {
    name: 'LinkedIn',
    action: 'Share',
    width: 783,
    height: 538,
    baseURL: 'https://www.linkedin.com/shareArticle?mini=true&',
    elements: [ ]
  },
  'mail': {
    name: 'Email',
    action: 'Share',
    baseURL: 'mailto:your@friends.com?',
    elements: [
      'subject',
      'body'
    ]
  }
};

var requiredOptions = [
  'target'
];
var protect = {};
var self;

function GRSocialize(options){
  //step constructor
  if(this.hasRequiredOptions(options)) {
    this.options = $.extend(true, {}, defaults, options, protect);
    this.networks = $.extend(true,{},networks,this.options.networks);
    this.init();

    self = this;
  }  
}

/**
 * ENBeautifier hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
GRSocialize.prototype.hasRequiredOptions = function(options, req) {
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
 * Initialize GRSteps
 * @return {[type]} [description]
 */
GRSocialize.prototype.init = function(){
  //send clicks to handleClick
  $(this.options.target)
    .on("click","a",this.handleClick);

  if(typeof this.options.source !== "undefined") {
    this.buildURLs(this.options.source);
  }

  if(typeof this.options.facebook !== "undefined"){
    this.facebookInit();
  }

}

/**
 * [facebookInit description]
 * @return {[type]} [description]
 */
GRSocialize.prototype.facebookInit = function(){
  var self = this;

  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: self.options.facebook.appID,
      version: 'v2.3'
    });

    self.options.facebook.handler = function(url){
      var clickEvent = this;

      FB.ui({
        method: 'share',
        href: url
      },
      function(response){

        if(
          response && !response.error_code //submitted without error
          && typeof self.options.onOpen !== "undefined"
        ){
          self.options.onOpen.call(clickEvent, {
            network: 'Facebook',
            action: 'Post',
            className: 'facebook',
          },'',url);
        }
      })

      return;
    }
  });
}

/**
 * [handleClick description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
GRSocialize.prototype.handleClick = function(e){
  var $this = $(this);
  var spec,
    network,
    action,
    networkClass;

  //loop through each registered network and assemble the right spec
  $.each(self.networks,function(className,networkSpec){
    if($this.hasClass(className)){
      spec = "height="+networkSpec.height+",width="+networkSpec.width;
      network = networkSpec.name;
      action = networkSpec.action;
      networkClass = className;
      return false;
    }
  });

  //quit if the specified network wasn't actually defined
  if(
    typeof spec === "undefined" 
    || typeof network === "undefined"
    ){
    return;
  }

  e.preventDefault();

  //get the target
  var target = e.currentTarget.href;

  //call any registered callbacks
  if(typeof self.options.beforeOpen === "function"){
    self.options.beforeOpen.call(this,network,spec,target);
  }

  //hand off to any network specific handlers, if they exist
  if(
    typeof self.options[networkClass] !== "undefined"
    && typeof self.options[networkClass].handler !== "undefined"
    ){
    return self.options[networkClass].handler.call(this,target);
  }

  //open in new window if setting is true
  if(self.options.newWindow){
    window.open(target,'sharingIsCaring',spec);  
  }
  else{
    window.location(target);
  }

  //call any registered callbacks
  //NOTE: will only fire for open options that don't redirect the browser
  if(typeof self.options.onOpen === "function"){
    self.options.onOpen.call(this,{
      network: network,
      action: action,
      className: networkClass
    },spec,target);
  }

}

/**
 * buildURLs takes content-based unordered lists and turns them into proper share links
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
GRSocialize.prototype.buildURLs = function(source) {
  var self = this;

  //cycle through ul and look for social class
  $(source).children('li').each(function() {
    var network = false;
    var networkData = this;
    //check if class corresponds to an existing network 
    $(networkData).attr('class').replace(/\s/g,' ').split(' ').forEach(function(className) {
      if(typeof self.networks[className] != 'undefined') {
        network = className;
      }
    });
    if(network === false) {
      return false;
    }

    if(typeof self.networks[network].elements !== 'undefined' && typeof self.networks[network].baseURL !== "undefined") {
      var networkURL = self.networks[network].baseURL;
      self.networks[network].elements.forEach(function(element) {
        if($(networkData).find('.'+element).length > 0) {
          if(network == 'facebook' && typeof self.options.facebook != "undefined") { //don't url encode the facebook element since it is a standalone URL
            networkURL = $(networkData).find('.'+element).text();
          } 
          /**
           * Don't URI encode mailto links
           * @since  v0.3 - 01Dec15 
           */
          else if(network == "mail"){
            networkURL += element + '=' + encodeURIComponent($(networkData).find('.'+element).text()) + '&';
          } else {
            networkURL += element + '=' + encodeURIComponent($(networkData).find('.'+element).text()) + '&amp;';
          }
        }
      });
      if($(self.options.target).find('a.'+network).length > 0) {
        $(self.options.target).find('a.'+network).attr('href', networkURL);
      }
    }
  });
}

module.exports = GRSocialize;