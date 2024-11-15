<template>
  <div class="btns">
    <el-button :icon="Plus" size="small" type="primary" @click="open(null)"
      >新增</el-button
    >
    <el-popconfirm
      confirm-button-text="确认"
      cancel-button-text="取消"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除?"
      @confirm="confirmEvent"
      @cancel="cancelEvent"
    >
      <template #reference>
        <el-button type="danger" size="small" :icon="Delete">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table
    :data="tableData.list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" :selectable="selectable" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image
          :src="scope.row.avatar"
          style="width: 50px; height: 50px"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === "1" ? "男" : "女" }}
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
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogimageVisible = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
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
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogimageVisible"
    :before-close="handleClose"
    title="选择头像"
    width="680"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="selectIndex === index" class="select">
          <el-icon color="green"><Check /></el-icon>
        </div>
        <el-image
          style="width: 148px; height: 148px"
          :src="item.url"
        ></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogimageVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from "vue";
import dayjs from "dayjs";
import { Check, Plus, InfoFilled, Delete } from "@element-plus/icons-vue";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "../../../api";
import { ElMessage } from "element-plus";

const dialogformVisible = ref(false);
const dialogimageVisible = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);
const formRef = ref(); // 表单提交数据
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入昵称" }],
  avatar: [{ required: true, message: "请选择头像" }],
  sex: [{ required: true, trigger: "change", message: "请输入性别" }],
  mobile: [{ required: true, trigger: "blur", message: "请输入手机号" }],
});
//请求用户数据
const pagintaionData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//列表数据
const tableData = reactive({
  list: [],
  total: "",
});
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
//选择数据
const selectData = ref([]);

onMounted(() => {
  photoList().then((data) => {
    fileList.value = data.data.data;
    console.log(data.data.data);
  });
  getList();
});
/**
 * 获取表单数据
 */
const getList = () => {
  companionList(pagintaionData).then(({ data }) => {
    if (data.code === 10000) {
      const { list, total } = data.data;
      list.forEach((item) => {
        item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
      });
      tableData.list = list;
      tableData.total = total;
    }
    console.log(data);
  });
};
/**
 * 删除事件
 */
const confirmEvent = () => {
  if (!selectData.value.length) {
    return ElMessage.warning("请至少选择一项数据");
  }
  deleteCompanion({ id: selectData.value }).then(({ data }) => {
    if (data.code === 10000) {
      getList();
    }
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
      Object.assign(form, rowData);
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
 * 头像上传
 */
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogimageVisible.value = false;
};
/**
 * 表单多选
 */
const handleSelectionChange = (val) => {
  selectData.value = val.map((item) => ({ id: item.id }));
};
/**
 * 表单提交
 */
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then((data) => {
        if (data.data.code === 10000) {
          handleClose();
          getList();
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
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
</script>

<style lang="less" scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
