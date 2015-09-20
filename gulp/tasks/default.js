var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(callback) {
  runSequence(['jade', 'less'], 'scripts');
});
gulp.task('dev', ['watch']);
