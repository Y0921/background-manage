import { ref, reactive } from "vue";
import {updatepassword,logout} from "../api/manager";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import store from "../store";
import {router} from '../router';
import {showModal,toast} from "../composables/util";
export function useRepassword() {
    //const store = useStore();
    //const router = useRouter();
    const formDrawerRef = ref(null);
    //修改密码
    const form = reactive({
      oldpassword: "",
      password: "",
      repassword: "",
    });
    //登录的验证规则
    const rules = {
      //验证用户名
      oldpassword: [
        {
          required: true,
          message: "旧密码不能为空",
          trigger: "blur",
        },
      ], //验证密码
      password: [
        {
          required: true,
          message: "新密码不能为空",
          trigger: "blur",
        },
        {
          min: 4,
          message: "密码长度至少是4个字符",
          trigger: "blur",
        },
      ],
      repassword: [
        {
          required: true,
          message: "确认密码不能为空",
          trigger: "blur",
        },
        {
          min: 4,
          message: "密码长度至少是4个字符",
          trigger: "blur",
        },
      ],
    };
    const formRef = ref(null);
    //点击登录提交事件
    const onSubmit = () => {
      formRef.value.validate((valid) => {
        //验证失败
        if (!valid) {
          return false;
        }
        formDrawerRef.value.showLoading();
        updatepassword(form)
          .then((res) => {
            toast("修改密码成功,请重新登录");
            store.dispatch("logout");
            router.push("/login");
          })
          .finally(() => {
            e1;
            formDrawerRef.value.hideLoading();
          });
      });
    };
  
    const openRepasswordForm=()=>formDrawerRef.value.open();
  
    return{
      formDrawerRef,
      form,
      rules,
      formRef,
      onSubmit,
      openRepasswordForm
    }
  }
export function useLogout(){
 function handlelogout(){
    showModal("是否要退出登录")
      .then((res) => {
        logout().finally(() => {
          store.dispatch("logout");
          //跳转回登录页
          router.push("/login");
          //提示退出登录成功
          toast("退出登录成功");
        });
      })
      .catch();
  } 
  return{
    handlelogout
  }
}