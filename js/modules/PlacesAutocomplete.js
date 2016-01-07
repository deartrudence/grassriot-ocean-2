/**
 * PlacesAutocomplete module
 *
 * Adds an autocomplete address search to a field
 * 
 * @version  0.2
 * @requires jQuery, google.maps
 */

/**
 * PlacesAutocomplete constructor
 * @param Object options which extends the defaults
 */
function PlacesAutocomplete(options) {
  var defaults = {
    trigger: null,
    addressField: null,
    componentFields:{},
    apiKey: null
    };

  this.options = $.extend(true, {}, defaults, options);

    //if the autocomplete should be attached right away, add it
  if(this.options.trigger === null){
    this.attach();
  } else if(typeof this.options.addressField.on === 'function') {
    this.options.addressField.on(this.options.trigger,this.attach);
  }
}

PlacesAutocomplete.prototype.init = function(){

}

/**
 * Attach the autocomplete handler to the target
 * @return {[type]} [description]
 */
PlacesAutocomplete.prototype.attach = function() {
  //check for a target
  if(
    typeof this.options.addressField !== 'object'
    || this.options.addressField.length <= 0
    ){
    throw new Error("No address field to watch");
  }

  //check whether the Places API is already loaded
  //if not, get the Places API and add autocomplete when loaded
  if(
    typeof google === 'undefined'
    || typeof google.maps.places === 'undefined'
    || typeof google.maps.places.Autocomplete === 'undefined'
    ){
    this.loadGoogle(this.addAutocomplete);
  } else {
    this.addAutocomplete();
  }

}

PlacesAutocomplete.prototype.addAutocomplete = function(){
  var self = this;
  this.addressLookupField = $("<input type='text' name='g_places_lookup' placeholder='Full Mailing Address' />");
  this.addressLookupField.insertBefore(this.options.addressField);
  this.addressLookupField.on('keydown', function(e) {
    if(e.which == 13) {
      e.preventDefault();
    }
  });
  this.options.addressField.hide();
  self.autoplace = new google.maps.places.Autocomplete(
    (self.addressLookupField.get(0)),
    {types:['address']}
    );
  google.maps.event.addListener(self.autoplace, 'place_changed', function(){
    self.mapAddress();
  });

  this.addressLookupField.on("blur",function(e){
    if(typeof self.options.onEmpty === "function"){
      self.options.onEmpty.call(this, e);
    }
    else{
      self.addressLookupField.val("");  
    }
    
  });
}

PlacesAutocomplete.prototype.loadGoogle = function(callback) {
  //doesn't currently do anything. Async loading isn't working

  //Add the key if available
  // var apiUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places&callback=isNaN';
  // if(this.options.apiKey !== null){
  //   apiUrl += "&key="+this.options.apiKey;
  // }

  // if(typeof callback === 'undefined'){
  //   callback = function(){}
  // }

  // //request the script
  // var placesApi = document.createElement('script');
  // placesApi.setAttribute('src',apiUrl);
  // document.head.appendChild(placesApi);
  // if(typeof callback !== undefined){
  //   placesApi.onload = callback;
  // }
}

/**
 * [clearAddress description]
 * @return {[type]} [description]
 */
PlacesAutocomplete.prototype.clearAddress = function() {
  for(addressPart in this.options.componentFields) {
    if(this.options.componentFields.hasOwnProperty(addressPart)) 
      this.options.componentFields[addressPart].field.val("");
  }
}

/**
 * [addressLookupFieldHide description]
 * @return {[type]} [description]
 */
PlacesAutocomplete.prototype.addressLookupFieldHide = function() {
  this.options.addressField.show();
  this.addressLookupField.hide();
}

/**
 * [addressLookupFieldShow description]
 * @return {[type]} [description]
 */
PlacesAutocomplete.prototype.addressLookupFieldShow = function() {
  this.options.addressField.hide();
  this.addressLookupField.show();
}

PlacesAutocomplete.prototype.guessAddress = function(){
  
  // var service = new google.maps.places.AutocompleteService();
  // var self = this;


  // service.getQueryPredictions({
  //   input: this.addressLookupField.val()
  // },

  // //callback
  // function(predictions, status){
  //   // console.log(predictions);
  //   if(predictions.length > 0){
  //     // console.log(predictions[0])
  //     // self.setPlace(predictions[0]);
  //     self.autoplace.setPlace(predictions[0].place_id);
  //   }
  // }); 

}

/**
 * [mapAddress description]
 * @return {[type]} [description]
 */
PlacesAutocomplete.prototype.mapAddress = function() {
  var place = this.autoplace.getPlace();
  
  this.setPlace(place);
}

/**
 * [setPlace description]
 * @param {[type]} place [description]
 */
PlacesAutocomplete.prototype.setPlace = function(place){
  if(typeof place !== 'undefined'){
    var missingComponents = Object.keys(this.options.componentFields);
    for (var i = 0; i < place.address_components.length; i++){
      var addressType = place.address_components[i].types[0];
      if(typeof this.options.componentFields[addressType] !== 'undefined'){
        var val = place.address_components[i][this.options.componentFields[addressType].type];
        var field = this.options.componentFields[addressType].field;
        field.removeAttr('disabled');
        if(field.hasClass('js-autoplace-update'))
          field.val(field.val()+" "+val);
        else {
          field.val(val).addClass('js-autoplace-update');
          field.trigger('updated.value.placesautocomplete');
        }

        //keep track of components that
        var addressTypeIndex;
        if((addressTypeIndex = missingComponents.indexOf(addressType)) != -1) {
          missingComponents.splice(addressTypeIndex, 1);
        }
      }
    }    
  }
  $('.js-autoplace-update').removeClass('js-autoplace-update');
  this.options.addressField.trigger('completed.addressMapping.placesautocomplete', [missingComponents]);
}

module.exports = PlacesAutocomplete;