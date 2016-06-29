define('app/form', [
    'jquery',
    'polyfiller',
    'app/tpl/form/error',
    'app/tpl/form/success',
    'app/functions',
    'masked-inputs'
], function(
    $,
    webshim,
    errorTpl,
    successTpl
) {
    'use strict';

    webshim.setOptions('waitReady', false);
    webshim.setOptions('forms', {
        lazyCustomMessages  : true,
        replaceValidationUI : true,
        addValidators       : true
    });

    webshim.polyfill('forms forms-ext');

    /**
     * @constructor
     * @param {Object|String} $form объект jQuery или строка-селектор
     * @param {Object|Void}   opts  объект параметров
     */
    var Form = function($form, opts) {
        this.onSuccess = null;
        this.onError   = null;

        this.opts = {
            successTpl    : successTpl,
            successText   : 'Форма успешно отправлена',
            successHeader : 'Заявка отправлена',

            errorText   : 'Внутренняя ошибка, пожалуйста, ' +
                          'повторите запрос позднее'
        };

        $.extend(this.opts, opts || {});

        this.$el = ($form instanceof $) ?
                   $form :
                   $($form);

        this.$cont   = this.$el;
        this.$submit = this.$el.find('[type=submit]');
    };

    /**
     * Отменяет обычный submit формы, на событии valid осуществляет свой submit
     */
    Form.prototype.init = function() {
        var form = this;

        var $hidden = $('<input type="hidden" name="__s">');
        $hidden.val(window.__s || '');

        form.$el.find('[type="tel"]').each(function() {
            $(this).mask('+7 (999) 999-9999', {autoclear: false});
        });

        form.$el
            .append($hidden)
            .submit(function(e) {
                e.preventDefault();
                form.send();
            });
    };

    /**
     * Отправка формы и обработчик ответа от сервера
     */
    Form.prototype.send = function() {
        var form = this;

        $(':focus').blur();
        form.$submit.prop('disabled', true);

        $.ajax({
            url      : form.$el.attr('action') || location,
            data     : form.$el.serialize(),
            type     : form.$el.attr('method') || 'post',
            dataType : 'json'
        }).always(function always() {
            form.$submit.prop('disabled', false);
        }).done(function done(data) {
            var method = data.ret ?
                         'handleSuccess' :
                         'handleError';
            form[method](data);
        }).fail(function fail(data) {
            form.handleError(data);
        });
    };

    /**
     * Обработчик ошибки ответа
     * @param  {Object|undefined} data ответ сервера, если был, или undefined
     */
    Form.prototype.handleError = function(data) {
        var form = this;

        /**
         * Если в параметры конструктора был передан callback - вызываем.
         * Если при этом callback вернет true, то стандартный обработчик
         * будет отменен
         */
        if ('function' === typeof form.onError) {
            var ret = form.onError(data);
            if (ret) {
                return;
            }
        }

        form.$cont.swapContent(errorTpl({
            header : 'Ошибка',
            message: data.message || form.opts.errorText
        }));
    };

    /**
     * Обработчик положительного ответа сервера
     * @param  {Object} data ответ сервера
     */
    Form.prototype.handleSuccess = function(data) {
        var form = this;

        if (data.redirect) {
            location.href = data.redirect;
            return;
        }

        if ('function' === typeof form.onSuccess) {
            var ret = form.onSuccess(data);
            if (ret) {
                return;
            }
        }

        var tplData = $.extend({
            header  : form.opts.successHeader,
            message : form.opts.successText
        }, data);

        var html = form.opts.successTpl(tplData);

        form.$cont.swapContent(html);
    };

    return Form;
});
