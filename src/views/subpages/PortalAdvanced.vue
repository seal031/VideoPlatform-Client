<template>
	<div class="portal-advance pb20">
		<div class="portal-notice-content">
			<el-row :gutter="20">
				<el-col :span="12" v-for="(item,index) in advancedList.data" :key="index">
					<div v-if="item.list.length > 0">
						<div class="mt20 mb20 rel">
							<span class="f20 poi" @click="jump(item.title)">{{item.title}}</span>
							<sup class="f20">
								<el-image
								 	v-if="item.title === '先进个人'"
									:src="getImageUrl('person.jpg')"
									fit="fill"
									class="icon-picture ml5"
								>
								</el-image>
								<el-icon class="title-icon ml5" v-if="item.title === '先进单位'">
									<svg-icon iconClass="business" style="color: #de460c"></svg-icon>
								</el-icon>
							</sup>
						</div>
						<div class="portal-advance-overview">
							<div v-for="(itm, idx) in item.list" :key="idx" class="overview-detail" @click="showBrief(itm)">
								<graphic-overview :data="itm"></graphic-overview>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
import { watch, reactive } from 'vue';
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
  components: { GraphicOverview} ,
  setup(props) {
    const router = useRouter();
    const tabList = reactive([
			{title: '先进个人'},{title: '先进单位'}
		])
	let advancedList = reactive({
      data: []
    })
	const getImageUrl = (name) => {
      return new URL(`/src/assets/img/${name}`, import.meta.url).href;
    }
	watch(() => props.data, (val) => {
      advancedList.data = tabList.map((item, index) => {
			return {
				title: item.title,
				list: props.data[index].list
			}
		})
    })
    const jump = (title) => {
      const href = router.resolve({
        path: '/portalBriefList',
        query: {
          activeTab: 'advance',
          title
        },
      });
      window.open(href.href, "_blank");
    };
	  const showBrief = (row) => {
      const href = router.resolve({
        path: "/BriefShow",
        query: { briefId: row.brief_id || ''},
      });
      window.open(href.href, "_blank");
    }
		return{
			advancedList,
			jump,
			showBrief,
			getImageUrl
		}
  },
};
</script>
<style scoped>
@import url('../../assets/css/portal.css');
.icon-picture{
	height: 20px;
}
</style>