<template>
  <div>
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 视频管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加视频</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <el-container>
      <el-aside width="50%">
        <div class="container">
          <div class="form-box">
            <el-form
              ref="formRef"
              :rules="rules"
              :model="videoForm.data"
              label-width="80px"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item label="视频地址" prop="video_url">
                    <el-input
                      v-model="videoForm.data.video_url"
                      style="weight: 70%"
                    ></el-input>
                    <el-button
                      type="primary"
                      @click="perviewVideo(videoForm.data.video_url)"
                      >预览</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="内容图片">
                    <el-upload
                      action="http://47.93.84.178:14474/Upload"
                      list-type="picture-card"
                      :auto-upload="true"
                      :limit="1"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <template #default>
                        <el-icon>
                          <!-- <plus /> -->
                        </el-icon>
                      </template>
                      <template #file="{ file }">
                        <div>
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.url"
                            alt=""
                          />
                          <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleRemove(file)"
                          >
                            <el-icon>
                              <delete />
                            </el-icon>
                          </span>
                        </div>
                      </template>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="视频标题" prop="video_title">
                    <el-input v-model="videoForm.data.video_title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频分类" prop="video_type">
                    <el-select
                      v-model="videoForm.data.video_type"
                      placeholder="请选择"
                      clearable
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
                <el-col :span="12">
                  <el-form-item label="视频年度" prop="video_year">
                    <el-date-picker
                      v-model="videoForm.data.video_year"
                      format='YYYY'
                      value-format='YYYY'
                      type="year"
                      placeholder="选择年份"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="教师" prop="teacher">
                    <el-input v-model="videoForm.data.teacher"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属高校" prop="video_school">
                    <el-input v-model="videoForm.data.video_school"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="获奖情况" prop="award">
                <el-input v-model="videoForm.data.award"></el-input>
              </el-form-item>
              <el-form-item label="视频简介" prop="video_brief">
                <el-input
                  type="textarea"
                  rows="3"
                  v-model="videoForm.data.video_brief"
                ></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频开放" prop="public_type">
                    <el-select
                      v-model="videoForm.data.public_type"
                      placeholder="请选择"
                      @change="publicChange"
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
                <el-col :span="12">
                  <el-form-item
                    label="开放对象"
                    prop="public_type"
                    v-show="showPublicObject"
                  >
                    <el-select
                      v-model="videoForm.data.public_type"
                      placeholder="请选择"
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
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">发布视频</el-button>
                <el-button type="primary" @click="onReset">存为草稿</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-aside>
      <el-main>
        <p @click="getVideoPic" style="text-align: center; margin: 10px auto">
          点击拍照
        </p>
        <div>
          <videoPlay id="player" v-bind="options" 
              :src="videoForm.data.video_url"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getVideoPublicType,
  getSchoolList,
  getVideoType,
  getVideoById,
  addVideo,
} from "../api/serviceApi";

export default {
  name: "videoadd",
  components: {
    videoPlay,
  },
  props:{
    videoId:{
      type: String ,
      default:""
    }
  },
  setup(props) {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    // let route = useRoute(); //可以在setup中使用route获取参数
    let videoId = props.videoId;
    //下拉数据模型列表
    let publicTypeList = ref([]);
    let videoTypeList = ref([]);
    let showPublicObject = ref(false);
    let previewImg = "";
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
        admin_id:"",
        admin_ip:"",
        video_id: null,
        video_title: "",
        video_brief: "",
        video_type: "",
        video_year: "",
        teacher: "",
        award: "",
        public_type: "",
        public_school: "",
        video_school: null,
        video_state: null,
        video_url: null,
        create_time: null, //后台DateTime字段一定要用null默认值！！！！！！
        edit_time: null, //后台DateTime字段一定要用null默认值！！！！！！
        view_count: 10,
        collection_count: 0,
        appreciate_count: 0,
        id_deleted:0,
        video_facede: "",
        uploader:"",
      },
    });
    const rules = {
      name: [{ required: true, message: "请输入内容", trigger: "blur" }],
    };
    // const getParams = () => {
    //   videoId = route.query.videoId;
    // };
    const bindVideo = () => {
      if (videoId != undefined) {
        let params = {
          params: {
            video_id: videoId,
          },
        };
        getVideoById(params).then((res) => {
          debugger;
          if (res.resultCode == "200") {
            videoForm.data = JSON.parse(res.data);
          }
        });
      }
    };
    const getVideoPic = () => {
      {
        debugger;
        let video = document.getElementById("player");
        console.log(video);
        let canvas = document.createElement("canvas");
        let w = window.innerWidth;

        let h = (window.innerWidth / 16) * 9;
        canvas.width = w;
        canvas.height = h;
        console.log(canvas);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);
        this.previewImg = canvas.toDataURL("image/png");
        console.log(this.previewImg);
      }
    };
    const publicChange = (item) => {
      console.log(item);
      if (item == "0302" || item == "0304") {
        showPublicObject.value = true;
      } else {
        showPublicObject.value = false;
      }
    };
    const perviewVideo = (videoUrl) => {
      console.log(videoUrl);
      options.autoPlay=true;
    };
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    const onSubmit=()=>{
      videoForm.data.video_state = "0401";
      videoForm.data.admin_id = "0";
      videoForm.data.admin_ip = "localhost";
      addVideo(videoForm.data).then((res) => {
        if ((res.resultCode = "200")) {
          ElMessage({
            message: "操作成功.",
            grouping: true,
            type: "success",
          });
        } else {
          ElMessage({
            message: "操作失败：" + res.message,
            grouping: true,
            type: "error",
          });
        }
      });
    };
    onMounted(() => {
      getSession();
      getVideoPublicType().then((res) => {
        if (res.resultCode == "200") {
          publicTypeList.value = res.data;
        }
      });
      getVideoType().then((res) => {
        if (res.resultCode == "200") {
          videoTypeList.value = res.data;
        }
      });
      // getParams();
      bindVideo();
    });
    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,

      videoId,
      publicTypeList,
      videoTypeList,
      showPublicObject,
      previewImg,
      options,
      videoForm,
      rules,
      // getParams,
      bindVideo,
      getVideoPic,
      publicChange,
      perviewVideo,
      getSession,
      onSubmit,
    };
  },
};
</script>
