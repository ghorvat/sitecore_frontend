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

    for( libraries in config.dist.css.libraries) {
        
        gulp.src(['bower_components/' + config.dist.css.libraries[libraries] ])
        .pipe(gulp.dest(PATH + '/dist/css/libraries').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.dist.css.libraries[libraries]));

    }

    // A.1. END -------------------------------------------------------------------------------------------------------

});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. UPDATE KONSTRUCT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('update-css', function() {

    // B.1. INSTALL VENDOR LIBRARIES ----------------------------------------------------------------------------------

    for( library in config.assets.css.libraries) {
        
        gulp.src(['bower_components/' + config.assets.css.libraries[library] ])
        .pipe(gulp.dest(PATH + '/dist/css/library').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Updating ' + config.assets.css.libraries[library]));

    }

    // B.1. END -------------------------------------------------------------------------------------------------------

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// C. INSTALL JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-js', function() {
    
    // C.1. MOVE FILES FROM BOWER -------------------------------------------------------------------------------------

    for( bower in config.dist.js.components.bower) {

        gulp.src(['bower_components/' + config.dist.js.components.bower[bower], ])
        .pipe(gulp.dest(PATH + '/dist/js/components/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.dist.js.components.bower[bower]));
        
    }
    
    // C.1. END -------------------------------------------------------------------------------------------------------
    
    // C.2. MOVE MAP FILES FROM BOWER ---------------------------------------------------------------------------------

    for( map in config.dist.js.components.maps) {

        gulp.src(['bower_components/' + config.dist.js.components.maps[map], ])
        .pipe(gulp.dest(PATH + '/dist/js/components').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.dist.js.components.maps[map]));
    }
    
    // C.2. END -------------------------------------------------------------------------------------------------------

});

// C. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// D. COMPILE COMPONENTS INTO COMPONENTS.JS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('concat-js', function() {

    var files = [];
    
    for( component in config.dist.js.components.order) {

        files.push(PATH + '/dist/js/components/' + config.dist.js.components.order[component]);

    }
        
    gulp.src(files)
        .pipe(concat('components.js'))
        .pipe(gulp.dest(PATH + '/dist/js/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Compiling components.js file '));

});

// D. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================