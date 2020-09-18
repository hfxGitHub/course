import http from './interface'
const CryptoJS = require("crypto-js");

// 获取所有PPT列表
export const listPPT = (data) => {
	return http.post('ppt/list',data)
}
// 删除PPT课件
export const delPPT = (data) => {
	return http.request({
		url:'ppt/del',
		method:'GET',
		data
	})
}



export default{
	listPPT,
	delPPT
}