<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" @select="handleSelect" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch,ref } from "vue";
  import {  onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {writeLog} from "../api/serviceApi"
export default {
    setup() {
        let userId = "";
        let userRole = "";
        let userName = "";
        let realName = ref("");
        let userSchool = "";

        const items = [
            {
                icon: "el-icon-lx-camera",
                index: "/VideoList",
                title: "视频资源管理",
            },
            {
                icon: "el-icon-lx-cascades",
                index: "/ColumnList",
                title: "内容发布管理",
            },
            {
                icon: "el-icon-lx-lock",
                index: "/UserList",
                title: "用户权限管理",
            },
            {
                icon: "el-icon-lx-calendar",
                index: "/LogList",
                title: "系统日志管理",
            },
        ];

        const writeLogs=((log_content,log_detail)=>{
            let params={
                params:{
                    user_id:userId,
                    user_ip:"",
                    operate_content:log_content,
                    operate_detail:log_detail
                }
            }
            writeLog(params).then((res)=>{
                
            })
        })
        onMounted(() => {
            getSession();
        });
        
        const getSession = () => {
            userId = localStorage.getItem("user_id");
            userRole = localStorage.getItem("user_role");
            userName = localStorage.getItem("user_name");
            realName.value = localStorage.getItem("real_name");
            userSchool = localStorage.getItem("user_school");
        };

        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        const handleSelect=((key,keypath)=>{
            debugger
            switch(key){
                case "/VideoList":
                    writeLogs("访问视频资源管理","访问视频资源管理");
                    break;
                case "/ColumnList":
                    writeLogs("访问内容发布管理","访问内容发布管理");
                    break;
                case "/UserList":
                    writeLogs("访问用户权限管理","访问用户权限管理");
                    break;
                case "/LogList":
                    writeLogs("访问系统日志管理","访问系统日志管理");
                    break;
                default:
                    break;
            }
        })

        return {
            userRole,
            userName,
            realName,
            userSchool,

            items,
            onRoutes,
            collapse,
            getSession,
            handleSelect,
            writeLogs,
        };
    },
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    background-color: #dbedf3;
    border: 2px;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
    background-color: #dbedf3;
}
.sidebar > ul {
    height: 100%;
}
</style>
