<template>
  <div id="app">
    <div style="background:tomato; color: white" v-if="isDisconnected">
      修改无法同步到服务器，请尝试刷新页面~
    </div>

    <div id="main">
      <router-view/>
    </div>

    <div v-if="isDebug">
      last updated: {{new Date(updatedTime)}}
    </div>

    <div id="nav" class="navbar is-fixed-bottom bd-notification">
      <div>
        <router-link to="/daily">
          <i class="fa fa-book"/>
        </router-link>
      </div>
      <div>
        <router-link to="/habits">
          <i class="fa fa-list"/>
        </router-link>
      </div>
      <div>
        <router-link to="/user">
          <i class="fa fa-user" v-if="loggedIn"/>
          <i class="fa fa-user-secret" v-else/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import types from './store/types'
  import { mapGetters } from 'vuex'

  export default {
    name: 'app',
    data: function () {
      return {
        types: types
      }
    },
    created: function () {
      this.$store.dispatch(types.ACT_INIT)
    },
    computed: {
      ...mapGetters([
        'isDisconnected',
        'isDebug',
        'updatedTime',
        'loggedIn'
      ])
    }
  }
</script>

<style lang="scss">
  @import '~bulma/bulma';

  *, :last-child, :first-child {
    margin: 0px;
    padding: 0px;
  }

  #main {
    margin-bottom: 4rem;
  }

  .hero {
    height: 4rem;
  }

  .hero .title, .subtitle {
    text-align: center;
    padding-top: 0.9rem;
  }

  #nav {
    display: flex;
    min-height: 2rem;
    border-top: 1px solid whitesmoke;
  }

  #nav div {
    flex-grow: 1;
    text-align: center;
  }

  #nav a {
    color: gray;
    font-weight: bold;
    font-size: 1.5rem;
  }

  #nav a.router-link-active {
    color: #209cee;
  }

</style>
