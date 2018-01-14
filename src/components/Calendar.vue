<template lang="pug">
  #cal
    #cal-nav
      #cal-prev(@click="pickPrevMonth()")
        i.fa.fa-chevron-left
      #cal-title {{ monthTitle() }}
      #cal-next(@click="pickNextMonth()")
        i.fa.fa-chevron-right

    #cal-body
      #cal-week-header.cal-week
        .cal-week-day(v-for="name in weekDayNames") {{name}}
      #cal-dates
        .cal-week(v-for="w in monthDates()")
          .cal-week-day(v-for="d in w", :class="status(d)") {{d.date()}}

</template>

<style lang="scss" scoped>
  @import "../assets/main.scss";

  #cal-nav {
    height: 3rem;
    width: 100%;
    background-color: $primary;
    text-align: center;

    >* {
      display: inline-block;
      color: whitesmoke;
      font-size: 1.4rem;
      padding-top: 0.5rem;
    }

    #cal-prev, #cal-next {
      width: 20%;
    }

    #cal-title {
      width: 60%;
    }
  }

  #cal-body .cal-week {
    display: flex;
    width: 100%;
    margin-top: 1rem;
    padding: 0 1rem 0;

    .cal-week-day {
      text-align: center;
      flex-grow: 1;
      flex-basis: 1em;
    }
  }

  #cal-body #cal-dates {
    .inactive {
      color: lightgrey;
    }

    .positive {
      background-color: $primary;
    }

    .today {
      font-weight: bolder;
    }
  }

  #cal-body #cal-week-header {
    font-weight: bold;
  }

</style>

<script>
  import log from '../utils/log'
  import DateUtils from '../utils/date'
  import moment from 'moment'

  export default {
    name: 'Cal',
    props: ['habit'],
    data () {
      return {
        DateUtils: DateUtils,
        startOfMonth: undefined,
        checkStatus: {}
      }
    },
    methods: {
      active: function (d) {
        return d.month() === this.startOfMonth.month()
      },
      pickPrevMonth: function () {
        this.startOfMonth = this.startOfMonth.clone().subtract(1, 'months')
        log.info(this.startOfMonth.format())
      },
      pickNextMonth: function () {
        this.startOfMonth = this.startOfMonth.clone().add(1, 'months')
        log.info(this.startOfMonth.format())
      },
      monthDates: function () {
        let ds = DateUtils.monthDates(this.startOfMonth)
        return ds
      },
      monthTitle: function () {
        return this.startOfMonth.format('YYYY年MM月')
      },
      status: function (d) {
        let result = ''
        if (d.month() !== this.startOfMonth.month()) {
          result = `${result} inactive`
        }
        log.info(this.checkStatus[d.unix()])

        if (this.checkStatus[d.unix()]) {
          result = `${result} positive`
        }
        if (d.unix() === moment().startOf('day').unix()) {
          result = `${result} today`
        }
        return result
      }
    },
    created: function () {
      log.info('created')
      this.startOfMonth = moment().startOf('month')
      let records = this.$store.state.data.records[this.habit.id]
      for (let k in records) {
        let t = parseInt(k)
        // should not have more than 1 value per day
        this.checkStatus[moment(t).startOf('day').unix()] = records[t]
      }
      log.info(JSON.stringify(this.checkStatus))
    },
    computed: {
      weekDayNames: function () {
        return DateUtils.weekDays()
      }
    }
  }
</script>