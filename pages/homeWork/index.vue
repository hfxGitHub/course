<template>
	<view>
		<hx-navbar backTabbarUrl="/pages/gongneng/index" title="班级作业"></hx-navbar>
		<!-- 下拉刷新部分 -->
		<mescroll-body ref="mescrollRef" :down="downOption" @down="downCallback" @up="upCallback">
			<view class=" store-box" v-if="homeWorkList">
				<view class=" item-box" v-for="(homeWork,i) in homeWorkList" :key="i">
					<view v-if="userType==0">
						<icon v-if="homeWork.status !== null" type="success" size="26" />
						<icon v-else type="warn" size="26" />
						<view class="container top-box">
							<view class="right" @click="tohomeWork(homeWork)">
								<text class="tit">{{homeWork.topicStem.length>15?homeWork.topicStem.substring(0,14):homeWork.topicStem}}...</text>
								<view class="row justify-content">
									<view class="row-right">
										<i class="hxicon-timefill"></i>
										<text>发布时间：{{homeWork.createTime.split('T')[0] + '  ' +homeWork.createTime.split('T')[1]}} </text>
										<br />
										<i class="hxicon-timefill"></i>
										<text>截止时间：{{homeWork.closeTime.split('T')[0] + '  ' +homeWork.createTime.split('T')[1]}} </text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="userType==1">
						<view class="container top-box" style="margin-bottom: 50rpx;">
							<view class="right" @click="tohomeWork(homeWork)">
								<text class="tit">{{homeWork.topicStem.length>15?homeWork.topicStem.substring(0,14):homeWork.topicStem}}...</text>
								<text>总人数：{{homeWork.studentCount}}人&nbsp;&nbsp;&nbsp;&nbsp;</text>
								<text>已提交：{{homeWork.submitCount}}人</text>
								<view class="row justify-content">
									<view class="row-right">
										<i class="hxicon-timefill"></i>
										<text>发布时间：{{homeWork.createTime.split('T')[0] + '  ' +homeWork.createTime.split('T')[1]}} </text>
										<br />
										<i class="hxicon-timefill"></i>
										<text>截止时间：{{homeWork.closeTime.split('T')[0] + '  ' +homeWork.createTime.split('T')[1]}} </text>
									</view>
								</view>
							</view>
						</view>
						<view class="btn" style="background-color: #E54D42;color: #F0F0F0;height: 80rpx;text-align: center;font-size: 1em;line-height: 80rpx;"
						 @click="delWork(homeWork)">删除</view>
					</view>

				</view>
				<view v-if="userType == 1" class="add-btn" @click="addHomeWork()">
					<text>新建作业</text>
				</view>
			</view>
		</mescroll-body>
		<view class="foot" v-if="showFoot">
			<text>~没有更多作业了~</text>
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
				homeWorkList: [],
				baseURL: this.$baseURL,
				MPPR: 0,
				total: 0,
				size: 10,
				current: 1,
				userType: uni.getStorageSync('userType'),
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
		},
		onShow() {
			this.getFirstPage()
			this.gethomeWork()
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
			gethomeWork() {
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
				api.homeWork.listHomeWork(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.homeWorkList = [...this.homeWorkList, ...params.records];
						} else {
							this.homeWorkList = [...this.homeWorkList, ...params.records];
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
				api.homeWork.listHomeWork(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.homeWorkList = params.records;
						} else {
							this.homeWorkList = params.records;
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
				that.gethomeWork();
				that.mescroll.endSuccess(10);

			},
			// 跳转到作业详情
			tohomeWork(homeWork) {
				uni.showLoading({
					mask:true,
					icon: 'loading',
					title: '请稍等~'
				})
				// let store_id = store.openId
				// let parameter = `?sid=${store_id}`
				// if (goodsID != null) {
				// 	parameter += `&gid=${goodsID}`
				// }
				uni.setStorageSync('nowhomeWork', homeWork)
				uni.navigateTo({
					url: './doHomeWork?topicId=' + homeWork.topicId + '&subStatus=' + homeWork.status
				})
				uni.hideLoading()
			},
			// 老师删除作业
			delWork(data) {
				uni.showModal({
					content: '确定删除吗？',
					confirmColor: '#E04B28',
					confirmText: '删除',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								mask:true,
							})
							api.homeWork.delWork({
								topicId: data.topicId
							}).then(res => {
								if (res.data.code == 0) {
									this.getFirstPage()
									uni.hideLoading()
									uni.showModal({
										content: '删除成功',
										confirmColor: 'rgb(28,224,235)',
										showCancel: false
									})
								} else {
									this.getFirstPage()
									uni.hideLoading()
									uni.showModal({
										content: res.data.msg,
										confirmColor: 'rgb(28,224,235)',
										showCancel: false
									})
								}
							})
						}
					},
				})
			},
			// 老师新增作业
			addHomeWork() {
				uni.navigateTo({
					url:'./addHomeWork'
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
