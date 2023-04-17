import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router';
import {App} from "@/typing/system";

export function getTabRouteByVueRoute(route: RouteRecordNormalized | RouteLocationNormalizedLoaded) {
    const fullPath = hasFullPath(route) ? route.fullPath : route.path;

    const tabRoute: App.AssignTabRoute = {
        name: route.name,
        fullPath: fullPath,
        meta: {
            title: route.name
        },
        scrollPosition: {
            left: 0,
            top: 0
        }
    };
    return tabRoute;
}

export function getIndexInTabRoutes(tabs: App.AssignTabRoute[], fullPath: string) {
    return tabs.findIndex(tab => tab.fullPath === fullPath);
}

export function isInTabRoutes(tabs: App.AssignTabRoute[], fullPath: string) {
    return getIndexInTabRoutes(tabs, fullPath) > -1;
}

export function getIndexInTabRoutesByRouteName(tabs: App.AssignTabRoute[], routeName: string) {
    return tabs.findIndex(tab => tab.name === routeName);
}

function hasFullPath(
    route: RouteRecordNormalized | RouteLocationNormalizedLoaded
): route is RouteLocationNormalizedLoaded {
    return Boolean((route as RouteLocationNormalizedLoaded).fullPath);
}


