/**
 * Created by Administrator on 2017/3/13.
 */

//ƥ�䣬����/���ߵȰ�ť��ʾ�벻��ʾ����
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

//��ѡ��OBJ����󣬸ı�鿴������ʱ�����¼������ԣ��������ʱ����
function datatypeone(id){
    if( cell_view == null){
        if(id.value==0){
            selectzero();
        }
        if(id.value==1||id.value==2){
            selectone();
        }
    }//��ǰδѡ��һ���豸����
    if( cell_view != null && cell_view.model.get('type')!='basic.Text') {
        if (id.value == 0) {
            selectzero();
            Readyon_out_line();//���ú�������ȡ���߻�����������
        }//�������
        if (id.value == 1) {
            selectone();
            if(!$('#slect-moni').datagrid('getSelected')){
                $("#property div").remove();
                $.messager.show({
                    title:'��ʾ',
                    msg:'����ѡ��һ�η����¼��'
                })
            }//��ʾδѡ�м�¼
            if ($('#slect-moni').datagrid('getSelected')) {
                if ($('#slect-moni').datagrid('getSelected').SIM_RET_STAT=='YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE=='Transient') {
                    $.ajax({
                        type: 'post',
                        url: 'getResultData',
                        data: {
                            OBJ_CD: getOBJ_CD,//ѡ�еĶ���ID
                            SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//ѡ�е�ģ���¼ID
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
                                //alert(prop + "��" + data.result_D[prop].length + "���������");
                                for(var i=0 ; i<data.result_D[prop].length ; i++){
                                    //alert("��" + i + "��������Ϊ��" + data.result_D[prop][i].Name);
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
                }//1,��ʾ�Ǻ㶨�����Ϊ���ߣ�success���յ���dataӦ��Ϊ������ƣ��ڵ��
                if ($('#slect-moni').datagrid('getSelected').SIM_RET_STAT=='YES' && $('#slect-moni').datagrid('getSelected').SIM_CAL_TYPE=='Steady'){
                    $.ajax({
                        type: 'post',
                        url: 'getResultData',
                        data: {
                            OBJ_CD: getOBJ_CD,//ѡ�еĶ���ID
                            SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//ѡ�е�ģ���¼ID
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
                }//0,��ʾ�㶨,���Ϊֵ������Ҫ��ť
                else{
                    $("#property div").remove();
                }
            }//�жϵ�ǰ�Ƿ���ѡ��һ��ģ���¼ID

        }//��ý��
        if (id.value == 2) {
            selectone();
            if(!$('#slect-moni').datagrid('getSelected')){
                $("#property div").remove();
                $.messager.show({
                    title:'��ʾ',
                    msg:'����ѡ��һ�η����¼��'
                })
            }//��ʾδѡ�м�¼
            if($('#slect-moni').datagrid('getSelected')){
                $.ajax({
                    type: 'post',
                    url: 'getOldData',
                    data: {
                        OBJ_CD: getOBJ_CD,                                          //ѡ�еĶ���ID
                        SIM_CD: $('#slect-moni').datagrid('getSelected').SIM_CD,//ѡ�е�ģ���¼ID
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
            }//�жϵ�ǰ�Ƿ���ѡ��һ��ģ���¼ID
        }//���ĳ�η��������
    }//��ǰѡ��һ���豸����
}


//�ı�������������ʱ�����¼�-------------------------------------���ж��Ƿ�ѡ��ѡ�ж���״̬���ɰ�ť������
function on_out_line(id){
    if( cell_view == null){

    }   //��ѡ���豸״̬
    if(cell_view != null && cell_view.model.get('type')!='basic.Text'){
        if(!document.getElementById('data-type-two').checked){    //�������ԣ���ͼԪ�л���豸����
            app.property();
        }//�������ԣ���ͼԪ�л���豸����
        if(document.getElementById('data-type-two').checked){//�������ԣ��ӻ�����Ϣ��������
            OnlineAttribute();  //���û�ȡ�������Եĺ���
        }//�������ԣ��ӻ�����Ϣ��������
    }//ѡ���豸״̬
}


//��ȡ��ǰ�鿴���������豸����-----------------------------------�����ж��Ƿ�ѡ�У������ǵ��ã�����������������
function Readyon_out_line(){
    if(document.getElementById('data-type-two').checked){    //�������ԣ���ͼԪ�л���豸����
        app.property();//��ȡ��������
    }//�������ԣ���ͼԪ�л���豸����
    if(document.getElementById('data-type-two').checked){//�������ԣ��ӻ�����Ϣ��������
       OnlineAttribute();//���û�ȡ�������Եĺ���
    }//�������ԣ��ӻ�����Ϣ��������
}










////////////////////////////////////////////////-------------��ȡ��������------���ж��Ƿ�ѡ�ж���
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
                        OBJ_CD:getOBJ_CD,//ѡ�еĶ���ID
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
            }//��ǰ��ƥ�䵽һ���豸
            if(!data){
                document.getElementById("valueT").disabled = undefined;
                $.ajax({
                    type:'post',
                    url:'getRealdata',
                    data:{
                        OBJ_CD:getOBJ_CD,//ѡ�еĶ���ID
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
            }//��ǰδƥ�䵽һ���豸
        },
        error: function (errorMsg) {
            $.messager.alert({
                title:'��ʾ',
                msg:'�豸��������ʧ�ܣ�',
            })
        }
    });
};

////////////////////////////////////////////////-------------��ȡ��������------���ж��Ƿ�ѡ�ж���
function OutlineAttribute(){
    app.property();
};

///////////////////////////////////////////////-------------�ṩ�ж��Ƿ�ѡ�ж�����ѡ�еĶ���Ϊ���ı�
function selectorNot(){
    if(cell_view != null && cell_view.model.get('type')!='basic.Text'){
        return true;
    }
    if(cell_view==null){
        return false;
    }
}
