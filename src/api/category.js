import axios from '../axios.js'

export function getCategoryList(){
    return axios.get(`/admin/category`)
}
export function createCategory(data){
    return axios.post('/admin/category',data)
}
export function updateCategory(id,data){
    return axios.post('/admin/category/'+id,data)
}
export function deleteCategory(id){
    return axios.post(`/admin/category/${id}/delete`)
 }
 export function updateCategoryStatus(id,status){
    return axios.post(`/admin/category/${id}/update_status`,{status})
 }
 //推荐商品
 export function getCategoryGoods(id){
    return  axios.get(`/admin/app_category_item/list?category_id=${id}`)
}
//删除关联商品

export function deleteCategoryGoods(id,status){
    return axios.post(`/admin/app_category_item/${id}/delete`)
 }
