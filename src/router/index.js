import Vue from 'vue'
import VueRouter from 'vue-router'
import Settings from '../views/Settings.vue'
import Dashboard from '../views/Dashboard.vue'
import Contacts from '../views/Contacts.vue'
import Login from '../views/Login.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'default',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'default',
      requiresAuth: true
    }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      layout: 'default',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    redirect: '/dashboard'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router
