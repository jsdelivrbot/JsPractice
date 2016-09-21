var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// 使用 gulp 压缩 JS
gulp.task('js', function () {
    gulp.src('js/ajax/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

// 使用 gulp 压缩 CSS
gulp.task('css', function () {
    gulp.src('js/ajax/style.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
});

// 浏览器同步测试工具
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch('js/**/*.js', ['css'])
    gulp.watch('css/**/*.css', ['css'])
    gulp.watch(['./src/**/*.html', './src/**/*.css', './src/**/*.js'], reload);

});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动任务
gulp.task('default', ['js', 'css', 'auto', 'browser-sync'])