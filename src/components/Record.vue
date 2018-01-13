<template lang="pug">
  .record.columns.is-mobile
    .slider-column.column.is-7
      .tip(v-if="touched")
        .txt(v-if="habit.values.length > 0") {{habit.values[v]}}
        .txt(v-else) {{v}}
      input.slider(:id="habit.name + t", type="range", :step="habit.step",
        :min="habit.min", :max="habit.max", :value="v", @input="saveRecord(habit.id, t)",
        @touchstart="onTouchStart()", @touchend="onTouchEnd()")
    .text-column.column.is-5
      .txt(v-if="habit.values.length > 0") {{habit.values[v]}}
      .txt(v-else)
        .value {{v}}
        .unit(v-if="habit.unit !== ''") {{habit.unit}}
</template>

<script>
  import DateUtils from '../utils/date'
  import log from '../utils/log'

  export default {
    name: 'Record',
    props: ['habit', 't', 'v', 'values'],
    data () {
      return {
        DateUtils: DateUtils,
        touched: false
      }
    },
    methods: {
      saveRecord: function (hid, t) {
        let ele = document.getElementById(this.habit.name + t)
        let val = ele ? ele.value : 0
        log.info('save', this.habit.name, t, val)
        this.$store.commit('saveRecord', {hid: hid, key: t, value: val})
      },
      onTouchStart: function () {
        this.touched = true
      },
      onTouchEnd: function () {
        this.touched = false
      }
    }
  }
</script>

<style scoped>

  .slider-column .tip {
    width: 300%;
    height: 0px;
    position: relative;
    bottom: 1em;
    left: -100%;
    line-height: 1em;
    font-weight: bold;
    font-size: 2em;
    text-align: center;
    color: darkcyan;
  }

  .txt-column.column {
    line-height: 1.3em;
    overflow: hidden;
    padding-left: 0.5em;
    white-space: nowrap;
  }

  .txt-column .value {
    font-size: 0.9em;
  }

  .txt-column .unit {
    font-size: 0.6em;
  }

  .record .txt {
    font-size: 0.7em;
    padding-top: 0.2em;
  }

  .column {
    margin: 0;
    padding: 0;
  }

  .slider {
    margin: 0;
    padding: 0 0.5em;
  }

  input[type='range'] {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  input[type='range'],
  input[type='range']::-webkit-slider-runnable-track,
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 0.3em;
    background: lightgrey;
  }

  input[type='range']::-webkit-slider-thumb {
    position: relative;
    height: 2em;
    width: 2em;
    margin-top: -0.9em;
    background: skyblue;
    border-radius: 50%;
    border: 0.1em solid white;
  }

</style>
