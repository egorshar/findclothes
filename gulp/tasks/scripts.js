var _ = require('underscore'),
    gulp = require('gulp'),
    scripts = require('../config').js,
    config = require(scripts.config),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  rjs(_.extend({}, config, {
      name: 'waaant',
      out: 'waaant.min.js',
      baseUrl: scripts.src,
      preserveLicenseComments: true,
      optimize: 'uglify2',
      deps: ['requirejs'],
    }))
    .pipe(uglify({
      preserveComments: 'license',
    }))
    .pipe(gulp.dest(scripts.dest));
});
