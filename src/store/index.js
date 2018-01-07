import Vue from 'vue'
import Vuex from 'vuex'
import log from '../utils/log'
import axios from 'axios'
import appConfig from '../../conf'

const url = appConfig.url

Vue.use(Vuex)

const state = {
  habits: {},
  records: {},
  updatedTime: -1
}

const mutations = {
  saveHabit: function (state, h) {
    Vue.set(state.habits, h.id, h)
    state.updatedTime = Date.now()
    if (h.deleted === true) {
      let rs = state.records[h.id] || {}
      if (Object.keys(rs).length === 0) {
        log.info('clear habit', JSON.stringify(h))
        delete state.habits[h.id]
        delete state.records[h.id]
      }
    }
    save(state)
  },
  initHabitRecords: function (state, hid) {
    Vue.set(state.records, hid, {})
    save(state)
  },
  saveRecord: function (state, record) {
    Vue.set(state.records[record.hid], record.key, record.value)
    save(state)
  },
  delRecord: function (state, record) {
    Vue.delete(state.records[record.hid], record.key)
    save(state)
  },
  update: function (state, source) {
    if (source !== null && source.updatedTime > state.updatedTime) {
      Vue.set(state, 'habits', source.habits || {})
      state.records = source.records || {}
      state.updatedTime = source.updatedTime
      log.info('updated state:', JSON.stringify(state))
    } else {
      log.info('skip update state')
    }
  }
}

const getters = {
}

const actions = {
  init: function (context) {
    if (context.state.updatedTime === -1) {
      log.info('init data')
      loadLocal(context)
      loadRemote(context)
    } else {
      log.info('skip init data')
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

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
}

function loadRemote (context) {
  axios.get(url).then(
      (response) => {
        log.info('remote = ', JSON.stringify(response.data))
        if (response.data.updatedTime > state.updatedTime) {
          log.info('use remote data')
          context.commit('update', response.data)
          saveLocal()
        }
      },
      (err) => {
        log.error('fail to get data from server, err=', err)
      }
  )
}

function saveLocal (state) {
  localStorage.setItem('vlog', JSON.stringify(state))
  log.info('saved to local:', JSON.stringify(state))
}

function saveRemote (state) {
  axios.post(url, state).then(
      (response) => {
        log.info('saved to remote')
      },
      (err) => {
        log.error('fail to saveRecord to remote, err=', err)
      }
  )
}
