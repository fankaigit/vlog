
import types from '../types'
import log from '../../utils/log'
import axios from 'axios'
import appConfig from '../../../conf'

const state = {
  user: null,
  loggedOut: true
}

const mutations = {
  [types.MUT_LOGOUT] (state, loggedOut) {
    state.loggedOut = loggedOut
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
    context.commit(types.MUT_CLEAR_DATA)
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
  }
}

const getters = {
  loggedIn: function (state) {
    return state.user !== null
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
  context.commit(types.MUT_USER, response.data)
  context.dispatch(types.ACT_LOAD_REMOTE, false)
}

function onNotLoggedIn (context, err) {
  if (err.response && err.response.status === 401) {
    log.info('logged out')
    context.commit(types.MUT_LOGOUT, true)
    context.commit(types.MUT_USER, null)
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
