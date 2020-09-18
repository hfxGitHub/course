<template>
	<view>
		<hx-navbar backTabbarUrl="/pages/kejian/PPT" :title.sync="pageTitle"></hx-navbar>

		<view class="list-box">
			<view class="row b-b">
				<text class="tit">课件标题：</text>
				<input class="input" focus="true" type="text" v-model="PPTtitle" placeholder="请输入课件标题" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">课件描述：</text>
				<input class="input" type="text" v-model="PPTdescription" placeholder="请输入课件描述" placeholder-class="placeholder" />
			</view>
		</view>

		<h2 style="text-align: center;margin: 40rpx 0 40rpx 0;">微信小程序暂时只支持上传图片类型的文件，请上传课件图片</h2>
		<view class="add-btn" @click="uploadVideoPoster">
			<text>请选择课件</text>
		</view>

		<view class="add-btn" @click="uploadAll">
			<text>上 传</text>
		</view>
	</view>
</template>

<script>
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				pageTitle: '上传课件',
				PPTtitle: '',
				PPTdescription: '',
				PPTPath: '',
				courseId: uni.getStorageSync('nowCourse').courseId,
				userType: uni.getStorageSync('userType'),
			}
		},
		onLoad() {

		},
		methods: {
			// 选择课件
			uploadVideoPoster() {
				wx.chooseImage({
					success: (res) => {
						if (res.errMsg == 'chooseImage:ok') {
							console.log(res)
							this.PPTPath = res.tempFilePaths[0];
							uni.showModal({
								content: '选择成功',
								confirmColor: 'rgb(28,224,235)',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						console.log(err)
						uni.showModal({
							content: '选择失败，请重新选择',
							confirmColor: 'rgb(28,224,235)',
							showCancel: false
						})
					}
				})
			},
			// 上传视频和视频封面
			uploadAll() {
				if (this.PPTtitle == '' || this.PPTdescription == '' || this.PPTPath == '') {
					uni.showModal({
						content: '请输入完整数据，并选择相应文件再上传哦~',
						showCancel: false,
						confirmColor: 'rgb(28,224,235)',
					})
					return;
				}
				uni.showLoading({
					title: '~正在上传~',
					mask: true
				})
				wx.uploadFile({
					url: this.$baseURL + 'ppt/add?courseId=' + this.courseId + '&title=' + this.PPTtitle + '&description=' +
						this.PPTdescription,
					filePath: this.PPTPath,
					name: 'PPT',
					header: {
						openId: uni.getStorageSync('openId')
					},
					success: (res) => {
						if (res.statusCode == 200) {
							let params = JSON.parse(res.data);
							if (params.code == 0) {
								uni.hideLoading()
								uni.showModal({
									content: '上传成功',
									confirmColor: 'rgb(28,224,235)',
									showCancel: false,
								})
							} else {
								uni.hideLoading()
								uni.showModal({
									content: params.msg,
									confirmColor: 'rgb(28,224,235)',
									showCancel: false,
								})
							}
						} else {
							uni.hideLoading()
							uni.showModal({
								content: res.data.msg,
								confirmColor: 'rgb(28,224,235)',
								showCancel: false,
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showModal({
							content: err.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.descripeContent text {
		display: block;
		font-size: 36rpx;
		line-height: 50rpx;

	}

	.add-btn {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		height: 45px;
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin: 40rpx 0 40rpx 0;
		background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-locationfill {
			font-size: 36upx;
			color: $font-color-light;
		}
	}
</style>
