<template>
  <div>
    <!-- TODO 替换src -->
    <!-- <el-image :src="src"  fit="fill" :itemid="videoId" class="picture"> -->
    <el-image :src="src" fit="fill" :itemid="videoId" class="picture">
      <template #placeholder>
        <div class="image-slot">Loading<span class="dot">...</span></div>
      </template>
    </el-image>
    <div class="picture-info">
      <div>
        <span>
          <template v-if="isShowCount">
            <el-icon></el-icon>
            <!-- TODO 播放量 -->
            <span class="mr10">{{ viewCount }}</span>
            <el-icon>
              <svg
                t="1645883884232"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2963"
                width="14"
                height="14"
              >
                <path
                  d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                  p-id="2964"
                  fill="#ffffff"
                ></path>
              </svg>
            </el-icon>
            <!-- TODO 点赞量-->
            <span>{{ appreciateCount }}</span>
          </template>
        </span>

        <el-icon class="title-icon ml5">
          <!-- <document /> -->
          </el-icon>
      </div>
      <!-- TODO 时间 -->
      <label v-text="''"></label>
    </div>
  </div>
</template>

<script>
// import { VideoPlay } from "@element-plus/icons-vue";

export default {
  name: "videoitem",
  props: {
    src: String,
    // title:String,
    videoId: String,
    viewCount: 0,
    collectionCount: 0,
    appreciateCount: 0,
    isShowCount: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  setup(props) {
    // console.log(props);
    return {
      // VideoPlay,
    };
  },
};
</script>

<style>
.picture {
  width: 100%;
  height: 99px;
  border-radius: 6px;
}
.picture-info {
  height: 20px;
  line-height: 20px;
  margin-top: -26px;
  margin-bottom: 10px;
  padding: 0 6px;
  position: relative;
  z-index: 1;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
}
</style>