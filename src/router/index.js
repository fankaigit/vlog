import Vue from 'vue'
import Router from 'vue-router'
import Daily from '@/components/Daily'
import Habits from '@/components/Habits'
import Habit from '@/components/Habit'
import Stats from '@/components/Stats'
import User from '@/components/User'
import Templates from '@/components/Templates'

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
      path: '/stats/:hid',
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
    },
    {
      path: '/templates',
      name: 'templates',
      component: Templates
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
})
