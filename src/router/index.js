import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Portal from "../views/Portal.vue"
import Brief from "../views/ColumnShow.vue"
import Video from "../views/VideoShow.vue"
import BriefList from "../views/PortalColumnList.vue"
import VideoList from "../views/PortalVideoList.vue"
import MySpace from "../views/MySpace.vue"

const routes = [
    {
        path: '/portal',
        name: 'portal',
        component: Portal,
    },
    // {
    //     path: '/',
    //     redirect: '/portal'
    // },
    {
        path: "/portalBriefList",
        name: "portalBriefList",
        component: BriefList,
    },
    {
        path: "/BriefShow",
        name: "BriefShow",
        meta:{
            title:'通知公告'
        },
        component: Brief,
    },
    {
        path: "/portalVideoList",
        name: "portalVideoList",
        component: VideoList,
    },
    {
        path: "/VideoShow",
        name: "VideoShow",
        meta: {
            title: '视频详情',
            permission: false
        },
        component: Video
    },
    {
        path: "/MySpace",
        name: "MySpace",
        component: MySpace,
    },
    {
        path: "/Manage",
        name: "Manage",
        component: Home,
        children: [{
            path: "/VideoList",
            name: "VideoList",
            meta: {
                title: '视频资源管理'
            },
            component: () => import( /* webpackChunkName: "table" */ "../views/VideoList.vue")
        }, {
            path: "/VideoAdd",
            name: "VideoAdd",
            meta: {
                title: '添加视频'
            },
            component: () => import( /* webpackChunkName: "charts" */ "../views/VideoAdd.vue")
        }, {
            path: "/ColumnList",
            name: "ColumnList",
            meta: {
                title: '内容发布管理'
            },
            component: () => import( /* webpackChunkName: "form" */ "../views/ColumnList.vue")
        }, {
            path: "/ColumnAdd",
            name: "ColumnAdd",
            meta: {
                title: '添加内容'
            },
            component: () => import( /* webpackChunkName: "tabs" */ "../views/ColumnAdd.vue")
        }, {
            path: "/UserList",
            name: "UserList",
            meta: {
                title: '系统权限管理'
            },
            component: () => import( /* webpackChunkName: "donate" */ "../views/UserList.vue")
        }, {
            path: "/UserAdd",
            name: "UserAdd",
            meta: {
                title: '添加学校',
                permission: true
            },
            component: () => import( /* webpackChunkName: "permission" */ "../components/UserAdd.vue")
        }, {
            path: "/ColumnShow",
            name: "ColumnShow",
            meta: {
                title: '内容详情',
                permission: false
            },
            component: () => import("../views/ColumnShow.vue")
        }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'vue-manage-system';
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;