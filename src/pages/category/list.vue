<template>
    <!--商品分类模块-->
    <el-card shadow="never" class="border-0">
      <ListHeader @create="handleCreate" @refresh="getData" />
      <el-tree
        :data="tableData"
        :props="{ label: 'name', children: 'child' }"
        v-loading="loading"
        node-key="id"
      >
        <template #default="{ data }">
          <div class="custom-tree-node">
            <span>{{ data.name }}</span>
            <div class="ml-auto">
                <el-button text type="primary" size="small" @click="openGoodsDrawer(data)" :loading="data.GoodsDrawerLoaing">推荐商品</el-button>
              <el-switch
                :modelValue="data.status"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
              <el-button
                text
                type="primary"
                size="small"
                @click.stop="handleEdit(data)"
                @change="handleStatusChange($event,data)"
                >修改</el-button
              >
                            <el-popconfirm
                  title="是否要删除该分类？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelete(data.id)"
                >
                  <template #reference>
                    <el-button text type="primary" size="small">删除</el-button>  </template>
                </el-popconfirm>
            </div>
          </div>
        </template>
      </el-tree>
      <FormDraw ref="FormDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
        <el-form
          :model="form"
          ref="formRef"
          label-width="80px"
          :inline="false"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
  
          
        </el-form>
      </FormDraw>
      <GoodsDrawer ref="GoodsDrawerRef"/>
    </el-card>
  </template>
  <script setup>
  import FormDraw from "../../components/FormDraw.vue";
  import ListHeader from "../../components/ListHeader.vue";
  import GoodsDrawer from "./components/GoodsDrawer.vue";
  import {ref} from 'vue'
  import { getCategoryList, createCategory, updateCategory,updateCategoryStatus,deleteCategory } from "@/api/category";
  import { useInitTable, useInitForm } from "@/composables/useCommon.js";
  const { loading, tableData, getData,handleDelete,handleStatusChange } = useInitTable({
    getList: getCategoryList,
    delete:deleteCategory,
    updateStatus:updateCategoryStatus,
    onGetListSuccess: (res) => {
      tableData.value = res.map(o=>{
        o.GoodsDrawerLoaing=false;
        return o;
      })
    },
  });
  const {
    FormDrawerRef,
    formRef,
    form,
    DrawerTitle,
    handleCreate,
    handleEdit,
    handleSubmit,
  } = useInitForm({
    form: {
      name: "",
    },
    rules: {},
    update: updateCategory,
    create: createCategory,
    getData,
  });

  const GoodsDrawerRef=ref(null)

  const openGoodsDrawer=(data)=>{
  GoodsDrawerRef.value.open(data)
  }
  getData()
  </script>
  <style scoped>

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree-node__content {
    padding: 20px 0;
  }
  </style>