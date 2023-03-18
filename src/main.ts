import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import router from './router'
import store from './store'
import Ele from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(store).use(Ele).use(router).mount('#app')
