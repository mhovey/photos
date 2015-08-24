var gulp = require('gulp');
var concat = require("gulp-concat");
var minifyCSS = require("gulp-minify-css");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");
var watch = require("gulp-watch");

function compileSass(includeSourceMaps) {
  console.log("*.scss file change detected, compiling and minifying sass into main.css...");

  if (includeSourceMaps) {
    gulp.src("./public/scss/main.scss")
      .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(minifyCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("./public/css"))
      .pipe(notify({
        title: "Gulp",
        message: "SCSS Compiled with Sourcemaps"
      }));
  } else {
    gulp.src("./public/scss/main.scss")
      .pipe(sass())
      .pipe(minifyCSS())
      .pipe(gulp.dest("./public/css"))
      .pipe(notify({
        title: "Gulp",
        message: "SCSS Compiled"
      }));
  }
}

gulp.task("watch-sass-debug", function() {
  watchSass(true);
});

gulp.task("compile-sass-and-minify-css", function() {
  compileSass();
});

/*
 * Default Gulp task:
 * runs all specified tasks when you run "gulp" command
 */
gulp.task("default", [
  "compile-sass-and-minify-css"
]);

function watchSass(includeSourceMaps) {
  watch([
    "./public/scss/main.scss",
    "./public/scss/**/*.scss"
  ], function() {
    compileSass(includeSourceMaps);
  });
}