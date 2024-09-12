import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

const app = createApp(App)

let title = document.createElement("title");
title.innerHTML = "编程技术分享";
document.head.appendChild(title)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
  })

app.mount('#app')
