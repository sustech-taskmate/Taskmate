import {createRouter, createWebHashHistory, NavigationGuardNext, RouteLocationNormalized, createMemoryHistory} from 'vue-router'
import {App} from "vue";

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../view/Index.vue'),
        beforeEnter: ((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            if (localStorage.getItem('token')) {
                next()
            } else {
              next({
                name: 'empty',
              })
            }
        })
    },
    {
        path: '/loading',
        name: 'loading',
        component: () => import('../view/Loading.vue')
    },
    {
        path: '/empty',
        name: 'empty',
        component: () => import('../view/Empty.vue')
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

]
const routerHistory = createMemoryHistory();
export const router = createRouter({
  // history: createWebHashHistory(),
  history: routerHistory,
  routes,
  scrollBehavior: () => ({left:0, top:0})
})

export async function setupRouter(app: App) {
    app.use(router);
    await router.isReady();
}
