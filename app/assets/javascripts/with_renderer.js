//contains original code taken from https://github.com/ccallebs/HTML5-Canvas-Calendar
// has issues running in Firefox and Safari

define(function (require) {
  'use strict';

  var Raphael = require('raphael');
  var utils = require('utils');
  var Hogan = require('hogan');

  return withRenderer;

  function withRenderer() {
    this.attributes({
      yearTemplate: '#year-template',
      monthTemplate: '#month-template',
      month: '.month',
      year: '.year',
      calendar: '.calendar',
      day: '.day',
      thisMonthColor: '#202020',
      prevMonthColor: '#909090'
    });

    this.renderCalendar = function (change) {
      this.select('calendar').empty();
      this.monthDay = 0;
      this.x_offset = 0;
      this.y_offset = 0;
      if (!change) {
        this.select('month').val(this.today.getMonth() + 1);
        this.select('year').val(this.today.getFullYear());
      }
      this.paper = Raphael(this.select('calendar')[0], 750, 645);

      if (this.clickedElem) {
        this.clickedElem.remove();
      }
      for(var j = 0; j < 6; ++j) {
        this.drawWeek(j);
      }
      if (this.paper.getById(this.todayElemId)) {
        // trigger with data only when current date is visible
        this.trigger('uiCalendarRendered', {
          'id': this.todayElemId,
          'date': this.todayId
        });
      } else {
        this.trigger('uiCalendarRendered');
      }
    }

    this.handleChange = function () {
      this.renderCalendar(true);
    }

    this.drawWeek = function (j) {
      for(var i = 0; i < 7; ++i) {
        this.drawDay(i, j);
      }
    }

    this.drawDay = function (i, j) {
      this.x_offset = 7 + 106 * i;
      this.y_offset = 5 + 106 * j;
      
      var dayId;
      var dayNum;
      // First week
      if (j == 0) {
        if (i < this.thisMonthFirstDay()) {
          dayNum = this.prevMonthLastDate() - (this.thisMonthFirstDay() - i) + 1;
          var prevMonth = this.thisMonth() == 1 ? 12 : this.thisMonth() - 1;
          var prevYear = prevMonth == 12 ? this.thisYear() - 1 : this.thisYear();
          dayId = prevYear + '-' + utils.padNum(prevMonth) + '-' + utils.padNum(dayNum);
          this.drawDayNumber(dayNum, this.attr.prevMonthColor, dayId);
        }
        else if (i == this.thisMonthFirstDay()) {
          this.monthDay = 1;
          dayNum = this.thisMonthFirstDate() + (this.thisMonthFirstDay() - i);
          dayId = this.thisYear() + '-' + utils.padNum(this.thisMonth()) + '-' + utils.padNum(dayNum);
          this.drawDayNumber(dayNum, this.attr.thisMonthColor, dayId);
        }
        else {
          ++this.monthDay;
          dayId = this.thisYear() + '-' + utils.padNum(this.thisMonth()) + '-' + utils.padNum(this.monthDay);
          this.drawDayNumber(this.monthDay, this.attr.thisMonthColor, dayId);
        }
      }
      // Last weeks
      else if (this.thisMonthLastDate() <= this.monthDay) {
        ++this.monthDay;
        dayNum = this.monthDay - this.thisMonthLastDate();
        var nextMonth = this.thisMonth() == 12 ? 1 : this.thisMonth() + 1;
        var nextYear = nextMonth == 1 ? this.thisYear() + 1 : this.thisYear();
        dayId = nextYear + '-' + utils.padNum(nextMonth) + '-' + utils.padNum(dayNum);
        this.drawDayNumber(dayNum, this.attr.prevMonthColor, dayId);
      }
      // Other weeks
      else {
        ++this.monthDay;
        dayId = this.select('year').val() + '-' + utils.padNum(this.thisMonth()) + '-' + utils.padNum(this.monthDay);
        this.drawDayNumber(this.monthDay, this.attr.thisMonthColor, dayId);
      }
    }

    this.drawDayNumber = function (dayNumber, color, dayId) {
      var rect = this.paper.rect(this.x_offset, this.y_offset, 100, 100, 5);
      rect.attr({
        'fill': '#f5f5f5',
        'stroke': '#ddd'
      });
      $(rect.node).attr({
        'class': 'day',
        'data-date': dayId,
        'data-id': rect.id
      });

      var text = this.paper.text(this.x_offset + 25, this.y_offset + 30, dayNumber);

      $(text.node).attr({
        'class': 'day',
        'data-date': dayId,
        'data-id': text.id
      })

      var todayId = this.today.getFullYear() + '-' + utils.padNum(this.today.getMonth() + 1) + '-' + utils.padNum(this.today.getDate())

      if (dayId == todayId) {
        if (this.today.getMonth() + 1 == this.thisMonth()) {
          text.attr({
            'font': '32px sans-serif',
            'fill': 'brown'
          });
        } else {
          text.attr({
            'font': '32px sans-serif',
            'fill': '#C68E17'
          });
        }
        this.todayId = dayId;
        this.todayElemId = rect.id;
      } else {
        text.attr({
          'font': '32px sans-serif',
          'fill': color
        });
      }
    }

    this.selectedDate = function () {
      return new Date(this.select('year').val() + '-' + this.select('month').val());
    }

    this.thisMonth = function () {
      return this.selectedDate().getMonth() + 1;
    }

    this.thisYear = function () {
      return this.selectedDate().getFullYear();
    }

    this.thisMonthFirstDay = function () {
      return this.selectedDate().getDay();
    }

    this.thisMonthFirstDate = function () {
      return this.selectedDate().getDate();
    }

    this.thisMonthLastDate = function () {
      return this.getLastDayOfMonth(this.thisMonth());
    }

    this.prevMonthLastDate = function () {
      return this.getLastDayOfMonth(this.thisMonth() - 1);
    }

    this.nextMonthFirstDay = function () {
      if (this.thisMonth() == 12)
        return 1;
      else
        return this.thisMonth() + 1;
    }

    this.getLastDayOfMonth = function (month, year) {
      var day;

      switch (month)
      {
        case 0 : // prevents error when checking for previous month in jan
        case 1 :
        case 3 :
        case 5 :
        case 7 :
        case 8 :
        case 10:
        case 12:
        case 13: // prevents error when checking for next month in december
          day = 31;
          break;
        case 4 :
        case 6 :
        case 9 :
        case 11:
          day = 30;
          break;
        case 2 :
          if( ( (year % 4 == 0) && ( year % 100 != 0) ) 
                   || (year % 400 == 0) )
            day = 29;
          else
            day = 28;
          break;
      }

      return day;
    }

    this.handleDaySelected = function (event, data) {
      if (this.clickedElem) {
        this.clickedElem.remove();
      }
      if (data)
        this.clickedElem = this.paper.getById(data.id).glow({
          color: 'brown'
        });
    }

    this.handleDayHoveredIn = function (event, data) {
      var $elem = $(data.el);
      try {
        this.hoveredElem = this.paper.getById($elem.data('id')).glow({
          color: 'brown'
        });
      } catch (e) {}
    }

    this.handleDayHoveredOut = function (event, data) {
      try {
        this.hoveredElem.remove();
        this.hoveredElem = null;
        this.hoveredElemDateId = null;
      } catch (e) {
        //TODO: fix this
      }
    }

    this.after('initialize', function () {
      this.today = new Date();
      var startYear = this.today.getFullYear() - 5;
      var endYear = this.today.getFullYear() + 5;

      var data = {};
      data.years = [];
      for(var year = startYear; year <= endYear; year++) {
        data.years.push(year);
      }
      var templ = Hogan.compile(this.select('yearTemplate').html());
      this.select('year').html(templ.render(data));
      this.select('year').prop("selectedIndex", -1);

      data = {};
      data.months = []
      $.each(utils.months, function (i, v) {
        var monthObj = {}
        monthObj.value = i + 1;
        monthObj.month = v;
        data.months.push(monthObj);
      })
      templ = Hogan.compile(this.select('monthTemplate').html());
      this.select('month').html(templ.render(data));
      this.select('month').prop("selectedIndex", -1);

      this.on('change', {
        month: this.handleChange,
        year: this.handleChange
      });
      this.on('mouseover', {
        day: this.handleDayHoveredIn
      });
      this.on('mouseout', {
        day: this.handleDayHoveredOut
      });
      this.on('click', {
        day: 'uiDayClicked'
      });
      this.renderCalendar();
    })
  }
});
