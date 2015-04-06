# Basic commands

- Build everything with source map for development mode (install bower
components, concat lib files, build less, js files,...)

```
gulp dev
```

- Watch for less and js files and auto rebuild them on file changes, should run
after `gulp dev`

```
gulp watch
```

- Build and minify everything for production mode (install bower
components, concat lib files, build less, js files,...)

```
gulp prod
```

# Javascript

Javascript files are located in `source/js` and are built with Browserify. To add a new script file for new
page, create a folder with one `main.js` file inside `pages` folder. Each
main.js file will be built to a corresponding file in dest. `share` folder
contains script that can be re-use among pages.

The structure will look like this

```
-- source
  |- pages
  | |- page1
  | | |- main.js
  | | |- login.js
  | | |- validation.js
  | |
  | |- page2
  |   |- main.js
  |   |- handle.js
  |
  |- share
    |- init.js
```

The contain of `page1/main.js` will look like this

```
require('share/init.js');   // include share/init.js

require('./login.js');      // include login.js
require('./validation.js'); // include validation.js

// other code
...
```

The contain of `page2/main.js` will look like this

```
require('share/init.js');   // include share/init.js

require('./handle.js');     // include handle.js

// other code
...
```

After running `gulp dev`, files will be built to `dest/js/`.

Read more about Nodejs module style here [https://nodejs.org/api/modules.html](https://nodejs.org/api/modules.html)

# Stylesheet

Less files are located inside `source/less`. Similar to js files, only .less files in
pages folder are built and output to `dest` folder. You can also include share
less file in share folder like this

```
@import "share/login.less";
```

**Note**: bower folder is symlink to `share` folder automatically when running
`gulp dev`, so you can easily import any library using this syntax

```
@import "share/bower/bootstrap/less/bootstrap.less";
```

# Config

Config are located inside package.json file, mostly under `customConfig`
section.

- `browserify-shim`: config for getting browserify module from global, for
example, if you add this to browserify-shim section

```
"jquery": "global:$"
```

you can require jquery in your code like this

```
var jquery = require('jquery');
// which will be translated to
// var jquery = window.$;
```

- `destPath`: config the destination path, usually you will want to config this
to you static folder

- `assets`: the assets you want to copy, use the key for source files and value
for destination

- `symlinks`: optinal path you want to symlink
