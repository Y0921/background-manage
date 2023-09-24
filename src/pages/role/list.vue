<template>
  <div>
    <el-card shadow="never" class="border-0">
      <ListHeader @create="handleCreate" @refresh="getData" />
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="desc" label="角色描述" width="380" />
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
              @click="OpenSetRule(scope.row)"
              >配置权限</el-button
            >
            <el-button
              text
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <span @click.stop="() => {}">
              <el-popconfirm
                title="是否要删除该角色？"
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
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input
              v-model="form.desc"
              placeholder="角色描述"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </FormDraw>
      <!--权限配置-->
      <FormDraw
        ref="setRuleFormDrawerRef"
        title="权限配置"
        @submit="handleSetRuleSubmit"
      >
        <el-tree-v2
          ref="elTreeRef"
          :data="ruleList"
          :props="{ label: 'name', children: 'child' }"
          show-checkbox
          :height="treeHeight"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          @check="handleTreeCheck"
          :check-strictly="checkStrictly"
        >
          <template #default="{ data }">
            <div class="flex items-center">
              <el-tag :type="data.menu ? '' : 'info'" size="small">
                {{ data.menu ? "菜单" : "权限" }}
              </el-tag>
              <span class="ml-2 text-sm">{{ data.name }}</span>
            </div>
          </template>
        </el-tree-v2>
      </FormDraw>
    </el-card>
  </div>
</template>
  <script setup>
import {
  createRole,
  updateRole,
  deleteRole,
  getRoleList,
  updateRoleStatus,
  setRoleRules,
} from "../../api/role.js";
import FormDraw from "../../components/FormDraw.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon.js";
import ListHeader from "../../components/ListHeader.vue";
import { ref } from "vue";
import { getRuleList } from "../../api/rule";
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
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus,
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
    desc: "",
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "角色名称不能为空",
        trigger: "blur",
      },
    ],
    desc: [
      {
        required: true,
        message: "角色描述不能为空",
        trigger: "blur",
      },
    ],
  },
  update: updateRole,
  create: createRole,
  getData,
});

const setRuleFormDrawerRef = ref(null);
const ruleList = ref([]);
const roleId = ref(0);
const treeHeight = ref(0);
const defaultExpandedKeys = ref([]);
const elTreeRef = ref(null);
const checkStrictly=ref(false)
//当前角色拥有的权限id
const ruleIds = ref([]);
const OpenSetRule = (row) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 180;
  checkStrictly.value=true
  getRuleList(1).then((res) => {
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    setRuleFormDrawerRef.value.open();
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value);
      checkStrictly.value=false
    }, 150);
  });
};
const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys];
};
const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.showLoading();
  setRoleRules(roleId.value, ruleIds.value)
    .then((res) => {
      toast("配置成功");
      getData()
      setRuleFormDrawerRef.value.close();
    })
    .finally(() => {
      setRuleFormDrawerRef.value.hideLoading();
    });
};
getData()
</script>