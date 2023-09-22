<template>
  <el-image
    :src="currentData.brief_image"
    fit="fill"
    :itemid="currentData.brief_id"
    class="picture"
    :title="currentData.brief_title"
  >
    <template #placeholder>
      <div class="image-slot">Loading<span class="dot">...</span></div>
    </template>
    <template #error>
      <div class="img-error" v-if="currentData.brief_id">图片加载失败</div>
      <div class="img-error" v-else>暂无数据</div>
    </template>
  </el-image>
  <div class="picture-info" v-if="currentData.brief_id">{{ currentData.brief_title }}</div>
</template>

<script>
export default {
  name: "graphic-overview",
  props: {
    data: {
        type: Object,
        default: () => {}
    }
  },
  components: {},
  setup(props) {
    return {
      currentData: props.data
    };
  },
};
</script>

<style scoped>
.picture{
  height: 100%;
  display: flex;
}
.picture-info {
  background-color: rgba(44, 38, 41, 0.4);
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
  padding: 0 6px;
  position: relative;
  z-index: 1;
  color: #fff;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.img-error{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  /* background: var(--el-bg-color); */
  color: var(--el-text-color-placeholder);
  vertical-align: middle;
  height: 100%;
  width: 100%;
}
</style>