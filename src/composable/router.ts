import type {RouteLocationRaw} from "vue-router";
import {useRouter} from 'vue-router';
import {router as globalRouter} from "@/router";


export default {
    useRouterPush
}
export function useRouterPush(inSetup = false) {
    const router = inSetup ? useRouter() : globalRouter;

    function routerPush(to: RouteLocationRaw) {
        return router.push(to);
    }

    function routerBack() {
        router.go(-1);
    }

    function toRoot() {
        router.replace({name: 'index'})
    }

    return {
        routerPush,
        routerBack,
        toRoot,
    }
}
