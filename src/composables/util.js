import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'//引入通知
import nProgress from 'nprogress'
//消息提示
export function toast(message, type = "success", dangerouslyUseHtmlString = true) {
  ElNotification({
    message,
    type,
    duration: 1000
  })
}
//弹出提示框
export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type
    }
  )
}
//弹出输入框
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value

  })
}
//
//显示全屏loading
export function showFullLoading() {
  nProgress.start()
}
//隐藏全屏loading
export function hideFullLoading() {
  nProgress.done()
}
//将query对象转换成url参数
export function queryParams(query) {
  let q = []
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  let r = q.join('&')
  r = r ? "?" + r : ""
  return r

}
//上移
export function useArrayMoveUp(arr,index){
swapArray(arr,index,index-1)
}
//下移
export function useArrayMoveDown(arr,index){
swapArray(arr,index,index+1)
}
//调换数组索引的位置
function swapArray(arr,index1,index2){
  arr[index1]=arr.splice(index2,1,arr[index1])[0]
  return arr
}
// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function (a, b) {
      var ret = [];
      a.forEach(function (a) {
          b.forEach(function (b) {
              ret.push(a.concat([b]));
          });
      });
      return ret;
  }, [
      []
  ]);
}
