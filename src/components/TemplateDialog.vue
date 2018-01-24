<template lang="pug">
  #dialog(v-show="active")
    #dialog-body
      .message.is-light
        .message-header
          .message-title 日程名称
        .message-body
          input.input(type="text", v-model="name", maxlength="20")
          .columns.is-mobile
            .column.button.is-primary(@click="publish") 发布
            .column.button.is-danger(@click="cancel") 取消

</template>

<style lang="scss" scoped>

  #dialog {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #dialog-body {
    align-self: center;
    margin: 1rem;
    width: 90%;
  }

  .message-title {
    font-size: 1.2rem;
    margin: 0.5rem 1rem;
  }

  .message-body {
    padding: 0.5rem;

    input {
      padding: 0.2rem;
    }
  }

  .button {
    margin: 1rem;
    padding-top: 0.3rem;
  }

</style>

<script>
  import types from '../store/types'
  import { mapGetters } from 'vuex'

  export default {
    name: 'TemplateDialog',
    props: ['habits', 'active'],
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
        this.$emit('update:active', false)
      },
      cancel: function () {
        this.$emit('update:active', false)
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