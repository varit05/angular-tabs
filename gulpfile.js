'use strict';

var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    server = require('karma').Server,
    templateCache = require('gulp-angular-templatecache');

var env_name = process.env.gBuild || 'dev';

console.log('Environment: ' + env_name);

/**
 * A Place for Common Varibles for source and destination Path
 */

var src = {
    js: 'src/js/**/*.js',
    css: 'src/scss/**/*.scss',
    index: 'src/index.html',
    templateHtml: 'src/html/**/*.html'
};

var dest = {
    js: 'dist/js',
    css: 'dist/css'
};

/**
 * Gulp Connect Task, connects to the server
 * root is dist folder
 * livereload is true
 * Serves dist folder at port 3000
 */
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000
    });
});

/**
 * Gulp HTML Task
 * Include Bower JS & CSS automatically
 * Include Src JS & CSS automatically
 * Copy complied Index file to dist folder
 */
gulp.task('html', function () {
    var sources = gulp.src(['./dist/js/**/*.js', './dist/css/**/*.css'], {read: false});

    var injectOptions = {
        ignorePath : '/dist'
    };

    gulp.src(src.index)
        .pipe(wiredep({
            directory: 'dist/bower_components',
            ignorePath: './dist'
        }))
        .pipe(inject(sources, injectOptions))
        .pipe(gulp.dest('dist'));
});

/**
 * Gulp CSS Task
 * conver SCSS to CSS
 * concat all SCSS into main.css
 * Add Browser Prefix to the CSS3 property
 */
gulp.task('css', function() {
    return gulp.src(src.css)
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 11', 'ie 10', 'ie 9']
        }))
        .pipe(gulp.dest(dest.css))
        .pipe(connect.reload());
});

/**
 * Gulp JS Task
 * Check Jshint
 * Report if Jshint Error found
 * Put all JS file to dist/js folder
 */
gulp.task('js', function() {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(gulpif(env_name === 'production', concat('main.js'))) 
        .pipe(gulpif(env_name === 'production', uglify()))
        .pipe(gulp.dest(dest.js))
        .pipe(connect.reload());
});

/**
 * Gulp Watch Task
 * Check Changes in CSS, JS and html files
 */
gulp.task('watch', function() {
    gulp.watch(src.css, ['css']);
    gulp.watch(src.js, ['js']);
    gulp.watch(src.index, ['html']);
    gulp.watch(src.templateHtml, ['html2js']);
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
 * Put all Html template inside dist/js folder
 * Module Name is shared.ui
 */
gulp.task('html2js', function () {
    gulp.src(src.templateHtml)
        .pipe(templateCache({
            module: 'shared.ui',
            standalone: true
        }))
        .pipe(gulp.dest(dest.js));
});

//default gulp task
gulp.task('default', ['js', 'css', 'html2js', 'html', 'connect', 'watch']);
