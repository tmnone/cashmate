"use strict";

// Gulp plugins
var gulp = require('gulp'),
    KarmaServer = require('karma').Server,
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    templateCache = require('gulp-angular-templatecache'),
    connect = require('gulp-connect');

// Sources
var src = {
  'css':  ['app/stylesheets/app.scss'],
  'html': ['app/views/pages/**/*.html'],
  'tpls': ['app/views/tpls/**/*.html'],
  'jslibs': [
    'node_modules/angular/angular.js',
    'node_modules/angular-route/angular-route.js',
    'node_modules/angular-resource/angular-resource.js',
    'node_modules/angular-local-storage/dist/angular-local-storage.js',
    'node_modules/ng-lodash/build/ng-lodash.js'
  ],
  'js':   [
    'app/javascripts/app.js',
    'app/javascripts/*.js',
    'app/javascripts/**/*.js'
  ]
}

// Dests
var dest = {
  'scss': 'build/css',
  'js'  : 'build/js',
  'html': 'build/pages'
}

// Watches
var watch = {
  'css':  ['app/stylesheets/**/*.scss'],
  'html': ['app/views/pages/**/*.html'],
  'tpls': ['app/views/tpls/**/*.html'],
  'js':   ['app/javascripts/**/*.js']
} 

// Server
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    port: 4730,
    livereload: true
  });
});

// CSS
gulp.task('css', function () {
  gulp.src(src.css)
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('> 1%', 'last 2 version', 'ie 9', 'ios 6', 'android 4'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest.scss))
    .pipe(connect.reload());
});

// TPLS
gulp.task('tpls', function () {
  gulp.src(src.tpls)
    .pipe(plumber())
    .pipe(templateCache('tpl.js', { module:'templatescache', standalone:true}))
    .pipe(gulp.dest(dest.js))
    .pipe(connect.reload());
});

// HTML
gulp.task('html', function () {
  gulp.src(src.html)
    .pipe(gulp.dest(dest.html))
    .pipe(connect.reload());
});

// JS
gulp.task('jslibs', function() {
  gulp.src(src.jslibs)
    .pipe(plumber())
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest.js))
});
gulp.task('js', function() {
  gulp.src(src.js)
    .pipe(plumber())
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(dest.js))
    .pipe(connect.reload())
});

// Watch
gulp.task('watch', function() {
  gulp.watch(watch.html, ['html']);
  gulp.watch(watch.css,  ['css']);
  gulp.watch(watch.tpls, ['tpls']);
  gulp.watch(watch.js,   ['js']);
});

// Test
gulp.task('tdd', function (done) {
  console.log('Karma config path', __dirname + '/karma.conf.js');

  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();

});

// Default
gulp.task('default', ['css', 'html', 'tpls', 'jslibs', 'js', 'watch', 'connect']);
gulp.task('test', ['tdd']);