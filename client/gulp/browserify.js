var transform = require('vinyl-transform');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var lodash = require('lodash');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var path = require('path');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var shimify = require('browserify-shim');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var error = require('./error.js');
var cfg = require('../package.json').customConfig;

var browserifyConfig = {
  basedir: '.',
  paths: [cfg.sourcePath + '/js']
};
var jsDest = cfg.destPath + '/js';
var jsSource = cfg.sourcePath + '/js/pages/*/*.js';

gulp.task('browserify-watch', function(){
  var bundle;
  var bundler;
  var cached = {};

  // browserify pipe
  bundler = function() {
    return transform(function(filename){
      // cached
      if(cached[filename]) {
        return cached[filename].bundle();
      }

      var b = watchify(browserify(filename,
                                  lodash.extend(browserifyConfig,
                                                watchify.args,
                                                {debug: true})));
      // event
      b.on('update', bundle(filename, jsDest + '/' + path.basename(path.dirname(filename))));
      b.on('error', error.browserifyHandler);
      b.on('time', function(time){
        gutil.log(gutil.colors.green('Browserify'),
                  getShortFilename(filename) + gutil.colors.magenta(' in ' + time + 'ms'));
      });
      // transform
      b.transform(shimify);

      cached[filename] = b;

      return b.bundle();
    });
  };

  // gulp stream
  bundle = function(source, dest){
    return function(){
      return gulp.src([source])
        .pipe(plumber({errorHandler: error.browserifyHandler}))
        .pipe(jshint({lookup:false}))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(bundler())          // call the transformer previously defined
        .pipe(gulp.dest(dest))
        .pipe(livereload());
    };
  };

  return bundle(jsSource, jsDest)();
});

gulp.task('browserify-dev', function(){
  var bundler = transform(function(filename){
    var b = browserify(filename, lodash.extend(browserifyConfig, {debug: true}));

    b.on('error', error.browserifyHandler);
    b.on('time', function(time){
      gutil.log(gutil.colors.green('Browserify'),
                getShortFilename(filename) + gutil.colors.magenta(' in ' + time + 'ms'));
    });

    b.transform(shimify);

    return b.bundle();
  });

  return gulp.src(jsSource)
    .pipe(plumber({errorHandler: error.browserifyHandler}))
    .pipe(jshint({lookup:false}))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(bundler)
    .pipe(gulp.dest(jsDest));
});

gulp.task('browserify-prod', function(){
  var bundler = transform(function(filename){
    var b = browserify(filename, browserifyConfig);

    b.on('error', error.browserifyHandler);
    b.on('time', function(time){
      gutil.log(gutil.colors.green('Browserify'),
                getShortFilename(filename) + gutil.colors.magenta(' in ' + time + 'ms'));
    });

    b.transform(shimify);

    return b.bundle();
  });

  return gulp.src(jsSource)
    .pipe(plumber({errorHandler: error.browserifyHandler}))
    .pipe(bundler)
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

function getShortFilename(filename) {
  return path.basename(path.dirname(filename)) + '/' + path.basename(filename);
}
