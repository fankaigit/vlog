<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title 我的活动

    section#habits
      .habit(v-for="(h, id) in habits", v-if="!h.deleted")
        .habit-name {{h.name}}
        .habit-type
          span.habit-icon.fa-stack.fa-lg(v-if="h.type === 'check'")
            i.fa.fa-square-o.fa-stack-2x
            i.fa.fa-check.fa-stack-1x
          span.habit-icon.fa-stack.fa-lg(v-if="h.type === 'number'")
            i.fa.fa-square-o.fa-stack-2x
            i.fa.fa-stack-1x 3
          span.habit-icon.fa-stack.fa-lg(v-if="h.type === 'custom'")
            i.fa.fa-square-o.fa-stack-2x
            i.fa.fa-star.fa-stack-1x
          =" "
          span {{htypes[h.type]}}
        .habit-stat
          router-link(:to="'/stats/' + h.id")
            i.fa.fa-bar-chart
        .habit-config
          router-link(:to="'/habits/' + h.id")
            i.fa.fa-cog

    section#actions
      router-link.button.is-primary(:to="'/habits/-1'") 新建一个活动

</template>

<style lang="scss" scoped>
  @import "../assets/main.scss";

  #habits {
    display: table;
    width: 90%;
    margin: 1rem auto 0;
  }

  #habits .habit {
    display: table-row;

    & > * {
      display: table-cell;
      border-bottom: 1px solid lightblue;
      font-size: 1.2rem;
    }

    .habit-name {
      width: 40%;
    }

    .habit-icon {
      /*width: 40%;*/
      font-size: 50%;
      margin-bottom: 0.05rem;
      color: sandybrown;
    }

    .habit-stat {
      /*width: 10%;*/
      a {
        color: $primary;
      }
    }

    .habit-config {
      /*width: 10%;*/
      a {
        color: $info;
      }
    }
  }

  #actions .button {
    display: block;
    margin: 2rem auto;
    width: 90%;
  }

</style>

<script>
  import log from '../utils/log'
  import htypes from '../utils/htypes'

  export default {
    name: 'Habits',
    data () {
      return {
        selected: undefined,
        htypes: htypes
      }
    },
    methods: {
      select: function (h) {
        log.info(`select ${h.id} ${h.name}`)
        this.selected = h
      }
    },
    created: function () {
      this.$store.dispatch('init')
    },
    computed: {
      habits: function () {
        log.info('recalculate habits', JSON.stringify(this.$store.state))
        return this.$store.state.data.habits
      }
    }
  }
</script>

