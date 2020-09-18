<template>
	<view>
		<hx-navbar backTabbarUrl="/pages/gongneng/index" title="课程课件"></hx-navbar>
		<!-- 下拉刷新部分 -->
		<mescroll-body ref="mescrollRef" :down="downOption" @down="downCallback" @up="upCallback">
			<view class=" store-box" v-if="PPTList">
				<view class=" item-box" v-for="(PPT,i) in PPTList" :key="i">
					<view class="container top-box">
						<!-- <view class="left" @click="toPPT(PPT)">
							<image :src="baseURL+PPT.posterUrl" mode="aspectFill"></image>
						</view> -->
						<view class="right">
							<text class="tit">{{PPT.title}}（{{PPT.description}}）</text>
							<view class="row justify-content">
								<view class="row-right">
									<i class="hxicon-countdownfill"></i>
									<text>下载次数：{{PPT.downloadAmount}}</text>
								</view>
								<view class="row-right">
									<i class="hxicon-countdownfill"></i>
									<text>上传时间：{{PPT.createTime.split('T')[0] + '    ' + PPT.createTime.split('T')[1]}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="add-btn" @click="download(PPT)">
						<text>下 载</text>
					</view>
					<view v-if="userType == 1" style="background: #E04B28;" class="add-btn" @click="del(PPT)">
						<text>删 除</text>
					</view>
				</view>
			</view>
			<view v-if="userType == 1" style="margin-top: 60rpx;" class="add-btn" @click="uploadPPT()">
				<text>上传课件</text>
			</view>
		</mescroll-body>

		<view class="foot" v-if="showFoot">
			<text>~没有更多课件了~</text>
		</view>
		<view class="footzw"></view>
	</view>

</template>

<script>
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import hxNavbar from "@/components/hx-navbar/hx-navbar.vue"
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	const screenHeight = uni.getSystemInfoSync().screenHeight;
	import api from '@/common/vmeitime-http/'
	export default {
		mixins: [MescrollMixin],
		components: {
			MescrollBody
		},

		data() {
			return {
				PPTList: [],
				baseURL: this.$baseURL,
				MPPR: 0,
				total: 0,
				size: 10,
				userType: uni.getStorageSync('userType'),
				current: 1,
				NoMore: false,
				//显示没有更多
				showFoot: false,
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				// 判断是否在加载,避免重复请求
				loading: false
			}
		},
		onLoad() {
			let that = this;
			// #ifdef MP
			//小程序下空出胶囊距离
			let m = uni.getMenuButtonBoundingClientRect();
			that.MPPR = m.width + 8

			// #endif
			this.getPPT()
		},
		mounted() {
			let that = this;
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				let that = this;
				//联网成功的回调,隐藏下拉刷新的状态
				that.getFirstPage();
				that.mescroll.endSuccess();
			},
			getPPT() {
				if (this.loading || this.NoMore) {
					return;
				}
				uni.showLoading({
					mask:true,
				})
				this.loading = true;
				const sendData = {
					current: this.current++,
					size: 10,
					courseId: uni.getStorageSync('nowCourse').courseId
				}
				api.PPT.listPPT(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.PPTList = [...this.PPTList, ...res.data.data.records];
							console.log(this.PPTList)
						} else {
							this.PPTList = [...this.PPTList, ...res.data.data.records];
						}
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
					this.loading = false;
					uni.hideLoading()
				})

			},
			// 获取第一页数据
			getFirstPage() {
				this.current = 1;
				let that = this;
				const sendData = {
					current: that.current++,
					size: that.size,
					courseId: uni.getStorageSync('nowCourse').courseId
				}
				api.PPT.listPPT(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.PPTList = res.data.data.records;
						} else {
							this.PPTList = res.data.data.records;
						}
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			},
			// 触底刷新
			upCallback(page) {
				let that = this;
				if (that.NoMore) {
					that.showFoot = true;
					that.mescroll.endSuccess(10);
					return;
				}
				that.showFoot = false;
				that.getPPT();
				that.mescroll.endSuccess(10);

			},
			// 下载课件
			download(PPT) {
				uni.showLoading({
					mask:true,
				})
				wx.downloadFile({
					url: this.$baseURL + 'ppt/downloadWare?courseWareId=' + PPT.courseWareId + '&openId=' + uni.getStorageSync(
						'openId'),
					success: (res) => {
						if (res.statusCode == 200) {
							let path = res.tempFilePath
							wx.saveFile({
								tempFilePath: path,
								success: (res1) => {
									uni.hideLoading()
									uni.showModal({
										content: '下载成功',
										confirmColor: 'rgb(28,224,235)',
										showCancel: false
									})
								},
								fail: (err) => {
									uni.hideLoading()
									uni.showModal({
										content: err.errMsg,
										confirmColor: 'rgb(28,224,235)',
										showCancel: false
									})
									console.log(err)
								}
							})
						} else {
							uni.hideLoading()
							uni.showModal({
								content: res.errMsg,
								confirmColor: 'rgb(28,224,235)',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showModal({
							content: err.errMsg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false
						})
					}
				})
			},
			// 删除课件
			del(data) {
				uni.showModal({
					content: '确定删除吗？',
					confirmColor: '#E04B28',
					confirmText: '确定',
					success: (r) => {
						if (r.confirm) {
							uni.showLoading({
								mask: true,
								title: '~删除中~'
							})
							api.PPT.delPPT({
								courseWareId: PPT.courseWareId
							}).then(res => {
								if (res.data.code == 0) {
									uni.hideLoading()
									uni.showModal({
										content: res.data.msg,
										confirmColor: 'rgb(28,224,235)',
										showCancel: false,
										complete: (r) => {
											this.getFirstPage()
										}
									})
								} else {
									uni.hideLoading()
									uni.showModal({
										content: res.data.msg,
										confirmColor: 'rgb(28,224,235)',
										showCancel: false,
										complete: (r) => {
											this.getFirstPage()
										}
									})
								}
							})
						}
					}
				})
			},
			// 老师上传课件资源
			uploadPPT() {
				uni.navigateTo({
					url: './addPPT'
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.b-b {
		position: relative;
	}

	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid #E4E7ED;
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
		margin: 20rpx 0 20rpx 0;
		background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	.container {
		margin: 0 15px;
	}

	.margin-top {
		margin-top: 12px;
	}

	.head-box {
		padding: 14px 0;
		/* #ifdef MP */
		padding-top: 2px;
		/* #endif */
		background: linear-gradient(100deg, rgb(204, 255, 255), RGB(151, 255, 255));
		position: relative;
		z-index: 3;

		.navbar {
			position: sticky;
			top: 0;
			height: var(--status-bar-height);
		}

		.container {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: 32px;
			align-items: center;

			.left {
				.logo {
					width: 32px;
					height: 32px;

					image {
						width: 32px;
						height: 32px;
						border-radius: 50%;
					}
				}
			}

			.right {
				display: flex;
				flex-direction: row;
				color: #333333;
				align-items: center;

				.address-box {
					font-size: 14px;
					margin-right: 16px;
					display: flex;
					flex-direction: row;
					align-items: center;

					text {
						margin-left: 2px;
						margin-right: 4px;
					}

					.icon-right {
						position: relative;
						top: 2px;
					}
				}

				.notice {
					font-weight: bold;
					font-size: 18px;
				}
			}

		}

	}


	.store-box {
		margin-top: 20px;

		.item-box {
			display: flex;
			flex-direction: column;
			margin-bottom: 14px;
			padding-bottom: 18px;
			padding-top: 18px;
			background-color: #ffffff;

			.top-box {
				display: flex;
				flex-direction: row;

				.left {
					margin-right: 10px;


					image {
						width: 72px;
						height: 54px;
						border-radius: 6px;
					}
				}

				.right {
					flex: 1;

					.tit {
						font-size: 16px;
						font-weight: bold;
						color: #333333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.justify-content {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}

					.row {
						font-size: 12px;
						color: #999999;
						margin-top: 4px;

						.row-left {
							display: flex;
							flex-direction: row;

							.t1,
							i {
								color: #ffca3e;
							}

						}

						.t2 {
							margin-left: 12px;
						}

						.row-right {
							display: flex;
							flex-direction: row;

							i {
								margin-right: 4px;
							}
						}

					}
				}
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
				background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
			}

			.bottom-box {
				&-container {
					margin: 12px 0 0;
					padding-left: 82px;

					white-space: nowrap;

					.goods-box {
						width: 80px;
						margin-left: 12px;
						display: inline-block;

						.img-box {
							position: relative;
							width: 80px;
							height: 60px;
							background-color: #f1f1f1;
							border-radius: 4px;

							image {
								width: 100%;
								height: 60px;
							}

							.tag {
								position: absolute;
								bottom: 0;
								left: 0;
								background-color: #FF5722;
								color: #ffffff;
								padding: 2px 4px;
								font-size: 12px;
								border-radius: 4px;
							}
						}

						.tit {
							font-size: 14px;
							margin-top: 4px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.price-box {
							margin-top: 4px;

							.txt1 {
								font-size: 10px;
								color: #FF5722;
							}

							.txt2 {
								font-size: 16px;
								color: #FF5722;
							}

							.txt3 {
								margin-left: 6px;
								font-size: 10px;
								color: #bbbbbb;
								text-decoration: line-through;
							}
						}
					}

					.goods-box:last-child {
						margin-right: 12px;
					}

				}

			}
		}

		.item-box:last-child {
			border-bottom: 0;
		}
	}

	.foot {
		position: relative;
		display: flex;
		justify-content: center;
		margin-top: 36px;
		margin-bottom: 50px;

		text {
			font-size: 14px;
			position: relative;
			z-index: 2;
			height: 20px;
			line-height: 20px;
			background-color: #f8f8f8;
			color: #cccccc;
			padding: 0 12px;
		}
	}

	.foot::before {
		content: "";
		z-index: 1;
		display: block;
		position: absolute;
		top: 50%;
		height: 0;
		width: 100%;
		transform: scaleY(0.5);
		border-bottom: 1px solid #E4E7ED;
	}

	.footzw {
		/* #ifdef H5*/
		height: 50px;
		/* #endif */
	}
</style>
