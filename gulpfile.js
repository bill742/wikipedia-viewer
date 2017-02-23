var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    autoprefixer = require('gulp-autoprefixer');
    concatCss = require('gulp-concat-css');
    cleanCSS = require('gulp-clean-css');
    coffee = require('gulp-coffee');

var sassSources,
    cssSources,
    // jsSources,
    coffeeSources;

sassSources = [
  'assets/sass/*.sass'
];

cssSources = [
  'assets/css/*.css'
];

coffeeSources = [
  'assets/coffee/*.coffee'
];

// Compile Sass files
gulp.task('sass', function(){
  return gulp.src(sassSources)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('assets/css'));
});

// Concat and minify all .css files
gulp.task('css', function(){
    return gulp.src(cssSources)
    .pipe(concatCss("main.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('html', function(){
	gulp.src('*.html')
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync', 'sass', 'css', 'coffee'], function(){
  gulp.watch(sassSources, ['sass']);
  gulp.watch(cssSources, ['css']);
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch('*.html', ['html']);
  gulp.watch('js/*.js', ['coffee']);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./"
    },
  });
});

gulp.task('default', ['sass', 'css', 'coffee', 'html', 'watch']);
