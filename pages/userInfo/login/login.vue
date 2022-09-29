<template>
	<view class="login-container">
		<image src="../../../static/img/login_bg.png" class="banner-bg" mode=""></image>
		<!-- 导航 -->
		<view class="login-nav">
			<view class="nav-item" @click="changLoginType('account')" :class="{'active': type === 'account'}">
				账号登录
			</view>
			<view class="nav-item" @click="changLoginType('mobile')" :class="{'active': type !== 'account'}">
				手机登录
			</view>
		</view>
		<!-- 表单项 -->
		<uni-forms class="form" ref="userForm" :modelValue="formData">
			<view class="" v-if="type === 'account'">
				<uni-forms-item label="账号" name="loginName">
					<input type="text" placeholder-class="placeholder" class="form-input" placeholder="请输入账号" v-model="formData.loginName">
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput :inputBorder="false" type="password" placeholder-class="placeholder" class="form-input" placeholder="请输入密码" v-model="formData.password"></uni-easyinput>
				</uni-forms-item>
			</view>
			<view class="" v-else>
				<uni-forms-item label="手机号" name="phone">
					<input type="number" placeholder-class="placeholder" class="form-input" placeholder="请输入手机号" v-model="formData.phone">
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<input type="text" placeholder-class="placeholder" class="form-input" placeholder="请输入验证码" v-model="formData.vCode">
					<SendCode @setCurrentCode="returnCode=$event" @getForm="getForm"></SendCode>
				</uni-forms-item>
			</view>
			<button class="login-btn" @click="_userLoginSubmit">立即登录</button>
		</uni-forms>
		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: "account",
				formData: {
					loginName: "", // 账号
					password: "", //密码
					phone: "", // 手机号
					vCode: "" //验证码
				},
				returnCode: null,
			}
		},
		onReady() {
			this.$refs.userForm.setRules(this.userRules)
		},
		methods: {
			async _userLoginSubmit () {
				const res = await this.$refs.userForm.submit();
				// 发送数据到后端
				this._sendUserInfo({
					...res,
					type: this.type
				})
			},
			/* 切换当前表单类型 */
			changLoginType(type) {
				this.type = type;
				this.$refs.userForm.clearValidate([]);// 清空校验规则
			},
			async _sendUserInfo(data) {
				const userInfo = await this.$http.user_login(data);
				if (userInfo) {
					// 使用store的形式进行存储
					this.updateUserInfo(userInfo);
					uni.showToast({
						title: "用户登录成功",
						icon: "none"
					})
					setTimeout(()=>{
						// #ifdef H5
						uni.switchTab({
							url: "/pages/index/index"
						})
						// #endif
						// #ifndef H5
						uni.navigateBack();
						// #endif
					}, 1500)
				}
			},
			// 向验证码发送form表单
			getForm(cb) {
				cb&&cb(this.$refs.userForm);
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f8f8f8;
	}
</style>
<style lang="scss" scoped>
	@import "./css/login.scss";
</style>
