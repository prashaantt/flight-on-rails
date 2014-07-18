define(function (require) {
  'use strict';

  var padNum = function (i) {
    if (i < 10) {
      return '0' + i;
    }
    return i;
  }

  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return {
    padNum: padNum,
    months: months
  }
});
