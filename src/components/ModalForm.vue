<template lang="pug">
  .modal-card
    .modal-card-head 发布我的日程
    .modal-card-body
      .field
        input.input.is-primary(type="text", v-model="name", maxlength="20")
      .field
        .button.is-primary(@click="publish") 发布
</template>

<style lang="scss" scoped>

  .button {
    width: 80%;
  }

  .field {
    text-align: center;
    margin: 1rem;

    .input {
      padding: auto 0.2rem;
    }
  }

</style>

<script>
  import types from '../store/types'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ModelForm',
    props: ['habits'],
    data: function () {
      return {
        name: ''
      }
    },
    methods: {
      publish: function () {
        this.$store.dispatch(types.ACT_PUBLISH_TEMPLATE, {
          name: this.name,
          habits: this.habits
        })
        this.$parent.close()
      }
    },
    created: function () {
      this.name = this.user.username + '的日程'
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>

<style scoped>

</style>