http          = require 'http'

es            = require 'event-stream'
lr            = require 'tiny-lr'
gulp          = require 'gulp'
rimraf        = require 'rimraf'
rename        = require 'gulp-rename'
stylus        = require 'gulp-stylus'
embedlr       = require 'gulp-embedlr'
ecstatic      = require 'ecstatic'
livereload    = require 'gulp-livereload'
autoprefiexer = require 'gulp-autoprefixer'
coffee        = require 'gulp-coffee'
concat        = require 'gulp-concat'
require 'colors'

DEST = './output'

serverPort = process.env.PORT or 5979
lrPort = process.env.LR_PORT or 6132
lrServer = lr()

gulp.task 'clean', (cb) -> rimraf DEST, cb

gulp.task 'html', ->
    gulp.src './*.html'
        .pipe embedlr {port: lrPort}
        .pipe gulp.dest DEST
        .pipe livereload lrServer

gulp.task 'styles', ->
    gulp.src './styles.styl'
        .pipe stylus()
        .pipe autoprefiexer()
        .pipe rename 'styles.css'
        .pipe gulp.dest DEST
        .pipe livereload lrServer

gulp.task 'scripts', ->
    gulp.src './*.coffee'
        .pipe coffee()
        .pipe gulp.dest DEST

gulp.task 'vendor', ->
    deps = [
        './node_modules/moment/moment.js'
    ]

    gulp.src deps
        .pipe concat 'vendor.js'
        .pipe gulp.dest DEST

gulp.task 'watch', ->
    gulp.watch ['./*.styl'], ['styles']
    gulp.watch ['./*.html'], ['html']
    gulp.watch ['./*.coffee'], ['scripts']

gulp.task 'serve', ->
    http.createServer(ecstatic({root: DEST})).listen serverPort
    lrServer.listen lrPort

    console.log '###'.grey
    console.log '## '.grey + "Running server on port #{serverPort}".green
    console.log '## '.grey + "Point your webbrowser to http://localhost:#{serverPort}".green
    console.log '###'.grey
    return

gulp.task 'build', ->
    gulp.start ['html', 'styles', 'scripts', 'vendor']

gulp.task 'default', ['clean'], ->
    gulp.start ['build', 'watch', 'serve']
