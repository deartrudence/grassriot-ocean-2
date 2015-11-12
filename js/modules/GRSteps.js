/**
 * GRSteps module
 * 
 * Creates and handles a multi-step form
 * 
 * @version  0.3
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
    'stepButton': 'Next<span class="glyphicon glyphicon-chevron-right"></span>',
    'actionButton': 'Donate<span class="glyphicon glyphicon-chevron-right"></span>',
    'currentStep': false,
    'startStep': 0,
    'useCSSAnimation': true,
    'addButtons': false,
    'backButtons': true
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
 * Initialize GRSteps !!MODIFIED 20151002!!
 *
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
    this.buttonify.call(this.options.steps, this);
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

  //handle tabbing issue
  $(this.options.steps).on('keydown', 'input, select, textarea, button', function(e) {
      if(e.which == 9) {
          var $stepPanel = $(this).parents('.page').first();
          var $lastTabbable = $stepPanel.find('input, select, textarea, button').filter(":last");
          var $firstTabbable = $stepPanel.find('input, select, textarea, button').filter(":first");
          if(!e.shiftKey && $(this).is($lastTabbable)) {
              e.preventDefault();
              $firstTabbable.focus();
              //formSteps.nextStep();
          } else if(e.shiftKey && $(this).is($firstTabbable)) {
              e.preventDefault();
              $lastTabbable.focus();
              //formSteps.previousStep();
          }
      }
  });
  
  this.$container.on('stepChanged.grsteps', function(e, step) {
      steps.$container.promise().done(function() {
          $(steps.options.steps)
              .filter(function(index) {
                  return (step.currentStep == index);
              })
              .find('input, select, textarea, button')
              .first()
              .focus();
      });
  });

  //Allow switching steps by clicking the breadcrumb
  $(this.options.indicatorTarget).on("click", '.'+this.options.completeClass, function(){
    var index = $(this).index();

    if(steps.options.currentStep > index){
      steps.switchTo(index);
    }
  });

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
  if(
    typeof this.options.direction !== "string"
    || this.options.direction === "right"
    || this.options.direction === "left"
    ){
    var containerWidthPercentage = 100 * this.stepIndicators.length;
    var panelWidthPercentage = 100 * (1/this.stepIndicators.length);
    this.$container.css("width", containerWidthPercentage + "%" );
    this.$container.children().css("width",panelWidthPercentage + "%"); 
  }
}

/**
 * [switchTo description]
 * @param  {[type]} stepNumber [description]
 * @return {[type]}            [description]
 */
GRSteps.prototype.switchTo = function(stepNumber){

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

  this.stepIndicators
    .removeClass(this.options.activeClass);

  //add the complete class to the current indicator
  //But only if going to a next step
  if(
    this.options.currentStep !== false
    && this.options.currentStep < stepNumber
    ){
    this.stepIndicators.eq(this.options.currentStep)
      .addClass(this.options.completeClass);
  }

  //switch the indicator
  this.options.currentStep = stepNumber;
  this.stepIndicators.eq(this.options.currentStep)
    .addClass(this.options.activeClass);

  //actually switch to the panel
  
  //simulate scrolling right
  if(
    typeof this.options.direction !== "string"
    || this.options.direction === "right"
    ){
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
  }

  //simulate scrolling down
  //@since 0.3
  else if(this.options.direction === "down"){
    //get the collective height of earlier elements
    var activePage = this.$container.children().eq(this.options.currentStep);

    var newScroll = activePage.prevAll()
      .map(function(){
        return $(this).outerHeight();
      })
      .get().reduce(function(sum, item){
        return sum + item;
      },0);

    if(this.options.useCSSAnimation){
      this.$container.css({
        scrollTop: newScroll,
        height: activePage.outerHeight()
      })
    }
    else{
      this.$container
        .animate({
          "scrollTop": newScroll,
          "height": activePage.outerHeight()
        }, 300);
    }
  }


  //let the world know what's happened
  this.$container.trigger("stepChanged.grsteps",{currentStep:this.options.currentStep});
}

/**
 * [addButtons description]
 */
GRSteps.prototype.buttonify = function(self){
  var lastIndex = self.options.actionStep;
  this.each(function(index, step) {
    if(index == lastIndex) {
      $(step).append(
        '<p class="pull-right"> \
          <button type="button" class="btn btn-danger btn-lg btn-next">'+self.options.actionButton+'</button> \
        </p>'
      );
    } else {
      $(step).append(
        '<p class="pull-right"> \
          <button type="button" class="btn btn-danger btn-lg btn-next">'+self.options.stepButton+'</button> \
        </p>'
      );
    }

    if(
      index>0
      && self.options.backButtons === true
      ) {
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

/**
 * Causes window to recalculate
 * @return {[type]} [description]
 *
 * @since  0.3
 */
GRSteps.prototype.refresh = function(){
  this.switchTo(this.options.currentStep);
}

//step validator


module.exports = GRSteps;