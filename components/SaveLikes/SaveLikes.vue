<template>
	<view class="save-incons" @click.stop="_changeSaveStatus">
		<uni-icons :type="isSave ? 'heart-filled' : 'heart'" color="#f60" :size="size"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "SaveLikes",
		props: {
			articleId: String,
			size: {
				type: String,
				default: "20"
			}
		},
		data() {
			return {

			};
		},
		computed: {
			isSave() {
				try {
					return this.userInfo && this.userInfo.article_likes_ids.includes(this.articleId);
				} catch (e) {
					return false;
				}
			}
		},
		methods: {
			async _changeSaveStatus() {
				// TODOS 判断用户是否登录
				await this.checkedisLogin();
				// 登录 改变当前的收藏状态
				// 没有登录 => 界面的跳转 => 用户登录的界面
				const {
					msg,
					newUserInfo
				} = await this.$http.update_save_like({
					articleId: this.articleId,
					userId: this.userInfo._id
				});
				uni.showToast({
					title: msg,
					icon: "none"
				});
				this.updateUserInfo({
					...this.userInfo,
					...newUserInfo
				});
				// 触发followarticle界面从新进行列表数据获取
				uni.$emit("updateArticle");
			}
		}
	}
</script>

<style>

</style>
