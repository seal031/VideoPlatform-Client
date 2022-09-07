<template>
  <top-tool-bar></top-tool-bar>
  <div class="block">
    <el-tabs tab-position="left" style="height: 200px">
      <el-tab-pane label="图片新闻">
        <div class="tr mb10">
          <el-pagination
            @current-change="handleCurrentChangeTpxw"
            v-model:currentPage="tpxwQuery.params.pageIndex"
            v-model:page-size="tpxwQuery.params.pageSize"
            layout="total, prev, pager, next"
            :total="tpxwTotalCount"
          >
          </el-pagination>
        </div>
        <el-table
          :data="tpxwList"
          style="width: 100%"
          :show-header="false"
          class="customer-table"
          @row-click="showBrief"
        >
          <el-table-column prop="brief_title" label="" width="500">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="100"
            :formatter="methods.dateFormat"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="通知公告">
        <el-table
          :data="tzggList"
          style="width: 100%"
          :show-header="false"
          class="customer-table"
          @row-click="showBrief"
        >
          <el-table-column prop="brief_title" label="" width="500">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="100"
            :formatter="methods.dateFormat"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="政策法规">
        <el-table
          :data="zcfgList"
          style="width: 100%"
          :show-header="false"
          class="customer-table"
          @row-click="showBrief"
        >
          <el-table-column prop="brief_title" label="" width="500">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label=""
            width="100"
            :formatter="methods.dateFormat"
          >
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
import { getBriefList, getBriefBaseList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";

export default {
  methods: {
    showBrief(row) {
      const href = this.$router.replace({
        path: "/BriefShow",
        query: { briefId: row.brief_id },
      });
      window.open(href, "_blank");
    },
  },
  components: {
    TopToolBar,
    PortalFooter,
  },
  setup() {
    let userId = "";
    let userRole = "";
    let userName = "";
    let realName = ref("");
    let userSchool = "";

    let tpxwList = ref([]); //图片新闻模型列表
    let tzggList = ref([]); //通知公告模型列表
    let zcfgList = ref([]); //政策法规模型列表
    let tpxwTotalCount = ref(0); // 图片新闻总数
    let tzggTotalCount = ref(0); // 通知公告总数
    let zcfgTotalCount = ref(0); // 政策法规总数
    let tpxwQuery = reactive({
      params: {
        briefType: "0503", //图片新闻
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 4,
      },
    });
    let tzggQuery = reactive({
      params: {
        briefType: "0501", //通知公告
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 6,
      },
    });
    let zcfgQuery = reactive({
      params: {
        briefType: "0502", //政策法规
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 6,
      },
    });

    const methods = {
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
      dateFormat(date) {
        return moment(date).format("YYYY-MM-DD");
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
    const getSession = () => {
      userId = localStorage.getItem("user_id");
      userRole = localStorage.getItem("user_role");
      userName = localStorage.getItem("user_name");
      realName.value = localStorage.getItem("real_name");
      userSchool = localStorage.getItem("user_school");
    };

    onMounted(() => {
      getSession();
      methods.getTpxwList();
      methods.getTzggList();
      methods.getZcfgList();
    });

    return {
      userId,
      userRole,
      userName,
      realName,
      userSchool,
      
      moment,
      tpxwList,
      tzggList,
      zcfgList,
      tpxwTotalCount,
      tzggTotalCount,
      zcfgTotalCount,
      tpxwQuery,
      tzggQuery,
      zcfgQuery,
      methods,
      handleCurrentChangeTpxw,
      handleCurrentChangeTzgg,
      handleCurrentChangeZcfg,
      getSession,
    };
  },
};
</script>