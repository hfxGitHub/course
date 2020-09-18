<template>
	<view class="register">
		<hx-navbar backTabbarUrl="/pages/user/center/center" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="content" style="margin-bottom: 50rpx;">
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="myName" type="text" maxlength="6" placeholder="请输入姓名(不超过六个字符)"></wInput>
			</view>

			<wButton text="提 交" :rotate="isRotate" @click.native="startReg()"></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import hxNavbar from '@/components/hx-navbar/hx-navbar.vue'; //navbar
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	const CryptoJS = require("crypto-js");
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				myName: '',
				isRotate: false, //是否加载旋转
			}
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
		},
		onLoad() {
			this.isRotate = false;
			if (uni.getStorageSync('studentName')) {
				this.myName = uni.getStorageSync('studentName');
			}
		},
		methods: {
			startReg() {
				if (this.myName == '') {
					return;
				}
				uni.showLoading({
					mask: true,
				})
				uni.setStorageSync('studentName', this.myName);
				api.user.updateName({
					courseId: uni.getStorageSync('nowCourse').courseId,
					studentName: this.myName
				}).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
							complete: (r) => {
								uni.navigateBack()
							}
						})
					} else {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			},

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* margin-top: 128upx; */
	}

	/* 头部 logo */
	.header {
		width: 161upx;
		height: 161upx;
		box-shadow: 0upx 0upx 60upx 0upx rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		background-color: #000000;
		margin-top: 128upx;
		margin-bottom: 72upx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 161upx;
		height: 161upx;
		border-radius: 50%;
	}

	/* 主体 */
	.main {
		display: flex;
		flex-direction: column;
		padding-left: 70upx;
		padding-right: 70upx;
	}

	.tips {
		color: #999999;
		font-size: 28upx;
		margin-top: 64upx;
		margin-left: 48upx;
	}

	/* 其他登录方式 */
	.other_login {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 256upx;
		text-align: center;
	}

	.login_icon {
		border: none;
		font-size: 64upx;
		margin: 0 64upx 0 64upx;
		color: rgba(0, 0, 0, 0.7)
	}

	.wechat_color {
		color: #83DC42;
	}

	.weibo_color {
		color: #F9221D;
	}

	.github_color {
		color: #24292E;
	}

	/* 底部 */
	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 64upx;
		color: rgba(0, 0, 0, 0.7);
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}

	.footer text {
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
