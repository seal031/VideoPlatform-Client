<template>
  <div class="videoList-wrap rel wrapper-sticky">
    <top-tool-bar :keyword="keyword"></top-tool-bar>
    <div class="portal-wrap width1000">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="result">约有 <span class="red-result">{{ allTotalCount }}</span> 项符合查询的结果</div>
      <el-tabs
        class="demo-tabs"
        tab-position="top"
        style="height: 100%"
        :stretch="false"
      >
        <el-tab-pane>
          <template #label>
            <span
              ><i class="el-icon-date"></i> 图片新闻({{ tpxwTotalCount }})</span
            >
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeTpxw"
                v-model:currentPage="tpxwQuery.params.pageIndex"
                v-model:page-size="tpxwQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="tpxwTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <template v-if="tpxwList && tpxwList.length > 0">
                <el-table
                  :data="tpxwList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="videoList">无符合条件结果</template>
              <template v-else>检索中...</template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span
              ><i class="el-icon-date"></i>通知公告({{ tzggTotalCount }})</span
            >
            <!-- &#12288;&#12288;&#12288;&#12288;&#12288;&#12288; -->
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeTzgg"
                v-model:currentPage="tzggQuery.params.pageIndex"
                v-model:page-size="tzggQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="tzggTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <template v-if="tzggList && tzggList.length > 0">
                <el-table
                  :data="tzggList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="tzggList">无符合条件结果</template>
              <template v-else>检索中...</template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>政策法规({{ zcfgTotalCount }})</span
            >
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeZcfg"
                v-model:currentPage="zcfgQuery.params.pageIndex"
                v-model:page-size="zcfgQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="zcfgTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <template v-if="zcfgList && zcfgList.length > 0">
                <el-table
                  :data="zcfgList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="zcfgList">无符合条件结果</template>
              <template v-else>检索中...</template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>优秀视频({{ videoTotalCount }})</span
            >
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeVideo"
                v-model:currentPage="videoQuery.params.pageIndex"
                v-model:page-size="videoQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="videoTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <template v-if="videoList && videoList.length > 0">
                <!-- TODO 点击跳转 -->
                <el-row class="video-items">
                  <div
                    class="video-item"
                    v-for="(ele, i) in videoList"
                    :key="i"
                    @click.enter="jumpVideo(ele)"
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
                      <div>
                        <span class="mr5">{{ ele.video_title }}</span>
                      </div>
                      <div class="redColor">
                        <span class="mr5">{{ ele.award }}</span>
                        <span class="mr2">｜</span>
                        <span>{{ ele.teacher }}</span>
                      </div>
                      <div>{{ ele.video_year }}</div>
                    </div>
                  </div>
                </el-row>
              </template>
              <template v-else-if="zcfgList">无符合条件结果</template>
              <template v-else>视频列表加载中...</template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>北京教工({{ bjjgTotalCount }})</span
            >
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeBjjg"
                v-model:currentPage="bjjgQuery.params.pageIndex"
                v-model:page-size="bjjgQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="bjjgTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <template v-if="bjjgList && bjjgList.length > 0">
                <el-table
                  :data="bjjgList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="bjjgList">无符合条件结果</template>
              <template v-else>检索中...</template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>先进个人({{ xjgrTotalCount }})</span
            >
          </template>
          <div>
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeXjgr"
                v-model:currentPage="xjgrQuery.params.pageIndex"
                v-model:page-size="xjgrQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="xjgrTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <portal-notice :data="xjgrList"></portal-notice>
              <!-- <template v-if="xjgrList && xjgrList.length > 0">
                <el-table
                  :data="xjgrList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="xjgrList">无符合条件结果</template>
              <template v-else>检索中...</template> -->
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span :icon="Star"
              ><i class="el-icon-date"></i>先进单位({{ xjdwTotalCount }})</span
            >
          </template>
          <div class="video-result">
            <div class="tr mb10">
              <el-pagination
                @current-change="handleCurrentChangeXjdw"
                v-model:currentPage="xjdwQuery.params.pageIndex"
                v-model:page-size="xjdwQuery.params.pageSize"
                layout="total, prev, pager, next"
                :total="xjdwTotalCount"
              >
              </el-pagination>
            </div>
            <div>
              <portal-notice :data="xjdwList"></portal-notice>
              <!-- <template v-if="xjdwList && xjdwList.length > 0">
                <el-table
                  :data="xjdwList"
                  style="width: 100%"
                  :show-header="false"
                  class="customer-table poi"
                  @row-click="jumpBrief"
                >
                  <el-table-column prop="brief_title" label="">
                  </el-table-column>
                  <el-table-column
                    prop="create_time"
                    label=""
                    width="150"
                    :formatter="methods.dateFormat"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else-if="xjdwList">无符合条件结果</template>
              <template v-else>检索中...</template> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <portal-footer></portal-footer>
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
import { getCurrentInstance, inject, onUpdated } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import PortalNotice from './subpages/PortalNotice.vue';

export default {
  components: {
    TopToolBar,
    VideoItem,
    PortalFooter,
    PortalNotice,
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    const router = useRouter();
    let keyword = ref(""); //搜索关键字
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let tpxwList = ref([]); //图片新闻模型列表
    let tzggList = ref([]); //通知公告模型列表
    let zcfgList = ref([]); //政策法规模型列表
    let videoList = ref([]); //视频列表
    let bjjgList=ref([]);//北京教工模型列表
    let xjgrList=ref([]);//先进个人模型列表
    let xjdwList=ref([]);//先进单位模型列表
    let tpxwTotalCount = ref(0); // 图片新闻总数
    let tzggTotalCount = ref(0); // 通知公告总数
    let zcfgTotalCount = ref(0); // 政策法规总数
    let videoTotalCount = ref(0); //视频总数
    let bjjgTotalCount=ref(0);//北京教工总数
    let xjgrTotalCount=ref(0);//先进个人总数
    let xjdwTotalCount=ref(0);//先进单位总数
    let allTotalCount = ref(""); //查询结果总数
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
    let videoQuery = reactive({
      params: {
        videoType: "",
        videoTypeName: "",
        videoYear: null,
        keyword: "",
        publicType: "",
        videoState: "0401",
        pageIndex: 1,
        pageSize: 15,
        userId: userId,
        user_school: userSchool,
        userRole: userRole,
      },
    });
    let bjjgQuery = reactive({
      params: {
        briefType: "0506", //北京教工
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let xjgrQuery = reactive({
      params: {
        briefType: "0507", //先进个人
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let xjdwQuery = reactive({
      params: {
        briefType: "0508", //先进单位
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });

    const methods = {
      getParams() {
        keyword.value = route.query.keyword;
      },
      dateFormat(date) {
        return moment(date.create_time).format("YYYY-MM-DD");
      },
    };

    const bindTpxw = async () => {
      await getBriefList(tpxwQuery).then((res) => {
        if (res.resultCode == "200") {
          tpxwList.value = JSON.parse(res.data.BriefList);
          tpxwTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindTzgg = async () => {
      await getBriefList(tzggQuery).then((res) => {
        if (res.resultCode == "200") {
          tzggList.value = JSON.parse(res.data.BriefList);
          tzggTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindZcfg = async () => {
      await getBriefList(zcfgQuery).then((res) => {
        if (res.resultCode == "200") {
          zcfgList.value = JSON.parse(res.data.BriefList);
          zcfgTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindBjjg = async () => {
      await getBriefList(bjjgQuery).then((res) => {
        if (res.resultCode == "200") {
          bjjgList.value = JSON.parse(res.data.BriefList);
          bjjgTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindXjgr = async () => {
      await getBriefList(xjgrQuery).then((res) => {
        if (res.resultCode == "200") {
          xjgrList.value = JSON.parse(res.data.BriefList);
          xjgrTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindXjdw = async () => {
      await getBriefList(xjdwQuery).then((res) => {
        if (res.resultCode == "200") {
          xjdwList.value = JSON.parse(res.data.BriefList);
          xjdwTotalCount.value = res.data.totalCount;
        }
      });
    };
    const bindVideoList = async () => {
      //获取视频
      await getVideoList(videoQuery).then((res) => {
        if (res.resultCode == "200") {
          videoList.value = JSON.parse(res.data.videoList);
          videoTotalCount.value = res.data.totalCount;
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

    const handleCurrentChangeTpxw = (val) => {
      tpxwQuery.params.pageIndex = val;
      bindTpxw();
    };
    const handleCurrentChangeTzgg = (val) => {
      tzggQuery.params.pageIndex = val;
      bindTzgg();
    };
    const handleCurrentChangeZcfg = (val) => {
      zcfgQuery.params.pageIndex = val;
      bindZcfg();
    };
    const handleCurrentChangeVideo = (val) => {
      videoQuery.params.pageIndex = val;
      bindVideoList();
    };
    const handleCurrentChangeBjjg = (val) => {
      bjjgQuery.params.pageIndex = val;
      bindBjjg();
    };
    const handleCurrentChangeXjgr = (val) => {
      xjgrQuery.params.pageIndex = val;
      bindXjgr();
    };
    const handleCurrentChangeXjdw = (val) => {
      xjdwQuery.params.pageIndex = val;
      bindXjdw();
    };

    // 跳转
    const jumpVideo = (v) => {
      debugger;
      const href = router.resolve({
        path: "/VideoShow",
        query: { videoId: v.video_id },
      });
      window.open(href.href, "_blank");
    };
    const jumpBrief = (b) => {
      const href = router.resolve({
        path: "/BriefShow",
        query: { briefId: b.brief_id },
      });
      window.open(href.href, "_blank");
    };

    onMounted(async () => {
      getSession();
      methods.getParams();
      videoQuery.params.userId = userId;
      videoQuery.params.userRole = userRole;
      videoQuery.params.user_school = userSchool;
      videoQuery.params.keyword = keyword.value;
      tzggQuery.params.keyword = keyword.value;
      tpxwQuery.params.keyword = keyword.value;
      zcfgQuery.params.keyword = keyword.value;
      bjjgQuery.params.keyword=keyword.value;
      xjgrQuery.params.keyword=keyword.value;
      xjdwQuery.params.keyword=keyword.value;
      // debugger;
      await bindTpxw();
      await bindTzgg();
      await bindZcfg();
      await bindVideoList();
      await bindBjjg();
      await bindXjgr();
      await bindXjdw();
      allTotalCount.value =//a+b+c+d;
        tzggTotalCount.value +
        tpxwTotalCount.value +
        zcfgTotalCount.value +
        videoTotalCount.value+
        bjjgTotalCount.value+
        xjgrTotalCount.value+
        xjdwTotalCount.value;
    });
    onUpdated(() => {
      // keyword.value = route.query.keyword;
      // debugger
      // allTotalCount.value=tzggTotalCount.value+tpxwTotalCount.value+zcfgTotalCount.value+videoTotalCount.value;
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

      videoList,
      tzggList,
      tpxwList,
      zcfgList,
      bjjgList,
      xjgrList,
      xjdwList,
      allTotalCount,
      tzggTotalCount,
      tpxwTotalCount,
      zcfgTotalCount,
      videoTotalCount,
      bjjgTotalCount,
      xjgrTotalCount,
      xjdwTotalCount,
      tpxwQuery,
      tzggQuery,
      zcfgQuery,
      videoQuery,
      bjjgQuery,
      xjgrQuery,
      xjdwQuery,
      handleCurrentChangeTpxw,
      handleCurrentChangeTzgg,
      handleCurrentChangeZcfg,
      handleCurrentChangeVideo,
      handleCurrentChangeBjjg,
      handleCurrentChangeXjgr,
      handleCurrentChangeXjdw,
      methods,
      bindTpxw,
      bindTzgg,
      bindZcfg,
      bindVideoList,
      bindBjjg,
      bindXjgr,
      bindXjdw,
      getSession,
      jumpVideo,
      jumpBrief,
    };
  },
};
</script>
<style scoped>
.portal-wrap {
  /* height: 100%; */
}

.videoList-wrap {
  /* height: 100%;
  overflow: auto; */
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

.red-result {
  color: red;
}

.result {
  font-size: 14px;
}
</style>