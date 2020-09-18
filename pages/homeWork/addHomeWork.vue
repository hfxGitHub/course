<template>
	<view class="register">
		<hx-navbar backTabbarUrl="/pages/homeWork/index" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="content" style="margin-bottom: 50rpx;">

			<view class="main">
				<wInput v-model="topicStem" type="text" maxlength="6" placeholder="请输入题目"></wInput>
			</view>
			<view class="main">
				<wInput v-model="options[0].contents" type="text" placeholder="请输入答案A"></wInput>
			</view>
			<view class="main">
				<wInput v-model="options[1].contents" type="text" placeholder="请输入答案B"></wInput>
			</view>
			<radio-group @change="radioChange" style="padding: 10rpx 70rpx 10rpx 70rpx;">
				<h1 style="text-align: center;">请选择正确答案</h1>
				<label class="uni-list-cell uni-list-cell-pd" style="display: flex;">
					<view>
						<radio :value="0" style="transform:scale(1.3);color: #007AFF;" />{{options[0].contents}}
					</view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd" style="display: flex;">
					<view>
						<radio :value="1" style="transform:scale(1.3);color: #007AFF;" />{{options[1].contents}}
					</view>
				</label>
			</radio-group>
			<view class="main">
				<wInput v-model="analysis" type="text" maxlength="6" placeholder="请输入答案解析"></wInput>
			</view>
			<h1 style="text-align: center;margin: 30rpx 0 30rpx 0;">请选择截止日期</h1>
			<picker-view :value="value" :indicator-style="indicatorStyle" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in hoursList" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in minutesList" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>


			<wButton text="提 交" :rotate="isRotate" @click.native="startReg()"></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import hxNavbar from '@/components/hx-navbar/hx-navbar.vue'; //navbar
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	const CryptoJS = require("crypto-js");
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				topicStem: '',
				analysis: '',
				options: [{
						contents: '',
					},
					{
						contents: '',
					}
				],
				realSolution: '',
				courseId: uni.getStorageSync('nowCourse').courseId,
				years: '',
				year: '',
				months: '',
				month: '',
				days: '',
				day: '',
				hoursList: [],
				minutesList: [],
				hour: '',
				minutes: '',
				value: [],
				chooseDate: '',
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				isRotate: false, //是否加载旋转
			}
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
		},
		onLoad() {
			this.isRotate = false;
			this.getDate()
		},
		methods: {
			// 获取时间用于选择截止日期
			getDate() {
				const date = new Date()
				const years = []
				const year = date.getFullYear()
				const months = []
				const month = date.getMonth() + 1
				const days = []
				const day = date.getDate()
				for (let i = 1; i <= 12; i++) {
					months.push(i)
				}
				for (let i = 1; i <= 31; i++) {
					days.push(i)
				}
				this.years = years;
				this.year = year;
				this.months = months;
				this.month = month;
				this.days = days;
				this.day = day;
				this.value = [month - 1, day - 1, 13, 30];
				for (let i = 1; i < 25; i++) {
					this.hoursList.push(i)
				}
				for (let i = 1; i < 61; i++) {
					this.minutesList.push(i)
				}
				console.log(this.value)
			},
			// 当选择日期时
			bindChange(e) {
				const val = e.detail.value
				// this.year = this.years[val[0]]
				this.month = this.months[val[0]]
				this.day = this.days[val[1]]
				this.hour = this.hoursList[val[2]]
				this.minutes = this.minutesList[val[3]]
				if (this.month < 10) {
					this.month = '0' + this.month;
				}
				if (this.day < 10) {
					this.day = '0' + this.day;
				}
				if (this.hour < 10) {
					this.hour = '0' + this.hour;
				}
				if (this.minutes < 10) {
					this.minutes = '0' + this.minutes;
				}
				this.chooseDate = this.year + '-' + this.month + '-' + this.day + ' ' + this.hour + ':' + this.minutes + ':00';
				console.log(this.chooseDate)
			},
			startReg() {
				if (this.topicStem == '' || this.analysis == '' || this.options[0].contents == '' || this.options[1].contents == '' ||
					this.realSolution == '' || this.chooseDate == '') {
					uni.showModal({
						content: '请输入完整数据再提交哦~',
						confirmColor: 'rgb(28,224,235)',
						showCancel: false,
					})
					return;
				}
				uni.showLoading({
					mask:true,
					title: '上传中~',
				})
				let sendData = {
					topicStem: this.topicStem,
					analysis: this.analysis,
					courseId: this.courseId,
					options: this.options,
					closeTime: this.chooseDate,
					realSolution: this.realSolution
				}
				sendData = JSON.stringify(sendData)
				api.homeWork.addWork(sendData).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading()
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
							showCancel: false,
							complete: (r) => {
								uni.navigateBack()
							}
						})
					} else {
						uni.showModal({
							content: res.data.msg,
							confirmColor: 'rgb(28,224,235)',
						})
					}
				})
			},
			radioChange(evt) {
				this.realSolution = evt.target.value;
			},

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* margin-top: 128upx; */
	}

	/* 设置picker-view的样式 */
	uni-picker-view {
		display: block;
	}

	uni-picker-view .uni-picker-view-wrapper {
		display: flex;
		position: relative;
		overflow: hidden;
		height: 100%;
		background-color: white;
	}

	uni-picker-view[hidden] {
		display: none;
	}

	picker-view {
		width: 100%;
		height: 600upx;
		margin-top: 20upx;
	}

	picker-view .item {
		line-height: 100upx;
		text-align: center;
	}


	/* 头部 logo */
	.header {
		width: 161upx;
		height: 161upx;
		box-shadow: 0upx 0upx 60upx 0upx rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		background-color: #000000;
		margin-top: 128upx;
		margin-bottom: 72upx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 161upx;
		height: 161upx;
		border-radius: 50%;
	}

	/* 主体 */
	.main {
		display: flex;
		flex-direction: column;
		padding-left: 70upx;
		padding-right: 70upx;
	}


	/* 底部 */
	.footer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 64upx;
		color: rgba(0, 0, 0, 0.7);
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}

	.footer text {
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
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
