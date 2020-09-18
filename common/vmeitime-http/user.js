import http from './interface'
const CryptoJS = require("crypto-js");

//用户登录
export const login = (data) => {
	return http.request({
		url: 'user/login',
		method: 'POST',
		data,
	})
}
// 学生签到
export const signInComplete = (data) => {
	return http.post('signIn/complete', data)
}
// 学生获取自己的所有签到记录
export const getSignLog = (data) => {
	return http.request({
		url:'signIn/list',
		method:'GET',
		data
	})
}
// 修改自己的姓名
export const updateName = (data) => {
	return http.request({
		url:'student/modifyName',
		method:'GET',
		data
	})
}


export default {
	login,
	signInComplete,
	getSignLog,
	updateName
}
