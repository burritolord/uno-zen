/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

// -- Dependencies --------------------------------------------------------------

const gulp        = require('gulp');
const gulpif      = require('gulp-if');
const sass        = require('gulp-sass');
const concat      = require('gulp-concat');
const header      = require('gulp-header');
const uglify      = require('gulp-uglify-es').default;
const cssnano     = require('gulp-cssnano');
const changed     = require('gulp-changed');
const browserSync = require('browser-sync');
const pkg         = require('./package.json');
const prefix      = require('gulp-autoprefixer');
const strip       = require('gulp-strip-css-comments');
const pump        = require('pump');
const { reload }      = browserSync;

let isProduction = process.env.NODE_ENV === 'production';
isProduction = true;
// -- Files ---------------------------------------------------------------------

const dist = {
  name       : pkg.name,
  css        : 'assets/css',
  js         : 'assets/js'
};

const src = {
  sass: {
    main     : `assets/scss/${dist.name}.scss`,
    files    : ['assets/scss/**/**']
  },

  js         : {
    common   : {
      main   : ['assets/js/src/__init.js',
                'assets/js/src/main.js',
                'assets/js/src/cover.js'],
      node_modules : ['node_modules/fastclick/lib/fastclick.js',
                      'node_modules/instantclick/instantclick.js'],
    },
    post     : ['node_modules/fitvids/fitvids.js',
                'assets/js/src/prism.js']
  },

  css      : {
    main   : `assets/css/${dist.name}.css`,
  }
};

const banner = [ "/**",
           " * <%= pkg.name %> - <%= pkg.description %>",
           " * @version <%= pkg.version %>",
           " * @link    <%= pkg.homepage %>",
           " * @author  <%= pkg.author.name %> (<%= pkg.author.url %>)",
           " * @license <%= pkg.license %>",
           " */",
           "" ].join("\n");

// -- Tasks ---------------------------------------------------------------------

gulp.task('js-common', function(cb) {
  pump([
    gulp.src(src.js.common.node_modules),
    changed(dist.js),
    gulp.src(src.js.common.main),
    concat(dist.name + '.common.js'),
    gulpif(isProduction, uglify()),
    gulpif(isProduction, header(banner, {pkg})),
    gulp.dest(dist.js),
  ], cb);
});


gulp.task('js-post', function(cb) {
  pump([
    gulp.src(src.js.post),
    changed(dist.js),
    concat(dist.name + '.post.js'),
    gulpif(isProduction, uglify()),
    gulpif(isProduction, header(banner, {pkg})),
    gulp.dest(dist.js),
  ], cb);
});

gulp.task('css', function(cb) {
  pump([
    gulp.src(src.sass.main),
    changed(dist.css),
    sass().on('error', sass.logError),
    concat(`${dist.name}.css`),
    gulpif(isProduction, prefix()),
    gulpif(isProduction, strip({all: true})),
    gulpif(isProduction, cssnano()),
    gulpif(isProduction, header(banner, {pkg})),
    gulp.dest(dist.css),
  ], cb);
});

gulp.task('server', () => browserSync.init(pkg.browserSync));

gulp.task('js', ['js-common', 'js-post']);
gulp.task('build', ['css', 'js']);

gulp.task('default', function() {
  gulp.start(['build', 'server']);
  gulp.watch(src.sass.files, ['css', reload]);
  gulp.watch(src.js.common.main, ['js-common', reload]);
  return gulp.watch(src.js.post, ['js-post', reload]);
});
