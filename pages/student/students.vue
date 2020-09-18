<template>
	<view>
		<hx-navbar backTabbarUrl="/pages/gongneng/index" title="班级学生"></hx-navbar>
		<!-- 下拉刷新部分 -->
		<mescroll-body ref="mescrollRef" :down="downOption" @down="downCallback" @up="upCallback">
			<view class=" store-box" v-if="studentList">
				<view class=" item-box" v-for="(student,i) in studentList" :key="i">
					<view class="container top-box">
						<view class="left" >
							<image :src="student.userInfo.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="right" >
							<text class="tit">{{student.studentName}}</text>
							<!-- <view class="row justify-content">
								<view class="row-right">
									<i class="hxicon-countdownfill"></i>
									<text>下载次数：{{student.downloadAmount}}</text>
								</view>
							</view> -->
						</view>
					</view>
					
				</view>
			</view>
		</mescroll-body>
		<view class="foot" v-if="showFoot">
			<text>~没有更多学生了~</text>
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
				studentList: [],
				baseURL: this.$baseURL,
				MPPR: 0,
				total: 0,
				size: 10,
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
			this.getstudent()
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
			getstudent() {
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
				api.course.listStudent(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.studentList = [...this.studentList, ...res.data.data.records];
							console.log(this.studentList)
						} else {
							this.studentList = [...this.studentList, ...res.data.data.records];
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
				api.course.listStudent(sendData).then(res => {
					if (res.data.code == 0) {
						let params = res.data.data;
						if (Math.ceil(params.total / params.size) < params.current || params.total < params.size) {
							this.NoMore = true;
							this.studentList = res.data.data.records;
						} else {
							this.studentList = res.data.data.records;
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
				that.getstudent();
				that.mescroll.endSuccess(10);

			},
			// 跳转到资源详情
			tostudent(student) {
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
				uni.setStorageSync('nowstudent', student)
				uni.navigateTo({
					url: './student?' + student.coursestudentId
				})
				uni.hideLoading()
			},
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

	.search-box {
		position: sticky;
		top: 0;
		z-index: 2;
		background: linear-gradient(100deg, #FFEB3B, #FFC107);
		padding-top: var(--status-bar-height);
		margin-top: calc(var(--status-bar-height) * -1);

		.ctn {
			border-top-left-radius: 50upx;
			border-top-right-radius: 50upx;
			background: #f8f8f8;
			padding: 15px 15px 12px;

			.hx-search-box {
				border-radius: 40px;
				padding: 0 15px;
				height: 34px;
				display: flex;
				align-items: center;
				line-height: 44rpx;
				background-color: #eeeeee;
				flex: 1;
				color: #888888;
				font-size: 14px;
			}
		}
	}

	.QZBG {
		background: #ffffff;
		box-shadow: 0 1px 6px #ccc;

		.navbar {
			height: var(--status-bar-height);
		}

		.ctn {
			background: #ffffff;
			/* #ifdef MP */
			padding-top: 0px;
			/* #endif */
		}
	}

	.hot-box {

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;

		.item {
			margin-right: 12px;
			background-color: #EEEEEE;
			color: #666666;
			font-size: 12px;
			border-radius: 20px;
			padding: 2px 6px;
			margin-bottom: 8px;
		}

		.item:last-child {
			margin-right: 0;
		}
	}

	.bannerimg-box {
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
		padding: 24rpx;

		swiper {
			height: 233rpx;
			width: 699rpx;
		}

		.swiper-item {

			display: flex;
			justify-content: center;
			align-content: center;
			overflow: hidden;

			width: 100%;
			height: 100%;

			image {
				border-radius: 8px;
				width: 100%;

			}
		}

	}

	.menu-box {

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 12px;
		border-radius: 8px;
		background: #ffffff;
		padding: 12px 8px;

		.item-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 40px;
				height: 40px;
			}

			.tit {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				margin-top: 6px;
				color: #333333;
				padding: 2px 0;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.active {
				color: #ffffff;
				background-color: #999999;
				border-radius: 60px;
			}
		}
	}

	.sort-box {
		display: flex;
		flex-direction: row;
		margin-top: 12px;

		.item-box {

			margin-right: 16px;

			.tit {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				color: #333333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.active {
				//color: #111111;
				font-weight: bold;
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
