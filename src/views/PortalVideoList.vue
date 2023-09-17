<template>
  <div class="videoList-wrap rel wrapper-sticky">
    <top-tool-bar></top-tool-bar>
    <!-- <portal-header></portal-header> -->
    <div class="width1000">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <!-- TODO 名称传递 -->
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>优秀视频</el-breadcrumb-item>
        <el-breadcrumb-item>{{tabText}}</el-breadcrumb-item>
      </el-breadcrumb>

      <el-form class="query-subjects">
        <div class="width1000">
          <el-form-item>
            <span class="label">年度</span>
            <el-radio-group
              v-model="query.params.videoYear"
              @change="videoYearChange"
            >
              <!-- <el-radio-button label="第十一届"></el-radio-button>
              <el-radio-button label="第十二届"></el-radio-button> -->
              <el-radio-button v-for="vyl in videoYearList" :label="vyl.name" :key="vyl.name"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="showVideoClass">
            <span class="label">科目</span>
            <!-- <el-radio-group
              v-model="query.params.videoClass"
              @change="videoClassChange"
            >
              <el-radio-button label="工科类"></el-radio-button>
              <el-radio-button label="理科类"></el-radio-button>
              <el-radio-button label="文科类"></el-radio-button>
              <el-radio-button label="医科类"></el-radio-button>
            </el-radio-group> -->
            <el-radio-group
            v-model="query.params.videoClass"
            @change="videoClassChange"
            >
              <el-radio-button v-for="vcl in videoClassList" :label="vcl.name" :key="vcl.name"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="showVideoGroup">
            <span class="label">组别</span>
            <el-radio-group
              v-model="query.params.videoGroup"
              @change="videoGroupChange"
            >
              <el-radio-button label="A组"></el-radio-button>
              <el-radio-button label="B组"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item>
            <span class="label">视频分类</span>
            <el-radio-group
              v-model="tabText"
              @change="videoTypeChange"
            >
              <el-radio-button label="青教赛"></el-radio-button>
              <el-radio-button label="青管赛"></el-radio-button>
              <el-radio-button label="师德榜样"></el-radio-button>
              <el-radio-button label="云课堂"></el-radio-button>
            </el-radio-group>
          </el-form-item> -->
        </div>
      </el-form>

      <div class="video-result">
        <div class="tr mb10">
          <el-pagination
            @current-change="handleCurrentChange"
            v-model:currentPage="query.params.pageIndex"
            v-model:page-size="query.params.pageSize"
            layout="total, prev, pager, next"
            :total="totalCount"
          >
          </el-pagination>
        </div>

        <div>
          <template v-if="tableData && tableData.length > 0">
            <!-- TODO 点击跳转 -->
            <el-row class="video-items">
              <div
                class="video-item poi"
                v-for="(ele, i) in tableData"
                :key="i"
                @click.enter="jump(ele)"
              >
                <video-item
                  :src="ele.video_facede"
                  :tip="ele.video_title"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                />
                <div>
                  <div>
                    <span class="mr5">{{ele.video_title}}</span>
                  </div>
                  <div class="redColor">
                    <span class="mr5">{{ele.award}}</span>
                    <span class="mr2">｜</span>
                    <span>{{ele.teacher}}</span>
                  </div>
                  <div>
                    {{ele.video_year}}
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="tableData">视频资源正在审核中……</template>
          <template v-else>视频列表加载中...</template>
        </div>
      </div>
    </div>
    <portal-footer></portal-footer>
  </div>
</template>

<script>
import TopToolBar from "../components/TopToolBar.vue";
import portalHeader from "../components/PortalHeader.vue";
import VideoItem from "../components/VideoItem.vue";
import PortalFooter from "../components/PortalFooter.vue";
import { getVideoList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance, computed } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default {
  components: {
    TopToolBar,
    portalHeader,
    VideoItem,
    PortalFooter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    let activeTab=ref("");
    let tabText=ref("");
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let query = reactive({
      params: {
        videoType: "",
        videoTypeName: "",
        videoYear: "",//null,
        keyword: "",
        publicType: "",
        videoState: "0401",
        videoGroup:"",
        videoClass:"",
        pageIndex: 1,
        pageSize: 20,
        userId:userId,
        user_school:userSchool,
        userRole:userRole,
      },
    });
    let videoTypeList = ref([]);
    const tableData = ref([]);
    const totalCount = ref(0); // 总数
    const videoStates = [
      { value: "01", label: "点播" },
      { value: "02", label: "关注" },
      { value: "03", label: "转发" },
    ];
    const videoGroupList=ref([]);

    const showVideoGroup=ref(true);
    const showVideoClass=ref(true);
    let videoYearList=ref([]);//年度选项
    let videoClassList=ref([]);//类别选项

    const getVideo = () => {
      query.params.userId=userId;
      query.params.user_school=userSchool;
      query.params.userRole=userRole;
      getVideoList(query).then((res) => {
        if (res.resultCode == "200") {
          tableData.value = JSON.parse(res.data.videoList);
          totalCount.value = res.data.totalCount;
        }
      });
    };
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    // 跳转
    const jump = (v) => {
      const href = router.resolve({
        path: '/VideoShow',
        query: { videoId:v.video_id},
      });
      window.open(href.href, "_blank");
    };

    onMounted(() => {
      methods.getParams();
      getSession();
      getVideo();
    });
    const videoTypeChange = (value) => {
      switch (value) {
        case "青教赛":
          query.params.videoType = "0201";
          break;
        case "青管赛":
          query.params.videoType = "0202";
          break;
        case "师德榜样":
          query.params.videoType = "0203";
          break;
        case "云课堂":
          query.params.videoType = "0204";
          break;
        default:
          break;
      }
      getVideo();
    };
    const videoYearChange = (value) => {
      query.params.videoYear = value;//parseInt(value);
      getVideo();
    };
    const videoStateChange = (value) => {
      query.params.videoState = value;
      getVideo();
    };
    const videoGroupChange=(value)=>{
      query.params.videoGroup = value;
      getVideo();
    };
    const videoClassChange=(value)=>{
      debugger
      query.params.videoClass = value;
      getVideo();
    };
    const handleCurrentChange=(val) =>{
        console.log(`当前页: ${val}`)
        query.params.pageIndex=val;
        getVideo();
      };
    const methods = {
      getParams() {
        activeTab.value = route.query.activeTab;
        switch (activeTab.value) {
          case "qjs":
            tabText.value = "青教赛";
            query.params.videoType = "0201";
            showVideoGroup.value=true;
            showVideoClass.value=true;
            videoClassList.value=[
              {value:'理科类',name:'理科类'},
              {value:'工科类',name:'工科类'},
              {value:'文科类',name:'文科类'},
              {value:'医科类',name:'医科类'},
            ];
            videoYearList.value=[
              {value:'第十一届',name:'第十一届'},
              {value:'第十二届',name:'第十二届'},
            ];
            break;
          case "qgs":
            tabText.value = "青管赛";
            query.params.videoType = "0202";
            showVideoGroup.value=true;
            showVideoClass.value=false;
            videoClassList.value=[
              {value:'理科类',name:'理科类'},
              {value:'工科类',name:'工科类'},
              {value:'文科类',name:'文科类'},
              {value:'医科类',name:'医科类'},
            ];
            videoYearList.value=[
              {value:'第十一届',name:'第十一届'},
              {value:'第十二届',name:'第十二届'},
            ];
            break;
          case "sdby":
            tabText.value = "师德榜样";
            query.params.videoType = "0203";
            showVideoGroup.value=false;
            showVideoClass.value=true;
            videoClassList.value=[
              {value:'高校',name:'高校'},
              {value:'普教',name:'普教'},
            ];
            videoYearList.value=[
              {value:'2021年',name:'2021年'},
              {value:'2022年',name:'2022年'},
              {value:'2023年',name:'2023年'},
            ];
            break;
          case "ykt":
            tabText.value = "云课堂";
            query.params.videoType = "0204";
            showVideoGroup.value=false;
            showVideoClass.value=false;
            break;
        }
      },
    }
    return {
      activeTab,
      tabText,
      userId,
      userRole,
      userName,
      realName,
      userSchool,

      showVideoGroup,
      showVideoClass,
      videoYearList,
      videoClassList,

      videoStates,
      getCurrentInstance,
      userId,
      userRole,
      query,
      videoTypeList,
      tableData,
      totalCount,
      getVideo,
      videoTypeChange,
      videoYearChange,
      videoGroupChange,
      videoClassChange,
      videoStateChange,
      handleCurrentChange,
      getSession,
      methods,
      jump,
    };
  },
};
</script>

<style scoped>
.videoList-wrap {
  /* height: 100%;
  overflow: auto; */
}
.width1000 {
  width: 1000px;
  margin: 0 auto;
}
.query-subjects {
  background-color: #c8e7e2;
  width: 100%;
  position: absolute;
  left: 0;
}
.query-subjects .el-form-item {
  height: 45px;
  border-bottom: 1px solid #bbb;
  margin-bottom: 0;
}
.query-subjects .el-form-item:first-child {
  border-top: 1px solid #bbb;
}
.query-subjects .label {
  width: 90px;
  font-size: 18px;
}
.query-subjects .el-radio-button {
  --el-radio-button-checked-bg-color: #09a991;
  --el-radio-button-checked-border-color: #09a991;
}
.query-subjects :deep .el-radio-button__inner {
  background: var(--el-button-bg-color, transparent);
  border: none !important;
  border-radius: 0 !important;
  height: 45px;
  line-height: 45px;
  padding: 0 20px;
  font-size: 16px;
}
.video-result {
  margin-top: 174px;
}
.video-result .el-radio-button {
  --el-radio-button-checked-bg-color: white;
  --el-radio-button-checked-border-color: #dcdfe6;
  --el-radio-button-checked-text-color: #de460c;
  --el-button-bg-color: #ddd;
}

.video-result .video-items {
  font-size: 13px;
}
.video-result .video-item {
  /* 视频比是16:9 */
  width: 176px;
  margin-bottom: 35px;
  margin-right: 30px;
}
.video-result .video-item:nth-child(5n) {
  margin-right: 0;
}
.redColor {
  color: #de460c;
}
</style>

