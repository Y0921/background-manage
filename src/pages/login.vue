<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>欢迎光临</div>
            <div>这是vue3后台系统</div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <h2 class="title">欢迎回来</h2>
            <div>
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>
            <div>
  <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px] ">
    <el-form-item prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名字" >
      <template #prefix>
        <el-icon class="el-input_icon"><User/></el-icon>
      </template>
    </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" placeholder="请输入用户密码"  type="password" show-password>
        <template #prefix>
        <el-icon class="el-input_icon"><Lock/></el-icon>
      </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" class="w-[250px] round" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
  </div>
        </el-col>
    </el-row>
</template>

<script setup>
import {ref,reactive,onMounted,onBeforeUnmount} from 'vue'
import {toast} from '../composables/util'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
const router=useRouter();
const store=useStore();//store实例
//import {User,Lock} from '@element-plus/icons-vue'
const form=reactive({
    username:'',
    password:''
})
//登录的验证规则
const rules={
    //验证用户名
    username:[{
        required:true,
        message:'用户名不能为空',
        trigger:'blur'
    },{
        min:3,
        max:6,
        message:'用户名长度必须是3-16个字符',
        trigger:'blur'
    }
],//验证密码
    password:[
    {
        required:true,
        message:'密码不能为空',
        trigger:'blur'
    },{
        min:4,
        message:'密码长度至少是3个字符',
        trigger:'blur'
    }

    ]
}
const formRef=ref(null)
const loading=ref(false)
//点击登录提交事件
const onSubmit=()=>{
    formRef.value.validate((valid)=>{
        loading.value=true
        //验证失败
        if(!valid){
            return false
        }
        //验证成功--登录
        store.dispatch('login',form).then(res=>{
             //提示成功
             toast("登录成功")
               //跳转到后台首页
            router.push('/')
        }).finally(()=>{
        loading.value=false
    })
})}
//监听回车事件
function onKeyUp(e){
    //console.log(e)
    if(e.key=="Enter"){
        onSubmit()
    }
}
//页面加载完毕后
onMounted(()=>{
    //添加键盘监听事件
document.addEventListener('keyup',onKeyUp)
})
//页面卸载之前
onBeforeUnmount(()=>{
//移除键盘监听
document.removeEventListener('keyup',onKeyUp)
})
</script>
<style scoped>
.login-container{
@apply min-h-screen bg-blue-500;
}
.login-container .left,.login-container .right{
    @apply  flex items-center justify-center flex-col;
}
.login-container .right{
    @apply bg-light-500 ; 
}
.left>div:first-child{
 @apply font-bold text-3xl text-light-200 mb-4;
}
 .left>div:last-child{
    @apply text-1xl text-light-50;
}
.right .title{
@apply font-bold text-3xl text-gray-800;
}
.right>div{
    @apply flex items-center justify-center my-3 text-gray-300 space-x-2;
}
.right .line{
    @apply h-[1px] w-16 bg-gray-200;
}
</style>