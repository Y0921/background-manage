<template>
  <div class="flex items-center justify-between mb-4" style="width: 100%">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="small"
        @click="$emit('create')"
        >新增</el-button
      >
      <el-popconfirm
        title="是否要删除选中记录？"
        confirm-button-text="确认"
        cancel-button-text="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button
            v-if="btns.includes('delete')"
            type="danger"
            size="small"
            >批量删除</el-button
          ></template
        >
      </el-popconfirm>
      <slot/>
    </div>
    <el-tooltip
      v-if="btns.includes('refresh')"
      effect="dark"
      content="刷新页面"
      placement="top"
    >
      <el-button text>
        <el-icon size="20" @click="$emit('refresh')"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip
      v-if="btns.includes('download')"
      effect="dark"
      content="导出数据"
      placement="top"
    >
      <el-button text>
        <el-icon size="20" @click="$emit('download')"><Download /></el-icon>
      </el-button>
    </el-tooltip>

  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});
const btns = computed(() => props.layout.split(","));
defineEmits(["create", "refresh", "delete","download"]);
</script>