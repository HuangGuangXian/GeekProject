export default {
	updateUserInfo(state, userInfo) {
		uni.setStorageSync("userInfo", userInfo);	// 本地存储用户信息
		state.userInfo = userInfo;	// 修改store数据
	},
	// 修改历史记录存储
	setHistory(state, val) {
		let list = state.historyList;
		if (list.length > 0 && list.findIndex(item => item === val) > 1 ) return;
		list.unshift(val);
		uni.setStorageSync("historyList", list);
		state.historyList = list;
	},
	// 清空搜索历史信息
	clearHistory(state) {
		uni.removeStorageSync("historyList");
		state.historyList = [];
	},
	// 设置导航栏选项卡
	setLabelList(state, labelList) {
		uni.setStorageSync("labelList", labelList);
		state.labelList = labelList;
	}
}