
import types from '../types'
import log from '../../utils/log'
import axios from 'axios'
import appConfig from '../../../conf'
import router from '../../router/index'
import Status from '../userStatus'

const state = {
  user: null,
  status: Status.LOGGED_OUT
}

const mutations = {
  [types.MUT_USER_STATUS] (state, status) {
    state.status = status
  },
  [types.MUT_USER] (state, user) {
    state.user = user
  }
}

function logError (err) {
  if (err.response && err.response.status === 401) {
    log.error('fail to auth')
  } else {
    log.error('fail to connect to server:', err)
  }
}

const actions = {
  [types.ACT_REGISTER] ({commit, dispatch, state}, data) {
    console.assert(state.status === Status.LOGGED_OUT)
    log.info('register')
    commit(types.MUT_USER_STATUS, Status.REGISTERING)
    axios.post(appConfig.urls.register, data).then(
      (res) => dispatch(types.ACT_LOGGED_IN, res.data),
      (err) => {
        commit(types.MUT_USER_STATUS, Status.LOGGED_OUT)
        logError(err)
      }
    )
  },
  [types.ACT_LOGIN] ({commit, dispatch}, data) {
    console.assert(state.status === Status.LOGGED_OUT)
    log.info('login')
    commit(types.MUT_USER_STATUS, Status.LOGGING_IN)
    axios.post(appConfig.urls.login, data).then(
      (res) => dispatch(types.ACT_LOGGED_IN, res.data),
      (err) => {
        commit(types.MUT_USER_STATUS, Status.LOGGED_OUT)
        logError(err)
      }
    )
  },
  [types.ACT_LOGOUT] ({commit, dispatch, getters}) {
    console.assert(state.status === Status.LOGGED_IN)
    log.info('logout')
    dispatch(types.ACT_LOGGED_OUT)
    axios.post(appConfig.urls.logout)
  },
  [types.ACT_INIT_CHECK] ({commit, dispatch, getters}) {
    axios.get(appConfig.urls.status).then(
      (res) => dispatch(types.ACT_LOGGED_IN, res.data),
      (err) => {
        logError(err)
        dispatch(types.ACT_LOAD_LOCAL)
      }
    )
  },
  [types.ACT_LOGGED_OUT] ({commit, dispatch}) {
    log.info('logged out, clear user and data')
    commit(types.MUT_USER_STATUS, Status.LOGGED_OUT)
    commit(types.MUT_USER, null)
    commit(types.MUT_CLEAR_DATA)
    router.push('/user')
  },
  [types.ACT_LOGGED_IN] ({commit, dispatch, state}, user) {
    let newUser = (state.status === Status.REGISTERING)
    commit(types.MUT_USER_STATUS, Status.LOGGED_IN)
    commit(types.MUT_USER, user)
    if (newUser) {
      log.info(`registered as ${user}`)
      dispatch(types.ACT_SAVE_DATA_REMOTE)
    } else {
      log.info(`logged in as ${user}`)
      dispatch(types.ACT_LOAD_REMOTE)
    }
  }
}

const getters = {
  loggedIn: function (state) {
    return state.status === Status.LOGGED_IN
  },
  loggedOut: function (state) {
    return state.status === Status.LOGGED_OUT
  },
  user: function (state) {
    return state.user
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
