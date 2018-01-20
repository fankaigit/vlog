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
    debug: 0
  },
  mutations: {
    [types.MUT_DEBUG] (state) {
      state.debug ++
    }
  },
  getters: {
    isDebug (state) {
      return state.debug === 5  // tap 5 times
    }
  }
})
