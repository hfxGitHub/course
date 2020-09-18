import http from './interface'
const CryptoJS = require("crypto-js");


// 学生获取作业列表
export const listHomeWork = (data) => {
	return http.request({
		url: 'topic/list',
		method: 'GET',
		data
	})
}
// 获取作业详情
export const getTopic = (data) => {
	return http.request({
		url: 'topic/getById',
		method: 'GET',
		data
	})
}
// 学生提交作业答案
export const submitTopic = (data) => {
	return http.post('student/topic/work/add', data)
}
// 老师删除作业
export const delWork = (data) => {
	return http.request({
		url: 'topic/del',
		method: 'GET',
		data
	})
}
// 老师上传新的作业
export const addWork = (data) => {
	return http.request({
		url:'topic/add',
		method:'POST',
		data
	})
}
// export const addWork = (data) => {
// 	return http.post('topic/add', data)
// }

export default {
	listHomeWork,
	getTopic,
	submitTopic,
	delWork,
	addWork
}
