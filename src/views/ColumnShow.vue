<template>
  <div class="portal-wrap">
    <top-tool-bar></top-tool-bar>
    <el-container style="height: calc(100% - 195px)">
      <el-header>
        <h2>{{ briefForm.data.brief_title }}</h2>
        <p>
          <span> 所属分类:{{ briefForm.data.brief_type_name }} </span>
          <el-divider direction="vertical"></el-divider>
          <span>
            创建时间:{{ methods.dateFormat(briefForm.data.create_time) }}
          </span>
        </p>
      </el-header>
      <el-main>
        <!-- <img
          :src="briefForm.data.brief_image"
          style="width: 200px; height: 150px"
          class="html-content"
        /> -->
        <div
          style="background: #ffffff"
          class="html-parent"
        >
          <div
            id="content"
            class="html-content"
            v-html="content"
            style="width: 75%"
          ></div>
        </div>
      </el-main>
    </el-container>
    <portal-footer></portal-footer>
  </div>
</template>

<script>
import moment from "moment";
import { ref, reactive, onMounted } from "vue";
import TopToolBar from "../components/TopToolBar.vue";
import PortalFooter from "../components/PortalFooter.vue";
import { getBriefById } from "../api/serviceApi";
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

    let briefId = "";
    let content = ref("content");
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

      moment,

      briefId,
      briefForm,
      content,
      getBriefById,
      getSession,
      methods,
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
  text-align: center;
}
.html-content {
  margin: 0 auto;
}
</style>