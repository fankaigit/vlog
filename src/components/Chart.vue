<template lang="pug">
  #bar-chart
    #bar-chart-date-nav
      date-nav(:data="navData")
    bar#bar(:data="chartData", :options="chartOptions", :height="chartHeight()")
</template>

<script>
  import DateUtils from '../utils/date'
  import moment from 'moment'
  import log from '../utils/log'
  import { Bar } from 'vue-chartjs'
  import Vue from 'vue'
  import DateNav from './DateNav.vue'

  Vue.component('bar', {
    extends: Bar,
    props: ['data', 'options'],
    mounted: function () {
      this.renderChart(this.data, this.options)
    },
    watch: {
      data: {
        handler: function (newData) {
          this.renderChart(newData, this.options)
        }
      }
    }
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
        return Math.max(100, Math.min(300, window.innerHeight - 200))
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
        let ticks = {
          min: 0,
          max: h.type === 'number' ? h.max : h.values.length + 0.5,
          stepSize: 1,
          callback: function (label) {
            return h.type === 'number' ? label : label === 0 ? '' : h.values[label - 1]
          }
        }
        return {
          scales: {
            yAxes: [{
              ticks: ticks
            }]
          }
        }
      },
      chartData: function () {
        let ds = this.dates
        const labels = ds.map(d => d.date())
        const datasets = [{
          label: this.habit.name + (this.habit.unit ? `(${this.habit.unit})` : ''),
          yLabels: this.habit.values,
          data: ds.map(d => this.values[d.unix()]),
          backgroundColor: 'rgb(0, 209, 178)'
        }]
        log.info('data:', datasets)
        return {
          labels: labels,
          datasets: datasets
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
        log.info('ddd', records[t], typeof records[t])
        this.values[dayKey] = this.habit.type === 'number' ? records[t] : parseInt(records[t]) + 1
      }
      log.info(JSON.stringify(this.checkStatus))
    }
  }
</script>
