<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 内容发布管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>内容列表</el-breadcrumb-item>
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
        </el-col>
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
          :data="briefFormList"
          border
          style="width: 100%; height: 100%"
        >
          <el-table-column prop="brief_title" label="内容标题">
          </el-table-column>
          <el-table-column prop="brief_type" label="内容分类" width="120">
          </el-table-column>
          <el-table-column prop="brief_state" label="状态" width="120">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="200"
            :formatter="dateFormat"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button @click="handleShow(scope.row)" type="text" size="small"
                >预览</el-button
              >
              <el-button @click="handleEdit(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button @click="handleDel(scope.row)" type="text" size="small"
                >删除</el-button
              >
              <!-- <el-button @click="handleShowLog(scope.row)" type="text" size="small"
                >操作日志</el-button
              > -->
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
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="编辑内容"
    width="80%"
    top="20px"
    @close="handleClose"
    :destroy-on-close="true"
  >
    <column-add :briefId="brief_id" @dialogclose="handleClose"></column-add>
  </el-dialog>

  <!-- <el-dialog
    v-model="logDialogVisible"
    title="操作日志"
    width="80%"
    top="20px"
    @close="handleCloseLog"
    :destroy-on-close="true"
  >
    <brief-log :briefId="brief_id" @dialogclose="handleCloseLog"></brief-log>
  </el-dialog> -->
</template>

<script>
  import moment from "moment";
import { Search, Plus, Cellphone, Delete } from "@element-plus/icons-vue";
import { getCurrentInstance } from "vue";
import { ref, reactive, onMounted } from "@vue/runtime-core";
import { getBriefBaseList, getColumnType, delBrief } from "../api/serviceApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import ColumnAdd from ".//ColumnAdd.vue";
import TrendExamineLog from ".//TrendExamineLog.vue";

export default {
  components: { ColumnAdd },
  methods: {
    //预览
    handleShow(row) {
      // 页面跳转
      const href = this.$router.resolve({
        path: "/BriefShow",
        query: { briefId: row.brief_id },
      });
      window.open(href.href, "_blank");
    },
  },
  setup() {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let delBtnText=ref("");

    let query = reactive({
      params: {
        briefType: "",
        briefState: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
      },
    });
    const stateTypeList = [
      {
        code_name: "已发布",
        code_id: "0401",
      },
      {
        code_name: "草稿",
        code_id: "0402",
      },
    ];
    //下拉数据模型列表
    let briefTypeList = ref([]);
    //table模型
    let briefFormList = ref([]);
    const pageTotal = ref(0);
    //数据模型
    const briefForm = reactive({
      brief_id: "",
      brief_title: "",
      brief_content: "",
      brief_type: "",
      brief_state: "",
    });
    const dateFormat=(date) =>{
        return moment(date.create_time).format("YYYY-MM-DD HH:mm:ss");
      };
    const methods = {
      //加载列表
      getBriefList() {
        getBriefBaseList(query).then((res) => {
          console.log(res);
          if (res.resultCode == "200") {
            briefFormList.value = JSON.parse(res.data.BriefList);
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
      getColumnTypeList() {
        getColumnType().then((res) => {
          if (res.resultCode == "200") {
            briefTypeList.value = res.data;
            briefTypeList.value.splice(4);//不取基层动态及以后的
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
    const handleAdd=()=>{
      brief_id.value=undefined
      dialogVisible.value = true;
    };

    onMounted(() => {
      getSession();
      methods.getColumnTypeList();
      methods.getBriefList();
    });
    const dialogVisible = ref(false);
    const logDialogVisible=ref(false);
    const brief_id = ref("");

    const handleEdit = (row)=>{
      brief_id.value = row.brief_id;
      dialogVisible.value = true;
    };
    const handleDel = (row)=>{
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            params: {
              brief_id: row.brief_id,
              brief_title: row.brief_title,
              admin_id: userId,
              admin_ip: "127.0.0.1",
            },
          };
          delBrief(params)
            .then((res) => {
              if (res.resultCode == "200") {
                ElMessage.success("删除成功");
                // this.methods.getBriefList();
                handleSearch();
              } else {
                ElMessage({
                  message: "获取数据失败：" + res.message,
                  grouping: true,
                  type: "error",
                });
              }
            })
            .catch(() => {});
          // tableData.value.splice(index, 1);
        })
        .catch((err) => {
          debugger;
        });
    };

    const handleShowLog=(row)=>{
      brief_id.value = row.brief_id;
      logDialogVisible.value=true;
    };
    
    const handleSearch=()=> {
      methods.getBriefList();
    };
    
    // 分页导航
    const handlePageChange = (val) => {
      query.params.pageIndex = val;
      methods.getBriefList();
    };
    
    const handleClose = ()=>{
      brief_id.value = "";
      dialogVisible.value=false;
      handleSearch();
    };
    const handleCloseLog=()=>{
      logDialogVisible.value=false;
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
      briefTypeList,
      stateTypeList,
      briefForm,
      briefFormList,
      methods,
      getSession,

      dialogVisible,
      logDialogVisible,
      brief_id,
      handleAdd,
      handleEdit,
      handleDel,
      handleShowLog,
      handleClose,
      handleCloseLog,
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

