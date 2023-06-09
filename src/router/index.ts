import {createMemoryHistory, createRouter, NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {App} from "vue";
import {login} from "@/composable/serverRequest";

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../view/Index.vue'),
        beforeEnter: (async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const token = localStorage.getItem('token')
            if (token) {
                const res = await login(token)
                if (res) {
                    next()
                } else {
                    next({
                        name: 'empty',
                    })
                }
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
        path: '/upload/s/:cid',
        name: 'upload',
        component: () => import('../view/Submit.vue')
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
    scrollBehavior: () => ({left: 0, top: 0})
})

export async function setupRouter(app: App) {
    app.use(router);
    await router.isReady();
}
