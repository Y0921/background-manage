<template>
     <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <AsideList 
            :active="activeId==item.id"
             v-for="(item,index) in list" 
             :key="index" 
             @edit="handleEdit(item)"
             @delete="handleDelete(item.id)"
             @click="handleChangeActiveId(item.id)"
             >
                {{item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev ,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"></el-pagination>
        </div>
     </el-aside>
     <form-draw ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
    </form-draw>

</template>
<script setup>
import AsideList from './AsideList.vue'
import FormDraw from '../../components/FormDraw.vue';
import {ref,reactive,computed} from 'vue'
import {getImageClassList,createImageClassList,updateImageClassList,deleteImageClassList} from '../../api/image_class.js'
import {toast} from '../../composables/util.js'
//加载
const loading=ref(false)
const list=ref([])
//选中图库分类id
const activeId=ref(0);
const formDrawerRef=ref(null)
const drawerTitle=computed(()=>
    EditId.value? "修改":'新增'
)
//分页
const currentPage=ref(1);
const total=ref(0)
const limit=ref(10)

const EditId=ref(0)
const emit=defineEmits(["change"])
//获取数据
function getData(p=null){
    if(typeof(p)=='number'){
        currentPage.value=p
    }
    loading.value=true
    getImageClassList(currentPage.value).then(res=>{
        total.value=res.totalCount
        list.value=res.list
        let item=list.value[0]
        if(item){
            handleChangeActiveId(item.id)
        }
    })
    loading.value=false
}
getData()
const handleCreate=()=>{
    EditId.value=0
    form.name=''
    form.order=50
    formDrawerRef.value.open()
}
const form=reactive({
    name:'',
    order:50
})
const formRef=ref(null)
const handleSubmit=()=>{
   formRef.value.validate((valid)=>{
    if(!valid) return
    formDrawerRef.value.showLoading()
    const fun=EditId.value?updateImageClassList(EditId.value,form):createImageClassList(form)
    fun.then(res=>{
        toast(drawerTitle.value+'成功')
        getData(EditId.value?currentPage.value:1)
        formDrawerRef.value.close()
    }).finally(()=>{
        formDrawerRef.value.hideLoading()
})
   })
}
const handleEdit=(item)=>{
    EditId.value=item.id
    form.name=item.name
    form.order=item.order
    formDrawerRef.value.open()
}
const handleDelete=(id)=>{
    loading.value=true
    deleteImageClassList(id).then(res=>{
        toast('删除成功')
        getData()
    }
    ).finally(()=>{
        loading.value=false
    })

}
//切换分类
function handleChangeActiveId(id){
activeId.value=id
//自动获取该图库下的所有图片
emit("change",id)
}
const rules={
    name:[
        {
            required:true,
            message:'图库分类名称不能为空',
            trigger:'blur'
        }
    ],
}
defineExpose({
    handleCreate
})
</script>
<style scoped>
.image-aside{
border-right:1px solid #eee;
position: relative;
}
.image-aside .top{
    position:absolute;
    top:0;
    right:0;
    left:0;
    bottom:50px;
    overflow-y:auto;
}
.image-aside .bottom{
    position:absolute;
    height:50px;
    right:0;
    left:0;
    bottom:0;
@apply flex items-center justify-center;
}
</style>