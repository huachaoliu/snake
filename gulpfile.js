const gulp = require('gulp');
const path = require('path');
const gulpless = require('gulp-less');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

//transfer js
gulp.task('webpack:js', () => {
  gulp.src('./src/js/**/*.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./build/'));
});

//transfer less

gulp.task('less', () => {
  gulp.src('./src/less/*.less')
    .pipe(gulpless())
    .pipe(gulp.dest('./build/less'));
});

gulp.task('watch', ['webpack:js', 'less']);

gulp.task('default', ['webpack:js', 'less']);
