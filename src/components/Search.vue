<template>
  <div>
    <el-form :model="model" label-width="80px" class="mb-3">
      <el-row :gutter="20">
        <slot />
        <template v-if="showSearch"> <slot name="show" /></template>
        <el-col :span="8" :offset="showSearch ? 0 : 8">
          <div class="felx items-center justify-end">
            <el-form-item>
              <el-button type="primary" @click="$emit('search')"
                >搜索</el-button
              >
              <el-button @click="$emit('reset')">重置</el-button>
              <el-button type="primary" text @click="showSearch = !showSearch" v-if="hasShowSearch"                >{{ showSearch ? "收起" : "展开" }}
                <el-icon
                  ><ArrowUp v-if="showSearch" /><ArrowDown v-else
                /></el-icon>
              </el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
import { ref,useSlots } from "vue";
const showSearch = ref(false);
defineEmits(["search", "reset"]);
defineProps({
    model:Object
})
const slots=useSlots()
const hasShowSearch=ref(!!slots.show)
</script>