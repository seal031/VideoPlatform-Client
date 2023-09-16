<template>
  <!-- <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <i class="el-icon-lx-calendar"></i> 视频资源管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>视频列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div> -->
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
            视频分类
            <el-select
              v-model="query.params.videoType"
              clearable
              placeholder="请选择"
              class="handle-select mr10"
            >
            <el-option
              v-for="(item, c) in videoTypeList"
              :key="c"
              :label="item.code_name"
              :value="item.code_id"
            ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="4">
          <el-form-item>
            年度
            <el-date-picker
              v-model="query.params.videoYear"
              type="year"
              value-format="YYYY"
              placeholder="请选择"
              style="width: 150px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="4">
          <el-form-item>
            视频开放
            <el-select
              v-model="query.params.publicType"
              clearable
              placeholder="请选择"
              class="handle-select mr10"
            >
              <el-option
                v-for="(item, c) in publicTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            视频状态
            <el-select
              v-model="query.params.videoState"
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
        <el-col :span="4">
          <el-form-item>
            是否首页显示
            <el-switch v-model="query.params.on_portal" active-value="1" inactive-value="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            关键字
            <el-input
              v-model="query.params.keyword"
              placeholder="请输入关键字"
              class="handle-input mr10"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch"
              >搜索</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <el-table :data="tableData" stripe border style="width: 100%" lazy>
      <el-table-column prop="video_title" label="视频标题" width="150">
      </el-table-column>
      <el-table-column prop="video_type" label="视频分类" width="90">
      </el-table-column>
      <el-table-column prop="video_year" label="时间" width="90">
      </el-table-column>
      <el-table-column prop="video_group" label="组别" width="70">
      </el-table-column>
      <el-table-column prop="video_class" label="类别" width="80">
      </el-table-column>
      <el-table-column prop="award" label="获奖情况" width="90">
      </el-table-column>
      <el-table-column prop="teacher" label="教师" width="80">
      </el-table-column>
      <el-table-column prop="video_school" label="单位" width="150">
      </el-table-column>
      <el-table-column prop="public_type" label="视频开放" width="90">
      </el-table-column>
      <el-table-column prop="video_state" label="视频状态" width="90">
      </el-table-column>
      <el-table-column prop="on_portal" label="首页显示" width="90" :formatter="OnPortalFormat">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="text" size="small"
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
  <el-dialog
    v-model="dialogVisible"
    title="编辑视频"
    width="70%"
    top="20px"
    @close="handleClose"
  >
    <video-add :video-id="video_id" @dialogclose="handleClose"></video-add>
  </el-dialog>
</template>

<script>
import { Search, Plus, Cellphone, Delete } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getVideoType,
  getVideoPublicType,
  getVideoList,
  getVideoClass,
  getVideoJieCi,
  deleteVideo,
  deleteAliyunVideo,
} from "../api/serviceApi";
import VideoItem from "../components/VideoItem.vue";
import VideoAdd from ".//VideoAdd.vue";

export default {
  name: "videolist",
  components: { VideoItem, VideoAdd},
  // methods: {
  //   //编辑操作
  //   handleEdit(row) {
  //     debugger;
  //     this.$router.resolve({
  //       path: "/VideoAdd",
  //       query: { videoId: row.video_id },
  //     });
  //   },
  // },
  setup() {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let query = reactive({
      params: {
        videoType: "",
        videoYear: null,
        keyword: "",
        publicType: "",
        videoState: "",
        on_portal:0,
        pageIndex: 1,
        pageSize: 10,
      },
    });
    let videoTypeList = ref([]);
    let publicTypeList = ref([]);
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
    const tableData = ref([]);
    const pageTotal = ref(0);
    const OnPortalFormat=(v) =>{
        return v.on_portal==1?"是":"否";
      };
    onMounted(() => {
      getSession();
      getVideoType().then((res) => {
        // debugger;
        videoTypeList.value = res.data;
      });
      getVideoPublicType().then((res) => {
        // debugger;
        publicTypeList.value = res.data;
      });
      getData();
    });
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    // 获取视频列表
    const getData = () => {
      query.params.userRole=userRole;
      query.params.orderBy="award";
      getVideoList(query).then((res) => {
        tableData.value = JSON.parse(res.data.videoList);
        pageTotal.value = res.data.totalCount || 50;
      });
    };
    //新增
    const handleAdd = () => {
      video_id.value = undefined;
      dialogVisible.value = true;
    };

    // 查询操作
    const handleSearch = () => {
      query.params.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.params.pageIndex = val;
      getData();
    };

    var videoToDelete;
    // 删除操作
    const handleDelete = (video) => {
      videoToDelete=video;
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          //判断是否阿里云视频
          if(videoToDelete.aliyun_videoId!=null){
            let queryDeleteAliyun = {
              params: {
                accessKeyId: "c9FjqwmD4XLC5H2M",
                accessKeySecret:"V5NBQA3zN9dP78b9XLai3APQ5EFM3V",
                videoId:videoToDelete.aliyun_videoId,
              },
            };
            deleteAliyunVideo(queryDeleteAliyun).then((res)=>{
              if(res.resultCode=="200"&&res.data.ErrorMessage==""){
              }else{
                ElMessage({
                  message: "删除云视频失败."+res.data.ErrorMessage,
                  grouping: true,
                  type: "error",
                });
              }
            });
          }
          let query = {
              params: {
                video_id: videoToDelete.video_id,
                video_title:videoToDelete.video_title,
                admin_id: userId,
                admin_ip: "127.0.0.1",
              },
            };
          deleteVideo(query).then((res)=>{
            if(res.resultCode=="200"&&res.data=="success"){
                ElMessage.success("删除成功");
                handleSearch();
              }else{
                ElMessage({
                  message: "删除视频失败."+res.data.message,
                  grouping: true,
                  type: "error",
                });
              }
          });
          // tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };


    const dialogVisible = ref(false);
    const video_id = ref("");

    const handleEdit = (row)=>{
      video_id.value = row.video_id;
      dialogVisible.value = true;
    };
    
    const handleClose = ()=>{
      video_id.value = "";
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
      videoTypeList,
      publicTypeList,
      stateTypeList,
      tableData,
      pageTotal,
      handleAdd,
      handleSearch,
      handlePageChange,
      videoToDelete,
      handleDelete,
      getSession,

      dialogVisible,
      video_id,
      handleEdit,
      handleClose,

      OnPortalFormat,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 10px;
}

.handle-select {
  width: 130px;
}

.handle-input {
  width: 200px;
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