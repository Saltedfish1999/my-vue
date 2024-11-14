<template>
  <div class="btns">
    <el-button :icon="Plus" size="small" type="primary" @click="open(null)"
      >新增</el-button
    >
  </div>
  <el-dialog
    v-model="dialogformVisible"
    :before-close="handleClose"
    title="陪护师添加"
    width="500"
  >
    <el-form
      :rules="rules"
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
    >
      <el-form-item v-show="false" label="" prop="id">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary">点击上传</el-button>
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-input />
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio label="0">失效</el-radio>
          <el-radio label="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";

const dialogformVisible = ref(false);
const formRef = ref(); // 表单提交数据
//弹窗数据
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 24,
  avatar: "",
  name: "",
  sex: "",
});
/**
 * 打开弹窗
 */
const open = (rowData = []) => {
  dialogformVisible.value = true;
  // 弹窗打开form是异步的
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};
/**
 * 关闭弹窗的回调
 */
const handleClose = () => {
  dialogformVisible.value = false;
  formRef.value.resetFields(); //重置表单
};
/**
 * 表单提交
 */
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style></style>
