const path = require('path')
const gulp = require('gulp')
const mocha = require('gulp-mocha')
const standard = require('gulp-standard')

const plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'print'],
  replaceString: /\bgulp[-.]/
})

const dest = path.join(__dirname, '/public/')

gulp.task('scripts', function () {
  return gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.concat('main.js'))
        .pipe(gulp.dest(dest + '/js'))
})

gulp.task('css', function () {
  return gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
        .pipe(plugins.filter('**/*.css'))
        .pipe(plugins.concat('normalize.css'))
        .pipe(gulp.dest(dest + '/css'))
})

gulp.task('img', function () {
  return gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
        .pipe(plugins.filter('**/*.png'))
        .pipe(plugins.print())
        .pipe(plugins.flatten())
        .pipe(gulp.dest(dest + '/css/images'))
})

gulp.task('test', function () {
  return gulp.src(['spec/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
})

gulp.task('watch', function () {
  return gulp.watch(['lib/**/*.js', 'spec/**/*.js'], ['scripts', 'css', 'img', 'lint', 'test'])
})

gulp.task('lint', function () {
  return gulp.src(['./server.js', './lib/**/*.js', './spec/**/*.js'])
    .pipe(plugins.print())
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('default', ['scripts', 'css', 'img', 'lint', 'test', 'watch'])
