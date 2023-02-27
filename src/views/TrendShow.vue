<template>
  <div class="portal-wrap">
    <top-tool-bar></top-tool-bar>
    <div class="width1000">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          breadcrumb
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>正文</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="portal-divider"></el-divider>
      <el-header>
        <h2>{{ trendForm.data.trend_title }}</h2>
        <p>
          <span> 所属分类： {{ trendForm.data.trend_type_name }} </span>
          <el-divider direction="vertical"></el-divider>
          <span>
            创建时间： {{ methods.dateFormat(trendForm.data.create_time) }}
          </span>
        </p>
      </el-header>
      <el-main>
        <!-- <img
          :src="trendForm.data.trend_image"
          style="width: 200px; height: 150px"
          class="html-content"
        /> -->
        <div style="background: #ffffff" class="html-parent">
          <div
            id="content"
            class="html-content"
            v-html="content"
            style="width: 100%"
          ></div>
        </div>
        <div>
          <template v-if="annexObjList && annexObjList.length>0">
            <span>相关附件:</span>
            <p v-for="(item,index) in annexObjList" :key="index">
              <a :href=item.value hreflang="zh">{{item.key}}</a>
            </p>
          </template>
          <template v-else></template>
        </div>
      </el-main>
    </div>
    <portal-footer></portal-footer>
  </div>
</template>
<script>
import moment from "moment";
import { ref, reactive, onMounted } from "vue";
import TopToolBar from "../components/TopToolBar.vue";
import PortalFooter from "../components/PortalFooter.vue";
import { getTrendById,writeLog } from "../api/serviceApi";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

export default {
  components: {
    TopToolBar,
    PortalFooter,
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let breadcrumb = ref(""); // 面包屑
    let breadcrumbParam = ref(""); //面包屑跳转参数

    let trendId = "";
    let content = ref("content");
    let annexObjList=ref([]);
    //数据模型
    let trendForm = reactive({
      data: {
        trend_id: null,
        trend_title: "",
        trend_content: "",
        trend_type: "",
        trend_state: "",
        trend_image: "",
        operate_admin: null,
        create_time: null,
      },
    });
    // 定义方法
    const methods = {
      getParams() {
        trendId = route.query.trendId;
      },
      dateFormat(date) {
        return moment(date).format("YYYY-MM-DD");
      },
      bindTrend() {
        if (trendId != undefined) {
          let params = {
            params: {
              trend_id: trendId,
            },
          };
          getTrendById(params).then((res) => {
            // debugger;
            trendForm.data = JSON.parse(res.data);
            //绑定面包屑
            switch (trendForm.data.trend_type) {
              case "0503":
                breadcrumb.value = "图片新闻";
                breadcrumbParam.value = "tpxw";
                break;
              case "0501":
                breadcrumb.value = "通知公告";
                breadcrumbParam.value = "tzgg";
                break;
              case "0502":
                breadcrumb.value = "政策法规";
                breadcrumbParam.value = "zcfg";
                break;
              case "0505":
                breadcrumb.value = "高校动态";
                breadcrumbParam.value = "gxdt";
                break;
            }
            document.title = trendForm.data.trend_title;
            //记录访问日志
            writeLogs("查看了"+breadcrumb.value+"《"+trendForm.data.trend_title+"》","查看了"+breadcrumb.value+"《"+trendForm.data.trend_title+"》");
            //绑定附件
            debugger
            // var annexStrList=trendForm.data.annex.split(',').filter(i=>i && i.trim());
            // annexStrList.forEach(element => {
              // annexObjList[element]="http://47.93.84.178:14474/Files/"+element;
              // annexObjList.value.push({'key':element,'value':"http://47.93.84.178:14474/Files/"+element});
            // });
            // console.log(annexObjList.value.length)
            //绑定新闻内容
            content.value = marked(trendForm.data.trend_content, {
              breaks: true,
            }).replace(/<pre>/g, "<pre class='hljs'>");
          });
        }
      },
    };
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };
    
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
      methods.getParams();
      methods.bindTrend();
      marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function (code) {
          return hljs.highlightAuto(code).value;
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: true,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: true,
      });
    });
    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,
      breadcrumb,
      breadcrumbParam,

      moment,

      trendId,
      trendForm,
      annexObjList,
      content,
      getTrendById,
      getSession,
      methods,
      writeLogs,
    };
  },
};
</script>

<style scoped>
.el-header {
  text-align: center;
  margin: 20px 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
}
.el-header h2 {
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
}
.portal-wrap {
  height: 100%;
  overflow: auto;
}
.html-parent {
  text-align: left;
}
.html-content {
  margin: 0 auto;
}
</style>