'use strict';

define(['jquery', 'infobox', 'app/google-map', 'app/tpl/map/tooltip', 'markerClusterer', 'app/functions'], function ($, InfoBox, google, tpl) {
    /***
     * Данные карты
     * @param {Object} $map - jQuery объект - карта
     * @constructor
     */
    var Map = function Map($map) {
        this.isMobile = $(window).width() < 768;

        if ($map.data('noinit') !== undefined && this.isMobile) {
            return;
        }

        var attributData = $map.data();
        var scriptData = window.map[$map[0].id];
        var data = $.extend(scriptData, attributData);
        this.$map = $map;
        this.data = data || {};
        this.markers = [];
        this.markerOpen = -1;
        this.data.fit = data.fit;
        this.data.minZoom = data.minzoom || 10;
        this.data.maxZoom = data.maxzoom || 18;

        if (data.center) {
            this.data.center = new google.maps.LatLng(data.center[0], data.center[1]);
        }

        this.options = {
            center: {
                lat: 59.939552,
                lng: 30.423428
            },
            zoom: 12,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            streetViewControl: false,
            mapTypeControl: false,
            styles: false
        };

        this.options = $.extend(this.options, this.data);

        this.initCustomZoomControls($map);
        this.initMap();
        this.clickCustomZoomControls();
        this.initBounds();
        this.initMarkers();
        this.imageBoundsInit();
        this.initInfoWindow();
        this.editor();
        this.initTabs();
        // this.initCluster();
    };

    /**
     * Инициализация карты
     */
    Map.prototype.initMap = function () {
        this.map = new google.maps.Map(this.$map[0], this.options);
    };

    /**
     * Сбор данных маркеров
     */
    Map.prototype.initMarkers = function () {
        var that = this;

        if (!this.data.markers) {
            return;
        }

        $.each(this.data.markers, function (index, marker) {
            that.initMarker(index, marker);
        });
    };

    /**
     * Инициализация маркера на карте
     * @param {Number} index - номер маркера
     * @param {Object} data - данные маркера
     */
    Map.prototype.initMarker = function (index, data) {
        var coords = new google.maps.LatLng(data.coords[0], data.coords[1]);

        var options = {
            map: this.map,
            position: coords,
            animation: google.maps.Animation.DROP,
            icon: data.image,
            type: data.type
        };

        var marker = new google.maps.Marker(options);
        this.markers.push(marker);
        marker.setMap(this.map);

        if (this.data.zoom === undefined || this.data.fit !== undefined) {
            this.bounds.extend(coords);
        }

        this.bindMarkerClick(index, marker, data);
    };

    /**
     * Клик по маркеру
     * @param {Number} index - номер маркера
     * @param {Object} marker - google marker
     * @param {Object} data - данные маркера
     */
    Map.prototype.bindMarkerClick = function (index, marker, data) {
        var that = this;

        if (!data.title && !data.text && !data.url) {
            marker.setOptions({
                clickable: false
            });
            return;
        }

        google.maps.event.addListener(marker, 'click', function () {
            if (data.url) {
                that.markerLink(data.url);
                return;
            }

            that.infoWindow.setContent(tpl(data));
            that.infoWindow.open(that.map, this);

            if (that.markerOpen !== -1) {
                that.markerShow(that.markerOpen);
            }
            that.markerOpen = index;
            that.markerHide(index);
        });
    };

    /**
     * Скрыть маркер
     * @param {Number} index - порядковый номер маркера
     */
    Map.prototype.markerHide = function (index) {
        this.markers[index].setVisible(false);
    };

    /**
     * Показать маркер
     * @param {Number} index - порядковый номер маркера
     */
    Map.prototype.markerShow = function (index) {
        this.markers[index].setVisible(true);
    };

    Map.prototype.markerToggle = function (type) {
        $.each(this.markers, function (index, marker) {
            if (!marker.type) {
                return;
            }

            var isVisible = type === 0 || marker.type === type;
            marker.setVisible(isVisible);
        });
    };

    /**
     * Балун
     */
    Map.prototype.initInfoWindow = function () {
        var that = this;
        this.infoWindow = new InfoBox({
            content: '',
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-55, -83),
            zIndex: null,
            closeBoxMargin: '0px 0px 0px 0px',
            closeBoxURL: '',
            infoBoxClearance: new google.maps.Size(10, 10),
            isHidden: false,
            pane: 'floatPane',
            enableEventPropagation: false,
            boxStyle: {
                width: 'auto'
            }
        });

        google.maps.event.addListener(this.map, 'click', function () {
            that.closeInfoWindow();
        });

        this.infoWindow.addListener('domready', function () {
            var $infoBox = $('.infoBox');
            var $width;
            var $height;
            var $arrow = $infoBox.find('.b-map-tooltip__arrow');
            var $closeInfoWindow = $('.b-map-tooltip__close');

            var $image = $infoBox.find('img');

            if ($image.length) {
                $image.load(function () {
                    $width = $infoBox.width();
                    $height = $infoBox.height() + $arrow.outerHeight();

                    that.infoWindow.setOptions({
                        pixelOffset: new google.maps.Size(-$width / 2, -$height)
                    });
                });
            } else {
                $width = $infoBox.width();
                $height = $infoBox.height() + $arrow.outerHeight();
                that.infoWindow.setOptions({
                    pixelOffset: new google.maps.Size(-$width / 2, -$height)
                });
            }

            $closeInfoWindow.click(function () {
                that.closeInfoWindow();
            });
        });
    };

    /**
     * Закрытие балуна
     */
    Map.prototype.closeInfoWindow = function () {
        if (this.markerOpen !== -1) {
            this.markerShow(this.markerOpen);
        }

        this.markerOpen = -1;
        this.infoWindow.close();
    };

    /**
     * Маркер с ссылкой
     * @param {String} url - ссыллка
     */
    Map.prototype.markerLink = function (url) {
        var isLocalLink = url.indexOf(window.location.origin) + 1;

        if (isLocalLink) {
            window.location.href = url;
        } else {
            window.open(url);
        }
    };

    /**
     * Инициализация картинки на карте
     */
    Map.prototype.imageBoundsInit = function () {
        var data = this.data.imageBounds;

        if (!data) {
            return;
        }

        var coords = new google.maps.LatLng(data.coords[0], data.coords[1]);

        var options = {
            map: this.map,
            position: coords,
            icon: data.icon
        };

        var marker = new google.maps.Marker(options);
        this.markers.push(marker);

        var imageBounds = this.data.imageBounds;

        this.imageBounds = {
            north: imageBounds.north,
            west: imageBounds.west,
            south: imageBounds.south,
            east: imageBounds.east
        };

        this.historicalOverlay = new google.maps.GroundOverlay(imageBounds.image, this.imageBounds);

        this.historicalOverlay.setMap(this.map);

        this.imageBoundsZoomChange();
    };

    Map.prototype.imageBoundsZoomChange = function () {
        var that = this;
        var currentZoom = this.map.getZoom();
        var changeView = 14;

        function toggleView(zoom) {
            if (zoom <= changeView) {
                that.historicalOverlay.setMap(null);
                that.markerShow(that.markers.length - 1);
            } else {
                that.historicalOverlay.setMap(that.map);
                that.markerHide(that.markers.length - 1);
            }
        }

        toggleView(currentZoom);

        this.map.addListener('zoom_changed', function () {
            currentZoom = that.map.getZoom();
            toggleView(currentZoom);
        });
    };

    /**
     * Определение крайних позиций маркеров на карте
     */
    Map.prototype.initBounds = function () {
        if (this.data.zoom !== undefined && this.data.fit === undefined) {
            return;
        }

        this.bounds = new google.maps.LatLngBounds();

        this.fitBounds(this.bounds);
    };

    /**
     * Изменение области отображения карты, так чтобы были видны все маркеры
     */
    Map.prototype.fitBounds = function (bounds) {
        this.map.fitBounds(bounds);
    };

    /**
     * Инициализация кастомного зума
     * @param {Object} $map - jQuery Object - разметка карты
     */
    Map.prototype.initCustomZoomControls = function ($map) {
        this.$zoomIn = $map.siblings('.b-map__zoom-in');
        this.$zoomOut = $map.siblings('.b-map__zoom-out');

        if (this.$zoomIn.length && this.$zoomOut.length) {
            this.options.zoomControl = false;
        }
    };

    /**
     * Клики по кастомным контролам зума
     */
    Map.prototype.clickCustomZoomControls = function () {
        var that = this;

        this.map.addListener('zoom_changed', function () {
            var currentZoom = that.map.getZoom();

            if (currentZoom === that.options.maxZoom) {
                that.$zoomIn.hide();
            } else {
                that.$zoomIn.show();
            }

            if (currentZoom === that.options.minZoom) {
                that.$zoomOut.hide();
            } else {
                that.$zoomOut.show();
            }
        });

        this.$zoomIn.click(function () {
            that.map.setZoom(that.map.getZoom() + 1);
            if (that.map.getZoom() === that.options.maxZoom) {
                that.$zoomIn.hide();
            } else {
                that.$zoomOut.show();
            }
        });

        this.$zoomOut.click(function () {
            that.map.setZoom(that.map.getZoom() - 1);

            if (that.map.getZoom() === that.options.minZoom) {
                that.$zoomOut.hide();
            } else {
                that.$zoomIn.show();
            }
        });
    };

    Map.prototype.initTabs = function () {
        var $tabsWrapper = this.$map.parents('.b-map__cnt').find('.b-map-tabs');
        if (!$tabsWrapper.length) {
            return;
        }

        var that = this;
        var $tabItems = $tabsWrapper.find('.b-map-tabs__item');
        var active = 'is-active';
        var $tabBtnToggleContent = $tabsWrapper.find('.b-map-tabs__btn');
        var $tabContent = $tabsWrapper.find('.b-map-tabs__list');

        $tabItems.click(function (e) {
            e.preventDefault();
            $tabItems.removeClass(active);
            $(this).addClass(active);
            that.closeInfoWindow();
            that.markerToggle($(this).find('a').data('type'));
            $tabContent.removeClass(active);
        });

        $tabBtnToggleContent.click(function (e) {
            e.preventDefault();
            $tabContent.toggleClass(active);
        });

        if (this.isMobile) {
            google.maps.event.addListener(this.map, 'click', function () {
                $tabContent.removeClass(active);
            });
        }
    };

    /**
     * Режим создания/редактирования карты
     */
    Map.prototype.editor = function () {
        if (!this.data.editor) {
            return;
        }

        google.maps.event.addListener(this.map, 'click', function (e) {
            console.log('[' + e.latLng.lat().toFixed(6) + ',' + e.latLng.lng().toFixed(6) + ']');
        });
    };

    return Map;
});