<template>
  <div id="app">
    <router-view/>

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
        <router-link to="/stats">
          <i class="fa fa-bar-chart"/>
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
  export default {
    name: 'app'
  }
</script>

<style>
  * {
    margin: 0px;
    border-width: 0px;
    padding: 0px;
  }

  #app {
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
