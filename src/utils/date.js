import moment from 'moment'

export default {
  formatDate: function (millis) {
    return moment(millis).format('YYYY-MM-DD')
  },
  formatShort: function (millis) {
    return moment(parseInt(millis)).format('hh:mm')
  },
  now: function () {
    let now = Date.now()
    return now
  },
  startOfToday: function () {
    moment().startOf('day').valueOf()
  },
  endOfToday: function () {
    moment().endOf('day').valueOf()
  }
}
