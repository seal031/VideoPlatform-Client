<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> 系统日志管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>日志列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <div class="handle-box">
          <el-form>
          <!-- <el-divider></el-divider> -->
          <el-row>
          <!-- <el-col :span="4">
            <el-form-item>
              内容分类
              <el-select
                v-model="query.params.briefType"
                clearable
                placeholder="请选择"
                class="handle-select mr10"
              >
                <el-option
                  v-for="(item, c) in briefTypeList"
                  :key="c"
                  :label="item.code_name"
                  :value="item.code_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              内容状态
              <el-select
                v-model="query.params.briefState"
                clearable
                placeholder="请选择"
                class="handle-select mr10"
              >
                <el-option
                  v-for="(item, c) in stateTypeList"
                  :key="c"
                  :label="item.code_name"
                  :value="item.code_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              关键字
              <el-input
                v-model="query.params.keyword"
                placeholder="请输入关键字"
                clearable
                class="handle-input mr10"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch()"
                >搜索</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        </div>
        <div style="width: 100%; height: 100%">
          <el-table
            :data="logFormList"
            border
            style="width: 100%; height: 100%"
          >
            <el-table-column prop="real_name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="user_name" label="账号" width="120">
            </el-table-column>
            <el-table-column prop="role_name" label="账号类型" width="120">
            </el-table-column>
            <el-table-column prop="operate_detail" label="操作">
            </el-table-column>
            <el-table-column prop="operate_time" label="操作时间" width="180" :formatter="dateFormat" >
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
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import moment from "moment";
  import { Search, Plus, Cellphone, Delete } from "@element-plus/icons-vue";
  import { getCurrentInstance } from "vue";
  import { ref, reactive, onMounted } from "@vue/runtime-core";
  import { getLogs } from "../api/serviceApi";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { useRouter, useRoute } from "vue-router";
  
  export default {
    components: {  },
    methods: {
    },
    setup() {
      let userId = "";
      let userRole = "";
      let userName = "";
      let realName = ref("");
      let userSchool = "";
  
      let query = reactive({
        params: {
          keyword: "",
          pageIndex: 1,
          pageSize: 10,
        },
      });
      //table模型
      let logFormList = ref([]);
      const pageTotal = ref(0);

      const dateFormat=(date) =>{
          return moment(date.operate_time).format("YYYY-MM-DD hh:mm:ss");
        };
      const methods = {
        //加载列表
        getLogList() {
          getLogs(query).then((res) => {
            console.log(res);
            if (res.resultCode == "200") {
              debugger
              logFormList.value = JSON.parse(res.data.LogList);
              pageTotal.value = res.data.totalCount || 50;
            } else {
              ElMessage({
                message: "获取数据失败：" + res.message,
                grouping: true,
                type: "error",
              });
            }
          });
        },
      };
      const getSession = () => {
        userId = localStorage.getItem("user_id");
        userRole = localStorage.getItem("user_role");
        userName = localStorage.getItem("user_name");
        realName.value = localStorage.getItem("real_name");
        userSchool = localStorage.getItem("user_school");
      };
  
      onMounted(() => {
        getSession();
        methods.getLogList();
      });
      
      const handleSearch=()=> {
        methods.getLogList();
      };
      
      // 分页导航
      const handlePageChange = (val) => {
        query.params.pageIndex = val;
        methods.getLogList();
      };
  
      return {
        Search,
        Plus,
        Delete,
        Cellphone,
        
        userId,
        userRole,
        userName,
        realName,
        userSchool,
  
        moment,
        dateFormat,
        getCurrentInstance,
        userId,
        userRole,
        pageTotal,
        query,
        // logForm,
        logFormList,
        methods,
        getSession,
  
        handleSearch,
        handlePageChange,
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
    width: 240px;
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
  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
  .line_file {
    display: inline-block;
    /* text-align: center; */
    width: 20%;
    height: 20%;
    /* background-color: #d3d3d3; */
  }
  </style>
  
  