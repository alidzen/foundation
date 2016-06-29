'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define('app/gallery', ['jquery', 'fotorama', 'app/tpl/gallery/labels', 'app/popup'], function ($, fotorama, tplLabels, Popup) {
    'use strict';

    /**
     * Галерея
     * @param {Object} $galleryWrap - jQery object
     * @constructor
     */

    var Gallery = function Gallery($galleryWrap) {
        this.$galleryWrap = $galleryWrap;
        this.$gallery = $galleryWrap.find('.b-gallery__base');
        this.$prev = $galleryWrap.find('.j-gallery__prev');
        this.$next = $galleryWrap.find('.j-gallery__next');
        this.isLoop = this.$gallery.data('loop');
        this.labels = this.$gallery.data('labels');
        this.disabled = 'is-disabled';

        this.eventShow();
        this.eventReady();
        this.initGallery();
        this.increare();
    };

    /**
     * Инициализация галереи, подключение фоторамы
     */
    Gallery.prototype.initGallery = function () {
        this.$gallery.fotorama();
    };

    /**
     * Кастомное событие фоторамы - show - срабатывает при каждом показе слайда
     */
    Gallery.prototype.eventShow = function () {
        var that = this;

        this.$gallery.on('fotorama:show', function (e, fotorama) {
            that.toggleArrowView(fotorama);
        });
    };

    /**
     * Кастомное событие фоторамы - ready - срабатывает, когда фоторама
     * полностью загружена
     */
    Gallery.prototype.eventReady = function () {
        var that = this;

        this.$gallery.on('fotorama:ready', function (e, fotorama) {
            that.bindArrowClick(fotorama);
            that.arrowView(fotorama);
            that.labelsCreate(fotorama);
        });
    };

    /**
     * Обработка клика по стрелкам
     * @param {Object} fotorama
     */
    Gallery.prototype.bindArrowClick = function (fotorama) {
        this.$prev.click(function () {
            fotorama.show('<');
        });

        this.$next.click(function () {
            fotorama.show('>');
        });
    };

    /**
     * Показ стрелок, только когда есть слайды и их больше одного
     * @param {Object} fotorama
     */
    Gallery.prototype.arrowView = function (fotorama) {
        if (fotorama.size === 1) {
            this.$prev.addClass(this.disabled);
            this.$next.addClass(this.disabled);
        }
    };

    /**
     * Смена вида у стрелок, у первого и последнего слайда
     * @param {Object} fotorama
     */
    Gallery.prototype.toggleArrowView = function (fotorama) {
        var prevMethod = fotorama.activeIndex === 0 ? 'addClass' : 'removeClass';

        var nextMethod = fotorama.size - fotorama.activeIndex === 1 ? 'addClass' : 'removeClass';

        if (!this.isLoop) {
            this.$prev[prevMethod](this.disabled);
            this.$next[nextMethod](this.disabled);
        }
    };

    /**
     * Создание лейблов у тумбочек
     */
    Gallery.prototype.labelsCreate = function () {
        if (this.labels && _typeof(this.labels) === 'object') {
            var $container = this.$gallery.find('.fotorama__nav__shaft');
            var $thumbWidth = this.$gallery.data('thumbwidth');
            var thumbMargin = this.$gallery.data('thumbmargin') || 2;
            var data = {
                elements: []
            };

            $.each(this.labels, function (item, text) {
                data.elements.push({
                    position: (parseInt($thumbWidth) + thumbMargin) * item,
                    text: text
                });
            });

            $container.append(tplLabels(data));
        }
    };

    Gallery.prototype.increare = function () {
        this.$zoom = $('.b-gallery__increase');

        if (!this.$zoom) {
            return;
        }

        var that = this;

        this.$galleryContainer = $('.b-construction-progress__gallery');

        var $gallery = that.$zoom.parent(this.$galleryWrap);

        this.$zoom.on('click', function () {
            $('.b-popup__cnt').append($gallery);
            that.$galleryContainer.html('&nbsp;');
        });

        return new Popup(this.$zoom);
    };

    return Gallery;
});