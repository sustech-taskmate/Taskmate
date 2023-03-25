import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import router from './router'
import store from './store'
import Ele from 'element-plus'
import 'element-plus/dist/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

createApp(App).use(store).use(Ele).use(router).use(VueVideoPlayer).mount('#app')
