/**
 * GRSteps module
 * 
 * Creates and handles a multi-step form
 * Note: uses ES6 module syntax
 * 
 * @module  GRSteps
 * @requires jQuery
 */
var requiredOptions = [ 'steps' ];

var defaults = {
    'indicatorTarget': '.steps-list',
    'activeClass': "is-active",
    'completeClass': "is-complete",
    'target': '.js-formSteps',
    'stepHandler': [],
    'stepLabels': [],
    'currentStep': false,
    'startStep': 0,
    'useCSSAnimation': true,
    'addButtons': false
};

var protect = {
    'prependPath': [ ]
};

/**
 * Step constructor
 * Note: uses ES6 module syntax
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function GRSteps(options){

  //step constructor
  if(this.hasRequiredOptions(options)) {
    this.options = $.extend(true, {}, defaults, options, protect);
    this.init();
  }
}

/**
 * Initialize GRSteps
 * @return {[type]} [description]
 */
GRSteps.prototype.init = function(){
  //initalizer
  var steps = this;
  this.stepIndicators = $();
  this.$container = $(this.options.target);
  this.addSteps(this.options.steps);

  //add a frame to the parent
  this.$container.parent().addClass("window--frame");

  //add step buttons if so configured
  if(this.options.addButtons){
    this.buttonify.call(this.options.steps);
  }

  //button handlers
  this.$container
    .on("click", ".btn-next", function(e){
      e.stopPropagation();

      steps.nextStep();
    })
    .on("click",".btn-prev", function(e){
      e.stopPropagation();

      steps.previousStep();
    });

  this.switchTo(this.options.startStep);

}

/**
 * GRAnalytics hasRequiredOptions
 * @param {Object} options list of options
 *
 * @return {bool} whether all necessary fields are provided in the options
 */
GRSteps.prototype.hasRequiredOptions = function(options, req) {
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
 * [addSteps description]
 * @param {[type]} steps [description]
 */
GRSteps.prototype.addSteps = function(newSteps){
  //stepIndicators should be a jQuery object; adding allows us to create new objects on it
  //here, we loop from the the current length of the list to the length including the new items
  
  var currentLength = this.stepIndicators.length;

  for(
    var i = currentLength;
    i < currentLength + newSteps.length;
    i++
    ){

    //set the indicator label as either an integer or the indicated label
    var label = i+1;
    if(typeof this.options.stepLabels[i] !== 'undefined'){
      label = this.options.stepLabels[i];
    }

    this.stepIndicators = this.stepIndicators.add('<li class="step'+i+'">'+label+'</li>');
  }

  //after the first time stepIndicators is appended, it becomes part of the DOM. So when you re-append, it acts as though you're moving the whole set, effectively just adding the new things (apparently)
  $(this.options.indicatorTarget).append(this.stepIndicators);

  //change the container width to match the number of panels
  var containerWidthPercentage = 100 * this.stepIndicators.length;
  var panelWidthPercentage = 100 * (1/this.stepIndicators.length);
  this.$container.css("width", containerWidthPercentage + "%" );
  this.$container.children().css("width",panelWidthPercentage + "%");
}

/**
 * [switchTo description]
 * @param  {[type]} stepNumber [description]
 * @return {[type]}            [description]
 */
GRSteps.prototype.switchTo = function(stepNumber){
  this.stepIndicators
    .removeClass(this.options.activeClass);

  //TODO: validate the current panel
  
  //run any interrupting processes
  //prevent the panel from advancing if it returns false (going back should be OK)
  if(
    typeof this.options.stepHandler[this.options.currentStep] === "function"
    && this.options.currentStep < stepNumber
    && this.options.stepHandler[this.options.currentStep].call(this.$container) === false
    ){
    return;
  }

  //add the complete class to the current indicator
  //this is probably OK.
  if(this.options.currentStep !== false){
    this.stepIndicators.eq(this.options.currentStep)
      .addClass(this.options.completeClass);
  }

  if(stepNumber > this.stepIndicators.length || stepNumber < 0){
    return;
  }

  //switch the indicator
  this.options.currentStep = stepNumber;
  this.stepIndicators.eq(this.options.currentStep)
    .addClass(this.options.activeClass);

  //actually switch to the panel
  var newMargin = (this.options.currentStep * -100).toString() + '%';
  
  if(this.options.useCSSAnimation){
    this.$container.css({marginLeft: newMargin});
  }
  else{
    this.$container
      .animate({
        "marginLeft": newMargin
      }, 300);
  }

  //let the world know what's happened
  this.$container.trigger("stepChanged.grsteps",{currentStep:this.options.currentStep});
}

/**
 * [addButtons description]
 */
GRSteps.prototype.buttonify = function(){
  var lastIndex = this.length-1;
  this.each(function(index, step) {
    if(index == lastIndex) {
      $(step).append(
        '<p class="pull-right"> \
          <button type="button" class="btn btn-danger btn-lg btn-next">Donate<span class="glyphicon glyphicon-chevron-right"></span></button> \
        </p>'
      );
    } else {
      $(step).append(
        '<p class="pull-right"> \
          <button type="button" class="btn btn-danger btn-lg btn-next">Donate<span class="glyphicon glyphicon-chevron-right"></span></button> \
        </p>'
      );
    }

    if(index>0) {
      $(step).append(
        '<p class="pull-left back-button"> \
          <button type="button" class="go-back btn-prev"><span class="glyphicon glyphicon-chevron-left"></span> Back</button> \
        </p>'
      );
    }
  });
}

/**
 * [next description]
 * @return {Function} [description]
 */
GRSteps.prototype.nextStep = function(){
  this.switchTo(this.options.currentStep + 1)
}

GRSteps.prototype.previousStep = function(){
  this.switchTo(this.options.currentStep - 1)
}

//step validator


module.exports = GRSteps;