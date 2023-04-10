<template slot-scope="scope">
  <div>
    <el-aside width="100%">
      <div class="container">
        <!-- <div class="form-box"> -->
        <el-form
          ref="formRef"
          :rules="rules"
          :model="trendForm.data"
          label-width="120px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="内容分类" prop="trend_type">
                <el-select
                  v-model="trendForm.data.trend_type"
                  value-key="code_id"
                  placeholder="请选择"
                  popper-class="detailDialog_select-popper"
                >
                  <el-option
                    v-for="(item, c) in columnTypeList"
                    :key="c"
                    :label="item.code_name"
                    :value="item.code_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="内容标题" prop="trend_title">
                <el-input
                  v-model="trendForm.data.trend_title"
                  placeholder="请输入内容标题"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="18">
              <el-form-item label="封面图片">
                <el-upload
                  action="http://47.93.84.178:14474/Upload/Image"
                  list-type="picture-card"
                  :auto-upload="true"
                  :multiple= "false"
                  :show-file-list="false"
                  :limit="1"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <template v-if="trendForm.data.trend_image">
                    <ul class="el-upload-list el-upload-list--picture-card">
                      <li class="el-upload-list__item is-success" tabindex="0">
                        <img class="el-upload-list__item-thumbnail" :src="trendForm.data.trend_image" alt="">
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click.stop="handlePictureCardPreview"
                          >
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span class="el-upload-list__item-delete" @click.stop="handleRemove">
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
          </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="内容详情" prop="trend_content">
                <rt-editor2
                  v-model="trendForm.data.trend_content"
                ></rt-editor2>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="附件">
                <el-upload
                  class="upload-text"
                  action="http://47.93.84.178:14474/Upload/AnnexFile"
                  list-type="text"
                  :auto-upload="true"
                  :multiple= "true"
                  :show-file-list="true"
                  :limit="3"
                  :on-success="handleAnnexSuccess"
                  :before-upload="beforeAnnexUpload"
                  :on-remove="handleAnnexRemove"
                >
                <el-button type="primary">点击选择附件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
        <!-- </div> -->
      </div>
    </el-aside>
    <!-- </el-container> -->
  </div>
  <el-row>
    <el-col :span="10"></el-col>
    <el-col :span="4">
      <el-button type="primary" @click="onSubmit">提交审核</el-button>
      <el-button type="primary" @click="onDraft">暂存</el-button>
    </el-col>
    <el-col :span="10"></el-col>
  </el-row>
</template>

<script>
import { ref, reactive, onMounted,watch } from "vue";
import { addTrend, getTrendById, getColumnType,AddExamineRecord } from "../api/serviceApi";
// import rtEditor from "../components/RtEditor.vue";
import RtEditor2 from "../components/RtEditor2.vue";
import { Plus, ZoomIn, Download, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {UploadFile, ElUploadProgressEvent, ElFile,} from 'element-plus/es/components/upload/src/upload.type'

export default {
  components: {
    // rtEditor,
    Plus,
    ZoomIn,
    Download,
    Delete,
    RtEditor2,
  },
  props:{
    trendId:{
      type: String ,
      default:""
    },
    dialogVisible:{
      type:Boolean,
      default:false
    }
  },
  setup(props,context) {
    let route = useRoute(); //可以在setup中使用route获取参数
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let trendId = props.trendId;
    let dialogVisible=props.dialogVisible;
    let isReadonly = false;
    let annexList=[];//附件名称列表
    //下拉模型
    // let columnTypeList = ref([]);
    let columnTypeList=[
      {
        code_name: "高校动态",
        code_id: "0505",
      }
    ];
    let filelist=ref([]);
    //数据模型
    const inittrendFormData={
      trend_id: null,
      trend_title: "",
      trend_content: "",
      trend_type: "",
      trend_state: "",
      trend_image: "",
      operate_admin: null,
      creater:"",
      trend_school:"",
    }
    const trendForm = reactive({
      data: JSON.parse(JSON.stringify(inittrendFormData)),
    });

    //校验规则
    const rules = {
      trend_title: [
        { required: true, message: "请输入内容标题", trigger: "blur" },
      ],
      trend_content: [
        { required: true, message: "请输入内容详情", trigger: "blur" },
      ],
      trend_type: [
        { required: true, message: "请选择内容分类", trigger: "blur" },
      ],
    };
    const formRef = ref(null);
    const editor = ref(null);
    const dialogImageUrl = ref("");
    const imageVisible = ref(false);
    const disabled = ref(true);
    const imageUrl = ref("");
    const handleAvatarSuccess = (res, file) => {
      trendForm.data.trend_image = "http://47.93.84.178:14474/Images/" + res.data.newFileName;
      imageUrl.value="http://47.93.84.178:14474/Images/" + res.data.newFileName;
    };
    const beforeAvatarUpload = (file) => {
      debugger;
      const isJPG = (file.type === "image/jpeg"||file.type === "image/png");
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        ElMessage.error("上传文件必须为jpeg格式");
      }
      if (!isLt2M) {
        ElMessage.error("上传文件必须小于10MB!");
      }
      return isJPG && isLt2M;
    };
    const handleRemove = () => {
      trendForm.data.trend_image = "";
    };
    const handlePictureCardPreview = () => {
      dialogImageUrl.value = trendForm.data.trend_image;
      imageVisible.value = true;
    };

    const handleAnnexSuccess=(res,file)=>{
      var newFileName=res.data.newFileName;
      annexList.forEach(element => {
        if(element===newFileName){
          return;
        }
      });
      annexList.push(newFileName);
    };
    const beforeAnnexUpload=(file)=>{
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 50;
      // if (!isJPG) {
      //   ElMessage.error("上传文件必须为jpeg格式");
      // }
      if (!isLt2M) {
        ElMessage.error("上传文件必须小于50MB!");
      }
      // return isJPG && isLt2M;
      return isLt2M;
    };
    const handleAnnexRemove=(file)=>{
      let tempFileList = [];
      for (var index = 0; index < annexList.length; index++) {
        if (annexList[index] !== file.name) {
          tempFileList.push(annexList[index]);
        }
      }
      annexList = tempFileList;
    };
    // const handleDownload = (file) => {
    //   debugger;
    //   console.log(file);
    // };
    const getWangEditorValue = (str) => {
      trendForm.data.trend_content = str;
    };
    // 提交
    const onSubmit = () => {
      trendForm.data.trend_state = "0403";
      trendForm.data.admin_id = userId;
      trendForm.data.admin_ip = "localhost";
      trendForm.data.trend_school=userSchool;
      trendForm.data.creater = userId;
      // trendForm.data.
      addTrend(trendForm.data).then((res) => {
        debugger
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
      trendForm.data.trend_state = "0402";
      trendForm.data.admin_id = userId;
      trendForm.data.admin_ip = "localhost";
      trendForm.data.creater = userId;
      trendForm.data.trend_image = imageUrl.value;
      trendForm.data.annex=annexList.join(',');
      console.log(trendForm.data);
      addTrend(trendForm.data).then((res) => {
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
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    
    const bindTrend=(trendId)=>{
      if (trendId != undefined) {
          let params = {
            params: {
              trend_id: trendId,
            },
          };
          getTrendById(params).then((res) => {
            trendForm.data = JSON.parse(res.data);
            console.log(trendForm.data)
            filelist.value.push({
              'name':'temp.jpg',
              'url':trendForm.data.trend_image
            })
          });
        }
    };
    onMounted(() => {
      getSession();
      bindTrend();
      // getColumnType().then((res) => {
      //   columnTypeList.value = res.data;
      // });
      trendForm.data.trend_type=columnTypeList[0].code_id;
    });

    watch(
      () => props.trendId,
      (val) => {
        if (val) {
          bindTrend(val);
        } else {
          // 清空表单
          trendForm.data = JSON.parse(JSON.stringify(inittrendFormData));
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

      bindTrend,
      getSession,
      trendId,
      formRef,
      columnTypeList,
      editor,
      trendForm,
      filelist,
      rules,
      imageVisible,
      disabled,
      handleRemove,
      handlePictureCardPreview,
      // handleDownload,
      annexList,
      handleAnnexSuccess,
      beforeAnnexUpload,
      handleAnnexRemove,
      onSubmit,
      onDraft,
      getWangEditorValue,
      handleAvatarSuccess,
      beforeAvatarUpload,

      dialogVisible,
      dialogImageUrl,
    };
  },
};
</script>
<style scope>
.center .el-dialog__body{
  text-align: center;
}
.upload-text .el-upload--text{
  border: none;
  height: auto;
  text-align: left;
}
</style>