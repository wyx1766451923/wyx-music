import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import videoPlay from 'vue3-video-play' // 引入组件 
import 'vue3-video-play/dist/style.css' // 引入css 

const app = createApp(App)
app.use(createPinia())
app.use(videoPlay)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
