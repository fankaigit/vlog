<template lang="pug">
  .date-nav
    .date-nav-prev(@click="data.goPrev()")
      span(v-if="data.displayPrev()")
        i.fa.fa-chevron-left
        =" "
        span {{ data.prev }}
    .date-nav-title {{ data.title }}
    .date-nav-next(@click="data.goNext()")
      span(v-if="data.displayNext()")
        span {{ data.next }}
        =" "
        i.fa.fa-chevron-right

</template>

<style lang="scss" scoped>
  @import "../assets/main.scss";

  .date-nav {
    height: 2rem;
    width: 100%;
    background-color: rgba(32, 156, 238, 0.6);
    text-align: center;

    >* {
      display: inline-block;
      color: whitesmoke;
      font-size: 1rem;
      padding-top: 0.3rem;
    }

    .date-nav-prev, .date-nav-next {
      width: 20%;
    }

    .date-nav-title {
      width: 60%;
    }
  }

</style>

<script>
  import log from '../utils/log'

  export default {
    name: 'DateNav',
    props: ['data'],
    methods: {
      pickPrevMonth: function () {
        log.info('select prev')
        this.onPrev()
      },
      pickNextMonth: function () {
        log.info('select next')
        this.onNext()
      }
    }
  }
</script>
