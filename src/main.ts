import {createApp} from "vue";
import "./styles.css";
import App from "./App.vue";
import {setupRouter} from './router'
import {setupStore} from './store'
import Ele from 'element-plus'
import 'element-plus/dist/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
// @ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// @ts-ignore
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// @ts-ignore
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// @ts-ignore
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// @ts-ignore
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
// @ts-ignore
import setupStyle from './assets/index';

async function setupApp() {
    setupStyle()

    VMdPreview.use(vuepressTheme, {
        Prism,
    })
    VMdPreview.use(createLineNumbertPlugin())
    VMdPreview.use(createCopyCodePlugin())
    VMdPreview.use(createEmojiPlugin())

    const app = createApp(App).use(VMdPreview).use(VueVideoPlayer).use(Ele)

    await setupStore(app)

    await setupRouter(app)

    app.mount('#app')
}

setupApp()


