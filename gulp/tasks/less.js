var gulp = require('gulp');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var path = require('path');
var config = require('../config').less;

gulp.task('less', function() {
  console.log(path.join(__dirname, 'less', 'includes'));
  return gulp.src(config.src)
    .pipe(changed(config.dest))
    .pipe(less({
      paths: config.src + '/**/'
    }))
    .on('error', gutil.log)
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
    }))
    .pipe(concat('less.css'))
    .pipe(gulp.dest(config.dest));
});
