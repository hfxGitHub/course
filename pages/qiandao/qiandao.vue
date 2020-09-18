<template>
	<view class="content">
		<hx-navbar title="考勤" backTabbarUrl="/pages/index/index" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="list-box">
			<view v-if="userType==0" class="row b-b">
				<text class="tit">签到码：</text>
				<input class="input" focus="true" type="text" v-model="signInCode" maxlength="6" placeholder="请输入签到码签到"
				 placeholder-class="placeholder" />
			</view>
			<view v-else class="row b-b">
				<text class="tit">签到时间（秒）：</text>
				<input class="input" focus="true" type="text" v-model="expire" maxlength="6" placeholder="请输入签到时间,单位秒"
				 placeholder-class="placeholder" />
			</view>

		</view>
		<view v-if="userType==0" class="add-btn" @click="confirm">
			<text>签 到</text>
		</view>
		<view v-else class="add-btn" @click="addQianDao">
			<text>创建签到</text>
		</view>

		<view style="margin-top: 30rpx;">
			<view v-if="signInLogList && userType==0">
				<view class="row b-b" v-for="(data,i) in signInLogList" :key="i">
					<icon v-if="data.status == 1" type="warn" size="26" />
					<icon v-else type="success" size="26" />
					<!-- <icon v-else type="warn" size="26" /> -->
					<text>签到时间：{{data.createTime.split('T')[0] + '  ' +data.createTime.split('T')[1]}} </text>
					<text class="row-right" v-if="data.status == 1">未签到</text>
					<text class="row-right" v-else>已签到</text>
					<!-- <text class="row-right" v-else>未签到</text> -->
				</view>
			</view>
			<view v-if="signInLogList && userType==1">
				<view class="row b-b" v-for="(data,i) in signInLogList" :key="i" @click="toSignDetail(data)">
					<icon type="success" size="26" @click="toSignDetail(data)" />
					<text @click="toSignDetail(data)">签到创建时间：{{data.createTime.split('T')[0] + '  ' +data.createTime.split('T')[1]}}</text>
					<text class="row-right" @click="toSignDetail(data)">未签到{{data.absenteeism}}人</text>
					<text class="row-right" @click="toSignDetail(data)">已签到{{data.attendance}}人</text>
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
				signInCode: '',
				signInLogList: [],
				expire: '',
				userType: uni.getStorageSync('userType'),
				size: 10,
			}
		},
		onLoad() {
			uni.showLoading({
				mask:true,
			})
			const sendData = {
				size: this.size,
				courseId: uni.getStorageSync('nowCourse').courseId,
			}
			api.user.getSignLog(sendData).then(res => {
				if (res.data.code == 0) {
					this.size = res.data.data.total;
					this.getSignLog()
				} else {
					uni.hideLoading()
					uni.showModal({
						content: res.data.msg,
						confirmColor: 'rgb(28,224,235)',
					})
				}
			})
		},
		methods: {
			// 获取在该课程下自己的所有的签到记录
			getSignLog() {
				const sendData = {
					courseId: uni.getStorageSync('nowCourse').courseId,
					size: this.size
				}
				api.user.getSignLog(sendData).then(res => {
					if (res.data.code == 0) {
						this.signInLogList = res.data.data.records;
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
			// 老师进入签到详细记录
			toSignDetail(data) {
				if (this.userType == 0) {
					return;
				}
				uni.navigateTo({
					url: './signDetail?signInId=' + data.signInId
				})
			},
			//提交
			confirm() {
				if (this.signInCode == '') {
					return;
				}
				uni.showLoading({
					mask:true,
				})
				const sendData = {
					courseId: uni.getStorageSync('nowCourse').courseId,
					signInChars: this.signInCode
				}
				api.user.signInComplete(sendData).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							complete: (r) => {
								this.getSignLog()
							}
						})
					} else {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							complete: (r) => {
								this.getSignLog()
							}
						})
					}
				})
			},

			// 老师创建签到任务
			addQianDao() {
				if (this.expire == '') {
					return;
				}
				uni.showLoading({
					mask:true,
				})
				const sendData = {
					courseId: uni.getStorageSync('nowCourse').courseId,
					expire: this.expire
				}
				api.course.startSignIn(sendData).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading()
						uni.showModal({
							content: '总人数：' + res.data.data.amount + '\n签到码：' + res.data.data.signInChars,
							title: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false
						})
					} else {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
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
