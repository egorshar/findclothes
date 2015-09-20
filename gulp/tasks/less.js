var gulp = require('gulp');
var changed = require('gulp-changed');
var cssimport = require('gulp-import-css');
var gutil = require('gulp-util');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var path = require('path');
var config = require('../config').less;

gulp.task('less', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest))
    .pipe(less({
      paths: [
        config.src + '/**/',
      ]
    }))
    .on('error', gutil.log)
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
    }))
    .pipe(concat('waaant.css'))
    .pipe(cssimport({
      matchPattern: '*.css',
    }))
    .pipe(gulp.dest(config.dest));
});
