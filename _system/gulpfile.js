'use strict';
var gulp = require('gulp');
var pump = require('pump');

//Loading of plugins
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('compile', function() {
    return gulp.src('*.scss')
    // Error handling. If there is an error in sass syntax it will toss out a red error in the console, toss a notification and fire a warning sound
        .pipe(plugins.plumber({ errorHandler: function(err) {
            plugins.notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
            // play a sound once
            plugins.util.beep();
            this.emit('end');
        }}))
        //Sourcemaps are for ease of use and debugging. It will out line which scss file has certain css code
        .pipe(plugins.sourcemaps.init())
        //Sass plugin is compiling the sass into css
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'));
});


//Watch task for all the sass files. If anything changes in the sass files it will compile the style.scss taking there are no errors.
gulp.task('watch', function(){
   gulp.watch('**/*.scss', ['compile']);
});

//Minify CSS
gulp.task('minify-css', function(){
    return gulp.src('dist/css/style.css')
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest('dist/minified/css'));
});

//Minify JS
gulp.task('compress', function (cb) {
    pump([
            gulp.src('dist/js/*.js'),
            plugins.uglify(),
            gulp.dest('dist/minified/js')
        ],
        cb
    );
});