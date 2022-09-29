<template>
	<view class="article-detail-container">
		<view class="detail-title">
			{{articleData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{articleData.author.author_name}}
				</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}} 浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">
				{{isFollowAuthor ? '取消关注' : '关注'}}
			</button>
		</view>
		<view class="detail-content-container">
			<view class="detail-html">
				<u-parse className="markdown-body" :content="content"></u-parse>
			</view>
			<!-- 评论内容部分 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
					<CommentBox @commentReply="commentReply" :commentData="item"></CommentBox>
				</view>
				<view class="no-data" v-if="!commentList.length">
					暂无评论
				</view>
			</view>
		</view>
		
		<!-- 评论组件 -->
		<view class="detail-bottom">
			<view class="input-container" @click="openMaskerComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box">
					<uni-icons @click="goCommentPage" type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<SaveLikes class="detail-bottom-icon-box" :articleId="articleData._id" size="22"></SaveLikes>
				<!-- view class="detail-bottom-icon-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view> -->
				<view class="detail-bottom-icon-box">
					<uni-icons @click="_updateCompliments" :type="isCompliments ? 'hand-up-filled' :'hand-up'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<CommentMasker @sendCommentData="_sendCommentData" @closePopupMasker="showPopup=$event" :showPopup="showPopup"></CommentMasker>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	import { marked } from 'marked'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				articleData: null,
				showPopup: false, // 是否打开遮罩层
				commentList: [],
				replyData: {}
			}
		},
		onLoad(...options) {
			this.articleData = this.$Router.currentRoute.query;
			// 文章详情的获取
			this._getArticleDetail();
			/* 初始化获取评论列表 */
			this._getCommentList();
		},
		computed: {
			content() {
				try{
					return marked(this.articleData.content)
				}catch(e){
					return null;
				}
			},
			// 是否关注作者
			isFollowAuthor() {
				try{
					return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id);
				}catch(e){
					return false;
				}
			},
			isCompliments() {
				try{
					return this.userInfo && this.userInfo.thumbs_up_article_ids.includes(this.articleData._id);
				}catch(e){
					return false;
				}
			}
		},
		methods: {
			// 获取文章详情内容
			async _getArticleDetail() {
				const data = await this.$http.get_article_detail({
					article_id: this.articleData._id,
				});
				this.articleData = data;
			},
			// 打开评论
			async openMaskerComment() {
				await this.checkedisLogin();
				this.showPopup = true;
			},
			// 提交评论内容，发送评论内容到后端
			async _sendCommentData(content) {
				const {msg} = await this.$http.update_comment({
					userId: this.userInfo._id, 
					articleId: this.articleData._id, 
					content,
					...this.replyData
				});
				uni.showToast({
					title: msg
				});
				this.showPopup = false;
				// 修改评论内容成功之后,进行数据(评论列表的更新)
				this._getCommentList();
				this.replyData = {};
			},
			/* 获取文章评论列表 */
			async _getCommentList() {
				const listArr = await this.$http.get_comments({
					articleId: this.articleData._id
				});
				this.commentList = listArr
			},
			// 处理回复事件函数
			commentReply(data) {
				this.replyData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply,
				};
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id);
				this.openMaskerComment();
			},
			// 改变用户关注作者的状态
			async _followAuthor() {
				await this.checkedisLogin();
				const { msg } = await this.$http.update_follow_author({
					authorId: this.articleData.author.id,
					userId: this.userInfo._id
				});
				// 显示弹窗
				uni.showToast({
					title: msg
				});
				// 改变store里面的用户存储的状态 => 本地存储同样修改
				let followIds = [...this.userInfo.author_likes_ids];
				if(followIds.includes(this.articleData.author.id)) {
					followIds = followIds.filter(item => item != this.articleData.author.id);
				} else {
					followIds.push(this.articleData.author.id);
				}
				this.updateUserInfo({...this.userInfo, author_likes_ids: followIds});
				uni.$emit("updateAuthor");
			},
			//是否对文章进行点赞
			async _updateCompliments() {
				const { msg } = await this.$http.update_compliments({
					articleId: this.articleData._id,
					userId: this.userInfo._id
				})
				// 显示弹窗
				uni.showToast({
					title: msg
				});
				// 修改用户的点赞数组的存储
				let thumbsArr = [...this.userInfo.thumbs_up_article_ids];
				if(thumbsArr.includes(this.articleData._id)) {
					thumbsArr = thumbsArr.filter(item => item != this.articleData._id);
					this.articleData.thumbs_up_count -= 1;
				} else {
					this.articleData.thumbs_up_count += 1;
					thumbsArr.push(this.articleData._id);
				}
				this.updateUserInfo({...this.userInfo, thumbs_up_article_ids: thumbsArr});
			},
			goCommentPage() {
				uni.navigateTo({
					url: `/pages/commentList/commentList?articleId=${this.articleData._id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./css/articleDetail.scss";
</style>
