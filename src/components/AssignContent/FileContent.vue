<template style="display: flex">
    <div v-if="format===AssignFileType.txt" class="txt">
        {{ data }}
    </div>
    <div v-if="format===AssignFileType.pdf" style="height: 100%;width: 100%;overflow-y: auto">
        <vue-pdf-embed style="width: 98%; height: 100%;"
                       :source="url"/>
    </div>
    <iframe v-if="format===AssignFileType.office" style="width: 100%; height: 100%;" :src="url"/>
    <div style="height: 100%;" v-if="format===AssignFileType.image">
        <el-image
            ref="image"
            lazy
            class="image"
            :src="url"
            :preview-src-list="[url]"
            style="align-items: center;justify-content: center"
        />
    </div>
    <v-md-preview :text="data" v-if="format===AssignFileType.markdown" class="md"/>
    <div v-if="format===AssignFileType.video" class="video-container">
        <video ref="videoPlayer" controls>
            <source :src="url" type="video/webm">
        </video>
    </div>
</template>

<script setup lang="ts">
import {AssignFileType, FileTo} from '@/store/assign';
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {decrypt} from "@/util";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {readBinaryFile} from "@tauri-apps/api/fs";
import VuePdfEmbed from 'vue-pdf-embed'


const route = useRoute()
const selectedFile = ref({} as FileTo)

let format = ref(AssignFileType.placeholder);
let url = ref("");
let data = ref("");
const videoSrc = ref("")

updateData()

async function updateData() {
    if (route.query.detail == null)
        return
    selectedFile.value = decrypt(route.query.detail as string) as FileTo;
    format.value = selectedFile.value.format;
    url.value = convertFileSrc(selectedFile.value.url);
    const file = await readBinaryFile(selectedFile.value.url);
    data.value = new TextDecoder('utf-8').decode(file);
    videoSrc.value = url.value
}

watch(
    () => route.query.detail,
    () => {
        if (route.query.detail != null)
            updateData()
    },
    {immediate: true}
)

</script>

<style scoped>

.txt {
    white-space: pre-wrap;
    text-align: left;
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
}

.md {
    text-align: left;
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
}

.video-container {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
}

.video-container video {
    width: 100%;
    height: auto;
}
</style>


