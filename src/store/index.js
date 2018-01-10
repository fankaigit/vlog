import Vue from 'vue'
import Vuex from 'vuex'
import log from '../utils/log'
import axios from 'axios'
import appConfig from '../../conf'

Vue.use(Vuex)

const state = {
  data: {
    habits: {},
    records: {},
    updatedTime: -1
  },
  inited: false,
  user: null
}

const mutations = {
  saveHabit: function (state, h) {
    Vue.set(state.data.habits, h.id, h)
    state.data.updatedTime = Date.now()
    if (h.deleted === true) {
      let rs = state.data.records[h.id] || {}
      if (Object.keys(rs).length === 0) {
        log.info('clear habit', JSON.stringify(h))
        delete state.data.habits[h.id]
        delete state.data.records[h.id]
      }
    }
    save(state)
  },
  initHabitRecords: function (state, hid) {
    Vue.set(state.data.records, hid, {})
    save(state)
  },
  saveRecord: function (state, record) {
    Vue.set(state.data.records[record.hid], record.key, record.value)
    save(state)
  },
  delRecord: function (state, record) {
    Vue.delete(state.data.records[record.hid], record.key)
    save(state)
  },
  update: function (state, source) {
    if (source !== null && source.updatedTime > state.data.updatedTime) {
      Vue.set(state.data, 'habits', source.habits || {})
      Vue.set(state.data, 'records', source.records || {})
      state.data.updatedTime = source.updatedTime
      log.info('updated data:', JSON.stringify(state.data))
    } else {
      log.info('skip update data')
    }
  }
}

const getters = {
  loggedIn: function (state) {
    return state.user !== null
  }
}

const actions = {
  init: function (context) {
    if (!context.state.inited) {
      log.info('init data')
      loadLocal(context)
      context.state.inited = true
      checkLogin(context)
    } else {
      log.info('skip init data')
    }
  },
  register: function (context, data) {
    log.info('register')
    const url = appConfig.urls.register
    axios.post(url, data).then(
      (response) => onLoggedIn(context, response),
      (err) => onNotLoggedIn(context, err)
    )
  },
  login: function (context, data) {
    log.info('login')
    const url = appConfig.urls.login
    axios.post(url, data).then(
      (response) => onLoggedIn(context, response),
      (err) => onNotLoggedIn(context, err)
    )
  },
  logout: function (context) {
    log.info('logout')
    context.state.loggedIn = false
    context.state.user = null
    localStorage.clear()
    const url = appConfig.urls.logout
    axios.post(url).then(
      (response) => {
        log.info('fail to logged out:', response.data)
      },
      (err) => onNotLoggedIn(context, err)
    )
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

function onLoggedIn (context, response) {
  log.info('login status:', response.data)
  context.state.loggedIn = true
  context.state.user = response.data
  loadRemote(context)
}

function onNotLoggedIn (context, err) {
  if (err.response.status === 401) {
    log.info('not logged in')
    context.state.loggedIn = false
    context.state.user = null
  } else {
    log.error('fail to connect to server:', err)
  }
}

function checkLogin (context) {
  axios.get(appConfig.urls.status).then(
    (response) => onLoggedIn(context, response),
    (err) => onNotLoggedIn(context, err)
  )
}

function save (state) {
  saveLocal(state)
  saveRemote(state)
}

function loadLocal (context) {
  let data = localStorage.getItem('vlog')
  if (data) {
    try {
      let local = JSON.parse(data)
      context.commit('update', local)
    } catch (e) {
      log.error(`fail to parse local data: ${data}`)
    }
  }
  log.info('loaded local data')
}

function loadRemote (context) {
  const url = `${appConfig.urls.data}/${context.state.user.uid}`
  axios.get(url).then(
      (response) => {
        log.info('get remote = ', JSON.stringify(response.data))
        if (response.data.updatedTime > context.state.data.updatedTime) {
          log.info('use remote data')
          context.commit('update', response.data)
          saveLocal(context.state)
        }
      },
      (err) => {
        log.error('fail to get data from server, err=', err)
      }
  )
}

function saveLocal (state) {
  localStorage.setItem('vlog', JSON.stringify(state.data))
  log.info('saved to local:', JSON.stringify(state.data))
}

function saveRemote (state) {
  if (!state.loggedIn) {
    log.info('not logged in, skip')
    return
  }
  const url = `${appConfig.urls.data}/${state.user.uid}`
  axios.post(url, state.data).then(
      (response) => {
        log.info('saved to remote')
      },
      (err) => {
        log.error('fail to saveRecord to remote, err=', err)
      }
  )
}
