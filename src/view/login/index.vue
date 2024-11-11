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
            @click="submitForm"
            v-show="!formType"
            >登录</el-button
          >
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm"
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
import { ref, reactive } from "vue";

const imgUrl = new URL("/public/login-head.png", import.meta.url).href;
const formType = ref(0); //切换表单 0登录 1注册
let flag = false; // 进行防抖处理
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
  setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60;
      countdown.validText = "获取验证码";
      flag = false;
    } else {
      countdown.time -= 1;
      countdown.validText = `剩余${countdown.time}s`;
    }
  }, 1000);
  flag = true;
};
/**
 * 表单提交
 */
const submitForm = () => {
  console.log(!formType);
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
