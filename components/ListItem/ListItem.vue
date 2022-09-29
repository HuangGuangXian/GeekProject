<template>
	<view class="list-item-container">
		<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadmore">
			<view>
				<ListCard @saveSearchHistory="$emit('saveSearchHistory')" v-for="item in articleList" :key="item._id" :item="item"></ListCard>
			</view>
			<uni-load-more v-if="isShowLoadMore && (articleList.length === 0 || articleList.length > 7)" :status="loadData.loading || 'loading'"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"ListItem",
		data() {
			return {
			};
		},
		props: {
			articleList: {
				type: Array,
				default() {
					return []
				}
			},
			loadData: {
				type: Object,
				default() {
					return {
						loading: "loading"
					}
				}
			},
			isShowLoadMore: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			loadmore() {	// 监听触底事件，通知articleLIs组件到底状态
				this.$emit("loadmore");
			}
		}
	}
</script>

<style lang="scss">
	.list-item-container {
		height: 100%;
		.list-scroll {
			overflow: hidden;
			height: 100%;
			box-sizing: border-box;
		}
	}
</style>