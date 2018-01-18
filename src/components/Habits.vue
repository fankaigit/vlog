<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title 我的活动

    section#habits
      .habit(v-for="(h, idx) in habits")
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
          span
            router-link(:to="'/habits/' + h.id") {{htypes[h.type]}}
        .habit-stat
          router-link(:to="'/stats/' + h.id")
            i.fa.fa-bar-chart
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
      padding-top: 1em;
      border-bottom: 1px solid lightblue;
      font-size: 1.2rem;
    }

    .habit-name {
      width: 30%;
    }

    .habit-type {
      a {
        color: black;
      }
    }

    .habit-icon {
      width: 30%;
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

    .habit-up, .habit-down {
      width: 10%;
      text-align: center;

      .active {
        color: $info;
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
      },
      moveUp: function (idx) {
        let hs = this.habits
        if (idx <= 0) {
          return
        }
        let tmp = hs[idx].order
        hs[idx].order = hs[idx - 1].order
        hs[idx - 1].order = tmp
        this.$store.commit('saveHabit', hs[idx])
        this.$store.commit('saveHabit', hs[idx - 1])
      },
      moveDown: function (idx) {
        let hs = this.habits
        if (idx >= hs.length - 1) {
          return
        }
        let tmp = hs[idx].order
        hs[idx].order = hs[idx + 1].order
        hs[idx + 1].order = tmp
        this.$store.commit('saveHabit', hs[idx])
        this.$store.commit('saveHabit', hs[idx + 1])
      }
    },
    created: function () {
      this.$store.dispatch('init')
      // FIXME: temporary
      let order = 0
      log.info(JSON.stringify(this.$store.state.data.habits))
      for (let hid in this.$store.state.data.habits) {
        let h = this.$store.state.data.habits[hid]
        if (h.order === undefined) {
          h.order = order
          this.$store.commit('saveHabit', h)
          order += 1
        } else {
          break
        }
      }
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
        log.info('recalculate habits - result', JSON.stringify(result))
        return result
      }
    }
  }
</script>

