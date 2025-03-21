import './assets/main.css'
import { createApp } from 'vue'
import App from './views/App/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
app.use(pinia)

app.use(ElementPlus)

// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
