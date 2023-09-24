import {createStore} from 'vuex'
import {getinfo} from '../api/manager'
import {setToken,removeToken} from '../composables/auth'
import {login} from '../api/manager'
const store=createStore({
    state(){
        return{
          user:{}//用户信息
          ,
          asideWidth:"250px"//侧边宽度
          ,menus:[]
          ,ruleNames:[]
        }
    },
    mutations:{
        //设置用户信息
        SET_USERINFO(state,user){
            state.user=user
        },
        //展开/缩起侧边栏
        handleAsideWidth(state){
            state.asideWidth=state.asideWidth=="250px"?"64px":"250px"
        },
        SET_MENUS(state,menus){
            state.menus=menus
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames=ruleNames
        }
    },
    actions:{
        //登录
        login({commit},{username,password}){
            return new Promise((resolve,reject)=>{
                login(username,password).then(res=>{
                    //存储token(使用cookie)
                      setToken(res.token)
                      resolve(res)
                }).catch(err=>{
                    reject(err)
                })

            })
        },
        //获取当前登录用户信息
        getinfo({commit}){
            return new Promise((resolve,reject)=>{
                getinfo().then(res=>{
                    commit("SET_USERINFO",res)
                    commit("SET_MENUS",res.menus)
                    commit("SET_RULENAMES",res.ruleNames)
                    resolve(res)
                }).catch(err=>reject(err))
            })
        },
        //退出登录
        logout({commit}){
            //移除cookie里的token
            removeToken()
            //清楚当前用户的状态 vuex
            commit('Set_USERINFO',{})
        }
    }
})
export default store;