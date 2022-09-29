<template>
	<view class="follow-container">
		<!-- 选项栏标签 -->
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active: currentIndex === 0}" @click="currentIndex = 0">
					文章
				</view>
				<view class="follow-tab-item" :class="{active: currentIndex === 1}" @click="currentIndex = 1">
					作者
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex = $event.detail.current">
				<swiper-item :class="{'no-data':articleDataNone}">
					{{articleDataNone && "暂无收藏文章"}}
					<ListItem :articleList="articleList" :isShowLoadMore="isShowLoadMore" v-if="articleList.length"></ListItem>
					<!-- <view class="no-data" v-if="articleDataNone">
						暂无收藏文章
					</view> -->
				</swiper-item>
				<swiper-item :class="{'no-data':authorDataNone}">
					{{authorDataNone && "暂无关注作者"}}
					<AuthorList :authorList="authorList" v-if="authorList.length"></AuthorList>
					<!-- <view class="no-data" v-if="authorDataNone">
						暂无关注作者
					</view> -->
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 0,
				articleList: [],
				isShowLoadMore: false,
				articleDataNone: "",
				authorDataNone: "",
				authorList: []
			};
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if (!this.$store.state.userInfo) {
				uni.navigateTo({
					url: "/pages/userInfo/login/login"
				})
				return;
			}
			// #endif
			uni.$on("updateArticle", () => {
				this._getFollowArticle("noLoading");
			});
			uni.$on("updateAuthor", () => {
				this._getFollowAuthor("noLoading");
			});
			this._getFollowArticle();
			this._getFollowAuthor();
		},
		methods: {
			async _getFollowArticle(isLoading) {
				const list = await this.$http.get_follow_article({userId: this.userInfo._id, isLoading});
				if(!list.length) {
					this.articleDataNone = true;
				} else {
					this.articleDataNone = '';
				}
				this.articleList = list;
			},
			async _getFollowAuthor(isLoading) {
				const list = await this.$http.get_follow_author({userId: this.userInfo._id, isLoading});
				if(!list.length) {
					this.authorDataNone = true;
				} else {
					this.authorDataNone = "";
				}
				this.authorList = list;
			}
		}
	}
</script>

<style lang="scss">
	@import './css/follow.scss';
</style>
