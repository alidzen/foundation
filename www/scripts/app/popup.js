'use strict';

define('app/popup', ['magnific-popup', 'app/map'], function (magnific, Map) {
    'use strict';

    /**
     * Попап
     * @param {Object} $link - jQuery object - ссылка на попапа
     * @constructor
     */

    var Popup = function Popup($link) {
        this.$link = $link;
        this.$body = $('body');
        this.$closeBtn = $('.b-popup__close');

        this.popupOptions();
        this.bindEvents();
        this.initPopup();
    };

    Popup.prototype.popupOptions = function () {
        var that = this;
        var type = this.$link.data('type');

        this.options = {
            type: type || 'inline',
            showCloseBtn: false,
            fixedContentPos: true,
            mainClass: that.collectMainClass(),
            removalDelay: that.transitionDelay(),
            callbacks: {
                open: function open() {
                    that.openPopup();
                    that.transitionDelay();
                },
                close: function close() {
                    that.closePopup();
                }
            }
        };
    };

    /**
     *
     * @returns {string} - строка с модификаторами, которые навешиваются на
     * родительский блок попапа
     */
    Popup.prototype.collectMainClass = function () {
        var mainClass = [];

        if (this.$link.data('theme')) {
            mainClass.push('b-popup_theme_' + this.$link.data('theme'));
        }

        if (this.$link.data('fullsize') !== undefined) {
            mainClass.push('b-popup_full_size');
        }

        if (this.$link.data('toggle-time')) {
            mainClass.push('b-popup_theme_toggle');
        }

        return mainClass.join(' ');
    };

    /**
     /**
     * Инициализация попапа, подключение магнифика
     */
    Popup.prototype.initPopup = function () {
        this.$link.magnificPopup(this.options);
    };

    /**
     * События
     */
    Popup.prototype.bindEvents = function () {
        this.$closeBtn.on('click', this.hidePopup);
        $(window).on('popstate', this.hidePopup);
    };

    /**
     * Добавления transition на попап
     */
    Popup.prototype.transitionDelay = function () {
        this.transitionTime = this.$link.data('toggle-time');

        if (!this.transitionTime) {
            return;
        }

        $('.mfp-bg, .mfp-wrap').css({
            'transition-duration': this.transitionTime + 'ms'
        });

        return this.transitionTime;
    };

    /**
     * При открытии попапа
     */
    Popup.prototype.openPopup = function () {
        window.history.pushState('forward', null, this.$link.attr('href'));

        this.scrollPosition = $(window).scrollTop() || this.$link.offset().top;

        this.$body.css({
            position: 'fixed',
            top: -this.scrollPosition
        });

        this.popupTargetOpen();
    };

    /**
     * При закрытии попапа
     */
    Popup.prototype.closePopup = function () {
        history.pushState('', document.title, window.location.pathname);

        this.$body.css({
            position: '',
            top: ''
        });

        $(window).scrollTop(this.scrollPosition);

        this.popupTargetClose();

        //TODO это должна уметь сама галерея
        var $content = $('.b-popup__cnt .b-gallery');
        $('.b-construction-progress__gallery').append($content);
    };

    /**
     * Закрытие попапа
     */
    Popup.prototype.hidePopup = function () {
        $.magnificPopup.close();
    };

    /**
     * Открытие попапа
     * @param {Object} $popup - jQuery Object - ссылка открывающася попап
     */
    Popup.prototype.showPopup = function ($popup) {
        $popup.magnificPopup('open');
    };

    /**
     * Передайте Коле, чтобы он пофиксил эту хуйню
     * а ещё передайте, чтобы он следущий раз писал, что ни так
     * т.к. месяц спустя хз что ни так
     */
    Popup.prototype.popupTargetOpen = function () {
        var target = this.$link.data('target');

        if (target === undefined || target === '') {
            return;
        }
        var $content = $(target).parent('.b-map__cnt').clone();
        var $map = $content.find(target).removeAttr('data-noinit');
        $(this.$link.attr('href')).find('.b-popup__cnt').append($content);

        return new Map($map);
    };

    Popup.prototype.popupTargetClose = function () {
        $('#popup-map').find('.b-popup__cnt').empty();
    };

    return Popup;
});