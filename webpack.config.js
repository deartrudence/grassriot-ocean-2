var webpack = require("webpack");
var path = require("path");
// var jquery = require("./js/jquery-1.11.2.min.js");
 
module.exports = {
    plugin: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    entry: "./js/main",
    resolve: {
        modulesDirectories: [
            "./js/modules/.",
            "./node_modules"
        ],
        alias: {
            jquery: path.join(__dirname, "js/jquery-1.11.2.min.js")
        }
    },
    output: {
        publicPath: "js/",
        filename: "./js/bundle.js"
    }
};