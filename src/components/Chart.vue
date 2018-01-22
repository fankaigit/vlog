<template lang="pug">
  #bar-chart
    #bar-chart-date-nav
      date-nav(:data="navData")
    #bar
      chartist(ratio="ct-major-second", type="Bar", :data="chartData",
        :options="chartOptions")
</template>

<style lang="scss">
  @import "../assets/main.scss";

  #bar {
    margin: 1rem 1rem 0 0;
  }

  .ct-series-a .ct-bar{
    stroke: $primary;
    stroke-width: 6px;
  }

</style>

<script>
  import DateUtils from '../utils/date'
  import moment from 'moment'
  import log from '../utils/log'
  import Vue from 'vue'
  import Chartist from 'vue-chartist'
  import DateNav from './DateNav.vue'

  Vue.use(Chartist, {
    messageNoData: '没有数据',
    classNoData: 'empty'
  })

  export default {
    name: 'Chart',
    props: ['habit'],
    components: {
      dateNav: DateNav
    },
    data () {
      return {
        DateUtils: DateUtils,
        startOfMonth: undefined,
        values: {}
      }
    },
    methods: {
      pickPrevMonth: function () {
        this.startOfMonth = this.startOfMonth.clone().subtract(1, 'months')
        log.info(this.startOfMonth.format())
      },
      pickNextMonth: function () {
        this.startOfMonth = this.startOfMonth.clone().add(1, 'months')
        log.info(this.startOfMonth.format())
      },
      monthTitle: function () {
        return this.startOfMonth.format('YYYY年MM月')
      },
      chartHeight: function () {
        return Math.max(200, Math.min(300, window.innerHeight - 200))
      }
    },
    computed: {
      dates: function () {
        const s = this.startOfMonth
        const e = s.clone().endOf('month')
        let result = []
        for (let d = s; d.unix() < e.unix(); d = d.clone().add(1, 'days')) {
          result.push(d.clone())
        }
        return result
      },
      chartOptions: function () {
        let h = this.habit
        return {
          high: parseInt(h.max) + 1,
          low: parseInt(h.min),
          height: this.chartHeight() + 'px',
          axisY: {
            labelInterpolationFnc: function (value) {
              let v = h.unit ? `${value}${h.unit}` : value
              return h.type === 'number' ? v : h.values[value]
            },
            onlyInteger: true
          },
          axisX: {
            labelInterpolationFnc: function (value, index) {
              return index % 2 === 0 ? value : null
            }
          }
        }
      },
      chartData: function () {
        let ds = this.dates
        const labels = ds.map(d => d.date())
        const series = [ds.map(d => this.values[d.unix()] || 0)]
        return {
          labels: labels,
          series: series
        }
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
    },
    created: function () {
      this.startOfMonth = moment().startOf('month')
      let records = this.$store.state.data.records[this.habit.id]
      for (let k in records) {
        let t = parseInt(k)
        let dayKey = moment(t).startOf('day').unix()
        this.values[dayKey] = this.habit.type === 'number' ? records[t] : parseInt(records[t]) + 1
      }
    }
  }
</script>
