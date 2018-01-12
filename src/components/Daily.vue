<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">{{DateUtils.formatDate($store.state.startOfDate)}}</p>
    </section>

    <section id="date" class="columns is-mobile">
      <div id="prev" class="column is-3" @click="selectPrevDate()">
        <i class="fa fa-arrow-left"/>
        {{DateUtils.dayOfWeek(DateUtils.prevDate($store.state.startOfDate))}}
      </div>
      <div id="current" class="column is-6">
        {{DateUtils.dayOfWeek($store.state.startOfDate)}}
      </div>
      <div id="next" class="column is-3" @click="selectNextDate()" v-if="!isCurrentDateToday">
        {{DateUtils.dayOfWeek(DateUtils.nextDate($store.state.startOfDate))}}
        <i class="fa fa-arrow-right"/>
      </div>
    </section>

    <section id="records">
      <div class="habit" v-for="(values, hid) in records">
        <div class="habit-name">{{habits[hid].name}}</div>
        <div class="habit-records">
          <div class="habit-record columns is-mobile" v-for="(v, t) in values">
            <div class="column">
              <record :habit="habits[hid]" :t="t" :v="v" :values="values"></record>
            </div>
            <div class="action column is-2" @click="delRecord(hid, t)" v-if="isCurrentDateToday">
              <i class="fa fa-minus-circle"/>
            </div>
          </div>
          <div class="habit-record columns is-mobile" v-if="isCurrentDateToday">
            <div class="column">
            </div>
            <div class="action column is-2" @click="addRecord(hid)">
              <i class="fa fa-plus-circle"/>
            </div>
          </div>
          <div v-if="!isCurrentDateToday && Object.keys(values).length === 0">
            没有记录
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Vue from 'vue'
  import DateUtils from '../utils/date'
  import log from '../utils/log'
  import Record from './Record.vue'

  export default {
    name: 'Daily',
    components: {
      record: Record
    },
    data () {
      return {
        DateUtils: DateUtils
      }
    },
    methods: {
      addRecord: function (hid) {
        let key = DateUtils.now()
        let hrecords = this.records[hid] || {}
        if (key in hrecords) {
          log.error(`key ${key} already exists for ${hid}`)
        } else {
          Vue.set(hrecords, key, 0)
          this.$store.commit('saveRecord', {hid: hid, key: key, value: 0})
        }
      },
      delRecord: function (hid, key) {
        this.$store.commit('delRecord', {hid: hid, key: key})
      },
      selectPrevDate: function () {
        this.$store.commit('selectPrevDate')
      },
      selectNextDate: function () {
        this.$store.commit('selectNextDate')
      }
    },
    created: function () {
      this.$store.dispatch('init')
      for (let hid in this.habits) {
        if (!(hid in this.records) && !this.habits[hid].deleted) {
          this.$store.commit('initHabitRecords', hid)
        }
      }
    },
    computed: {
      records: function () {
        let ret = {}
        let records = this.$store.state.data.records
        let startOfDate = this.$store.state.startOfDate
        let endOfDate = startOfDate + DateUtils.MILLIS_PER_DAY
        for (let hid in records) {
          let vs = records[hid]
          let nv = {}
          for (let t in vs) {
            if (t > startOfDate && t < endOfDate) {
              nv[t] = vs[t]
            }
          }
          if (hid in this.habits) {
            ret[hid] = nv
          }
        }
        log.info('display records:', ret)
        return ret
      },
      habits: function () {
        return this.$store.state.data.habits
      },
      isCurrentDateToday: function () {
        return DateUtils.startOfToday() === this.$store.state.startOfDate
      }
    }
  }
</script>

<style scoped="">

  #date #prev {
    text-align: left;
    padding-left: 2em;
  }

  #date #next {
    text-align: right;
    padding-right: 2em;
  }

  #date #prev,#next {
    color: darkcyan;
  }

  #date #current {
    text-align: center;
  }

  #date {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 1.5em;
  }

  #date .column {
    padding: 0;
  }

  #records {
    display: table;
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 3rem;
  }

  .habit {
    display: table-row;
  }

  .habit-name {
    display: table-cell;
    width: 30%;
    border-bottom: 1px solid lightblue;
    vertical-align: middle;
    text-align: center;
    font-size: 1.4rem;
  }

  .habit-records {
    display: table-cell;
    border-bottom: 1px solid lightblue;
    font-size: 1.5rem;
  }

  .habit-records * {
    padding: 0;
    margin: 0;
  }

  .habit-record:not(:last-child) {
    border-bottom: 1px solid whitesmoke;
    margin-bottom: 0.1rem;
  }

  .habit-record .action {
    text-align: center;
  }

  .fa-minus-circle {
    color: tomato;
  }

  .fa-plus-circle {
    color: lightseagreen;
  }
</style>
