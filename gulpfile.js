// Пакеты
const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del').default;

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');

// Обработка HTML
const html = () => {
  return src('./src/html/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'HTML',
          message: error.message,
        })),
      }),
    )
    .pipe(fileInclude())
    .pipe(size({ title: 'До сжатия' }))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      }),
    )
    .pipe(size({ title: 'После сжатия' }))
    .pipe(dest('./public'))
    .pipe(browserSync.stream());
};

// Удаление директории
const clear = () => {
  return del('./public');
};

// Сервер
const server = () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });
};

// Наблюдение за изменениями
const watcher = () => {
  watch('./src/html/**/*.html', html);
};

// Задачи
exports.html = html;
exports.watch = watcher;
exports.clear = clear;

// Сборка
exports.dev = series(html, parallel(watcher, server));
