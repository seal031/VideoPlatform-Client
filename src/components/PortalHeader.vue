<template>
  <div class="carousel-wrap">
    <el-carousel trigger="click" height="300px">
      <el-carousel-item v-for="item in briefList" :key="item">
        <img :src="item.brief_image" style="height:100%;width:100%;" alt="图片丢失了" :title="item.title" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { getBriefList, getBriefBaseList } from "../api/serviceApi";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
export default {
  setup() {
    let briefList = ref([]); //主页滚动模型列表
    let briefQuery = reactive({
      params: {
        briefType: "0504", //主页滚动
        briefState: "0401", //已发布
        pageIndex: 1,
        pageSize: 20,
        topN: 5,
      },
    });
    const getImageUrl = (name) => {
      return new URL(`http://47.93.84.178:8080/assets/top/${name}`, import.meta.url).href;
    };
    const imgList = [
      {
        name: "lj",
        src: getImageUrl("1.jpg"),
        title: "",
      },
      {
        name: "logo",
        src: getImageUrl("2.jpg"),
        title: "",
      },
      {
        name: "bg",
        src: getImageUrl("3.jpg"),
        title: "",
      },
      {
        name: "sadmas",
        src: getImageUrl("4.jpg"),
        title: "",
      },
    ];
    const getBrief=()=>{
      getBriefList(briefQuery).then((res) => {
        if (res.resultCode == "200") {
          briefList.value = JSON.parse(res.data.BriefList);
          // tpxwTotalCount.value = res.data.totalCount;
        }
      });
    };
    onMounted(()=>{
      getBrief();
    });
    return {
      getImageUrl,
      imgList,
      briefQuery,
      getBrief,
      briefList,
    };
  },
};
</script>
<style scoped>
.carousel-wrap{
  margin-top: -72px;
}
</style>