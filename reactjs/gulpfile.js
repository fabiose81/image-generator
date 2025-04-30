var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var uglifycss = require('gulp-uglifycss')

gulp.task('scss', function() {
    return gulp.src('./src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/styles/css'));
});

gulp.task('css', function() {
    return gulp.src('./src/styles/css/*.css')
        .pipe(uglifycss({
            "uglyComments": true
        }))
        .pipe(gulp.dest('./src/dist/'));
});

gulp.task('run', gulp.series('scss', 'css'));

gulp.task('watch', function() {
    gulp.watch('./src/styles/*.scss', gulp.series('scss'));
    gulp.watch('./src/styles/css/*.css', gulp.series('css'));
});

gulp.task('default', gulp.series('run', 'watch'));