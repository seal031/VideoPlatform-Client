<template>
  <div class="videoList-wrap rel">
  <top-tool-bar></top-tool-bar>
  <div class="portal-wrap width1000">
    <el-breadcrumb separator=">" class="mt20 mb20">
      <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的空间</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs
      tab-position="top"
      style="height: 100%"
      :stretch="false"
    >
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date"></i> 我的收藏</span>
        </template>
        <div class="video-result">
          <div class="tr mb10">
            <el-pagination
              @current-change="handleCurrentChange"
              v-model:currentPage="wdscQuery.params.pageIndex"
              v-model:page-size="wdscQuery.params.pageSize"
              layout="total, prev, pager, next"
              :total="wdscTotalCount"
            >
            </el-pagination>
          </div>
          <div>
            <template v-if="wdscList && wdscList.length > 0">
              <!-- TODO 点击跳转 -->
              <el-row class="video-items">
                <div
                  class="video-item"
                  v-for="(ele, i) in wdscList"
                  :key="i"
                  @click.enter="jump(ele)"
                >
                  <video-item
                    :src="ele.video_facede"
                    :tip="ele.video_title"
                    :videoId="ele.video_id"
                    :viewCount="ele.view_count"
                    :appreciateCount="ele.appreciate_count"
                    :collectionCount="ele.collection_count"
                  />
                  <div>
                    <div><span class="mr5">{{ele.video_title}}</span></div>
                    <div class="redColor">
                      <span class="mr5">{{ ele.award }}</span>
                      <span class="mr2">｜</span>
                      <span>{{ ele.teacher }}</span>
                    </div>
                    <div>
                      {{ ele.video_year }}
                    </div>
                  </div>
                </div>
              </el-row>
            </template>
            <template v-else-if="wdscList">暂无收藏</template>
            <template v-else>暂无收藏</template>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane  v-if="userRole=='0103'">
        <template #label>
          <span><i class="el-icon-date"></i>我的视频</span>
          <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
        </template>
        <div class="video-result">
        <div class="tr mb10">
          <el-pagination
            @current-change="handleCurrentChange"
            v-model:currentPage="wdspQuery.params.pageIndex"
            v-model:page-size="wdspQuery.params.pageSize"
            layout="total, prev, pager, next"
            :total="wdspTotalCount"
          >
          </el-pagination>
        </div>
        <div>
          <template v-if="wdspList && wdspList.length > 0">
            <!-- TODO 点击跳转 -->
            <el-row class="video-items">
              <div
                class="video-item"
                v-for="(ele, i) in wdspList"
                :key="i"
                @click.enter="jump(ele)"
              >
                <video-item
                  :src="ele.video_facede"
                  :tip="ele.video_title"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :collectionCount="ele.collection_count"
                />
                <div>
                  <div><span class="mr5">{{ele.video_title}}</span></div>
                  <div class="redColor">
                    <span class="mr5">{{ ele.award }}</span>
                    <span class="mr2">｜</span>
                    <span>{{ ele.teacher }}</span>
                  </div>
                  <div>
                    {{ ele.video_year }}
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="wdspList">视频资源正在审核中……</template>
          <template v-else>视频列表加载中...</template>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane  v-if="userRole=='0102'">
        <template #label>
          <span :icon="Star"
            ><i class="el-icon-date"></i>
            <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
            本校视频</span>
        </template>
        <div class="video-result">
        <div class="tr mb10">
          <el-pagination
            @current-change="handleCurrentChange"
            v-model:currentPage="bxspQuery.params.pageIndex"
            v-model:page-size="bxspQuery.params.pageSize"
            layout="total, prev, pager, next"
            :total="bxspTotalCount"
          >
          </el-pagination>
        </div>
        <div>
          <template v-if="bxspList && bxspList.length > 0">
            <!-- TODO 点击跳转 -->
            <el-row class="video-items">
              <div
                class="video-item"
                v-for="(ele, i) in bxspList"
                :key="i"
                @click.enter="jump(ele)"
              >
                <video-item
                  :src="ele.video_facede"
                  :tip="ele.video_title"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :collectionCount="ele.collection_count"
                />
                <div>
                  <div><span class="mr5">{{ele.video_title}}</span></div>
                  <div class="redColor">
                    <span class="mr5">{{ ele.award }}</span>
                    <span class="mr2">｜</span>
                    <span>{{ ele.teacher }}</span>
                  </div>
                  <div>
                    {{ ele.video_year }}
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="bxspList">视频资源正在审核中……</template>
          <template v-else>视频列表加载中...</template>
        </div>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="userRole=='0103'">
        <template #label>
          <span :icon="Star"><i class="el-icon-date"></i>
            我的成绩</span>
        </template>
        <div class="video-result">
        <div class="tr mb10">
        </div>
        <div>
          <template v-if="wdcjList && wdcjList.length > 0 ">
            <el-table :data="wdcjList" stripe border style="width: 100%;height: 100%;" lazy>
              <el-table-column prop="teacher" label="姓名" width="100" />
              <el-table-column prop="video_title" label="参赛作品" />
              <el-table-column prop="create_time" label="时间" width="180" />
              <el-table-column prop="video_type" label="活动名称" width="180" />
              <el-table-column prop="video_class" label="分类" width="100" />
              <el-table-column prop="video_group" label="分组" width="100" />
              <el-table-column prop="award" label="奖项" width="100" />
            </el-table>
          </template>
          <template v-else-if="wdcjList">暂无成绩</template>
          <template v-else>视频列表加载中...</template>
        </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane v-if="userRole=='0102'">
        <template #label>
          <span :icon="Star"><i class="el-icon-date"></i>
            本校成绩</span>
        </template>
        <div class="video-result">
        <div class="tr mb10">
        </div>
        <div>
          <template v-if="bxcjList && bxcjList.length > 0 &&userRole=='0102'">
            <el-table :data="bxcjList" stripe border style="width: 100%;height: 100%;" lazy>
              <el-table-column prop="teacher" label="姓名" width="100" />
              <el-table-column prop="video_title" label="参赛作品" />
              <el-table-column prop="create_time" label="时间" width="180" :formatter="methods.dateFormat"/>
              <el-table-column prop="video_type" label="活动名称" width="180" />
              <el-table-column prop="video_class" label="分类" width="100" />
              <el-table-column prop="video_group" label="分组" width="100" />
              <el-table-column prop="award" label="奖项" width="100" />
            </el-table>
          </template>
          <template v-else-if="bxcjList">暂无成绩</template>
          <template v-else>视频列表加载中...</template>
        </div>
        </div>
      </el-tab-pane>

      <el-tab-pane  v-if="userRole=='0102'">
        <template #label>
          <span :icon="Star"
            ><i class="el-icon-date"></i>
            <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
            他校视频</span>
        </template>
        <div class="video-result">
        <div class="tr mb10">
          <el-pagination
            @current-change="handleCurrentChange"
            v-model:currentPage="txspQuery.params.pageIndex"
            v-model:page-size="txspQuery.params.pageSize"
            layout="total, prev, pager, next"
            :total="txspTotalCount"
          >
          </el-pagination>
        </div>
        <div>
          <template v-if="txspList && txspList.length > 0">
            <!-- TODO 点击跳转 -->
            <el-row class="video-items">
              <div
                class="video-item"
                v-for="(ele, i) in txspList"
                :key="i"
                @click.enter="jump(ele)"
              >
                <video-item
                  :src="ele.video_facede"
                  :tip="ele.video_title"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :collectionCount="ele.collection_count"
                />
                <div>
                  <div><span class="mr5">{{ele.video_title}}</span></div>
                  <div class="redColor">
                    <span class="mr5">{{ ele.award }}</span>
                    <span class="mr2">｜</span>
                    <span>{{ ele.teacher }}</span>
                  </div>
                  <div>
                    {{ ele.video_year }}
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="bxspList">视频资源正在审核中……</template>
          <template v-else>视频列表加载中...</template>
        </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <portal-footer></portal-footer>
  </div>
  </div>
</template>

<script>
import { Star, Wallet, OfficeBuilding } from "@element-plus/icons-vue";
import moment from "moment";
import TopToolBar from "../components/TopToolBar.vue";
import PortalFooter from "../components/PortalFooter.vue";
import VideoItem from "../components/VideoItem.vue";
import { getVideoList, getCollectVideoList } from "../api/serviceApi";
import { onMounted, ref, reactive } from "vue";
import { getCurrentInstance, inject } from "@vue/runtime-core";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default {
  components: {
    TopToolBar,
    VideoItem,
    PortalFooter,
  },
  setup() {
    const router = useRouter();
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let wdscList = ref([]); //我的收藏模型列表
    let wdspList = ref([]); //我的视频模型列表
    let bxspList = ref([]); //本校视频模型列表
    let wdcjList=ref([]);//我的成绩视频模型列表
    let bxcjList=ref([]);//本校成绩视频模型列表
    let txspList=ref([]);//他校视频模型列表
    let wdscTotalCount = ref(0);
    let wdspTotalCount = ref(0);
    let bxspTotalCount = ref(0);
    let txspTotalCount=ref(0);
    let wdscQuery = reactive({
      params: {
        userId: "",
        userRole:"",
        videoState: "0401",
        pageIndex: 1,
        pageSize: 20,
      },
    });
    let wdspQuery = reactive({
      params: {
        uploader: "",
        //videoState: "0401", //我的视频含草稿
        pageIndex: 1,
        pageSize: 20,
        userId:"",
        user_school:"",
        userRole:"",
        part:"my",
      },
    });
    let bxspQuery = reactive({
      params: {
        // videoSchool: "",
        videoState: "0401",
        pageIndex: 1,
        pageSize: 20,
        user_school:"",
        userRole:"",
        part:"myschool",
      },
    });
    let wdcjQuery=reactive({//本人成绩
      params:{
        videoState:"0401",
        pageIndex:1,
        pagesize:10000,
        userId:"",
        user_school:"",
        userRole:"",
        part:"my"
      },
    });
    let bxcjQuery=reactive({//本校成绩
      params:{
        videoState:"0401",
        pageIndex:1,
        pagesize:10000,
        userId:"",
        user_school:"",
        userRole:"",
        part:"myschool"
      },
    });
    let txspQuery = reactive({
      params: {
        // videoSchool: "",
        videoState: "0401",
        pageIndex: 1,
        pageSize: 20,
        user_school:"",
        userRole:"",
        part:"otherschool",
      },
    });

    const methods = {
      dateFormat(date) {
        return moment(date).format("YYYY-MM-DD");
      },
    };
    const bindWdscList = () => {
      getCollectVideoList(wdscQuery).then((res) => {
        debugger;
        if (res.resultCode == "200") {
          wdscList.value = JSON.parse(res.data.videoList);
          wdscTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindWdspList = () => {
      getVideoList(wdspQuery).then((res) => {
        if (res.resultCode == "200") {
          wdspList.value = JSON.parse(res.data.videoList);
          wdspTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindBxspList = () => {
      getVideoList(bxspQuery).then((res) => {
        if (res.resultCode == "200") {
          bxspList.value = JSON.parse(res.data.videoList);
          bxspTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindWdcjList=()=>{
      getVideoList(wdcjQuery).then((res) => {
        if (res.resultCode == "200") {
          debugger;
          wdcjList.value = JSON.parse(res.data.videoList);
        }
      });
    };
    const bindBxcjList=()=>{
      getVideoList(bxcjQuery).then((res) => {
        if (res.resultCode == "200") {
          bxcjList.value = JSON.parse(res.data.videoList);
        }
      });
    };
    const bindTxspList = () => {
      getVideoList(txspQuery).then((res) => {
        if (res.resultCode == "200") {
          txspList.value = JSON.parse(res.data.videoList);
          txspTotalCount.value = res.data.totalCount;
        }
      });
    };
    const showVideo = () => {};
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    getSession();
    // 跳转
    const jump = (v) => {
      debugger
      const href = router.resolve({
        path: '/VideoShow',
        query: { videoId:v.video_id},
      });
      window.open(href.href, "_blank");
    };

    onMounted(() => {
      getSession();
      wdscQuery.params.userId=userId;
      wdscQuery.params.userRole=userRole;
      wdscQuery.params.user_school=userSchool;
      wdspQuery.params.userId=userId;
      wdspQuery.params.user_school=userSchool;
      wdspQuery.params.userRole=userRole;
      bxspQuery.params.user_school=userSchool;
      bxspQuery.params.userRole=userRole;
      wdcjQuery.params.userId=userId;
      wdcjQuery.params.user_school=userSchool;
      wdcjQuery.params.userRole=userRole;
      bxcjQuery.params.user_school=userSchool;
      bxcjQuery.params.userRole=userRole;
      txspQuery.params.user_school=userSchool;
      txspQuery.params.userRole=userRole;
      bindWdscList();
      bindWdspList();
      bindBxspList();
      bindWdcjList();
      bindBxcjList();
      bindTxspList();
    });
    return {
      Star,
      Wallet,
      OfficeBuilding,

      userId,
      userRole,
      userName,
      realName,
      userSchool,

      wdscList,
      wdspList,
      bxspList,
      wdcjList,
      bxcjList,
      txspList,
      wdscTotalCount,
      wdspTotalCount,
      bxspTotalCount,
      txspTotalCount,
      wdscQuery,
      wdspQuery,
      bxspQuery,
      wdcjQuery,
      bxcjQuery,
      txspQuery,
      methods,
      bindWdscList,
      bindWdspList,
      bindBxspList,
      bindWdcjList,
      bindBxcjList,
      bindTxspList,
      showVideo,
      getSession,
      jump,
    };
  },
};
</script>

<style scoped>
.portal-wrap {
  height: 100%;
}
.videoList-wrap {
  height: 100%;
  overflow: auto;
}
.query-subjects {
  background-color: #c8e7e2;
  width: 100%;
  position: absolute;
  left: 0;
}
.query-subjects .el-form-item {
  height: 60px;
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
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  font-size: 16px;
}
.video-result {
  margin-top: 0px;
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
  width: 170px;
  margin-bottom: 20px;
  margin-right: 20px;
}
.video-result .video-item:nth-child(5n) {
  margin-right: 0;
}
.redColor {
  color: #de460c;
}
.width1000 {
  width: 1000px;
  margin: 0 auto;
}
</style>