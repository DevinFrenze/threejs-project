three.js webpack

glsl hot module replacement thanks to @mattdesl (https://github.com/mattdesl/webpack-three-hmr-test)


## How to install

* Run `npm install`
* Run `npm start`
* Open http://localhost:8080

## TODO
* get objects to behave as desired
* better handle materials
* consider passing a "subscription" param to components that take update, so they can sign themselves up for updates instead of it always being something the parent has to do
* generate color palets
* add more controls to UI (see the threejs docs for code to reuse)
* load objects from assets
* add more effects / postprocessing
