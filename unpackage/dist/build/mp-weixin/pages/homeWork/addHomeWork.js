(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/homeWork/addHomeWork","components/hx-navbar/hx-navbar"],{1195:function(t,o,n){"use strict";n.r(o);var e=n("1337"),r=n.n(e);for(var a in e)"default"!==a&&function(t){n.d(o,t,(function(){return e[t]}))}(a);o["default"]=r.a},1337:function(t,o,n){"use strict";(function(t){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;r(n("dd27"));var e=r(n("74f2"));function r(t){return t&&t.__esModule?t:{default:t}}var a=function(){n.e("components/watch-login/watch-input").then(function(){return resolve(n("5059"))}.bind(null,n)).catch(n.oe)},i=function(){n.e("components/watch-login/watch-button").then(function(){return resolve(n("681c"))}.bind(null,n)).catch(n.oe)},l=(n("c5d0"),{data:function(){return{topicStem:"",analysis:"",options:[{contents:""},{contents:""}],realSolution:"",courseId:t.getStorageSync("nowCourse").courseId,years:"",year:"",months:"",month:"",days:"",day:"",hoursList:[],minutesList:[],hour:"",minutes:"",value:[],chooseDate:"",indicatorStyle:"height: ".concat(Math.round(t.getSystemInfoSync().screenWidth/7.5),"px;"),isRotate:!1}},components:{wInput:a,wButton:i},mounted:function(){this},onLoad:function(){this.isRotate=!1,this.getDate()},methods:{getDate:function(){for(var t=new Date,o=[],n=t.getFullYear(),e=[],r=t.getMonth()+1,a=[],i=t.getDate(),l=1;l<=12;l++)e.push(l);for(var s=1;s<=31;s++)a.push(s);this.years=o,this.year=n,this.months=e,this.month=r,this.days=a,this.day=i,this.value=[r-1,i-1,13,30];for(var u=1;u<25;u++)this.hoursList.push(u);for(var c=1;c<61;c++)this.minutesList.push(c);console.log(this.value)},bindChange:function(t){var o=t.detail.value;this.month=this.months[o[0]],this.day=this.days[o[1]],this.hour=this.hoursList[o[2]],this.minutes=this.minutesList[o[3]],this.month<10&&(this.month="0"+this.month),this.day<10&&(this.day="0"+this.day),this.hour<10&&(this.hour="0"+this.hour),this.minutes<10&&(this.minutes="0"+this.minutes),this.chooseDate=this.year+"-"+this.month+"-"+this.day+" "+this.hour+":"+this.minutes+":00",console.log(this.chooseDate)},startReg:function(){if(""!=this.topicStem&&""!=this.analysis&&""!=this.options[0].contents&&""!=this.options[1].contents&&""!=this.realSolution&&""!=this.chooseDate){t.showLoading({mask:!0,title:"上传中~"});var o={topicStem:this.topicStem,analysis:this.analysis,courseId:this.courseId,options:this.options,closeTime:this.chooseDate,realSolution:this.realSolution};o=JSON.stringify(o),e.default.homeWork.addWork(o).then((function(o){0==o.data.code?(t.hideLoading(),t.showModal({content:o.data.msg,confirmColor:"rgb(28,224,235)",showCancel:!1,complete:function(o){t.navigateBack()}})):t.showModal({content:o.data.msg,confirmColor:"rgb(28,224,235)"})}))}else t.showModal({content:"请输入完整数据再提交哦~",confirmColor:"rgb(28,224,235)",showCancel:!1})},radioChange:function(t){this.realSolution=t.target.value}}});o.default=l}).call(this,n("543d")["default"])},"1cae":function(t,o,n){"use strict";n.r(o);var e=n("e84b"),r=n("1195");for(var a in r)"default"!==a&&function(t){n.d(o,t,(function(){return r[t]}))}(a);n("82aa");var i,l=n("f0c5"),s=Object(l["a"])(r["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],i);o["default"]=s.exports},3472:function(t,o,n){"use strict";(function(t){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var e=function(){Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(function(){return resolve(n("7285"))}.bind(null,n)).catch(n.oe)},r=t.getSystemInfoSync().statusBarHeight+"px",a={name:"hx-navbar",components:{uniIcons:e},data:function(){return{statusBarHeight:r,transparentValue:0,navTransparentFixedFontColor:"#fff",statusBarFontColorInfo:[],backgroundColorRgba:"rgb(204,255,255)",backgroundColorRgb:"rgb(204,255,255)",colorInfo:"#000000",placeholder:!1,colorContainer:null,slotSlidiSwitch:0}},props:{height:{type:String,default:"44px"},barPlaceholder:{type:String,default:"auto"},back:{type:[Boolean,String],default:!0},title:{type:String,default:""},leftSlot:{type:[Boolean,String],default:!0},rightSlot:{type:[Boolean,String],default:!0},leftText:{type:String,default:""},rightText:{type:String,default:""},leftIcon:{type:String,default:""},rightIcon:{type:String,default:""},fixed:{type:[Boolean,String],default:!1},color:{type:[Array,String],default:"#000000"},backgroundColor:{type:Array,default:function(){return new Array([255,255,255],[255,255,255])}},backgroundColorLinearDeg:{type:String,default:"45"},backgroundImg:{type:String,default:""},transparent:{type:String,default:"show"},statusBarFontColor:{type:[Array,String],default:function(){return new Array("#000000","#000000")}},statusBar:{type:[Boolean,String],default:!0},statusBarBackground:{type:String,default:""},shadow:{type:[String,Boolean],default:!1},border:{type:[String,Boolean],default:!1},defaultBackUrl:{type:String,default:""},backTabbarUrl:{type:String,default:"/pages/index/index"},leftSlidiSwitch:{type:[Boolean,String],default:!1},centerSlidiSwitch:{type:[Boolean,String],default:!1},rightSlidiSwitch:{type:[Boolean,String],default:!1},pageScroll:{type:Object,default:function(){return{}}}},created:function(){var t=this;switch(t.barPlaceholder){case"show":t.placeholder=!0;break;case"hidden":t.placeholder=!1;break;case"auto":t.fixed&&(t.placeholder=!0);break}switch(t.setStatusBarFontColor(),t.colorContainer="object"==typeof t.color?t.color:[t.color,t.color],t.colorInfo=t.colorContainer[0],t.transparent){case"show":t.transparentValue=1;break;case"hidden":t.transparentValue=0;break;case"auto":t.setTVAuto(t.pageScroll);break}t.setBgColor(),t.fixed&&(t.leftSlidiSwitch||t.centerSlidiSwitch||t.rightSlidiSwitch)&&t.doScroll(t.pageScroll)},watch:{pageScroll:function(t,o){var n=this;switch(n.transparent){case"show":n.transparentValue=1;break;case"hidden":n.transparentValue=0;break;case"auto":this.setTVAuto(t);break}n.fixed&&(n.leftSlidiSwitch||n.centerSlidiSwitch||n.rightSlidiSwitch)&&n.doScroll(t)},transparentValue:function(o,n){var e=this;n>.8?t.setNavigationBarColor({frontColor:e.statusBarFontColorInfo[1],backgroundColor:e.backgroundColorRgb}):n<.2&&t.setNavigationBarColor({frontColor:e.statusBarFontColorInfo[0],backgroundColor:e.backgroundColorRgb})},backgroundColor:function(t,o){var n=this;n.setBgColor()},color:function(t,o){}},methods:{onClickLeft:function(){this.back?getCurrentPages().length>1?t.navigateBack():this.defaultBackUrl?t.redirectTo({url:this.defaultBackUrl}):this.backTabbarUrl&&t.reLaunch({url:this.backTabbarUrl}):this.$emit("click-left")},onClickRight:function(){this.$emit("click-right")},doScroll:function(t){var o=this;o.$emit("scroll",t),t.scrollTop>100?o.slotSlidiSwitch=1:o.slotSlidiSwitch=0},setTVAuto:function(t){var o=this;o.$emit("scroll",t),t.scrollTop>100?(o.transparentValue=1,o.colorInfo=o.colorContainer[1]):(o.transparentValue=t.scrollTop/100,o.colorInfo=o.colorContainer[0]),o.setBgColor()},setBgColor:function(){var t=this;if("object"==typeof t.backgroundColor[0]){var o=t.backgroundColor.length;if(o>=2){var n="linear-gradient("+t.backgroundColorLinearDeg+"deg,",e=null;for(var r in t.backgroundColor)e=t.backgroundColor[r],n+="rgba("+e[0]+","+e[1]+","+e[2]+","+t.transparentValue+")",o!=1*r+1&&(n+=",");n+=")",t.backgroundColorRgba=n}}else{var a=t.backgroundColor[0]+","+t.backgroundColor[1]+","+t.backgroundColor[2];t.backgroundColorRgb="rgb("+a+")",t.backgroundColorRgba="rgba("+a+","+t.transparentValue+")"}},setStatusBarFontColor:function(){var o=this;"string"==typeof o.statusBarFontColor?o.statusBarFontColorInfo=[o.statusBarFontColor,o.statusBarFontColor]:"object"==typeof o.statusBarFontColor&&(1==o.statusBarFontColor.length?o.statusBarFontColorInfo=[o.statusBarFontColor[0],o.statusBarFontColor[0]]:o.statusBarFontColor.length>=2&&(o.statusBarFontColorInfo=[o.statusBarFontColor[0],o.statusBarFontColor[1]])),t.setNavigationBarColor({frontColor:o.statusBarFontColorInfo[0],backgroundColor:o.backgroundColorRgb})}},destroyed:function(){}};o.default=a}).call(this,n("543d")["default"])},"4a27":function(t,o,n){},6011:function(t,o,n){"use strict";n.r(o);var e=n("3472"),r=n.n(e);for(var a in e)"default"!==a&&function(t){n.d(o,t,(function(){return e[t]}))}(a);o["default"]=r.a},"730d":function(t,o,n){},7673:function(t,o,n){"use strict";var e=n("730d"),r=n.n(e);r.a},"82aa":function(t,o,n){"use strict";var e=n("4a27"),r=n.n(e);r.a},"87a8":function(t,o,n){"use strict";var e={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(n.bind(null,"7285"))}},r=function(){var t=this,o=t.$createElement;t._self._c},a=[];n.d(o,"b",(function(){return r})),n.d(o,"c",(function(){return a})),n.d(o,"a",(function(){return e}))},dd27:function(t,o,n){"use strict";n.r(o);var e=n("87a8"),r=n("6011");for(var a in r)"default"!==a&&function(t){n.d(o,t,(function(){return r[t]}))}(a);n("7673");var i,l=n("f0c5"),s=Object(l["a"])(r["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],i);o["default"]=s.exports},ddc2:function(t,o,n){"use strict";(function(t){n("a900");e(n("66fd"));var o=e(n("1cae"));function e(t){return t&&t.__esModule?t:{default:t}}t(o.default)}).call(this,n("543d")["createPage"])},e84b:function(t,o,n){"use strict";var e={hxNavbar:function(){return Promise.resolve().then(n.bind(null,"dd27"))}},r=function(){var t=this,o=t.$createElement;t._self._c},a=[];n.d(o,"b",(function(){return r})),n.d(o,"c",(function(){return a})),n.d(o,"a",(function(){return e}))}},[["ddc2","common/runtime","common/vendor"]]]);