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
          <input class="input" type="email" v-model="username" placeholder="用户名"/>
          <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
          <span class="icon is-small is-right" v-if="isValidUserName">
            <i class="fa fa-check"></i>
          </span>
        </p>
      </div>

      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="password" v-model="password" placeholder="密码">
          <span class="icon is-small is-left"><i class="fa fa-lock"></i></span>
          <span class="icon is-small is-right" v-if="isValidPassword">
            <i class="fa fa-check"></i>
          </span>
        </p>
      </div>

      <div class="login button is-success" @click="login()">登录</div>
      <div class="button is-warning is-small" @click="register()">注册</div>
    </section>

  </div>
</template>

<style scoped>

  #login {
    margin: 2em auto 2em;
  }

  .field {
    width: 90%;
    margin: 1em auto;
  }

  .button {
    display: block;
    width: 90%;
    margin: auto auto 1em;
  }

  .button.login {
    margin-top: 2em;
  }

</style>

<script>
  import shajs from 'sha.js'

  export default {
    name: 'User',
    data: function () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      register: function () {
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch('register', data)
      },
      login: function () {
        const data = {
          username: this.username,
          password: this.hashedPassword()
        }
        this.password = ''
        this.$store.dispatch('login', data)
      },
      logout: function () {
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
        // TODO
        return this.username !== ''
      },
      isValidPassword: function () {
        // TODO
        return this.password !== ''
      },
      loggedIn: function () {
        return this.$store.getters.loggedIn
      },
      user: function () {
        return this.$store.state.user
      }
    }
  }
</script>

