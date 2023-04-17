import {defineStore} from 'pinia';
import {useRouterPush} from '@/composable';
import type {RouteLocationNormalizedLoaded} from "vue-router";
import {getIndexInTabRoutes, getIndexInTabRoutesByRouteName, getTabRouteByVueRoute, isInTabRoutes} from './helper';
import {App} from "@/typing/system";

interface TabState {
    /** 多页签数据 */
    tabs: App.AssignTabRoute[];
    /** 多页签首页 */
    homeTab: App.AssignTabRoute;
    /** 当前激活状态的页签(路由fullPath) */
    activeTab: string;
}

export const useTabStore = defineStore('tab-store', {
    state: (): TabState => ({
        tabs: [],
        homeTab: {
            name: 'empty',
            fullPath: '/Main/Homework/Assign/file',
            meta: {
                title: 'empty'
            },
            scrollPosition: {
                left: 0,
                top: 0
            }
        },
        activeTab: ''
    }),
    getters: {
        activeTabIndex(state) {
            const {tabs, activeTab} = state
            return getIndexInTabRoutes(tabs, activeTab)
        }
    },
    actions: {
        setActiveTab(fullPath: string) {
            this.activeTab = fullPath
        },
        setActiveTabTitle(title: string) {
            const item = this.tabs.find(tab => tab.fullPath == this.activeTab)
            if (item) {
                item.meta.title = title
            }
        },
        addTab(route: RouteLocationNormalizedLoaded) {
            const tab = getTabRouteByVueRoute(route);
            if (isInTabRoutes(this.tabs, tab.fullPath)) {
                return;
            }

            const index = getIndexInTabRoutesByRouteName(this.tabs, route.name as string);

            if (index === -1) {
                this.tabs.push(tab);
                return;
            }

            const {multiTab = false} = route.meta;
            if (!multiTab) {
                this.tabs.splice(index, 1, tab);
                return;
            }

            this.tabs.push(tab);
        },
        async removeTab(fullPath: string) {
            const {routerPush} = useRouterPush(false);

            const isActive = this.activeTab === fullPath;
            const updateTabs = this.tabs.filter(tab => tab.fullPath !== fullPath);
            if (!isActive) {
                this.tabs = updateTabs;
            }
            if (isActive && updateTabs.length) {
                const activePath = updateTabs[updateTabs.length - 1].fullPath;
                const navigationFailure = await routerPush(activePath);
                if (!navigationFailure) {
                    this.tabs = updateTabs;
                    this.setActiveTab(activePath);
                }
            }
        },
        async clearTab(excludes: string[] = []) {
            const {routerPush} = useRouterPush(false);

            const homePath = this.homeTab.fullPath;
            const remain = [homePath, ...excludes];
            const hasActive = remain.includes(this.activeTab);
            const updateTabs = this.tabs.filter(tab => remain.includes(tab.fullPath));
            if (hasActive) this.tabs = updateTabs;
            if (!hasActive && updateTabs.length) {
                const activePath = updateTabs[updateTabs.length - 1].fullPath;
                const navigationFailure = await routerPush(activePath);
                if (!navigationFailure) {
                    this.tabs = updateTabs;
                    this.setActiveTab(activePath);
                }
            }
        },
        clearLeftTab(fullPath: string) {
            const index = getIndexInTabRoutes(this.tabs, fullPath);
            if (index > -1) {
                const excludes = this.tabs.slice(index).map(item => item.fullPath);
                this.clearTab(excludes);
            }
        },
        clearRightTab(fullPath: string) {
            const index = getIndexInTabRoutes(this.tabs, fullPath);
            if (index > -1) {
                const excludes = this.tabs.slice(0, index + 1).map(item => item.fullPath);
                this.clearTab(excludes);
            }
        },
        clearAllTab() {
            this.clearTab();
        },
        async handleClickTab(fullPath: string) {
            const {routerPush} = useRouterPush(false);

            const isActive = this.activeTab === fullPath;
            if (!isActive) {
                const navigationFailure = await routerPush(fullPath);
                if (!navigationFailure) this.setActiveTab(fullPath);
            }
        },
        iniTabStore(currentRoute: RouteLocationNormalizedLoaded) {
            const tabs: App.AssignTabRoute[] = [];

            const hasHome = getIndexInTabRoutesByRouteName(tabs, this.homeTab.name as string) > -1;
            if (!hasHome && this.homeTab.name !== 'empty') {
                tabs.unshift(this.homeTab);
            }

            const isHome = currentRoute.fullPath === this.homeTab.fullPath;
            if (!isHome) {
                const currentTab = getTabRouteByVueRoute(currentRoute);
                const hasCurrent = isInTabRoutes(tabs, currentRoute.fullPath);
                if (!hasCurrent) {
                    tabs.push(currentTab);
                }
            }

            this.tabs = tabs;
            this.setActiveTab(currentRoute.fullPath);
        }
    }
})