<template>
    <el-drawer title="设置轮播图" v-model="dialogVisable" size="50%"
        :destroy-on-close="true" >
        <el-form :model="form" label-width="80px" >
            <el-form-item label="轮播图">
                <chooseImage  :limit="9" v-model="form.banners"></chooseImage>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
        
    </el-drawer>
    
</template>
<script setup>
import {ref,reactive} from 'vue'
import chooseImage from '../../components/chooseImage.vue'
import {readGoods,setGoodsBanner} from '../../api/goods.js'
import {toast} from '../../composables/util'
const dialogVisable=ref(false)
const form=reactive({
    banners:[]
})

const goodsId=ref(0)
const open=(row)=>{
    goodsId.value=row.id
    row.bannersLoading=true
    readGoods(goodsId.value).then((res)=>{
        dialogVisable.value=true
        form.banners=res.goodsBanner.map(o=>o.url)
    }).finally(()=>{
        row.bannersLoading=false
    })
}
const loading=ref(false)
const emit=defineEmits(["reloadData"])
const submit=()=>{
    loading.value=true
setGoodsBanner(goodsId.value,form).then(res=>{
    toast("设置轮播图成功！")
    dialogVisable.value=false
    emit("reloadData")
}).finally(()=>{
    loading.value=false
})
}
defineExpose({
    open
})
</script>