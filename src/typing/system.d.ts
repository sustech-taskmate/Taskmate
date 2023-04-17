import type {AssignFile} from "@/store/assign";
import {AssignFileType} from "@/store/assign";

declare namespace App {
    type AssignMenu = {
        index: string // path/name
        name: string
        format: AssignFileType
    }

    interface AssignTabRoute
        extends Pick<import('vue-router').RouteLocationNormalizedLoaded, 'name' | 'fullPath' | 'meta'> {
        scrollPosition: {
            left: number
            top: number
        };
    }
}