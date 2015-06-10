/*
Note: Register external JS files below!
 */

var webpack = require("webpack");
var path = require("path");
 
var config = {
  opt: {
    build_dev: true
  },
  //handy vendor adding function!
  //Thanks http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
  addVendor: function (name, relpath) {
    var abspath = path.join(__dirname, relpath);
    this.resolve.alias[name] = abspath;
    // this.module.noParse.push(new RegExp(abspath));
    this.entry.vendor.push(name);
  },

  //The base JS file that requires everything
  entry: {
   app: "./js/main",
   vendor: []
  },

  //Modules to include
  resolve: {
    modulesDirectories: [
      "./js/modules/.",
      "./node_modules"
    ],
    alias: {} //vendor files are added below
  },

  //JS chunker
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
      'vendors',
      './js/vendors.js'
      ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery'
    })
  ],
  //output naming
  output: {
    publicPath: "js/",
    filename: "./js/app.js"
  },

  //placeholder for the vendor file adder to tell Grunt to ignore external files
  module: {
    noParse: []
  }
};

config.addVendor('jquery', "vendor/jquery-1.11.3.min.js");
config.addVendor('jqueryvalidate', "vendor/jquery.validate.min.js");
config.addVendor('raygun', "vendor/raygun/raygun.min.js");
config.addVendor('tota11y',"vendor/tota11y.min.js");


module.exports = config;