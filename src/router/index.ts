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
        path: '/class/:id',
        name: 'lmsClass',
        component: () => import('../view/LmsClassView.vue'),
        beforeEnter: requireLmsSession
    },
    {
        path: '/assignment/:id',
        name: 'lmsAssignment',
        component: () => import('../view/LmsAssignmentView.vue'),
        beforeEnter: requireLmsSession
    },
    {
        path: '/submission/:slug',
        name: 'lmsSubmission',
        component: () => import('../view/LmsSubmissionView.vue'),
        beforeEnter: requireLmsSession
    },
    {
        path: '/discussion/:threadId',
        name: 'lmsDiscussion',
        component: () => import('../view/LmsDiscussionView.vue'),
        beforeEnter: requireLmsSession
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
        redirect: (to: any) => ({name: 'lmsClass', params: {id: to.params.cid}})
    },
    {
        path: '/grade/t/:cid',
        name: 'teacherCourse',
        redirect: (to: any) => ({name: 'lmsClass', params: {id: to.params.cid}})
    },
    {
        path: '/grade/t/:cid/:aid',
        name: 'teacherAssign',
        redirect: (to: any) => ({name: 'lmsAssignment', params: {id: to.params.aid}})
    },
    {
        path: '/grade/t/:cid/:aid/statistics',
        name: 'statistics',
        redirect: (to: any) => ({name: 'lmsAssignment', params: {id: to.params.aid}})
    },
    {
        path: '/grade/t/:cid/:aid/:gid/file/',
        name: 'render',
        redirect: (to: any) => ({name: 'lmsSubmission', params: {slug: to.params.gid}})
    },
    {
        path: '/grade/t/:cid/:aid/:gid',
        name: 'grade',
        redirect: (to: any) => ({name: 'lmsSubmission', params: {slug: to.params.gid}})
    },

]

async function requireLmsSession(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const token = localStorage.getItem('token')
    if (token) {
        const res = await login(token)
        if (res) {
            next()
            return
        }
    }
    next({
        name: 'empty',
    })
}
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
