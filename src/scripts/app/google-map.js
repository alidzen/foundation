define('app/google-map', [
    'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry&signed_in=true' // jshint ignore:line
], function() {
    'use strict';

    return window.google;
});
