<template>
  <el-container>
    <el-header>
      <FHeader />
    </el-header>
    <el-container>

      <el-aside :width="$store.state.asideWidth" class="el-aside">
        <FMenu/>
      </el-aside>

      <el-main>
        <FTaglist />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTaglist from "./components/FTaglist.vue";
</script>

<style>
/*全局过渡动画*/
.el-aside {
  transition: all 0.2s;
}
.fade-enter-from{
opacity: 0;
}
.fade-enter-to{
  opacity: 1;

}
.fade-leave-from{
opacity: 1;
}
.fade-leave-to{
opacity:0;
}
.fade-enter-active,.fade-leave-active{
  transition: all 0.3s;
}
.fade-enter-active{
  transition-delay: 0.3s;
}
</style>