<template>
	<view class="container">
		<hx-navbar :status-bar="true" :back="false" barPlaceholder="hidden" :fixed="true" :title.sync="pageTitle" transparent="auto">
		</hx-navbar>

		<view class="user-section ">
			<image class="bg" src="/static/img/user/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="courseInfo.teacherInfo.avatarUrl || defaultFace"></image>
				</view>
				<view class="info-box">
					<text class="username" style="color: #F0F0F0;">{{courseInfo.courseName}}</text>
					<text class="username" style="color: #F0F0F0;">({{courseInfo.description}})</text>
				</view>

			</view>
			<text style="color: #F0F0F0;" class="courseInfo">授课教师：{{courseInfo.teacherName}}</text>
			<text style="color: #F0F0F0;" class="courseInfo">课程码：{{courseInfo.code}}</text>
			<text style="color: #F0F0F0;" class="courseInfo">课程创建时间：{{courseInfo.createTime.split('T')[0]}}</text>
		</view>

		<view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="/static/img/user/arc.png"></image>
			<view class="history-section icon">
				<list-cell icon="hxicon-locationfill" iconColor="#e07472" title="签到" tips="点击进入签到" @eventClick="qiandao()"></list-cell>
				<list-cell icon="hxicon-circle" iconColor="#9789f7" title="课程资源" tips="点击观看课程视频" @eventClick="ToMovie()"></list-cell>
				<list-cell icon="hxicon-attentionfavor" iconColor="#ee883b" title="课程课件" tips="点击进入下载课件" @eventClick="ToPPT()"></list-cell>
				<list-cell icon="hxicon-form" iconColor="#51d4ef" title="课程作业" tips="点击进入完成课程作业" @eventClick="ToHomeWork()"></list-cell>
				<list-cell icon="hxicon-shengxianshuiguo" iconColor="#9789f7" title="班级学生" tips="查看我的同学" @eventClick="listStudent()"></list-cell>
				<list-cell icon="hxicon-round_pay_fill" iconColor="#51c26d" title="修改个人信息" tips="点击修改您的信息" @eventClick="editInfo()"></list-cell>
				<list-cell icon="hxicon-exit" iconColor="#e07472" title="注销登录" border="" @eventClick="logout()"></list-cell>
			</view>
		</view>

	</view>
</template>
<script>
	import hxNavbar from "@/components/hx-navbar/hx-navbar.vue"
	import listCell from '@/components/mix-list-cell';
	import api from '@/common/vmeitime-http/'
	import {
		mapState
	} from 'vuex';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell,
			hxNavbar
		},
		data() {
			return {
				pageTitle: "微课程",
				courseInfo: {
					courseId: '',
					courseName: '',
					description: '',
					code: '',
					teacherId: '',
					teacherName: '',
					createTime: ''
				},
				myUserType: uni.getStorageSync('userType'),
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				defaultFace: '/static/img/user/missing-face.png',
				userSettingUrl: '/pages/user/setting/setting',
				memberInfo: {
					face: '',
					nickname: "",
				}
			}
		},
		onLoad() {


		},
		onReady() {

		},
		onShow() {
			if (uni.getStorageSync('nowCourse')) {
				this.courseInfo = uni.getStorageSync('nowCourse')
			} else {
				uni.showModal({
					content: '请先选择一个课程',
					confirmColor: 'rgb(28,224,235)',
					complete: (r) => {
						uni.switchTab({
							url: '../index/index'
						})
					}
				})
			}
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/user/setting/setting');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		computed: {
			...mapState(['hasLogin', 'userData'])
		},
		methods: {

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			// 进入签到页面
			qiandao() {
				uni.navigateTo({
					url: '../qiandao/qiandao'
				})
			},
			// 跳转到课程资源列表页面
			ToMovie() {
				uni.navigateTo({
					url: '../ziyuan/ziyuan'
				})
			},
			// 进入课件页面
			ToPPT() {
				uni.navigateTo({
					url: '../kejian/PPT'
				})
			},
			// 进入所有学生页面
			listStudent() {
				uni.navigateTo({
					url: '../student/students'
				})
			},
			// 进入课程作业
			ToHomeWork() {
				uni.navigateTo({
					url: '../homeWork/index'
				})
			},
			// 修改个人信息
			editInfo() {
				uni.navigateTo({
					url: '/pages/user/register/register'
				})
			},

			// 退出登录
			logout() {
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
		}
	}
</script>
<style lang='scss'>
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		color: #F0F0F0;
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);


		}
	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 128upx;
			height: 128upx;
			/* border:5upx solid #fff; */
			border-radius: 50%;
			box-shadow: 0 0px 12px #848484;
		}

		.username {
			font-size: $font-lg + 4upx;
			color: $font-color-dark;
			margin-left: 20upx;
			font-weight: bold;
		}
	}

	.courseInfo {
		display: block;
		z-index: 2;
		color: #F0F0F0;
		position: relative;
		align-items: center;
		font-size: $font-lg;
		color: $font-color-dark;
	}


	.cover-container {
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20upx;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}

	.order-section {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		[class*="hxicon-"] {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #ffd21c;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			[class*="hxicon-"] {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
</style>
