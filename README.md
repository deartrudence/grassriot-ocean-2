# Setup

- Change the package name in package.json

- npm install

# Use

- Add any new javascript files (that aren't available in NPM) in ./vendor, then register them in webpack.config.js

# Notes

- Bootstrap is included as a subtree. Include anything you need from there. Update it using git subtree pull --prefix vendor/bootstrap git@github.com:twbs/bootstrap-sass.git master --squash



