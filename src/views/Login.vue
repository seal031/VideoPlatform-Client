<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">北京市教育工会智慧工作平台</div>
            <el-form :model="loginModel.data" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="user_name">
                    <el-input v-model="loginModel.data.user_name" placeholder="请输入用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="user_pwd">
                    <el-input type="password" placeholder="请输入密码" v-model="loginModel.data.user_pwd"
                        @keyup.enter="submitLogin()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitLogin()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive,computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "../api/serviceApi";
import OuterIp from "../components/outerNetIp.vue";

export default {
    components:{
        OuterIp,
    },
    setup() {
        const router = useRouter();
        // const param = reactive({
        //     username: "admin",
        //     password: "123123",
        // });
        const rules = {
            user_name: [
                {required: true, message: "请输入用户名",trigger: "blur"},
            ],
            user_pwd: [
                { required: true, message: "请输入密码", trigger: "blur" },
            ],
        };
        // const login = ref(null);
        // const submitForm = () => {
        //     login.value.validate((valid) => {
        //         if (valid) {
        //             ElMessage.success("登录成功");
        //             localStorage.setItem("ms_username", param.username);
        //             router.push("/");
        //         } else {
        //             ElMessage.error("登录成功");
        //             return false;
        //         }
        //     });
        // };

        const store = useStore();
        store.commit("clearTags");
        
        //登录模型
        let loginModel = reactive({
            data: {
                user_name: "",
                user_pwd: "",
                admin_ip:"",
            },
        });
        // 获取的外网IP
        const outerIp = computed(() =>{
            return window.returnCitySN ? window.returnCitySN['cip']: "";
        });
        const submitLogin = () => {
            debugger
            loginModel.data.admin_ip=outerIp.value;
            login(loginModel.data)
                .then((res) => {
                if (res.resultCode == "200") {
                    ElMessage.success({
                        message: "登录成功",
                        type: "success",
                    });
                    var user = JSON.parse(res.data);
                    // userId = user.user_id;
                    // userRole = user.user_role;
                    // userName.value = user.user_name;
                    // realName.value = user.real_name;
                    // userSchool = user.user_school;
                    localStorage.setItem("user_id", user.user_id);
                    localStorage.setItem("user_role", user.user_role);
                    localStorage.setItem("user_name", user.user_name);
                    localStorage.setItem("real_name", user.real_name);
                    localStorage.setItem("user_school", user.user_school);
                    localStorage.setItem("last_visit_time",new Date().getTime());
                    router.push("/portal");
                    // const href = router.resolve({
                    //     path: '/portal',
                    //     query: { },
                    // });
                    // window.open(href.href);
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

        return {
            // param,
            rules,
            // login,
            // submitForm,
            loginModel,
            submitLogin,
            outerIp,
        };
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.png);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #036AC6;
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
    color: #036AC6;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>