<template>
	<view class="home-container">
		<!-- 导航栏 -->
		<NavBar></NavBar>
		<!-- 选项卡 -->
		<TabBar :activeIndex="activeIndex" :labelList="labelList" @changeActiveIndex="changeActiveIndex"></TabBar>
		<!-- 文章列表 -->
		<ArticleList :activeIndex="activeIndex" :labelList="labelList" class="list-container" @changeActiveIndex="changeActiveIndex"></ArticleList>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex";
	export default {
		data() {
			return {
				activeIndex: 0,
			}
		},
		onLoad() {
			this._initLableList();
		},
		methods: {
			async _initLableList() {
				if (this.labelList.length) return;
				const labelList = await this.$http.get_label_list();
				this.setLabelList([{name: "全部"}, ...labelList]);
				// uniCloud.callFunction({
				// 	name: 'get_label_list',
				// 	success: (res) => {
				// 		this.labelList = res.result.labelList.map(item=>item.name)
				// 	}
				// })
			},
			//修改当前activeIndex值
			changeActiveIndex(index) {
				this.activeIndex = index;
			},
			...mapMutations(["setLabelList"])
		},
		computed: {
			labelList() {
				if (this.userInfo) {
					this.activeIndex = 0;
					return [...this.$store.state.labelList.slice(0,1), ...this.$store.state.labelList.filter(item => this.userInfo.label_ids.includes(item._id))];
				} else {
					return this.$store.state.labelList;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		height: 100%;
	}
	.home-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}
	.list-container {
		flex: 1;
		box-sizing: border-box;
	}
</style>
