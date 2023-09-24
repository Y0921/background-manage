<template>
  <!--首页头部-->
  <div class="f-header">

    <span class="logo">
      <el-icon class="mr-2"><Connection /></el-icon>
      商家后台系统
    </span>
    <!--折叠侧边栏-->
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <fold v-if="$store.state.asideWidth=='250px'"/>
      <Expand v-else/>
    </el-icon>

    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh"><refresh /></el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle"
          ><full-screen v-if="!isFullscreen" /><aim v-else
        /></el-icon>
      </el-tooltip>

      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="el-dropdown-link flex items-center text-light-50">
          <!--头像-->
          <el-avatar
            :size="25"
            class="mx-2"
            :src="$store.state.user.avatar"
          ></el-avatar>
          <!--昵称-->
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!--修改密码的弹出框-->
  <FromDraw
    ref="formDrawerRef"
    title="修改密码"
    destroyOnClose
    @submit="onSubmit"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input
          v-model="form.oldpassword"
          placeholder="请输入旧密码"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="form.password"
          placeholder="请输入新密码"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input
          v-model="form.repassword"
          placeholder="请输入确认密码"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
    </el-form>
  </FromDraw>
</template>
<script setup>
import { useFullscreen } from "@vueuse/core/index";
import FromDraw from "../../components/FormDraw.vue";
import {useRepassword,useLogout} from '../../composables/useManager';
const {
  //是否是全屏
  isFullscreen,
  //切换全屏
  toggle,
} = useFullscreen();
//组合式api封装
const{
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRepasswordForm
} =useRepassword()

const{
    handlelogout
}=useLogout()
const handleCommand = (e) => {
  switch (e) {
    case "logout":
      handlelogout();
      break;
    case "rePassword":
     openRepasswordForm()
      break;
  }
};
//刷新
function handleRefresh() {
  location.reload();
}
</script>
<style scoped>
.f-header {
  @apply flex items-center bg-teal-500 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index:999;
}
.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}
.icon-btn:hover {
  @apply bg-blue-400;
}
.dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center;
}
</style>