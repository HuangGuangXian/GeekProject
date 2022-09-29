<template>
	<view class="tab">
		<!-- 滚动区域 -->
		<scroll-view class="tab-scroll" scroll-x="true" scroll-with-animation="true" :scroll-into-view="currentId">
			<view class="tab-scroll-box">
				<view
					@click="changeActiveIndex(index)"
					:class="{active: activeIndex === index}"
					class="tab-scroll-item"
					v-for="(item, index) in labelList"
					:key="index"
					:id="`item${index}`"
					>
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<!-- 图标区域 -->
		<view class="tab-icon">
			<uni-icons @click="goLabelAdmin" type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"TabBar",
		data() {
			return {
				currentId: "item0"
			};
		},
		props: {
			labelList: Array,
			activeIndex: Number
		},
		watch: {
			activeIndex(index) {
				this.currentId = `item${index}`;
			}
		},
		methods: {
			// 跳转到标签管理界面
			async goLabelAdmin() {
				await this.checkedisLogin();
				uni.navigateTo({
					url: "/pages/labelAdmin/labelAdmin"
				})
			},
			changeActiveIndex(index) {
				this.$emit("changeActiveIndex", index);
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './css/TabBar.scss';
</style>