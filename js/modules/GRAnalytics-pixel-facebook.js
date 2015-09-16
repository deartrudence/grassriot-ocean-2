/**
 * GRAnalytics-pixel-facebook module.
 * 
 * specific implementation for facebook pixel (old method)
 * 
 */

window.fb_param = {};
path = '//connect.facebook.net/en_US/fp.js';

function showPixel(id, transactionData) {
    fb_param.pixel_id = id; 
    if(transactionData instanceof Object) {
        fb_param.value = transactionData.revenue; 
        fb_param.currency = transactionData.currency;
    }
    $.getScript(path);
}

module.exports = {
    showPixel: showPixel
};