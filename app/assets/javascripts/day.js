define(function (require) {
  'use strict';

  var defineComponent = require('flight/lib/component');
  var withRenderer = require('with_test');
  var Hogan = require('hogan');
  var mock = require('data');
  var moment = require('moment');
  require('bootstrap');

  return defineComponent(day);

  function day() {
    this.attributes({
      eventsTemplate: '#events-template',
      headingTemplate: '#heading-template',
      headingSelector: '.heading',
      eventsSelector: '.events',
      addEventBtnSelector: '.js-add-event'
    });
    this.handleShowDayTitle = function (event, data) {
      if (!data) {
        this.select('headingSelector').empty();
        return;
      }

      data.formatDate = function () {
        return function(text, render) {
          return moment(render(text)).format('ddd, MMM D');
        }
      };
      
      var templ = Hogan.compile(this.select('headingTemplate').html());
      this.select('headingSelector').html(templ.render(data));
    };

    this.handleShowDayEvents = function (event, data) {
      if (!data) {
        this.select('eventsSelector').empty();
        return;
      }
      data.events = mock.days[data.date];
      data.formatTime = this.formatTime;
      var templ = Hogan.compile(this.select('eventsTemplate').html());
      this.select('eventsSelector').html(templ.render(data));
    }

    this.handleNewEventCreated = function (event, data) {
      data.formatTime = this.formatTime;
      var templ = Hogan.compile(this.select('eventsTemplate').html());
      this.select('eventsSelector').append(templ.render(data));
    }

    this.formatTime = function () {
      return function(text, render) {
        return moment(parseInt(render(text), 10)).format("H:mm");
      }
    }

    this.after('initialize', function () {
      this.on(document, 'dataDaySelected', this.handleShowDayTitle);
      this.on(document, 'dataDaySelected', this.handleShowDayEvents);
      this.on('click', {
        addEventBtnSelector: 'uiAddEventClicked'
      });
      this.on(document, 'dataNewEventCreated', this.handleNewEventCreated);
    });
  }
});
