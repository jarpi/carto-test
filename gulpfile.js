const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const watch = require('gulp-watch');

const plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'print'],
	replaceString: /\bgulp[\-.]/
});

const dest = __dirname + '/public/';

gulp.task('scripts', function() {

	gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
		.pipe(plugins.filter('**/*.js'))
		.pipe(plugins.concat('main.js'))
		.pipe(gulp.dest(dest + '/js'));

});

gulp.task('css', function() {

	gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
		.pipe(plugins.filter('**/*.css'))
		.pipe(plugins.concat('normalize.css'))
		.pipe(gulp.dest(dest + '/css'));

});


gulp.task('img', function() {

	gulp.src(plugins.mainBowerFiles(), { base: './bower_components' })
		.pipe(plugins.filter('**/*.png'))
		.pipe(plugins.print())
		.pipe(plugins.flatten())
		.pipe(gulp.dest(dest + '/css/images'));

});

gulp.task('test', function() {
    gulp.src(['spec/**/*.js'], { read: false  })
            .pipe(mocha({ reporter: 'spec'  }))
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['lib/**/*.js', 'spec/**/*.js'], ['scripts', 'css', 'img', 'test']);
});

gulp.task('default', ['scripts', 'css', 'img', 'test', 'watch']);

