<template>
  <top-tool-bar></top-tool-bar>
  <div class="common-layout">
    <el-form>
      <el-row>
        <el-col :span="4"></el-col>
        <el-col :span="16">
          <el-container style="height: 100%">
            <el-aside width="250px">
              <el-card
                :body-style="{ padding: '0px' }"
                title="相关视频"
                :v-text="相关视频"
              >
                <video-item
                  v-for="item in relativeVideoList"
                  class="image"
                  :src="item.video_facede"
                  :tip="item.video_title"
                  :videoId="item.video_id"
                  :key="item"
                  @click="rlVideoClick(item.video_id)"
                />
              </el-card>
            </el-aside>
            <el-container>
              <el-header>
                <label v-text="videoForm.data.video_title"></label>
                <label v-text="videoForm.data.award"></label>
                <label v-text="videoForm.data.create_time"></label>
              </el-header>
              <el-main>
                <videoPlay
                  id="player"
                  v-bind="options"
                  :src="videoForm.data.video_url"
                />
              </el-main>
              <el-footer>
                <label v-text="videoForm.data.video_brief"></label>
              </el-footer>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { ref, reactive, onMounted, onBeforeUpdate, onActivated } from "vue";
import TopToolBar from "../components/TopToolBar.vue";
import VideoItem from "../components/VideoItem.vue";
import { getVideoById, getRelativeVideoList } from "../api/serviceApi";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default {
  methods: {
    //跳转相关视频
    rlVideoClick(videoId) {
      console.log(videoId);
      // 页面跳转
      const href = this.$router.push({
        path: "/VideoShow",
        query: { videoId: videoId },
      });
      //   debugger
      //   window.open(href, "_blank");
    },
  },
  components: {
    TopToolBar,
    videoPlay,
    VideoItem,
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    let videoId = "";
    let relativeVideoList = ref([]); //相关视频模型列表
    let options = reactive({
      width: "100%", //播放器宽度
      height: "450px", //播放器高度
      color: "#409eff", //主题色
      title: "", //视频名称
      src: "", //视频源https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4
      muted: false, //静音
      webFullScreen: false,
      speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
      autoPlay: false, //自动播放
      loop: false, //循环播放
      mirror: false, //镜像画面
      ligthOff: false, //关灯模式
      volume: 0.3, //默认音量大小
      control: true, //是否显示控制
      controlBtns: [
        "audioTrack",
        "quality",
        "speedRate",
        "volume",
        "setting",
        "pip",
        "pageFullScreen",
        "fullScreen",
      ], //显示所有按钮,
    });
    const videoForm = reactive({
      data: {
        video_id: "",
        video_title: "",
        video_brief: "",
        video_type: "",
        video_year: "",
        teacher: "",
        award: "",
        public_type: "",
        public_school: "",
        video_school: "",
        video_state: "",
        video_url: "",
        video_facede: "",
        create_time: "",
        edit_time: "",
        view_count: 0,
        collection_count: 0,
        appreciate_count: 0,
        video_facede: "",
      },
    });

    const getParams = () => {
      videoId = route.query.videoId;
    };
    const bindVideo = () => {
      if (videoId != "") {
        let query = {
          params: {
            orderBy: "hot",
            video_id: videoId, //后台参数是string，不加reactive
          },
        };
        getVideoById(query).then((res) => {
          if (res.resultCode == "200") {
            videoForm.data = JSON.parse(res.data);
          }
        });
      }
    };
    const getRLVideoList = () => {
      if (videoId != "") {
        let query = reactive({
          params: {
            videoId: videoId, //后台参数是类，加reactive
            topN: 6,
          },
        });
        getRelativeVideoList(query).then((res) => {
          if (res.resultCode == "200") {
            relativeVideoList.value = JSON.parse(res.data.videoList);
            console.log(relativeVideoList);
          }
        });
      }
    };
    onMounted(() => {
      getParams();
      bindVideo();
      getRLVideoList();
    });
    onBeforeUpdate(() => {
      getParams();
      bindVideo();
      getRLVideoList();
    });
    return {
      videoId,
      videoForm,
      options,
      getParams,
      bindVideo,
      getRLVideoList,
      relativeVideoList,
    };
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #5cbef7;
  color: var(--el-text-color-primary);
  text-align: left;
  line-height: 100px;
}

.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: left;
  line-height: 450px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  height: 100px;
  display: block;
}
</style>