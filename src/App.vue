<template>
  <div id="app">
    <div id="main">
      <router-view/>
    </div>

    <div v-if="$store.getters.isDebug">
      last updated: {{new Date($store.state.data.updatedTime)}}
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
          <i class="fa fa-user" v-if="$store.getters.loggedIn"/>
          <i class="fa fa-user-secret" v-else/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import types from './store/types'
  export default {
    name: 'app',
    created: function () {
      this.$store.dispatch(types.ACT_INIT)
    }
  }
</script>

<style>
  *, :last-child, :first-child {
    margin: 0px;
    border-width: 0px;
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
