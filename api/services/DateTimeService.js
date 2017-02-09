/**
 * DateTimeService
 *
 */

var moment = require('moment');

module.exports = {

  display: function (timestamp) {

    const calendarDate = moment(timestamp).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'Do MMMM, YYYY'
    });

    if ( calendarDate !== 'Today' ) return calendarDate;

    const timeFromNow = moment(timestamp).fromNow();
    return timeFromNow;

  }
};


