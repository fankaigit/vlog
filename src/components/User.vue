<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">{{ loggedIn ? '用户' : '登录/注册' }}</p>
    </section>

    <section id="user" v-if="loggedIn">
      <div style="text-align:center">
        <h3>
          用户：{{user.username}}
        </h3>
      </div>
      <div class="button is-danger" @click="logout()">Logout</div>
    </section>

    <section id="login" v-else>
      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="text" v-model="username" maxlength="20" placeholder="用户名"/>
          <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
          <span class="icon is-small is-right" v-if="isValidUserName">
            <i class="fa fa-check"></i>
          </span>
        </p>
        <div class="notice">
           <span v-if="username !== '' && !isValidUserName">
            用户名只能包含字母和数字，6-20个字符
          </span>
        </div>
      </div>

      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="password" v-model="password" maxlength="20" placeholder="密码">
          <span class="icon is-small is-left"><i class="fa fa-lock"></i></span>
          <span class="icon is-small is-right" v-if="isValidPassword">
            <i class="fa fa-check"></i>
          </span>
        </p>
        <div class="notice">
           <span v-if="password !== '' && !isValidPassword">
            密码必须包含字母和数字，6-20个字符
          </span>
        </div>
      </div>

      <div class="field">
        <div class="login button is-success" @click="login()">登录</div>
        <div class="button is-warning is-small" @click="register()">注册</div>
        <div class="notice">
           <div style="text-align: center">{{actionNotice}}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>

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
  }

  .notice {
    height: 1.5em;
    overflow: hidden;
    color: red;
  }

</style>

<script>
  import shajs from 'sha.js'

  export default {
    name: 'User',
    data: function () {
      return {
        username: '',
        password: '',
        lastAction: null
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
        this.lastAction = 'register'
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch('register', data)
      },
      login: function () {
        if (!this.validInput()) {
          return
        }
        this.lastAction = 'login'
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch('login', data)
      },
      logout: function () {
        this.lastAction = 'logout'
        this.$store.dispatch('logout')
      },
      hashedPassword: function () {
        return shajs('sha256').update(this.password).digest('hex')
      }
    },
    created: function () {
      this.$store.dispatch('init')
    },
    beforeDestroy: function () {
    },
    computed: {
      isValidUserName: function () {
        return this.username.match(/^[0-9a-zA-Z]{6,10}$/)
      },
      isValidPassword: function () {
        return this.password.match(/[0-9]/) && this.password.match(/[a-zA-Z]/) && this.password.length >= 6
      },
      loggedIn: function () {
        return this.$store.getters.loggedIn
      },
      user: function () {
        return this.$store.state.user
      },
      actionNotice: function () {
        if (!this.loggedIn) {
          if (this.lastAction === 'login') {
            return '登录失败'
          } else if (this.lastAction === 'register') {
            return '注册失败'
          }
        } else {
          return ''
        }
      }
    }
  }
</script>

