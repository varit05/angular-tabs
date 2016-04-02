var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    serve = require('gulp-serve'),
    plugins = require('gulp-load-plugins')(),
    wiredep = require('wiredep-cli');

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(includeSource())
        .pipe(gulp.dest('dist'))
});

gulp.task('jshint', function() {
    gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('dist/css'))
});

//gulp.task('html', function () {
//    return gulp.src('src/*.html')
//        .pipe(useref())
//        .pipe(gulp.dest('dist'));
//});

gulp.task('wiredep', function() {

    var wiredep = require('wiredep').stream;

    //gulp.src('src/*.html')
    //    .pipe(wiredep({
    //        directory: 'dist/bower_components',
    //        exclude: ['bootstrap-sass-official'],
    //        ignorePath: /^(\.\.\/)*\.\./
    //    }))
    //    .pipe(gulp.dest('dist'));
    return gulp.src('src/index.html')
        .pipe(wiredep({
            fileTypes: {
                html: {
                    replace: {
                        js: function(filePath) {
                            return '<script src="' + 'bower_components/js/' + filePath.split('/').pop() + '"></script>';
                        },
                        css: function(filePath) {
                            return '<link rel="stylesheet" href="' + 'bower_components/css/' + filePath.split('/').pop() + '"/>';
                        }
                    }
                }
            }
        }))

        .pipe(plugins.inject(
            gulp.src(['src/**/*.js'], { read: false }), {
                addRootSlash: false,
                transform: function(filePath, file, i, length) {
                    return '<script src="' + filePath.replace('dist/js/', '') + '"></script>';
                }
            }))

            .pipe(plugins.inject(
                gulp.src(['src/**/*.scss'], { read: false }), {
                    addRootSlash: false,
                    transform: function(filePath, file, i, length) {
                        return '<link rel="stylesheet" href="' + filePath.replace('dist/css/', '') + '"/>';
                    }
                }))

            .pipe(gulp.dest('dist'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['scripts']);
});

gulp.task('serve', serve('dist'));

// create a default task and just log a message
gulp.task('default', ['jshint', 'scripts', 'sass', 'wiredep', 'serve', 'watch']);