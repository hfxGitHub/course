import http from './interface'
const CryptoJS = require("crypto-js");

// 获取课程下所有课程资源
export const getAllMovie = (data) => {
	return http.post('movie/list', data)
}
// 删除课程视频
export const delMovie = (data) => {
	return http.request({
		url:'movie/del',
		method:'GET',
		data
	})
}


export default{
	getAllMovie,
	delMovie
}