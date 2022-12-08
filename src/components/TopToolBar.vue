<template>
  <div class="top-wrap">
    <div class="top-content">
      <el-form class="pcth100">
        <el-row align="top" justify="space-between" class="pcth100">
          <div class="top-logo pcth100">
            <el-image :src="getImageUrl('logo.png')" :fit="contain" ></el-image>
          </div>
          <el-form-item class="m0 pcth100">
            <el-input
              class="top-input"
              size="normal"
              placeholder="请输入查找内容"
              v-model="keyword"
              @keyup.enter="searchHandle"
            >
              <template #append>
                <el-button type="primary" :icon="Search" @click="searchHandle" 
                  >搜索</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="pcth100 menu" style="width: 250px;">
            <!--<div v-if="!loginBtnVisible">
              <el-dropdown split-button type="primary" size="small" @command="handleDropdown">
                当前用户：{{ realName }}
                <template #dropdown>
                  <el-dropdown-menu>
                     <el-dropdown-item command="myspace"
                      >我的空间</el-dropdown-item
                    >
                    <el-dropdown-item command="manage"
                      >后台管理</el-dropdown-item
                    > 
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>-->
            <div class="top-login-btn poi" @click="dialogFormVisible = true" v-if="loginBtnVisible">
              <el-icon>
                <Avatar />
              </el-icon>
              <span>登录</span>
            </div>
            <div class="top-login-btn poi" v-if="!loginBtnVisible" @click="logout">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ realName }}</span>
            </div>
            <div class="top-login-btn poi" v-if="!loginBtnVisible" @click="dialogChangePwdVisible = true">
              <el-icon>
                <Edit />
              </el-icon>
              <span>修改密码</span>
            </div>
            <div class="top-login-btn poi" v-if="!loginBtnVisible" @click="JumpToMySpace">
              <el-icon>
                <HomeFilled />
              </el-icon>
              <span>我的</span>
            </div>
            <div class="top-login-btn poi" v-if="manageBtnVisible" @click="JumpToManage">
              <el-icon>
                <Setting />
              </el-icon>
              <span>管理</span>

            </div>
            <!--仔细阅读Dialog的各个属性参数，会影响到布局排版，例如遇到了一个大坑就是没有设置:append-to-body='true'，导致遮罩遮盖整个页面，:lock-scroll="false"没有设置的话，点击前后会感觉到头部导航栏的移动，体验性很不好！！还有设置dialog的宽度width="40%"前面不用加冒号：-->
            <el-dialog title="用户登录" v-model="dialogFormVisible" :show-close="false" width="30%" center
              :modal-append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
              <!-- <div class="ms-title">登录系统</div> -->
              <el-form :model="loginModel.data" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                  <el-input v-model="loginModel.data.user_name" placeholder="请输入账号" tabindex="1">
                    <template #prepend>
                      <el-button :icon="Avatar"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" placeholder="请输入密码" v-model="loginModel.data.user_pwd"
                    @keyup.enter="submitLogin()" tabindex="2">
                    <template #prepend>
                      <el-button :icon="Lock"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="login-btn">
                  <el-button type="primary" @click="submitLogin()">登录</el-button>
                </div>
              </el-form>
            </el-dialog>
            <el-dialog title="修改密码" v-model="dialogChangePwdVisible" :show-close="true" width="30%" center
              :modal-append-to-body="true" append-to-body>
              <!-- <div class="ms-title">修改密码</div> -->
              <el-form class="ms-content">
                <el-form-item label="当前账号：" style="margin-bottom: 0;">{{ userName }}</el-form-item>
                <el-form-item label="用户姓名：" style="margin-bottom: 10px;">{{ realName }}</el-form-item>
                <el-form-item prop="username">
                  <el-input v-model="newPwd" placeholder="新密码" tabindex="1">
                    <template #prepend>
                      <el-button :icon="Lock"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="newPwdCheck" placeholder="重复密码" @keyup.enter="submitChangePwd()" tabindex="2">
                    <template #prepend>
                      <el-button :icon="Lock"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="login-btn">
                  <el-button type="primary" @click="submitChangePwd()">修改</el-button>
                </div>
              </el-form>
            </el-dialog>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Search, Avatar, Lock, HomeFilled, Setting } from "@element-plus/icons-vue";
import { ref, reactive, inject, onMounted, onBeforeUpdate, watch, computed } from "vue";
import { login, resetPwd } from "../api/serviceApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import OuterIp from "../components/outerNetIp.vue";

export default {
  props: {
    keyword: ref(""),
  },
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();

    let userId = "";
    let userRole = "";
    let userName = ref("");
    let realName = ref("");
    let userSchool = "";
    let keyword = ref("");

    let dialogFormVisible = ref(false);
    let dialogChangePwdVisible = ref(false);
    let newPwd = ref("");
    let newPwdCheck = ref("");
    let loginBtnVisible = ref(true);
    let manageBtnVisible = ref(false);
    //登录模型
    let loginModel = reactive({
      data: {
        user_name: "",
        user_pwd: "",
        admin_ip: "",
      },
    });
    const getImageUrl = (name) => {
      return new URL(`http://47.93.84.178:8080/assets/img/${name}`, import.meta.url).href;
    };
    // 获取的外网IP
    const outerIp = computed(() => {
      return window.returnCitySN ? window.returnCitySN['cip'] : "";
    });
    const JumpToMySpace = () => {
      const href = router.resolve({
        path: '/MySpace',
        query: {},
      });
      window.open(href.href, "_blank");
    };
    const JumpToManage = () => {
      const href = router.resolve({
        path: '/VideoList',
        query: {},
      });
      window.open(href.href, "_blank");
    };
    const searchHandle = () => {
      debugger
      const href = router.resolve({
        path: '/SearchResult',
        query: { keyword: keyword.value },
      });
      window.open(href.href, "_blank");
    };
    const submitLogin = () => {
      loginModel.admin_ip = outerIp;
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
            userName.value = user.user_name;
            realName.value = user.real_name;
            userSchool = user.user_school;
            localStorage.setItem("user_id", user.user_id);
            localStorage.setItem("user_role", user.user_role);
            localStorage.setItem("user_name", user.user_name);
            localStorage.setItem("real_name", user.real_name);
            localStorage.setItem("user_school", user.user_school);
            localStorage.setItem("userIP", outerIp);
            dialogFormVisible.value = false;
            dialogChangePwdVisible.value = false;
            loginBtnVisible.value = false;
            manageBtnVisible.value = userRole == "0101";
            // methods.callFather();
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
    const submitChangePwd = () => {
      if (newPwd.value != newPwdCheck.value) {
        ElMessage({
          message: "两次输入的密码不一致",
          grouping: true,
          type: "error",
        });
        return;
      }
      let params = {
        params: {
          user_id: userId,
          newPwd: newPwd.value,
        }
      };
      resetPwd(params).then((res) => {
        if (res.resultCode == "200") {
          ElMessage.success("修改密码成功");
          dialogFormVisible.value = false;
          dialogChangePwdVisible.value = false;
          loginBtnVisible.value = false;
          newPwd.value = "";
          newPwdCheck.value = "";
        }
        else {
          ElMessage({
            message: "修改密码失败：" + res.message,
            grouping: true,
            type: "error",
          });
        }
      });
    };
    const handleDropdown = (command) => {
      console.log(command);
      switch (command) {
        case "myspace":
          const href = router.resolve({
            path: "/MySpace",
            query: {},
          });
          window.open(href.href, "_blank");
          break;
        case "manage":
          const href2 = router.resolve({
            path: "/VideoList",
            query: {},
          });
          window.open(href2.href, "_blank");
          break;
        case "logout":
          logout();
          break;
        default:
          break;
      }
    };

    const methods = {
      callFather() {
        this.triggerEvent("getSession");
      },
    };

    onBeforeUpdate(() => {
      debugger
      keyword.value = props.keyword;
    });

    onMounted(async () => {
      // init();
    });


    const init = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName.value = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
      console.log("顶端" + userId);
      console.log("顶端" + userRole);
      console.log("顶端" + userName.value);
      console.log("顶端" + realName.value);
      console.log("顶端" + userSchool);
      loginBtnVisible.value = userId == null || userId == "" || userId == undefined || userId == "null";
      manageBtnVisible.value = userRole == "0101";
    };
    init();//在setup中执行，先于watch

    watch(loginBtnVisible, (val) => {
      if (val) {
        dialogFormVisible.value = true;
      }
    }, { immediate: true })

    const logout = () => {
      ElMessageBox.confirm("确认退出?", "退出", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        localStorage.setItem("user_id", null);
        localStorage.setItem("user_role", null);
        localStorage.setItem("user_name", null);
        localStorage.setItem("real_name", null);
        localStorage.setItem("user_school", null);
        // localStorage.removeItem("ms_username");
        loginBtnVisible.value = true;
        manageBtnVisible.value = false;
        //退出跳转至登录页面
        router.push("/login");
      });
    };

    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,
      keyword,

      dialogFormVisible,
      dialogChangePwdVisible,
      newPwd,
      newPwdCheck,
      loginBtnVisible,
      manageBtnVisible,
      getImageUrl,
      JumpToMySpace,
      JumpToManage,
      searchHandle,
      submitLogin,
      submitChangePwd,
      handleDropdown,
      loginModel,
      Search,
      Avatar,
      HomeFilled,
      Setting,
      Lock,

      init,
      methods,
      logout,
    };
  },
};
</script>
<style scoped>
.top-wrap {
  height: 50px;
  background: rgba(204, 239, 234, 0.5);
  color: var(--portal-text-color);
  z-index: 1;
  position: relative;
}

.top-content {
  width: 1000px;
  margin: 0 auto;
  height: 100%;
}

.top-content .top-logo {
  width: 250px;
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
  flex-direction: column;
  align-items: center;
  color: rgba(96, 96, 96, 0.6);
  transition: color 0.1s linear;
  height: 100%;
  justify-content: center;
  margin-right: 22px;
}

.top-content .top-login-btn .el-icon {
  font-size: 22px;
}


.top-content .top-login-btn span {
  font-size: 12px;
  line-height: 12px;
  margin-top: 6px;
}

.top-content .top-login-btn:hover {
  color: #fff !important;
}

/* .top-content .top-login-btn .el-button {
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
} */

.menu :deep .el-form-item__content {
  justify-content: flex-end;
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
  padding: 0 30px;
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