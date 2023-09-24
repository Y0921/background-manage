//自定义指令

import store from '../store/index.js'
function hasPermission(value,el=false){
    if(!Array.isArray(value)){
        throw new Error(`需要配置权限,例如v-permission="['getStatucs3,GET']"`)
    }
      const hasAuth=  value.findIndex(v=>store.state.ruleNames.includes(v))!=-1
      if(el&&!hasAuth){
        el.parentNode&&el.parentNode.removeChild(el)//找到父元素移除该节点
      }
    return hasAuth
}
export default{
    install(app){
       app.directive("permission",{
        mounted(el,binding){
          hasPermission(binding.value,el)
        }
       })

    }
}