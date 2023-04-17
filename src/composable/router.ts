import type {RouteLocationRaw} from "vue-router";
import {useRouter} from 'vue-router';
import {router as globalRouter} from "@/router";

export function useRouterPush(inSetup = false) {
    const router = inSetup ? useRouter() : globalRouter;
    const route = globalRouter.currentRoute;

    function routerPush(to: RouteLocationRaw) {
        return router.push(to);
    }

    function routerBack() {
        router.go(-1);
    }

    function toRoot() {
        routerPush({name: 'root'});
    }

    return {
        routerPush,
        routerBack,
        toRoot,
    }
}