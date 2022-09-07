<template>
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <i class="el-icon-lx-calendar"></i> 系统权限管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>高校列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :icon="Plus" @click="handleAdd()"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="4">
          <el-form-item>
            学校性质
            <el-select
              v-model="query.params.schoolType"
              clearable
              placeholder="请选择"
              class="handle-select mr10"
            >
              <el-option
                v-for="(item, c) in SchoolTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            >学校分类
            <el-select
              v-model="query.params.schoolCategoly"
              clearable
              placeholder="请选择"
              class="handle-select mr10"
            >
              <el-option
                v-for="(item, c) in SchoolCategoryTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            >关键字
            <el-input
              v-model="query.params.keyword"
              placeholder="请输入关键字"
              clearable
              class="handle-input mr10"
              @keyup.enter.native="handleSearch()"
            ></el-input
            ><el-button type="primary" :icon="Search" @click="handleSearch()"
              >搜索</el-button
            ></el-form-item
          >
        </el-col>
        <el-col :span="6">
          <el-form-item> </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="SchoolList"
      style="width: 100%"
      row-key="school_id"
      stripe
      border
      lazy
    >
      <el-table-column prop="school_name" label="学校名称"> </el-table-column>
      <el-table-column prop="name" label="学校性质" width="120">
      </el-table-column>
      <el-table-column prop="name" label="学校分类" width="120">
      </el-table-column>
      <el-table-column prop="administrator" label="管理员账号" width="150">
      </el-table-column>
      <el-table-column prop="name" label="子账号数量" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleDel(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑学校" v-model="SchoolAddVisible">
      <school-add
        :SchoolId="selectedSchoolId"
        :SchoolTypeList="SchoolTypeList"
        :SchoolCategoryTypeList="SchoolCategoryTypeList"
        v-if="SchoolAddVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSchoolList,
  getSchoolType,
  getSchoolCategoryType,
  getUserBySchoolId,
  addSchool,
  delSchool,
} from "../api/serviceApi";
import SchoolAdd from "../components/SchoolAdd.vue";
export default {
  components: { SchoolAdd },
  setup() {
    let SchoolAddVisible = ref(false);
    let selectedSchoolId = ref("sss");
    //下拉列表模型
    let SchoolTypeList = ref([]);
    let SchoolCategoryTypeList = ref([]);
    //学校模型
    let SchoolList = ref([]);
    let query = reactive({
      params: {
        schoolType: "",
        schoolCategoly: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
      },
    });
    const bindSchoolTypeList = () => {
      getSchoolType().then((res) => {
        if (res.resultCode == "200") {
          SchoolTypeList.value = res.data;
        }
      });
    };
    const bindSchoolCategoryList = () => {
      getSchoolCategoryType().then((res) => {
        if (res.resultCode == "200") {
          SchoolCategoryTypeList.value = res.data;
        }
      });
    };
    const bindSchoolList = () => {
      getSchoolList(query).then((res) => {
        if (res.resultCode == "200") {
          SchoolList.value = JSON.parse(res.data.School_list);
        }
      });
    };
    const handleAdd = () => {};
    const handleSearch = () => {
      bindSchoolList();
    };
    const handleEdit = (row) => {
      SchoolAddVisible.value = true;
      selectedSchoolId.value = row.school_id;
    };
    const handleDel = (row) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            params: {
              school_id: row.school_id,
              admin_id: "admin",
              admin_ip: "127.0.0.1",
            },
          };
          delSchool(params)
            .then((res) => {
              if (res.resultCode == "200") {
                ElMessage.success("删除成功");
                bindSchoolList();
              } else {
                ElMessage({
                  message: "获取数据失败：" + res.message,
                  grouping: true,
                  type: "error",
                });
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    };

    onMounted(() => {
      bindSchoolTypeList();
      bindSchoolCategoryList();
      bindSchoolList();
    });
    return {
      Search,
      Plus,
      SchoolAddVisible,
      selectedSchoolId,
      SchoolList,
      SchoolTypeList,
      SchoolCategoryTypeList,
      query,
      bindSchoolList,
      bindSchoolTypeList,
      bindSchoolCategoryList,
      handleAdd,
      handleSearch,
      handleEdit,
      handleDel,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 10px;
}

.handle-select {
  width: 150px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 5px;
}
</style>