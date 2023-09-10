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
        <h2>{{ briefForm.data.brief_title }}</h2>
        <p>
          <!-- <span> 所属分类： {{ briefForm.data.brief_type_name }} </span> -->
          <span> 发布单位：北京市教育工会 </span>
          <el-divider direction="vertical"></el-divider>
          <span>
            发布时间： {{ methods.dateFormat(briefForm.data.public_time) }}
          </span>
        </p>
      </el-header>
      <el-main>
        <!-- <img
          :src="briefForm.data.brief_image"
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
import { getBriefById,writeLog } from "../api/serviceApi";
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

    let briefId = "";
    let content = ref("content");
    let annexObjList=ref([]);
    //数据模型
    let briefForm = reactive({
      data: {
        brief_id: null,
        brief_title: "",
        brief_content: "",
        brief_type: "",
        brief_state: "",
        brief_image: "",
        operate_admin: null,
        create_time: null,
        public_time:null,
      },
    });
    // 定义方法
    const methods = {
      getParams() {
        briefId = route.query.briefId;
      },
      dateFormat(date) {
        return moment(date).format("YYYY-MM-DD");
      },
      bindBrief() {
        if (briefId != undefined) {
          let params = {
            params: {
              brief_id: briefId,
            },
          };
          getBriefById(params).then((res) => {
            // debugger;
            briefForm.data = JSON.parse(res.data);
            //绑定面包屑
            switch (briefForm.data.brief_type) {
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
              // TODO---先进个人/单位参数
              case "0507":
                breadcrumb.value = "先进个人";
                breadcrumbParam.value = "advance";
                break;
              case "0508":
                breadcrumb.value = "先进单位";
                breadcrumbParam.value = "advance";
                break;
            }
            document.title = briefForm.data.brief_title;
            //记录访问日志
            writeLogs("查看了"+breadcrumb.value+"《"+briefForm.data.brief_title+"》","查看了"+breadcrumb.value+"《"+briefForm.data.brief_title+"》");
            //绑定附件
            debugger
            var annexStrList=briefForm.data.annex.split(',').filter(i=>i && i.trim());
            annexStrList.forEach(element => {
              // annexObjList[element]="http://47.93.84.178:14474/Files/"+element;
              annexObjList.value.push({'key':element,'value':"http://47.93.84.178:14474/Files/"+element});
            });
            console.log(annexObjList.value.length)
            //绑定新闻内容
            content.value = marked(briefForm.data.brief_content, {
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
      methods.bindBrief();
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

      briefId,
      briefForm,
      annexObjList,
      content,
      getBriefById,
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