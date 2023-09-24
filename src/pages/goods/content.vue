<template>
  <FormDraw ref="formDrawerRef" title="设置商品详情"  @submit="submit">
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </FormDraw>
</template>
<script setup>
import { ref, reactive } from "vue";
import { readGoods, updateGoods } from "../../api/goods.js";
import { toast } from "../../composables/util";
import FormDraw from "../../components/FormDraw.vue";
import Editor from "../../components/Editor.vue";
const formDrawerRef = ref(null);
const form = reactive({
  content: "",
});

const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      formDrawerRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};
const submit = () => {
  formDrawerRef.value.showLoading();
  updateGoods(goodsId.value, form)
    .then((res) => {
      toast("设置商品详情成功！");
      formDrawerRef.value.close();
      emit("reloadData");
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};
const emit = defineEmits(["reloadData"]);
defineExpose({
  open,
});
</script>