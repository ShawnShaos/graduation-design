/**
 * Created by Administrator on 2017/3/13.
 */

//匹配，在线/离线等按钮显示与不显示控制
function selectzero(){
    document.getElementById("hideee").style.display="inline";
    document.getElementById("dataonline").style.display="inline";
    document.getElementById("valueT").style.display="inline";
    document.getElementById("resetT").style.display="inline";
    document.getElementById("property").style.height="85%"
}
function selectone(){
    document.getElementById("hideee").style.display="none";
    document.getElementById("dataonline").style.display="none";
    document.getElementById("valueT").style.display="none";
    document.getElementById("resetT").style.display="none";
    document.getElementById("property").style.height="100%"
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//当选中OBJ对象后，改变查看的内容时触发事件，属性，结果，当时属性
function datatypeone(id){
    if( cell_view == null){
        if(id.value==0){
            selectzero();
        }
        if(id.value==1||id.value==2){
            selectone();
        }
    }//当前未选中一个设备对象
    if( cell_view != null && cell_view.model.get('type')!='basic.Text') {
        if (id.value == 0) {
            selectzero();
            Readyon_out_line();//调用函数，获取在线或者离线属性
        }//获得属性
        if (id.value == 1) {
            selectone();
            if(!$('#slect-moni').datagrid('getSelected')){
                $("#property div").remove();
                $.messager.show({
                    title:'提示',
                    msg:'请先选择一次仿真记录！'
                })
            }//提示未选中记录
            if ($('#slect-moni').datagrid('getSelected')) {
                if ($('#slect-moni').datagrid('getSelected').SIM_RET_STAT=='YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE=='Transient') {
                    $.ajax({
                        type: 'post',
                        url: 'getResultData',
                        data: {
                            OBJ_CD: getOBJ_CD,//选中的对象ID
                            SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//选中的模拟记录ID
                            SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE,
                            PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE

                            //OBJ_CD: "bf899545978b4affbd1dbc52603199a5",
                            //SIM_CD: 2,
                            //SIM_CAL_TYPE: "Steady",
                            //PRJ_TYPE:2

                        },
                        beforeSend: function () {
                        },
                        success: function (data) {
                            $("#property div").remove();
                            for (var prop in data.result_D)
                            {
                                //alert(prop + "有" + data.result_D[prop].length + "个结果类型");
                                for(var i=0 ; i<data.result_D[prop].length ; i++){
                                    //alert("第" + i + "类结果类型为：" + data.result_D[prop][i].Name);
                                    $("#property").append('<div class="input-group">'+
                                        '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.result_D[prop][i].Name + '</label>' +
                                        '<input type="text" class="form-control" id="property_line'+ i +'" disabled="true" placeholder="' + data.result_D[prop][i].Ename +'">' +
                                        '<span class="input-group-addon" style="width: 4%">'+
                                        '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getresultline('+ i +')">'+
                                        'go'+
                                        '</button>'+
                                        '</span>'+
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
                }//1,表示非恒定，结果为曲线，success接收到的data应该为结果名称；内点号
                if ($('#slect-moni').datagrid('getSelected').SIM_RET_STAT=='YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE=='Steady'){
                    $.ajax({
                        type: 'post',
                        url: 'getResultData',
                        data: {
                            OBJ_CD: getOBJ_CD,//选中的对象ID
                            SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//选中的模拟记录ID
                            SIM_CAL_TYPE: $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE,
                            PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE

                            //OBJ_CD: "bf899545978b4affbd1dbc52603199a5",
                            //SIM_CD: 2,
                            //SIM_CAL_TYPE: "Steady",
                            //PRJ_TYPE:2
                        },
                        beforeSend: function () {
                        },
                        success: function (data) {
                            $("#property div").remove();
                            for (var prop in data.result_W) {
                                for(var i=0 ; i<data.result_W[prop].length ; i++){
                                    if(data.result_W[prop][i].unit){
                                        $("#property").append('<div class="input-group">' +
                                            '<label class="input-group-addon" for="property_'+ i +'" style="width: 5%">' + data.result_W[prop][i].Name + '</label>' +
                                            '<input type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.result_W[prop][i].value + '" disabled="true">' +
                                            '<span class="input-group-addon" style="width: 5%">'+ data.result_W[prop][i].unit +'</span>' +
                                            '</div>');
                                    }else{
                                        $("#property").append('<div class="input-group">' +
                                            '<label class="input-group-addon" for="property_'+ i +'" style="width: 5%">' + data.result_W[prop][i].Name + '</label>' +
                                            '<input type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.result_W[prop][i].value + '" disabled="true">' +
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
                }//0,表示恒定,结果为值，不需要按钮
                else{
                    $("#property div").remove();
                }
            }//判断当前是否有选中一条模拟记录ID

        }//获得结果
        if (id.value == 2) {
            selectone();
            if(!$('#slect-moni').datagrid('getSelected')){
                $("#property div").remove();
                $.messager.show({
                    title:'提示',
                    msg:'请先选择一次仿真记录！'
                })
            }//提示未选中记录
            if($('#slect-moni').datagrid('getSelected')){
                $.ajax({
                    type: 'post',
                    url: 'getOldData',
                    data: {
                        OBJ_CD: getOBJ_CD,                                          //选中的对象ID
                        SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//选中的模拟记录ID
                        PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE
                    },
                    beforeSend: function () {
                    },
                    success: function (data) {
                        $("#property div").remove();
                        for(var i = 0; i < data.modify.length; i++){
                            if(data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'" style="width: 5%";>' + data.modify[i].name + '</label>' +
                                    '<input type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
                                    '<span class="input-group-addon">'+ data.modify[i].unit +'</span>' +
                                    '</div>');
                            }
                            if(!data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'"style="width: 5%">' + data.modify[i].name + '</label>' +
                                    '<input type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
                                    '<span class="input-group-addon"></span>' +
                                    '</div>');
                            }
                        }
                        for(var i=0;i < data.modifyLine.length; i++){
                            $("#property").append('<div class="input-group">'+
                                '<label class="input-group-addon" for="property_line'+ i +'">' + data.modifyLine[i].name + '</label>' +
                                '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
                                '<span class="input-group-addon">'+
                                '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline('+i+')">'+
                                'Go!'+
                                '</button>'+
                                '</span>'+
                                '</div>');
                        }
                    },
                })
            }//判断当前是否有选中一条模拟记录ID
        }//获得某次仿真的输入
    }//当前选中一个设备对象
}


//改变在线离线属性时触发事件-------------------------------------先判断是否选有选中对象状态（由按钮触发）
function on_out_line(id){
    if( cell_view == null){

    }   //非选中设备状态
    if(cell_view != null && cell_view.model.get('type')!='basic.Text'){
        if(!document.getElementById('data-type-two').checked){    //离线属性，从图元中获得设备属性
            app.property();
        }//离线属性，从图元中获得设备属性
        if(document.getElementById('data-type-two').checked){//在线属性，从基础信息库获得属性
            OnlineAttribute();  //调用获取在线属性的函数
        }//在线属性，从基础信息库获得属性
    }//选中设备状态
}


//获取当前查看在线离线设备属性-----------------------------------无需判断是否选中，由他们调用（由其他函数触发）
function Readyon_out_line(){
    if(document.getElementById('data-type-two').checked){    //离线属性，从图元中获得设备属性
        app.property();//获取离线属性
    }//离线属性，从图元中获得设备属性
    if(document.getElementById('data-type-two').checked){//在线属性，从基础信息库获得属性
       OnlineAttribute();//调用获取在线属性的函数
    }//在线属性，从基础信息库获得属性
}










////////////////////////////////////////////////-------------获取在线属性------不判断是否选中对象
function OnlineAttribute(){
    $.ajax({
        type:'post',
        url: 'matchOrNot',
        data: {
            OBJ_CD:getOBJ_CD,
        },
        //beforeSend:function(){
        //},
        success:function(data){
            if(data){
                document.getElementById("valueT").disabled = "true";
                $.ajax({
                    type:'post',
                    url:'getRealdata',
                    data:{
                        OBJ_CD:getOBJ_CD,//选中的对象ID
                        PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
                        DEVICE_CD:$('#devices').datagrid('getSelected').DEVICE_CD
                    },
                    beforeSend:function(){
                    },
                    success:function(data){
                        $("#property div").remove();
                        for(var i = 0; i < data.modify.length; i++){
                            if(data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'" style="width: 5%">' + data.modify[i].name + '</label>' +
                                    '<input name="' + data.modify[i].Ename + '"type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
                                    '<span class="input-group-addon" style="width: 5%">'+ data.modify[i].unit +'</span>' +
                                    '</div>');
                            }
                            if(!data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'"style="width: 5%">' + data.modify[i].name + '</label>' +
                                    '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'" placeholder="' + data.modify[i].value + '" disabled="true">' +
                                    '<span class="input-group-addon" style="width: 5%"></span>' +
                                    '</div>');
                            }
                        }

                        for(var i=0;i < data.modifyLine.length; i++){
                            $("#property").append('<div class="input-group">'+
                                '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
                                '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
                                '<span class="input-group-addon" style="width: 5%">'+
                                '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline('+ i +')">'+
                                'Go!'+
                                '</button>'+
                                '</span>'+
                                '</div>');
                        }
                    },
                })
            }//当前有匹配到一个设备
            if(!data){
                document.getElementById("valueT").disabled = undefined;
                $.ajax({
                    type:'post',
                    url:'getRealdata',
                    data:{
                        OBJ_CD:getOBJ_CD,//选中的对象ID
                        PRJ_TYPE:getPRJ_TYPE,
                        //PRJ_TYPE:$('#devices').datagrid('getSelected').PRJ_TYPE,
                        //DEVICE_CD:$('#devices').datagrid('getSelected').DEVICE_CD
                    },
                    beforeSend:function(){
                    },
                    success:function(data){
                        $("#property div").remove();
                        for(var i = 0; i < data.modify.length; i++){
                            if(data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'" style="width: 5%">' + data.modify[i].name + '</label>' +
                                    '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'">' +
                                    '<span class="input-group-addon" style="width: 5%">'+ data.modify[i].unit +'</span>' +
                                    '</div>');
                            }
                            if(!data.modify[i].unit){
                                $("#property").append('<div class="input-group">' +
                                    '<label class="input-group-addon" for="property_data'+ i +'"style="width: 5%">' + data.modify[i].name + '</label>' +
                                    '<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data'+ i +'">' +
                                    '<span class="input-group-addon" style="width: 5%"></span>' +
                                    '</div>');
                            }
                        }

                        for(var i=0;i < data.modifyLine.length; i++){
                            $("#property").append('<div class="input-group">'+
                                '<label class="input-group-addon" for="property_line'+ i +'" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
                                '<input type="text" class="form-control" id="property_line'+ i +'" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
                                '<span class="input-group-addon" style="width: 5%">'+
                                '<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit('+ i +')">'+
                                'Go!'+
                                '</button>'+
                                '</span>'+
                                '</div>');
                        }
                    },
                })
            }//当前未匹配到一个设备
        },
        error: function (errorMsg) {
            $.messager.alert({
                title:'提示',
                msg:'设备参数请求失败！',
            })
        }
    });
};

////////////////////////////////////////////////-------------获取离线属性------不判断是否选中对象
function OutlineAttribute(){
    app.property();
};

///////////////////////////////////////////////-------------提供判断是否选中对象，且选中的对象为非文本
function selectorNot(){
    if(cell_view != null && cell_view.model.get('type')!='basic.Text'){
        return true;
    }
    if(cell_view==null){
        return false;
    }
}
