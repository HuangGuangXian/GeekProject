<template>
	<view>
		<!-- 基础卡片 -->
		<view class="list-card" v-if="item.mode === 'base'" @click="goArticleList">
			<view class="list-card-img">
				<image :src="item.cover[0] ? item.cover[0] : '/static/img/logo.jpeg'" mode="aspectFill"></image>
			</view>
			<view class="list-card-content">
				<view class="list-card-content-title">
					<text>{{item.title}}</text>
					<SaveLikes :articleId="item._id"></SaveLikes>
				</view>
				<view class="list-card-content-desc">
					<view class="article-type">
						{{item.classify}}
					</view>
					<view class="browse-number">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 多图模式 -->
		<view class="list-card mode-column" v-if="item.mode === 'column'" @click="goArticleList">
			<view class="list-card-top">
				<text>{{item.title}}</text>
				<SaveLikes :articleId="item._id"></SaveLikes>
			</view>
			<view class="list-card-middle">
				<view class="image-container" v-for="(img,index) in item.cover.slice(0,3)" :key="index">
					<image :src="img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="article-type">
					{{item.classify}}
				</view>
				<view class="browse-number">
					{{item.browse_count}}浏览
				</view>
			</view>
		</view>
		<!-- 大图模式 -->
		<view class="list-card mode-image" v-if="item.mode === 'image'" @click="goArticleList">
			<view class="list-card-top">
				<view class="image-container">
					<image :src="item.cover[0]" mode="aspectFill"></image>
				</view>
			</view>
			<view class="list-card-middle">
				<text>{{item.title}}</text>
				<SaveLikes :articleId="item._id"></SaveLikes>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="article-type">
					{{item.classify}}
				</view>
				<view class="browse-number">
					{{item.browse_count}}浏览
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"ListCard",
		data() {
			return {
				
			};
		},
		props: {
			item: Object
		},
		methods: {
			goArticleList() {
				const {_id, create_time, thumbs_up_count, title, author, browse_count} = this.item;
				const params = {_id, create_time, thumbs_up_count, title, author, browse_count};
				// uni.navigateTo({
				// 	url: `/pages/articleDetail/articleDetail?params=${JSON.stringify(params)}`
				// });
				this.$Router.push({
					path: "/pages/articleDetail/articleDetail",
					query: params
				})
				// 发送收藏自定义事件
				this.$emit("saveSearchHistory");
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./css/ListCard.scss";
</style>