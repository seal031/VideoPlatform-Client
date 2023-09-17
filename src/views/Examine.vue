<template>
    <div class="portal-wrap">
      <top-tool-bar></top-tool-bar>
      <div class="width1000">
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
          <div style="background: #ffffff" class="html-parent">
            <div
              id="content"
              class="html-content"
              v-html="content"
              style="width: 100%"
            ></div>
          </div>
        <el-divider class="portal-divider"  v-if="examineRecordList && examineRecordList.length>0"></el-divider>
        <div v-if="examineRecordList && examineRecordList.length>0">
            <span>历史审核意见:</span>
            <template v-if="examineRecordList && examineRecordList.length>0">
              <div style="width: 100%; height: 100%">
                <el-table
                :data="examineRecordList"
                border
                style="width: 100%; height: 100%"
                >
                <el-table-column
                    prop="examine_time"
                    label="时间"
                    width="200"
                    :formatter="methods.dateFormat"
                ></el-table-column>
                <el-table-column prop="examine_by" label="用户名" width="200">
                </el-table-column>
                <el-table-column prop="examine_remark" label="审核意见">
                </el-table-column>
                </el-table>
              </div>  
            </template>
        </div>
        <el-divider class="portal-divider"></el-divider>
        <div>
            <el-row>
              <el-input
                v-model="examine_remark"
                :rows="2"
                type="textarea"
                placeholder="请输入审核意见"
              />
            </el-row>
            <el-row>
              <el-col :span="8"></el-col>
              <el-col :span="8">
                <el-button type="primary" @click="onSubmit">通过并发布</el-button>
                <el-button type="primary" @click="onRefuse">驳回</el-button>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
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
    </div>
  </template>
  <script>
  import moment from "moment";
  import { ref, reactive, onMounted } from "vue";
  import { getTrendById,getExamineByTrendId,AddExamineRecord,writeLog } from "../api/serviceApi";
  import { useRoute, useRouter } from "vue-router";
  import { marked } from "marked";
  import hljs from "highlight.js";
  import "highlight.js/styles/monokai-sublime.css";
  import { ElMessage, ElMessageBox } from "element-plus";
  
  export default {
    props:{
        trendId:{
        type: String ,
        default:""
        },
        handleCloseExamine:{
        type:Boolean,
        default:false
        }
    },
    components: {
    },
    setup(props,context) {
      let route = useRoute(); //可以在setup中使用route获取参数
      let userId = "";
      let userRole = "";
      let userName = "";
      let realName = ref("");
      let userSchool = "";
      let breadcrumb = ref(""); // 面包屑
      let breadcrumbParam = ref(""); //面包屑跳转参数
  
      let trendId = props.trendId;
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
      let examineRecordList = ref([]);
      const examineForm=reactive({
          data:{
            trend_id:trendId,
            examine_by:"",
            examine_state:"",
            examine_remark:"",
            }
        });
      let examine_remark=ref("");

      // 定义方法
      const methods = {
        getParams() {
          
        },
        dateFormat(date) {
          return moment(date).format("YYYY-MM-DD");
        },
        bindTrend() {
          debugger
          if (trendId != undefined) {
            let params = {
              params: {
                trend_id: trendId,
              },
            };
            getTrendById(params).then((res) => {
              debugger;
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
                  breadcrumb.value = "基层动态";
                  breadcrumbParam.value = "gxdt";
                  break;
              }
              document.title = trendForm.data.trend_title;
              //记录访问日志
              writeLogs("查看了"+breadcrumb.value+"《"+trendForm.data.trend_title+"》","查看了"+breadcrumb.value+"《"+trendForm.data.trend_title+"》");
              //绑定附件 todo
              debugger
              // var annexStrList=trendForm.data.annex.split(',').filter(i=>i && i.trim());
              // annexStrList.forEach(element => {
              //   // annexObjList[element]="http://47.93.84.178:14474/Files/"+element;
              //   annexObjList.value.push({'key':element,'value':"http://47.93.84.178:14474/Files/"+element});
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

      const getExamineList=()=>{
        if (trendId != undefined) {
                let params = {
                    params: {
                        trend_id: trendId,
                        examineStates:"0404",//驳回的
                    },
                };
                getExamineByTrendId(params).then((res) => {
                    debugger;
                    examineRecordList.value=JSON.parse(res.data.ExamineRecordList);
                    // trend=res.data.trend;
                    trendForm.data = JSON.parse(res.data.Trend);
                    document.title = trendForm.data.trend_title;
                    //绑定新闻内容
                    content.value = marked(trendForm.data.trend_content, {
                      breaks: true,
                    }).replace(/<pre>/g, "<pre class='hljs'>");
                });
            }
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

      const onSubmit=()=>{
        examineForm.data.examine_state="0401";
        examineForm.data.examine_remark=examine_remark.value;
        examineForm.data.examine_by=userId;
        AddExamineRecord(examineForm.data).then((res)=>{
          if(res.resultCode=="200"){
            ElMessage.success("审核成功");
            context.emit('dialogclose');
          }
          else{
            ElMessage({
                  message: "保存数据失败：" + res.message,
                  grouping: true,
                  type: "error",
                });
          }
        });
      };
      const onRefuse=()=>{
        examineForm.data.examine_state="0404";
        examineForm.data.examine_remark=examine_remark.value;
        examineForm.data.examine_by=userId;
        AddExamineRecord(examineForm.data).then((res)=>{
          debugger
          if(res.resultCode=="200"){
            ElMessage.success("驳回成功");
            context.emit('dialogclose');
          }
          else{
            ElMessage({
                  message: "保存数据失败：" + res.message,
                  grouping: true,
                  type: "error",
                });
          }
        });
      };
  
      onMounted(() => {
        getSession();
        methods.getParams();
        // methods.bindTrend();
        getExamineList();
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
        examineRecordList,
        examineForm,
        examine_remark,
        annexObjList,
        content,
        getTrendById,
        getSession,
        onSubmit,
        onRefuse,
        getExamineList,
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
    <!-- height: 100%;
    overflow: auto; -->
  }
  .html-parent {
    text-align: left;
  }
  .html-content {
    margin: 0 auto;
  }
  </style>