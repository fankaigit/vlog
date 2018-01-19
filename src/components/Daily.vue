<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title(@click="toggleEdit") {{DateUtils.formatDate($store.state.startOfDate)}}

    section#daily-date-nav
      date-nav(:data="navData")

    section#records
      .habit(v-for="(values, hid) in records" v-show="editable || Object.keys(values) > 0")
        .habit-name
          i.fa.fa-calendar-check-o(v-if="habits[hid].type === 'check'")
          i.fa.fa-bar-chart(v-else)
          =" "
          router-link(:to="`/stats/${hid}`") {{habits[hid].name}}
        .habit-records
          .habit-record.columns.is-mobile(v-for="(v, t) in values", v-if="habits[hid].type !== 'check'")
            .column
              record(:habit="habits[hid]", :t="t", :v="v", :values="values", :editable="editable")
            .column.is-2.action(@click="delRecord(hid, t)", v-if="editable")
              i.fa.fa-minus-circle
          .habit-record.columns.is-mobile(v-if="editable && allowAdd(hid)")
            .column
            .column.is-2.action(@click="addRecord(hid)")
              i.fa.fa-plus-circle
          .habit-record.columns.is-mobile(v-if="habits[hid].type === 'check'")
            .column
              .habit-check(:class="editable ? 'active' : 'inactive'")
                i.fa.fa-check-square-o(@click="toggle(hid)", v-if="isChecked(hid)")
                i.fa.fa-square-o(@click="toggle(hid)", v-else)
            .column.is-2
</template>

<script>
  import Vue from 'vue'
  import DateUtils from '../utils/date'
  import log from '../utils/log'
  import Record from './Record.vue'
  import DateNav from './DateNav.vue'

  export default {
    name: 'Daily',
    components: {
      record: Record,
      dateNav: DateNav
    },
    data () {
      return {
        DateUtils: DateUtils,
        allowEdit: {}
      }
    },
    methods: {
      addRecord: function (hid) {
        let key = this.isCurrentDateToday ? DateUtils.now() : this.$store.getters.endOfDate
        let hrecords = this.records[hid] || {}
        while (key in hrecords) {
          log.info(`key ${key} already exists for ${hid}, use next`)
          key += 1
        }
        Vue.set(hrecords, key, 0)
        this.$store.commit('saveRecord', {hid: hid, key: key, value: 0})
      },
      delRecord: function (hid, key) {
        this.$store.commit('delRecord', {hid: hid, key: key})
      },
      selectPrevDate: function () {
        this.$store.commit('selectPrevDate')
      },
      selectNextDate: function () {
        this.$store.commit('selectNextDate')
      },
      firstKey: function (hid) {
        let rs = this.records[hid]
        if (!rs) {
          return null
        }
        let keys = Object.keys(rs)
        if (keys.length === 0) {
          return null
        }
        return keys[0]
      },
      isChecked: function (hid) {
        let rs = this.records[hid]
        let k = this.firstKey(hid)
        return rs && k && rs[k] > 0
      },
      toggle: function (hid) {
        if (!this.editable) {
          return
        }
        let val = !this.isChecked(hid)
        if (!this.firstKey(hid)) {
          this.addRecord(hid)
        }
        let k = this.firstKey(hid)
        this.$store.commit('saveRecord', {hid: hid, key: k, value: val})
      },
      toggleEdit: function () {
        Vue.set(this.allowEdit, this.$store.state.startOfDate, !this.allowEdit[this.$store.state.startOfDate])
      },
      allowAdd: function (hid) {
        return this.habits[hid].type !== 'check' && (Object.keys(this.records[hid]).length === 0 || !this.habits[hid].once)
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
        for (let hid in this.habits) {
          let vs = records[hid]
          let nv = {}
          for (let t in vs) {
            if (t > startOfDate && t < endOfDate) {
              nv[t] = vs[t]
            }
          }
          let h = this.habits[hid]
          if ((h && !h.deleted) || Object.keys(nv).length > 0) {
            ret[hid] = nv
          }
        }
        log.info('display records:', ret)
        return ret
      },
      habits: function () {
        let hs = this.$store.state.data.habits
        let keys = Object.keys(hs)
        keys.sort((a, b) => hs[a].order - hs[b].order)
        let result = {}
        for (let key of keys) {
          if (!hs[key].deleted) {
            result[hs[key].id] = hs[key]
          }
        }
        log.info('recalculate habits - result', JSON.stringify(result))
        return result
      },
      isCurrentDateToday: function () {
        return DateUtils.startOfToday() === this.$store.state.startOfDate
      },
      editable: function () {
        return this.isCurrentDateToday || this.allowEdit[this.$store.state.startOfDate]
      },
      navData: function () {
        let that = this
        return {
          goPrev: that.selectPrevDate,
          goNext: that.selectNextDate,
          title: DateUtils.dayOfWeek(that.$store.state.startOfDate),
          prev: DateUtils.dayOfWeek(DateUtils.prevDate(that.$store.state.startOfDate)),
          next: DateUtils.dayOfWeek(DateUtils.nextDate(that.$store.state.startOfDate)),
          displayPrev: function () {
            return true
          },
          displayNext: function () {
            return DateUtils.startOfToday() !== that.$store.state.startOfDate
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped="">

  /* somehow *{...} doesn't apply here */
  .columns, .column, .columns:last-child {
    padding: 0;
    margin: 0;
  }

  #date {
    margin: 0.3rem auto 0;
    overflow: hidden;
    height: 1.5em;

    #current {
      text-align: center;
    }
    #prev {
      text-align: left;
      padding-left: 2em;
    }
    #next {
      text-align: right;
      padding-right: 2em;
    }
    #prev, #next {
      color: darkcyan;
    }
  }

  #records {
    display: table;
    width: 100%;
    margin: 1rem auto 0;

    .habit {
      display: table-row;

      >* {
        border-bottom: 1px solid lightblue;
        display: table-cell;
      }

      .habit-name {
        vertical-align: middle;
        width: 40%;
        text-align: left;
        font-size: 1.2rem;
        padding-left: 0.5em;

        a {
          color: #4a4a4a;
        }

        i {
          color: rgba(32, 156, 238, 0.6);
          font-size: 80%;
        }
      }
    }
  }

  #records .habit .habit-records {
    font-size: 1.5rem;

    .habit-record {
      height: 2.2rem;
      line-height: 2.2rem;

      &:not(:last-child) {
        border-bottom: 1px solid whitesmoke;
        margin-bottom: 0.1rem;
      }

      .action {
        text-align: center;
        vertical-align: middle;
      }

      .habit-check {
        text-align: center;
      }
    }
  }

  .fa-minus-circle {
    color: tomato;
  }

  .fa-plus-circle {
    color: gray;
  }

  .habit-check {
    &.active {
      .fa-square-o {
        color: gray;
      }

      .fa-check-square-o {
        color: lightseagreen;
      }
    }
    &.inactive {
      .fa-square-o {
        color: lightgrey;
      }

      .fa-check-square-o {
        color: lightgrey;
      }
    }
  }

</style>
