<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo_tabs" @tab-change="getData">
      <el-tab-pane
        :label="item.name"
        :name="item.key"
        v-for="(item, index) in tabbars"
        :key="index"
      >
      </el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <SearchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品昵称"
            clearable
          ></el-input>
        </SearchItem>
        <template #show>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>

      <ListHeader
        layout="create,delete,refresh"
        @create="handleCreate"
        @refresh="getData"
        @delete="handleMultiDelete"
      >
        <el-button
          size="small"
          @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
          >上架</el-button
        >
        <el-button
          size="small"
          @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
          >下架</el-button
        >
      </ListHeader>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        ref="multiTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品" width="290">
          <template #default="{ row }">
            <div class="flex">
              <el-image
                class="mr-3 rounded"
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              ></el-image>
            </div>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <div>
                <span class="text-rose-500">￥{{ row.min_price }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="text-gray-500 text-xs">￥{{ row.min_price }}</span>
              </div>
              <p class="text-gray-400 text-xs mb-1">
                分类:{{ row.category ? row.category.name : "未分类" }}
              </p>
              <p class="text-gray-400 text-xs">
                创建时间:{{ row.create_time }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="实际销量"
          width="80"
          prop="sale_count"
          align="center"
        ></el-table-column>

        <el-table-column label="商品状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small"
              >{{ row.status ? "上架" : "仓库" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="审核状态"
          width="120"
          align="center"
          v-if="searchForm.tab != 'delete'"
        >
          <template #default="{ row }">
            <div v-if="row.ischeck == 0" class="flex flex-col">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button class="mt-2 !ml-0" size="small" type="danger" plain
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{ row.ischeck == 1 ? "通过" : "拒绝" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="总库存"
          width="90"
          prop="stock"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >

              <el-button
                class="px-1"
                text
                :type="
                  (scope.row.sku_type == 0 && !scope.row.sku_value) ||
                  (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                    ? 'danger'
                    : 'primary'
                "
                size="small"
                @click="handleSetGoodsskus(scope.row)"
                :loading="scope.row.skusLoading"
                >商品规格</el-button
              >

              <el-button
                class="px-1"
                text
                :type="
                  scope.row.goods_banner.length == 0 ? 'danger' : 'primary'
                "
                size="small"
                @click="handleSetGoodsBanners(scope.row)"
                :loading="scope.row.bannersLoading"
                >设置轮播图
              </el-button>
              <el-button
                class="px-1"
                text
                size="small"
                :type="!scope.row.content ? 'danger' : 'primary'"
                @click="handleSetGoodsContent(scope.row)"
                :loading="scope.row.contentLoading"
                >商品详情
              </el-button>
              <span @click.stop="() => {}">
                <el-popconfirm
                  title="是否要删除该商品？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelete([scope.row.id])"
                >
                  <template #reference>
                    <el-button text type="primary" size="small">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </span>
            </div>
            <span v-else class="text-gray-400">暂无操作</span>
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
          <el-form-item label="商品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入商品名称，不能超过60个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <chooseImage v-model="form.cover" />
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="选择所属商品分类"
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="选填，商品卖点"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入单位"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 40%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 40%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 40%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input
              v-model="form.min_oprice"
              type="number"
              style="width: 40%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDraw>
    </el-card>
    <banners ref="bannersRef" @reload-data="getData"></banners>
    <content ref="contentRef" @reload-data="getData"></content>
    <skus ref="skusRef" @reload-data="getData"></skus>
  </div>
</template>
  <script setup>
import FormDraw from "../../components/FormDraw.vue";
import ListHeader from "../../components/ListHeader.vue";
import { ref } from "vue";
import chooseImage from "../../components/chooseImage.vue";
import { getCategoryList } from "../../api/category";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import banners from "./banners.vue";
import content from "./content.vue";
import skus from "./skus.vue";

import {
  deleteGoods,
  getGoodsList,
  updateGoods,
  updateGoodsStatus,
  createGoods,
  restoreGoods,
} from "../../api/goods.js";
import { useInitTable, useInitForm } from "../../composables/useCommon.js";
const roles = ref(null);
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleMultiDelete,
  handleMultiStatusChange,
  handleSelectionChange,
  multiTableRef,
} = useInitTable({
  getList: getGoodsList,
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      (o.contentLoading = false), (o.skusLoading = false);
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
});

const {
  DrawerTitle,
  FormDrawerRef,
  formRef,
  form,
  handleCreate,
  handleEdit,
  handleSubmit,
} = useInitForm({
  form: {
    title: null, //商品名称
    category_id: 0, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 0, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1禁用
    min_price: 0, //最低销售价
    min_oprice: 0, //最低原价
  },
  update: updateGoods,
  create: createGoods,
  getData,
});
const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];
//商品分类
const category_list = ref([]);
getCategoryList().then((res) => {
  category_list.value = res;
});
//设置轮播图
const bannersRef = ref(null);
const handleSetGoodsBanners = (row) => {
  bannersRef.value.open(row);
};
//设置商品详情
const contentRef = ref(null);
const handleSetGoodsContent = (row) => {
  contentRef.value.open(row);
};
//设置商品单规格
const skusRef = ref(null);
const handleSetGoodsskus = (row) => {
  skusRef.value.open(row);
};
</script>