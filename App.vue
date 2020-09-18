<script>
	import Vue from 'vue'
	import api from 'common/vmeitime-http/'
	const CryptoJS = require("crypto-js");
	Vue.prototype.$api = api;
	const WxAuth = require('@/common/WxAuth');
	export default {
		data() {
			return {
				process: {
					step: 1, //1:需要微信授权；2：需要手机号授权
					user: 0, //微信 0:未授权；1：已授权
					phone: 0 //手机号 0:未授权；1：已授权
				},
			}
		},

		onLaunch: function() {
			//检查是否登录
			//this.$api.user.hasLogin();
			if (uni.getStorageSync('code')) {
				// 已授权登录
				WxAuth.checkSession().then(code => {
					console.log('登录未过期');
					uni.navigateTo({
						url: 'pages/index/index',
					})
				}).catch('登录过期')
				// console.log('code is =======', uni.getStorageSync('code'));
			} else {
				WxAuth.onLogin();
				uni.navigateTo({
					url: 'pages/login/login'
				})
			}

			//字符串加密
			Vue.prototype.$strEncode = function($data) {
					if (typeof $data == 'object') {
						$data = JSON.stringify($data);
					}
					var key = CryptoJS.enc.Latin1.parse('BC1F5E3BAEE198AC');
					var iv = CryptoJS.enc.Latin1.parse('1F5E3BAEE198ACE1');
					var encoded = CryptoJS.AES.encrypt($data, key, {
						iv: iv,
						mode: CryptoJS.mode.CBC, //模式
						adding: CryptoJS.pad.ZeroPadding
					}).toString();
					if (!encoded) {
						return '';
					}
					return encoded
				},


				Vue.prototype.clientType = function() {
					let c = 1; //默认为电脑
					// #ifdef APP-PLUS
					switch (uni.getSystemInfoSync().platform) {
						case 'android':
							c = 3;
							break;
						case 'ios':
							c = 4;
							break;
						default:
					}
					// #endif	

					// #ifdef h5
					c = 2;
					// #endif	

					// #ifdef MP-WEIXIN
					c = 5;
					// #endif
					return c
				}

			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			//关闭页面
			Vue.prototype.closePage = function() {
				console.log(getCurrentPages());
				if (getCurrentPages().length > 1) {
					uni.navigateBack();
				} else {
					// #ifdef H5
					history.back()
					// #endif
					// #ifndef H5
					uni.reLaunch({
						url: '/pages/index/index'
					});
					// #endif
				}
			}

			// WxAuth.onLogin()
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			// Vue.prototype.navTo = function(url) {
			// 	// if(!this.hasLogin){
			// 	// 	url = '/pages/user/login/login';
			// 	// }
			// 	uni.navigateTo({
			// 		url: url
			// 	})
			// }
		},
		methods: {

		},
		onShow: function() {
			try {
				const value = uni.getStorageSync('userInfo');
				if (value) {
					//有登录信息
					that.$store.dispatch("setUserData", value); //存入状态
				} else {
					//用户未登录
					console.log('用户未登录')
					uni.showModal({
						content: '您还未登录，请先登录后使用',
						complete: (r) => {
							uni.navigateTo({
								url: '/pages/login/login',
							});
						}
					})

				}
			} catch (e) {
				// error
			}

			// 获取用户地理位置便于订餐
			// uni.getLocation({
			// 	type: 'wgs84',
			// 	success: function(res) {
			// 		uni.setStorageSync('latitude', res.latitude);
			// 		uni.setStorageSync('longitude', res.longitude);
			// 	},
			// 	fail: function(result) {
			// 		uni.showModal({
			// 			content: '检测到您未打开获取位置权限，需要您去开启该权限',
			// 			confirmText: '确认',
			// 			cancelText: '取消',
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 					uni.openSetting({
			// 						success: (res) => {
			// 							console.log(res);
			// 						},
			// 						fail: (err) => {
			// 							console.log(err);
			// 						}
			// 					})
			// 				} else {
			// 					console.log('取消了');
			// 					uni.reLaunch({
			// 						url: '/pages/index/index'
			// 					})
			// 				}
			// 			}
			// 		})
			// 	}
			// })
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "/common/iconfont/iconfont.css";
	/* #ifndef APP-PLUS-NVUE */
	@import "/common/main.css";
	/* #endif */

	/* 骨架屏方案 */
	.Skeleton {
		background-color: #f3f3f3;
		padding: 20upx 0;
		border-radius: 6upx;
	}
</style>
