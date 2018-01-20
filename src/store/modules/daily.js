
import types from '../types'
import log from '../../utils/log'
import DateUtils from '../../utils/date'

const state = {
  startOfDate: null
}

const mutations = {
  [types.MUT_SELECT_PREVIOUS] (state) {
    log.info(state.startOfDate)
    state.startOfDate -= DateUtils.MILLIS_PER_DAY
    log.info('select', state.startOfDate)
  },
  [types.MUT_SELECT_NEXT] (state) {
    state.startOfDate += DateUtils.MILLIS_PER_DAY
    log.info('select', state.startOfDate)
  },
  [types.MUT_SELECT_DATE] (state, t) {
    state.startOfDate = t
    log.info('select', state.startOfDate)
  },
  [types.MUT_DEBUG] (state) {
    state.debug += 1
  },
  [types.MUT_INIT] (state) {
    state.startOfDate = DateUtils.startOfToday()
  }
}

const actions = {
}

const getters = {
  endOfDate: function (state) {
    return state.startOfDate + DateUtils.MILLIS_PER_DAY - 1000
  },
  debug: function (state) {
    return state.debug === 5
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
