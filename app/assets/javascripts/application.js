require(
  [
    'jquery',
    'app'
  ],

  function ($, Application) {
    'use strict';

    var ready = function () {
      var debug = require('flight/lib/debug');
      debug.enable(true);
      var app = new Application();
      app.init();
    };

    $(document).ready(ready);
  }
);
