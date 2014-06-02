var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var autoprefix = require('gulp-autoprefixer');
var clean = require('gulp-clean');

var hbsfy = require("hbsfy").configure({
	extensions: ["html"]
});

gulp.task('scripts', function() {
	var bundler = watchify('./public/js/app.js');

	bundler.transform(hbsfy);

	bundler.on('update', rebundle);

	function rebundle() {
		return bundler.bundle()
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('./public/dist/js/')).pipe(livereload());
	}

	return rebundle();
});

// CSS concat, auto-prefix and minify
// gulp.task('sass', function() {
// 	gulp.src(['./assets/sass/*.scss'])
// 		.pipe(sass())
// 		.pipe(autoprefix('last 2 versions'))
// 		.pipe(gulp.dest('./public/css/'))
// 		.pipe(livereload());
// });

// default gulp task
gulp.task('default', ['scripts'], function() {
	// watch for CSS changes
	// gulp.watch('./assets/sass/*.scss', ['sass']);
});
