var gulp  = require('gulp');
var config= require('../config');

gulp.task('watch', function() {
  gulp.watch(config.jade.src, ['jade']);
  gulp.watch(config.less.src, ['less']);
});
