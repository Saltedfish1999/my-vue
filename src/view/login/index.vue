<template>
  <el-row class="login-container">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? "返回登录" : "进行注册"
        }}</el-link>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        style="max-width: 600px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="输入用户名"
            :prefix-icon="UserFilled"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            placeholder="输入密码"
            type="password"
            show-password
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="输入验证码"
            :prefix-icon="Lock"
          >
            <template #append>
              <span @click="countdownChange">
                {{ countdown.validText }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
            v-show="!formType"
            >登录</el-button
          >
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="registerForm(loginFormRef)"
            v-show="formType"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, reactive, computed, toRaw } from "vue";
import { getCode, userAuth, userLogin, menuPermissions } from "../../api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const imgUrl = new URL("/public/login-head.png", import.meta.url).href;
const formType = ref(0); //切换表单 0登录 1注册
let flag = false; // 进行防抖处理
const loginFormRef = ref(); // 获取form表单实例
//表单信息初始化
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});
//发送短信
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
});
// 创建router实例
const router = useRouter();
//创建vuex的实例
const store = useStore();
const routerList = computed(() => store.state.menu.routerList);
/**
 * 用户名校验
 */
const validateUser = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value) ? callback() : callback(new Error("账号输入格式错误"));
  }
};
/**
 * 密码校验
 */
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const passReg = /^[a-zA-Z0-9_-]{4,16}$/;
    passReg.test(value) ? callback() : callback(new Error("密码格式错误"));
  }
};
/**
 * 点击切换注册和登录
 */
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};
/**
 *发送验证码后的逻辑
 */
const countdownChange = () => {
  //已经发送则不进行处理
  if (flag) return;
  //校验手机号的格式的正则表达式
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "手机号验证失败",
      type: "warning",
    });
  }

  //倒计时
  const time = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60;
      countdown.validText = "获取验证码";
      flag = false;
      clearInterval(time);
    } else {
      countdown.time -= 1;
      countdown.validText = `剩余${countdown.time}s`;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginForm.userName }).then((data) => {
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};
/**
 * 注册表单提交
 */
const registerForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      userAuth(loginForm).then((data) => {
        if (data.code === 10000) {
          ElMessage.success("注册成功，请登录");
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
/**
 * 登录表单提交
 */
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      userLogin(loginForm).then((data) => {
        console.log(data.data.data.token);
        console.log(data.data.code);
        if (data.data.code === 10000) {
          ElMessage.success("登录成功");
          // 将用户信息和token缓存到localStorage中
          console.log(data.data.data);
          localStorage.setItem("pz_token", data.data.data.token);
          localStorage.setItem(
            "pz_userInfo",
            JSON.stringify(data.data.data.userInfo)
          );
          menuPermissions().then((data) => {
            store.commit("dynamicMenu", data.data.data);
            console.log(routerList);
            toRaw(routerList.value).forEach((element) => {
              router.addRoute("main", element);
            });
            router.push("/");
          });
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
//表单校验
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .card-header {
    background-color: #899fe1;
    img {
      width: 438px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
