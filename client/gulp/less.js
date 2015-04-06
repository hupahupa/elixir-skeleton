var gulp = require('gulp');
var fs = require('fs');
var q = require('q');
var lodash = require('lodash');
var path = require('path');
var less = require('gulp-less');
var lessc = require('less');
var util = require('gulp-util');
var livereload = require('gulp-livereload');
var minify = require('gulp-minify-css');

var error = require('./error.js');
var config = require('../package.json').customConfig;

var sourcePath = config.sourcePath + '/less/pages';
var destPath = config.destPath + '/css/pages';
var lessSource = sourcePath + '/*.less';

gulp.task('less-dev', ['symlink'], function(){
  return gulp.src(lessSource)
    .pipe(less({paths: [config.sourcePath + '/less'], generateSourceMap: true}))
    .on('error', error.handler)
    .pipe(gulp.dest(destPath));
});

gulp.task('less-prod', ['symlink'], function(){
  return gulp.src(lessSource)
    .pipe(less({paths: [config.sourcePath + '/less']}))
    .on('error', error.handler)
    .pipe(minify())
    .pipe(gulp.dest(destPath));
});

////////////////////////////////////////////////////////////////////////////////
// Functions for watching files base on it dependencies

gulp.task('less-watch', ['symlink'], function(){
  var lessFiles = fs.readdirSync(sourcePath);
  var promises = [];
  var graph = {};               // dependencies graph
  var graphRev = {};            // dependencies graph in reverse order

  lodash.each(lessFiles, function(file){
    var filePath = sourcePath + '/' + file;
    parseFile(file, filePath, graph, promises);
  });

  q.all(promises).then(function(trees){
    // calculate the dependencies graph in reverse order
    reverse(graph, graphRev);
    // start the watch process
    watch(graphRev, graph);
    util.log('Analyzing Less files complete. You can start working on .less files now');
  }, function(reason){
    error.handler(reason);
  });
});

// Watching files base on the graph
function watch(graphRev, graph){
  lodash.each(graphRev, function(value, key) {
    var watcher = gulp.watch(key, function(e){
      transformLess(value);
    });
  });
}

// Transform input less files
function transformLess(input) {
  var outFolder = path.basename(path.dirname(input));
  outFolder = config.destPath + '/css/' + outFolder;

  var stream = gulp.src(input)
      .pipe(less({paths: [config.sourcePath + '/less'], generateSourceMap: true}))
      .on('error', error.handler)
      .pipe(gulp.dest(outFolder))
      .pipe(livereload());
  stream.on('data', function(e){
    util.log(util.colors.green(path.basename(e.path)), 'compiled');
  });

  return stream;
}

// Calculate the dependencies graph in reverse order
function parseFile(fileName, filePath, graph, promises) {
  // only parse if it's a .less file
  if(path.extname(fileName) === '.less') {
    var content = fs.readFileSync(filePath, 'utf8');
    var parser = new (lessc.Parser)({
      paths: [config.sourcePath + '/less', path.dirname(filePath)],
      filename: fileName
    });
    var promise = q.Promise(function(resolve, reject, notify) {
      parser.parse(content, function(err, tree) {
        if(err) {
          reject(err);
        } else {
          graph[filePath] = [];
          getDependencies(tree, graph[filePath]);
          resolve(tree);
        }
      });
    });
    promises.push(promise);
  }
}

// Recursively calculate the dependencies
function getDependencies(tree, dependencies) {
  var rules = tree.rules;
  lodash.each(rules, function(rule) {
    if(rule.hasOwnProperty("importedFilename")) {
      dependencies.push('./' + rule.importedFilename);
      getDependencies(rule.root, dependencies);
    }
  });
}

function reverse(graph, graphRev){
  lodash.each(graph, function(dependencies, file) {
    // the file is a dependency of itself, changing the file should trigger
    // compilation of that file also
    graphRev[file] = [file];

    lodash.each(dependencies, function(dependency){
      if(!graphRev.hasOwnProperty(dependency)) {
        // create new prop
        graphRev[dependency] = [];
      }
      if(graphRev[dependency].indexOf(file) < 0) graphRev[dependency].push(file);
    });
  });
}
