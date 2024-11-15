<template>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column label="所属组别" prop="permissions_id">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column label="状态" prop="active">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? "正常" : "失效"
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">
            {{ scope.row.create_time }}
          </span>
        </div>
      </template>
    </el-table-column>
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
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          style="width: 240px"
          placeholder="请选择权限"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
import { authAdmin, menuSelectList, updateUser } from "../../../api";
import { reactive, onMounted, ref, nextTick } from "vue";
import dayjs from "dayjs";
import { Clock } from "@element-plus/icons-vue";

//请求用户数据
const pagintaionData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//弹窗数据
const form = reactive({
  permissions_id: "",
  mobile: "",
  name: "",
  id: "",
});
//列表数据
const tableData = reactive({
  list: [],
  total: "",
});
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  permissions_id: [
    { required: true, trigger: "blur", message: "请输入权限名称" },
  ],
});
const dialogformVisible = ref(false);
const formRef = ref(); // 表单提交数据
//
const options = ref([]);
onMounted(() => {
  getListData();
  menuSelectList().then((data) => {
    console.log(data.data.data);
    options.value = data.data.data;
  });
});
/**
 * 获取表单数据
 */
const getListData = () => {
  authAdmin(pagintaionData).then((data) => {
    console.log(data);
    const { list, total } = data.data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
    console.log(tableData);
  });
};
/**
 * 根据权限id匹配权限名称
 */
const permissionName = (id) => {
  const data = options.value.find((el) => el.id === id);
  console.log(typeof options.value);
  return data ? data.name : "超级管理员";
};
/**
 * 关闭弹窗的回调
 */
const handleClose = () => {
  dialogformVisible.value = false;
  formRef.value.resetFields(); //重置表单
};
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
 * 打开编辑弹框
 */
const open = (rowData = []) => {
  dialogformVisible.value = true;
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { mobile: rowData.mobile, name: rowData.name });
    }
  });
};
/**
 * 表单提交
 */
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form;
      updateUser({ name, permissions_id }).then((data) => {
        console.log(data);
        getListData();
        dialogformVisible.value = false;
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
