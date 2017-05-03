 // REGISTER COMPONENTS ================================================================================================

'use strict';

var config = require('../_config.json'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins')
    
;

//Loading of plugins

var plugins = gulpLoadPlugins();

// END ================================================================================================================

// GULP TASK [SERVER + LIVERELOAD] ====================================================================================

// A. VARIABLES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var EXPRESS_PORT = 4200;
var ROOT = '../' + config.root;
var LIVERELOAD_PORT = 35729;

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. Individual task +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B.1. SERVER --------------------------------------------------------------------------------------------------------

function startExpress() {

    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(ROOT));
    app.listen(EXPRESS_PORT);

    console.log();
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log();
    console.log('Server is running at: http://localhost:' + EXPRESS_PORT);
    console.log();
    console.log('You can stop the server at any time by pressing CTRL + C');
    console.log();
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log();

}

// B.1. END -----------------------------------------------------------------------------------------------------------

// B.2. LIVERELOAD ----------------------------------------------------------------------------------------------------

var lr;
function startLivereload() {

    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);

}

// B.2. END -----------------------------------------------------------------------------------------------------------

// B.3. NOTIFY CHANGES ------------------------------------------------------------------------------------------------

function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(ROOT, event.path);
    console.log('');
    console.log('+++ You changed: ' + fileName );
    console.log('');
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

// B.3. END -----------------------------------------------------------------------------------------------------------

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================

// GULP TASK [DEVELOPMENT] ============================================================================================

// A. CSS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('compile-sass', function() {
    
    return gulp.src(ROOT + '/build/scss/*.scss')
    
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
    
    // AUTOPREFIXER
    
    //Sass plugin is compiling the sass into css
    .pipe(plugins.sass())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('../dist/css/'));
    
});

gulp.task('autoprefix', function () {
    
    // A. MINIFY CSS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        
    return gulp.src(ROOT + '/dist/css/*.css')

        .pipe(plugins.postcss('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest(ROOT + 'dist/css'));
        
    // A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('compile-js', function() {
  gulp.src([
            ROOT + '/build/js/scripts/*.js',
            ROOT + '/build/js/scripts/*.*.js'
           ])
    //.pipe(plugins.jshint(process.cwd() + '/.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(ROOT + '/dist/js/'));

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================

// GULP TASK [DEFAULT] ================================================================================================

gulp.task('default', function () {

    // A. START SERVER + LIVERELOAD +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    startExpress();
    startLivereload();

    // A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // A. WATCH FOR CHANGES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // A.1. Watch HTML changes

        gulp.watch([ROOT + '/*.html',
                    ROOT + '/*/*.html',
                    ROOT + '/**/*/*.html',
                    ROOT + '/dist/css/style.css',
                    ROOT + '/dist/js/app.js'],
                    notifyLivereload);

        // A.2. Watch SASS Changes

        gulp.watch(ROOT + '/build/scss/**/*.scss', ['compile-sass']);

        // A.3. Watch JS Changes

        gulp.watch(ROOT + '/build/js/scripts/*', ['compile-js']);

    // B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

});

// END ================================================================================================================

// GULP TASK [PRODUCTION] =============================================================================================

// A. MINIFY CSS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('minify-css', function(){
    return gulp.src(ROOT + 'dist/css/style.css')
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(ROOT + 'dist/css'));
});
// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. COMPRESS JS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('compress-js', function(){
    return gulp.src(ROOT + 'dist/js/app.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(ROOT + 'dist/js'));
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('dist/js/*.js'),
            plugins.uglify(),
            gulp.dest('dist/minified/js')
        ],
        cb
    );
});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// C. DEPLOY ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('deploy', function () {
        
    return gulp.src(ROOT + '/dist/css/*.css')

        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(ROOT + 'dist/minified/css'));

});

// C. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================

// END OF FILE ========================================================================================================