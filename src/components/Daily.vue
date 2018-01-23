<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title {{DateUtils.formatDate(startOfDate)}}

    section#daily-date-nav
      date-nav(:data="navData")

    section#records
      .notice(v-if="Object.keys(records).length === 0")
        span 你的日程还是空的，先去
        =" "
        router-link(:to="`/habits`")
          i.fa.fa-list
          i 我的日程页面
        =" "
        span 定制日程吧!
      .habit(v-for="(values, hid) in records" v-show="editable || Object.keys(values).length > 0")
        .habit-name
          i.fa.fa-calendar-check-o(v-if="habits[hid].type === 'check'")
          i.fa.fa-bar-chart(v-else)
          =" "
          router-link(:to="`/stats/${hid}`") {{habits[hid].name}}
        .habit-records
          .habit-record.columns.is-mobile(v-for="(v, t) in values", v-if="habits[hid].type !== 'check'")
            .column
              range-record(:habit="habits[hid]", :t="t", :value="v", :values="values", :editable="editable")
            .column.is-2.action
              i.fa.fa-minus-circle(@click="delRecord(hid, t)", v-if="editable")
          .habit-record.columns.is-mobile(v-if="habits[hid].type === 'check'")
            .column
              check-record(:habit="habits[hid]", :records="values", :add="addRecord", :editable="editable")
            .column.is-2
          .habit-record.columns.is-mobile(v-if="editable && allowAdd(hid)")
            .column
            .column.is-2.action(@click="addRecord(hid)")
              i.fa.fa-plus-circle

    section#actions(v-if="!isCurrentDateToday")
      .button.is-warning.is-fullwidth(@click="toggleEdit")
        p(v-if="allowEdit") 完成
        p(v-else) 编辑历史记录

</template>

<script>
  import Vue from 'vue'
  import DateUtils from '../utils/date'
  import log from '../utils/log'
  import RangeRecord from './RangeRecord.vue'
  import CheckRecord from './CheckRecord.vue'
  import DateNav from './DateNav.vue'
  import types from '../store/types'
  import { mapState } from 'vuex'

  export default {
    name: 'Daily',
    components: {
      rangeRecord: RangeRecord,
      checkRecord: CheckRecord,
      dateNav: DateNav
    },
    data () {
      return {
        DateUtils: DateUtils,
        allowEdit: false
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
        this.$store.dispatch(types.ACT_SAVE_RECORD, {hid: hid, key: key, value: 0})
      },
      delRecord: function (hid, key) {
        this.$store.dispatch(types.ACT_DEL_RECORD, {hid: hid, key: key})
      },
      toggleEdit: function () {
        this.allowEdit = !this.allowEdit
      },
      allowAdd: function (hid) {
        return this.habits[hid].type !== 'check' && (Object.keys(this.records[hid]).length === 0 || !this.habits[hid].once)
      }
    },
    created: function () {
      for (let hid in this.habits) {
        if (!(hid in this.records) && !this.habits[hid].deleted) {
          this.$store.commit(types.MUT_INIT_HABIT_RECORDS, hid)
        }
      }
    },
    computed: {
      ...mapState({
        startOfDate: state => state.daily.startOfDate
      }),
      records: function () {
        let result = {}
        let all = this.$store.state.data.records
        let startOfDate = this.startOfDate
        let endOfDate = startOfDate + DateUtils.MILLIS_PER_DAY
        for (let hid in this.habits) {
          let habitRecords = all[hid]
          let activeRecords = {}
          for (let t in habitRecords) {
            if (t > startOfDate && t < endOfDate) {
              activeRecords[t] = habitRecords[t]
            }
          }
          let h = this.habits[hid]
          if ((h && !h.deleted) || Object.keys(activeRecords).length > 0) {
            result[hid] = activeRecords
          }
        }
        return result
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
        return result
      },
      isCurrentDateToday: function () {
        return DateUtils.startOfToday() === this.startOfDate
      },
      editable: function () {
        return this.isCurrentDateToday || this.allowEdit
      },
      navData: function () {
        let that = this
        return {
          goPrev: function () {
            that.$store.commit(types.MUT_SELECT_PREVIOUS)
          },
          goNext: function () {
            that.$store.commit(types.MUT_SELECT_NEXT)
          },
          title: DateUtils.dayOfWeek(that.startOfDate),
          prev: DateUtils.dayOfWeek(DateUtils.prevDate(that.startOfDate)),
          next: DateUtils.dayOfWeek(DateUtils.nextDate(that.startOfDate)),
          displayPrev: function () {
            return true
          },
          displayNext: function () {
            return DateUtils.startOfToday() !== that.startOfDate
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped="">
  @import "../assets/main.scss";

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
    width: 95%;
    margin: 0.5rem auto 0;
    border-collapse: separate;
    border-spacing: 0 0.3rem;

    .notice {
      margin: 1rem 1rem 0;
      font-size: 0.9rem;
      i{
        color: $primary;
      }
    }

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
        font-size: 1.1rem;
        padding-left: 0.5rem;
        line-height: 2rem;

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
    }
  }

  #actions {
    margin: 1rem;
  }

  .fa-minus-circle {
    color: tomato;
  }

  .fa-plus-circle {
    color: gray;
  }

</style>
