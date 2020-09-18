<template>
	<view class="content">
		<hx-navbar title="考勤" backTabbarUrl="/pages/index/index" :backgroundColor="[241,241,241]"></hx-navbar>

		<view style="margin-top: 30rpx;">
			<view v-if="signInLogList && userType==1">
				<text class="row-right">未签到{{signInLogList.absenteeism}}人</text>
				<text class="row-right">已签到{{signInLogList.attendance}}人</text>
				<view class="row b-b" v-for="(data,i) in signInLogList.students" :key="i">
					<image :src="data.avatarUrl" style="width: 80rpx;height: 80rpx;" mode="aspectFill"></image>
					<text>{{data.nickname}} </text>
					<icon v-if="data.status==1" type="warn" size="26" />
					<icon v-else type="success" size="26" />
					<text class="row-right" v-if="data.status == 1">未签到</text>
					<text class="row-right" v-else>已签到</text>
					<button class="changeBtn" @click="changeSignStatus(data)">修改签到状态</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				signInId: '',
				signInLogList: [],
				userType: uni.getStorageSync('userType'),
				size: 10,
			}
		},
		onLoad(option) {
			if (option.signInId) {
				uni.showLoading({
					mask:true,
				})
				this.signInId = option.signInId;
				const sendData = {
					signInId: this.signInId,
				}
				api.course.signList(sendData).then(res => {
					if (res.data.code == 0) {
						this.signInLogList = res.data.data[0];
						uni.hideLoading()
					} else {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			} else {
				uni.navigateBack()
			}

		},
		methods: {
			// 获取该签到下详情
			getSignLog() {
				uni.showLoading()
				const sendData = {
					signInId: this.signInId,
				}
				api.course.signList(sendData).then(res => {
					if (res.data.code == 0) {
						this.signInLogList = res.data.data[0];
						uni.hideLoading()
					} else {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			},
			changeSignStatus(data) {
				uni.showLoading({
					mask:true,
				})
				const sendData = {
					studentSignInId: data.studentSignInId
				}
				api.course.changeSignInStatus(sendData).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading()
						this.getSignLog()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
						})
					} else {
						uni.hideLoading()
						this.getSignLog()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			}

		}
	}
</script>

<style lang="scss">
	.changeBtn {
		font-size: 0.8em;
		background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
		position: relative;
		right: 1rpx;
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

	.row-right {
		text-align: right;
		margin-left: 80rpx;
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
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
</style>
