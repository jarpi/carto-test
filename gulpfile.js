const gulp = require('gulp');

const plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'print'],
	replaceString: /\bgulp[\-.]/
});

const dest = __dirname + '/public/';
console.dir(dest);

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


gulp.task('default', ['scripts', 'css', 'img']);

