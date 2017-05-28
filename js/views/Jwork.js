var myChart; //全局结果图表对象
var PRJ_CD = undefined;//全局工程ID
var myChartt; //单个设备属性或结果图表对象
var getSIM_CD = undefined; //获得的仿真记录编码
var getOBJ_CD = undefined; //获得鼠标点中的对象ID
var getPRJ_TYPE = undefined; //获得设备类型
var cell_view = null;
var url = '';
var option2;
var app;
var appp = {};
var symbolSize = 10;
var dataa = [
	[],
	[],
	[],
	[],
	[],
	[],
	[]
];

///////////////////////////////////////////////////////////////////////////////////////////////     映射关系
///////////////////////////////////////////////////////////////////////////////////////////////

//初始化映射关系表格
$(function() {

	$('#device-management').on('shown.bs.modal', function() {
		// 执行一些动作...
		$('#devicemanagement').datagrid({
			width: 570,
			height: 277,
			//		fit:true,
			//		fitColumns:true,
			title: '图元与设备映射关系表',
			url: url + 'Shobdata',
			method: 'post',
			singleSelect: true,
			collapsible: true, //按钮可折叠
			rownumbers: true, //行号
			pagination: true, //分页
			pageSize: 10,
			pageList: [10, 20, 30, 40, 50],
			pageNumber: 1,
			queryParams:{
				PRJ_CD:PRJ_CD,
			    id :1
			},//其余发送到服务器的参数
			//设置默认的排列
			//sortName:'PEL_NM',
			//sortOrder:'ASC',
			remoteSort: true, // true时服务器进行排序
			//multiSort:true, 多列排序,一般设置为false

			fitColumns: true, //各列宽度自适应
			toolbar: '#tb',
			columns: [
				[
					//{
					//    field:'OBJ_CD',
					//    title:'对象编码',
					//    width:15,
					//    align:'center'
					//},
					{
						field: 'PEL_NM',
						title: '对象名称',
						width: 30,
						sortable: true, //可排序
						align: 'center'
						//editor:"numberbox"
					},
					{
						field: 'DEVICE_NM',
						title: '设备名称',
						width: 30,
						align: 'center'
						//sortable:true,//可排序
					},
					{
						field: 'DEVICE_CD',
						title: '设备编码',
						width: 40, //DEVICE_CD
						align: 'center'
					},

				]
			],

			//双击获取设备属性
			onDblClickRow: function(rowIndex, rowData) {
				if(rowData.DEVICE_CD) {
					$.ajax({
						type: 'get',
						url: url + 'getTdata',
						data: {
							DEVICE_CD: rowData.DEVICE_CD,
							PRJ_TYPE: rowData.PRJ_TYPE,
						},
						beforeSend: function() {
							$('#devicemanagement').datagrid('loading');
						},
						success: function(data) {
							if(data) {
								$('#devicemanagement').datagrid('loaded');
								if(data.success) {
									$.messager.show({
										title: '提示',
										msg: data.data,
										height: '200px',
										style: {
											left: '',
											right: 0,
											top: '',
											bottom: 0
										}
									})
								}
								if(!data.success) {
									$.messager.alert({
										title: '提示',
										msg: data.errormsg,
									})
								}
							}
						},
						error: function(errorMsg) {
							$.messager.alert({
								title: '提示',
								msg: '获取失败！',
							})
						}
					});
				} else {
					$.messager.alert({
						title: '提示',
						msg: '该图元暂未映射到一个设备上！',
					})
				}
				//$('#devicemanagement').datagrid('beginEdit',rowIndex);
				//$('#saveDe,#redo').show();
				//editRow=rowIndex;
			}
		});
	})

});







 var defaultAnnotation = {
        attrs: {
            fill: '#FFFFFF',
            'font-size': 12,
            'font-weight': 'normal',
            'text-decoration': 'none',
            'font-style': 'normal',
            'font-family': 'Helvetica'
        }
    };
//文字编辑
function updateToolbar() {
		//字体样式
		var fontFamily = app.toolbar.getWidgetByName('fontFamily').selectBox; 
		
		//文字大小
		var fontSize = app.toolbar.getWidgetByName('fontsize').selectBox; 
		
		//字体风格
		var textStyle = app.toolbar.getWidgetByName('textStyle').selectButtonGroup;
	
        var attrs = joint.ui.TextEditor.getSelectionAttrs([defaultAnnotation].concat(joint.ui.TextEditor.findAnnotationsInSelection()));
 
        attrs = _.merge({}, defaultAnnotation.attrs, attrs);
        
//      if (attrs.fill) { 
//          textColor.selectByValue(attrs.fill);
//      } else {
//          textColor.select(-1);
//      }
        if (attrs['font-size']) {
            fontSize.selectByValue(attrs['font-size'] + 'px');
        } else {
            fontSize.select(-1);
        }
        if (attrs['font-family']) {
            fontFamily.selectByValue(attrs['font-family']);
        } else {
            fontFamily.select(-1);
        }
        textStyle.deselect();
        if (_.isUndefined(attrs['font-weight'])) {
            textStyle.fontWeightUndefined = true;
        }
        if (_.isUndefined(attrs['text-decoration'])) {
            textStyle.textDecorationUndefined = true;
        }
        if (_.isUndefined(attrs['font-style'])) {
            textStyle.fontStyleUndefined = true;

        } else {
            if (attrs['font-weight'] === 'bold') textStyle.selectByValue('bold');
            if (attrs['text-decoration'] === 'underline') textStyle.selectByValue('underline');
            if (attrs['font-style'] === 'italic') textStyle.selectByValue('italic');
        }
    }


//查找
function doSearch() {
	$('#devicemanagement').datagrid('load', {
		PEL_NM: $.trim($('#PEL_NM').val()),
		MARCH: $('#MARCH_YN').combo('getValue'),
		PRJ_TYPE: $('#PRJ_cd').combo('getValue'),
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////     数据栏-->对象表
///////////////////////////////////////////////////////////////////////////////////////////////

//初始化数据栏中的对象表
$(function() {
	$('#devices').datagrid({
		width: 570,
		height: 277,
		fit: true,
		//		fitColumns:true,
		//      title:'图元对象表',
		url: url + 'Shobdata',
		method: 'post',
		singleSelect: true,
		collapsible: true, //按钮可折叠
		rownumbers: true, //行号
		pagination: true, //分页
		pageSize: 10,
		pageList: [10, 20, 30, 40, 50],
		pageNumber: 1,
		//queryParams:{
		//    id :1,
		//},其余发送到服务器的参数
		//设置默认的排列
		//sortName:'PEL_NM',
		//sortOrder:'ASC',
		remoteSort: true, // true时服务器进行排序
		//multiSort:true, 多列排序,一般设置为false

		fitColumns: true, //各列宽度自适应
		toolbar: '#tool',
		columns: [
			[
				//{
				//    field:'OBJ_CD',
				//    title:'对象编码',
				//    width:15,
				//    align:'center'
				//},
				{
					field: 'PEL_NM',
					title: '对象名称',
					width: 20,
					sortable: true, //可排序
					align: 'center'
					//editor:"numberbox"
				},
				{
					field: 'DEVICE_NM',
					title: '设备名称',
					width: 20,
					align: 'center'
					//sortable:true,//可排序
				},
				//{
				//    field:'DEVICE_CD',
				//    title:'设备编码',
				//    width:30,//DEVICE_CD
				//    align:'center'
				//},
			]
		],
			data: [{
							
							PEL_NM: "涵洞",
							DEVICE_NM: '',
			
						}, {
						
							PEL_NM: "管道6",
							DEVICE_NM: '3段2号管道',
						}, {
							
							PEL_NM: "管道3",
							DEVICE_NM: '2段9号管道',
						}, {
							
							PEL_NM: "管道1",
							DEVICE_NM: '2段3号管道',
						}],
		//单击获取设备属性
		onClickRow: function(rowIndex, rowData) {
			getOBJ_CD = rowData.OBJ_CD;
			getPRJ_TYPE = rowData.PRJ_TYPE;

			//-------------------2017/03/03-------------------ss------------------

			var cellId = getOBJ_CD.substring(0, 8) + '-' + getOBJ_CD.substring(8, 12) + '-' + getOBJ_CD.substring(12, 16) + '-' + getOBJ_CD.substring(16, 20) + '-' + getOBJ_CD.substring(20, 32);
			var cellView = app.paper.findViewByModel(cellId); //---------------------------------------------------------------------------------------------出错，取到的值为undefined
			console.log(cellView);

			if(app.halo != undefined) {
				joint.ui.FreeTransform.clear(app.paper); //清除自由变换工具

				app.halo.remove(); //清除图元快捷键工具
			}

			if(cellView != undefined) {
				app.highlightAndHaloCommon(cellView);
			} else {
				if(cell_view != null) {
					cell_view.unhighlight();
				}
				cell_view = null;
			}

			//------------------------------------------------------

			//------------------------------------------------------获取设备属性
			datatypeone(document.getElementById('data-type-one'));
			app.property();
		},
	});
	//getOBJ_CD=undefined;

	//更行成功后响应选中的图元
	$("#devices").datagrid({
		onLoadSuccess: function() {
			if(cell_view != null && cell_view.model.get('type') != 'basic.Text') {
				var rows = $("#devices").datagrid('getData').rows;
				var i;
				for(i = 0; i < rows.length; i++) {
					if(rows[i].OBJ_CD == getOBJ_CD) {
						$('#devices').datagrid('selectRow', i);
						break;
					}
				};
				if(i == $("#devices").datagrid('getData').rows.length) {
					$('#devices').datagrid('unselectAll');
				};
			}
		}
	});
});

//查找-->包括选择设备类型，输入图元对象名称
function doSearchOBJ() {
	getOBJ_CD = undefined;
	$('#devices').datagrid('load', {
		PEL_NM: $.trim($('#PEL_NMM').val()),
		PRJ_TYPE: $('#PRJ_cdd').combo('getValue')
	});
};

//点击图元时的响应事件，对象表为选中或者非选中
function selectobj() {
	var rows = $("#devices").datagrid('getData').rows;
	for(i = 0; i < rows.length; i++) {
		if(rows[i].OBJ_CD == getOBJ_CD) {
			//alert(rows[i].OBJ_CD)
			$('#devices').datagrid('selectRow', i);
			break;
		}
	}
	if(i == $("#devices").datagrid('getData').rows.length) {
		$('#devices').datagrid('unselectAll');
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////     数据栏-->匹配功能
///////////////////////////////////////////////////////////////////////////////////////////////

//设备匹配出现的表格
$(function() {
	$('#TandDevice').on('shown.bs.modal', function() {
		if(cell_view != null && cell_view.model.get('type') != 'basic.Text') {
			document.getElementById("T_name").value = cell_view.model.toJSON().modelText;
			// 获取当前图元匹配的设备名称...
			var objcd = cell_view.model.toJSON().id
			$.ajax({
				type: 'post',
				url: 'matchOrNot',
				data: {
					OBJ_CD: objcd.substring(0, 8) + objcd.substring(9, 13) + objcd.substring(14, 18) + objcd.substring(19, 23) + objcd.substring(24, 36),
				},
				beforeSend: function() {},
				success: function(data) {
					document.getElementById("TA_name").value = data;
				},
				error: function(errorMsg) {}
			});
			$('#TandD_table').datagrid({
				width: 570,
				height: 277,
				//fit:true,
				//fitColumns:true,
				//title:'待选设备表',
				url: url + 'getRealByType',
				method: 'post',
				singleSelect: true,
				collapsible: true, //按钮可折叠
				rownumbers: true, //行号
				pagination: true, //分页
				pageSize: 10,
				pageList: [10, 20, 30, 40, 50],
				pageNumber: 1,
				queryParams: {
					PRJ_TYPE: cell_view.model.toJSON().modelType
					//PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE
				}, //其余发送到服务器的参数
				//设置默认的排列
				//sortName:'PEL_NM',
				//sortOrder:'ASC',
				remoteSort: true, // true时服务器进行排序
				//multiSort:true, 多列排序,一般设置为false

				fitColumns: true, //各列宽度自适应
				toolbar: '#TandD_tb',
				columns: [
					[{
							field: 'DEVICE_NM',
							title: '设备名称',
							width: 30,
							align: 'center',
							sortable: true //可排序
						},
						{
							field: 'DEVICE_CD',
							title: '设备编码',
							width: 70, //DEVICE_CD
							align: 'center'
							//editor:{
							//    type:'validatebox',
							//    options:{
							//        required:true,
							//    },
							//},
						},
					]
				],
				//双击获取设备属性
				onDblClickRow: function(rowIndex, rowData) {
					$.ajax({
						type: 'get',
						url: url + 'getTdata',
						data: {
							DEVICE_CD: rowData.DEVICE_CD,
							//PRJ_TYPE:rowData.PRJ_TYPE,
							//PRJ_TYPE:$('#TandD_table').datagrid('getSelected').PRJ_TYPE,
							PRJ_TYPE: cell_view.model.toJSON().modelType
						},
						beforeSend: function() {
							$('#devicemanagement').datagrid('loading');
						},
						success: function(data) {
							if(data) {
								$('#devicemanagement').datagrid('loaded');
								if(data.success) {
									$.messager.show({
										title: '提示',
										msg: data.data,
										height: '200px',
										style: {
											left: '',
											right: 0,
											top: '',
											bottom: 0
										}
									})
								};
								if(!data.success) {
									$.messager.alert({
										title: '提示',
										msg: data.errormsg,
									})
								}
							}
						},
						error: function(errorMsg) {
							$.messager.alert({
								title: '提示',
								msg: '获取失败！',
							})
						}
					});
				},
			});
		} else {
			$('#TandD_table').datagrid('loadData', { total: 0, rows: [] });
		}
	})
});

//查找
function SearchDEV() {
	$('#TandD_table').datagrid('load', {
		DEVICE_NM: $.trim($('#TandD_PEL_NM').val()),
		PRJ_TYPE: $('#devices').datagrid('getSelected').PRJ_TYPE
	});
};

//确定匹配函数
function mapping() {
	if($('#TandD_table').datagrid('getSelected')) {
		$('#TandD_table').datagrid('loading');
		var objcd = cell_view.model.toJSON().id
		$.ajax({
			type: 'post',
			url: url + 'updatehob',
			data: {
				OBJ_CD: objcd.substring(0, 8) + objcd.substring(9, 13) + objcd.substring(14, 18) + objcd.substring(19, 23) + objcd.substring(24, 36),
				DEVICE_CD: $('#TandD_table').datagrid('getSelected').DEVICE_CD,
				DEVICE_NM: $('#TandD_table').datagrid('getSelected').DEVICE_NM
			},
			beforeSend: function() {},
			success: function(data) {
				if(data) {
					$('#TandD_table').datagrid('loaded');
					if(data.success) {
						$.messager.show({
							title: '提示',
							msg: '匹配成功'
						});
					}
					if(!data.success) {
						$.messager.alert({
							title: '提示',
							msg: data.errormsg
						});
					}
					3

					document.getElementById("TA_name").value = $('#TandD_table').datagrid('getSelected').DEVICE_NM;
					$('#devices').datagrid('reload');
					selectobj();
					//getOBJ_CD=undefined;
					//alert('开始了');
					//$.ajax({
					//    type:'post',
					//    url:'getRealdata',
					//    data:{
					//        OBJ_CD:getOBJ_CD,//选中的对象ID
					//        PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
					//    },
					//    beforeSend:function(){
					//    },
					//    success:function(data){
					//        var data = cell_view.model.toJSON().property; //属性json
					//        for(var i in data.modify) {
					//            var unit = '';
					//            if(data.modify[i].unit != undefined)
					//                unit = data.modify[i].unit;
					//
					//            var value = '';
					//            if(data.modify[i].value != undefined)
					//                value = data.modify[i].value;
					//            $("#property").append('<div class="input-group">' +
					//                '<label class="input-group-addon" for="first" style="width: 5%">' + data.modify[i].name + '</label>' +
					//                '<input type="text" class="form-control" id="first"  value="' + value + '">' +
					//                '<span class="input-group-addon" style="width: 5%">' + unit + '</span>' +
					//                '</div>');
					//
					//        }
					//        for(var i in data.modifyLine) {
					//            //$("#property").append('<div class="input-group">' +
					//            //	'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
					//            //	'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + '" >' +
					//            //	'<span class="input-group-addon" style="width: 5%">' +
					//            //	'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline(' + i + ')">' +
					//            //	'Go!' +
					//            //	'</button>' +
					//            //	'</span>' +
					//            //	'</div>');
					//
					//            $("#property").append('<div class="input-group">'+
					//                '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
					//                '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
					//                '<span class="input-group-addon" style="width: 5%">'+
					//                '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit('+ i +')">'+
					//                'Go!'+
					//                '</button>'+
					//                '</span>'+
					//                '</div>');
					//        }
					//    },
					//});

				}
			},
			error: function(errorMsg) {
				$('#TandD_table').datagrid('loaded');
				console.log(errorMsg);
				$.messager.alert({
					title: '提示',
					msg: errorMsg.statusText,
				})
			}
		});
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////     数据栏-->属性
///////////////////////////////////////////////////////////////////////////////////////////////

//点击数据、模拟、结果中的数据按钮时，触发的函数
function shuju() {
	datatypeone(document.getElementById('data-type-one'));
}

//当选中OBJ对象后，改变查看的内容时触发事件，属性，结果，当时属性
function datatypeone(id) {
	if(getOBJ_CD == undefined || cell_view == null) {
		if(id.value == 0) {
			selectzero();
		}
		if(id.value == 1 || id.value == 2) {
			selectone();
		}
		//$.messager.show({
		//    title:'提示',
		//    msg:'请先选中一个设备'
		//})
	} //当前未选中一个设备对象
	if(getOBJ_CD != undefined || (cell_view != null && cell_view.model.get('type') != 'basic.Text')) {
		if(id.value == 0) {
			selectzero();
			on_out_line(document.getElementById('data-type-two')); //传递给函数一个对象
		} //获得属性
		if(id.value == 1) {
			selectone();
			if(!$('#slect-moni').datagrid('getSelected')) {
				Remove();
				$.messager.show({
					title: '提示',
					msg: '请先选择一次仿真记录！'
				})
			} //提示未选中记录
			if($('#slect-moni').datagrid('getSelected')) {
				if($('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 'YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE == 'Transient') {
					$.ajax({
						type: 'post',
						url: 'getResultData',
						data: {
							OBJ_CD: getOBJ_CD, //选中的对象ID
							SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD, //选中的模拟记录ID
							SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE,
							//PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE
							PRJ_TYPE: cell_view.model.toJSON().modelType

							//OBJ_CD: "bf899545978b4affbd1dbc52603199a5",
							//SIM_CD: 2,
							//SIM_CAL_TYPE: "Steady",
							//PRJ_TYPE:2

						},
						beforeSend: function() {},
						success: function(data) {
							Remove();
							for(var prop in data.result_D) {
								$("#property").append('<hr><em>' + prop + ':</em>');
								//alert(prop + "有" + data.result_D[prop].length + "个结果类型");
								for(var i = 0; i < data.result_D[prop].length; i++) {
									//alert("第" + i + "类结果类型为：" + data.result_D[prop][i].Name);
									$("#property").append('<div class="input-group">' +
										'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.result_D[prop][i].Name + '</label>' +
										'<input type="text" class="form-control" id="property_line' + i + '" disabled="true" placeholder="' + data.result_D[prop][i].Ename + '">' +
										'<span class="input-group-addon" style="width: 4%">' +
										'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getresultline(' + i + ')">' +
										'go' +
										'</button>' +
										'</span>' +
										'</div>');
								}
								//for(var i in data.result_W.prop)
							}
							//for(var i=0;i < data.result_W.length; i++){
							//    $.message.show({
							//        title:'111',
							//        msg:data.result_W[i].name
							//    })
							//$("#property").append('<div class="input-group">'+
							//    '<label class="input-group-addon" for="property_'+ i +'">' + data.inherent[i].name + '</label>' +
							//    '<input type="text" class="form-control" id="property_'+ i +'" disabled="true" placeholder="100">' +
							//    '<span class="input-group-addon">'+
							//    '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getresultline()">'+
							//    'Go!'+
							//    '</button>'+
							//    '</span>'+
							//    '</div>');
							//}
						},
					});
				} //1,表示非恒定，结果为曲线，success接收到的data应该为结果名称；内点号
				if($('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 'YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE == 'Steady') {
					$.ajax({
						type: 'post',
						url: 'getResultData',
						data: {
							OBJ_CD: getOBJ_CD, //选中的对象ID
							SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD, //选中的模拟记录ID
							SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE,
							//PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
							PRJ_TYPE: getPRJ_TYPE,

							//OBJ_CD: "bf899545978b4affbd1dbc52603199a5",
							//SIM_CD: 2,
							//SIM_CAL_TYPE: "Steady",
							//PRJ_TYPE:2
						},
						beforeSend: function() {},
						success: function(data) {
							Remove();
							for(var prop in data.result_W) {
								$("#property").append('<hr><em>' + prop + ':</em>');
								for(var i = 0; i < data.result_W[prop].length; i++) {
									if(data.result_W[prop][i].unit) {
										$("#property").append('<div class="input-group">' +
											'<label class="input-group-addon" for="property_' + i + '" style="width: 5%">' + data.result_W[prop][i].Name + '</label>' +
											'<input type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.result_W[prop][i].value + '" disabled="true">' +
											'<span class="input-group-addon" style="width: 5%">' + data.result_W[prop][i].unit + '</span>' +
											'</div>');
									} else {
										$("#property").append('<div class="input-group">' +
											'<label class="input-group-addon" for="property_' + i + '" style="width: 5%">' + data.result_W[prop][i].Name + '</label>' +
											'<input type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.result_W[prop][i].value + '" disabled="true">' +
											'<span class="input-group-addon" style="width: 5%"></span>' +
											'</div>');
									}
								}
								//alert("jsonObj[" + prop + "]=" + data.result_W[prop][0].value);
							}
							//for(var i = 0; i < data.result_W.length; i++){
							//    $.message.show({
							//        title:'111',
							//        msg:data.result_W[i].name
							//    })
							//$("#property").append('<div class="input-group">' +
							//    '<label class="input-group-addon" for="property_'+ i +'">' + data.result_W[i].name + '</label>' +
							//    '<input type="text" class="form-control" id="property_'+ i +'" placeholder="' + data.result_W[i].value + '" disabled="true">' +
							//    '<span class="input-group-addon">.'+ data.inherent[i].unit +'</span>' +
							//    '</div>');
							//}
						},
					});
				} //0,表示恒定,结果为值，不需要按钮
				if($('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 'NO') {
					Remove();
				}
			} //判断当前是否有选中一条模拟记录ID

		} //获得结果
		if(id.value == 2) {
			selectone();
			if(!$('#slect-moni').datagrid('getSelected')) {
				Remove();
				$.messager.show({
					title: '提示',
					msg: '请先选择一次仿真记录！'
				})
			} //提示未选中记录
			if($('#slect-moni').datagrid('getSelected')) {
				$.ajax({
					type: 'post',
					url: 'getOldData',
					data: {
						OBJ_CD: getOBJ_CD, //选中的对象ID
						SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD, //选中的模拟记录ID
						PRJ_TYPE: cell_view.model.toJSON().modelType
					},
					beforeSend: function() {},
					success: function(data) {
						Remove();
						for(var i = 0; i < data.modify.length; i++) {
							if(data.modify[i].unit) {
								$("#property").append('<div class="input-group">' +
									'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%";>' + data.modify[i].name + '</label>' +
									'<input type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
									'<span class="input-group-addon">' + data.modify[i].unit + '</span>' +
									'</div>');
							}
							if(!data.modify[i].unit) {
								$("#property").append('<div class="input-group">' +
									'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
									'<input type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
									'<span class="input-group-addon"></span>' +
									'</div>');
							}
						}
						for(var i = 0; i < data.modifyLine.length; i++) {
							$("#property").append('<div class="input-group">' +
								'<label class="input-group-addon" for="property_line' + i + '">' + data.modifyLine[i].name + '</label>' +
								'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
								'<span class="input-group-addon">' +
								'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline(' + i + ')">' +
								'Go!' +
								'</button>' +
								'</span>' +
								'</div>');
						}
					},
				})
			} //判断当前是否有选中一条模拟记录ID
		} //获得某次仿真的输入
	} //当前选中一个设备对象
}

function selectzero() {
	document.getElementById("hideee").style.display = "inline";
	document.getElementById("dataonline").style.display = "inline";
	document.getElementById("valueT").style.display = "inline";
	document.getElementById("resetT").style.display = "inline";
	document.getElementById("property").style.height = "85%"
}

function selectone() {
	document.getElementById("hideee").style.display = "none";
	document.getElementById("dataonline").style.display = "none";
	document.getElementById("valueT").style.display = "none";
	document.getElementById("resetT").style.display = "none";
	document.getElementById("property").style.height = "100%"
}

//改变在线离线属性时触发事件-------------------------------重复部分
function on_out_line(id) {
	if(document.getElementById('data-type-one').value != 0) {} //非选中属性选项时，改变在线离线状态无操作
	if(document.getElementById('data-type-one').value == 0) {
		if(cell_view == null) {
			//$.messager.show({
			//    title:'提示',
			//    msg:'请先选中一个设备'
			//})
		} //当前没有选中一个设备或者对象时
		if(cell_view != null && cell_view.model.get('type') != 'basic.Text') {
			if(!id.checked) { //离线属性，从图元中获得设备属性
				Remove();
				document.getElementById("valueT").disabled = undefined;
			} //离线属性，从图元中获得设备属性
			if(id.checked) { //在线属性，从基础信息库获得属性
				//$.ajax({
				//    type:'post',
				//    url: 'matchOrNot',
				//    data: {
				//        OBJ_CD:getOBJ_CD,
				//    },
				//    beforeSend:function(){
				//    },
				//    success:function(data){
				//        if(data){
				//            document.getElementById("valueT").disabled = "true";
				//            $.ajax({
				//                type:'post',
				//                url:'getRealdata',
				//                data:{
				//                    OBJ_CD:getOBJ_CD,//选中的对象ID
				//                    PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
				//                },
				//                beforeSend:function(){
				//                },
				//                success:function(data){
				//                    $("#property div").remove();
				//                    for(var i = 0; i < data.modify.length; i++){
				//                        if(data.modify[i].unit){
				//                            $("#property").append('<div class="input-group">' +
				//                                '<label class="input-group-addon" for="property_data'+ i +'" style="width: 5%">' + data.modify[i].name + '</label>' +
				//                                '<input name="' + data.modify[i].Ename + '"type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
				//                                '<span class="input-group-addon" style="width: 5%">'+ data.modify[i].unit +'</span>' +
				//                                '</div>');
				//                        }
				//                        if(!data.modify[i].unit){
				//                            $("#property").append('<div class="input-group">' +
				//                                '<label class="input-group-addon" for="property_data'+ i +'"style="width: 5%">' + data.modify[i].name + '</label>' +
				//                                '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
				//                                '<span class="input-group-addon" style="width: 5%"></span>' +
				//                                '</div>');
				//                        }
				//                    }
				//
				//                    for(var i=0;i < data.modifyLine.length; i++){
				//                        $("#property").append('<div class="input-group">'+
				//                            '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
				//                            '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
				//                            '<span class="input-group-addon" style="width: 5%">'+
				//                            '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline('+ i +')">'+
				//                            'Go!'+
				//                            '</button>'+
				//                            '</span>'+
				//                            '</div>');
				//                    }
				//                },
				//            })
				//        }//当前有匹配到一个设备
				//        if(!data){
				//            document.getElementById("valueT").disabled = undefined;
				//            $.ajax({
				//                type:'post',
				//                url:'getRealdata',
				//                data:{
				//                    OBJ_CD:getOBJ_CD,//选中的对象ID
				//                    PRJ_TYPE:getPRJ_TYPE,
				//                    //PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
				//                    //DEVICE_CD:$('#devices').datagrid('getSelected').DEVICE_CD
				//                },
				//                beforeSend:function(){
				//                },
				//                success:function(data){
				//                    $("#property div").remove();
				//                    for(var i = 0; i < data.modify.length; i++){
				//                        if(data.modify[i].unit){
				//                            $("#property").append('<div class="input-group">' +
				//                                '<label class="input-group-addon" for="property_data'+ i +'" style="width: 5%">' + data.modify[i].name + '</label>' +
				//                                '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'">' +
				//                                '<span class="input-group-addon" style="width: 5%">'+ data.modify[i].unit +'</span>' +
				//                                '</div>');
				//                        }
				//                        if(!data.modify[i].unit){
				//                            $("#property").append('<div class="input-group">' +
				//                                '<label class="input-group-addon" for="property_data'+ i +'"style="width: 5%">' + data.modify[i].name + '</label>' +
				//                                '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'">' +
				//                                '<span class="input-group-addon" style="width: 5%"></span>' +
				//                                '</div>');
				//                        }
				//                    }
				//
				//                    for(var i=0;i < data.modifyLine.length; i++){
				//                        $("#property").append('<div class="input-group">'+
				//                            '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
				//                            '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
				//                            '<span class="input-group-addon" style="width: 5%">'+
				//                            '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit('+ i +')">'+
				//                            'Go!'+
				//                            '</button>'+
				//                            '</span>'+
				//                            '</div>');
				//                    }
				//                },
				//            })
				//        }//当前未匹配到一个设备
				//    },
				//    error: function (errorMsg) {
				//        $.messager.alert({
				//            title:'提示',
				//            msg:'仿真数据请求失败！',
				//        })
				//    }
				//});
			} //在线属性，从基础信息库获得属性
		} //当前选中一个设备对象时
	} //选中属性选项时改变在线或者离线状态
}

//////////////////////////////////////////////////////////////////////////////////////////////      数据栏-->属性    提交属性
function Submitall() {
	if(document.getElementById('data-type-two').checked) {
		Submitonline();
	}; //true为在线,false为离线
	if(!document.getElementById('data-type-two').checked) {

	}
}

function Submitonline() { //保存在线属性
	//$('#attribute_data').submit();
	$.ajax({
		type: "POST",
		url: 'getDevData',
		data: {
			OBJ_CD: getOBJ_CD, //对象编码
			PRJ_TYPE: cell_view.model.toJSON().modelType,
			value: decodeURIComponent($('#attribute_data').serialize(), true) //serialize（）方法自动序列化时会调用encodeURIComponent方法将数据编码，需要解码才行
		},
		success: function(data) {},
		error: function(request) {
			$.message.show({
				title: '提示',
				msg: 'Submit error'
			})
		}
	});
}

function Submitoutline() { //保存离线属性

}

///////////////////////////////////////////////////////////////////////////////////////////////     数据栏-->属性   曲线

//初始化曲线
$(function() {
	myChartt = echarts.init(document.getElementById('attribute_line'));
	//myChartt.setOption({
	//    title: {
	//        text:'',
	//    },
	//    tooltip: {
	//        trigger: 'axis'
	//    },
	//    toolbox:{
	//        feature: {
	//            dataZoom: {
	//                yAxisIndex: 'none'
	//            },
	//            dataView: {readOnly: false,
	//            },
	//
	//            restore: {},
	//            saveAsImage: {}
	//        }
	//    },
	//    legend: {
	//        data:[]
	//    },
	//    xAxis: {
	//        boundaryGap : false,
	//        data: [],
	//        //alignWithLabel:true
	//    },
	//    yAxis: {
	//        type : 'value',
	//        axisLabel: {
	//            formatter:''
	//        },
	//    },
	//    dataZoom: [
	//        {   // 这个dataZoom组件，默认控制x轴。
	//            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
	//            start: 0,      // 左边在 10% 的位置。
	//            end: 100,         // 右边在 60% 的位置。
	//            filterMode: 'filter'
	//        },
	//        {   // 这个dataZoom组件，也控制x轴。
	//            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
	//            start: 0,      // 左边在 10% 的位置。
	//            end: 100,         // 右边在 60% 的位置。
	//            filterMode: 'filter'
	//        }
	//    ],
	//    series: [{
	//        //name: '结果曲线',
	//        type: 'line',
	//        //step: 'middle',闸阀，全开或者全关的曲线类型，应该为类似时间步的阶梯线
	//        data: []
	//    }]
	//});
})

//获得设备属性 --- 在线下的  某种属性的曲线 （根据对象ID + 属性名，读取东深数据库）   (1)未匹配，或者离线情况下，曲线可人为更改    (2)已匹配，曲线不可人为更改
function getonlinedataline_Submit(i) {
	myChartt.showLoading();
	var getid = 'property_line' + i; //alert(document.getElementById(getid).placeholder);
	getOBJ_CD = cell_view.model.toJSON().id;
	getOBJ_CD = getOBJ_CD.substring(0, 8) + getOBJ_CD.substring(9, 13) + getOBJ_CD.substring(14, 18) + getOBJ_CD.substring(19, 23) + getOBJ_CD.substring(24, 36);
	$.ajax({
		type: 'get',
		url: 'tempdb/getRealLine.json',
		data: {
			OBJ_CD: getOBJ_CD, //对象编码
			PRJ_TYPE: cell_view.model.toJSON().modelType,
			Ename: document.getElementById(getid).placeholder

		},
		success: function(result) {
			//myChartt=undefined;
			//myChartt = echarts.init(document.getElementById('attribute_line'));
			myChartt.clear();
			data = [
				[0, 0],
				[20, 20],
				[40, 40],
				[60, 60],
				[80, 80]
			];
			option2 = {
				//title: {
				//    text:eval(result.title.text),
				//},
				tooltip: {
					trigger: 'axis'
				},
				toolbox: {
					show: true,
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						},
						dataView: {
							readOnly: false,
						},
						myTool1: {
							show: true,
							title: '保存更改曲线',
							icon: 'M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
							onclick: function() {
								var XX = '';
								var YY = '';
								for(var i = 0; i < myChartt.getOption().series[0].data.length; i++) {
									XX = XX + myChartt.getOption().series[0].data[i][0] + ',';
									YY = YY + myChartt.getOption().series[0].data[i][1] + ',';
									//sdata[i]=[myChartt.getOption().series[0].data[i][0],myChartt.getOption().series[0].data[i][1]];
									//sdata[i][0]=myChartt.getOption().series[0].data[i][0]; 
									//sdata[i][1]=myChartt.getOption().series[0].data[i][1];
									//console.log("x=" + myChartt.getOption().series[0].data[i][0]+ " , y=" + myChartt.getOption().series[0].data[i][1]);
									//console.log(myChart.getOption().series[0].data[i][1]);
									//console.log(myChart.getOption().xAxis.data[0]);
								}
								$.ajax({
									type: 'post',
									url: 'newDevice', //getResultLine
									data: {
										OBJ_CD: getOBJ_CD, //对象编码
										PRJ_TYPE: cell_view.model.toJSON().modelType,
										Ename: document.getElementById(getid).placeholder,
										//value:myChartt.getOption().series[0].data,
										//value:sdata,
										XX: XX,
										YY: YY
									}, //可能有问题,
									success: function(result) {
										if(result.success) {
											$.messager.show({
												title: '提示',
												msg: '曲线更改成功'
											})
										}
										if(!result.success) {
											$.messager.show({
												title: '提示',
												msg: result.errormsg
											})
										}
									},
								})
							}
						},
						restore: {},
						saveAsImage: {},
					}
				},
				dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
						type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
						start: 0, // 左边在 10% 的位置。
						end: 100, // 右边在 60% 的位置。
						filterMode: 'filter'
					},
					{ // 这个dataZoom组件，也控制x轴。
						type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
						start: 0, // 左边在 10% 的位置。
						end: 100, // 右边在 60% 的位置。
						filterMode: 'filter'
					}
				],
				legend: {
					//data:eval(result.legend.data)
					data: ['自定义特征曲线']
				},
				xAxis: {
					boundaryGap: false,
					//axisLabel: {
					//    formatter:result.xAxis.formatter,
					//},
					type: 'value',
					axisLine: { onZero: false }

				},
				yAxis: {
					//axisLabel: {
					//    formatter:result.yAxis.formatter
					//},
					type: 'value',
					axisLine: { onZero: false }
				},
				series: [{
					name: '自定义特征曲线',
					id: 'a',
					//name:eval(result.series.name),
					type: 'line',
					smooth: true,
					symbolSize: symbolSize,
					data: data
				}]
			};
			if(!appp.inNode) {
				setTimeout(function() {
					// Add shadow circles (which is not visible) to enable drag.
					myChartt.setOption({
						graphic: echarts.util.map(data, function(item, dataIndex) {
							return {
								type: 'circle',
								position: myChartt.convertToPixel('grid', item),
								shape: {
									cx: 0,
									cy: 0,
									r: symbolSize / 2
								},
								invisible: true,
								draggable: true,
								ondrag: echarts.util.curry(onPointDragging, dataIndex),
								onmousemove: echarts.util.curry(showTooltip, dataIndex),
								onmouseout: echarts.util.curry(hideTooltip, dataIndex),
								z: 100
							};
						})
					});
				}, 0);
				window.addEventListener('resize', updatePosition);
			}

			function updatePosition() {
				myChartt.setOption({
					graphic: echarts.util.map(data, function(item, dataIndex) {
						return {
							position: myChartt.convertToPixel('grid', item)
						};
					})
				});
				//加数组获取改变的值
			}

			function showTooltip(dataIndex) {
				myChartt.dispatchAction({
					type: 'showTip',
					seriesIndex: 0,
					dataIndex: dataIndex
				});
			}

			function hideTooltip(dataIndex) {
				myChartt.dispatchAction({
					type: 'hideTip'
				});
			}

			function onPointDragging(dataIndex, dx, dy) {
				data[dataIndex] = myChartt.convertFromPixel('grid', this.position);
				//console.log(option2.series[0].data[dataIndex][1]);
				// Update data
				myChartt.setOption({
					series: [{
						id: 'a',
						data: data
					}]
				});
			}
			myChartt.setOption(option2);
			myChartt.hideLoading();
		},
		error: function(errorMsg) {
			$.messager.alert({
				title: '提示',
				msg: '曲线数据请求失败！',
			})
		}
	})

}

function getonlinedataline(i) {
	myChartt.showLoading();
	var getid = 'property_line' + i; //alert(document.getElementById(getid).placeholder);
	$.ajax({
		type: 'post',
		url: 'getRealLine',
		data: {
			OBJ_CD: getOBJ_CD, //对象编码
			//PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
			PRJ_TYPE: cell_view.model.toJSON().modelType,
			//PRJ_TYPE:4,
			Ename: document.getElementById(getid).placeholder

		},
		success: function(result) {
			//myChartt=undefined;
			//myChartt = echarts.init(document.getElementById('attribute_line'));
			myChartt.clear();
			myChartt.setOption({
				title: {
					text: eval(result.title.text),
				},
				tooltip: {
					trigger: 'axis'
				},
				dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
						type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
						start: 0, // 左边在 10% 的位置。
						end: 100, // 右边在 60% 的位置。
						filterMode: 'filter'
					},
					{ // 这个dataZoom组件，也控制x轴。
						type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
						start: 0, // 左边在 10% 的位置。
						end: 100, // 右边在 60% 的位置。
						filterMode: 'filter'
					}
				],
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						},
						dataView: {
							readOnly: true,
						},

						restore: {},
						saveAsImage: {}
					}
				},
				legend: {
					data: eval(result.legend.data)
				},
				xAxis: {

					data: eval(result.xAxis.data), //横坐标，一般为时间点
					axisLabel: {
						formatter: result.xAxis.formatter,
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: result.yAxis.formatter
					},
				},
				series: [{
					name: eval(result.series.name), //曲线名称，供legend使用
					type: 'line',
					data: eval(result.series.data),
					//data:data,
					markPoint: {
						data: [
							{ type: 'max', name: '最大值' },
							{ type: 'min', name: '最小值' }
						]
					},
					markLine: {
						data: [
							{ type: 'average', name: '平均值' }
						]
					}
				}]
			});
			myChartt.hideLoading();
		},
		error: function(errorMsg) {
			$.messager.alert({
				title: '提示',
				msg: '仿真数据请求失败！',
			})
		}
	})

}

//获取瞬态计算结果的曲线 --- 某种结果的图 （对象ID + 仿真ID + 属性名 ，读取我们的结果表）
function getresultline(i) {
	if($('#slect-moni').datagrid('getSelected')) {
		myChartt.showLoading();
		var getid = 'property_line' + i;
		$.ajax({
			type: 'post',
			url: 'getResultLine', //getResultLine
			data: {
				SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD, //选中的模拟记录ID
				OBJ_CD: getOBJ_CD, //对象编码
				PRJ_TYPE: cell_view.model.toJSON().modelType, //工程类别,即设备类型
				NODE_NUM: '内点0', //内点号
				Ename: document.getElementById(getid).placeholder //结果类型，是流量还是压力，是特殊结果？
			},
			success: function(result) {
				myChartt.clear();
				//myChartt=undefined;
				//myChartt = echarts.init(document.getElementById('attribute_line'));
				myChartt.setOption({
					title: {
						text: eval(result.title.text),
					},
					tooltip: {
						trigger: 'axis'
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: true,
							},

							restore: {},
							saveAsImage: {}
						}
					},
					dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
							type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
							start: 0, // 左边在 10% 的位置。
							end: 100, // 右边在 60% 的位置。
							filterMode: 'filter'
						},
						{ // 这个dataZoom组件，也控制x轴。
							type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
							start: 0, // 左边在 10% 的位置。
							end: 100, // 右边在 60% 的位置。
							filterMode: 'filter'
						}
					],
					legend: {
						data: eval(result.legend.data)
					},
					xAxis: {
						data: eval(result.xAxis.data), //横坐标，一般为时间点
						axisLabel: {
							formatter: result.xAxis.formatter,
						}
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: result.yAxis.formatter
							//formatter:'{value}m³/s'
						},
					},
					series: [{
						name: eval(result.series.name), //曲线名称，供legend使用
						type: 'line',
						data: eval(result.series.data),
						markPoint: {
							data: [
								{ type: 'max', name: '最大值' },
								{ type: 'min', name: '最小值' }
							]
						},
						markLine: {
							data: [
								{ type: 'average', name: '平均值' }
							]
						}
					}]
				});
				myChartt.hideLoading();
				//myChart.setOption(options);
			},
			error: function(errorMsg) {
				$.messager.alert({
					title: '提示',
					msg: '曲线数据请求失败！',
				})
			}
		})
	} else {

	}
}

//获取参与计算时的 设备属性  ---  某种属性的曲线（对象ID + 属性名 + 仿真ID ，读取我们的输入库）
function getenddataline(i) {
	if($('#slect-moni').datagrid('getSelected')) {
		myChartt.showLoading();
		var getid = 'property_line' + i;
		//alert(document.getElementById(getid).placeholder);
		$.ajax({
			type: 'post',
			url: 'getOldLine',
			data: {
				OBJ_CD: getOBJ_CD, //对象编码
				PRJ_TYPE: $('#devices').datagrid('getSelected').PRJ_TYPE,
				SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD, //选中的模拟记录ID
				Ename: document.getElementById(getid).placeholder //属性名
			},
			success: function(result) {
				//myChartt=undefined;
				//myChartt = echarts.init(document.getElementById('attribute_line'));
				myChartt.clear();
				myChartt.setOption({
					title: {
						text: eval(result.title.text),
					},
					legend: {
						data: eval(result.legend.data)
					},
					tooltip: {
						trigger: 'axis'
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: true,
							},

							restore: {},
							saveAsImage: {}
						}
					},
					dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
							type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
							start: 0, // 左边在 10% 的位置。
							end: 100, // 右边在 60% 的位置。
							filterMode: 'filter'
						},
						{ // 这个dataZoom组件，也控制x轴。
							type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
							start: 0, // 左边在 10% 的位置。
							end: 100, // 右边在 60% 的位置。
							filterMode: 'filter'
						}
					],
					xAxis: {
						data: eval(result.xAxis.data), //横坐标，一般为时间点
						axisLabel: {
							formatter: result.xAxis.formatter
						},
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: result.yAxis.formatter
						},
					},
					series: [{
						name: eval(result.series.name), //曲线名称，供legend使用
						type: 'line',
						data: eval(result.series.data),
						markPoint: {
							data: [
								{ type: 'max', name: '最大值' },
								{ type: 'min', name: '最小值' }
							]
						},
						markLine: {
							data: [
								{ type: 'average', name: '平均值' }
							]
						}
					}]
				});
				myChartt.hideLoading();
				//myChart.setOption(options);
			},
			error: function(errorMsg) {
				$.messager.alert({
					title: '提示',
					msg: '仿真数据请求失败！',
				})
			}
		})
	} else {

	}
}

///////////////////////////////////////////////////////////////////////////////////////////////      模拟栏
///////////////////////////////////////////////////////////////////////////////////////////////

//稳态瞬态计算变化，触发
function committypechange(id) {
	//window.alert("当前选择的设备类型为："+id.value);打印出稳态或者瞬态
	if(id.value == '1') {
		document.getElementById("SIM_TIME_LEN").disabled = false;
		document.getElementById("SIM_TIME_STEP").disabled = false;
		document.getElementById("SIM_STEP_NUM").disabled = false;
		document.getElementById("SIM_START_STR").disabled = false;
	}
	if(id.value == '0') {
		document.getElementById("SIM_TIME_LEN").disabled = true;
		document.getElementById("SIM_TIME_STEP").disabled = true;
		document.getElementById("SIM_STEP_NUM").disabled = true;
		document.getElementById("SIM_START_STR").disabled = true;
	}
}

//修改表单步长的最大值
function setbuchang() {
	document.getElementById("SIM_TIME_STEP").max = document.getElementById("SIM_TIME_LEN").value;
}

//表单提交前验证
function checkform() {
	if(document.getElementById("SIM_CAL_TYPE").value == "1") {
		var result = document.getElementById("SIM_TIME_LEN").value;
		var password = document.getElementById("SIM_TIME_STEP").value;
		if(result == "") {
			$.messager.alert({
				title: '警告',
				msg: '瞬态下仿真总时长不可为空，请输入！',
			})
			return false;
		}
		if(password == "") {
			$.messager.alert({
				title: '警告',
				msg: '步长不可为空！',
			})
			return false;
		} else {
			$.ajax({
				type: 'post',
				url: 'datagrid_data1.json',
				data: $('#monitiaojian').serialize(),
				//{
				//    ids:SIM_CDD,
				//},
				beforeSend: function() {},
				success: function(data) {
					if(data) {
						$.messager.alert({
							title: '提示',
							msg: '仿真计算成功！',
						})
					}
				},
				error: function(errorMsg) {
					$.messager.alert({
						title: '提示',
						msg: '仿真条件提交失败！',
					})
				}
			});
			return true;
		}
	} //瞬态时提交的表单
	else {
		$.ajax({
			type: 'post',
			url: 'datagrid_data1.json',
			data: $('#monitiaojian').serialize(),
			beforeSend: function() {},
			success: function(data) {
				if(data) {
					$.messager.alert({
						title: '提示',
						msg: '仿真计算成功！',
					})
				}
			},
			error: function(errorMsg) {
				$.messager.alert({
					title: '提示',
					msg: '仿真条件提交失败！',
				})
			}
		});
	} //稳态时提交的表单
}

///////////////////////////////////////////////////////////////////////////////////////////////     结果栏-->模拟记录表
///////////////////////////////////////////////////////////////////////////////////////////////

//初始化模拟记录表格
$(function() {
	$('#tt').datagrid({
		fit: true,
	})
	$('#slect-moni').datagrid({
		//width:325,
		//queryParams:{
		//    userid :1,
		//},
		method: 'post',
		height: 277,
		fit: true,
		fitColumns: true,
		url: url + 'hsbdata',
		singleSelect: true,
		collapsible: true, //按钮可折叠
		title: '仿真记录',
		remoteSort: false, //服务器排序
		multiSort: true, //多列排序
		rownumbers: true, //行号
		queryParams: {
			userid: 1,
		},
		//其余发送到服务器的参数
		//fitColumns:true,
		toolbar: '#tbb',
		columns: [
			[
				//{
				//    field:'ID',
				//    title:'',
				//    width:'80',
				//    checkbox:true,
				//},
				{
					field: 'SIM_USER_CD',
					title: '用户',
					width: 80,
					sortable: true
				},
				{
					field: 'SIM_DATE',
					title: '开始时间',
					width: 80,
					sortable: true
				},
				{
					field: 'SIM_CAL_TYPE',
					title: '水力模型',
					width: 80,
					sortable: true,
				},
				{
					field: 'SIM_DATA_TYPE',
					title: '数据来源',
					width: 80
				},
				{
					field: 'SIM_RET_STAT',
					title: '成功？',
					width: 80
				},
			]
		],
	});
})

//查找
function doSearchtwo() {
	$('#slect-moni').datagrid('load', {
		SIM_USER_CD: $.trim($('#M_user').val()),
		SIM_DATE: $('input[name="M_start"]').val(),
		SIM_CAL_TYPE: $('#M_mode').combo('getValue'),
		SIM_DATA_TYPE: $('#M_datatype').combo('getValue'),

	});
}

//赋予仿真记录表格双击事件
$(function() {
	$("#slect-moni").datagrid({
		//双击事件
		onClickRow: function(rowIndex, rowData) {
			var roww = $('#slect-moni').datagrid('getSelected');
			if(roww) {
				getSIM_CD = roww.SIM_CD;

				$('#tt').datagrid('loadData', { total: 0, rows: [] }); //清空原有数据
				var row = {
					name: '仿真编码',
					value: roww.SIM_CD,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '用户编码',
					value: roww.SIM_USER_CD,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '水力模型',
					value: roww.SIM_CAL_TYPE,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '在线/离线',
					value: roww.SIM_DATA_TYPE,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '仿真结果',
					value: roww.SIM_RET_STAT,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '仿真开始时间',
					value: roww.SIM_DATE,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '存储开始时间',
					value: roww.SIM_START_STR,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '仿真总时长',
					value: roww.SIM_TIME_LEN,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '步长',
					value: roww.SIM_TIME_STEP,
				};
				$('#tt').propertygrid('appendRow', row);
				row = {
					name: '结果存储步长',
					value: roww.SIM_STEP_NUM,
				};
				$('#tt').propertygrid('appendRow', row);
			}
		}
	})
})

//删除仿真记录
function delete_moni() {
	var roww = $('#slect-moni').datagrid('getSelected');
	if(roww) {
		$.messager.confirm('确认操作', '确认删除所选记录？', function(flag) {
			if(flag) {
				var SIM_CDD = roww.SIM_CD; //仿真编码
				$('#tt').datagrid('loadData', { total: 0, rows: [] }); //清空原有数据
				$.ajax({
					type: 'GET',
					url: url + 'deletehsb',
					data: {
						SIM_CD: SIM_CDD,
					},
					beforeSend: function() {
						$('#slect-moni').datagrid('loading');
					},
					success: function(data) {
						if(data) {
							$('#slect-moni').datagrid('loaded');
							$('#slect-moni').datagrid('reload');
							$('#slect-moni').datagrid('unselectAll');
							$.messager.show({
								title: '提示',
								msg: '删除成功。',
							})
						}
					},
				})
			} else {

			}
		});
	} else {
		$.messager.alert('提示', '请选择需要删除的记录！', 'info');
		//alert("选择需要删除的记录！");
	}
}

//刷新表格
function selectanswer() {
	//				$('#tt').datagrid('reload');
	$('#slect-moni').datagrid('reload');
	getSIM_CD = undefined;
	$('#tt').datagrid('loadData', { total: 0, rows: [] }); //清空原有数据
}

///////////////////////////////////////////////////////////////////////////////////////////////      结果栏-->模拟记录表     曲线
///////////////////////////////////////////////////////////////////////////////////////////////

//初始化结果图表
$(function() {
	myChart = echarts.init(document.getElementById('resultLine'));
	myChart.setOption({
		title: {

		},
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},
		legend: {
			data: ['压力值']
		},
		xAxis: {
			axisLabel: {
				formatter: ''
			},
			//单位
			boundaryGap: false,
			data: [],
			//alignWithLabel:true
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: ''
			},
		},
		dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
				type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
				start: 0, // 左边在 10% 的位置。
				end: 100, // 右边在 60% 的位置。
				filterMode: 'filter'
			},
			{ // 这个dataZoom组件，也控制x轴。
				type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
				start: 0, // 左边在 10% 的位置。
				end: 100, // 右边在 60% 的位置。
				filterMode: 'filter'
			}
		],
		series: [{
			name: '压力值',
			type: 'bar',
			data: []
		}]
	});
})

//获取一次模拟下的全局结果图表
function getLine() {
	if($('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 'yes' || $('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 1 || $('#slect-moni').datagrid('getSelected').SIM_RET_STAT == 'YES') {
		if($('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE == 'Steady') { //恒定流，获得压力坡度线
			myChart.showLoading();
			$.ajax({
				type: 'GET',
				url: url + 'getEnvelope',
				data: {
					SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,
					SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE
				},
				success: function(result) {
					myChart.setOption({
						title: {
							text: eval(result.title.text)
						},
						legend: {
							//data:result.legend.data
							data: eval(result.legend.data)
						},
						xAxis: {
							data: eval(result.xAxis.data)
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: result.yAxis.formatter
							},
						},
						series: [{
								name: eval(result.series.name),
								type: 'line',
								data: eval(result.series.data),
								markPoint: {
									data: [
										{ type: 'max', name: '最大值' },
										{ type: 'min', name: '最小值' }
									]
								},
								markLine: {
									data: [
										{ type: 'average', name: '平均值' }
									]
								}
							},
							{
								name: '',
								type: 'line',
								data: []
							}
						]
					});
					myChart.hideLoading();
					//myChart.setOption(options);
				},
				error: function(errorMsg) {
					$.messager.alert({
						title: '提示',
						msg: '仿真数据请求失败！',

					})
				}
			})
		}
		if($('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE == 'Transient') { //非恒定流，获得最大最小包络线
			myChart.showLoading();
			$.ajax({
				type: 'GET',
				url: url + 'getEnvelope',
				data: {
					SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,
					SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE
				},
				success: function(result) {
					//myChart.options.xAxis[0].data = eval(result.data.category);
					//myChart.options.series = eval(result.data.series);
					myChart.setOption({
						title: {
							text: eval(result.title.text)
						},
						legend: {
							data: eval(result.legend.data)
						},
						xAxis: {
							data: eval(result.xAxis.data)
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: result.yAxis.formatter
							},
						},
						series: [{
								name: eval(result.seriesone.name),
								type: 'line',
								data: eval(result.seriesone.data),
								markPoint: {
									data: [
										{ type: 'max', name: '最大值' },
										{ type: 'min', name: '最小值' }
									]
								},
								markLine: {
									data: [
										{ type: 'average', name: '平均值' }
									]
								}
							},
							{
								name: eval(result.seriestwo.name),
								type: 'line',
								data: eval(result.seriestwo.data),
								markPoint: {
									data: [
										{ type: 'max', name: '最大值' },
										{ type: 'min', name: '最小值' }
									]
								},
								markLine: {
									data: [
										{ type: 'average', name: '平均值' }
									]
								}
							}
						]
					});
					myChart.hideLoading();
					//myChart.setOption(options);
				},
				error: function(errorMsg) {
					$.messager.alert({
						title: '提示',
						msg: '仿真数据请求失败！',
					})
				}
			})
		}
	} else {
		myChart.setOption({
			title: {
				text: '当前仿真失败，无曲线！'
			},
			xAxis: {
				data: []
			},
			legend: {
				data: ['压力值']
			},
			series: [{
					name: '压力值',
					type: 'line',
					data: [],
				},
				{
					name: '最小压力值',
					type: 'line',
					data: []
				}
			]
		});
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////     对象表跟图选中图元同步
//$('#devices').datagrid('selectRow',3);
///////////////////////////////////////////////////////////////////////////////////////////////

//扩展编辑器
$.extend($.fn.datagrid.defaults.editors, {
	numberspinner: {
		init: function(container, options) {
			var input = $('<input type="text">').appendTo(container);
			return input.numberspinner(options);
		},
		destroy: function(target) {
			$(target).numberspinner('destroy');
		},
		getValue: function(target) {
			return $(target).numberspinner('getValue');
		},
		setValue: function(target, value) {
			$(target).numberspinner('setValue', value);
		},
		resize: function(target, width) {
			$(target).numberspinner('resize', width);
		}
	}
});
///////////////////////////////////////////////////////////////////////////////////////////////     修改密码
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

//控制登录部分
$(document).ready(function() {

	username = sessionStorage.getItem("username", null);
	if(username == null) {
		//	 alert("请重新登录");
		window.location = "login.html";
	};
	$("#username").val(username);

	//登出
	logout = function() {
		id = sessionStorage.getItem("id");
		date = getNowFormatDate();
		json_data = { "id": id, "date": date };
		//移除session
		sessionStorage.removeItem("id");
		sessionStorage.removeItem("username");
		$.ajax({
			type: "POST",
			url: "logout",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(json_data),
			success: function(ret_data) {
				if(ret_data == "failed_update_date") {
					alert("更新日期失败");
				} else {
					window.location = "home.html";
				}
			},
			error: function() {
				alert("更新日期失败");
			}
		});
	};
	$("#btn_modify_password").click(function() {
		if($("#password").val() != $("#confirm").val()) {
			console.log('不一样');
			$.messager.alert({
				title: '警告',
				msg: '两次输入密码不一样！！'
			});
			return;
		};
		password = $("#password").val();
		id = sessionStorage.getItem("id", null);
		pastpassword = $('#pastpassword').val();
		if(id == null || password == null) {
			$.messager.alert({
				title: '警告',
				msg: '错误,ID或者密码为空！'
			});
			alert(id);
			alert(password);
			return;
		}
		json_data = { "id": id, "password": password, "pastpassword": pastpassword };
		$.ajax({
			type: "POST",
			url: "updatepassword",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(json_data),
			success: function(ret_data) {
				if(ret_data == "old_error") {
					$.messager.alert({
						title: '警告',
						msg: '旧密码错误，请重试！'
					});
					return;
				} else if(ret_data == "failed_modify_password") {
					$.messager.alert({
						title: '警告',
						msg: '密码修改失败，请重试！'
					});
				} else {
					$('#user-management').modal('toggle');
					$.messager.show({
						title: '提示',
						msg: '密码修改成功。'
					});
				}
			},
			error: function() {
				$.messager.alert({
					title: '警告',
					msg: '密码修改失败，请重试！'
				});
			}
		});

	})

});

//document.getElementById('data-type-two').value;//0为设备属性；1为结果；2为某一次计算时的属性
//document.getElementById('data-type-two').checked;//true为在线,false为离线
function Remove() {
	$("#property div").remove();
	$("#property hr").remove();
	$("#property em").remove();
};

//--------------------2017/03/23-------------ss------------



$('#helpLi').on('click', function() {
	
	$.ajax({
		type: "post",
		url: "datagrid_data1.json",
		async: true,
		success: function(data) {
			console.log(data);
		},
		error: function(xhr, status, error) {
				
		}
	});
})

//--------------------------------------------------------------------