'use strict';

define('utils', ['jquery', 'modernizr'], function ($, Modernizr) {
    'use strict';

    $.createCache = function (requestFunction) {
        var cache = {};
        return function (key, callback) {
            if (!cache[key]) {
                cache[key] = $.Deferred(function (defer) {
                    requestFunction(defer, key);
                }).promise();
            }
            return cache[key].done(callback);
        };
    };

    $.loadImage = $.createCache(function (defer, url) {
        var image = new Image();

        var cleanUp = function cleanUp() {
            image.onload = image.onerror = null;
        };

        defer.then(cleanUp, cleanUp);

        if (!url) {
            defer.reject();
            return;
        }

        image.onload = function () {
            defer.resolve(url, {
                width: image.width,
                height: image.height
            });
        };

        image.onerror = defer.reject;
        image.src = url;
    });

    $.formatCurrency = function (val) {
        var str = val + '';
        return str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
    };

    $.fn.animatecss = function (name, callback) {
        var $el = this;

        var classes = ['animated', name];

        classes = classes.join(' ');

        $el.addClass(classes).data('animation', classes);

        var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'].join(' ');

        $el.one(events, function () {
            $el.animatecssStop();
            if ('function' === typeof callback) {
                callback.apply(this);
            }
        });

        return this;
    };

    $.fn.animatecssStop = function () {
        this.removeClass(this.data('animation'));
        this.data('animation', null);

        return this;
    };

    $.fn.toggleAnimated = function (isOn, animIn, animOut) {
        var $el = this;
        var isHidden = !$el.is(':visible');
        animIn = animIn || 'zoomIn';
        animOut = animOut || 'zoomOut';

        if (isOn && !isHidden || !isOn && isHidden) {
            return;
        }

        if (!Modernizr.cssanimations) {
            $el[isOn ? 'fadeIn' : 'fadeOut'](200);
            return $el;
        }

        $el.animatecss(isOn ? animIn : animOut, function () {
            if (isOn) {
                return;
            }

            $el.hide();
        });

        if (isOn) {
            $el.show();
        }

        return $el;
    };

    return {};
});