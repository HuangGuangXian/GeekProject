<template>
	<view class="label-container">
		<!-- 我的标签 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					我的标签
				</view>
				<view class="label-edit" @click="changeEditStatus">
					{{isEdit ? '完成' : '编辑'}}
				</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item, index) in selfLabelList" :key="item.id">
					{{item.name}}
					<uni-icons @click="deleteLabelItem(item)" v-if="isEdit" type="clear" class="icon-close" size="20" color="red"></uni-icons>
				</view>
				<view v-if="!selfLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		
		<!-- 标签推荐的结构 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					标签推荐
				</view>
			</view>
			<view class="label-content">
				<view @click="changeselfLabelList(item)" class="label-content-item" v-for="(item, index) in recommendLabelList" :key="item._id">
					{{item.name}}
				</view>
				<view v-if="!recommendLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				isEdit: false,
				labelIds: []
			};
		},
		watch: {
			userInfo: {
				immediate: true,
				handler(newVal, oldVal) {
					this.labelIds = [...(this.userInfo.label_ids)];
				}
			}
		},
		methods: {
			changeEditStatus() {
				this.isEdit && this._updateVal();
				this.isEdit = !this.isEdit;
			},
			async _updateVal() {
				const label_ids = this.selfLabelList.map(item => item._id);
				const { msg } = await this.$http.update_label_ids({userId: this.userInfo._id, label_ids});
				uni.showToast({
					title: msg
				});
				this.updateUserInfo({...this.userInfo, label_ids});
			},
			// 修改标签发送到后端
			changeselfLabelList(item) {
				if (!this.isEdit) return;
				this.labelIds.push(item._id);
			},
			// 删除收藏信息
			deleteLabelItem(item) {
				if (!this.isEdit) return;
				this.labelIds = this.labelIds.filter(id => id !== item._id);
			}
		},
		computed: {
			...mapState(["labelList"]),
			selfLabelList() {
				return this.labelList.filter(item => this.labelIds.includes(item._id))
			},
			recommendLabelList() {
				return this.labelList.filter(item => !this.labelIds.includes(item._id) && item._id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./css/labelAdmin.scss";
</style>
