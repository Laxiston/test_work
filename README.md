# Frontend Guidline v.1.0.0 #

 - Frontend Guidline v.1.0.0
 - Используемые технологии
 - Структура файлов стилей
	 - Каталоги
	 - Файл `_variables.sass`
	 - Файл `_scaffoldings.sass`
 - Написание стилей
	 - Именование, структура классов
	 - Составные свойства
	 - Переменные SASS
	 - Использование `mixin`’ов
	 - Директива `@extend`
	 - Использование фреймворка Foundation
	 - Использование `@media` запросов
	 - Вертикальный ритм
	 - Использование функции `rem-calc()`
	 - Шрифты
	 - Стили состояний
	 - Прочее
 - Работа с изображениями
	 - Оптимизация ширины и высоты изображений
	 - Подгрузка изображений нужного размера в зависимости от размера экрана
	 - Оптимизация качества изображений

## Начало работы ##

Данная сборка позволит быстро влиться в процесс разработки и качественно писать код.
По всем вопросам обращайтесь [gafurovamir@gmail.com](mailto:gafurovamir@gmail.com)

Установка:
 - Скачать сборку и распаковать в папку с проектом
 - `npm i` (требуется `Node.js`, установленные глобально) или `yarn` (требуется `Node.js` и `Yarn`, установленные глобально)
 - Команды:
    - `start-dev` - режим разработки с отслеживанием изменений файлов
    - `build` - сборка готовой верстки

## Используемые технологии ##

В качестве языка разметки используется шаблонизатор `Pug`.
CSS пишется с помощью препроцессора [SCSS(en)](http://sass-lang.com/) ([SCSS(ru)](https://sass-scss.ru/)), и SCSS синтаксисом.
Внешние модули для CSS подключаются в том виде, в котором они написаны, 
нет необходимости проводить конвертацию в SCSS, хотя в некоторых случаях это может быть полезно.

Порядок поиска и подключения внешних библиотек:
 - Скачать с помощью [Npm](https://www.npmjs.com/)`a, иначе
 - Скачать вручную в `static/scss/plugins`

## Структура файлов стилей ##

Проект разбит на компоненты:

    components/
    | ...

    pages/
    | ...

    static/
    | | - fonts/
    | | - images/
    | | | - content/
    | | | - general/
    | | | - plugins/
    | | | - svg/
    | | - js/
    | | | - global/
    | | | - plugin/
    | | | - index.js
    | | | - vendor.js
    | | - misc/
    | | - scss/
    | | | - base/
    | | | - partials/
    | | | - plugins/
    | | | - ...
    | | | - main.scss
    | | | - ...

Главный файл (обычно названный `main.scss`) должен быть единственным 
файлом SCSS, который не начинается с нижнего подчеркивания. 
Этот файл не должен содержать ничего, кроме `@import` и комментариев.

Порядок подключения стилей в файле `main.scss`:
```scss
// Base
@import '~static/scss/global';
@import '~static/scss/fonts';
@import '~static/scss/base/foundation';

// Styles for UI-elements
@import '~static/scss/GUI';

// Common styles for current project
@import '~static/scss/common';

// Components styles
@import '~static/scss/partials/components';
```

Чтобы улучшить читаемость, главный файл должен следовать этим рекомендациям:

 - один `@import` на строку;
 - не вставлять новые строки между файлами из одной папки;
 - новая строка после вставки последнего `@import` из одной и той же папки;
 - не писать расширения файлов и нижние подчеркивания;

### Каталоги ###

Каталог `base/` содержит то, что мы можем назвать общим шаблоном проекта.

Каталог `partials/`
Содержит SCSS-файлы подключения стилей плагинов и общих компонентов проекта.

Каталог `plugins/`
Содержит файлы кастомных плагинов

### Файл `_var.scss` ###

Содержит в себе переменные цветов. Переменные могут иметь как внутренние зависимости так и внешние.

Внутренние зависимости находятся в рамках одного компонента. Пример:

> Вертикальный `padding` для `input`’a не задается конкретным значением, а рассчитывается по остаточному принципу. Задается значение высоты, высоты строки, размер шрифта, ширина границы.
```scss
$input-height: $vertical-gutter * 2;
$input-line-height: 1.5;
$input-font-size: rem-calc(12);
$input-border-width: rem-calc(1);
$input-padding-vertical: $input-height - $input-line-height * $input-font-size - $input-border-width;
```
    
Внешние зависимости, их значения задаются в рамках нескольких компонентов.
> Цвет заголовка документа и его футер должны быть одного цвета
```scss
$document-header-bg: $iron;
$document-bottom-bg: $document-header-bg;
```

## Написание стилей ##

### Именование, структура классов ###

Именование классов отчасти похоже на БЭМ.
```scss
//Блок
.document {}

// Элемент блока
.document_item {}

// Модификатор элемента
.document_item__label {}
```

### Составные свойства ###

Составные свойства (`font`, `margin`, `padding` и др. записываются в виде):
```scss
.myclass {
    margin {
        top: $vertical-gutter * 2;
    };
    font: {
        size: rem-calc(16);
    };
}
```

### Переменные `SCSS` ###
Основные значения, а также значения участвующие в расчетах - выносятся в переменные.  
Общий шаблон именования переменных:  
`$<компонент>-<свойство>`
```scss
$footer-bg-color: $black;
```

Сокращения в именах переменных:
```scss
// background -> bg
$footer-background-color: ;
$footer-bg-color: ;
```

Совмещение одинаковых значений переменных:
```scss
$footer-padding-top: $vertical-gutter * 2;
$footer-padding-bottom: $vertical-gutter * 2;
$footer-padding-left: $vertical-gutter * 3;
$footer-padding-right: $vertical-gutter * 3;

// Кратко будут записаны:
$footer-padding-vertical: $vertical-gutter * 2;
$footer-padding-horizontal: $vertical-gutter * 3;
```
```scss
$icon-width: $vertical-gutter * 2;
$icon-height: $vertical-gutter * 2;

// Кратко будет записано:
$icon-size: $vertical-gutter * 2;
```

Название псевдокласса и псевдоэлемента используются в качестве постфикса для имени переменной.
```scss
$header-top-color: $oil;
$header-top-color-hover: $smoke;

.header-top {
    color: $header-top-color;
    &:hover {
        color: $header-top-color-hover;
    }
}
```

Переменные для различных разрешений экрана. 
Та переменная которая задает breakpoint для медиа запроса, задается в качестве постфикса для переменной задающей свойство:
```scss
// small - без постфикса
$footer-padding-top: $vertical-gutter;

// medium
$footer-padding-top-medium-up: $vertical-gutter;

// large
$footer-padding-top-large-up: $vertical-gutter;
```

При этом постфикс обозначающий breakpoint всегда будет последним среди других постфиксов (например, переменных для псевдоклассов и псевдоэлементов):
```scss
$footer-padding-top-hover-medium-up
```

В случаях когда у группы переменных совпадают значения, 
для удобства допустимо задать значения только для первой, 
а последующие в качестве значения получат (унаследуют) 
первую переменную. Пример:

> Предполагается что цвет заливки иконок социальных сетей, 
одинаков для всех. Таким образом мы хотим изменяя 
одно значения, поменять его для всех.
```scss
$icon-vk-fill: $white;
$icon-fb-fill: $icon-vk-fill;
$icon-tw-fill: $icon-vk-fill;
```

Переменные хранятся в отдельном файле, подробнее см. [Файл _variables.sass]().  
Блоки переменных отделяются комментариями, указывающие к 
какому компоненту эта переменная относится. Блоки 
переменных отделяются друг от друга двумя переносами строки.
```scss
// Form
//
$my-variable: rem-calc(12);
$input-padding: $vertical-gutter;


// Document
//
```

### Использование `mixin`’ов ###

Большие, повторяющиеся участки стилей для удобства выносятся в `mixin`’ы.  
В большинстве случаев заменяет использование директивы `@extend`.


### Директива `@extend` ###

Не используйте директиву `@extend`. 
В случаях когда у вас появилась в ней потребность - замените `mixin`’ом.  
Пример:
```scss
// Реализация с @extend'ом
.my-class {
    font-size: rem-calc(16);
}

.another-class {
    @extend .my-class;
}
```
```scss
// Реализация с mixin'ом
@mixin my-class-mixin {
    font-size: rem-calc(16);
}

.my-class {
    @include my-class-mixin;
}

.another-class {
    @include my-class-mixin;
}
```

### Порядок CSS свойств ###

В примере ниже, комментарии и разделение групп свойств переносом 
строки даны для понимания деления свойств на секции. В реальном 
коде не указываются.
```scss
// Позиционирование
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
z-index: 100;
vertical-align: middle;
content: '';

// Блочная модель
display: block;
visibility: hidden;
overflow: hidden;
float: right;
clear: both;
margin: rem-calc(10);
border: {
    width: rem-calc(1);
    style: solid;
    color: #e5e5e5;
    radius: 50%;
};
padding: rem-calc(10);
width: rem-calc(100);
height: rem-calc(100);

// Типографика
font: {
    family: "Arial", sans-serif;
    style: normal;
    size: 13px;
    weight: 500;
};
line-height: 1.5;
text-align: center;

// Оформление
color: #333333;
background: {
    color: #f5f5f5;
    opacity: 1;
};
outline: {
    width: rem-calc(1);
    style: solid;
    color: #666;
};

// Анимация
transition: color 1s;

// Разное
will-change: auto;
```

### Использование фреймворка Foundation ###

В основе проектов лежит фреймворк [ZURB Foundation 6](http://foundation.zurb.com/docs/). 
Это гибкий инструмент, основа которого файлы `foundation` и `settings`, содержащие 
в себе переменные для настройки всех компонентов. 

По умолчанию Foundation подключает все компоненты (например, такие как: `buttons`, `forms` и т.п.). 
Это сильно увеличивает размер итогового CSS файла. Для избежания 
этого и более гибкого управления, необходимо добавить все компоненты 
Foundation в файл `foundation` с помощью директивы `@import` в 
закомментированном состоянии. И по мере необходимости компонентов 
подключать их (раскомментировав соответствующие компоненты). В примере 
ниже подключен только компонент сетки:
```scss
@import 'foundation/components/grid';
//@import 'foundation/components/accordion';
//@import 'foundation/components/alert-boxes';
//@import 'foundation/components/block-grid';
//@import 'foundation/components/breadcrumbs';
//@import 'foundation/components/button-groups';
//@import 'foundation/components/buttons';
//@import 'foundation/components/clearing';
//@import 'foundation/components/dropdown';
//@import 'foundation/components/dropdown-buttons';
//@import 'foundation/components/flex-video';
//@import 'foundation/components/forms';
//@import 'foundation/components/icon-bar';
//@import 'foundation/components/inline-lists';
//@import 'foundation/components/joyride';
//@import 'foundation/components/keystrokes';
//@import 'foundation/components/labels';
//@import 'foundation/components/magellan';
//@import 'foundation/components/orbit';
//@import 'foundation/components/pagination';
//@import 'foundation/components/panels';
//@import 'foundation/components/pricing-tables';
//@import 'foundation/components/progress-bars';
//@import 'foundation/components/range-slider';
//@import 'foundation/components/reveal';
//@import 'foundation/components/side-nav';
//@import 'foundation/components/split-buttons';
//@import 'foundation/components/sub-nav';
//@import 'foundation/components/switches';
//@import 'foundation/components/tables';
//@import 'foundation/components/tabs';
//@import 'foundation/components/thumbs';
//@import 'foundation/components/tooltips';
//@import 'foundation/components/top-bar';
//@import 'foundation/components/type';
//@import 'foundation/components/offcanvas';
//@import 'foundation/components/visibility';
```

Также по мере необходимости раскомментируются и переопределяются 
переменные из файла `foundation`. Порядок работы такой:

1. Проверить есть ли необходимый компонент во фреймворке.
2. Подключить его.
3. Если работа компонента по умолчанию не устраивает и есть потребность изменить свойства, то сначала необходимо решать эту проблему в рамках фреймворка - проверяем есть ли переменная в _settings, задающая значение для интересующего нас свойства.
4. Если есть, задаем необходимое значение.
5. Если переменной нет, то в рамках классов, предоставляемых Foundation, задаем необходимые значения.
6. Если компонента нет во фреймворке - пишем свой компонент.

Foundation - это mobile first фреймворк соответственно необходимо 
придерживаться этого принципа при написании стилей.

### Использование `@media` запросов ###

[Более полная информация](http://foundation.zurb.com/sites/docs/media-queries.html)

### Вертикальный ритм ###

В качестве базового **вертикального** размера используется вертикальный ритм. 
Его значение варьируется в зависимости от проекта, но в рамках проекта он 
имеет одно значение (например, 8px или 16px) и задается переменной 
`$vertical-gutter` в секции сетки файла `_settings`. Это базовый вертикальный 
размер для свойств (`padding-top`, `padding-bottom`, `margin-top`, `margin-bottom`, 
`height`) всех компонентов, размер которых задается через значение:
```scss
// В settings
$vertical-gutter: rem-calc(8);

// В файле стилей
$vertical-gutter * множитель;
```

### Использование функции `rem-calc()` ###

Значения для свойств задается не в `px`, а в `rem`. 
Задаются эти значения не вручную, а с помощью функции 
из Foundation - `rem-calc()`.

> Свойства `font-size`, `line-height` прописывать исключительно в `px`  
> ширина в `200px`, в `rem`’ах

```scss
width: rem-calc(200);
```

### Шрифты ###

Шрифты подключаются в `settings` перед переменными 
шрифтов - `$font-family-sans-serif`.  
Пример подключение шрифта:
```scss
@font-face {
    font-family: "OpenSansRegular";
    src: font-url("OpenSansRegular/OpenSansRegular.eot");
    src: font-url("OpenSansRegular/OpenSansRegular.eot?#iefix") format("embedded-opentype"),
         font-url("OpenSansRegular/OpenSansRegular.woff") format("woff"),
         font-url("OpenSansRegular/OpenSansRegular.ttf") format("truetype");
    font-style: normal;
    font-weight: normal;
}

// Шрифт "OpenSansRegular" добавляется в переменную задающую базовый sans-serif шрифт:
$font-family-sans-serif: "OpenSansRegular", "Helvetica Neue", Helvetica, Roboto, sans-serif;
```

Для `light` и `bold` шрифтов в `foundation_and_overrides` добавляются 
соответствующие переменные, пример использования:
```scss
$font-family-sans-serif-bold: "OpenSansBold", Arial, sans-serif;

// _type.sass
    font: {
        family: $font-family-sans-serif-bold;
    };
```

### Стили состояний ###

Используются для обозначения определенного состояние элемента. 
Классы состояний имеют префикс `is-`. Всегда задаются в контексте. 
Состояния которые применяются на `body` располагаются в файле [_scaffolding.sass]().
```scss
.list-item {
    color: $white;
    
    &.is-active {
        color: $black;
    }
}
```

### Прочее ###

- `id` селекторы не используются для задания стилей.
- Стили пишутся без вендорных префиксов, их проставлением при сборке `css` занимается `autoprefixer`.

## Работа с изображениями ##

Каталог изображений располагается в `images/`.

### Оптимизация ширины и высоты изображений ###

Предоставление изображений с неправильными пропорциями увеличивают 
время загрузки и обработки страницы браузером. Сначала ему приходится 
загрузить большое изображение, а потом сжимать до нужных размеров.  
По этой причине изображения подготавливаются, в графическом 
редакторе уменьшаются до необходимых размеров.

### Подгрузка изображений нужного размера в зависимости от размера экрана ###

Для еще большей оптимизации в Foundation есть компонент 
[Interchange](http://foundation.zurb.com/sites/docs/interchange.html) 
позволяющие подгружать изображения необходимого размера в зависимости 
от размера экрана.

### Оптимизация качества изображений ###

Изображения экспортируемые из графических редакторов зачастую 
обладают избыточной информацией, как следствие имеют лишний вес. 
Изображения формата PNG, для которых критично качество, необходимо 
использовать сжатие без потерь (lossless), для этого подойдет онлайн 
сервис [compressor.io](https://compressor.io/)

Для изображений формата PNG и JPG для которых качество не столь 
критично, нужно использовать сжатие с потерями (lossy), для этого 
прекрасно подходит онлайн сервис [tinypng](https://tinypng.com/)

Также в сборке есть автоматическое сжатие плагином `gulp-imagemin`, 
который сжимает изображения в автоматическом режиме при компиляции
