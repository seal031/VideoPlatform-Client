<template>
  <el-image
    :src="currentData.src"
    fit="fill"
    :itemid="currentData.videoId"
    class="picture"
    :title="currentData.tip"
  >
    <template #placeholder>
      <div class="image-slot">Loading<span class="dot">...</span></div>
    </template>
  </el-image>
  <div class="picture-info">{{ currentData.eventTitle }}</div>
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
</style>