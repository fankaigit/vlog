import Vue from 'vue'
import Vuex from 'vuex'
import types from '../store/types'

import userModule from './modules/user'
import dataModule from './modules/data'
import dailyModule from './modules/daily'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: userModule,
    data: dataModule,
    daily: dailyModule
  },
  state: {
    debug: 0,
    disconnected: false
  },
  mutations: {
    [types.MUT_DEBUG] (state) {
      state.debug ++
    },
    [types.MUT_DISCONNECTED] (state, disconnected) {
      state.disconnected = disconnected
    }
  },
  getters: {
    isDebug (state) {
      return state.debug === 5  // tap 5 times
    },
    isDisconnected (state) {
      console.log('dis:', state.disconnected)
      return state.disconnected
    }
  }
})
