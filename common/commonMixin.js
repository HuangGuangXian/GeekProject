import {
	mapState,
	mapMutations
} from "vuex";
export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {

				}
			},
			methods: {
				checkedisLogin() {
					// 获取用户信息
					return new Promise(resolve => {
						if (this.userInfo) {
							resolve();
						} else {
							uni.navigateTo({
								url: "/pages/userInfo/login/login"
							})
						}
					})
				},
				...mapMutations(["updateUserInfo"])
			},
			computed: {
				...mapState(["userInfo"]),
			}
		})
	}
}