define(function (require) {
  'use strict';

  var defineComponent = require('flight/lib/component');
  var moment = require('moment');
  require('bootstrap');
  require('bootstrap-datetimepicker');

  return defineComponent(event);

  function event() {
    this.attributes({
      eventModalSelector: '.event-modal',
      startPickerSelector: '.start-picker',
      endPickerSelector: '.end-picker',
      titleSelector: '.title',
      startSelector: '.start',
      endSelector: '.end',
      attendeesSelector: '.attendees',
      locSelector: '.loc'
    });

    this.handleEventClick = function (event, data) {
      this.date = data.date;
      this.select('eventModalSelector').modal();
    }

    this.handleSubmit = function (event, data) {
      event.preventDefault();
      var title = this.select('titleSelector').val();
      var start = moment(this.date + ' ' + this.select('startSelector').val()).valueOf();
      var end = moment(this.date + ' ' + this.select('endSelector').val()).valueOf();
      if (!$.trim(title)) {
        return;
      }
      var attendees = [];
      $.each(this.select('attendeesSelector').val().split(','), function(i) {
        attendees.push($.trim(this));
      });
      var loc = this.select('locSelector').val();
      this.select('eventModalSelector').modal('hide');
      this.node.dataset = {};
      var id = Date.now();
      this.$node.data({
        id: id,
        date: this.date,
        title: title,
        start: start,
        end: end,
        attendees: attendees,
        loc: loc
      })
      this.trigger('uiEventAdded', this.$node.data());
      this.$node.removeData();
      // clear the form on submit
      this.$node[0].reset();
    }

    this.after('initialize', function () {
      var $this = this;
      this.on(document, 'dataNeedsCreateEvent', this.handleEventClick);
      this.select('startPickerSelector').datetimepicker({
        pickDate: false,
        minuteStepping:15,
        useCurrent: false
      });
      this.select('endPickerSelector').datetimepicker({
        pickDate: false,
        minuteStepping:15,
        useCurrent: false
      });
      this.on('submit', this.handleSubmit);
      this.select('eventModalSelector').on('hide.bs.modal', function (e) {
        $('.bootstrap-datetimepicker-widget').hide();
      });
    })
  }
});
