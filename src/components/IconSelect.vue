<template>
    <div class="flex items-center">
        <el-icon v-if="modelValue" class="mr-2" :size="20">
                    <component :is="modelValue">
                    </component>
                </el-icon>
        <el-select
            :modelValue="modelValue"
            class="m-2"
            filterable
            placeholder="请选择图标"
            @change="handleChange"
          >
            <el-option
              v-for="item in icons"
              :key="item"
              :label="item"
              :value="item"
            >

            <div class="flex items-center justify-between">
                <el-icon>
                    <component :is="item">
                    </component>
                </el-icon>
                <span class="text-gray-400">
                        {{ item}}
                    </span>
            </div>
            </el-option>

          </el-select>
    </div>
</template>
<script setup>
import {ref} from'vue'
import * as iconList from '@element-plus/icons-vue'

const icons=ref(Object.keys(iconList))
defineProps({
    modelValue:String
})
const emit=defineEmits(['update:modelValue'])
const handleChange=(icon)=>{
emit('update:modelValue',icon)
}
</script>