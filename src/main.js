import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import '@element-plus/icons-vue'
import { ElMessage } from "element-plus";

const app = createApp(App)
//防止重复点击
app.directive('preventReClick', (el, binding) => {
    function preventReClickFun(elValue, bindingValue) {
        if (!elValue.disabled) {
            elValue.disabled = true
            setTimeout(() => {
                elValue.disabled = false
                // ElMessage.warning("操作过于频繁")
            }, bindingValue.value || 3000)
        }
    }
    el.addEventListener('click', () => preventReClickFun(el, binding))
    binding.dir.unmounted = function () {
        el.removeEventListener('click', () => preventReClickFun(el, binding))
    }
});
//全局变量
app.provide('$cookies', VueCookies);//全局挂载 同vue2.x Vue.prototype.$cookies
app.config.globalProperties.$userId = ""
app.config.globalProperties.$userRole = ""
app.config.globalProperties.$userSchool = ""
app.config.globalProperties.$userName = ""
app.config.globalProperties.$userRealName = ""
//全局变量END
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')