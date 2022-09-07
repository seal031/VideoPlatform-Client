<template>
  <div class="container">
    <el-form ref="formRef" :model="UserForm.data" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号名称" prop="user_name">
            <el-input
              v-model="UserForm.data.user_name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="real_name">
            <el-input
              v-model="UserForm.data.real_name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号密码" prop="user_pwd">
            <el-input
              v-model="UserForm.data.user_pwd"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="重复密码">
            <el-input
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="管理员姓名" prop="SchoolCategoryTypeList"> -->
            
          <!-- </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="管理员账号" prop="SchoolCategoryTypeList"> -->
           
          <!-- </el-form-item> -->
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-row style="height:30px">
        <el-col :span="20"></el-col>
        <el-col :span="4">
            <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleAdd()"
            >确定</el-button
          >
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUpdate } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserById,addUser } from "../api/serviceApi";
export default {
  props: {
    UserId: ref(String),
    SchoolName: ref(String),
  },
  setup(props) {
      debugger
    const UserId = props.UserId;
    const SchoolName = props.SchoolName;
    //数据模型
    let UserForm = reactive({
      data: {
        school_id: null,
        school_name: "",
        school_type_code: "",
        school_category_code: "",
        administrator: "",
        operate_admin: null,
      },
    });

    const bindUser = () => {
      if (UserId != "") {
        let params = {
          params: {
            user_id: UserId,
          },
        };
        getUserById(params).then((res) => {
          if (res.resultCode == "200") {
              UserForm.data=JSON.parse(res.data);
          }
        });
      }
    };
    const handleAdd=()=>{
        
    }

    onMounted(() => {
      bindUser();
    });
    return {
      UserId,
      SchoolName,
      UserForm,
      bindUser,
      handleAdd,
    };
  },
};
</script>