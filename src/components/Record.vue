<template>
  <div class="columns is-mobile">
    <div class="slider-column column is-7">
      <input class="slider" :id="habit.name + t" type="range"
             :min="habit.min" :max="habit.max" :value="v"
             :step="habit.step"  @change="saveRecord(habit.id, t)"/>
    </div>

    <div class="column is-5">
       <span v-if="habit.values != undefined && habit.values.length > 0">
                      {{habit.values[Math.round(v)]}}
                    </span>
      <span v-else>
                       {{Math.round(v)}}
                      <span v-if="habit.unit !== ''">
                        {{habit.unit}}
                      </span>
                    </span>
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
  .column {
    margin: 0;
    padding: 0em 0.1em;
    overflow: hidden;
  }

  .slider {
    margin: 0;
    padding: 0em 0.2em;
  }

  input[type='range'] {
    width: 100%;
    height: 20px;
    overflow: hidden;
    cursor: pointer;
  }

  input[type='range'],
  input[type='range']::-webkit-slider-runnable-track,
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    /*width: 45%;*/
    height: 10px;
    background: #AAA;
  }

  input[type='range']::-webkit-slider-thumb {
    position: relative;
    height: 30px;
    width: 30px;
    margin-top: -10px;
    background: steelblue;
    border-radius: 50%;
    border: 2px solid white;
  }

  input[type='range']::-webkit-slider-thumb::before {
    position: absolute;
    content: '';
    height: 10px; /* equal to height of runnable track */
    width: 500px; /* make this bigger than the widest range input element */
    left: -502px; /* this should be -2px - width */
    top: 8px; /* don't change this */
    background: #777;
  }

</style>
