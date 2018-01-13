<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">我的活动</p>
    </section>

    <div id="habits">
      <div v-for="(h, id) in habits" class="habit" v-if="!h.deleted">
        <div class="columns is-mobile" style="width:100%">
          <div id='name' class="column is-6">{{h.name}}</div>
          <div class="column is-4">
            {{htypes[h.type]}}
          </div>
          <div class="column is-2">
            <router-link :to="'/habits/' + h.id">
              <i class="fa fa-arrow-circle-right"/>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <section id="actions">
      <router-link to="/habits/-1" class="button is-primary">
        新建
      </router-link>
    </section>

  </div>
</template>

<style scoped>

  #habits {
    margin: 0.3rem 1rem;
  }

  #habits .habit {
    border-bottom: 1px solid lightblue;
    margin-bottom: 0.5rem;
  }

  #habits a {
    text-align: right;
    color: darkcyan;
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

