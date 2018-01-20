<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title(@click="debug()") {{ loggedIn ? '用户' : '登录/注册' }}

    section#user(v-if="loggedIn")
      h3.field 欢迎, {{user.username}}！
      p.field.button.is-danger(@click="logout()") 退出登录

    section#input(v-if="!loggedIn")
      .field
        p.control.has-icons-left.has-icons-right
          input.input.is-primary(type="text", v-model="username", maxlength="20", placeholder="用户名")
          span.icon.is-small.is-left
            i.fa.fa-user
          span.icon.is-small.is-right(v-if="isValidUserName")
            i.fa.fa-check
        .notice
          p(v-if="username !== '' && !isValidUserName") 用户名只能包含字母和数字，6-20个字符

      .field
        p.control.has-icons-left.has-icons-right
          input.input.is-warning(type="password", v-model="password", maxlength="20", placeholder="密码")
          span.icon.is-small.is-left
            i.fa.fa-lock
          span.icon.is-small.is-right(v-if="isValidPassword")
            i.fa.fa-check
        .notice
          p(v-if="password !== '' && !isValidPassword") 密码必须包含字母和数字，6-20个字符

    section#register(v-if="!loggedIn && !registered")
      .field
        .button.is-primary(@click="register()") 注册
        .switch(@click="switchRegistered(true)") 直接登录

    section#login(v-if="!loggedIn && registered")
      .field
        .button.is-success(@click="login()") 登录
        .switch(@click="switchRegistered(false)") 我要注册

    section#notice(v-if="!loggedIn")
      .field
        .notice
          p(style="text-align: center") {{failureTip}}
        .help
          p 不登录可以直接试用，但数据只在当前回话中有效，重启浏览器后可能丢失。
          p 登录后记录会上传到服务器，可以在多个设备使用。

</template>

<style lang="scss" scoped>
  @import "../assets/main.scss";

  #header {
    margin-bottom: 2em;
  }

  .field {
    width: 90%;
    margin: 1em auto;
  }

  .button {
    display: block;
    margin: auto auto 1em;
    padding-top: 0.3em;
  }

  .notice {
    height: 1.5em;
    overflow: hidden;
    color: red;
  }

  input.input {
    border-width: 1px;
    padding-left: 0.4em;
  }

  .switch {
    width: 100%;
    text-align: center;
    font-size: 90%;
    color: $info;
  }

</style>

<script>
  import shajs from 'sha.js'
  import types from '../store/types'
  import { mapGetters } from 'vuex'

  export default {
    name: 'User',
    data: function () {
      return {
        username: '',
        password: '',
        action: null,
        registered: true
      }
    },
    methods: {
      validInput: function () {
        return this.isValidUserName && this.isValidPassword
      },
      register: function () {
        if (!this.validInput()) {
          return
        }
        this.action = 'register'
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch(types.ACT_REGISTER, data)
      },
      login: function () {
        if (!this.validInput()) {
          return
        }
        this.action = 'login'
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch(types.ACT_LOGIN, data)
      },
      logout: function () {
        this.action = 'logout'
        this.$store.dispatch(types.ACT_LOGOUT)
      },
      hashedPassword: function () {
        return shajs('sha256').update(this.password).digest('hex')
      },
      debug: function () {
        this.$store.commit(types.MUT_DEBUG)
      },
      switchRegistered: function (registered) {
        this.registered = registered
        this.action = null
      }
    },
    beforeDestroy: function () {
    },
    computed: {
      ...mapGetters([
        'loggedIn',
        'loggedOut',
        'user'
      ]),
      isValidUserName: function () {
        return this.username.match(/^[0-9a-zA-Z]{6,30}$/)
      },
      isValidPassword: function () {
        return this.password.match(/[0-9]/) && this.password.match(/[a-zA-Z]/) && this.password.length >= 6
      },
      failureTip: function () {
        if (this.loggedOut) {
          if (this.action === 'login') {
            return '登录失败'
          } else if (this.action === 'register') {
            return '注册失败'
          }
        } else {
          return ''
        }
      }
    }
  }
</script>

