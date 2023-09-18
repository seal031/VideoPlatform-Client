<template slot-scope="scope">
  <div>
    <!-- <div class="crumbs"> -->
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 内容管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加内容</el-breadcrumb-item>
      </el-breadcrumb> -->
    <!-- </div> -->
    <!-- <el-container> -->
    <el-aside width="100%">
      <div class="container">
        <!-- <div class="form-box"> -->
        <el-form
          ref="formRef"
          :rules="rules"
          :model="briefForm.data"
          label-width="120px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="内容分类" prop="brief_type">
                <el-select
                  v-model="briefForm.data.brief_type"
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
            <el-col :span="12">
              <el-form-item label="封面图片" v-show="briefForm.data.brief_type=='0503'||briefForm.data.brief_type=='0504'||briefForm.data.brief_type=='0507'||briefForm.data.brief_type=='0508'">
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
                  <template v-if="briefForm.data.brief_image">
                    <ul class="el-upload-list el-upload-list--picture-card">
                      <li class="el-upload-list__item is-success" tabindex="0">
                        <img class="el-upload-list__item-thumbnail" :src="briefForm.data.brief_image" alt="">
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
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="内容标题" prop="brief_title">
                <el-input
                  v-model="briefForm.data.brief_title"
                  placeholder="请输入内容标题"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="public_time">
                <el-date-picker v-model="briefForm.data.public_time" type="date"  placeholder="请选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="内容详情" prop="brief_content">
                <rt-editor2
                  v-model="briefForm.data.brief_content"
                ></rt-editor2>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
          </el-row>
          <!-- <el-row>
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">发布内容</el-button>
                <el-button type="primary" @click="onDraft">存为草稿</el-button>
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
      <el-button type="primary" @click="onSubmit">发布</el-button>
      <el-button type="primary" @click="onDraft">暂存</el-button>
    </el-col>
    <el-col :span="10"></el-col>
  </el-row>
</template>

<script>
import { ref, reactive, onMounted,watch } from "vue";
import { addBrief, getBriefById, getColumnType } from "../api/serviceApi";
// import rtEditor from "../components/RtEditor.vue";
import RtEditor2 from "../components/RtEditor2.vue";
import { Plus, ZoomIn, Download, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
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
    briefId:{
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

    let briefId = props.briefId;
    let dialogVisible=props.dialogVisible;
    let isReadonly = false;
    let annexList=[];//附件名称列表
    //下拉模型
    let columnTypeList = ref([]);
    let filelist=ref([]);
    //数据模型
    const initbriefFormData={
      brief_id: null,
      brief_title: "",
      brief_content: "",
      brief_type: "",
      brief_state: "",
      brief_image: "",
      operate_admin: null,
      public_time:null,
    }
    const briefForm = reactive({
      data: JSON.parse(JSON.stringify(initbriefFormData)),
    });

    //校验规则
    const rules = {
      brief_title: [
        { required: true, message: "请输入内容标题", trigger: "blur" },
      ],
      //内容详情改为非必填
      // brief_content: [
      //   { required: true, message: "请输入内容详情", trigger: "blur" },
      // ],
      brief_type: [
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
      briefForm.data.brief_image = "http://47.93.84.178:14474/Images/" + res.data.newFileName;
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
      briefForm.data.brief_image = "";
    };
    const handlePictureCardPreview = () => {
      dialogImageUrl.value = briefForm.data.brief_image;
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
      briefForm.data.brief_content = str;
    };
    // 提交
    const onSubmit = () => {
      briefForm.data.brief_state = "0401";
      briefForm.data.admin_id = userId;
      briefForm.data.admin_ip = "localhost";
      briefForm.data.brief_image = imageUrl.value;
      briefForm.data.annex=annexList.join(',');
      briefForm.data.public_time=format(briefForm.data.public_time, "yyyy-MM-dd");
      debugger;
      console.log(briefForm.data);
      addBrief(briefForm.data).then((res) => {
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
      briefForm.data.brief_state = "0402";
      briefForm.data.admin_id = userId;
      briefForm.data.admin_ip = "localhost";
      briefForm.data.brief_image = imageUrl.value;
      briefForm.data.annex=annexList.join(',');
      debugger;
      addBrief(briefForm.data).then((res) => {
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
    
    const bindBrief=(briefId)=>{
      if (briefId != undefined) {
          let params = {
            params: {
              brief_id: briefId,
            },
          };
          getBriefById(params).then((res) => {
            briefForm.data = JSON.parse(res.data);
            debugger;
            filelist.value.push({
              'name':'temp.jpg',
              'url':briefForm.data.brief_image
            })
          });
        }
    };
    onMounted(() => {
      getSession();
      bindBrief();
      getColumnType().then((res) => {
        columnTypeList.value = res.data;
        columnTypeList.value.splice(4,1);//不取基层动态
      });
    });

    watch(
      () => props.briefId,
      (val) => {
        if (val) {
          bindBrief(val);
        } else {
          // 清空表单
          briefForm.data = JSON.parse(JSON.stringify(initbriefFormData));
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

      bindBrief,
      getSession,
      briefId,
      formRef,
      columnTypeList,
      editor,
      briefForm,
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