import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {App} from "vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../view/Overview.vue')
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
    name: 'homework',
    component: () => import('../view/Homework.vue')
  },
  {
    path: '/Main/Set',
    component: () => import('../view/Set.vue')
  },
  {
    path: '/Main/Homework/Assign',
    name: 'assign',
    component: () => import('../view/Assign.vue'),
    children: [{
      path: 'file/',
      name: 'render',
      component: () => import('../components/AssignContent/FileContent.vue')
    }]
  },
  {
    path: '/Main/View',
    component: () => import('../view/View.vue')
  }

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({left:0, top:0})
})

export async function setupRouter(app: App) {
  app.use(router);
  await router.isReady();
}
