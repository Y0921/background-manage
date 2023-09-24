import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './router'
import ElementPlus from 'element-plus'
import store from './store'
import 'element-plus/dist/index.css'
//全局引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入css工具库
import 'virtual:windi.css'
//全局前置守卫
import './permission'
//引入nprogress的css
import 'nprogress/nprogress.css'
const app=createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
import permission from './directives/permission.js'
app.use(permission)
app.mount('#app')
