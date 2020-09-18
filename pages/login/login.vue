<template>
	<view style="width: 100%;height: 100vh;">
		<h1 style="display: block;margin: 280rpx auto 200rpx auto;text-align: center;font-size: 2em;">欢迎使用微课程</h1>
		<button open-type="getUserInfo" @getuserinfo="handleGetUserInfo" style="display: block;width: 50%;height: auto;margin: auto;background-color: rgb(204,255,255);">开始使用</button>

	</view>
</template>

<script>
	import WxAuth from '@/common/WxAuth.js'
	import api from '@/common/vmeitime-http/'
	export default {
		userinfo: {},
		onLoad() {
			WxAuth.onLogin();
		},
		onShow() {
			
		},
		methods: {
			/**
			 * 微信授权 uni.getUserInfo
			 */
			handleGetUserInfo(e) {
				if (e.detail.errMsg != 'getUserInfo:ok') {
					uni.showModal({
						content: '抱歉，需要您的授权才能正常使用哦~',
						confirmColor: 'rgb(28,224,235)',
						complete: () => {
							uni.openSetting({
								success: (res) => {
									console.log(res)
								},
								fail: (err) => {
									console.log(err)
									uni.reLaunch({
										url: '../index/index'
									})
								}
							})
						}
					})
				}
				
				let {
					errMsg,
					iv,
					encryptedData
				} = e.detail;
				let {
					city,
					nickName,
					gender,
					country,
					province,
					avatarUrl
				} = e.detail.userInfo;
				if (city == '') {
					city = '北京';
				}
				if (country == '') {
					country = '中国';
				}
				if (province == '') {
					province = '北京'
				}
				const myInfo = {
					city:city,
					nickName:nickName,
					gender:gender,
					country:country,
					province:province,
					avatarUrl:avatarUrl,
					nickname:nickName
				}
				
				uni.setStorageSync('userInfo', myInfo);
				// nickname = nickName;
				// 检查登录态是否过期。
				WxAuth.checkSession().then(code => {
					//code, iv, encryptedData 传给服务器解析，得到用户信息
					myInfo.code = code;
					return api.user.login(myInfo)
				}).then(result => {
					//result： userInfo、token
					if (result.statusCode == 200) {
						if (result.data.code == 0) {
							uni.hideLoading()
							//临时登录凭证 code 只能使用一次,故刷新code;
							console.log('该跳转了')
							uni.setStorageSync('openId', result.data.data.openId);
							uni.setStorageSync('userType', result.data.data.userType);
							if (result.data.data.userType == 1) {
								uni.setStorageSync('IamBoss', result.data.data)
							}
							uni.reLaunch({
								url: '../index/index'
							})
						} else {
							console.log("获取用户信息: 老用户")
							uni.showModal({
								content:result.data.msg,
								confirmColor: 'rgb(28,224,235)',
							})
							uni.reLaunch({
								url: '../index/index'
							})
						}
					} else {
						console.log("获取用户信息失败")
					}
				}).catch("获取用户信息失败", console.log)
			},
			// 暂不登录
			handNotLogin() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
</style>
