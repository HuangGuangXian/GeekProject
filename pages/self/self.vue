<template>
	<view>
		<view class="my-header" v-if="userInfo">
			<view class="me-header-background">
				<image :src="userInfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="my-header-logo">
				<view class="my-header-logo-box" @click="changeAvatar">
					<image :src="userInfo.avatar" mode="aspectFill"></image>
				</view>
				<text class="user-name">{{userInfo.author_name}}</text>
			</view>
			<view class="my-header-info">
				<view class="my-header-info-box">
					<text class="my-header-info-title">被关注</text>
					<text>{{userInfo.follow_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-info-title">粉丝数</text>
					<text>{{userInfo.fans_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-info-title">积分</text>
					<text>{{userInfo.integral_count || 0}}</text>
				</view>
			</view>
		</view>
		
		<!-- 内容部分 -->
		<view class="my-content">
			<view class="my-content-list" v-if="!userInfo" @click="goLoginPage">
				<view class="my-content-list-title">
					<image class="company-logo" src="../../static/img/logo.jpeg" mode="aspectFill"></image>
					<text>HI,您尚未登录，请点击登录</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content-list" @click="goMyArticlePage">
				<view class="my-content-list-title">
					<uni-icons class="icons" type="contact" size="16" color="#666"></uni-icons>
					<text>我的文章</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content-list" @click="goFeedbackPage">
				<view class="my-content-list-title">
					<uni-icons class="icons" type="help" size="16" color="#666"></uni-icons>
					<text>意见反馈</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			
			<!-- #ifdef APP-PLUS -->
			<view class="my-content-list" @click="haveNewVersion && _getNewVersion">
				<view class="my-content-list-title">
					<uni-icons class="icons" type="paperclip" size="16" color="#666"></uni-icons>
					<view class="version-container">
						<text>
							当前版本
							<text v-if="haveNewVersion" class="new-version-tip">（点击下载最新版本）</text>
						</text>
						<text class="version">{{currentVersion}}</text>
					</view>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<!-- #endif -->
			
			<button @click="siginOut" type="warn" v-if="userInfo" class="sigin-out">退出</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haveNewVersion: true,
				currentVersion: "1.0.0",
				downLoadLinkUrl: ""
			};
		},
		onLoad() {
			// !判断是否有新版本进行下载及获取当前的版本
			// #ifdef APP-PLUS
			uni.getSystemInfo({
			  success: (res) => {
				if (res.platform == "android") {
				  plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
					this.currentVersion = wgtinfo.version;
					this._checkVersion();
				  })
				}
			  }
			})
			// #endif
		},
		methods: {
			// 用户退出
			siginOut() {
				this.$store.commit("updateUserInfo", null);
				uni.navigateTo({
					url: "/pages/index/index"
				})
			},
			//跳转登录页面
			goLoginPage() {
				uni.navigateTo({
					url: "/pages/userInfo/login/login"
				})
			},
			// 检查版本是否是最新
			async _checkVersion() {
				const {version,downLoadLinkUrl} = await this.$http.get_current_version();
				if(version > this.currentVersion) {
					this.haveNewVersion = true;
					this.downLoadLinkUrl = downLoadLinkUrl
				}
			},
			// 获取最新版本app下载
			_getNewVersion() {
				uni.showLoading({title:'下载中，请稍后'});
				var dtask = plus.downloader.createDownload(this.downLoadLinkUrl, {}, function (d, status) {
					// 下载完成  
					uni.hideLoading({});
					if (status == 200) {
						plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function (error) {
							uni.showToast({
								title: '安装失败',
								duration: 1500,
								icon: 'none'
							});
						});
					} else {
						uni.showToast({
							title: '更新失败',
							duration: 1500,
							icon: 'none'
						});
					}
				});
				dtask.start();
			},
			// 跳转我的文章页面
			goMyArticlePage() {
				uni.navigateTo({
					url: "/pages/myArticle/myArticle"
				})
			},
			// 跳转反馈页面
			goFeedbackPage() {
				uni.navigateTo({
					url: "/pages/feedback/feedback"
				})
			},
			// 替换头像
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					success: async res => {
						const filePath = await this._uploadFile(res.tempFilePaths[0], res.tempFiles[0].name ||
							Date.now().toString() + res.tempFilePaths[0].substr(res.tempFilePaths[0].lastIndexOf('.')));
						await this._updateUserAvatar(filePath);
					}
				})
			},
			// 上传图片
			async _uploadFile(filePath, cloudPath) {
				const { fileID } = await uniCloud.uploadFile({
					filePath,
					cloudPath
				});
				return fileID;
			},
			// 更改用户及发布文章的头像
			async _updateUserAvatar(filePath) {
				const { msg } = await this.$http.update_user_avatar({
					userId: this.userInfo._id,
					filePath
				});
				uni.showToast({
					title: msg,
					icon: "none"
				});
				// 修改本地的vuex里面的用户数据
				this.updateUserInfo({...this.userInfo, avatar: filePath});
			}
		}
	}
</script>

<style lang="scss">
	@import "./css/index.scss";
</style>
