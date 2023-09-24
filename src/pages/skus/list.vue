<template>
    <div>
      <el-card shadow="never" class="border-0">
        <ListHeader layout="create,refresh,delete" @create="handleCreate" @refresh="getData" @delete="handleMultiDelete"/>
        
        <el-table
        ref="multiTableRef"
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="规格名称" />
          <el-table-column prop="default" label="规格值" width="380" />
          <el-table-column prop="order" label="排序" width="380" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange($event, row)"
                :loading="row.statusLoading"
                :disabled="row.super == 1"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template #default="scope">
              <el-button
                text
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <span @click.stop="() => {}">
                <el-popconfirm
                  title="是否要删除该记录？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelete(scope.row.id)"
                >
                  <template #reference>
                    <el-button text type="primary" size="small"> 删除 </el-button>
                  </template>
                </el-popconfirm>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex items-center justify-center mt-5">
          <el-pagination
            background
            layout="prev,pager,next"
            :total="total"
            :current-page="currentPage"
            :page-size="limit"
            @current-change="getData"
          ></el-pagination>
        </div>
        <FormDraw ref="FormDrawerRef" :title="DrawerTitle" @submit="handleSubmit" destroyOnClose>
          <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="80px"
            :inline="false"
          >
            <el-form-item label="规格名称" prop="name">
              <el-input v-model="form.name" placeholder="规格名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
             <el-input-number v-model="form.order" :size="small" :min="0" :max="1000">
             </el-input-number>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="规格值" prop="default">
                {{ form.default }}
                <TagInput v-model="form.default"></TagInput>
            </el-form-item>
          </el-form>
        </FormDraw>

      </el-card>
    </div>
  </template>
    <script setup>
  import {
    createSkus,deleteSkus,updateSkus,updateSkusStatus,getSkusList
  } from "../../api/skus.js";
  import FormDraw from "../../components/FormDraw.vue";
  import { useInitTable, useInitForm } from "../../composables/useCommon.js";
  import ListHeader from "../../components/ListHeader.vue";
  import TagInput from '../../components/TagInput.vue'
  import { ref } from "vue";
  import { toast } from "../../composables/util";
  const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    multiTableRef,
    handleMultiDelete,
    handleSelectionChange
  } = useInitTable({
    getList: getSkusList,
    delete: deleteSkus,
    updateStatus: updateSkusStatus
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
      status: 1,
      default:'',
      order:50
    },
    rules: {
      name: [
        {
          required: true,
          message: "规格名称不能为空",
          trigger: "blur",
        },
      ],
       default: [
        {
          required: true,
          message: "规格值不能为空",
          trigger: "blur",
        },
      ],
    },
    update:updateSkus,
    create:createSkus,
    getData,
  });

  getData()

  </script>