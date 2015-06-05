/**
 * PlacesAutocomplete module
 * requires jQuery
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
  } else {
    this.addressField.on(this.options.trigger,this.attach);
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
    || typeof google.maps.places.Autocomplete === 'undefined'
    ){
    this.loadGoogle(this.addAutocomplete);
  } else {
    this.addAutocomplete();
  }

}

PlacesAutocomplete.prototype.addAutocomplete = function(){
  self = this;
  self.autoplace = new google.maps.places.Autocomplete(
    (self.options.addressField.get(0)),
    {types:['geocode']}
    );
  google.maps.event.addListener(self.autoplace, 'place_changed', function(){
    self.mapAddress();
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

PlacesAutocomplete.prototype.clearAddress = function() {
  for(addressPart in this.options.componentFields) {
    if(this.options.componentFields.hasOwnProperty(addressPart)) 
      this.options.componentFields[addressPart].field.val("");
  }
}

PlacesAutocomplete.prototype.mapAddress = function() {
  var place = this.autoplace.getPlace();

  if(typeof place !== 'undefined'){
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
      }
    }    
  }
  $('.js-autoplace-update').removeClass('js-autoplace-update');
  this.options.addressField.trigger('completed.addressMapping.placesautocomplete');
}

module.exports = PlacesAutocomplete;