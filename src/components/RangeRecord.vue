<template lang="pug">
  .record.columns.is-mobile
    .left-column.column.is-3(:class="leftClass")
      i.fa.fa-chevron-left(@click="minus()", v-if="habit.values.length > 0")
      i.fa.fa-minus(@click="minus()", v-else)
    .txt-column.column
      .txt(v-if="habit.values.length > 0") {{habit.values[v]}}
      .txt(v-else)
        span.value {{value}}
        span.unit(v-if="habit.unit !== ''") {{habit.unit}}
    .right-column.column.is-3(:class="rightClass")
      i.fa.fa-chevron-right(@click="plus()", v-if="habit.values.length > 0")
      i.fa.fa-plus(@click="plus()", v-else)

</template>

<script>
  import types from '../store/types'

  export default {
    name: 'RangeRecord',
    props: ['habit', 't', 'value', 'editable'],
    methods: {
      minus: function () {
        if (!this.editable || this.value <= 0) {
          return
        }
        this.$store.dispatch(types.ACT_SAVE_RECORD, {hid: this.habit.id, key: this.t, value: this.value - 1})
      },
      plus: function () {
        if (!this.editable || this.value >= this.habit.max) {
          return
        }
        this.$store.dispatch(types.ACT_SAVE_RECORD, {hid: this.habit.id, key: this.t, value: this.value + 1})
      }
    },
    computed: {
      leftClass: function () {
        return this.editable && this.value > 0 ? 'active' : 'inactive'
      },
      rightClass: function () {
        return this.editable && this.value < this.habit.max ? 'active' : 'inactive'
      }
    }
  }
</script>

<style lang="scss" scoped>

  *, :last-child, :first-child {
    padding: 0;
    margin: 0;
  }

  i {
    color: lightblue;
    font-size: 0.7em;
  }

  .inactive i {
    color: lightgrey;
  }

  .left-column {
    text-align: right;
  }

  .right-column {
    text-align: left;
  }

  .record {
    height: 2.2rem;
    line-height: 2.2rem;
    overflow: hidden;
  }

  .txt-column {
    padding: 0;
    margin: 0;
    white-space: nowrap;

    .txt {
      font-size: 1rem;
      text-align: center;
    }

    .value {
      /*display: inline-block;*/
      font-size: 1.1rem;
    }

    .unit {
      /*display: inline-block;*/
      margin-left: 0.1rem;
      font-size: 0.9em;
    }
  }

</style>
