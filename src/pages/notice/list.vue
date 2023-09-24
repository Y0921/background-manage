<template>
  <div>
    <el-card shadow="never" class="border-0">
      <ListHeader @create="handleCreate" @refresh="getData"/>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="create_time" label="发布时间" width="380" />
        <el-table-column label="操作" width="180" align="center">
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
                title="是否要删除该公告？"
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
      <FormDraw ref="FormDrawerRef" :title="DrawerTitle" @submit="handleSubmit">
        <el-form
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
        >
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="公告标题"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input
              v-model="form.content"
              placeholder="公告内容"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
      </FormDraw>
    </el-card>
  </div>
</template>
<script setup>
import {
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../api/notice.js";
import FormDraw from "../../components/FormDraw.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon.js";
import ListHeader from "../../components/ListHeader.vue";

const { tableData, loading, currentPage, total, limit, getData,handleDelete } = useInitTable(
  {
    getList: getNoticeList,
    delete:deleteNotice
  }
);

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
    title: "",
    content: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "公告标题不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "公告内容不能为空",
        trigger: "blur",
      },
    ],
  },
  update: updateNotice,
  create: createNotice,
  getData,
});
getData()
</script>