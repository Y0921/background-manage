import {useCookies} from '@vueuse/integrations/useCookies'
const TokenKey="admin-token"
const cookie=useCookies()
//获取token
export function getToken(){
    return cookie.get(TokenKey);
}
//设置token
export function setToken(Token){
    return cookie.set(TokenKey,Token)
}
//清楚token
export function removeToken(){
    return cookie.remove(TokenKey)
}
