<template>
  <top-tool-bar></top-tool-bar>
  <div class="portal-wrap">
    <el-tabs
      tab-position="left"
      style="height: 100%; weight: 400px"
      type="border-card"
      :stretch="true"
    >
      <el-tab-pane>
        <template #label>
          <span><i class="el-icon-date"></i> 我的收藏</span>
        </template>
        <div class="videoList-wrap rel">
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
                  @click.enter="onClick(v)"
                >
                  <video-item
                    :src="ele.video_facede"
                    :videoId="ele.video_id"
                    :viewCount="ele.view_count"
                    :appreciateCount="ele.appreciate_count"
                    :collectionCount="ele.collection_count"
                  />
                  <div>
                    <!-- TODO 替换title -->
                    <div>{{ ele.video_title }}</div>
                    <!-- <span class="mr2">大学物理</span> -->
                    <span class="mr1">{{ ele.video_brief }}</span>
                    <span class="mr1">｜</span>
                    <span>{{ ele.teacher }}</span>
                    <div class="redColor mt5">
                      <span class="mr5">{{ ele.award }}</span>
                      <!-- <span class="mr5">一等奖</span> -->
                    </div>
                  </div>
                </div>
              </el-row>
            </template>
            <template v-else-if="wdscList">暂无视频</template>
            <template v-else>视频列表加载中...</template>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span
            ><i class="el-icon-date"></i
            >&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;我的视频</span
          >
        </template>
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
                @click.enter="onClick(v)"
              >
                <video-item
                  :src="ele.video_facede"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :collectionCount="ele.collection_count"
                />
                <div>
                  <!-- TODO 替换title -->
                  <div>{{ ele.video_title }}</div>
                  <!-- <span class="mr2">大学物理</span> -->
                  <span class="mr1">{{ ele.video_brief }}</span>
                  <span class="mr1">｜</span>
                  <span>{{ ele.teacher }}</span>
                  <div class="redColor mt5">
                    <span class="mr5">{{ ele.award }}</span>
                    <!-- <span class="mr5">一等奖</span> -->
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="wdspList">暂无视频</template>
          <template v-else>视频列表加载中...</template>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span :icon="Star"
            ><i class="el-icon-date"></i
            >&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;本校视频</span
          >
        </template>
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
                @click.enter="onClick(v)"
              >
                <video-item
                  :src="ele.video_facede"
                  :videoId="ele.video_id"
                  :viewCount="ele.view_count"
                  :appreciateCount="ele.appreciate_count"
                  :collectionCount="ele.collection_count"
                />
                <div>
                  <!-- TODO 替换title -->
                  <div>{{ ele.video_title }}</div>
                  <!-- <span class="mr2">大学物理</span> -->
                  <span class="mr1">{{ ele.video_brief }}</span>
                  <span class="mr1">｜</span>
                  <span>{{ ele.teacher }}</span>
                  <div class="redColor mt5">
                    <span class="mr5">{{ ele.award }}</span>
                    <!-- <span class="mr5">一等奖</span> -->
                  </div>
                </div>
              </div>
            </el-row>
          </template>
          <template v-else-if="bxspList">暂无视频</template>
          <template v-else>视频列表加载中...</template>
        </div>
      </el-tab-pane>
    </el-tabs>

    <portal-footer></portal-footer>
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

export default {
  components: {
    TopToolBar,
    VideoItem,
    PortalFooter,
  },
  setup() {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let wdscList = ref([]); //我的收藏模型列表
    let wdspList = ref([]); //我的视频模型列表
    let bxspList = ref([]); //本校视频模型列表
    let wdscTotalCount = ref(0);
    let wdspTotalCount = ref(0);
    let bxspTotalCount = ref(0);
    let wdscQuery = reactive({
      params: {
        userId: "",
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
      },
    });
    let bxspQuery = reactive({
      params: {
        videoSchool: "",
        videoState: "0401",
        pageIndex: 1,
        pageSize: 20,
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
    const showVideo = () => {};
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };

    onMounted(() => {
      getSession();
      wdscQuery.params.userId=userId;
      wdspQuery.params.uploader=userId;
      bxspQuery.params.videoSchool=userSchool;
      bindWdscList();
      bindWdspList();
      bindBxspList();
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
      wdscTotalCount,
      wdspTotalCount,
      bxspTotalCount,
      wdscQuery,
      wdspQuery,
      bxspQuery,
      methods,
      bindWdscList,
      bindWdspList,
      bindBxspList,
      showVideo,
      getSession,
    };
  },
};
</script>

<style scoped>
.portal-wrap {
  height: 100%;
  overflow: auto;
}
.videoList-wrap {
  height: 100%;
  overflow: auto;
}
.width1200 {
  width: 1200px;
  margin: 0 auto;
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
  margin-right: 80px;
}
.video-result .video-item:nth-child(5n) {
  margin-right: 0;
}
.redColor {
  color: #de460c;
}
</style>