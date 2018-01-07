<template>
  <div id="app">
    <router-view/>

    <div id="nav" class="navbar is-fixed-bottom bd-notification is-dark">
      <div>
        <router-link to="/daily">记录</router-link>
        <i class="fa fa-book"/>
      </div>
      <div>
        <router-link to="/habits">活动</router-link>
        <i class="fa fa-list"/>
      </div>
      <div>
        <router-link to="/stats">统计</router-link>
        <i class="fa fa-bar-chart"/>
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
    font-size: 1.5rem;
  }

  #app {
  }

  .hero .title, .subtitle {
    text-align: center;
  }

  #nav {
    display: flex;
    min-height: 1.8em;
  }

  #nav div {
    flex-grow: 1;
    text-align: center;
  }

  #nav a {
    color: white;
    font-weight: bold;
    font-size: 1.8rem;
  }

</style>
