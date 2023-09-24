<template>
  <el-dialog title="规格选择" v-model="dialogVisable" width="70%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div
            class="sku-list"
            v-for="(item, index) in tableData"
            :key="index"
            :class="{ active: activeId == item.id }"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            layout="prev ,next"
            :total="total"
            :current-page="currentPage"
            :page-size="limit"
            @current-change="getData"
          ></el-pagination>
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list" size="nomal">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisable = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { getSkusList } from "../api/skus.js";
import { useInitTable } from "../composables/useCommon";
const dialogVisable = ref(false);
const activeId = ref(0);

const { currentPage, limit, total, tableData, getData } = useInitTable(
  {
    getList: getSkusList,
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      total.value = res.totalCount;
      if (tableData.value.length > 0) {
        handleChangeActiveId(tableData.value[0].id);
      }
    },
  }
);
const list = ref([]);
const form = reactive({
  list: [],
  name: "",
});
const callbackFunction = ref(null);
const open = (callback = null) => {
  callbackFunction.value = callback;
  getData(1);
  dialogVisable.value = true;
};
function handleChangeActiveId(id) {
  activeId.value = id;
  list.value = [];
  let item = tableData.value.find((o) => o.id == id);
  if (item) {
    list.value = item.default.split(",");
    form.name = item.name;
  }
}
const submit = () => {
  if (typeof callbackFunction.value == "function") {
    callbackFunction.value(form);
  }
  dialogVisable.value = false;
};
defineExpose({
  open,
});
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  height: 50px;
  right: 0;
  left: 0;
  bottom: 0;
  @apply flex items-center justify-center;
}
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm  text-gray-600 flex flex-col cursor-pointer;
}
.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>