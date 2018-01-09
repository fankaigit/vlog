<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">{{DateUtils.formatDate(Date.now())}}</p>
    </section>

    <section id="records">
      <div class="habit" v-for="(values, hid) in records">
        <div class="habit-name">{{habits[hid].name}}</div>
        <div class="habit-records">
          <div class="habit-record columns is-mobile" v-for="(v, t) in values">
            <div class="column">
              <record :habit="habits[hid]" :t="t" :v="v" :values="values"></record>
            </div>
            <div class="action column is-2" @click="delRecord(hid, t)">
              <i class="fa fa-minus-circle"/>
            </div>
          </div>
          <div class="habit-record columns is-mobile">
            <div class="column">
            </div>
            <div class="action column is-2" @click="addRecord(hid)">
              <i class="fa fa-plus-circle"/>
            </div>
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
  import moment from 'moment'
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
        for (let hid in records) {
          let vs = records[hid]
          let nv = {}
          for (let t in vs) {
            if (t > moment().startOf('day').valueOf() && t < moment().endOf('day').valueOf()) {
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
      }
    }
  }
</script>

<style scoped="">

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
