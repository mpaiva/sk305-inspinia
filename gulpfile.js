const gulp             = require('gulp');
const sass             = require('gulp-sass');
const uglify           = require('gulp-uglify');
const rename           = require('gulp-rename');
const concat           = require('gulp-concat');
const babel            = require('gulp-babel');
const cleanCSS         = require('gulp-clean-css');
const imagemin         = require('gulp-imagemin');
const browserSync      = require('browser-sync').create();
const autoprefixer     = require('gulp-autoprefixer');
const sourcemaps       = require('gulp-sourcemaps');
const clean            = require('gulp-clean');

// Paths
var paths = {
	root: {
		www: 'public/dist',
	},
	src: {
		root:       'public/dist',
		html:       'public/src/**/*.html',
		css:        'public/dist/css/*.css',
		js:         'public/src/js/*.js',
		vendors:    'public/src/vendors/**/*.*',
		imgs:       'public/src/img/**/*.+(png|jpg|gif|svg)',
		scss:       'public/src/scss/**/*.scss',
	},
	dist: {
		root:       'public/dist',
		css:        'public/dist/css',
		js:         'public/dist/js',
		imgs:       'public/dist/img',
		vendors:    'public/dist/vendors',
	},
};

// Compile SCSS
gulp.task('sass', () => {
	return gulp
		.src(paths.src.scss)
		.pipe(
			sass({
				outputStyle: 'expanded',
			}).on('error', sass.logError),
		)
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.src.root + '/css'))
		.pipe(browserSync.stream());
});

// Minify + Combine CSS
gulp.task('css', () => {
	return gulp
		.src(paths.src.css)
		.pipe(
			cleanCSS({
				compatibility: 'ie8',
			}),
		)
		.pipe(concat('app.css'))
		.pipe(
			rename({
				suffix: '.min',
			}),
		)
		.pipe(gulp.dest(paths.dist.css));
});

// Minify + Combine JS
gulp.task('js', () => {
	return gulp
		.src(paths.src.js)
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			}),
		)
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest(paths.dist.js))
		.pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task('img', () => {
	return gulp
		.src(paths.src.imgs)
		.pipe(
			imagemin([
				imagemin.gifsicle({
					interlaced: true
				}),
				imagemin.mozjpeg({
					quality: 75,
					progressive: true
				}),
				imagemin.optipng({
					optimizationLevel: 5
				}),
				imagemin.svgo({
					plugins: [{
						removeViewBox: true
					}, {
						cleanupIDs: false
					}],
				}),
			]),
		)
		.pipe(gulp.dest(paths.dist.imgs));
});

// copy vendors to dist
gulp.task('vendors', () => {
	return gulp.src(paths.src.vendors).pipe(gulp.dest(paths.dist.vendors));
});

// clean dist
gulp.task('clean', function() {
	return gulp.src(paths.dist.css).pipe(clean());
});

// Prepare all assets for production
gulp.task('build', gulp.series('sass', 'css', 'js', 'img'));

// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task('watch', () => {
	browserSync.init({
        server: {
			baseDir: paths.root.www,
		},
	});

	gulp.watch(paths.src.scss, gulp.series('sass'));
	// gulp.watch(paths.src.css, gulp.series('sass'));
	gulp.watch(paths.src.js, gulp.series('js'));
	gulp.watch(paths.src.html).on('change', browserSync.reload);
});





// // task for processing sass into css

// function style() {
//     return gulp.src('./scss/*scss')
//             .pipe(sass())
//             //outputstyle (nested, compact, expanded, compressed)
//             .pipe(sass({outputStyle:'compact'}).on('error', sass.logError))
//             // sourcemaps
//             .pipe(sourcemaps.init())
//             // sourcemaps output directory
//             .pipe(sourcemaps.write(('./maps')))
//             // css output directory
//             .pipe(gulp.dest('./src/css'))
//             .pipe(browserSync.stream());
            
// }

// // minify css (merge + autoprefix + rename)

// function minify() { 
//    return gulp.src('./src/css/style.css')
//             .pipe(minifyCss())
//              // autoprefixer
//             .pipe(autoprefixer({
//                 browsers: ['last 15 versions'],
//                 cascade: false
//             }))
//             // minify output directory
//             .pipe(rename('style.min.css'))
//             .pipe(gulp.dest('./src/css'))
//             // browser sync
//             .pipe(browserSync.reload({stream: true}));
// }


// // sass/css browser tracking
// function dev() {
//     browserSync.init({
//         server: {
//             baseDir: './src'
//         }
//     });
//     gulp.watch('./scss/*.scss', style);
//     gulp.watch('./src/css/style.css', minify);
//     gulp.watch('./src/*.html').on('change', browserSync.reload);
// }


// // exports.style = style;
// exports.style = style;
// exports.minify = minify;
// exports.dev = dev;

// // gulp default (sass, minify-css, browser) method
// // gulp.task('default', gulp.series('style', 'minify'));
