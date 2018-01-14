import moment from 'moment'

export default {
  formatDate: function (millis) {
    return moment(millis).format('YYYY年MM月DD日')
  },
  formatShort: function (millis) {
    return moment(parseInt(millis)).format('hh:mm')
  },
  now: function () {
    let now = Date.now()
    return now
  },
  startOfToday: function () {
    return moment().startOf('day').valueOf()
  },
  endOfToday: function () {
    return moment().endOf('day').valueOf()
  },
  dayOfWeek: function (t) {
    const days = '日一二三四五六'
    let idx = moment(t).day().valueOf()
    return '周' + days[idx]
  },
  MILLIS_PER_DAY: 1000 * 3600 * 24,
  prevDate: function (t) {
    return t - this.MILLIS_PER_DAY
  },
  nextDate: function (t) {
    return t + this.MILLIS_PER_DAY
  },
  weekDays: function () {
    const days = '日一二三四五六'
    return days.split('')
  },
  monthDates: function (t) {
    let current = moment(t)
    let firstOfMonth = current.clone().startOf('month')
    let firstOfCal = firstOfMonth.clone().startOf('week')
    let endOfMonth = current.clone().endOf('month').startOf('day')
    let endOfCal = endOfMonth.clone().endOf('week').startOf('day')
    let result = []

    for (let d = firstOfCal; d.unix() <= endOfCal.unix(); d = d.clone().add(7, 'days')) {
      let weekDates = []
      for (let i = 0; i < 7; ++i) {
        weekDates.push(d.clone().add(i, 'days'))
      }
      result.push(weekDates)
    }

    return result
  }
}
