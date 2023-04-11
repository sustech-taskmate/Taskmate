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
    path: '/Homework',
    component: () => import('../view/Homework.vue')
  },
  {
    path: '/Set',
    component: () => import('../view/Set.vue')
  },
  {
    path: '/Assign',
    component: () => import('../view/Assign.vue')
  },
  {
    path: '/View',
    component: () => import('../view/View.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
