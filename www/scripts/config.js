'use strict';

/* jshint ignore:start */
require.config({
    baseUrl: '/scripts/lib',

    paths: {
        app: '../app',
        tpl: '../tpl',

        cookie: 'js-cookie/src/js.cookie',
        jquery: 'jquery/dist/jquery.min',
        fastclick: 'fastclick/lib/fastclick',
        modernizr: 'modernizr/modernizr',
        handlebars: 'handlebars/handlebars.runtime.min',
        polyfiller: 'webshim/js-webshim/dev/polyfiller',
        fotorama: 'fotorama/fotorama',
        'magnific-popup': 'magnific-popup/dist/jquery.magnific-popup.min',

        'google-maps': 'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry&signed_in=true',
        infobox: 'google-infobox/google-infobox',
        async: 'requirejs-plugins/src/async',

        autoNumeric: 'autoNumeric/autoNumeric-min'
    },
    shim: {
        fastclick: {
            exports: 'FastClick'
        },
        modernizr: {
            exports: 'Modernizr'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        'magnific-popup': {
            exports: '$.magnificPopup',
            deps: ['jquery']
        },
        infobox: {
            exports: 'InfoBox',
            deps: ['app/google-map']
        },
        autoNumeric: {
            exports: '$.fn.autoNumeric',
            deps: ['jquery']
        }
    },
    /* Launch app.js after config */
    deps: ['app']
});