<template lang="pug">
  .record.columns.is-mobile
    .slider-column.column.is-7
      .tip(v-if="touched")
        .txt(v-if="habit.values.length > 0") {{habit.values[v]}}
        .txt(v-else) {{v}}
      input.slider(:id="habit.name + t", type="range", :step="habit.step",
        :min="habit.min", :max="habit.max", :value="v", @input="saveRecord(habit.id, t)",
        @touchstart="onTouchStart()", @touchend="onTouchEnd()")
    .txt-column.column
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
        let val = ele ? parseInt(ele.value) : 0
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

<style lang="scss" scoped>

  *, :last-child, :first-child {
    padding: 0;
    margin: 0;
  }

  .slider-column .tip {
    width: 300%;
    height: 0px;
    position: relative;
    bottom: 1em;
    left: -100%;
    line-height: 1em;
    font-weight: bold;
    font-size: 3em;
    text-align: center;
    color: rgba(0, 0, 0, 0.2);
  }

  .txt-column {
    height: 1.3em;
    line-height: 1.3em;
    overflow: hidden;
    padding-left: 0.5em;
    white-space: nowrap;

    .txt {
      font-size: 0.8em;
      padding-top: 0.2em;
    }

    .value {
      display: inline-block;
      font-size: 1.1em;
    }

    .unit {
      display: inline-block;
      margin-left: 0.1em;
      font-size: 0.8em;
    }
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
    background: lightseagreen;
    border-radius: 50%;
    border: 0.1em solid white;
  }

</style>
