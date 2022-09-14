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
        <el-row>
          <el-col :span="24">
            <el-button type="primary" :icon="Plus" @click="handleAdd()"
              >新增</el-button
            >
          </el-col>
        </el-row>
        <el-divider></el-divider>
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
        关键字
        <el-input
          v-model="query.params.keyword"
          placeholder="请输入关键字"
          clearable
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch()"
          >搜索</el-button
        >
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
          <el-table-column
            prop="create_time"
            label="编辑时间"
            width="200"
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
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <el-dialog
    @dialogclose="handleClose"
    v-model="dialogVisible"
    title="内容详情"
    width="80%"
    top="20px"
    @close="handleClose"
  >
    <column-add :briefId="brief_id"></column-add>
  </el-dialog>
</template>

<script>
import { Search, Plus, Cellphone, Delete } from "@element-plus/icons-vue";
import { getCurrentInstance } from "vue";
import { ref, reactive, onMounted } from "@vue/runtime-core";
import { getBriefBaseList, getColumnType, delBrief } from "../api/serviceApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import ColumnAdd from ".//ColumnAdd.vue";

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
    //编辑
    // handleEdit(row) {
    //   this.$router.resolve({
    //     path: "/ColumnAdd",
    //     query: { briefId: row.brief_id, isReadonly: false },
    //   });
    // },
    //删除
    handleDel(row) {
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
              admin_id: "",
              admin_ip: "127.0.0.1",
            },
          };
          delBrief(params)
            .then((res) => {
              if (res.resultCode == "200") {
                this.methods.getBriefList();
                ElMessage.success("删除成功");
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
        .catch(() => {});
    },
  },
  setup() {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

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
    //数据模型
    const briefForm = reactive({
      brief_id: "",
      brief_title: "",
      brief_content: "",
      brief_type: "",
      brief_state: "",
    });
    const methods = {
      //加载列表
      getBriefList() {
        getBriefBaseList(query).then((res) => {
          console.log(res);
          if (res.resultCode == "200") {
            briefFormList.value = JSON.parse(res.data.BriefList);
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
    const brief_id = ref("");

    const handleEdit = (row)=>{
      brief_id.value = row.brief_id;
      dialogVisible.value = true;
    };
    
    const handleSearch=()=> {
      methods.getBriefList();
    };
    
    const handleClose = ()=>{
      debugger
      dialogVisible.value=false;
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

      getCurrentInstance,
      userId,
      userRole,
      query,
      briefTypeList,
      stateTypeList,
      briefForm,
      briefFormList,
      methods,
      getSession,

      dialogVisible,
      brief_id,
      handleAdd,
      handleEdit,
      handleClose,
      handleSearch,
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

