
<template>
  <router-view></router-view>
  
</template>
<script setup>
</script>
<style>
body{
  @apply bg-gray-100;
}
/*全局loading加载未生效*/
#nprogress .bar{
  background-color: brown !important;
  height: 3px !important;
}
/*修改滚动条的样式*/
::-webkit-scrollbar{
  width:4px;
  height:6px;
}
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgba(0,0,0,.2);
}
::-webkit-scrollbar-track{
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0,0,0,.1);
}
</style>
