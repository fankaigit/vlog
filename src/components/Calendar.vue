<template lang="pug">
  #cal
    #cal-date-nav
      date-nav(:data="navData")

    #cal-body
      #cal-week-header.cal-week
        .cal-week-day(v-for="name in weekDayNames") {{name}}
      #cal-dates
        .cal-week(v-for="w in monthDates()")
          .cal-week-day(v-for="d in w", :class="status(d)")
            span(@click="locate(d)") {{d.date()}}

    #tip(style="margin: 2rem") 点击日期可跳转到记录页面

</template>

<style lang="scss" scoped>
  @import "../assets/main.scss";

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
  import DateNav from './DateNav.vue'
  import types from '../store/types'

  export default {
    name: 'Cal',
    props: ['habit'],
    components: {
      dateNav: DateNav
    },
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
        if (d.month() !== this.startOfMonth.month() || d.unix() * 1000 > Date.now()) {
          result = `${result} inactive`
        }

        if (this.checkStatus[d.unix()]) {
          result = `${result} positive`
        }
        if (d.unix() === moment().startOf('day').unix()) {
          result = `${result} today`
        }
        return result
      },
      locate: function (d) {
        if (d.unix() * 1000 < Date.now()) {
          this.$store.commit(types.MUT_SELECT_DATE, d.unix() * 1000)
          this.$router.push('/daily')
        }
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
      },
      navData: function () {
        let that = this
        return {
          goPrev: that.pickPrevMonth,
          goNext: that.pickNextMonth,
          title: this.monthTitle(),
          prev: '',
          next: '',
          displayPrev: () => true,
          displayNext: () => true
        }
      }
    }
  }
</script>
