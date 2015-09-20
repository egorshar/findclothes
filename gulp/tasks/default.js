var gulp = require('gulp');

gulp.task('default', ['jade', 'less', 'scripts']);
gulp.task('dev', ['watch']);
