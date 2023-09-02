# vue3后台管理系统

#### 介绍
这是一个基于Vue3+ElementPlus+Vite开发的一个前后端分离的商城后台管理项目，该项目可以实现多权限管理，商品多规格实现，订单发货，导出订单，图库模块，分销模块，分享海报以及部署服务器上线等

#### 软件架构
![总架构](https://github.com/Y0921/background-manage/assets/126882681/8912f405-353a-441d-9edf-784e03dbb81a)
![api](https://github.com/Y0921/background-manage/assets/126882681/cde13dd1-ff39-4cb4-8443-006860aa3cf2)
![component](https://gitee.com/Y0622/vue3-backend-management-system/raw/master/public/desc/component.png)
![composables](https://gitee.com/Y0622/vue3-backend-management-system/raw/master/public/desc/composables.png)
![page](https://gitee.com/Y0622/vue3-backend-management-system/raw/master/public/desc/page.png)
![layout](https://gitee.com/Y0622/vue3-backend-management-system/raw/master/public/desc/layouts.png)
#### 安装教程

1.  初始化项目：

```
npm init vite@latest <background-manage> -- --template vue
```

2.  项目运行

```
cd background-manage
npm install 
npm run dev
```

3.  工具库的安装：

- 安装element-plus 组件库：`npm install element-plus --save`
- 安装windicss 工具库：`npm i -D vite-plugin-windicss windicss`
- 安装vue-router 路由:`npm install vue-router@4`
- 安装组件库所有图标：`npm install @element-plus/icons-vue@2`
- 安装axios请求库 : `npm install axios`
- 安装vuex状态管理工具:`npm install vuex@4`
- 安装vueuse组合式api类库：`install npm install vueuse/core@10`
- 安装echarts图表:`npm install echarts@5`


#### 使用说明

1.  配置src文件别名：vite.config.js中

```
export default defineConfig({
  resolve:{//配置文件路径
    alias:{
      "@":path.resolve(__dirname,"src")
    }
  },
.....
}
```
2.  配置路由：
- 创建路由实例：调用vue-router中的createRouter函数，传入参数配置，是个对象包含history和routes配置（本项目采用的是hash#模式 使用 createWebHashHistory)

```
import {createRouter,createWebHashHistory} from 'vue-router'
```
- 定义路由数组
- 将创建好的路由实例导出：

```
export const router=createRouter({
    history:createWebHashHistory(),
    routes
})
```
- 在挂载在vue根实例上 ：main.js中

```
import {router} from './router'
...
app.use(router)
....
```
- app.vue中：

```
<router-view></router-view>
```

- 动态路由匹配：routes中：404 Not Found 路由匹配规则

```
{
        path:'/:pathMatch(.*)*',
        name:'NotFound',
        component:NotFound,
        meta:{
            title:'NotFound'
        }
    }
```

