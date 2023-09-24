import axios from '../axios.js'
//规格管理
export function getSkusList(page){
    return axios.get(`/admin/skus/${page}`)
}
export function createSkus(data){
    return axios.post('/admin/skus',data)
}
export function updateSkus(id,data){
    return axios.post('/admin/skus/'+id,data)
}
export function deleteSkus(ids){
    return axios.post('/admin/skus/delete_all',{ids})
}
export function updateSkusStatus(id,status){
    return axios.post(`/admin/skus/${id}/update_status`,{status})
 }
