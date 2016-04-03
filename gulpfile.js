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
    inject = require('gulp-inject'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware'),
    wiredep = require('wiredep');

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
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html', function () {

    var target = gulp.src('src/index.html');

    var sources = gulp.src(['dist/**/*.js', 'dist/**/*.css'], {read: false});
    return target.pipe(inject(sources))
        .pipe(gulp.dest('dist'));
});

gulp.task('wiredep', function() {

    var wiredep = require('wiredep').stream;

    return gulp.src('dist/index.html')
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
        }));

        //.pipe(plugins.inject(
        //    gulp.src(['src/**/*.js'], { read: false }), {
        //        addRootSlash: false,
        //        transform: function(filePath) {
        //            return '<script src="' + filePath.replace('dist/js/', '') + '"></script>';
        //        }
        //    }))
        //
        //.pipe(plugins.inject(
        //    gulp.src(['src/**/*.scss'], { read: false }), {
        //        addRootSlash: false,
        //        transform: function(filePath) {
        //            return '<link rel="stylesheet" href="' + filePath.replace('dist/css/', '') + '"/>';
        //        }
        //    }))

        //.pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        root: 'dist',
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api', {
                    target: 'http://localhost:3000',
                    changeOrigin:true
                })
            ]
        }
    });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['scripts']);
});

//gulp.task('clean', function() {
//    return gulp.src('dist/index.html')
//        .pipe(clean());
//});


// create a default task and just log a message
gulp.task('default', ['jshint', 'scripts', 'sass', 'html', 'wiredep', 'connect', 'watch']);