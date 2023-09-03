<template>
	<div class="portal-advance-notice">
		<div class="notice-detail" v-for="(item,index) in advancedList.data" :key="index" @click="showBrief(item)">
			<graphic-overview :data="item"></graphic-overview>
		</div>
	</div>
</template>
<script>
import { ref, reactive, watch } from 'vue';
import GraphicOverview from '../../components/GraphicOverview.vue';
export default {
  name: "portal-advanced",
  props: {
		data: {
			type: Array,
			default: () => []
		},
  },
  components: { GraphicOverview } ,
  setup(props) {
    let advancedList = reactive({
      data: []
    })
    watch(() => props.data, (val) => {
      advancedList.data = val
    })
    const showBrief = (row) => {
      const href = this.$router.resolve({
        path: "/BriefShow",
        query: { briefId: row.brief_id || ''},
      });
      window.open(href.href, "_blank");
    }
		return{
			advancedList,
      showBrief
		}
  },
};
</script>
<style scoped>
@import url('../../assets/css/portal.css');
.portal-advance-overview{
    width: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    height: -moz-fit-content;
    height: fit-content;
}
.notice-detail:not(:nth-child(5n)) {
    margin-right: 20px;
  }
.notice-detail{
    flex: 1;
    height: 190px;
    width: calc((100% - 80px) / 5);
    min-width: calc((100% - 80px) / 5);
    max-width: calc((100% - 80px) / 5);
    cursor: pointer;
    margin-bottom: 20px;
}
</style>