import axios from 'axios';
import router from '../router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessageBox } from "element-plus";

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    // timeout: 5000
    baseURL: 'http://47.93.84.178:14474/', //接口统一域名
    timeout: 10000, //设置超时
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;',
    }
});

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 600, showSpinner: false })

service.interceptors.request.use(function (config) {
    // 启动进度条
    NProgress.start()
    return config
})

let loading;
//正在请求的数量
let requestCount = 0
//显示loading
const showLoading = () => {
    if (requestCount === 0 && !loading) {
        loading = ElLoading.service({
            text: "Loading  ",
            background: 'rgba(0, 0, 0, 0.7)',
            spinner: 'el-icon-loading',
        })
    }
    requestCount++;
}

// service.interceptors.request.use(
//     config => {
//         return config;
//     },
//     error => {
//         console.log(error);
//         return Promise.reject();
//     }
// );

// service.interceptors.response.use(
//     response => {
//         if (response.status === 200) {
//             return response.data;
//         } else {
//             Promise.reject();
//         }
//     },
//     error => {
//         console.log(error);
//         return Promise.reject();
//     }
// );
service.interceptors.response.use(res => {
    // debugger
    if (typeof res.data !== 'object') {
        ElMessageBox.alert("服务器异常，请稍后再试！")
        return Promise.reject(res)
    }
    if (res.data.resultCode != 200) {
        if (res.data.message!=null) ElMessageBox.alert(res.data.message)
        if (res.data.resultCode == 416) {
            router.push({path: '/login'})
        }
        return Promise.reject(res.data)
    }

    // 关闭进度条
    NProgress.done()
    // let userId = localStorage.getItem("user_id");
    // console.log('根接口user_id为'+userId);
    // if(userId !=undefined){
    //     console.log('更新了访问时间');
    //     localStorage.setItem("last_visit_time",new Date().getTime());
    // }
    return res.data
})

export default service;
