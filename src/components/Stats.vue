<template lang="pug">
  div
    section#stats-header.hero.is-info.is-small
      p.title 活动数据

    section#stats-calendar(v-if="habit.type === 'check'")
      cal(:habit="habit")

    section(v-else)
      p {{ JSON.stringify(habit) }}

</template>

<script>
  import log from '../utils/log'
  import Calendar from './Calendar'

  export default {
    name: 'Stats',
    components: {
      cal: Calendar
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
