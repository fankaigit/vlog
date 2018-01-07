import Vue from 'vue'
import Router from 'vue-router'
import Daily from '@/components/Daily'
import Habits from '@/components/Habits'
import Habit from '@/components/Habit'
import Stats from '@/components/Stats'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/daily'
    },
    {
      path: '/daily',
      name: 'daily',
      component: Daily
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/habits',
      name: 'habits',
      component: Habits
    },
    {
      path: '/habits/:hid',
      name: 'habit',
      component: Habit
    }

  ]
})
