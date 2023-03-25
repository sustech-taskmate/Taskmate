import {createApp} from "vue";
import "./styles.css";
import App from "./App.vue";
import router from './router'
import store from './store'
import Ele from 'element-plus'
import 'element-plus/dist/index.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

VMdPreview.use(vuepressTheme, {
    Prism,
});
VMdPreview.use(createLineNumbertPlugin())
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createEmojiPlugin());

createApp(App).use(VMdPreview).use(store).use(Ele).use(router).mount('#app')
