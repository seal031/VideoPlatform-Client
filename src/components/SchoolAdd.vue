<template>
  <div class="container">
    <el-form ref="formRef" :model="SchoolForm.data" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="学校名称" prop="school_name">
            <el-input
              v-model="SchoolForm.data.school_name"
              placeholder="请输入学校名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学校性质" prop="school_type_code">
            <el-select
              v-model="SchoolForm.data.school_type_code"
              value-key="code_id"
              placeholder="请选择"
              popper-class="detailDialog_select-popper"
            >
              <el-option
                v-for="(item, c) in SchoolTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校分类" prop="school_category_code">
            <el-select
              v-model="SchoolForm.data.school_category_code"
              value-key="code_id"
              placeholder="请选择"
              popper-class="detailDialog_select-popper"
            >
              <el-option
                v-for="(item, c) in SchoolCategoryTypeList"
                :key="c"
                :label="item.code_name"
                :value="item.code_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="管理员姓名" prop="SchoolCategoryTypeList">
            <el-input
              v-model="SchoolForm.data.administrator"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员账号" prop="SchoolCategoryTypeList">
            <el-input
              v-model="SchoolForm.data.administrator"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="24">
        <el-button type="primary" :icon="Plus" @click="handleAdd()"
          >新增账号</el-button
        >
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <el-table
      :data="UserList"
      style="width: 100%"
      row-key="user_id"
      border
      lazy
    >
      <el-table-column prop="real_name" label="人员姓名" width="200%">
      </el-table-column>
      <el-table-column prop="user_name" label="账号名称" width="200%">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text " size="small" :icon="Cellphone"
            >编辑</el-button
          >
          <el-button @click="handleDel(scope.row)" type="text" size="small" :icon="Delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" :icon="Plus" @click="onSubmit()"
          >确定</el-button
        >
      </el-col>
    </el-row>
    <el-dialog title="编辑账号" v-model="UserAddVisible">
      <user-add
        :UserId="selectedUserId"
        :SchoolId="selectedSchoolId"
        v-if="UserAddVisible"
      ></user-add>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus,Cellphone,Delete } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, onBeforeUpdate } from "@vue/runtime-core";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getSchoolById,
  getUserBySchoolId,
  addSchool,
  delUser,
} from "../api/serviceApi";
import UserAdd from "../components/UserAdd.vue";
export default {
  components: {
    UserAdd,
  },
  props: {
    SchoolId: ref(String),
    SchoolTypeList: ref([]),
    SchoolCategoryTypeList: ref([]),
  },
  setup(props) {
    const SchoolId = props.SchoolId;
    let UserList = ref([]);
    let selectedUserId = ref("");
    let selectedSchoolId = ref("");
    let UserAddVisible = ref(false);
    //数据模型
    let SchoolForm = reactive({
      data: {
        school_id: null,
        school_name: "",
        school_type_code: "",
        school_category_code: "",
        administrator: "",
        operate_admin: null,
      },
    });

    const bindSchool = () => {
      if (SchoolId != "") {
        let params = {
          params: {
            school_id: SchoolId,
          },
        };
        getSchoolById(params).then((res) => {
          if (res.resultCode == "200") {
            SchoolForm.data = JSON.parse(res.data);
          }
        });
      }
    };
    const onSubmit=()=>{
      
    };

    const bindUserList = () => {
      if (SchoolId != "") {
        let params = {
          params: {
            school_id: SchoolId,
          },
        };
        getUserBySchoolId(params).then((res) => {
          if (res.resultCode == "200") {
            UserList.value = JSON.parse(res.data.UserList);
          }
        });
      }
    };
    const handleAdd = (row) => {
      UserAddVisible.value = true;
      selectedUserId.value = "";
      selectedSchoolId.value = SchoolForm.data.school_id;
    };
    const handleEdit = (row) => {
      UserAddVisible.value = true;
      selectedUserId.value = row.user_id;
      selectedSchoolId.value = SchoolForm.data.school_id;
    };
    const handleDel = (row) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            params: {
              user_id: row.user_id,
              admin_id: "admin",
              admin_ip: "127.0.0.1",
            },
          };
          delUser(params)
            .then((res) => {
              if (res.resultCode == "200") {
                ElMessage.success("删除成功");
                bindUserList();
              } else {
                ElMessage({
                  message: "获取数据失败：" + res.message,
                  grouping: true,
                  type: "error",
                });
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    };

    onMounted(() => {
      bindSchool();
      bindUserList();
    });
    onBeforeUpdate(() => {
      //  bindUserList();
    });
    return {
      Search,
      Plus,
      Delete,
      Cellphone,

      SchoolId,
      UserList,
      selectedUserId,
      selectedSchoolId,
      UserAddVisible,
      SchoolForm,
      bindSchool,
      bindUserList,
      handleAdd,
      handleEdit,
      handleDel,
    };
  },
};
</script>