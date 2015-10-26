
var gulp = require('gulp'); 

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

gulp.task('scripts', function() {
  gulp.src(['src/js/jquery-2.1.4.min.js','src/js/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = 'src/img/**/*',
      imgDst = 'public/img';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('styles', function() {
  gulp.src(['src/css/*.css'])
    .pipe(concat('all-styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css/'));
});