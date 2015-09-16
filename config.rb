# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = (environment == :production) ? "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/1943/" : "./" 
css_dir = (environment == :production) ? "css" : "css"
sass_dir = (environment == :production) ? "scss" : "scss"
images_dir = (environment == :production) ? "" : "img"
javascripts_dir = (environment == :production) ? "" : "js"
fonts_dir = (environment == :production) ? "" : "fonts"
relative_assets = (environment == :production) ? false : true


#include bootstrap partials for import
add_import_path "vendor/bootstrap/assets/stylesheets"

#include bootstrap affix
add_import_path "vendor/bootstrap/assets/javascripts/bootstrap/affix.js"

#include slick partial for import
add_import_path "vendor/slick/"

# You can select your preferred output style here (can be overridden via the command line):
output_style = (environment == :production) ? :compressed : :expanded;
sourcemap = (environment == :production) ? false : true;

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false
