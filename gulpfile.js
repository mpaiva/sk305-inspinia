var gulp             = require('gulp'),
    sass             = require('gulp-sass'),
    autoprefixer     = require('gulp-autoprefixer'),
    sourcemaps       = require('gulp-sourcemaps'),
    minifyCss        = require('gulp-clean-css'),
    rename           = require('gulp-rename'),
    browserSync      = require('browser-sync').create();
    livereload       = require('gulp-livereload');



gulp.task('sass', function(){
    // sass directory
    return gulp.src('./scss/*scss')
            .pipe(sass())
            //outputstyle (nested, compact, expanded, compressed)
            .pipe(sass({outputStyle:'compact'}).on('error', sass.logError))
            // sourcemaps
            .pipe(sourcemaps.init())
            // sourcemaps output directory
            .pipe(sourcemaps.write(('./maps')))
            // css output directory
            .pipe(gulp.dest('./src/css'))
            .pipe(livereload()),
            // watch file
            gulp.watch('./scss/*.scss', ['sass']);
});


// minify css (merge + autoprefix + rename)
gulp.task('minify-css', function(){
   return gulp.src('./src/css/style.css')
            .pipe(minifyCss())
             // autoprefixer
            .pipe(autoprefixer({
                browsers: ['last 15 versions'],
                cascade: false
            }))
            // minify output directory
            .pipe(rename('style.min.css'))
            .pipe(gulp.dest('./src/css'))
            // browser sync
            .pipe(browserSync.reload({stream: true}))
            .pipe(livereload()),
            // watch file
            livereload.listen();
            gulp.watch('./src/css/style.css', ['minify-css']);
});


// sass/css browser tracking
gulp.task('browser-sync', function(){
    browserSync.init({
        server:{
            baseDir: './src'
        }
    });
    // watch html
    livereload.listen(reloadPage);
    gulp.watch('./src/*.html').on('change', browserSync.reload);
});

// gulp default (sass, minify-css, browser-sync) method
gulp.task('default', ['sass', 'minify-css', 'browser-sync']);
