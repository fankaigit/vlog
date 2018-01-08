<template>
  <div class="record columns is-mobile">
    <div class="slider-column column is-7">
      <input class="slider" :id="habit.name + t" type="range"
             :min="habit.min" :max="habit.max" :value="v"
             :step="habit.step"  @change="saveRecord(habit.id, t)"/>
    </div>

    <div class="txt-column column is-5">
      <div class="txt" v-if="habit.values.length > 0">{{habit.values[v]}}</div>
      <div v-else>
        <span class="value">{{v}}</span>
        <span class="unit" v-if="habit.unit !== ''">{{habit.unit}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import DateUtils from '../utils/date'
  import log from '../utils/log'

  export default {
    name: 'Record',
    props: ['habit', 't', 'v', 'values'],
    data () {
      return {
        DateUtils: DateUtils
      }
    },
    methods: {
      saveRecord: function (hid, t) {
        let ele = document.getElementById(this.habit.name + t)
        let val = ele ? ele.value : 0
        log.info('save', this.habit.name, t, val)
        this.$store.commit('saveRecord', {hid: hid, key: t, value: val})
      }
    }
  }
</script>

<style scoped>

  .txt-column {
    line-height: 1.4em;
  }

  .txt-column .value {
    font-size: 0.9em;
    margin-left: 1em;
  }

  .txt-column .unit {
    font-size: 0.6em;
  }

  .txt-column .txt {
    font-size: 0.7em;
    margin-left: 1em;
  }

  .column {
    margin: 0;
    padding: 0;
    overflow: hidden;
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
