//Start the grunt module
module.exports = function(grunt) {

    //load task runners in to grunt for:
    //webpack
    grunt.loadNpmTasks("grunt-webpack");

    //compass
    grunt.loadNpmTasks('grunt-contrib-compass');

    //automatic running on file change (watch)
    grunt.loadNpmTasks('grunt-contrib-watch');

    //pull in modules for webpack and path finding
    var webpack = require("webpack");
    var path = require("path");

    //pull in the webpack configuration file
    var webpackConfig = require("./webpack.config.js");

    //Configure grunt
    grunt.initConfig({
      //tell Compass to use the Production configs
      compass: {
        prod: {
          options: {
            config: 'config.rb',
            environment: 'production',
            force: true
          }
        },
        dev: {
          options: {
            config: 'config.rb',
            environment: 'development'
          }
        },
        server: {
          options: {
            debugInfo: false
          }
        }
      },
      //Webpack task config
      webpack: {
        //general options
        options: webpackConfig,

        //additional options for the "dev" variation
        dev: {
          plugins: [
            new webpack.DefinePlugin({
              __DEV__: true,
              "process.env":{
                "BUILD_DEV": 'true'
              }
            })
          ]
        },

        //additional options for the "build" variation
        prod: {
          plugins: [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
              //Uglify is pretty aggressive with its code cleanup.
              //Ask it to leave our "dead" and "unused" code alone
              compress: {
              }
            }),
            new webpack.DefinePlugin({
              __DEV__: false,
              "process.env":{
                "BUILD_DEV": 'false'
              }
            })
          ],
          output: {
            publicPath: "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/1982/",
          }
        }
      },

      //Watch task config
      watch: {
        //config for the "app" variation
        app: {
          //folder to watch
          files: ["js/*"],

          //tasks to run
          tasks: ["webpack:dev"],

          //Additional options
          options: {
            spawn: false
          }
        },
        css: {
          files: '**/*.scss',
          tasks: ['compass:dev']
        }
      }
    });


    //Stuff that runs when calling "grunt" on command line
    grunt.registerTask("default", ["webpack:dev", "compass:dev"]);

    //Stuff that runs when calling "grunt dev" on command line
    grunt.registerTask("dev", ["webpack:dev", "watch:app", "watch:css"]);

    //Stuff that runs when calling "grunt build" on command line
    grunt.registerTask("build", ["webpack:prod", "compass:prod"])
};
