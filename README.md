# Kelnik Template

Базовый шаблон для проектов

## Требования

Для работы необходимы

* [Node.js](http://nodejs.org)
* [Gulp](http://gulpjs.com/): `[sudo] npm install -g gulp`
* [Bower](http://bower.io): `[sudo] npm install -g bower`
* [Jscs](https://github.com/mdevils/node-jscs): `[sudo] npm install jscs -g`
* [Jshint](https://github.com/jshint/jshint/): `[sudo] npm install jshint -g`
* [Ruby](https://www.ruby-lang.org/ru/downloads/)
* [Bundler](http://bundler.io/): `[sudo] gem install bundler`
* [Scss-lint](https://github.com/causes/scss-lint): `[sudo] gem install scss-lint`

## Quickstart

```bash
git clone git@gitlab.com:kelnik-internal/boilerplate.git <project-name>
cd <project-name>
npm i && bower i && gulp build
```

## Структура папок

Скрипты, шаблоны и стили хранятся внутри папки `src`:

* `styles`
    * `/base` : базовые стили для всех проектов, настройка проекта
    * `/layout` : сетка проекта
    * `/module` : блоки проекта        
    * `/state` : состояния/модификаторы блоков    
    * `/sprites/1x` : картинки для спрайта в обычном качестве
    * `/sprites/2x` : картинки для спрайта в retina качестве
* `scripts`
    * `app.js` : точка входа
    * `config.js` : настройки RequireJS
    * `/app` : здесь должны храниться все прочие скрипты
    * `/app/tpl` : шаблоны Handlebars

Медиа контент находится в папке `www`

* `/fonts` : хранятся шрифты проекта
* `/img` : хранятся изображения проекта
 
Для подключения скриптов сайта нужно использовать префикс `app/`, например:

```js
require(['app/form', 'app/map'], function(Form, map) {
    // do stuff
});
```

Подключение шаблонов с префиксом `app/tpl/`:

```js
require(['app/tpl/form/error'], function(tpl) {
   // do stuff
});
```

Сторонние библиотеки, установленные через bower, находятся в папке
`www/scripts/lib`. При добавлении их в config.js префикс `lib/` не требуется.

## Спрайты

Если используются @2x версии спрайтов, то названия и количество файлов в папках `/src/sprites/1x` и `/src/sprites/2x` должны совпадать. Допустимы только *.png изображения.

Для файла `logo.png` можно использовать следующие mixin'ы и функции:

1. `@include sprite('logo');` — аналог `@include retina-image('logo')` в Compass. Не важно, используются ли @2x картинки, mixin один.
2. `width: sprite-width('logo');` — 32px
3. `height: sprite-height('logo');` — 32px

## Media-запросы

Скопированы с foundation. Примеры использования:

```scss
.some-class {
    display: none;

    @media #{$medium-up} {
        display: block;
    }

    @media #{$large-only} {
        display: inline-block;
    }
}
```

## Gem зависимости

В файле ```Gemfile``` добавляем название gem'a и его версию

```
    gem "scss-lint", "0.38.0"
```

Что бы установить все описанные в файле зависимости

```
    bundle install
```
