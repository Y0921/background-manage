import axios from 'axios'
import {toast } from './composables/util'//引入通知
import {getToken} from './composables/auth'
import store from './store'
const service=axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API
})
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 往请求头加入token
    const token=getToken("admin-token");
    if(token){
        config.headers["token"]=token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
  }, function (error) {
    console.log(error)
    const msg=error.response.data.msg||'请求失败';
    if(msg=="非法token,请先登录！"){
      store.dispatch("logout").finally(()=>{
        location.reload();
      })
    }
    toast(msg,"error")
    return Promise.reject(error);
  });
export default service;