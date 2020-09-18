<template>
	<view>
		<hx-navbar backTabbarUrl="/pages/ziyuan/ziyuan" :title.sync="pageTitle"></hx-navbar>
		<view v-if="haveMovie == true">
			<video id="myVideo" play-btn-position="center" :src="movieInfo.movieUrl" :title="pageTitle" @error="videoErrorCallback"
			 controls object-fit="fill"></video>
		</view>

		<view v-else class="list-box">
			<view class="row b-b">
				<text class="tit">视频标题：</text>
				<input class="input" focus="true" type="text" v-model="movieInfo.title" placeholder="请输入视频标题" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">视频描述：</text>
				<input class="input" type="text" v-model="movieInfo.description" placeholder="请输入视频描述" placeholder-class="placeholder" />
			</view>
		</view>

		<view v-if="haveMovie == true" class="descripeContent" style="width: 80%;padding: 30rpx;">
			<text>视频名称：{{movieInfo.title}}</text>
			<text>视频描述：{{movieInfo.description}}</text>
			<text>下载次数：{{movieInfo.downloadAmount}}</text>
			<text>上传时间：{{movieInfo.createTime.split('T')[0] + '    ' + movieInfo.createTime.split('T')[1]}}</text>
		</view>

		<view v-if="haveMovie == true" class="add-btn" @click="download">
			<text>下 载</text>
		</view>

		<view v-if="userType == 1 && haveMovie == true" class="add-btn" style="background-color: #E04B28;" @click="delMovie">
			<text>删 除</text>
		</view>

		<view v-if="haveMovie == false" class="add-btn" @click="uploadVideo">
			<text>请选择视频</text>
		</view>
		<view v-if="haveMovie == false" class="add-btn" @click="uploadVideoPoster">
			<text>请选择视频封面</text>
		</view>

		<view v-if="haveMovie == false" class="add-btn" @click="uploadAll">
			<text>上 传</text>
		</view>
	</view>
</template>

<script>
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				pageTitle: '课程资源',
				movieInfo: {
					title: '',
					description: '',
				},
				courseId: uni.getStorageSync('nowCourse').courseId,
				userType: uni.getStorageSync('userType'),
				haveMovie: false,
				videoName: '',
				movieUrl: '',
				posterUrl: '',
				posterName: '',
			}
		},
		onLoad(option) {
			if (option.courseMovieId != undefined) {
				this.haveMovie = true;
				this.movieInfo = uni.getStorageSync('nowMovie');
				this.movieInfo.movieUrl = this.$baseURL + this.movieInfo.movieUrl;
				this.pageTitle = this.movieInfo.title;
			} else {
				this.pageTitle = '上传课程资源';
			}
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			// 选择视频
			uploadVideo() {
				wx.chooseVideo({
					success: (res) => {
						if (res.errMsg == 'chooseVideo:ok') {
							this.movieUrl = res.tempFilePath;
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
			// 选择视频封面
			uploadVideoPoster() {
				wx.chooseImage({
					count: 1,
					success: (res) => {
						if (res.errMsg == 'chooseImage:ok') {
							this.posterUrl = res.tempFilePaths[0];
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
				if (this.movieInfo.title == '' || this.description == '' || this.movieUrl == '' || this.posterUrl == '') {
					uni.showModal({
						content: '请输入完整数据，并选择相应文件再上传哦~',
						showCancel: false,
						confirmColor: 'rgb(28,224,235)',
					})
					return;
				}
				uni.showLoading({
					title: '~正在上传~',
					mask:true,
				})
				wx.uploadFile({
					url: this.$baseURL + 'movie/add?courseId=' + this.courseId + '&title=' + this.movieInfo.title + '&description=' +
						this.movieInfo.description,
					filePath: this.movieUrl,
					name: 'movie',
					header: {
						openId: uni.getStorageSync('openId')
					},
					success: (res) => {
						if (res.statusCode == 200) {
							let params = JSON.parse(res.data);
							if (params.code == 0) {
								uni.uploadFile({
									url: this.$baseURL + 'movie/addPoster?movieId=' + params.data.movieId,
									filePath: this.posterUrl,
									name: 'poster',
									header: {
										openId: uni.getStorageSync('openId')
									},
									success: (res1) => {
										if (res1.statusCode == 200) {
											let params1 = JSON.parse(res1.data);
											if (params1.code == 0) {
												uni.hideLoading()
												uni.showModal({
													content: '上传成功',
													confirmColor: 'rgb(28,224,235)',
													showCancel: false,
												})
											} else {
												uni.hideLoading()
												uni.showModal({
													content: params1.msg,
													confirmColor: 'rgb(28,224,235)',
													showCancel: false,
												})
											}

										} else {
											uni.hideLoading()
											uni.showModal({
												content: params1.msg,
												confirmColor: 'rgb(28,224,235)',
												showCancel: false,
											})
										}
									},
									fail: (err1) => {
										console.log(err1)
										uni.hideLoading()
										uni.showModal({
											content: err1.data.msg,
											confirmColor: 'rgb(28,224,235)',
											showCancel: false,
										})
									}
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
			// 删除视频
			delMovie() {
				uni.showModal({
					content: '确定要删除吗？',
					confirmColor: '#E04B28',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中~',
								mask:true,
							})
							api.ziyuan.delMovie({
								movieId: uni.getStorageSync('nowMovie').courseMovieId
							}).then(res1 => {
								if (res1.data.code == 0) {
									uni.hideLoading()
									uni.showModal({
										content: '删除成功！',
										confirmColor: 'rgb(28,224,235)',
										showCancel: false,
										complete: (r) => {
											uni.navigateBack()
										}
									})
								} else {
									uni.hideLoading()
									uni.showModal({
										content: res1.data.msg,
										confirmColor: 'rgb(28,224,235)',
									})
								}
							})
						}
					},
				})
			},
			// 下载视频
			download() {
				wx.downloadFile({
					url: this.$baseURL + 'movie/downloadMovie?movieId=' + uni.getStorageSync('nowMovie').courseMovieId + '&openId=' +
						uni.getStorageSync('openId'),
					success: (res) => {
						if (res.statusCode == 200) {
							let tempFilePaths = res.tempFilePath
							wx.saveVideoToPhotosAlbum({
								filePath: tempFilePaths,
								success: (res) => {
									uni.showModal({
										content: '下载成功',
										confirmColor: 'rgb(28,224,235)',
										showCancel: false,
									})
								},
								fail: (err) => {
									uni.showModal({
										content: err.errMsg,
										confirmColor: 'rgb(28,224,235)',
									})
								}
							})
						}
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	#myVideo {
		width: 100%;
	}

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
