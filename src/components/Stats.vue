<template lang="pug">
  div
    section#stats-header.hero.is-info.is-small
      p.title 活动数据 - {{habit.name}}

    section#stats-calendar(v-if="habit.type === 'check'")
      cal(:habit="habit")

    section#stats-bar-chart(v-if="habit.type === 'number' || habit.type === 'custom' ")
      chart(:habit="habit")

</template>

<script>
  import log from '../utils/log'
  import Calendar from './Calendar'
  import Chart from './Chart'

  export default {
    name: 'Stats',
    components: {
      cal: Calendar,
      chart: Chart
    },
    data: function () {
      return {
        habit: undefined
      }
    },
    methods: {
    },
    created: function () {
      this.$store.dispatch('init')
      let hid = this.$route.params.hid
      this.habit = this.$store.state.data.habits[hid]
      log.info(this.habit.id)
    },
    beforeDestroy: function () {
      log.info('destroy')
    }
  }
</script>
