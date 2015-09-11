# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "./"
css_dir = "css"
sass_dir = "scss"
images_dir = "img"
javascripts_dir = "js"
fonts_dir = "./fonts"

#include bootstrap partials for import
add_import_path "vendor/bootstrap/assets/stylesheets"

#include slick partial for import
add_import_path "vendor/slick/"

# You can select your preferred output style here (can be overridden via the command line):
output_style = (environment == :production) ? :compressed : :expanded;
sourcemap = (environment == :production) ? false : true;

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false
