<template slot-scope="scope">
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 内容管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加内容</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
            <el-col :span="18">
              <el-form-item label="内容标题" prop="brief_title">
                <el-input
                  v-model="briefForm.data.brief_title"
                  placeholder="请输入内容标题"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="内容图片">
                <el-upload
                  action="http://47.93.84.178:14474/Upload"
                  list-type="picture-card"
                  v-model:file-list="fileList"
                  :multiple="false"
                  :limit="1"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove"
                  :before-upload="beforeAvatarUpload"
                >
                  <template #default>
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </template>
                  <!-- <template #file="{ file }">
                    <div>
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                      />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <el-icon>
                            <zoom-in />
                          </el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleDownload(file)"
                        >
                          <el-icon><download /></el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <el-icon>
                            <delete />
                          </el-icon>
                        </span>
                      </span>
                    </div>
                  </template> -->
                </el-upload>
                <el-dialog v-model="dialogVisible">
                  <img width="100%" src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="内容详情" prop="brief_content">
                <rt-editor
                  v-model="briefForm.data.brief_content"
                  v-on:getWangEditorValue="getWangEditorValue"
                ></rt-editor>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">发布内容</el-button>
                <el-button type="primary" @click="onDraft">存为草稿</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- </div> -->
      </div>
    </el-aside>
    <!-- </el-container> -->
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { addBrief, getBriefById, getColumnType } from "../api/serviceApi";
import rtEditor from "../components/RtEditor.vue";
import { Plus, ZoomIn, Download, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {UploadFile, ElUploadProgressEvent, ElFile,} from 'element-plus/es/components/upload/src/upload.type'

export default {
  components: {
    rtEditor,
    Plus,
    ZoomIn,
    Download,
    Delete,
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let briefId = "";
    let isReadonly = false;
    //下拉模型
    let columnTypeList = ref([]);
    //数据模型
    let briefForm = reactive({
      data: {
        brief_id: null,
        brief_title: "",
        brief_content: "",
        brief_type: "",
        brief_state: "",
        brief_image: "",
        operate_admin: null,
      },
    });
    //校验规则
    const rules = {
      brief_title: [
        { required: true, message: "请输入内容标题", trigger: "blur" },
      ],
      brief_content: [
        { required: true, message: "请输入内容详情", trigger: "blur" },
      ],
      brief_type: [
        { required: true, message: "请选择内容分类", trigger: "blur" },
      ],
    };
    const formRef = ref(null);
    const editor = ref(null);
    let dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const disabled = ref(false);
    const imageUrl = ref("");
    const fileList = ref([]);
    const handleAvatarSuccess = (res, file) => {
      debugger;
      // imageUrl.value = URL.createObjectURL(file.raw);
      // imageUrl.value = URL.createObjectURL('http://localhost:14474/Images/'+res.data.newFileName);
      imageUrl.value =
        "http://47.93.84.178:14474/Images/" + res.data.newFileName;
    };
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        ElMessage.error("上传文件必须为jpeg格式");
      }
      if (!isLt2M) {
        ElMessage.error("上传文件必须小于10MB!");
      }
      return isJPG && isLt2M;
    };
    const handleRemove = (file) => {
      debugger;
      console.log(file);
      imageUrl.value = "";
    };
    const handlePictureCardPreview = (file) => {
      debugger;
      dialogImageUrl.value = imageUrl.value;
      dialogVisible.value = true;
    };
    const handleDownload = (file) => {
      debugger;
      console.log(file);
    };
    const getWangEditorValue = (str) => {
      briefForm.data.brief_content = str;
    };
    // 提交
    const onSubmit = () => {
      // 表单校验
      briefForm.data.brief_state = "0401";
      briefForm.data.admin_id = "0";
      briefForm.data.admin_ip = "localhost";
      briefForm.data.brief_image = imageUrl.value;
      console.log(briefForm.data);
      addBrief(briefForm.data).then((res) => {
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
    const onDraft = () => {
      briefForm.data.brief_state = "0402";
      console.log(briefForm.data);
    };
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    // 定义方法
    const methods = {
      getParams() {
        briefId = route.query.briefId;
        isReadonly = route.query.isReadonly;
      },
      bindBrief() {
        if (briefId != "") {
          let params = {
            params: {
              brief_id: briefId,
            },
          };
          getBriefById(params).then((res) => {
            debugger;
            briefForm.data = JSON.parse(res.data);
          });
        }
      },
    };
    onMounted(() => {
      getSession();
      methods.getParams();
      methods.bindBrief();
      getColumnType().then((res) => {
        // debugger;
        columnTypeList.value = res.data;
      });
    });
    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,

      methods,
      getSession,
      briefId,
      formRef,
      columnTypeList,
      editor,
      briefForm,
      rules,
      dialogVisible,
      disabled,
      handleRemove,
      handlePictureCardPreview,
      handleDownload,
      onSubmit,
      onDraft,
      getWangEditorValue,
      handleAvatarSuccess,
      beforeAvatarUpload,

      fileList,
    };
  },
};
</script>