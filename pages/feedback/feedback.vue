<template>
	<view>
		<view class="feedback-title">
			意见反馈
		</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入你要反馈的问题"></textarea>
		</view>
		
		<view class="feedback-title">
			反馈图片:
		</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item, index) in imageList" :key="index">
				<view class="close-icon">
					<uni-icons type="closeempty" size="18" color="#fff" @click="delImage(index)"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 添加图片的icon -->
			<view class="feedback-image-item" v-if="imageList.length < 5" @click="_addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button type="warn" class="feedback-button" @click="_submitFeedback">提交反馈意见</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				imageList: []
			};
		},
		methods: {
			// 添加图片
			async _addImage() {
				const count = 5 - this.imageList.length;
				uni.chooseImage({
					count,
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						tempFilePaths.forEach((url, index) => {
							if (index < count) {
								this.imageList.push({
									url,
									//#ifdef H5
									name: res.tempFiles[index].name,
									//#endif
									//#ifndef H5
									name: Date.now().toString() + url.substr(url.lastIndexOf(".")),	//时间戳 + 扩展名
									//#endif
								})
							}
						})
					}
				})
			},
			// 发送意见反馈
			async _submitFeedback(){
				if(!this.content) {
					uni.showToast({
						title: "意见反馈不能为空",
						icon: "none"
					});
					return;
				}
				// 上传图片
				uni.showLoading();
				const feedbackImageList = await Promise.all(this.getFiledId());
				uni.hideLoading();
				const { msg } = await this.$http.update_feedback({
					content: this.content,
					userId: this.userInfo._id,
					feedbackImageList
				});
				uni.showToast({
					title: msg,
				});
				setTimeout(() => {
					uni.switchTab({
						url: "/pages/self/self"
					});
				}, 1500);
			},
			// 删除图片
			delImage(index) {
				this.imageList.splice(index, 1);
			},
			// 获取上传的图片地址
			getFiledId() {
				return this.imageList.map(item => {
					return new Promise(async (resolve, reject) => {
						const result = await uniCloud.uploadFile({
							filePath: item.url,
							cloudPath: item.name
						});
						resolve(result.fileID);
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./css/feedback.scss";
</style>
