import api from './vmeitime-http/'
/**
 * 检查登录态是否过期
 */
function checkSession() {
	return new Promise((resolve, reject) => {
		wx.checkSession({
			success(res) {
				//session_key 未过期，并且在本生命周期一直有效
				let code = uni.getStorageSync('code') || '';
				// TODO:code==‘’
				resolve(code);
			},
			fail: async (err) => {
				// session_key 已经失效，需要重新执行登录流程
				let code = await onLogin();
				reject(code);
			}
		})
	})
}

/**
 * 调用接口获取登录凭证（code）
 */
function onLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: function(res) {
				if (res.errMsg == "login:ok") {
					uni.setStorageSync('code', res.code);
					resolve(res.code);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(res);
			}
		});
	})
}

module.exports = {
	checkSession,
	onLogin
};
