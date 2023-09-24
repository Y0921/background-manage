<template>
  <div>
    aaa
      <el-result
        icon="warning"
        title="404"
        sub-title="你找的页面走失了"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
        </template>
      </el-result>
  </div>
</template>
