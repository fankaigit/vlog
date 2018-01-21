
import types from '../types'
import log from '../../utils/log'
import axios from 'axios'
import appConfig from '../../../conf'
import router from '../../router/index'

const state = {
  user: null,
  loggedOut: true,
  loggedIn: false
}

const mutations = {
  [types.MUT_LOGOUT] (state, loggedOut) {
    state.loggedOut = loggedOut
  },
  [types.MUT_LOGIN] (state, loggedIn) {
    state.loggedIn = loggedIn
  },
  [types.MUT_USER] (state, user) {
    state.user = user
  }
}

const actions = {
  [types.ACT_REGISTER] (context, data) {
    log.info('register')
    context.commit(types.MUT_LOGOUT, false)
    axios.post(appConfig.urls.register, data).then(
      (response) => onLoggedIn(context, response),
      (err) => onNotLoggedIn(context, err)
    )
  },
  [types.ACT_LOGIN] (context, data) {
    log.info('login')
    context.commit(types.MUT_LOGOUT, false)
    axios.post(appConfig.urls.login, data).then(
      (response) => onLoggedIn(context, response),
      (err) => onNotLoggedIn(context, err)
    )
  },
  [types.ACT_LOGOUT] (context) {
    log.info('logout')
    localStorage.setItem('user', null)
    context.commit(types.MUT_CLEAR_DATA)
    context.commit(types.MUT_USER, null)
    axios.post(appConfig.urls.logout).then(
      (response) => {
        log.info('fail to logged out:', response.data)
      },
      (err) => onNotLoggedIn(context, err)
    )
  },
  [types.ACT_CHECK_STATUS] (context) {
    axios.get(appConfig.urls.status).then(
      (response) => onLoggedIn(context, response),
      (err) => onNotLoggedIn(context, err)
    )
  },
  [types.ACT_LOAD_LOCAL] ({commit, dispatch}) {
    let user = localStorage.getItem('user')
    commit(types.MUT_USER, JSON.parse(user))
    log.info('loaded local user', user)
  },
  [types.ACT_LOGGED_OUT] ({commit, dispatch}) {
    log.error('user is already logged out')
    dispatch(types.ACT_LOGOUT, false)
    router.push('/user')
  }
}

const getters = {
  loggedIn: function (state) {
    return state.loggedIn
  },
  loggedOut: function (state) {
    return state.loggedOut
  },
  user: function (state) {
    return state.user
  }
}

function onLoggedIn (context, response) {
  log.info('logged in as ', response.data)
  let u = response.data
  log.info(JSON.stringify(context.state.user))
  log.info(JSON.stringify(u))

  if (context.state.user && u.uid !== context.state.user.uid) {
    log.info('clear data for prev user:', context.state.user)
    context.commit(types.MUT_CLEAR_DATA)
  }
  context.commit(types.MUT_USER, response.data)
  context.commit(types.MUT_LOGIN, true)
  localStorage.setItem('user', JSON.stringify(response.data))
  context.dispatch(types.ACT_LOAD_REMOTE, false)
}

function onNotLoggedIn (context, err) {
  if (err.response && err.response.status === 401) {
    log.info('logged out')
    context.commit(types.MUT_LOGIN, false)
    context.commit(types.MUT_LOGOUT, true)
  } else {
    log.error('fail to connect to server:', err)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
