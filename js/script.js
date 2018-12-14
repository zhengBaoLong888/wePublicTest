var getpinpaiID;
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i) == "micromessenger") {
	function getQueryPinpaiId(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for(var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable) {
				return pair[1];
			}
		}
		return(false);
	}
	getpinpaiID = getQueryPinpaiId("pinpaiID");
} else {
	getpinpaiID = 1;
}

function getDate() {
	//获取当前时间
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var dataNum = myDate.getDate();
	var hours = myDate.getHours();
	var minutes = myDate.getMinutes();
	var seconds = myDate.getSeconds();
	var colData = year + "-" + month + "-" + dataNum + " " + hours + ":" + minutes + ":" + seconds;
	var dateObj = colData;
	return dateObj;
}
var dataxAx = {};
//购物车基础数组
function getGoodsArray(_jl1_send, _jl1_name, _jl2_send, _kw1_send, _kw1_name, _ismoneyoff, _isbargain, _ispresented, _isdiscount, _proId_val, _proName) {
	var makes = [];
	var mats = [{
		proMatId: _jl1_send,
		matsName: _jl1_name,
		matShopPirce: _jl2_send
	}];
	var tastes = [{
		tasteId: _kw1_send,
		tastesName: _kw1_name
	}];

	dataxAx = {
		proId: _proId_val,
		num: 1,
		proType: 1,
		goodsProName: _proName,
		isMj: _ismoneyoff,
		isTj: _isbargain,
		isMz: _ispresented,
		isDz: _isdiscount,
		makes,
		mats,
		tastes
	};
	if(dataxAx.num == '') {

	} else {
		var dataTol = JSON.parse(localStorage.getItem('dataList'));
		dataTol.push(dataxAx);
		localStorage.setItem("dataList", JSON.stringify(dataTol));
	}
};
//计算总数量
function getShopCatNum() {
	var numCould = 0;
	var getArray = JSON.parse(localStorage.getItem("dataList"));
	console.log(getArray);
	if(getArray == null || getArray == '') {
		$('#count').html('0');
	} else {
		for(iq in getArray) {
			numCould += getArray[iq].num;
		}
		$('#count').html(numCould);
	}
}

//获取单品口味	
var shoujia = 0;

function getTask(_proIdVal) {
	$.ajax({
		type: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": Authorization
		},
		url: base + "sale_inte/product/tasteChoose.action",
		data: {
			"pinpaiID": getpinpaiID,
			"proId": _proIdVal
		},
		ContentType: "application/json",
		success: function(result) {
			var cpList = JSON.parse(localStorage.getItem("products"));
			console.log(result);
			var ge1 = '';
			var tasteHtml2 = '';
			var kw1 = '';
			var kw2 = '';

			//规格
			for(gg in cpList) {
				if(cpList[gg].proId == _proIdVal) {
					var scaleIdVar = cpList[gg].scaleId;
					for(gg2 in result.data.scales) {
						if(result.data.scales[gg2].scaleId == scaleIdVar) {
							ge1 += "<li style='background-color:#ff5d00 !important' data-name='" + result.data.scales[gg2].scaName + "' data-id='" + result.data.scales[gg2].scaleId + "'>" + result.data.scales[gg2].scaName + "</li>"
							$('.zf1').html(ge1);
						}
					}
				}
			}

			//加料
			if(result.data.mats.length == 0 || result.data.mats.ingredientDosage == 0 || result.data.mats.ingredientDosage == null) {
				$('.row2_type2').html("<div class='inform'>此商品暂无加料</div>");
			} else {
				for(s in result.data.mats) {
					tasteHtml2 += "<li data-name='" + result.data.mats[s].matName + "' data-id='" + result.data.mats[s].proMatId + "' data-ingredientPrice='" + result.data.mats[s].ingredientPrice + "'>" + "<span class='defaultTaste'>" + result.data.mats[s].matName + "</span>" + "<span class='jiage'>+" + result.data.mats[s].ingredientPrice + "元</span>" + "</li>"
				}
				$('.row2_type2').html(tasteHtml2);
			}

			//口味
			for(kw in cpList) {
				if(cpList[kw].proId == _proIdVal) {
					if(cpList[kw].tastes.length == 0) {
						$('.kw1').html("<div class='inform'>此商品暂无口味</div>");
					} else {
						var tasteGroupId = cpList[kw].tastes[0].tasteGroupId;
						for(kwTwo in result.data.tastes) {
							if(result.data.tastes[kwTwo].groupId == tasteGroupId) {
								kw1 += "<li data-name='" + result.data.tastes[kwTwo].tasteName + "' data-id='" + result.data.tastes[kwTwo].tasteId + "'>" + result.data.tastes[kwTwo].tasteName + "</li>"
								$('.kw1').html(kw1);
							}
						}
					}
					$('.kw1 li:first-child').addClass("action_makes");
				}
			}

			//选择口味按钮样式
			$('.kw1 li').click(function() {
				$(this).addClass('action_makes').siblings().removeClass('action_makes');
			});
			$('.row2_type2 li').click(function() {
				var thisName = $(this).attr("class");
				if(thisName == 'action_makes') {
					$(this).removeClass('action_makes');
					var yuan = $('#taske_pirce').html();
					var tianjia = $(this).find('.jiage').text().substr(1, 1);
					var hou = yuan - tianjia;
					var jia = hou.toFixed(2); //保留两位
					$('#taske_pirce').html(jia);
				} else {
					$(this).addClass('action_makes').siblings().removeClass('action_makes');
					var tianjia = $(this).find('.jiage').text().substr(1, 1)
					shoujia = Number(jiage) + Number(tianjia)
					$('#taske_pirce').html(shoujia);
				}
			})
		}
	});
}

//判断模式1或2
function jumpPage() {
	var discountsType = JSON.parse(localStorage.getItem("discountsType"));
	if(discountsType == 1) {
		location.href = "../html/shopingTrolley_model1.html";
	} else if(discountsType == 2) {
		location.href = "../html/shoppingTrolley.html";
	}
}