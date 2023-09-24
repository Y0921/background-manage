import {router,addRoutes} from './router'
import {getToken} from "./composables/auth"
import {hideFullLoading, toast,showFullLoading} from './composables/util'
import store from './store'
//全局前置守卫
let hasGetInfo=false
router.beforeEach(async(to,from,next)=>{
    //显示loading
    showFullLoading()
    const token=getToken();
//如果用户没有登录并且想要跳转非登录页面,那么强制用户回跳转登录页
if(!token&&to.path!="/login"){
    toast("请先登录","error")
    return next({path:'/login'})
}
//防止重复登录
if(token&&to.path=="/login"){
    toast("请勿重复登录","error")
    return next({path:from.path?from.path:'/'})
}
let hasNewRoutes=false
//如果用户登陆了，自动获取用户信息，并且存储在vuex当中
if(token &&!hasGetInfo){
   let {menus}=await store.dispatch("getinfo")
   hasGetInfo=true
   //动态添加路由
   hasNewRoutes=addRoutes(menus)
}
//设置页面标题
let title=(to.meta.title?to.meta.title:"")+"-后台管理系统"
document.title=title;
hasNewRoutes ? next(to.fullPath):next()
})

//全局后置守卫
router.afterEach((to,from)=>{
    hideFullLoading();
})