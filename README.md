# Astana Ballet
Статичная верстка сайта Балета Астаны.

## Зависимости

Для того чтобы установить все зависимости, вам понадобиться 
`npm` - что содержиться в пакете `nodejs`.

Установщики `nodejs` можете скачать с их [официального сайта](https://nodejs.org/en/download/).

После этого нужно лишь запустить команду `npm install` и все необходимые пакеты загрузяться из `npm-registry`.

## Запуск

Для запуска локального сервера нужно запустить команду
`npm start`. Проект собереться в папку `dist` и будет запущен при помощи [`browsersync`](https://browsersync.io/).

Чтобы просто собрать проект в папку `dist`. Пользуемся командой `npm run build`.

## Структура

Исходный код проекта храниться в папке `src`.

```
src/
    assets/ - тут хранятся все ресурсы сайта(картинки, иконки шрифты)
    js/ - тут будут содержаться скрипты
    partials/ - содержит части разметки которые шейрятся между страницами*. 
    scss/ - тут хранятся се стили. Используется bootstrap с надстройкой
    *.html - непосредственно сами страницы
``` 
> *подключаются при помощи [`gulp-html-partial`](https://github.com/xkxd/gulp-html-partial)