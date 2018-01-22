<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title 我的活动

    section#habits
      .habit(v-for="(h, idx) in habits")
        .habit-name
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
          span {{h.name}}
        .habit-config
          router-link(:to="'/habits/' + h.id")
            i.fa.fa-cog
        .habit-stat
          router-link(:to="'/stats/' + h.id")
            i.fa.fa-calendar-check-o(v-if="h.type === 'check'")
            i.fa.fa-bar-chart(v-else)
        .habit-up(@click="moveUp(idx)")
          i.fa.fa-chevron-up(:class = "idx > 0 ? 'active' : 'inactive'")
        .habit-down(@click="moveDown(idx)")
          i.fa.fa-chevron-down(:class = "idx < habits.length - 1 ? 'active' : 'inactive'")

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
      padding-top: 1rem;
      border-bottom: 1px solid lightblue;
      font-size: 1.1rem;
    }

    .habit-name {
      width: 45%;
    }

    .habit-icon {
      /*width: 30%;*/
      font-size: 50%;
      margin-bottom: 0.05rem;
      color: sandybrown;
      text-align: right;
    }

    .habit-stat {
      width: 20%;
      text-align: center;
      a {
        color: $primary;
      }
    }

    .habit-config {
      width: 15%;
      text-align: center;
      a {
        color: $info;
      }
    }

    .habit-up, .habit-down {
      width: 10%;
      text-align: center;

      .active {
        color: skyblue;
      }

      .inactive {
        color: lightgrey;
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
  import types from '../store/types'

  export default {
    name: 'Habits',
    methods: {
      select: function (h) {
        log.info(`select ${h.id} ${h.name}`)
        this.selected = h
      },
      swap: function (a, b) {
        let hs = this.habits
        if (a < 0 || b > hs.length - 1) {
          return
        }
        let tmp = hs[a].order
        hs[a].order = hs[b].order
        hs[b].order = tmp
        this.$store.dispatch(types.ACT_SAVE_HABIT, hs[a])
        this.$store.dispatch(types.ACT_SAVE_HABIT, hs[b])
      },
      moveUp: function (idx) {
        this.swap(idx - 1, idx)
      },
      moveDown: function (idx) {
        this.swap(idx, idx + 1)
      }
    },
    created: function () {
    },
    computed: {
      habits: function () {
        let hs = this.$store.state.data.habits
        let keys = Object.keys(hs)
        keys.sort((a, b) => hs[a].order - hs[b].order)
        let result = []
        for (let key of keys) {
          if (!hs[key].deleted) {
            result.push(hs[key])
          }
        }
//        log.info('recalculate habits - result', JSON.stringify(result))
        return result
      }
    }
  }
</script>

