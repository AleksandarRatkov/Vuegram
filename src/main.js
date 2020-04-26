/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

let app
fb.auth.onAuthStateChanged(() => {
      new Vue({
        router,
        store,
        vuetify,
        i18n,
        render: h => h(App)
      }).$mount('#app')
    })
