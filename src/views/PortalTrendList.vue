<template>
  <top-tool-bar></top-tool-bar>
  <div class="block">
    <el-breadcrumb separator=">" class="mt20 mb20">
      <el-breadcrumb-item :to="{ path: '/portal' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumb}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider class="portal-divider"></el-divider>

    <el-tabs tab-position="left" style="height: 100%" v-model="activeTab">
      <el-tab-pane label="图片新闻" name="tpxw">
      <div class="tr mt10">
        <el-pagination @current-change="handleCurrentChangeTpxw" v-model:currentPage="tpxwQuery.params.pageIndex"
          v-model:page-size="tpxwQuery.params.pageSize" layout="total, prev, pager, next" :total="tpxwTotalCount">
        </el-pagination>
      </div>
        <el-table :data="tpxwList" style="width: 100%" :show-header="false" class="customer-table poi"
        @row-click="showTrend">
        <el-table-column prop="trend_title" label="">
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
        @row-click="showTrend">
        <el-table-column prop="trend_title" label="">
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
        @row-click="showTrend">
        <el-table-column prop="trend_title" label="">
        </el-table-column>
        <el-table-column prop="create_time" label="" width="150" :formatter="methods.dateFormat">
        </el-table-column>
      </el-table>
      </el-tab-pane>
    </el-tabs>
    <portal-footer></portal-footer>
  </div>
</template>

<script>
import moment from "moment";
import TopToolBar from "../components/TopToolBar.vue";
import PortalFooter from "../components/PortalFooter.vue";
import { getTrendList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  methods: {
    showTrend(row) {
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
  },
  setup() {
    let route = useRoute(); //可以在setup中使用route获取参数
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";
    let activeTab = ref("");

    // let tpxwList = ref([]); //图片新闻模型列表
    // let tzggList = ref([]); //通知公告模型列表
    // let zcfgList = ref([]); //政策法规模型列表
    let trendList = ref([]);//基层动态模型列表
    // let tpxwTotalCount = ref(0); // 图片新闻总数
    // let tzggTotalCount = ref(0); // 通知公告总数
    // let zcfgTotalCount = ref(0); // 政策法规总数
    let trendTotalCount=ref(0);//基层动态总数
    // let tpxwQuery = reactive({
    //   params: {
    //     trendType: "0503", //图片新闻
    //     trendState: "0401", //已发布
    //     pageIndex: 1,
    //     pageSize: 20,
    //     topN: 20,
    //   },
    // });
    // let tzggQuery = reactive({
    //   params: {
    //     trendType: "0501", //通知公告
    //     trendState: "0401", //已发布
    //     pageIndex: 1,
    //     pageSize: 20,
    //     topN: 20,
    //   },
    // });
    // let zcfgQuery = reactive({
    //   params: {
    //     trendType: "0502", //政策法规
    //     trendState: "0401", //已发布
    //     pageIndex: 1,
    //     pageSize: 20,
    //     topN: 20,
    //   },
    // });
    let trendQuery = reactive({
      params: {
        trendType: "0502", //政策法规
        trendState: "0401", //已发布
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
          case "trend":
            breadcrumb.value = "基层动态";
            break;
        }
      },
      // getTpxwList() {
      //   getTrendList(tpxwQuery).then((res) => {
      //     if (res.resultCode == "200") {
      //       tpxwList.value = JSON.parse(res.data.TrendList);
      //       tpxwTotalCount.value = res.data.totalCount;
      //     }
      //   });
      // },
      // getTzggList() {
      //   //通知公告
      //   getTrendList(tzggQuery).then((res) => {
      //     if (res.resultCode == "200") {
      //       debugger
      //       tzggList.value = JSON.parse(res.data.TrendList);
      //       tzggTotalCount.value = res.data.totalCount;
      //     }
      //   });
      // },
      // getZcfgList() {
      //   //政策法规
      //   getTrendList(zcfgQuery).then((res) => {
      //     if (res.resultCode == "200") {
      //       zcfgList.value = JSON.parse(res.data.TrendList);
      //       zcfgTotalCount.value = res.data.totalCount;
      //     }
      //   });
      // },
      getTrendList(){
        //基层动态
        getTrendList(trendQuery).then((res) => {
          if (res.resultCode == "200") {
            trendList.value = JSON.parse(res.data.TrendList);
            trendList.value = res.data.totalCount;
          }
        });
      },
      dateFormat(date) {
        return moment(date.create_time).format("YYYY-MM-DD");
      },
    };
    // const handleCurrentChangeTpxw = (val) => {
    //   console.log(`当前页: ${val}`);
    //   tpxwQuery.params.pageIndex = val;
    //   methods.getTpxwList();
    // };
    // const handleCurrentChangeTzgg = (val) => {
    //   console.log(`当前页: ${val}`);
    //   tzggQuery.params.pageIndex = val;
    //   methods.getTzggList();
    // };
    // const handleCurrentChangeZcfg = (val) => {
    //   console.log(`当前页: ${val}`);
    //   zcfgQuery.params.pageIndex = val;
    //   methods.getZcfgList();
    // };
    const handleCurrentChangeTrend=(val)=>{
      trendQuery.params.pageIndex = val;
      methods.getTrendList();
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
      // methods.getTpxwList();
      // methods.getTzggList();
      // methods.getZcfgList();
      methods.getTrendList();
    });

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
      trendList,
      tpxwTotalCount,
      tzggTotalCount,
      zcfgTotalCount,
      trendTotalCount,
      tpxwQuery,
      tzggQuery,
      zcfgQuery,
      trendQuery,
      methods,
      handleCurrentChangeTpxw,
      handleCurrentChangeTzgg,
      handleCurrentChangeZcfg,
      handleCurrentChangeTrend,
      getSession,
    };
  },
};
</script>

<style scoped>
.block {
  width: 1000px;
  margin: 0 auto;
  height: calc(100% - 72px);
}

:deep .el-tabs__header{
  display: none;
}
</style>