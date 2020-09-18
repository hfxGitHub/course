<template>
	<view>
		<hx-navbar backTabbarUrl="./index" title="班级作业"></hx-navbar>
		<view style="width: 100%;">
			<view style="padding: 80rpx;">
				<text style="display:block;font-size: 40rpx;margin-bottom: 50rpx;">{{topicData.topicStem}}</text>

				<view class="uni-list" v-if="userType == 0">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" style="display: flex;" v-for="(item, index) in topicData.options"
						 :key="index">
							<view>
								<radio :value="index" :checked="index === current" />{{item.contents}}
							</view>
						</label>
					</radio-group>
				</view>

				<view class="disContent" v-else-if="userType == 1">
					<text class="disItem">正确答案：{{topicData.realSolution == 0?'A':'B'}}</text>
					<text class="disItem">学生总数：{{topicData.studentCount}}</text>
					<text class="disItem">提交人数：{{topicData.submitCount}}</text>
					<text class="disItem">创建时间：{{topicData.createTime}}</text>
					<text class="disItem">截止时间：{{topicData.closeTime}}</text>
				</view>

				<view v-if="userType == 1">
					<view class=" item-box" v-for="(student,i) in topicData.students" :key="i">
						<view class="container top-box">
							<view class="right">
								<icon v-if="student.status == null" type="warn" size="26" />
								<icon v-else type="success" size="26" />
								<text class="tit">{{student.studentName}}</text>
								<text class="tit" style="color:rgb(28,224,235);" v-if="student.selectIndex == topicData.realSolution && student.status != null">选择答案：{{student.selectIndex==0?'A':'B'}}</text>
								<text class="tit" style="color:#E04B28;" v-else-if="student.selectIndex != topicData.realSolution && student.status != null">选择答案：{{student.selectIndex==0?'A':'B'}}</text>
								<view class="row justify-content">
									<view class="row-right" v-if="student.status != null">
										<i class="hxicon-countdownfill"></i>
										<text>提交时间：{{student.submitTime}}</text>
									</view>
									<view class="row-right" style="color: #E54D42;" v-else-if="student.status == null">
										<i class="hxicon-countdownfill"></i>
										<text>提交时间：还未提交</text>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>

		<view class="add-btn" @click="confirm" v-if="subStatus != 0 && userType == 0">
			<text>提交答案</text>
		</view>
		<view v-else-if="userType == 0 && subStatus == 0" style="text-align: center;">
			<icon type="success" size="26" />
			<text>已提交</text>
		</view>

		<view style="padding: 80rpx;" v-if="subStatus==0 && userType == 0">
			<h2 style="text-align: center;font-size: 30rpx;">答案解析</h2>
			<text>{{topicData.analysis == ''?'暂无答案解析':topicData.analysis}}</text>
		</view>
	</view>
</template>

<script>
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				topicData: {},
				current: '',
				myChoose: '',
				subStatus: null,
				userType: uni.getStorageSync('userType')
			}
		},
		onLoad(option) {
			if (option) {
				this.getTopicData(option.topicId)
				this.subStatus = option.subStatus
				console.log(this.subStatus)
			} else {
				uni.navigateBack()
			}
		},
		methods: {
			getTopicData(topicId) {
				const sendData = {
					topicId: topicId
				}
				api.homeWork.getTopic(sendData).then(res => {
					if (res.data.code == 0) {
						this.topicData = res.data.data;
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			},
			radioChange: function(evt) {
				this.myChoose = evt.target.value;
			},
			confirm() {
				if (this.myChoose == '') {
					return;
				}
				uni.showLoading({
					mask:true,
				})
				const sendData = {
					topicId: this.topicData.topicId,
					selectIndex: this.myChoose,
				}
				api.homeWork.submitTopic(sendData).then(res => {
					if (res.data.code == 0) {
						this.subStatus = 0
						this.getTopicData(this.topicData.topicId)
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
						})
					} else {
						this.getTopicData(this.topicData.topicId)
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
						})
					}
				}).catch(err => {
					uni.showModal({
						content: err.data.msg,
						confirmColor: 'rgb(28,224,235)',
					})
					uni.hideLoading()
				})
			}
		}

	}
</script>

<style lang="scss">
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

	.disContent {
		margin-bottom: 60rpx;
	}

	.disItem {
		display: block;
		font-size: 36rpx;
		line-height: 36rpx;
		align-items: center;
	}

	.container {
		height: 200rpx;
		border-bottom: 1px solid rgb(28, 224, 235);
		padding: auto 0 auto 0;
	}


	/* 列表 */
	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list-cell-hover {
		background-color: #eee;
	}

	.uni-list-cell-pd {
		padding: 22rpx 30rpx;
	}

	.uni-list-cell-left {
		white-space: nowrap;
		font-size: 28rpx;
		padding: 0 30rpx;
	}

	.uni-list-cell-db,
	.uni-list-cell-right {
		flex: 1;
	}

	.uni-list-cell::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 30rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list .uni-list-cell:last-child::after {
		height: 0rpx;
	}

	.uni-list-cell-last.uni-list-cell::after {
		height: 0rpx;
	}

	.uni-list-cell-divider {
		position: relative;
		display: flex;
		color: #999;
		background-color: #f7f7f7;
		padding: 15rpx 20rpx;
	}

	.uni-list-cell-divider::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list-cell-divider::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list-cell-navigate {
		font-size: 30rpx;
		padding: 22rpx 30rpx;
		line-height: 48rpx;
		position: relative;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		flex: 1;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list-cell-navigate {
		padding-right: 36rpx;
	}

	.uni-navigate-badge {
		padding-right: 50rpx;
	}

	.uni-list-cell-navigate.uni-navigate-right:after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	.uni-list-cell-navigate.uni-navigate-bottom:after {
		font-family: uniicons;
		content: '\e581';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	.uni-list-cell-navigate.uni-navigate-bottom.uni-active::after {
		font-family: uniicons;
		content: '\e580';
		position: absolute;
		right: 24rpx;
		top: 50%;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
</style>
