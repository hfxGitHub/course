<template>
	<view>
		<view class="head-box">
			<view class="navbar" title="微课程教学平台"></view>
			<view class="container">
				<view class="left">
					<view class="logo" style="display: inline-block;">
						<image :src="avatarUrl" mode="aspectFit"></image>
					</view>
					<text v-if="userType==0" style="display: inline-block;">您好！{{nickName}}同学</text>
					<text v-else style="display: inline-block;">您好！{{nickName}}老师</text>
				</view>
			</view>
		</view>

		<view v-if="userType==0" class="add-btn" @click="addCourse()">
			<text>加入班级</text>
		</view>
		<view v-else class="add-btn" @click="newCourse()">
			<text>新建班级</text>
		</view>

		<!-- 下拉刷新部分 -->
		<mescroll-body ref="mescrollRef" :down="downOption" @down="downCallback" @up="upCallback">
			<view class=" store-box" v-if="courseList">
				<view class=" item-box" v-for="(course,i) in courseList" :key="i">
					<view class="container top-box">
						<!-- <view class="left" @click="toCourse(course)">
							<image :src="baseURL+store.avatar" mode="aspectFill"></image>
						</view> -->
						<view class="right" @click="toCourse(course)">
							<text class="tit">{{course.courseName}}（{{course.description}}）</text>
							<view class="row justify-content">
								<view class="row-right">
									<i class="hxicon-usefullfill"></i>
									<text>授课老师：{{course.teacherName}}</text>
								</view>
								<view class="row-right">
									<i class="hxicon-countdownfill"></i>
									<text>创建时间：{{course.createTime.split('T')[0]+ '    '+course.createTime.split('T')[1]}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<view class="foot" v-if="showFoot">
			<text>没有更多课程了哦~</text>
		</view>
		<view class="footzw"></view>
	</view>

</template>

<script>
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import wButton from '@/components/watch-login/watch-button.vue' //button
	const screenHeight = uni.getSystemInfoSync().screenHeight;
	import api from '@/common/vmeitime-http/'
	export default {
		mixins: [MescrollMixin],
		components: {
			MescrollBody,
			wButton
		},

		data() {
			return {
				baseURL: this.$baseURL,
				avatarUrl: '',
				nickName: '',
				address: '',
				userType: uni.getStorageSync('userType'),
				MPPR: 0,
				current: 1,
				showFoot: false,
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				courseList: [],
			}
		},
		onShow() {
			if (this.userType == 0) {
				api.course.myJoinAll().then(res => {
					if (res.data.code == 0) {
						this.courseList = res.data.data;
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			} else {
				api.course.myCreateAll().then(res => {
					if (res.data.code == 0) {
						this.courseList = res.data.data;
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			}
		},
		onLoad() {
			let that = this;
			// 查看是否存在用户头像用户昵称等信息,便于展示
			if (uni.getStorageSync('userInfo')) {
				that.avatarUrl = uni.getStorageSync('userInfo').avatarUrl;
				that.nickName = uni.getStorageSync('userInfo').nickName;
			} else {
				// 无用户信息等则返回登录
				uni.showToast({
					icon: 'none',
					title: '您的登录过期了，请重新授权登录',
				})
				uni.reLaunch({
					url: '../login/login',
				})
			}

			// #ifdef MP
			//小程序下空出胶囊距离
			let m = uni.getMenuButtonBoundingClientRect();
			that.MPPR = m.width + 8

			// #endif

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
				this.mescroll.endErr();
			},
			getFirstPage() {
				if (this.userType == 0) {
					api.course.myJoinAll().then(res => {
						if (res.data.code == 0) {
							this.courseList = res.data.data;
						} else {
							uni.showModal({
								content: res.data.msg,
								confirmColor: 'rgb(28,224,235)',
							})
						}
					})
				} else {
					api.course.myCreateAll().then(res => {
						if (res.data.code == 0) {
							this.courseList = res.data.data;
						} else {
							uni.showModal({
								content: res.data.msg,
								confirmColor: 'rgb(28,224,235)',
							})
						}
					})
				}
			},
			upCallback(page) {
				let that = this;
				//无更多课程
				that.showFoot = true;
				that.mescroll.endSuccess(10);
				return;
			},

			toCourse(course) {
				uni.showLoading({
					mask:true,
					icon: 'loading',
					title: '请稍等~'
				})
				uni.setStorageSync('nowCourse', course);
				uni.switchTab({
					url: '../gongneng/index'
				})
				uni.hideLoading()
			},
			// 学生加入班级
			addCourse() {
				uni.navigateTo({
					url: '../course/addcourse'
				})
			},
			// 老师新建班级
			newCourse() {
				uni.navigateTo({
					url: '../course/addcourse'
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

	.add-btn {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		top: 40rpx;
		margin-bottom: 40rpx;
		height: 45px;
		font-size: 16px;
		font-weight: bold;
		color: #333;
		background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
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
