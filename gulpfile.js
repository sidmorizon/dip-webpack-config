/**
 * Created by zuozhuo on 2017/5/10.
 */
'use strict'
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpClean = require('gulp-clean');


gulp.task('clean',function(){
    gulp.src('test/dist-prepare/')
        .pipe(gulpClean())
});

gulp.task('default',['clean'],function(){
    gulp.src('src/*.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('lib'));
});

