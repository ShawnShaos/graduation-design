var deleteFlag = 0; //复选框删除（1）还是右键单个删除（2）
$(function() {

	//1.初始化Table
	var oTable = new TableInit();
	oTable.Init();

	//2.初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();

	//点击确认新建工程按钮
	$("#createNew").on('click', function() {

		var value = $('#projectName').val();
		if(value != null || value != '' || value != undefined) {
			$.ajax({
				url: 'newProject',
				type: 'post',
				data: {
					PRJ_NM: value
				},
				success: function(data) {
					console.log(data);
					if(data != 'false') {
						if(value == null || value == undefined || value == '') {
							$.messager.show({
								title: '提示',
								msg: '请输入工程名！'
							})
						} else {
							PRJ_CD = "-1";
							app.graph.clear();
							$('#addModal').modal('hide');
							$('#projectManage').modal('hide');

							$.messager.show({
								title: '提示',
								msg: '新建工程成功！'
							})

							
							$('#tb_projects').bootstrapTable('refresh');

							$('#paper').show();
							PRJ_CD = "-1";
							app.graph.clear();
							PRJ_CD = data;

						}
					} else if(data == 'false') {
						$.messager.show({
							title: '提示',
							msg: '新建工程失败！'
						})
					}
				},
				error: function(xhr, status, error) {

				}
			});
		}
	});

	//点击确认删除按钮
	$("#deleteYes").on('click', function() {
		var send = new Array();
		if(deleteFlag == 1) {
			var selects = $('#tb_projects').bootstrapTable('getSelections');

			var list = new Array();
			for(var i in selects) {
				list[i] = selects[i].prj_CD;
			}

			send = list;
		} else if(deleteFlag == 2) {
			send[0] = oTable.rowPrjID;
		}
		console.log(send);

		if(send.length != 0) {
			$.ajax({
				url: 'deleteProject', //删除该工程
				type: 'post',
				data: {
					PRJ_CD: send.join(",")
				},
				success: function(data) {
					console.log(data);
					if(data == 'true') {
						$('#tb_projects').bootstrapTable('refresh');
						$.messager.show({
							title: '提示',
							msg: '删除工程成功！'
						})
						$('#deleteModal').modal('hide');
						for(var i in send) {
							if(send[i] == PRJ_CD) {
								$('#paper').hide();
							}
						}
					} else if(data == 'false') {
						$.messager.show({
							title: '提示',
							msg: '删除工程失败！'
						})
					}
				},
				error: function(xhr, status, error) {

				}
			});
		}

	})

});

var TableInit = function() {
	var oTableInit = new Object();
	oTableInit.rowPrjID = "";
	//初始化Table
	oTableInit.Init = function() {
		$('#tb_projects').bootstrapTable({
			url: 'getListPNM', //请求后台的URL（*）
			method: 'get', //请求方式（*）
			toolbar: '#toolbarProject', //工具按钮用哪个容器
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			sortable: true, //是否启用排序
			sortName: 'update_TIME',
			sortOrder: "desc", //排序方式
			//	queryParams: oTableInit.queryParams, //传递参数（*）
			sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 5, //每页的记录行数（*）
			pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
			search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch: false,
			showColumns: true, //是否显示所有的列
			showRefresh: true, //是否显示刷新按钮
			showPaginationSwitch: true,
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			//height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId: "ID", //每一行的唯一标识，一般为主键列
			showToggle: true, //是否显示详细视图和列表视图的切换按钮
			cardView: false, //设置为 true将显示card视图
				detailView: true, //设置为 true 可以显示详细页面模式。
			detailFormatter: function(index, row) { //格式化详细页面模式的视图。
				return '缩略图';
			},
			contextMenu: '#context-menu',
			idField: "prj_CD", //指定主键列
			uniqueId: "prj_CD",
			rowStyle: function(row, index) { //	这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger']

				var strclass = "";
				if(row.prj_CD == PRJ_CD) {
					strclass = 'warning'; //还有一个active
				} else {
					return {};
				}
				return { classes: strclass }
			},

			onContextMenuItem: function(row, $el) {

				if($el.data("item") == "edit") {
					$('#paper').show();

					PRJ_CD = "-1";
					app.graph.clear();
					PRJ_CD = row.prj_CD;
					app.loadExample(row.prj_CD); //编辑该工程
					$('#projectManage').modal('hide');
					$('#tb_projects').bootstrapTable('refresh');

				} else if($el.data("item") == "delete") {
					deleteFlag = 2;
					oTableInit.rowPrjID = row.prj_CD;

					$('#deleteModal').modal('toggle');
				}
			},

			//重命名工程
			onEditableSave: function(field, row, oldValue, $el) {
				console.log({
					PRJ_CD: row.prj_CD,
					PRJ_NM: row.prj_NM
				});
				$.ajax({
					type: "post",
					url: "reNamePRJ",
					data: {
						PRJ_CD: row.prj_CD,
						PRJ_NM: row.prj_NM
					},
					success: function(data, status) {
						console.log(data);
						if(data == 'true') {
							$('#tb_projects').bootstrapTable('refresh');
							$.messager.show({
								title: '提示',
								msg: '重命名成功！'
							})
						} else if(data == 'false') {
							$.messager.show({
								title: '提示',
								msg: '重命名失败！'
							})
						}
					},
					error: function() {
						console.log("出错了");
					}

				});
			},
			columns: [{

					checkbox: true
				}, {
					field: 'prj_CD',
					title: '工程ID',
					visible: false
				}, {
					field: 'prj_NM',
					title: '工程名称',
					sortable: true,
					align: 'center',
					editable: true,
				},
				//        {
				//           field: 'prj_CD',
				//           title: 'ID'
				//        }, 
				{
					field: 'update_TIME',
					title: '最后修改时间',
					align: 'center',
					sortable: true,
					width: '35%'
				}
			],
						data: [{
							prj_CD: "123124124",
							prj_NM: "工程1",
							update_TIME: '2017/03/21',
			
						}, {
							prj_CD: "123124124",
							prj_NM: "工程2",
							update_TIME: '2017/03/23',
						}, {
							prj_CD: "123124124",
							prj_NM: "工程3",
							update_TIME: '2017/03/23',
						}, {
							prj_CD: "123124124",
							prj_NM: "工程4",
							update_TIME: '2017/03/23',
						}, {
							prj_NM: "工程5",
							update_TIME: '2017/03/23',
						}, {
							prj_CD: "123124124",
							prj_NM: "工程6",
							update_TIME: '2017/03/23',
						}, {
							prj_CD: "123124124",
							prj_NM: "工程7",
							update_TIME: '2017/03/23',
						}],

			//单击row事件
			onClickRow: function(row, $element) {
				//				console.log(row);
				//				//$element是当前tr的jquery对象
				//			$element.css("background-color", "green");
			},

		});
	};

	//得到查询的参数
	oTableInit.queryParams = function(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			//			pageSize: params.limit, //页面大小
			//			pageNumber: params.offset, //页码
			//  search:params.search, //开启自带查询后输入的值
			//  departmentname: $("#txt_search_project").val(),   
			//  statu: $("#txt_search_statu").val()
		};
		return temp;
	};
	return oTableInit;
};

var ButtonInit = function() {
	var oInit = new Object();
	var postdata = {};

	oInit.Init = function() {
		$('#btn_add').on('click', function() { //点击新增按钮

			$('#addModal').modal('toggle');
		});
		$('#btn_delete').on('click', function() { //点击复选框删除按钮
			deleteFlag = 1;
			$('#deleteModal').modal('toggle');
		})

	};

	return oInit;
};