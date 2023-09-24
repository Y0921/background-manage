import { ref } from "vue";
import {useRouter,useRoute,onBeforeRouteUpdate} from 'vue-router'
import {useCookies} from '@vueuse/integrations/useCookies'
export function useTabList(){
const route=useRoute();
const router=useRouter();
const cookie=useCookies();
const activeTab = ref(route.path);
const tabList = ref([
  {
    title: "后台首页",
    path:'/'
  },
]);
const removeTab = (t) => {
    let tabs=tabList.value
    let a=activeTab.value
    if(a==t){
        tabs.forEach((tab,index)=>{
            if(tab.path==t){
                const nextTab=tabs[index+1]||tabs[index-1]
                if(nextTab){
                    a=nextTab.path
                }
            }
        })
    }
    activeTab.value=a
    tabList.value=tabList.value.filter(tab=>tab.path!=t)
    cookie.set("tabList",tabList.value)
 
};
const changeTab=(t)=>{
    activeTab.value=t
    router.push(t)
}
//添加标签导航
function addTab(tab){
   let notab= tabList.value.findIndex(t=>t.path==tab.path)==-1
   if(notab){
    tabList.value.push(tab)
    cookie.set("tabList",tabList.value)
   }

}
//初始化标签导航
function initTabList(){
    let tab=cookie.get("tabList")
    if(tab){
        tabList.value=tab
    }
}
//初始化标签导航
initTabList()
onBeforeRouteUpdate((to,from)=>{
    activeTab.value=to.path;
    addTab({
    title:to.meta.title,
    path:to.path
})
})
//
const handleClose=(e=>{
    if(e=='clearAll'){
        activeTab.value="/"
        tabList.value=[{
            title:'后台首页',
            path:'/'
        }]
    }else if(e=='clearOther'){
        tabList.value=tabList.value.filter(tab=>tab.path=="/"||tab.path==activeTab.value)
    }
    cookie.set("tabList",tabList.value)
})
return{
    activeTab,
    tabList,
    removeTab,
    changeTab,
    handleClose
}

}