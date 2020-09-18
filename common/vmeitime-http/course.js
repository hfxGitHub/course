import http from './interface'
const CryptoJS = require("crypto-js");

// 获取我加入的所有课程
export const myJoinAll = () => {
	return http.request({
		url: 'course/myJoin/get',
		method: 'GET',
	})
}
// 老师获取自己创建的所有课程
export const myCreateAll = () => {
	return http.request({
		url: 'course/myCreate/get',
		method: 'GET',
	})
}
// 根据课程码加入班级
export const joinCourse = (data) => {
	return http.post('course/join', data)
}
// 老师新建课程
export const addCourse = (data) => {
	return http.post('course/add', data)
}
// 获取课程里所有学生的名单
export const listStudent = (data) => {
	return http.request({
		url: 'student/list',
		method: 'GET',
		data
	})
}
// 老师发起签到
export const startSignIn = (data) => {
	return http.post('signIn/start', data)
}
// 老师获取签到的签到详情
export const signList = (data) => {
	return http.request({
		url: 'signIn/get',
		method: 'GET',
		data
	})
}
// 老师修改学生签到状态
export const changeSignInStatus = (data) => {
	return http.request({
		url:'signIn/updateStatus',
		method:'GET',
		data
	})
}





export default {
	myJoinAll,
	joinCourse,
	listStudent,
	addCourse,
	myCreateAll,
	startSignIn,
	signList,
	changeSignInStatus
}
