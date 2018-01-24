<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title 我的日程

    section#habits
      .notice(v-if="Object.keys(habits).length === 0")
        p 你还没有任何活动，从可用日程中挑一个日程或者自己新建一个活动吧。

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
      .columns.is-mobile
        .column
          router-link.button.is-info(:to="'/templates'") 浏览可用日程
        .column(v-if="loggedIn")
          .button.is-warning(@click="publishTemplate") 发布我的日程
      .txt(v-if="loggedIn")
        p 日程发布后可以供所有人来浏览和使用
        p 你可以随时删除自己发布的日程

    template-dialog(:active.sync="publishing", :habits="habits")

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

  .notice {
    font-size: 0.9rem;
  }

  #actions {

    .columns {
      margin: 0;
    }

    .button {
      display: block;
      margin: 1rem 1rem 0;
      padding-top: 0.3rem;
    }

    .txt {
      margin: 1rem 1rem 0;
      font-size: 0.9rem;
    }
  }


</style>

<script>
  import log from '../utils/log'
  import types from '../store/types'
  import { mapGetters } from 'vuex'
  import TemplateDialog from './TemplateDialog'

  export default {
    components: {
      TemplateDialog
    },
    name: 'Habits',
    data: function () {
      return {
        publishing: false
      }
    },
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
      },
      publishTemplate: function () {
        this.publishing = true
      }
    },
    created: function () {
    },
    computed: {
      ...mapGetters([
        'loggedIn',
        'loggedOut',
        'user'
      ]),
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
        return result
      }
    }
  }
</script>

