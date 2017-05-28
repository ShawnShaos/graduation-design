//
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}
$(document).ready(function() {
	$("#loginbutton").click(function() {
		var date = getNowFormatDate();
		console.log(date);
		json_data = {
			"username": '',
			"password": '',
			"date": date
		};
		json_data.username = $("#username").val();
		json_data.password = $("#password").val();
		console.log(json_data.username);
		console.log(json_data.password);
		$.ajax({
			type: "get",
			url: 'tempdb/login.json',
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(json_data),
			success: function(ret_data) {
				if(ret_data == "user_or_pass_error") {
					//                    $.messager.show({
					//                        title:'警告',
					//                        msg:'账号或密码错误！'
					//                    });
					console.log('账号或密码错误！');
					alert("账号或密码错误！");
					return;
				} else if(ret_data == "forbidden") {
					alert("帐号被禁用");
				} else {

					sessionStorage.setItem("id", ret_data.id);
					sessionStorage.setItem("username", json_data.username);
					window.location.href = "home.html";
				}
			},
			error: function() {}
		});
	})

});