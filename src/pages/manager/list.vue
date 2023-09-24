<template>
  <div>
    <el-card shadow="never" class="border-0">
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <SearchItem label="关键词">
          <el-input
                v-model="searchForm.keyword"
                placeholder="管理员昵称"
                clearable
              ></el-input>
        </SearchItem>
      </Search>

     <ListHeader @create="handleCreate" @refresh="getData"/>


      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="管理员" width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
            </div>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="所属角色" align="center">
          <template #default="{ row }">
            {{ row.role?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event,row)"
              :loading="row.statusLoading"
              :disabled="row.super==1"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <small v-if="scope.row.super==1" class="text-sm text-gray-500">暂无操作</small>
            <div v-else>
            <el-button
              text
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >修改
              </el-button>
            <span @click.stop="() => {}">
              <el-popconfirm
                title="是否要删除该管理员？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button text type="primary" size="small"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </span>
        </div>
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
                    <el-form :model="form" ref="formRef" label-width="80px" :inline="false" >
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" placeholder="用户名"></el-input>
                        </el-form-item>

                        <el-form-item label="密码" prop="password" >
                            <el-input v-model="form.password"  placeholder="密码" :rows="5"></el-input>
                        </el-form-item>

                        <el-form-item label="头像" prop="avatar" >
                           
                            <chooseImage v-model="form.avatar"/>
                        </el-form-item>

                        <el-form-item label="所属角色" prop="role_id" >
                            <el-select v-model="form.role_id"  placeholder="选择所属角色">
                                <el-option v-for="item in roles"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            
                        </el-form-item>

                        <el-form-item label="状态" prop="status" >
                            <el-switch v-model="form.status" :active-value="1" :inactive-value="0" @change="handle">
                            </el-switch>
                            

                        </el-form-item>
                       
                    </el-form>
                    
                    </FormDraw>
                      
    </el-card>
  </div>
</template>
<script setup>
import FormDraw from "../../components/FormDraw.vue";
import ListHeader from "../../components/ListHeader.vue";
import {ref} from 'vue'
import chooseImage from'../../components/chooseImage.vue';
import {getManagerList,updateManagerStatus,createManager,updateManager,deleteManager } from "../../api/manager.js";
import {useInitTable,useInitForm}from '../../composables/useCommon.js'
import SearchItem from "../../components/SearchItem.vue";
import Search from "../../components/Search.vue";
const roles = ref(null)
const{
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
  handleStatusChange,
}=useInitTable({
  getList: getManagerList,
  updateStatus:updateManagerStatus,
  delete:deleteManager,
  searchForm:{
    keyword:''
  },
  onGetListSuccess:(res)=>{
    tableData.value = res.list.map(o=>{
                o.statusLoading=false
                return o;
              });
              total.value = res.totalCount;
              roles.value=res.roles
  }
})

const{
  DrawerTitle,
        FormDrawerRef,
        formRef,
        form,
        handleCreate,
        handleEdit,
        handleSubmit,
}=useInitForm({
  form:{
        username: "",
        password: "",
        role_id: null,
        status: 1,
        avatar: ""
  },
  update:updateManager,
  create:createManager,
  getData
})
</script>