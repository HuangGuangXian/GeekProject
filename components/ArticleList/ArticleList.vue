<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeActiveIndex">
		<swiper-item v-for="(item, index) in labelList" :key="item._id">
			<view class="swiper-item">
				<ListItem :loadData="loadData[index]" :articleList="articleData[index]" @loadmore="watchLoadMore"></ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name:"ArticleList",
		data() {
			return {
				articleData: {},
				loadData: {},
				pageSize: 6
			};
		},
		props: {
			labelList: Array,
			activeIndex: Number
		},
		created() {
			this.labelList.length && this._getArticleList(this.activeIndex);
		},
		watch: {
			labelList(newVal, oldVal) {
				if(JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
				this.articleData = {};
				this.loadData = {};
				this._getArticleList(this.activeIndex);
			}
		},
		methods: {
			//监听屏幕到底事件
			watchLoadMore() {
				// 当现在没有数据的时候，不再进行数据的请求
				// 从新进行数据请求
				if (this.loadData[this.activeIndex].total === this.articleData[this.activeIndex].length) {
					this.loadData[this.activeIndex] = {
						...this.loadData[this.activeIndex],
						...{loading: "noMore"}
					};
					this.$forceUpdate();
					return;
				}
				this.loadData[this.activeIndex].page ++;
				this._getArticleList(this.activeIndex);
			},
			changeActiveIndex(e) {
				const index = e.detail.current;
				this.$emit("changeActiveIndex", index);
				if(!this.articleData[index] || this.articleData[index].length === 0) {
					this._getArticleList(index);
				}
			},
			//获取文章列表
			async _getArticleList(currentIndex) {
				/* 初始化请求判断当前分类是否含有数据，并记录当前的分类页数 */
				if (!this.loadData[currentIndex]) {
					this.loadData[currentIndex] = {
						page: 1,
						loading: "loading",
						total: 0
					}
				}
				const { articleList, total } = await this.$http.get_article_list({
					classify: this.labelList[currentIndex].name,
					page: this.loadData[currentIndex].page,
					pageSize: this.pageSize
					});
					
				// 填充数据时改变为追加数据
				let oldList = this.articleData[currentIndex] || [];
				oldList.push(...articleList);
				// 在vue中对于复杂对象，例如数组、对象。如果想进行重新扩展（二次赋值或者新增）的话，这时不会二次对对象里面的值进行动态监听，这就是为什么vue3中要把vue2里面 defineproperty 换成 proxy
				//可以两种方法解决
				// $set 和 $forceUpdate
				this.loadData[currentIndex].total = total;
				this.$set(this.articleData, currentIndex, oldList);
			}
		}
	}
</script>

<style lang="scss">
	.swiper-container {
		height: 100%;
		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>