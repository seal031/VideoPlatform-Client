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
      <el-aside width="100%">
        <div class="container">
          <div>
            <el-form ref="formRef" :rules="rules" :model="videoForm.data" label-width="80px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="本地视频" prop="video_url">
                    <input type="file" name="file" id="fileSelector" ref="uploader" @change="videoFileChange" />
                    <!-- <el-input
                      v-model="videoForm.data.video_url"
                      style="weight: 70%"
                    ></el-input> -->
                    <el-button type="primary" @click="uploadVideo()">上传</el-button>
                    <el-button type="primary" @click="perviewVideo('aliyun')">预览</el-button>
                    <!-- <el-button
                      type="primary"
                      @click="perviewVideo('web')"
                      >预览在线视频</el-button
                    > -->
                    <div style="width: 200px;" v-if="uploadPercent>0">
                      <el-progress :percentage="uploadPercent"></el-progress>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>

              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="封面图片">
                    <el-upload action="http://47.93.84.178:14474/Upload" list-type="picture-card" :auto-upload="true"
                      :limit="1" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                      :show-file-list="false">
                      <!-- <template #default>
                        <el-icon>
                          <Plus />
                        </el-icon>
                      </template> -->
                      <template v-if="videoForm.data.video_facede">
                        <ul class="el-upload-list el-upload-list--picture-card">
                          <li class="el-upload-list__item is-success" tabindex="0">
                            <img class="el-upload-list__item-thumbnail" :src="videoForm.data.video_facede" alt="">
                            <span class="el-upload-list__item-actions">
                              <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview">
                                <el-icon>
                                  <zoom-in />
                                </el-icon>
                              </span>
                              <span class="el-upload-list__item-delete" @click.stop="handleAvatarRemove">
                                <el-icon>
                                  <delete />
                                </el-icon>
                              </span>
                            </span>
                          </li>
                        </ul>
                      </template>
                      <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                      </el-icon>
                    </el-upload>

                    <el-dialog v-model="imageVisible" custom-class="center">
                      <img :src="dialogImageUrl" alt="" style="max-width: 100%; max-height: 400px;" />
                    </el-dialog>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <div id="aliyunVideoPlayer"></div>
                </el-col>
                <el-col :span="8"></el-col>
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
                    <el-select v-model="videoForm.data.video_type" placeholder="请选择" clearable>
                      <el-option v-for="(item, c) in videoTypeList" :key="c" :label="item.code_name"
                        :value="item.code_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="视频年度" prop="video_year">
                    <el-date-picker v-model="videoForm.data.video_year" format="YYYY" value-format="YYYY" type="year"
                      placeholder="选择年份" style="width: 100%"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="获奖情况" prop="award">
                    <el-input v-model="videoForm.data.award"></el-input>
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
                    <!-- <el-input v-model="videoForm.data.video_school"></el-input> -->
                    <el-select v-model="videoForm.data.video_school" placeholder="请选择" clearable  style="width: 100%">
                      <el-option v-for="(item, c) in schoolList" :key="c" :label="item.school_name"
                        :value="item.school_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="视频简介" prop="video_brief">
                <el-input type="textarea" rows="3" v-model="videoForm.data.video_brief"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频开放" prop="public_type">
                    <el-select v-model="videoForm.data.public_type" placeholder="请选择" @change="publicChange">
                      <el-option v-for="(item, c) in publicTypeList" :key="c" :label="item.code_name"
                        :value="item.code_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开放对象" prop="public_type" v-show="showPublicObject">
                    <el-select v-model="videoForm.data.public_type" placeholder="请选择">
                      <el-option v-for="(item, c) in publicTypeList" :key="c" :label="item.code_name"
                        :value="item.code_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-form-item>
                <el-button type="primary" @click="onSubmit">发布视频</el-button>
                <el-button type="primary" @click="onDraft">存为草稿</el-button>
              </el-form-item> -->
            </el-form>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
  <el-row>
    <el-col :span="9"></el-col>
    <el-col :span="6">
      <el-button type="primary" @click="onSubmit">发布视频</el-button>
      <el-button type="primary" @click="onDraft">存为草稿</el-button>
    </el-col>
    <el-col :span="9"></el-col>
  </el-row>

  <!-- <el-dialog title="视频预览" v-model="dialogPerviewVisible" :show-close="true" width="60%" center :modal-append-to-body="true" append-to-body>
    <el-container>
      <el-main>
        
      </el-main>
    </el-container>
  </el-dialog> -->
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  getVideoPublicType,
  getSchoolList,
  getVideoType,
  getVideoById,
  addVideo,
  getVideoUploadInfo,
  getVideoPlayAuth,
} from "../api/serviceApi";

export default {
  name: "videoadd",
  components: {
    videoPlay,
  },
  props: {
    videoId: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let uploadPercent = ref(0);

    // let route = useRoute(); //可以在setup中使用route获取参数
    let videoId = props.videoId;
    //下拉数据模型列表
    let publicTypeList = ref([]);
    let videoTypeList = ref([]);
    let schoolList=ref([]);
    //获取学校用的参数
    let query = reactive({
      params: {
        schoolType: "",
        schoolCategoly: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10000,
      },
    });
    let showPublicObject = ref(false);
    let previewImg = "";
    let dialogPerviewVisible=ref(false);
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
    const initVideoFormData = {
      admin_id: "",
      admin_ip: "",
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
      view_count: 0,
      collection_count: 0,
      appreciate_count: 0,
      is_deleted: 0,
      video_facede: "",
      uploader: "",
      aliyun_videoId: "",
    };
    const videoForm = reactive({
      data: JSON.parse(JSON.stringify(initVideoFormData)),
    });
    const rules = {
      video_url: [{ required: true, message: "请输入内容", trigger: "blur" }],
      video_title: [{ required: true, message: "请输入内容", trigger: "blur" }],
      video_type: [{ required: true, message: "请选择分类", trigger: "blur" }],
      video_year: [{ required: true, message: "请选择年份", trigger: "blur" }],
      award: [{ required: true, message: "请输入内容", trigger: "blur" }],
      teacher: [{ required: true, message: "请输入内容", trigger: "blur" }],
      video_school: [{ required: true, message: "请选择高校", trigger: "blur" }],
      video_brief: [{ required: true, message: "请输入内容", trigger: "blur" }],
      public_type: [{ required: true, message: "请选择", trigger: "blur" }],
    };
    //////////////阿里云视频相关////////////
    var aliyunVideoId = ""; //阿里云视频id
    var aliyunPlayAuth = "";//阿里云播放授权
    var CoverUrl = "";//视频封面图片地址
    var videoFile = null; //待上传的本地视频文件
    var uploaderAliyun = new AliyunUpload.Vod({
      //userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
      userId: "1363466435075707",
      region: "cn-beijing",  //上传到视频点播的地域，默认值为'cn-shanghai'，
      partSize: 1048576,//分片大小默认1 MB，不能小于100 KB（100*1024）
      parallel: 5, //并行上传分片个数，默认5
      retryCount: 3,//网络原因失败时，重新上传次数，默认为3
      retryDuration: 2, //网络原因失败时，重新上传间隔时间，默认为2秒
      //开始上传
      'onUploadstarted': function (uploadInfo) {
        debugger
        // var uploadAuth = data.UploadAuth;
        // var uploadAddress = data.UploadAddress;
        // var videoId = data.VideoId;
        getVideoUploadInfoFromServer(uploadInfo);
      },
      //文件上传成功
      'onUploadSucceed': function (uploadInfo) {
        ElMessage({
          message: "上传成功.",
          grouping: true,
          type: "success",
        });
        ///上传成功后马上获取播放凭证（主要为了获取封面图片）
        //tood 延时一小会儿
        let query = {
          params: {
            accessKeyId: "c9FjqwmD4XLC5H2M",
            accessKeySecret: "V5NBQA3zN9dP78b9XLai3APQ5EFM3V",
            videoId: aliyunVideoId,//"d64940f4279d40ed877f05c7dfcc0f28",
          },
        };
        getVideoPlayAuth(query).then((res) => {
          if (res.resultCode == "200" && res.data.ErrorMessage == "") {
            aliyunPlayAuth = res.data.PlayAuth;
            aliyunVideoId = res.data.VideoId;
            CoverUrl = res.data.CoverUrl;
            console.log(CoverUrl)
          }
          else {
            ElMessage({
              message: "获取视频播放信息失败." + res.data.ErrorMessage,
              grouping: true,
              type: "error",
            });
          }
        });
      },
      //文件上传失败
      'onUploadFailed': function (uploadInfo, code, message) {
        ElMessage({
          message: "上传失败.(" + code + ")" + message,
          grouping: true,
          type: "error",
        });
      },
      //文件上传进度，单位：字节
      'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
        console.log(loadedPercent);
        uploadPercent.value = loadedPercent * 100;
        //todo 展示进度条   
      },
      //上传凭证或STS token超时
      'onUploadTokenExpired': function (uploadInfo) {
        //todo 调用后台刷新凭证接口

      },
      //全部文件上传结束
      'onUploadEnd': function (uploadInfo) { }
    });

    const getVideoUploadInfoFromServer = (uploadInfo) => {
      let query = {
        params: {
          accessKeyId: "c9FjqwmD4XLC5H2M",
          accessKeySecret: "V5NBQA3zN9dP78b9XLai3APQ5EFM3V",
          videoFileName: videoFile.name,
          videoTitle: videoFile.name,
        },
      };
      getVideoUploadInfo(query).then((res) => {
        if (res.resultCode == "200" && res.data.ErrorMessage == "") {
          debugger;
          var uploadAuth = res.data.OriginalUploadAuth;
          var uploadAddress = res.data.OriginalUploadAddress;
          var videoId = res.data.VideoId;
          aliyunVideoId = res.data.VideoId;
          uploaderAliyun.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
        }
        else {
          ElMessage({
            message: "获取视频上传凭证失败." + res.data.ErrorMessage,
            grouping: true,
            type: "error",
          });
        }
      });
    };

    const uploadVideo = () => {
      var userData = '{"Vod":{}}';
      uploaderAliyun.addFile(videoFile, null, null, null, userData);
      uploaderAliyun.startUpload();
    };
    const perviewVideo = (videoSource) => {
      if (videoSource == 'aliyun') {
        var player = new Aliplayer({
          id: 'aliyunVideoPlayer',
          width: '280px',
          height:'150px',
          vid: aliyunVideoId,//必选参数。音视频ID。示例：1e067a2831b641db90d570b6480f****。
          playauth: aliyunPlayAuth,//必选参数。音视频播放凭证。
        }, function (player) {
          console.log('The player is created.')
        });
        dialogPerviewVisible.value=true;//显示弹出模态框
      }
      else {
        var player = new Aliplayer({
          id: 'aliyunVideoPlayer',
          width: '100%',
          source: videoForm.data.video_url
        }, function (player) {
          console.log('The player is created.')
        });
      }
    };
    /////////////阿里云视频相关ENd////////////
    // const getParams = () => {
    //   videoId = route.query.videoId;
    // };

    const bindVideo = (videoId) => {
      if (videoId != undefined) {
        let params = {
          params: {
            video_id: videoId,
          },
        };
        getVideoById(params).then((res) => {
          if (res.resultCode == "200") {
            videoForm.data = JSON.parse(res.data);
            videoForm.data.video_year = "" + videoForm.data.video_year;
          }
        });
      }
    };
    const handleAvatarSuccess = (res) => {
      videoForm.data.video_facede = "http://47.93.84.178:14474/Images/" + res.data.newFileName;
    };

    const handleAvatarRemove = () => {
      videoForm.data.video_facede = "";
    };

    const dialogImageUrl = ref(""); // 预览图片
    const imageVisible = ref(false);
    
    const handlePictureCardPreview = () => {
      dialogImageUrl.value = videoForm.data.video_facede;
      imageVisible.value = true;
    };

    const publicChange = (item) => {
      console.log(item);
      if (item == "0302" || item == "0304") {
        showPublicObject.value = true;
      } else {
        showPublicObject.value = false;
      }
    };
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };

    const onSubmit = () => {
      videoForm.data.video_state = "0401";
      videoForm.data.admin_id = "0";
      videoForm.data.admin_ip = "localhost";
      //todo 判断是阿里云视频还是网络视频
      videoForm.data.aliyun_videoId = aliyunVideoId;
      debugger
      // videoForm.data.video_facede = CoverUrl; //暂时不从阿里云获取封面，由用户上传
      addVideo(videoForm.data).then((res) => {
        if ((res.resultCode = "200")) {
          ElMessage({
            message: "操作成功.",
            grouping: true,
            type: "success",
          });
          context.emit('dialogclose');
        } else {
          ElMessage({
            message: "操作失败：" + res.message,
            grouping: true,
            type: "error",
          });
        }
      });
    };
    const onDraft = () => {
      videoForm.data.video_state = "0402";
      videoForm.data.admin_id = "0";
      videoForm.data.admin_ip = "localhost";
      //todo 判断是阿里云视频还是网络视频
      videoForm.data.aliyun_videoId = aliyunVideoId;
      // videoForm.data.video_facede = CoverUrl;//暂时不从阿里云获取封面，由用户上传
      addVideo(videoForm.data).then((res) => {
        if ((res.resultCode = "200")) {
          ElMessage({
            message: "操作成功.",
            grouping: true,
            type: "success",
          });
          context.emit('dialogclose');
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
      getSchoolList(query).then((res) => {
        if (res.resultCode == "200") {
          debugger
          schoolList.value = JSON.parse(res.data.School_list);
        }
      });
      // getParams();
      // bindVideo();
    });

    const videoFileChange = (event) => {
      debugger
      const filePath = event.target.value;
      const fileName = event.target.files[0];
      videoFile = fileName;
      // var oFReader = new FileReader();
      // oFReader.readAsDataURL(filePath);
      // oFReader.onloadend = function(oFRevent){
      //   var src = oFRevent.target.result;
      //   $('.content').attr('src',src);
      //   alert(src);
      // }
    }

    watch(
      () => props.videoId,
      (val) => {
        if (val) {
          bindVideo(val);
        } else {
          // 清空表单
          videoForm.data = JSON.parse(JSON.stringify(initVideoFormData));
        }
      },
      { immediate: true }
    );
    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,
      uploadPercent,

      videoId,
      publicTypeList,
      videoTypeList,
      schoolList,
      showPublicObject,
      previewImg,
      options,
      videoForm,
      rules,
      // getParams,
      bindVideo,
      handleAvatarSuccess,
      publicChange,
      getSession,
      onSubmit,
      onDraft,

      aliyunVideoId,
      aliyunPlayAuth,
      CoverUrl,
      videoFileChange,
      getVideoUploadInfoFromServer,
      videoFile,
      uploadVideo,
      perviewVideo,

      handleAvatarRemove,
      dialogImageUrl,
      imageVisible,
      handlePictureCardPreview,
      dialogPerviewVisible,
    };
  },
};
</script>
<style scope>
.center .el-dialog__body {
  text-align: center;
}
</style>