define(function (require) {
  'use strict';

  var Calendar = require('calendar');
  var Day = require('day');
  var Event = require('event');
  var EventsData = require('events_data');

  function Application () {}

  Application.prototype.init = function () {
    EventsData.attachTo(document);
    Day.attachTo('.event-selector');
    Calendar.attachTo('.date-selector');
    Event.attachTo('.event-editor');
  }

  return Application;
});
