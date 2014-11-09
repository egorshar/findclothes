var gulp = require('gulp');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var wrap = require('gulp-wrap-amd');
var config = require('../config').jade;

gulp.task('jade', function() {
  console.log(config.src);
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(jade({
      client: true
    })) // Compile templates
    .pipe(wrap({
      deps: ['jade'],
      params: ['jade'],
      moduleRoot: '.'
    }))
    .pipe(gulp.dest(config.dest));
});
