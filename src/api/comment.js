import axios from '../axios.js'
import {queryParams}from '../composables/util.js'
//获取管理员列表
export function getGoodsCommentList(page,query={
}){
   let r=queryParams(query)
   return axios.get(`/admin/goods_comment/${page}${r}`)
}
export function createGoodsComment(data){
   return axios.post(`/admin/goods_comment`,data)
}
export function updateGoodsComment(id,data){
   return axios.post(`/admin/goods_comment/${id}`,data)
}
export function deleteGoodsComment(id){
   return axios.post(`/admin/goods_comment/${id}/delete`)
}
export function updateGoodsCommentStatus(id,status){
   return axios.post(`/admin/goods_comment/${id}/update_status`,{status})
}
export function reviewGoodsComment(id,data){
    return axios.post(`/admin/goods_comment/review/${id}`,{data})
 }