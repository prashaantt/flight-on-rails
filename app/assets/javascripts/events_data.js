define(function (require) {
  'use strict';

  var defineComponent = require('flight/lib/component');
  var moment = require('moment');

  return defineComponent(eventsData);

  function eventsData() {
    this.handleCalendarRendered = function (event, data) {
      if (data) {
        this.trigger('dataDaySelected', {
          id: data.id,
          date: data.date
        });
      } else {
        this.trigger('dataDaySelected');
      }
    }

    this.handleDayClicked = function (event, data) {
      var id = $(data.el).data('id');
      var date = $(data.el).data('date');
      this.trigger('dataDaySelected', {
        id: id,
        date: date
      });
    }

    this.handleEventClicked = function (event, data) {
      this.trigger('dataEventClicked', {
        id: $(data.el).closest('li').data('id')
      });
    }

    this.handleAddEventClicked = function (event, data) {
      this.trigger('dataNeedsCreateEvent', {
        date: $(data.el).data('date')
      })
    }

    this.handleEventAdded = function (event, data) {
      this.trigger('dataNewEventCreated', {events: [data]});
      // TODO: make an ajax call to persist `data` in the DB
    }

    this.after('initialize', function () {
      this.on('uiCalendarRendered', this.handleCalendarRendered);
      this.on('uiDayClicked', this.handleDayClicked);
      this.on('uiEventClicked', this.handleEventClicked);
      this.on('uiAddEventClicked', this.handleAddEventClicked);
      this.on('uiEventAdded', this.handleEventAdded);
    });
  }
});
