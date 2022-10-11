<template>
    <div class="videoList-wrap rel">
    <top-tool-bar></top-tool-bar>
    <div class="portal-wrap width1000">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs
        tab-position="top"
        style="height: 100%"
        type="border-card"
        :stretch="false"
      >
        <el-tab-pane>
          <template #label>
            <span><i class="el-icon-date"></i> 图片新闻</span>
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChange"
                v-model:currentPage="videoQuery.params.pageIndex"
                v-model:page-size="videoQuery.params.pageSize"
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
                        {{ ele.video_year }}年度
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
            <span><i class="el-icon-date"></i>通知公告</span>
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
                      {{ ele.video_year }}年度
                    </div>
                  </div>
                </div>
              </el-row>
            </template>
            <template v-else-if="wdspList">暂无视频</template>
            <template v-else>视频列表加载中...</template>
          </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>
              <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
              政策法规</span>
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
                      {{ ele.video_year }}年度
                    </div>
                  </div>
                </div>
              </el-row>
            </template>
            <template v-else-if="bxspList">暂无视频</template>
            <template v-else>视频列表加载中...</template>
          </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>
              <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
              优秀视频</span>
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
                      {{ ele.video_year }}年度
                    </div>
                  </div>
                </div>
              </el-row>
            </template>
            <template v-else-if="bxspList">暂无视频</template>
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
  import { getVideoList, getBriefList } from "../api/serviceApi";
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
      let keyword="";//搜索关键字
      let userId = "";
      let userRole = "";
      let userName = "";
      let realName = ref("");
      let userSchool = "";
        
      let allBriefList=ref([]);//全部文字新闻列表
        let tpxwList = ref([]); //图片新闻模型列表
        let tzggList = ref([]); //通知公告模型列表
        let zcfgList = ref([]); //政策法规模型列表
        let tpxwTotalCount = ref(0); // 图片新闻总数
        let tzggTotalCount = ref(0); // 通知公告总数
        let zcfgTotalCount = ref(0); // 政策法规总数
        let tpxwQuery = reactive({
        params: {
            briefType: "0503", //图片新闻
            briefState: "0401", //已发布
            pageIndex: 1,
            pageSize: 20,
            topN: 20,
        },
        });
        let tzggQuery = reactive({
        params: {
            briefType: "0501", //通知公告
            briefState: "0401", //已发布
            pageIndex: 1,
            pageSize: 20,
            topN: 20,
        },
        });
        let zcfgQuery = reactive({
        params: {
            briefType: "0502", //政策法规
            briefState: "0401", //已发布
            pageIndex: 1,
            pageSize: 20,
            topN: 20,
        },
        });
  
      const methods = {
        getParams() {
            keyword= route.query.activeTab;
        },
        dateFormat(date) {
          return moment(date).format("YYYY-MM-DD");
        },
      };
      const bindVideoList = () => {
        getCollectVideoList(videoQuery).then((res) => {
          debugger;
          if (res.resultCode == "200") {
            wdscList.value = JSON.parse(res.data.videoList);
            wdscTotalCount.value = res.data.totalCount;
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
        debugger
        const href = router.resolve({
          path: '/VideoShow',
          query: { videoId:v.video_id},
        });
        window.open(href.href, "_blank");
      };
  
      onMounted(() => {
        getSession();
        methods.getParams();
        videoQuery.params.userId=userId;
        videoQuery.params.userRole=userRole;
        videoQuery.params.user_school=userSchool;
        wdspQuery.params.userId=userId;
        wdspQuery.params.user_school=userSchool;
        wdspQuery.params.userRole=userRole;
        bxspQuery.params.user_school=userSchool;
        bxspQuery.params.userRole=userRole;
        bindVideoList();
      });
      return {
        Star,
        Wallet,
        OfficeBuilding,
        
        keyword,
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
        videoQuery,
        methods,
        bindVideoList,
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