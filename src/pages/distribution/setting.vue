<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
      <el-form :model="form" label-width="160px">
        <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
        <el-form-item label="分销启用">
            <el-radio-group v-model="form.distribution_open">
              <el-radio :label="0" border>
                禁用
              </el-radio>
              <el-radio :label="1" border>
                开启
              </el-radio>
            </el-radio-group>
          </el-form-item>
        <h5 class="bg-gray-100 p-3 rounded mb-5">返佣设置</h5>
        <el-form-item label="一级返佣比例">
            <div>
              <el-input v-model="form.store_first_rebate" placeholder="一级返佣比例" style="width: 50%;" type="number">
              <template #append>%</template>
            </el-input>
            </div>
          </el-form-item>
          <el-form-item label="二级返佣比例">
            <div>
              <el-input v-model="form.store_second_rebate" placeholder="一级返佣比例" style="width: 50%;" type="number">
              <template #append>%</template>
            </el-input>
            </div>
          </el-form-item>
          <el-form-item label="自购返佣">
            <div>
              <el-radio-group v-model="form.is_self_brokerage">
              <el-radio :label="1" border>
                是
              </el-radio>
              <el-radio :label="0" border>
                否
              </el-radio>
            </el-radio-group>
            </div>
          </el-form-item>
        <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
        <el-form-item label="结算时间">
            <div>
              <el-input v-model="form.settlement_days" placeholder="结算时间" style="width: 80%;" type="number">
                <template #prepend>订单完成后</template>
                <template #append>天</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="佣金到账方式">
            <div>
              <el-radio-group v-model="form.brokerage_method">
              <el-radio label="hand" border>
                手动到账
              </el-radio>
              <el-radio label="wx" border>
                自动到微信零钱
              </el-radio>
            </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
    </div>
  </template>
  <script setup>
  import { ref, reactive } from "vue"
  import { getConfig, setConfig } from "@/api/distribution"
  import { toast } from "../../composables/util";
  
  const form = reactive({
    "distribution_open": 1, //分销启用:0禁用1启用
    "store_first_rebate": 10, //一级返佣比例：0~100
    "store_second_rebate": 20, //二级返佣比例：0~100
    "is_self_brokerage": 1, //自购返佣:0否1是
    "settlement_days": 7, //结算时间（单位：天）
    "brokerage_method": "hand" //佣金到账方式:hand手动,wx微信
  })
  
  const loading = ref(false)
  function getData() {
    loading.value = true
    getConfig().then(res => {
      for (const k in form) {
        form[k] = res[k]
      }
      form.password_encrypt = form.password_encrypt.split(",")
    }).finally(() => {
      loading.value = false
    })
  }
  
  getData()
  
  const submit = ()=>{
    loading.value = true
    setConfig({
      ...form,
    }).then(res=>{
      toast("修改成功")
      getData()
    }).finally(()=>{
      loading.value = false
    })
  }
  </script>