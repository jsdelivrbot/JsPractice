var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

// 使用 gulp 压缩 JS
gulp.task('js', function () {
    gulp.src('js/*js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('css', function () {
    gulp.src('css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
})


// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch('js/**/*.js', ['css'])
    gulp.watch('css/**/*.css', ['css'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动任务
gulp.task('default', ['js', 'css', 'auto'])