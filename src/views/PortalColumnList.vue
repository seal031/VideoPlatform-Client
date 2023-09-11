<template>
  <div class="overflowShow">
    <top-tool-bar></top-tool-bar>
    <!--<div class="overflowShow">-->
    <div class="block">
      <el-breadcrumb separator=">" class="mt20 mb20">
        <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{breadcrumb}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="portal-divider"></el-divider>

      <el-tabs tab-position="left" style="min-height: calc(100% - 225px)" v-model="activeTab">
        <el-tab-pane label="图片新闻" name="tpxw">
        <div class="tr mt10">
          <el-pagination @current-change="handleCurrentChangeTpxw" v-model:currentPage="tpxwQuery.params.pageIndex"
            v-model:page-size="tpxwQuery.params.pageSize" layout="total, prev, pager, next" :total="tpxwTotalCount">
          </el-pagination>
        </div>
          <el-table :data="tpxwList" style="width: 100%" :show-header="false" class="customer-table poi"
          @row-click="showBrief">
          <el-table-column prop="brief_title" label="">
          </el-table-column>
          <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="通知公告" name="tzgg">
        <div class="tr mt10">
          <el-pagination @current-change="handleCurrentChangeTzgg" v-model:currentPage="tzggQuery.params.pageIndex"
            v-model:page-size="tzggQuery.params.pageSize" layout="total, prev, pager, next" :total="tzggTotalCount">
          </el-pagination>
        </div>
          <el-table :data="tzggList" style="width: 100%" :show-header="false" class="customer-table poi"
          @row-click="showBrief">
          <el-table-column prop="brief_title" label="">
          </el-table-column>
          <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="政策法规" name="zcfg">
        <div class="tr mt10">
          <el-pagination @current-change="handleCurrentChangeZcfg" v-model:currentPage="zcfgQuery.params.pageIndex"
            v-model:page-size="zcfgQuery.params.pageSize" layout="total, prev, pager, next" :total="zcfgTotalCount">
          </el-pagination>
        </div>
          <el-table :data="zcfgList" style="width: 100%" :show-header="false" class="customer-table poi"
          @row-click="showBrief">
          <el-table-column prop="brief_title" label="">
          </el-table-column>
          <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="基层动态" name="gxdt">
        <div class="tr mt10">
          <el-pagination @current-change="handleCurrentChangeGxdt" v-model:currentPage="gxdtQuery.params.pageIndex"
            v-model:page-size="gxdtQuery.params.pageSize" layout="total, prev, pager, next" :total="gxdtTotalCount">
          </el-pagination>
        </div>
          <el-table :data="gxdtList" style="width: 100%" :show-header="false" class="customer-table poi"
          @row-click="showTrend">
          <el-table-column prop="trend_title" label="">
          </el-table-column>
          <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="北京教工" name="bjjg">
        <div class="tr mt10">
          <el-pagination @current-change="handleCurrentChangeBjjg" v-model:currentPage="bjjgQuery.params.pageIndex"
            v-model:page-size="bjjgQuery.params.pageSize" layout="total, prev, pager, next" :total="bjjgTotalCount">
          </el-pagination>
        </div>
          <el-table :data="bjjglist" style="width: 100%" :show-header="false" class="customer-table poi"
          @row-click="showTrend">
          <el-table-column prop="trend_title" label="">
          </el-table-column>
          <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane :label="advanceTitle" name="advance">
          <div class="tr mt10">
            <el-pagination @current-change="handleCurrentChangeAdvance" v-model:currentPage="advanceQuery.params.pageIndex"
              v-model:page-size="advanceQuery.params.pageSize" layout="total, prev, pager, next" :total="advanceTotalCount">
            </el-pagination>
          </div>
          <portal-notice :data="advanceList"></portal-notice>
          <!-- <el-table
            :data="tpxwList"
            style="width: 100%"
            :show-header="false"
            class="customer-table poi"
            @row-click="showBrief"
          >
            <el-table-column prop="brief_title" label="">
            </el-table-column>
            <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
            </el-table-column>
          </el-table> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <portal-footer></portal-footer>
  </div>
</template>

<script>
import moment from "moment";
import TopToolBar from "../components/TopToolBar.vue";
import PortalFooter from "../components/PortalFooter.vue";
import { getBriefList, getBriefBaseList,getTrendList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PortalNotice from './subpages/PortalNotice.vue';

export default {
  methods: {
    showBrief(row) {
      const href = this.$router.resolve({
        path: "/BriefShow",
        query: { briefId: row.brief_id },
      });
      window.open(href.href, "_blank");
    },
    showTrend(row){
      const href = this.$router.resolve({
        path: "/TrendShow",
        query: { trendId: row.trend_id },
      });
      window.open(href.href, "_blank");
    },
  },
  components: {
    TopToolBar,
    PortalFooter,
    PortalNotice
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let activeTab = ref("");

    let tpxwList = ref([]); //图片新闻模型列表
    let tzggList = ref([]); //通知公告模型列表
    let zcfgList = ref([]); //政策法规模型列表
    let gxdtList=ref([]);//基层动态模型列表
    let bjjglist=ref([]);//北京教工模型列表
    let advanceList = ref([]) // 先进个人/单位列表
    let tpxwTotalCount = ref(0); // 图片新闻总数
    let tzggTotalCount = ref(0); // 通知公告总数
    let zcfgTotalCount = ref(0); // 政策法规总数
    let gxdtTotalCount=ref(0);//基层动态总数
    let bjjgTotalCount=ref(0);//北京教工总数
    let advanceTotalCount = ref(0); // 先进个人/单位总数

    let tpxwQuery = reactive({
      params: {
        briefType: "0503", //图片新闻
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let tzggQuery = reactive({
      params: {
        briefType: "0501", //通知公告
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let zcfgQuery = reactive({
      params: {
        briefType: "0502", //政策法规
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let gxdtQuery = reactive({
      params: {
        trendStateList: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let bjjgQuery=reactive({
      params: {
        briefType: "0506", // 北京教工
        trendStateList: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let advanceQuery=reactive({ // 先进个人/单位参数
      params: {
        trendStateList: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 20,
      },
    });
    let breadcrumb = ref(""); // 面包屑

    const methods = {
      getParams() {
        activeTab.value = route.query.activeTab;
        switch (activeTab.value) {
          case "tpxw":
            breadcrumb.value = "图片新闻";
            break;
          case "tzgg":
            breadcrumb.value = "通知公告";
            break;
          case "zcfg":
            breadcrumb.value = "政策法规";
            break;
          case "gxdt":
            breadcrumb.value = "基层动态";
            break;
          case "advance":
            breadcrumb.value = route.query.title;
            break;
        }
      },
      getTpxwList() {
        getBriefList(tpxwQuery).then((res) => {
          if (res.resultCode == "200") {
            tpxwList.value = JSON.parse(res.data.BriefList);
            tpxwTotalCount.value = res.data.totalCount;
          }
        });
      },
      getTzggList() {
        //通知公告
        getBriefList(tzggQuery).then((res) => {
          if (res.resultCode == "200") {
            tzggList.value = JSON.parse(res.data.BriefList);
            tzggTotalCount.value = res.data.totalCount;
          }
        });
      },
      getZcfgList() {
        //政策法规
        getBriefList(zcfgQuery).then((res) => {
          if (res.resultCode == "200") {
            zcfgList.value = JSON.parse(res.data.BriefList);
            zcfgTotalCount.value = res.data.totalCount;
          }
        });
      },
      getGxdtList(){
        //基层动态
        getTrendList(gxdtQuery).then((res)=>{
          if (res.resultCode == "200") {
            gxdtList.value = JSON.parse(res.data.TrendList);
            gxdtTotalCount.value = res.data.totalCount;
          }
        });
      },
      getBjjgList(){
        //北京教工
        getTrendList(bjjgQuery).then((res)=>{
          if (res.resultCode == "200") {
            bjjglist.value = JSON.parse(res.data.TrendList);
            bjjgTotalCount.value = res.data.totalCount;
          }
        });
      },
      // 获取先进个人/单位
      getAdvanceList(){
        const data = Object.assign(advanceQuery.params, {
          briefType: route.query.title === '先进个人' ? '0507' : '0508'
        })
        // const list = [
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '1221', brief_title: '我是短我是短标题我是短标题标题', brief_title: '我是我是短brief_title我是短brief_title我是短brief_title短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '122a', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '3413', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '1454', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '65534', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '43234', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '245342', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '765', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '674', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '87654', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '3431', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '6543', brief_title: '我是短标题', brief_title: '我是短brief_title' },
        //   { brief_image: 'https://cdn2.thecatapi.com/images/MTc2OTU4Ng.jpg', brief_id: '41431', brief_title: '我是短标题', brief_title: '我是短brief_title' }
        // ]
        // advanceList.value = list
        // advanceTotalCount.value = 13
        getBriefList({
          params: JSON.parse(JSON.stringify(data))
        }).then((res)=>{
          if (res.resultCode == "200") {
            advanceList.value = JSON.parse(res.data.BriefList);
            advanceTotalCount.value = res.data.totalCount;
          }
        });
      },
      dateFormat(date) {
        return moment(date.create_time).format("YYYY-MM-DD");
      },
    };
    const handleCurrentChangeTpxw = (val) => {
      console.log(`当前页: ${val}`);
      tpxwQuery.params.pageIndex = val;
      methods.getTpxwList();
    };
    const handleCurrentChangeTzgg = (val) => {
      console.log(`当前页: ${val}`);
      tzggQuery.params.pageIndex = val;
      methods.getTzggList();
    };
    const handleCurrentChangeZcfg = (val) => {
      console.log(`当前页: ${val}`);
      zcfgQuery.params.pageIndex = val;
      methods.getZcfgList();
    };
    const handleCurrentChangeGxdt=(val)=>{
      gxdtQuery.params.pageIndex=val;
      methods.getGxdtList();
    };
    const handleCurrentChangeBjjg=(val=>{
      bjjgQuery.params.pageIndex=val;
      methods.getBjjgList();
    });
    const handleCurrentChangeAdvance=(val=>{
      advanceQuery.params.pageIndex=val;
      methods.getAdvanceList();
    });
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
      methods.getTpxwList();
      methods.getTzggList();
      methods.getZcfgList();
      methods.getGxdtList();
      methods.getBjjgList();
      if(['advance'].includes(route.query.activeTab)){
        methods.getAdvanceList();
      }
    });
    const advanceTitle = computed(() => {
      return route.query.title || '先进'
    })
    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,

      activeTab,
      breadcrumb,

      moment,
      tpxwList,
      tzggList,
      zcfgList,
      gxdtList,
      bjjglist,
      tpxwTotalCount,
      tzggTotalCount,
      zcfgTotalCount,
      gxdtTotalCount,
      bjjgTotalCount,
      tpxwQuery,
      tzggQuery,
      zcfgQuery,
      gxdtQuery,
      bjjgQuery,

      advanceQuery,
      advanceTitle,
      advanceList,
      advanceTotalCount,

      methods,
      handleCurrentChangeTpxw,
      handleCurrentChangeTzgg,
      handleCurrentChangeZcfg,
      handleCurrentChangeGxdt,
      handleCurrentChangeBjjg,
      handleCurrentChangeAdvance,
      getSession,
    };
  },
};
</script>

<style scoped>
.block {
  width: 1000px;
  margin: 0 auto;
  min-height: calc(100% - 220px);
}

:deep .el-tabs__header{
  display: none;
}
.overflowShow{
  overflow: auto !important;
  height: inherit;
}
</style>