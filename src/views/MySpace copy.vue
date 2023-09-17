<template>
  <top-tool-bar></top-tool-bar>
  <div class="portal-wrap wrapper-sticky">
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
        <el-table
          :data="wdscList"
          style="width: 100%"
          :show-header="false"
          class="customer-table"
          @row-click="showVideo"
        >
          <el-table-column prop="video_title" label="" width="500">
          </el-table-column>
          <el-table-column
            prop="video_facede"
            label=""
            width="100"
            :formatter="methods.dateFormat"
          >
          </el-table-column>
        </el-table>
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
            v-model:currentPage="query.params.pageIndex"
            v-model:page-size="query.params.pageSize"
            layout="total, prev, pager, next"
            :total="pageTotal"
          >
          </el-pagination>
        </div>
        <div class="block">
          <el-form>
            <el-row>
              <el-col :span="2"></el-col>
              <el-col :span="20">
                <el-form-item>
                  <div v-if="wdspList && wdspList.length > 0">
                    <video-item
                      class="line_file"
                      v-for="videoitem in wdspList.slice(0, 5)"
                      :src="videoitem.video_facede"
                      :tip="videoitem.video_title"
                      :videoId="videoitem.video_id"
                      :uploader="videoitem.uploader"
                      :createDate="videoitem.create_time"
                      :viewCount="videoitem.view_count"
                      :appreciateCount="videoitem.appreciate_count"
                      :collectionCount="videoitem.collection_count"
                      :key="videoitem"
                      @click.enter="showVideo(v)"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2"> </el-col>
            </el-row>
            <el-row>
              <el-col :span="2"></el-col>
              <el-col :span="20">
                <el-form-item>
                  <div v-if="wdspList && wdspList.length > 0">
                    <video-item
                      v-for="videoitem in wdspList.slice(5, 10)"
                      :src="videoitem.video_facede"
                      :tip="videoitem.video_title"
                      :videoId="videoitem.video_id"
                      :key="videoitem"
                      @click.enter="onClick(v)"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2"> </el-col>
            </el-row>
            <el-row>
              <el-col :span="2"></el-col>
              <el-col :span="20">
                <el-form-item>
                  <div v-if="wdspList && wdspList.length > 0">
                    <video-item
                      class="line_file"
                      v-for="videoitem in wdspList.slice(10, 5)"
                      :src="videoitem.video_facede"
                      :tip="videoitem.video_title"
                      :videoId="videoitem.video_id"
                      :key="videoitem"
                      @click.enter="onClick(v)"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2"> </el-col>
            </el-row>
            <el-row>
              <el-col :span="2"></el-col>
              <el-col :span="20">
                <el-form-item>
                  <div v-if="wdspList && wdspList.length > 0">
                    <video-item
                      class="line_file"
                      v-for="videoitem in wdspList.slice(15, 5)"
                      :src="videoitem.video_facede"
                      :tip="videoitem.video_title"
                      :videoId="videoitem.video_id"
                      :key="videoitem"
                      @click.enter="onClick(v)"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2"> </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本校视频" :icon="Star">
        <el-table
          :data="bxspList"
          style="width: 100%"
          :show-header="false"
          class="customer-table"
          @row-click="showVideo"
        >
          <el-table-column prop="brief_title" label="" width="500">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="100"
            :formatter="methods.dateFormat"
          >
          </el-table-column>
        </el-table>
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
import { getVideoList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
export default {
  components: {
    TopToolBar,
    VideoItem,
    PortalFooter,
  },
  setup() {
    const userId =
      getCurrentInstance().appContext.config.globalProperties.$userId;
    const userRole =
      getCurrentInstance().appContext.config.globalProperties.$userRole;
    const userSchool =
      getCurrentInstance().appContext.config.globalProperties.$userSchool;
    let wdscList = ref([]); //我的收藏模型列表
    let wdspList = ref([]); //我的视频模型列表
    let bxspList = ref([]); //本校视频模型列表

    const methods = {
      dateFormat(date) {
        return moment(date).format("YYYY-MM-DD");
      },
    };
    const bindWdscList = () => {
      let query = reactive({
        params: {},
      });
    };
    const bindWdspList = () => {
      let query = reactive({
        params: {
          uploader: "aaaaaa",
        },
      });
      getVideoList(query).then((res) => {
        if (res.resultCode == "200") {
          debugger;
          wdspList.value = JSON.parse(res.data.videoList);
        }
      });
    };
    const bindBxspList = () => {
      let query = reactive({
        params: {
          videoSchool: userSchool,
        },
      });
    };
    const showVideo = () => {};

    onMounted(() => {
      bindWdspList();
    });
    return {
      Star,
      Wallet,
      OfficeBuilding,

      userId,
      userRole,
      userSchool,
      wdscList,
      wdspList,
      bxspList,
      methods,
      bindWdscList,
      bindWdspList,
      bindBxspList,
      showVideo,
    };
  },
};
</script>

<style scoped>
.portal-wrap {
  /* height: 100%;
  overflow: auto; */
}
</style>