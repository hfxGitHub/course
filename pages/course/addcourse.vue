<template>
	<view class="content">
		<hx-navbar :title.sync="pageTitle" backTabbarUrl="/pages/index/index" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="list-box">
			<view class="row b-b">
				<text class="tit">课程码：</text>
				<input class="input" focus="true" type="text" v-model="courseCode" maxlength="6" placeholder="请输入课程码"
				 placeholder-class="placeholder" />
			</view>
			<view v-if="userType==1" class="row b-b">
				<text class="tit">课程名：</text>
				<input class="input" focus="true" type="text" v-model="title" maxlength="6" placeholder="请输入课程名"
				 placeholder-class="placeholder" />
			</view>
			<view v-if="userType==1" class="row b-b">
				<text class="tit">课程描述：</text>
				<input class="input" focus="true" type="text" v-model="description" maxlength="6" placeholder="请输入课程描述"
				 placeholder-class="placeholder" />
			</view>
			<view v-if="userType==1" class="row b-b">
				<text class="tit">授课教师：</text>
				<input class="input" focus="true" type="text" v-model="teacherName" maxlength="6" placeholder="请输入授课教师"
				 placeholder-class="placeholder" />
			</view>


		</view>
		<view v-if="userType==0" class="add-btn" @click="confirm">
			<text>加 入</text>
		</view>
		<view v-else class="add-btn" @click="confirm">
			<text>创 建</text>
		</view>
	</view>
</template>

<script>
	import api from '@/common/vmeitime-http/'
	export default {
		data() {
			return {
				courseCode: '',
				title: '',
				description: '',
				teacherName: '',
				pageTitle: '',
				userType: uni.getStorageSync('userType'),
			}
		},
		onLoad() {
			if (uni.getStorageSync('userType') == 0) {
				this.pageTitle = '加入班级';
			} else {
				this.pageTitle = '创建班级';
			}

		},
		methods: {
			//提交
			confirm() {
				if (this.userType == 0) {
					if (this.courseCode == '') {
						return;
					}
					uni.showLoading({
						mask:true,
					})
					api.course.joinCourse({
						code: this.courseCode
					}).then(res => {
						if (res.data.code == 0) {
							uni.hideLoading()
							uni.showModal({
								content: '成功加入该班级',
								confirmColor: 'rgb(28,224,235)',
								complete: (r) => {
									uni.navigateBack()
								}
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
				} else {
					if (this.courseCode == '' || this.title == '' || this.description == '' || this.teacherName == '') {
						return;
					}
					uni.showLoading({
						mask:true,
					})
					const sendData = {
						code: this.courseCode,
						courseName: this.title,
						description: this.description,
						teacherName: this.teacherName
					}
					api.course.addCourse(sendData).then(res => {
						if (res.data.code == 0) {
							uni.hideLoading()
							uni.showModal({
								confirmColor: 'rgb(28,224,235)',
								content: '成功创建班级，班级课程码为：' + this.courseCode,
								showCancel: false
							})
						} else {
							uni.hideLoading()
							uni.showModal({
								content: res.data.msg,
								confirmColor: 'rgb(28,224,235)',
								showCancel: false,
							})
						}
					})
				}

			},
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
		position: fixed;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		bottom: 15px;
		left: 15px;
		right: 15px;
		height: 45px;
		font-size: 16px;
		font-weight: bold;
		color: #333;
		background: linear-gradient(45deg, rgb(204, 255, 255), rgb(28, 224, 235));
	}
</style>
