<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;北京教育工会智慧平台</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="poi" @click="logout">
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>{{realName}}</span>
                </div>
                <!-- 用户名下拉菜单 -->
                <!-- <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-dropdown> -->
            </div>
        </div>
    </div>
</template>
<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    setup() {
        const username = localStorage.getItem("real_name");
        const message = 2;

        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        // 侧边栏折叠
        const collapseChage = () => {
            store.commit("handleCollapse", !collapse.value);
        };

        onMounted(() => {
            if (document.body.clientWidth < 1500) {
                collapseChage();
            }
        });

        // 用户名下拉菜单选择事件
        const router = useRouter();
        const handleCommand = (command) => {
            if (command == "loginout") {
                localStorage.removeItem("real_name");
                router.push("/login");
            } else if (command == "user") {
                router.push("/user");
            }
        };
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
                //退出跳转至登录页面
                router.push("/login");
        });
        };

        return {
            username,
            message,
            collapse,
            collapseChage,
            handleCommand,
            logout,
        };
    },
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #070707;
    background-color: #dbedf3;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 350px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #070707;
}
.btn-bell .el-icon-bell {
    color: #070707;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #070707;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}

.header .top-logo {
  width: 250px;
}

.header .top-input {
  width: 410px;
  --el-input-border-radius: 16px;
  --el-input-border: none;
  --el-input-bg-color: rgba(255, 255, 255, 0.7);
}

.header .top-input :deep .el-input-group__append {
  background-color: #026bc6;
  border: 1px solid #026bc6;
  color: #fff;
  padding: 0 29px;
}

.header .top-login-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(96, 96, 96, 0.6);
  transition: color 0.1s linear;
  height: 100%;
  justify-content: center;
  margin-right: 22px;
}

.header .top-login-btn .el-icon {
  font-size: 22px;
}


.header .top-login-btn span {
  font-size: 12px;
  line-height: 12px;
  margin-top: 6px;
}

.header .top-login-btn:hover {
  color: #fff !important;
}
</style>
