import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../view/Login.vue')
  },
  {
    path: '/Main',
    component: () => import('../view/Main.vue')
  },
  {
    path: '/Register',
    component: () => import('../view/Register.vue')
  },
  {
    path: '/Main/Homework',
    component: () => import('../view/Homework.vue')
  },
  {
    path: '/Main/Set',
    component: () => import('../view/Set.vue')
  },
  {
    path: '/Main/Homework/Modify',
    component: () => import('../view/Modify.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
