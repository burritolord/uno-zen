/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

// -- Dependencies --------------------------------------------------------------

import gulp from 'gulp';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import header from 'gulp-header';
import uglify from 'gulp-uglify-es';
import cssnano from 'gulp-cssnano';
import changed from 'gulp-changed';
import browserSync from 'browser-sync';
import pkg from './package.json';
import prefix from 'gulp-autoprefixer';
import strip from 'gulp-strip-css-comments';
import pump from 'pump';
import { reload } from 'browser-sync';

let isProduction = process.env.NODE_ENV === 'production';
// isProduction = true;
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

gulp.task('js-common', (cb) => {
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


gulp.task('js-post', (cb) => {
  pump([
    gulp.src(src.js.post),
    changed(dist.js),
    concat(dist.name + '.post.js'),
    gulpif(isProduction, uglify()),
    gulpif(isProduction, header(banner, {pkg})),
    gulp.dest(dist.js),
  ], cb);
});

gulp.task('css', (cb) => {
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

gulp.task('js', gulp.series('js-common', 'js-post'));
gulp.task('build', gulp.series('css', 'js'));

gulp.task('default', function() {
  gulp.start(['build', 'server']);
  gulp.watch(src.sass.files, ['css', reload]);
  gulp.watch(src.js.common.main, ['js-common', reload]);
  return gulp.watch(src.js.post, ['js-post', reload]);
});
