'use strict';

var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    concatCSS = require('gulp-concat-css'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    server = require('karma').Server,
    templateCache = require('gulp-angular-templatecache');

//connect task
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000
    });
});

gulp.task('html', function () {
    var sources = gulp.src(['./dist/js/**/*.js', './dist/css/**/*.css'], {read: false});

    var injectOptions = {
        ignorePath : '/dist'
    };

    gulp.src('src/index.html')
        .pipe(wiredep({
            directory: 'dist/bower_components',
            ignorePath: './dist'
        }))
        .pipe(inject(sources, injectOptions))
        .pipe(gulp.dest('dist'));
});

// css task : convert scss to css and put to dist folder
gulp.task('css', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(concatCSS('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 11', 'ie 10', 'ie 9']
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

// js task : check jshint and put to dist folder
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

//watch task : watch scss, js, index.html
gulp.task('watch', function() {
    gulp.watch('src/scss/*.scss', ['css']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/index.html', ['html']);
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new server({
    configFile: require('path').resolve('karma.conf.js'),
    singleRun: true
  }, done).start();
});

/**
 * Run TemplateCache Task
 */
gulp.task('html2js', function () {
     gulp.src('src/html/**/*.html')
    .pipe(templateCache({
        module: 'shared.ui',
        standalone: true
    }))
    .pipe(gulp.dest('dist/js'));
});

//default gulp task
gulp.task('default', ['js', 'css', 'html2js', 'html', 'connect', 'watch']);