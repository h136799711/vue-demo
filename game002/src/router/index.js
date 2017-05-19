import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/game'
import Meta from 'vue-meta'
import Cookie from 'vue-cookie'
import axios from 'axios'

Vue.use(Router)
Vue.use(Meta)
Vue.use(Cookie)

axios.defaults.baseURL = 'http://dev.lzg.8raw.com/weixin.php/weixin/'
// axios.defaults.headers.common['Authorization'] = 'itboye-laohuji'
axios.defaults.headers.common['X-Requested-With'] = 'itboye-laohuji'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game',
      component: Game
    }
  ]
})
