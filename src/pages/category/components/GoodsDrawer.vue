<template>
    <FormDraw ref="formDrawerRef" title="推荐商品">
        <el-table :data="tableData" border stripe style="width:100%;">
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true"
                    style="width: 64px;height: 64px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column label="操作">
                <template #default='{row}'>
                <el-popconfirm
                  title="是否要删除该分类？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelete(row)"
                >
                <template #reference>
                    <el-button type="primary" text size="small" :loading="row.loading">删除</el-button>
                </template>
                </el-popconfirm>
            </template>
            </el-table-column>
        </el-table>
        
    </FormDraw>
</template>
<script setup>
import { ref } from "vue"
import FormDraw from "../../../components/FormDraw.vue";
import { toast } from "../../../composables/util";
import {
    getCategoryGoods,
    deleteCategoryGoods,
} from "@/api/category.js"

const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
//打开formdrawer弹框
const open = (item)=>{
 category_id.value = item.id
 item.GoodsDrawerLoaing=true
    getData().then(res=>formDrawerRef.value.open()).finally(
        ()=>{
            item.GoodsDrawerLoaing=false
        }
    )
    
}
function getData(){
    return getCategoryGoods(category_id.value).then((res)=>{
        tableData.value = res.map(o=>{
        o.GoodsDrawerLoaing=false;
        return o;
      })
    }
        )
}
const handleDelete=(row)=>{
    row.loading=true
deleteCategoryGoods(row.id).then(res=>{
    toast('删除成功');
    getData()
}).finally(()=>
{
    row.loading=false
}
)
}
defineExpose({
    open
})
</script>
