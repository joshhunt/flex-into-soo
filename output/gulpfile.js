(function() {
  var DEST, autoprefiexer, coffee, concat, ecstatic, embedlr, es, gulp, http, livereload, lr, lrPort, lrServer, rename, rimraf, serverPort, stylus;

  http = require('http');

  es = require('event-stream');

  lr = require('tiny-lr');

  gulp = require('gulp');

  rimraf = require('rimraf');

  rename = require('gulp-rename');

  stylus = require('gulp-stylus');

  embedlr = require('gulp-embedlr');

  ecstatic = require('ecstatic');

  livereload = require('gulp-livereload');

  autoprefiexer = require('gulp-autoprefixer');

  coffee = require('gulp-coffee');

  concat = require('gulp-concat');

  require('colors');

  DEST = './output';

  serverPort = process.env.PORT || 5979;

  lrPort = process.env.LR_PORT || 6132;

  lrServer = lr();

  gulp.task('clean', function(cb) {
    return rimraf(DEST, cb);
  });

  gulp.task('html', function() {
    return gulp.src('./*.html').pipe(embedlr({
      port: lrPort
    })).pipe(gulp.dest(DEST)).pipe(livereload(lrServer));
  });

  gulp.task('styles', function() {
    return gulp.src('./styles.styl').pipe(stylus()).pipe(autoprefiexer()).pipe(rename('styles.css')).pipe(gulp.dest(DEST)).pipe(livereload(lrServer));
  });

  gulp.task('scripts', function() {
    return gulp.src('./*.coffee').pipe(coffee()).pipe(gulp.dest(DEST));
  });

  gulp.task('vendor', function() {
    var deps;
    deps = ['./node_modules/moment/moment.js'];
    return gulp.src(deps).pipe(concat('vendor.js')).pipe(gulp.dest(DEST));
  });

  gulp.task('watch', function() {
    gulp.watch(['./*.styl'], ['styles']);
    gulp.watch(['./*.html'], ['html']);
    return gulp.watch(['./*.coffee'], ['scripts']);
  });

  gulp.task('serve', function() {
    http.createServer(ecstatic({
      root: DEST
    })).listen(serverPort);
    lrServer.listen(lrPort);
    console.log('###'.grey);
    console.log('## '.grey + ("Running server on port " + serverPort).green);
    console.log('## '.grey + ("Point your webbrowser to http://localhost:" + serverPort).green);
    console.log('###'.grey);
  });

  gulp.task('build', function() {
    return gulp.start(['html', 'styles', 'scripts', 'vendor']);
  });

  gulp.task('default', ['clean'], function() {
    return gulp.start(['build', 'watch', 'serve']);
  });

}).call(this);
