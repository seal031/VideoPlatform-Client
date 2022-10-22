<template>
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <i class="el-icon-lx-calendar"></i> 用户权限管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>高校列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="container">
    <div class="handle-box">
      <el-form>
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
          <el-col :span="6"> </el-col>
        </el-row>
      </el-form>
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
      <el-table-column prop="school_type_name" label="学校性质" width="120">
      </el-table-column>
      <el-table-column prop="school_category_name" label="学校分类" width="120">
      </el-table-column>
      <el-table-column prop="administrator_realName" label="管理员姓名" width="150">
      </el-table-column>
      <el-table-column prop="administrator_name" label="管理员账号" width="150">
      </el-table-column>
      <el-table-column prop="countUser" label="子账号数量" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button @click="resetAdminPwd(scope.row)" type="text" size="small"
            >重置管理员密码</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleDel(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="query.params.pageIndex"
        :page-size="query.params.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
    <el-dialog title="编辑学校" v-model="SchoolAddVisible">
      <school-add
        @closeSchoolAdd="handleClose"
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
  resetPwd,
} from "../api/serviceApi";
import SchoolAdd from "../components/SchoolAdd.vue";
export default {
  components: { SchoolAdd },
  setup() {
    let SchoolAddVisible = ref(false);
    let selectedSchoolId = ref("");
    //下拉列表模型
    let SchoolTypeList = ref([]);
    let SchoolCategoryTypeList = ref([]);
    const pageTotal = ref(0);
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
          debugger
          SchoolList.value = JSON.parse(res.data.School_list);
          pageTotal.value = res.data.totalCount || 50;
        }
      });
    };
    const handleAdd = () => {
      SchoolAddVisible.value = true;
      selectedSchoolId.value ="";
    };
    const handleSearch = () => {
      bindSchoolList();
    };
    const handleClose=()=>{
      selectedSchoolId.value = "";
      SchoolAddVisible.value=false;
      bindSchoolList();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.params.pageIndex = val;
      bindSchoolList();
    };
    const resetAdminPwd=(row)=>{
      debugger
      if(row.administrator==""){
        ElMessage({
                  message: "此高校尚无管理员",
                  grouping: true,
                  type: "info",
                });
      }else{
        ElMessageBox.confirm("确定要重置【"+row.school_name+"】的管理员密码吗？", "提示", {
          confirmButtonText: "重置密码",
          cancelButtonText: "取消",
          type: "warning",
        }).then(()=>{
          let params = {
            params: {
              user_id: row.administrator,
              newPwd:"123456",
            }
          };
          resetPwd(params).then((res)=>{
            if(res.resultCode=="200"){
              ElMessage.success("重置密码成功");
            }
            else{
              ElMessage({
                message: "重置密码失败：" + res.message,
                grouping: true,
                type: "error",
              });
            }
          });
        })
      }
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
              admin_id: userId,
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
      debugger
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
      pageTotal,
      query,
      bindSchoolList,
      bindSchoolTypeList,
      bindSchoolCategoryList,
      handlePageChange,
      handleAdd,
      handleClose,
      handleSearch,
      resetAdminPwd,
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
  width: 120px;
}

.handle-input {
  width: 250px;
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