<template>
  <div class="top-wrap">
    <div class="top-content">
      <el-form class="pcth100">
        <el-row align="middle" justify="space-between" class="pcth100">
          <el-image
            :src="getImageUrl('logo.png')"
            :fit="contain"
            class="top-logo"
          ></el-image>
          <el-form-item class="m0">
            <!-- TODO 绑定model，并搜索 -->
            <el-input
              clearable
              class="top-input"
              size="large"
              placeholder="请输入查找内容"
            >
              <template #append>
                <el-button type="primary" :icon="Search" @click="searchHandle"
                  >搜索</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="m0">
            <div
              class="top-login-btn poi"
              @click="dialogFormVisible = true"
              v-if="loginBtnVisible"
            >
              <el-button type="text" class="text-info-color">登录</el-button>
              <el-avatar
                :icon="Avatar"
                :size="40"
                style="--el-avatar-bg-color: #0c9b91"
              ></el-avatar>
            </div>
            <div v-if="!loginBtnVisible">
              <el-dropdown
                split-button
                type="primary"
                size="small"
                @command="handleDropdown"
              >
                当前用户：{{ realName }}
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="myspace"
                      >我的空间</el-dropdown-item
                    >
                    <el-dropdown-item command="manage"
                      >后台管理</el-dropdown-item
                    >
                    <el-dropdown-item command="logout">登出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <!--仔细阅读Dialog的各个属性参数，会影响到布局排版，例如遇到了一个大坑就是没有设置:append-to-body='true'，导致遮罩遮盖整个页面，:lock-scroll="false"没有设置的话，点击前后会感觉到头部导航栏的移动，体验性很不好！！还有设置dialog的宽度width="40%"前面不用加冒号：-->
            <el-dialog
              title="用户登录"
              v-model="dialogFormVisible"
              width="30%"
              center
              :modal-append-to-body="false"
              append-to-body
            >
              <div class="ms-title">登录系统</div>
              <el-form
                :model="loginModel.data"
                label-width="0px"
                class="ms-content"
              >
                <el-form-item prop="username">
                  <el-input
                    v-model="loginModel.data.user_name"
                    placeholder="请输入账号"
                    tabindex="1"
                  >
                    <template #prepend>
                      <el-button :icon="Avatar"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    placeholder="请输入密码"
                    v-model="loginModel.data.user_pwd"
                    @keyup.enter="submitLogin()"
                    tabindex="2"
                  >
                    <template #prepend>
                      <el-button :icon="Lock"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="login-btn">
                  <el-button type="primary" @click="submitLogin()"
                    >登录</el-button
                  >
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
              </el-form>
            </el-dialog>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Search, Avatar, Lock } from "@element-plus/icons-vue";
import { ref, reactive, inject, onMounted, onBeforeUpdate } from "vue";
import { login } from "../api/serviceApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

export default {
  setup(props,ctx) {
    const router = useRouter();
    const route = useRoute();

    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let dialogFormVisible = ref(false);
    let loginBtnVisible = ref(true);
    //登录模型
    let loginModel = reactive({
      data: {
        user_name: "",
        user_pwd: "",
      },
    });
    const getImageUrl = (name) => {
      return new URL(`../assets/img/${name}`, import.meta.url).href;
    };
    const searchHandle = () => {};
    const submitLogin = () => {
      login(loginModel.data)
        .then((res) => {
          if (res.resultCode == "200") {
            ElMessage.success({
              message: "登录成功",
              type: "success",
            });
            var user = JSON.parse(res.data);
            userId = user.user_id;
            userRole = user.user_role;
            userName = user.user_name;
            realName.value = user.real_name;
            userSchool = user.user_school;
            localStorage.setItem("user_id", user.user_id);
            localStorage.setItem("user_role", user.user_role);
            localStorage.setItem("user_name", user.user_name);
            localStorage.setItem("real_name", user.real_name);
            localStorage.setItem("user_school", user.user_school);
            dialogFormVisible.value = false;
            loginBtnVisible.value = false;
            // methods.callFather();
            debugger
            ctx.emit("getSession");
          } else {
            ElMessage.warning({
              message: "登录失败",
              type: "warning",
            });
            localStorage.setItem("user_id", null);
            localStorage.setItem("user_role", null);
            localStorage.setItem("user_name", null);
            localStorage.setItem("real_name", null);
            localStorage.setItem("user_school", null);
          }
        })
        .catch((err) => {
          debugger;
        });
    };
    const handleDropdown = (command) => {
      console.log(command);
      switch (command) {
        case "myspace":
          const href = router.resolve({
            path: "/MySpace",
            query: { },
          });
          window.open(href.href, "_blank");
          break;
        case "manage":
          const href2 = router.resolve({
            path: "/VideoList",
            query: { },
          });
          window.open(href2.href, "_blank");
          break;
        case "logout":
          ElMessageBox.confirm("确认登出?", "登出", {
            confirmButtonText: "登出",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            localStorage.setItem("user_id", null);
            localStorage.setItem("user_role", null);
            localStorage.setItem("user_name", null);
            localStorage.setItem("real_name", null);
            localStorage.setItem("user_school", null);
            loginBtnVisible.value = true;
          });
          break;
        default:
          break;
      }
    };

    const methods = {
      callFather() {
        debugger
        this.triggerEvent("getSession");
      },
    };

    onBeforeUpdate(() => {});

    onMounted(() => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
      loginBtnVisible.value = userId == null || userId == "";
    });

    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,

      dialogFormVisible,
      loginBtnVisible,
      getImageUrl,
      searchHandle,
      submitLogin,
      handleDropdown,
      loginModel,
      Search,
      Avatar,
      Lock,

      methods,
    };
  },
};
</script>
<style scoped>
.top-wrap {
  height: 72px;
  background: rgba(204, 239, 234, 0.5);
  color: var(--portal-text-color);
  z-index: 1;
  position: relative;
}
.top-content {
  width: 1200px;
  margin: 0 auto;
  height: 100%;
}
.top-content .top-logo {
  min-width: 195px;
}
.top-content .top-input {
  width: 410px;
  --el-input-border-radius: 16px;
  --el-input-border: none;
  --el-input-bg-color: rgba(255, 255, 255, 0.7);
}
.top-content .top-input :deep .el-input-group__append {
  background-color: #026bc6;
  border: 1px solid #026bc6;
  color: #fff;
  padding: 0 29px;
}
.top-content .top-login-btn {
  display: flex;
  align-items: center;
}
.top-content .top-login-btn .el-button {
  position: relative;
  margin-right: 8px;
}
.top-content .top-login-btn .el-button::after {
  content: "";
  width: 100%;
  height: 1px;
  background: var(--portal-text-color);
  position: absolute;
  bottom: 2px;
}

.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>