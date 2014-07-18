define(function (require) {
  'use strict';

  var defineComponent = require('flight/lib/component');
  var withRenderer = require('with_renderer');

  return defineComponent(calendar, withRenderer);

  function calendar() {
    this.after('initialize', function () {
      this.on(document, 'dataDaySelected', this.handleDaySelected);
    });
  }
});
