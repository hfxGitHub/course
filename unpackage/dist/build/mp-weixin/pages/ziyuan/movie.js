(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/ziyuan/movie"],{"22c9":function(o,e,n){"use strict";n.r(e);var t=n("a872"),i=n("8d72");for(var a in i)"default"!==a&&function(o){n.d(e,o,(function(){return i[o]}))}(a);n("3536");var r,c=n("f0c5"),s=Object(c["a"])(i["default"],t["b"],t["c"],!1,null,null,null,!1,t["a"],r);e["default"]=s.exports},3536:function(o,e,n){"use strict";var t=n("fee5"),i=n.n(t);i.a},"8d72":function(o,e,n){"use strict";n.r(e);var t=n("9f45"),i=n.n(t);for(var a in t)"default"!==a&&function(o){n.d(e,o,(function(){return t[o]}))}(a);e["default"]=i.a},"9f45":function(o,e,n){"use strict";(function(o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t=i(n("74f2"));function i(o){return o&&o.__esModule?o:{default:o}}var a={data:function(){return{pageTitle:"课程资源",movieInfo:{title:"",description:""},courseId:o.getStorageSync("nowCourse").courseId,userType:o.getStorageSync("userType"),haveMovie:!1,videoName:"",movieUrl:"",posterUrl:"",posterName:""}},onLoad:function(e){void 0!=e.courseMovieId?(this.haveMovie=!0,this.movieInfo=o.getStorageSync("nowMovie"),this.movieInfo.movieUrl=this.$baseURL+this.movieInfo.movieUrl,this.pageTitle=this.movieInfo.title):this.pageTitle="上传课程资源"},methods:{videoErrorCallback:function(e){o.showModal({content:e.target.errMsg,showCancel:!1})},uploadVideo:function(){var e=this;wx.chooseVideo({success:function(n){"chooseVideo:ok"==n.errMsg&&(e.movieUrl=n.tempFilePath,o.showModal({content:"选择成功",confirmColor:"rgb(28,224,235)",showCancel:!1}))},fail:function(e){console.log(e),o.showModal({content:"选择失败，请重新选择",confirmColor:"rgb(28,224,235)",showCancel:!1})}})},uploadVideoPoster:function(){var e=this;wx.chooseImage({count:1,success:function(n){"chooseImage:ok"==n.errMsg&&(e.posterUrl=n.tempFilePaths[0],o.showModal({content:"选择成功",confirmColor:"rgb(28,224,235)",showCancel:!1}))},fail:function(e){console.log(e),o.showModal({content:"选择失败，请重新选择",confirmColor:"rgb(28,224,235)",showCancel:!1})}})},uploadAll:function(){var e=this;""!=this.movieInfo.title&&""!=this.description&&""!=this.movieUrl&&""!=this.posterUrl?(o.showLoading({title:"~正在上传~",mask:!0}),wx.uploadFile({url:this.$baseURL+"movie/add?courseId="+this.courseId+"&title="+this.movieInfo.title+"&description="+this.movieInfo.description,filePath:this.movieUrl,name:"movie",header:{openId:o.getStorageSync("openId")},success:function(n){if(200==n.statusCode){var t=JSON.parse(n.data);0==t.code?o.uploadFile({url:e.$baseURL+"movie/addPoster?movieId="+t.data.movieId,filePath:e.posterUrl,name:"poster",header:{openId:o.getStorageSync("openId")},success:function(e){if(200==e.statusCode){var n=JSON.parse(e.data);0==n.code?(o.hideLoading(),o.showModal({content:"上传成功",confirmColor:"rgb(28,224,235)",showCancel:!1})):(o.hideLoading(),o.showModal({content:n.msg,confirmColor:"rgb(28,224,235)",showCancel:!1}))}else o.hideLoading(),o.showModal({content:params1.msg,confirmColor:"rgb(28,224,235)",showCancel:!1})},fail:function(e){console.log(e),o.hideLoading(),o.showModal({content:e.data.msg,confirmColor:"rgb(28,224,235)",showCancel:!1})}}):(o.hideLoading(),o.showModal({content:t.msg,confirmColor:"rgb(28,224,235)",showCancel:!1}))}else o.hideLoading(),o.showModal({content:n.data.msg,confirmColor:"rgb(28,224,235)",showCancel:!1})},fail:function(e){o.hideLoading(),o.showModal({content:e.data.msg,confirmColor:"rgb(28,224,235)",showCancel:!1})}})):o.showModal({content:"请输入完整数据，并选择相应文件再上传哦~",showCancel:!1,confirmColor:"rgb(28,224,235)"})},delMovie:function(){o.showModal({content:"确定要删除吗？",confirmColor:"#E04B28",cancelText:"取消",success:function(e){e.confirm&&(o.showLoading({title:"删除中~",mask:!0}),t.default.ziyuan.delMovie({movieId:o.getStorageSync("nowMovie").courseMovieId}).then((function(e){0==e.data.code?(o.hideLoading(),o.showModal({content:"删除成功！",confirmColor:"rgb(28,224,235)",showCancel:!1,complete:function(e){o.navigateBack()}})):(o.hideLoading(),o.showModal({content:e.data.msg,confirmColor:"rgb(28,224,235)"}))})))}})},download:function(){wx.downloadFile({url:this.$baseURL+"movie/downloadMovie?movieId="+o.getStorageSync("nowMovie").courseMovieId+"&openId="+o.getStorageSync("openId"),success:function(e){if(200==e.statusCode){var n=e.tempFilePath;wx.saveVideoToPhotosAlbum({filePath:n,success:function(e){o.showModal({content:"下载成功",confirmColor:"rgb(28,224,235)",showCancel:!1})},fail:function(e){o.showModal({content:e.errMsg,confirmColor:"rgb(28,224,235)"})}})}},fail:function(e){o.showModal({content:e.errMsg,confirmColor:"rgb(28,224,235)"})}})}}};e.default=a}).call(this,n("543d")["default"])},a132:function(o,e,n){"use strict";(function(o){n("a900");t(n("66fd"));var e=t(n("22c9"));function t(o){return o&&o.__esModule?o:{default:o}}o(e.default)}).call(this,n("543d")["createPage"])},a872:function(o,e,n){"use strict";var t={hxNavbar:function(){return n.e("components/hx-navbar/hx-navbar").then(n.bind(null,"dd27"))}},i=function(){var o=this,e=o.$createElement,n=(o._self._c,o.movieInfo.createTime.split("T")),t=o.movieInfo.createTime.split("T");o.$mp.data=Object.assign({},{$root:{g0:n,g1:t}})},a=[];n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return t}))},fee5:function(o,e,n){}},[["a132","common/runtime","common/vendor"]]]);