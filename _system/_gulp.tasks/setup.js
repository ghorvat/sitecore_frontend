// REGISTER COMPONENTS ================================================================================================

var config = require('../_config.json'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');

// END ================================================================================================================

// GULP TASKS [VARIABLES] ==============================================================================================

var PATH = "../" + config.root; 

// END ================================================================================================================

// GULP TASKS [INSTALLS] ==============================================================================================

// A. INSTALL KONSTRUCT +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-css', function() {

    // A.1. INSTALL VENDOR LIBRARIES ----------------------------------------------------------------------------------

    for( library in config.assets.css.libraries) {
        
        gulp.src(['_bower.cache/' + config.assets.css.libraries[library] ])
        .pipe(gulp.dest(PATH + '/dist/css/library').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.css.libraries[library]));

    }

    // A.1. END -------------------------------------------------------------------------------------------------------

});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. UPDATE KONSTRUCT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('update-css', function() {

    // B.1. INSTALL VENDOR LIBRARIES ----------------------------------------------------------------------------------

    for( library in config.assets.css.libraries) {
        
        gulp.src(['_bower.cache/' + config.assets.css.libraries[library] ])
        .pipe(gulp.dest(PATH + '/dist/css/library').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Updating ' + config.assets.css.libraries[library]));

    }

    // B.1. END -------------------------------------------------------------------------------------------------------

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// C. INSTALL JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-js', function() {
    
    // C.1. MOVE FILES FROM BOWER -------------------------------------------------------------------------------------

    for( bower in config.assets.js.bower) {

        gulp.src(['_bower.cache/' + config.assets.js.bower[bower], ])
        .pipe(gulp.dest(PATH + '/assets/js/components/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.js.bower[bower]));
    }
    
    // C.1. END -------------------------------------------------------------------------------------------------------
    
    // C.2. MOVE MAP FILES FROM BOWER ---------------------------------------------------------------------------------

    for( map in config.assets.js.maps) {

        gulp.src(['_bower.cache/' + config.assets.js.maps[map], ])
        .pipe(gulp.dest(PATH + '/assets/js/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.js.maps[map]));
    }
    
    // C.2. END -------------------------------------------------------------------------------------------------------

});

// C. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// D. COMPILE COMPONENTS INTO COMPONENTS.JS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('concat-js', function() {

    var files = [];
    
    for( component in config.assets.js.order) {

        files.push(PATH + '/assets/js/components/' + config.assets.js.order[component]);

    }
        
    gulp.src(files)
        .pipe(concat('components.js'))
        .pipe(gulp.dest(PATH + '/assets/js/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Compiling components.js file '));

});

// D. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================