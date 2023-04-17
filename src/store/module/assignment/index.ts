import {defineStore} from "pinia";
import {AssignFile} from "@/store/assign";

interface assignmentFile {
    files: AssignFile[]
}

export const useAssignStore = defineStore('assign-store', {
    state: (): assignmentFile => ({
        files: []
    }),
    actions: {

    }
})