<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">我的活动</p>
    </section>

    <div id="habits">
      <div class="habit" v-for="(h, id) in habits">
        <div class="habit" @click="select(h)" v-if="!h.deleted"
             :class="h === selected ? 'selected' : 'unselected'">
          {{h.name}},{{h.min}},{{h.max}},{{h.step}},{{h.values}}
        </div>
      </div>
    </div>

    <section id="actions">
      <router-link to="/habits/-1" class="button is-primary is-large">
        新建
      </router-link>
      <router-link :to="'/habits/' + selected.id" class="button is-warning is-large"
                   v-if="selected != undefined">
        修改
      </router-link>
      <a class="button is-danger is-large" @click="remove" v-if="selected != undefined">删除</a>
    </section>

  </div>
</template>

<style scoped>

  #habits {
    margin-top: 0.2em;
  }

  #habits .selected {
    background-color: lightblue;
  }

  #actions {
    margin-top: 0.3em;
  }

</style>

<script>
  import log from '../utils/log'

  export default {
    name: 'Habits',
    data () {
      return {
        selected: undefined
      }
    },
    methods: {
      select: function (h) {
        log.info(`select ${h.id} ${h.name}`)
        this.selected = h
      },
      remove: function () {
//        if (this.$store.)
        if (this.selected !== undefined) {
          this.selected.deleted = true
          this.$store.commit('saveHabit', this.selected)
        }
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

