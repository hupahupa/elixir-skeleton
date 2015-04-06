var gulp = require('gulp');
var bower = require('bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var lodash = require('lodash');
var path = require('path');
var fs = require('fs');

var pkg = require('../package.json');
var config = pkg.customConfig;
var jsDest = config.destPath + '/js';

gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
});

gulp.task('libs-dev', ['bower'], function(){
  return gulp.src(config.libFiles)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(jsDest));
});

gulp.task('libs-prod', ['bower'], function(){
  return gulp.src(config.libFiles)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('assets', ['bower'], function(){
  var streams = [];
  lodash.each(config.assets, function(dest, source){
    streams.push(gulp.src(source).pipe(gulp.dest(dest)));
  });

  return merge.apply(null, streams);
});

gulp.task('symlink', ['bower'], function(cb){
  lodash.each(config.symlinks, function(dest, source){
    var destFull = path.normalize(process.cwd() + '/' + dest);
    var sourceFull = path.normalize(process.cwd() + '/' + source);

    var stat;
    try{
      stat = fs.lstatSync(destFull);
      fs.unlinkSync(destFull);
    } catch(e){
    }

    fs.symlinkSync(sourceFull, destFull);
  });

  cb();
});
