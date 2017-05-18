import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/game'
import Meta from 'vue-meta'
import Cookie from 'vue-cookie'

Vue.use(Router)
Vue.use(Meta)
Vue.use(Cookie)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game',
      component: Game
    }
  ]
})
