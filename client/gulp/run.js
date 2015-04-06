var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('watch', ['browserify-watch', 'less-watch'], function(){
  livereload.listen();
});

gulp.task('dev', ['browserify-dev', 'less-dev', 'bower', 'assets', 'libs-dev'], function(){});

gulp.task('prod', ['browserify-prod', 'less-prod', 'bower', 'assets', 'libs-prod'], function(){});
