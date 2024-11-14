<template>
  <div class="btns">
    <el-button :icon="Plus" size="small" type="primary" @click="open(null)"
      >新增</el-button
    >
  </div>

  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="pagintaionData.pageNum"
      v-model:page-size="pagintaionData.pageSize"
      layout="prev, pager, next, jumper"
      :total="tableData.total"
      :background="false"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog
    v-model="dialogformVisible"
    :before-close="handleClose"
    title="添加权限"
    width="500"
  >
    <el-form
      :rules="rules"
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-mode="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="填写权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          :data="permissionData"
          style="max-width: 600px"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
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
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";

// 弹窗数据
const form = reactive({
  name: "",
  permissions: "",
  id: "",
});
//列表数据
const tableData = reactive({
  list: [],
  total: "",
});

const dialogformVisible = ref(false); //弹窗的显隐
const permissionData = ref({}); //树形结构的权限
const defaultKeys = [4, 5]; // 默认权限
const treeRef = ref();
const formRef = ref();
const rules = reactive({
  name: [{ required: true, trigger: "blue", message: "请输入用户名" }],
  permissions_id: [
    { required: true, trigger: "blue", message: "请输入权限名称" },
  ],
});
const pagintaionData = reactive({
  pageNum: 1,
  pageSize: 10,
});

onMounted(() => {
  userGetMenu().then((data) => {
    console.log(data);
    permissionData.value = data.data.data;
    console.log(permissionData.value);
  });
  getListData();
});
/**
 * 点击分页跳转
 */
const handleSizeChange = (val) => {
  pagintaionData.pageSize = val;
  getListData();
};
/**
 * 点击当前页跳转
 */
const handleCurrentChange = (val) => {
  pagintaionData.pageNum = val;
  getListData();
};
/**
 * 请求列表数据
 */
const getListData = () => {
  menuList(pagintaionData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};
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
  treeRef.value.setCheckedKeys(defaultKeys);
};
/**
 * 表单提交
 */
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      console.log({ name: form.name, permissions, id: form.id });
      console.log(typeof permissions);
      userSetMenu({ name: form.name, permissions, id: form.id }).then(
        (data) => {
          console.log(data);
          handleClose();
          getListData();
        }
      );
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
