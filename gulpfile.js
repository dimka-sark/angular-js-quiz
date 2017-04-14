'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var useref = require('gulp-useref');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');

var conf = {
	path:{
		tmp:'.tmp',
		app:'app',
		dist: 'dist',
		bower: 'bower_components'
	}
};

gulp.task('browser-sync', function(done) {
    browserSync.init({
        server: {
        	baseDir:[conf.path.tmp, conf.path.app],
        	routes:{
        		'/bower_components': conf.path.bower,
        		'/bootstrap-sass': conf.path.bower + '/bootstrap-sass',
        	}
        }
    });

    done();
});

gulp.task('serve', [
	'sass', 
	'watch',
	'inject', 
	'browser-sync']);

gulp.task('sass', function(){
	return gulp.src(conf.path.app + "/styles/main.scss")
        .pipe(sass())
        .pipe(gulp.dest(conf.path.tmp + "/styles"));
});

gulp.task('watch', function(){
	gulp.watch(conf.path.app + "/styles/**/*.scss", ['sass', 'reload']);
    gulp.watch(conf.path.app + "/views/**/*.html", ['reload']);
    gulp.watch(conf.path.app + "/scripts/**/*.js", ['inject', 'reload']);
    gulp.watch(conf.path.app + "/index.html", ['inject', 'reload']);
});

gulp.task('inject', function(){
	var target = gulp.src(conf.path.app + '/index.html');
	target
		.pipe(inject(gulp.src('scripts/**/*.js', {read: false, cwd: conf.path.app}), {relative:true}))
		.pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
		.pipe(gulp.dest(conf.path.tmp));
		return target;
});

gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('build', gulpSequence(
    'clean',
    'sass',
    'inject',
    'prepare-dist',
    'copy-views',
    'copy-assets',
    'clear-css',
    'copy-fonts',
    'copy-lib',
    'copy-mock',
    'uglify-js'));

gulp.task('prepare-dist', function(){
	return gulp.src(conf.path.tmp + "/index.html")
        .pipe(useref({searchPath:['./', conf.path.app, conf.path.tmp]}))
        .pipe(gulp.dest(conf.path.dist));
});

gulp.task('copy-views', function(){
	return gulp.src(conf.path.app + "/views/**/*.html")
	        .pipe(gulp.dest(conf.path.dist + "/views"));
});

gulp.task('copy-lib', function(){
    return gulp.src(conf.path.app + "/lib/**/*.*")
        .pipe(gulp.dest(conf.path.dist + "/lib"));
});

gulp.task('copy-mock', function(){
    return gulp.src(conf.path.app + "/mock/**/*.*")
        .pipe(gulp.dest(conf.path.dist + "/mock"));
});

gulp.task('copy-assets', function(){
	gulp.src(conf.path.app + "/favicon.ico")
	       .pipe(gulp.dest(conf.path.dist));

	return gulp.src(conf.path.app + "/assets/**/*.*")
	        .pipe(gulp.dest(conf.path.dist + "/assets"));
});

gulp.task('copy-fonts', function(){
	return gulp.src(conf.path.bower + "/bootstrap-sass/**/*.{eot,otf,svg,ttf,woff,woff2}")
	       .pipe(gulp.dest(conf.path.dist + "/bootstrap-sass"));
});

gulp.task('clear-css', function(){
	return gulp.src(conf.path.dist + "/styles/*.css")
		.pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(conf.path.dist + "/styles"));
});

gulp.task('uglify-js', function(){
	return gulp.src(conf.path.dist + "/scripts/vendor.js")
		.pipe(uglify())
        .pipe(gulp.dest(conf.path.dist + "/scripts"));
});

gulp.task('clean', function(){
	return gulp.src(conf.path.dist, {read: false})
        .pipe(clean());
});