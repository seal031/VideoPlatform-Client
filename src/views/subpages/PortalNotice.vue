<template>
	<div class="portal-advance-notice">
		<div class="notice-detail" v-for="(item,index) in advancedList.data" :key="index" @click="showBrief(item)">
			<graphic-overview :data="item"></graphic-overview>
		</div>
	</div>
</template>
<script>
import { ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
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
    const router = useRouter();
    let advancedList = reactive({
      data: []
    })
    watch(() => props.data, (val) => {
      advancedList.data = val
    })
    const showBrief = (row) => {
      const href = router.resolve({
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
.notice-detail:not(:nth-child(4n)) {
    margin-right: 10px;
  }
.notice-detail{
    flex: 1;
    height: 205px;
    width: calc((100% - 40px) / 4);
    min-width: calc((100% - 40px) / 4);
    max-width: calc((100% - 40px) / 4);
    cursor: pointer;
    margin-bottom: 20px;
}
</style>