<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<!-- 处理app以及小程序的导航栏 -->
			<view :style="{height: statusHeight + 'rpx'}"></view>
			<view @click="returnArticleList" class="return-icon" :style="{top: statusHeight + 'rpx'}" v-if="isSearch">
				<uni-icons type="back" color="#fff" size="22"></uni-icons>
			</view>
			<view @click="goSearchPage" class="nav-bar-content" :style="{marginRight: marginRight + 'rpx', marginLeft: isSearch ? '20rpx' : ''}">
				<uni-icons type="search" color="#999"></uni-icons>
				<view v-if="!isSearch" class="nav-bar-search-txt">
					输入文章标题进行搜索
				</view>
				<input v-else type="text" v-model.trim="searchVal" class="search-input" placeholder="输入文章标题进行搜索" @confirm="changeInput" confirm-type="search">
			</view>
		</view>
		<!-- 底部垫片 -->
		<view :style="{height: statusHeight + 80 + 'rpx'}"></view>
	</view>
</template>

<script>
	export default {
		name:"NavBar",	//方便我们的devtools进行查找
		data() {
			return {
				statusHeight: 20,
				marginRight: 0
			};
		},
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			parentVal: String
		},
		created() {
			this.getSystemInfo()
		},
		computed: {
			searchVal: {
				get() {
					return this.parentVal;
				},
				set(val) {
					this.$emit("updateVal", val);
					if(!val) {
						this.$emit("sendSearchData");
					}
				}
			}
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				/* 如果是小程序的换，进行胶囊处理*/
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.statusHeight = menuButtonInfo.top * 2;
				this.marginRight = menuButtonInfo.width * 2;
				// #endif
			},
			// 跳转搜索界面
			goSearchPage() {
				if (this.isSearch) return
				uni.navigateTo({
					url: "/pages/search/search"
				})
			},
			// 返回文章列表界面
			returnArticleList() {
				// #ifdef H5
				uni.switchTab({
					url: "/pages/index/index"
				})
				// #endif
				// #ifndef H5
				uni.navigateBack()
				// #endif
			},
			// 通知父组件进行搜索内容的查询
			changeInput() {
				this.$emit('sendSearchData');
			}
		}
	}
</script>

<style scoped lang="scss">
@import "./css/NavBar.scss";
</style>