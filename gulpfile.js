/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

// -- Dependencies --------------------------------------------------------------

const gulp        = require('gulp');
const gulpif      = require('gulp-if');
const gutil       = require('gulp-util');
const sass        = require('gulp-sass');
const concat      = require('gulp-concat');
const coffee      = require('gulp-coffee');
const header      = require('gulp-header');
const uglify      = require('gulp-uglify');
const cssnano     = require('gulp-cssnano');
const addsrc      = require('gulp-add-src');
const changed     = require('gulp-changed');
const browserSync = require('browser-sync');
const pkg         = require('./package.json');
const prefix      = require('gulp-autoprefixer');
const strip       = require('gulp-strip-css-comments');
const { reload }      = browserSync;

const isProduction = process.env.NODE_ENV === 'production';

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
      main   : ['assets/js/src/__init.coffee',
                'assets/js/src/main.coffee',
                'assets/js/src/cover.coffee'],
      vendor : ['assets/vendor/fastclick/lib/fastclick.js',
                'assets/vendor/instantclick/instantclick.js',
                'assets/vendor/pace/pace.min.js',
                'assets/vendor/reading-time/build/readingTime.min.js']
    },
    post     : ['assets/vendor/fitvids/jquery.fitvids.js',
                'assets/js/src/prism.js']
  },

  css      : {
    main   : `assets/css/${dist.name}.css`,
    vendor : []
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

gulp.task('js-common', function() {
  gulp.src(src.js.common.main)
  .pipe(changed(dist.js))
  .pipe(coffee().on('error', gutil.log))
  .pipe(addsrc(src.js.common.vendor))
  .pipe(concat(dist.name + '.common.js'))
  .pipe(gulpif(isProduction, uglify()))
  .pipe(gulpif(isProduction, header(banner, {pkg})))
  .pipe(gulp.dest(dist.js));
});

gulp.task('js-post', function() {
  gulp.src(src.js.post)
  .pipe(changed(dist.js))
  .pipe(concat(dist.name + '.post.js'))
  .pipe(gulpif(isProduction, uglify()))
  .pipe(gulpif(isProduction, header(banner, {pkg})))
  .pipe(gulp.dest(dist.js));
});

gulp.task('css', function() {
  gulp.src(src.css.vendor)
  .pipe(changed(dist.css))
  .pipe(addsrc(src.sass.main))
  .pipe(sass().on('error', sass.logError))
  .pipe(concat(`${dist.name}.css`))
  .pipe(gulpif(isProduction, prefix()))
  .pipe(gulpif(isProduction, strip({all: true})))
  .pipe(gulpif(isProduction, cssnano()))
  .pipe(gulpif(isProduction, header(banner, {pkg})))
  .pipe(gulp.dest(dist.css));
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
