import Vue from 'vue'
import Vuex from 'vuex'
import log from '../../utils/log'
import axios from 'axios'
import appConfig from '../../../conf'
import types from '../types'

Vue.use(Vuex)

const state = {
  habits: {},
  records: {},
  updatedTime: -1
}

const mutations = {
  [types.MUT_SAVE_HABIT] (state, h) {
    Vue.set(state.habits, h.id, h)
    if (!(h.id in state.records)) {
      Vue.set(state.records, h.id, {})
    }
    // if (h.deleted) {
    //   let rs = state.records[h.id] || {}
    //   if (Object.keys(rs).length === 0) {
    //     log.info('clear habit', JSON.stringify(h))
    //     delete state.habits[h.id]
    //     delete state.records[h.id]
    //   }
    // }
  },
  [types.MUT_SAVE_RECORD] (state, record) {
    Vue.set(state.records[record.hid], record.key, record.value)
  },
  [types.MUT_DEL_RECORD]: function (state, record) {
    Vue.delete(state.records[record.hid], record.key)
  },
  [types.MUT_UPDATE_DATA] (state, source) {
    Vue.set(state, 'habits', source.habits || {})
    Vue.set(state, 'records', source.records || {})
  },
  [types.MUT_UPDATE_TS] (state) {
    state.updatedTime = Date.now()
  },
  [types.MUT_CLEAR_DATA] (state) {
    log.info('clear data')
    state.records = {}
    state.habits = {}
    state.updatedTime = -1
    localStorage.clear()
  }
}

function handleError (err, {dispatch, commit}) {
  if (err.response && err.response.status === 401) {
    dispatch(types.ACT_LOGGED_OUT)
  } else {
    commit(types.MUT_DISCONNECTED, true)
    log.error('fail to saveRecord to remote, err=', err)
  }
}

const actions = {
  [types.ACT_SAVE_HABIT] ({dispatch, commit}, h) {
    log.info('save habit')
    commit(types.MUT_SAVE_HABIT, h)
    dispatch(types.ACT_SAVE_DATA)
  },
  [types.ACT_SAVE_RECORD] ({dispatch, commit}, record) {
    log.info('save record', record)
    commit(types.MUT_SAVE_RECORD, record)
    dispatch(types.ACT_SAVE_DATA)
  },
  [types.ACT_DEL_RECORD] ({dispatch, commit}, record) {
    log.info('del record')
    commit(types.MUT_DEL_RECORD, record)
    dispatch(types.ACT_SAVE_DATA)
  },
  [types.ACT_LOAD_REMOTE] ({commit, state, getters}) {
    const url = `${appConfig.urls.data}/${getters.user.uid}`
    axios.get(url).then(
      (res) => {
        log.info('get remote, updatedTime = ', res.data.updatedTime)
        commit(types.MUT_UPDATE_DATA, res.data)
      },
      (err) => handleError(err)
    )
  },
  [types.ACT_LOAD_LOCAL] ({commit, dispatch}) {
    let data = localStorage.getItem('vlog')
    if (data) {
      try {
        let local = JSON.parse(data)
        commit(types.MUT_UPDATE_DATA, local)
      } catch (e) {
        log.error(`fail to parse local data: ${data}`)
      }
    }
    log.info('loaded local data')
  },
  [types.ACT_SAVE_DATA] ({commit, rootState, getters, dispatch}) {
    commit(types.MUT_UPDATE_TS)
    if (getters.loggedIn) {
      dispatch(types.ACT_SAVE_DATA_REMOTE)
    } else {
      saveLocal(state)
    }
  },
  [types.ACT_SAVE_DATA_REMOTE] ({commit, rootState, getters, dispatch}) {
    const url = `${appConfig.urls.data}/${getters.user.uid}`
    axios.post(url, state).then(
      (res) => {
        commit(types.MUT_DISCONNECTED, false)
        log.info(`saved to remote`)
      },
      (err) => handleError(err, {dispatch, commit})
    )
  },
  [types.ACT_CLEAR_LOCAL_DATA] () {
    localStorage.clear()
  },
  [types.ACT_PUBLISH_TEMPLATE] ({commit, dispatch}, content) {
    const url = `${appConfig.urls.template}`
    axios.post(url, content).then(
      (res) => {
        log.info(`published`)
      },
      (err) => handleError(err, {dispatch, commit})
    )
  }
}

export default {
  state,
  mutations,
  actions
}

function saveLocal (state) {
  localStorage.setItem('vlog', JSON.stringify(state))
  log.info('saved to local')
}
