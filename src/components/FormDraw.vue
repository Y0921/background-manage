<template>
  <!--通用弹框表单组件封装:对外暴露标题 宽度 -->
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :with-header="true"
    :size="size"
    :close-on-click-modal="true"
    :destroy-on-close="destroyOnClose"
  >
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" @click="submit" :loading="loading">{{
          confirmText
        }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref } from "vue";
const showDrawer = ref(false);
const emit = defineEmits(["submit"]);//向父组件暴露submit事件
const submit = () => emit("submit");//执行 点击子组件监听函数 click就会submit事件就会通知触发submit事件 父组件中@submit事件
const loading = ref(false);
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);

const props = defineProps({
  title: String,//向父组件暴露 弹框标题
  size: {//弹框宽度
    type: String,
    default: "45%",//默认值
  },
  //关闭后子元素全都销毁
  destroyOnClose: {
    type: Boolean,
    default: false,//默认不开启
  },
  //提交按钮
  confirmText: {
    type: String,
    default: "提交",//默认
  },
});
//打开抽屉
const open = () => (showDrawer.value = true);
//关闭抽屉
const close = () => (showDrawer.value = false);
//向父组件暴露一下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>
<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  @apply flex flex-col;
}
.formDrawer .body {
  flex: 1;
  overflow-y: auto;/*超出部分可以滚动*/
}
.formDrawer .actions {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>