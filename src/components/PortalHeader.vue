<template>
  <div class="carousel-wrap">
    <el-carousel trigger="click" height="300px">
      <el-carousel-item v-for="item in imgList" :key="item">
        <img :src="item.src" style="height:100%;width:100%;" alt="图片丢失了" :title="item.title" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  setup() {
    const getImageUrl = (name) => {
      return new URL(`../assets/top/${name}`, import.meta.url).href;
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
    return {
      getImageUrl,
      imgList,
    };
  },
};
</script>
<style scoped>
.carousel-wrap{
  margin-top: -72px;
}
</style>