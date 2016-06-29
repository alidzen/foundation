define('app/google-map', [
    'async!http://maps.google.com/maps/api/js?sensor=true'
], function() {
    'use strict';

    return window.google;
});
