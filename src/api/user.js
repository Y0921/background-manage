import axios from '../axios.js'
import {queryParams}from '../composables/util.js'
export function getUserList(page,query={
}){
   let r=queryParams(query)
   return axios.get(`/admin/user/${page}${r}`)
}
export function createUser(data){
   return axios.post(`/admin/user`,data)
}
export function updateUser(id,data){
   return axios.post(`/admin/user/${id}`,data)
}
export function deleteUser(id){
   return axios.post(`/admin/user/${id}/delete`)
}
export function updateUserStatus(id,status){
   return axios.post(`/admin/user/${id}/update_status`,{status})
}