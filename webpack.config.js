/*
Note: Register external JS files below!
 */

var webpack = require("webpack");
var path = require("path");


//try to fence tota11y behind process.env


var config = {
  // opt: {
  //   build_dev: true
  // },
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
      'vendor',
      'vendors.js'
      ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery'
    }),
    // new webpack.DefinePlugin({
    //   __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true' ))
    // })
  ],
  //output naming
  output: {
    publicPath: "output/",
    path: "./output",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  //placeholder for the vendor file adder to tell Grunt to ignore external files
  module: {
    noParse: []
  }
};

config.addVendor('bowser', "vendor/bowser.js");
config.addVendor('jquery', "vendor/jquery-1.11.3.min.js");
config.addVendor('jqueryvalidate', "vendor/jquery.validate.min.js");
// config.addVendor('raygun', "vendor/raygun/raygun.min.js");
config.addVendor('modernizr',"vendor/modernizr.min.js");
//config.addVendor('slick', "vendor/slick/slick.min.js");
config.addVendor('affix', "vendor/bootstrap/assets/javascripts/bootstrap/affix.js");
config.addVendor('modal', "vendor/bootstrap/assets/javascripts/bootstrap/modal.js");
config.addVendor('tooltip', "vendor/bootstrap/assets/javascripts/bootstrap/tooltip.js");
config.addVendor('cycle', "vendor/jquery.cycle2.min.js");
config.addVendor('popover', "vendor/bootstrap/assets/javascripts/bootstrap/popover.js");
//config.addVendor('ticker', "vendor/Ticker.js");
//config.addVendor('jqueryeasing', "vendor/jquery.easing.min.js");

if(process.env.BUILD_DEV === "true"){
  config.addVendor('tota11y',"vendor/tota11y.min.js");
}



module.exports = config;
