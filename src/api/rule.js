import axios from '../axios.js'

export function getRuleList(page){
    return axios.get(`/admin/rule/${page}`)
}
export function createRule(data){
    return axios.post('/admin/rule',data)
}
export function updateRule(id,data){
    return axios.post('/admin/rule/'+id,data)
}
export function deleteRule(id){
    return axios.post(`/admin/rule/${id}/delete`)
 }
 export function updateRuleStatus(id,status){
    return axios.post(`/admin/rule/${id}/update_status`,{status})
 }