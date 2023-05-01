import { createRouter, createWebHashHistory } from 'vue-router'
import {App} from "vue";

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../view/Index.vue')
  },
  {
    path: '/loading',
    name: 'loading',
    component: () => import('../view/Loading.vue')
  },
  {
    path: '/grade/t/:cid',
    name: 'teacherCourse',
    component: () => import('../view/CourseView.vue')
  },
  {
    path: '/grade/t/:cid/:aid',
    name: 'teacherAssign',
    component: () => import('../view/AssignView.vue')
  },
  {
    path: '/grade/t/:cid/:aid/statistics',
    name: 'statistics',
    component: () => import('../view/AssignStatistics.vue')
  },
  // {
  //   path: '/Main/Set',
  //   component: () => import('../view/AssignSetting.vue')
  // },
  {
    path: '/grade/t/:cid/:aid/:gid',
    name: 'grade',
    component: () => import('../view/Grading.vue'),
    children: [{
      path: 'file/',
      name: 'render',
      component: () => import('../components/AssignContent/FileContent.vue')
    }]
  },
  {
    path: '/Main/View',
    component: () => import('../view/AssignStatistics.vue')
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
