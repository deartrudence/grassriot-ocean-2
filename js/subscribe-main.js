var ENBeautifier = require('./modules/ENBeautifier');
var beautifier;

var $form = $('.eaform');
var $columnContainer;
var $leftColumn;
var $rightColumn;

//Main event
$(document).ready(init);

function init() {
    sortTwoColumn();
    $columnContainer = $(".en_wrapper");
    $leftColumn = $("#left_wrapper1");
    $rightColumn = $("#right_wrapper1");

    $(".eaQuestionTextareaFormFieldContainer").prev(".eaQuestionLabel").addClass("fullwidth");
    if ( $('.eaRightColumnContent').length != 0 )
    {
        var sub = $(".eaSubmitResetButtonGroup").detach();
        $(".en_right_wrapper:last").append(sub);
    }
    
    beautifier = new ENBeautifier({
        form: $form
    });
    beautifier.usePlaceholders(false);

    //handle image and caption
    $('.hero').css('background-image', 'url('+$leftColumn.children("div:first").find("img").attr("src")+')');
    $('.hero').append($leftColumn.children("div:first").find("p").addClass("heroCaption"));
    //$leftColumn.children("div:first").remove();
    
    if(typeof window.unsubscribePage !== "undefined" && window.unsubscribePage == true) {
        init_unsubscribe();
    }
}

function init_unsubscribe() {
    $form.find('input[name="Accepts Electronic Communications"]').not('[type="hidden"]').remove();
    $form.find('input[type="checkbox"]').prop("checked", true);
}