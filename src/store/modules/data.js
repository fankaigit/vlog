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
  updatedTime: -1,
  inited: false
}

const mutations = {
  [types.MUT_SAVE_HABIT] (state, h) {
    Vue.set(state.habits, h.id, h)
    if (h.deleted === true) {
      let rs = state.records[h.id] || {}
      if (Object.keys(rs).length === 0) {
        log.info('clear habit', JSON.stringify(h))
        delete state.habits[h.id]
        delete state.records[h.id]
      }
    }
    if (!(h.id in state.records)) {
      state.records[h.id] = {}
    }
  },
  [types.MUT_SAVE_RECORD] (state, record) {
    Vue.set(state.records[record.hid], record.key, record.value)
  },
  [types.MUT_DEL_RECORD]: function (state, record) {
    Vue.delete(state.records[record.hid], record.key)
  },
  [types.MUT_UPDATE] (state, source) {
    if (source !== null && source.updatedTime > state.updatedTime) {
      for (let h in source.records) {
        for (let k in source.records[h]) {
          source.records[h][k] = source.records[h][k]
        }
      }

      Vue.set(state, 'habits', source.habits || {})
      Vue.set(state, 'records', source.records || {})
      state.updatedTime = source.updatedTime
      // log.info('updated data:', JSON.stringify(state))
    } else {
      log.info('skip update data')
    }
  },
  [types.MUT_INIT]: function (state) {
    state.inited = true
  },
  [types.MUT_SAVE] (state) {
    state.updatedTime = Date.now()
  },
  [types.MUT_CLEAR_DATA] (state) {
    log.info('clear data')
    state.records = {}
    state.habits = {}
    state.updatedTime = -1
  }
}

const getters = {}

const actions = {
  [types.ACT_INIT] ({dispatch, commit, state}) {
    if (!state.inited) {
      log.info('init data')
      commit(types.MUT_INIT)
      dispatch(types.ACT_LOAD_LOCAL).then(() => dispatch(types.ACT_CHECK_STATUS))
    } else {
      log.info('skip init data')
    }
  },
  [types.ACT_LOAD_REMOTE] ({commit, state, rootState}) {
    const url = `${appConfig.urls.data}/${rootState.user.user.uid}`
    axios.get(url).then(
      (response) => {
        log.info('get remote, updatedTime = ', response.data.updatedTime)
        if (response.data.updatedTime > state.updatedTime) {
          log.info('use remote data')
          commit(types.MUT_UPDATE, response.data)
          saveLocal(state)
        }
      },
      (err) => {
        log.error('fail to get data from server, err=', err)
      }
    )
  },
  [types.ACT_LOAD_LOCAL] ({commit, dispatch}) {
    let data = localStorage.getItem('vlog')
    if (data) {
      try {
        let local = JSON.parse(data)
        commit(types.MUT_UPDATE, local)
      } catch (e) {
        log.error(`fail to parse local data: ${data}`)
      }
    }
    log.info('loaded local data')
  },
  [types.ACT_SAVE_HABIT] ({dispatch, commit}, h) {
    log.info('save habit')
    commit(types.MUT_SAVE_HABIT, h)
    dispatch(types.ACT_SAVE)
  },
  [types.ACT_SAVE_RECORD] ({dispatch, commit}, record) {
    log.info('save record', record)
    commit(types.MUT_SAVE_RECORD, record)
    dispatch(types.ACT_SAVE)
  },
  [types.ACT_DEL_RECORD] ({dispatch, commit}, record) {
    log.info('del record')
    commit(types.MUT_DEL_RECORD, record)
    dispatch(types.ACT_SAVE)
  },
  [types.ACT_SAVE] ({commit, rootState, getters}) {
    commit(types.MUT_SAVE)
    saveLocal(state)
    if (getters.loggedIn) {
      saveRemote(state, rootState.user.user.uid)
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}

function saveLocal (state) {
  localStorage.setItem('vlog', JSON.stringify(state))
  log.info('saved to local')
}

function saveRemote (state, uid) {
  const url = `${appConfig.urls.data}/${uid}`
  axios.post(url, state).then(
    (response) => {
      log.info('saved to remote')
    },
    (err) => {
      log.error('fail to saveRecord to remote, err=', err)
    }
  )
}
