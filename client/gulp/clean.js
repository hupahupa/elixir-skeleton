var gulp = require('gulp');
var plumber = require('gulp-plumber');
var del = require('del');
var lodash = require('lodash');
var fs = require('fs');

var config = require('../package.json').customConfig;

gulp.task('clean-dist', function(cb){
  del(config.destPath, {force: true}, function(err){
    cb();
  });
});

gulp.task('clean-bower', function(cb){
  del('./bower', {force: true}, function(err){
    cb();
  });
});

gulp.task('clean-symlink', function(cb){
  lodash.each(config.symlinks, function(value, key){
    try{
      fs.unlinkSync(value);
    } catch(e){}
  });
  cb();
});

gulp.task('clean', ['clean-dist', 'clean-bower', 'clean-symlink'], function(){});
