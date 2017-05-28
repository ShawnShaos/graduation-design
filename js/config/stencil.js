var App = App || {};
App.config = App.config || {};

(function() {

	'use strict';

	App.config.stencil = {};

	App.config.stencil.groups = {
		lj: {
			index: 1,
			label: '特殊图形'
		},
		wt: {
			index: 2,
			label: '水力图形'
		},
		//base: {
		//	index: 3,
		//	label: '基本图形'
		//},

	};

	//第三方直接映入svg图形，默认端点为左右两个
	var shape = function(paramObject) {
		var defalutParams = {
			type:'',
			img: '',
			text:'',
			pos1: 'left',
			pos2: 'right',
			width:50,
			height:75,
			imageWidth:40,
			imageHeight:60,
			dx: 0,
			dy: 0
		};
		var finalParams = _.extend(defalutParams, paramObject);

		var item = [{ //端点个数
			group: [finalParams.pos1],
		}, {
			group: [finalParams.pos2]
		}];
		if(finalParams.pos1 == null)
			item = [{
				group: [finalParams.pos2]
			}];
		else if(finalParams.pos2 == null)
			item = [{
				group: [finalParams.pos1]
			}];
		return {
			type: 'basic.Image',
			modelType:finalParams.type,
			modelText: finalParams.text,
			
			size: {
				width: finalParams.width,
				height: finalParams.height
			},
			ports: {
				groups: {
					'left': { //左端点
						position: {
							name: 'left',
							args: {
								dx: finalParams.dx,
								dy: finalParams.dy
							}

						},
						attrs: {
							place:"qacb",
							circle: {
								fill: 'red',
								stroke: 'red',
								'stroke-width': 2,
								r: 3,
								magnet: true
							}
						}
					},
					'right': { //右端点
						position: {
							name: 'right',
							args: {
								dx: finalParams.dx,
								dy: finalParams.dy
							}
						},
						attrs: {
							circle: {
								fill: '#008B00',
								stroke: '#008B00',
								'stroke-width': 2,
								r: 3,
								magnet: true
							}
						}
					},
					'top': { //上端点
						position: {
							name: 'top',
							args: {
								dx: finalParams.dx,
								dy: finalParams.dy
							}
						},
						attrs: {
							circle: {
								fill: '#008B00',
								stroke: '#008B00',
								'stroke-width': 2,
								r: 2,
								magnet: true
							}
						}
					},
					'bottom': { //下端点
						position: {
							name: 'bottom',
							args: {
								dx: finalParams.dx,
								dy: finalParams.dy
							}
						},
						attrs: {
							circle: {
								fill: '#008B00',
								stroke: '#008B00',
								'stroke-width': 2,
								r: 2,
								magnet: true
							}
						}
					},

				},
				items: item,
			},
			
			attrs: {
				'.': {
					magnet: !1,
					'data-tooltip': finalParams.text,
					'data-tooltip-position': 'left',
					'data-tooltip-position-selector': '.joint-stencil'
				},
				image: {
					width: finalParams.imageWidth,   //越小越大
					height: finalParams.imageHeight,
					'xlink:href': 'assets/svg/' + finalParams.img + '.svg'
				},
				text: {    //文本
					text: finalParams.text,
					display:'none',
					//'font-family': 'Roboto Condensed',
					//'font-weight': 'Normal',
					//'font-size': 13,
					//display: 'none',
					//stroke: '#000',
					//'stroke-width': 0,
					//'fill': '#222138'
				},

			}
		}
	};

	App.config.stencil.shapes = {};

	App.config.stencil.shapes.wt = [
		{
			type: 'app.pipe',
			size: { width: 60, height: 20 }
		},
		{
			type: 'app.culvert',
			size: { width: 60, height: 20 }
		},
		shape({
			type:'coffer',
			img: '堰',
			text:'围堰',
			dy: -1
		}),
		shape({
			type:'ctwell',
			img: '连接井',
			text:'连接井',
			dy:-1,
			dx:1
		}),
//		shape({
//			type:'elbow',
//			img: '弯头',
//			text:'弯头',
//			pos1: 'top',
//			pos2: 'bottom'
//		}),
		shape({
			type:'flow',
			img: '流量计',
			text:'流量计'	,
			dy:-1,
			dx:1
		}),
		shape({
			type:'hydturbine',
			img: '水轮机',
			text:'水轮机',
			dy:-1
		}),
		shape({
			type:'insump',
			img: '进水池',
			text:'进水池',
			dy:1,
			pos2:null
		}),
//		shape({
//			type:'mhprrp',
//			img: '发电机',
//			text:'电站',
//			dx: 1,
//			dy: -3
//		}),
		shape({
			type:'piezometer',
			img: '压力表',
			text:'压力计',
			pos1:'bottom',
			pos2:null,
			dy: -8
		}),
		shape({
			type:'outpool',
			img: '出水池',
			text:'出水池',
			pos1:'right',
			pos2:null,
			dy: 1
		}),
		shape({
			type:'overflow',
			img: '溢流池',
			text:'溢流井',
			dy:-9
		}),
		shape({
			type:'surgetank',
			img: '简单调压井',
			text:'调压井',
			pos1: null,
			pos2: 'bottom',
			dy: -8
		}),
		shape({
			type:'valve_a',
			img: '空气阀',
			text:'空气阀',
			pos1: null,
			pos2: 'top',
			dy:4
		}),
		shape({
			type:'valve_b',
			img: '球阀',
			text:'球阀',
			dy: -2
		}),
		shape({
			type:'valve_f',
			img: '蝶阀',
			text:'蝶阀',	
			dy: -1
		}),
		shape({
			type:'valve_n',
			img: '调流阀',
			text:'调流阀',	
			dy: 8
		}),
		shape({
			type:'valve_o',
			img: '超压泄压阀',
			text:'超压泄压阀',
			dy:-2,
			dx:1
		}),
		shape({
			type:'valve_o',
			img: '超压泄压阀',
			text:'超压泄压阀',
			dy:-2,
			dx:1
		}),
		shape({
			type:'was_p',
			img: '平面闸门',
			text:'平面闸门',
			dy:-1,
			dx:0
		}),
		shape({
			type:'was_p',
			img: '平面闸门',
			text:'平面闸门',
			dy:-1
		}),
		shape({
			type:'was_c',
			img: '弧形闸门',
			text:'弧面闸门',
			dy:4
		}),
		shape({
			type:'bleeder',
			img: '分水口',
			text:'分水口',
			width:60,
			height:40,
			imageWidth:60,
			imageHeight:40,
			pos1: 'left',
			pos2: 'right',
			dx:2,
			dy:1
		}),
		shape({
			type:'wiust',
			img: '取水口',
			text:'取水站',
			pos1: 'top',
			pos2: null,
			dy: 9
		}),
	];

//	App.config.stencil.shapes.base = [{
//		type: 'basic.Rect',
//		size: {
//			width: 50,
//			height: 50
//		},
//		attrs: {
//			'.': {
//				'data-tooltip': '正方形',
//				'data-tooltip-position': 'left',
//				'data-tooltip-position-selector': '.joint-stencil'
//			},
//			rect: {
//				rx: 2,
//				ry: 2,
////				width: 50,
////				height: 30,
//				fill: 'transparent',
//				stroke: '#000000',
//				'stroke-width': 2,
//				'stroke-dasharray': '0'
//			},
//			text: {
//				text: '正方形',
//				fill: '#c6c7e2',
//				'font-family': 'Roboto Condensed',
//				'font-weight': 'Normal',
//				'font-size': 11,
//				'stroke-width': 0,
//				display: 'none',
//			}
//		}
//	}];

	App.config.stencil.shapes.lj = [{
		type: 'app.Connector',
		modelText:'节点',
		size: {
			width: 15,
			height: 15
		},
		attrs: {
			'.': {
				'data-tooltip': '节点',
				'data-tooltip-position': 'left',
				'data-tooltip-position-selector': '.joint-stencil'
			},
			circle: {
				fill: '#EE7942',
				'stroke-width': 2,
				stroke: '#EE7942'
			},
			text: {
				fill: 'white',
			}
		}
	}, 
	//{
	//	type: 'basic.Rect',
    //
	//	size: {
	//		width: 5,
	//		height: 5
	//	},
	//	attrs: {
	//		'.': {
	//			'data-tooltip': '文本',
	//			'data-tooltip-position': 'left',
	//			'data-tooltip-position-selector': '.joint-stencil'
	//		},
	//		 rect: {
     //           fill: '#ffffff', stroke: 'none', rx: 5, ry: 5  //rx和ry为四角的弧度
     //      },
	//		text: {
	//			text: '文本',
	//			fill: 'black',
	//			'font-size': 20,
	//			'font-family': 'Montserrat',
	//			'font-weight': 'normal'
	//		},
	//	}
	//},
		{
			type: 'basic.Text',
			modelType: 'text',
			size: {
				width: 36,
				height: 21
			},
			attrs: {
				'.': {
					'data-tooltip': '文本',
					'data-tooltip-position': 'left',
					'data-tooltip-position-selector': '.joint-stencil'
				},
				text: {
					text: '文本',
					fill: 'black',
//						'font-size': 20,
					'font-family': 'Montserrat',
					'font-weight': 'normal'
				},
			}
		},

	];

})();