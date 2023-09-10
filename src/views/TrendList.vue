<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 基层动态管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>内容列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form>
        <el-row  v-if="addButtonVisible">
          <el-col :span="24">
            <el-button type="primary" :icon="Plus" @click="handleAdd()" v-if="addButtonVisible"
              >新增</el-button
            >
          </el-col>
        </el-row>
        <el-divider  v-if="addButtonVisible"></el-divider>
        <el-row>
        <!-- <el-col :span="4">
          <el-form-item>
            内容分类
            <el-select
              v-model="query.params.trendType"
              clearable
              placeholder="请选择"
              class="handle-select mr10"
            >
              <el-option
                v-for="(item, c) in trendTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="4">
          <el-form-item>
            内容状态
            <el-select
              v-model="query.params.trendState"
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
          :data="trendFormList"
          border
          style="width: 100%; height: 100%"
        >
          <el-table-column prop="trend_title" label="内容标题">
          </el-table-column>
          <el-table-column prop="trend_type" label="内容分类" width="100">
          </el-table-column>
          <el-table-column prop="trend_state" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="creater" label="用户名" width="120">
          </el-table-column>
          <el-table-column prop="trend_school" label="学校" width="120">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="160"
            :formatter="dateFormatCreateTime"
          ></el-table-column>
          <el-table-column
            prop="public_time"
            label="发布时间"
            width="160"
            :formatter="dateFormatPublicTime"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button v-if="examineButtonVisible&&scope.row.trend_state=='待审核'" @click="handleExamine(scope.row)" type="text" size="small"
                >审批</el-button
              >
              <el-button @click="handleShow(scope.row)" type="text" size="small"
                >预览</el-button
              >
              <el-button v-if="(scope.row.trend_state=='草稿'||scope.row.trend_state=='驳回')&&editButtonVisible" 
              @click="handleEdit(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button  @click="handleShowLog(scope.row)" type="text" size="small"
                >操作记录</el-button
              >
              <el-button v-if="scope.row.trend_state=='草稿'" @click="handleDel(scope.row)" type="text" size="small"
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
    <trend-add :trendId="trend_id" @dialogclose="handleClose"></trend-add>
  </el-dialog>

  <el-dialog
    v-model="examineDialogVisible"
    title="审批"
    width="80%"
    height="80%"
    top="20px"
    @close="handleCloseExamine"
    :destroy-on-close="true"
  >
    <trend-examine :trendId="trend_id" @dialogclose="handleCloseExamine"></trend-examine>
  </el-dialog>

  <el-dialog
    v-model="trednExamineLogDialogVisible"
    title="操作日志"
    width="60%"
    top="20px"
    @close="handleCloseLog"
    :destroy-on-close="true"
  >
    <trend-examine-log :trendId="trend_id" @dialogclose="handleCloseLog"></trend-examine-log>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { Search, Plus, Cellphone, Delete } from "@element-plus/icons-vue";
import { getCurrentInstance } from "vue";
import { ref, reactive, onMounted } from "@vue/runtime-core";
import { getTrendBaseList, getColumnType, delTrend } from "../api/serviceApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import TrendAdd from ".//TrendAdd.vue";
import TrendExamineLog from ".//TrendExamineLog.vue";
import TrendExamine from ".//Examine.vue";

export default {
  components: { TrendAdd,TrendExamineLog,TrendExamine },
  methods: {
    //预览
    handleShow(row) {
      // 页面跳转
      const href = this.$router.resolve({
        path: "/TrendShow",
        query: { trendId: row.trend_id },
      });
      window.open(href.href, "_blank");
    },
  },
  setup(props,content) {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let delBtnText=ref("");
    const addButtonVisible=ref(true);//是否显示新增按钮
    const editButtonVisible = ref(false);//是否显示编辑按钮
    const examineButtonVisible=ref(false);//是否显示审批按钮

    let query = reactive({
      params: {
        trendType: "",
        trendState: "",
        trendStateList:"",
        creater:"",
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
      {
        code_name: "待审核",
        code_id: "0403",
      },
      {
        code_name: "驳回",
        code_id: "0404",
      },
    ];
    //下拉数据模型列表
    let trendTypeList = ref([]);
    //table模型
    let trendFormList = ref([]);
    const pageTotal = ref(0);
    //数据模型
    const trendForm = reactive({
      trend_id: "",
      trend_title: "",
      trend_content: "",
      trend_type: "",
      trend_state: "",
    });
    const dateFormatCreateTime=(date) =>{
        return moment(date.create_time).format("YYYY-MM-DD HH:mm:ss");
      };
    const dateFormatPublicTime=(date) =>{
        if(date.trend_state=='已发布')
          return moment(date.public_time).format("YYYY-MM-DD HH:mm:ss");
        else
          return '无';
      };
    const methods = {
      //加载列表
      getTrendList() {
        if(userRole=="0101"){
          query.params.creater="";//管理员展示页面时，creater为空，查询所有人的的
          query.params.trendStateList="0401,0403,0404";
        }else{
          query.params.creater=userId;
          query.params.trendStateList="0401,0402,0403,0404";
        }
        getTrendBaseList(query).then((res) => {
          console.log(res);
          console.log(userId);
          console.log(userRole);
          if (res.resultCode == "200") {
            debugger
            trendFormList.value = JSON.parse(res.data.TrendList);
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
            trendTypeList.value = res.data;
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
      trend_id.value=undefined
      dialogVisible.value = true;
    };

    onMounted(() => {
      getSession();
      methods.getColumnTypeList();
      methods.getTrendList();
      addButtonVisible.value=userRole!='0101';
      editButtonVisible.value=userRole=='0102';
      examineButtonVisible.value=userRole=='0101';
    });
    const dialogVisible = ref(false);//是否显示编辑模态框
    const trednExamineLogDialogVisible=ref(false);//是否显示操作日志模态框
    const examineDialogVisible=ref(false);//是否显示审批模态框
    const trend_id = ref("");

    const handleExamine=(row)=>{
      trend_id.value = row.trend_id;
      examineDialogVisible.value = true;
    };
    const handleEdit = (row)=>{
      trend_id.value = row.trend_id;
      dialogVisible.value = true;
    };
    const handleShowLog=(row)=>{
      //展示审批日志
      trend_id.value = row.trend_id;
      trednExamineLogDialogVisible.value=true;
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
              trend_id: row.trend_id,
              trend_title: row.trend_title,
              admin_id: userId,
              admin_ip: "127.0.0.1",
            },
          };
          delTrend(params)
            .then((res) => {
              if (res.resultCode == "200") {
                ElMessage.success("删除成功");
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
    
    const handleSearch=()=> {
      methods.getTrendList();
    };
    
    // 分页导航
    const handlePageChange = (val) => {
      query.params.pageIndex = val;
      methods.getTrendList();
    };
    
    const handleClose = ()=>{
      trend_id.value = "";
      dialogVisible.value=false;
      handleSearch();
    };
    const handleCloseLog=()=>{
      trend_id.value = "";
      trednExamineLogDialogVisible.value=false;
      handleSearch();
    };
    const handleCloseExamine=()=>{
      console.log("123123123123")
      trend_id.value = "";
      examineDialogVisible.value=false;
      handleSearch();
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
      dateFormatCreateTime,
      dateFormatPublicTime,
      getCurrentInstance,
      userId,
      userRole,
      pageTotal,
      addButtonVisible,
      editButtonVisible,
      examineButtonVisible,
      query,
      trendTypeList,
      stateTypeList,
      trendForm,
      trendFormList,
      methods,
      getSession,

      dialogVisible,
      trednExamineLogDialogVisible,
      examineDialogVisible,
      trend_id,
      handleAdd,
      handleEdit,
      handleShowLog,
      handleExamine,
      handleDel,
      handleClose,
      handleCloseLog,
      handleCloseExamine,
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

