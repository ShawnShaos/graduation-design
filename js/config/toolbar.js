var App = App || {};
App.config = App.config || {};

(function() {

	'use strict';

	App.config.toolbar = {
		groups: {
			'undo-redo': {
				index: 1
			},
			'fontFamily': {
				index: 2
			},
			'fontsize': {
				index: 3
			},
			'textStyle': {
				index: 4
			}, //文字下划线加粗等
			//          'clear': { index: 2 },

			'fullscreen': {
				index: 5
			},
			'zoom': {
				index: 6
			},
			'export': {
				index: 7
			},
			'print': {
				index: 8
			},
			'connector': {
				index: 9
			},
			 'clear': { index: 10 },
			'thumbnail':{
				index: 11
			}

		},
		tools: [{
				type: 'select-box',
				name: 'fontFamily',
				group: 'fontFamily',
				width: 95,
				theme: 'modern',
				options: [
				{ value: 'Arial, Helvetica, sans-serif', content: '<span style="font-family:Arial,Helvetica,sans-serif">Arial</span>' },
				    { value: 'Georgia, serif', content: '<span style="font-family:Georgia,serif;">Georgia</span>' },
				    { value: 'Impact,Charcoal,sans-serif', content: '<span style="font-family:Impact,Charcoal,sans-serif;">Impact</span>' },
					{ value: 'FangSong', content: '<span style="font-family:FangSong">宋体</span>' },
					{ value: 'KaiTi', content: '<span style="font-family:KaiTi">楷体</span>' },
					{ value: 'SimHei', content: '<span style="font-family:SimHei">黑体</span>' },
				],
				defaultValue: 'Arial',
				  placeholder: 'N/A'

			},  {
				type: 'select-box',
				name: 'fontsize',
				group: 'fontsize',
				width: 80,
				options: [{
					content: '10px'
				}, {
					content: '12px',
					selected: true
				}, {
					content: '14px'
				}, {
					content: '16px'
				}, {
					content: '18px'
				}, {
					content: '24px'
				}, {
					content: '36px'
				}, {
					content: '48px'
				}, {
					content: '72px'
				}],
				placeholder: 'N/A'
			}, {
				type: 'select-button-group',
				name: 'textStyle',
				multi: true,
				group: 'textStyle',
				//				selected: [3],
				theme: 'modern',
				options: [
//				{
//					value: 'line-through',
//					content: '<span style="text-decoration: line-through">S</span>',
//					attrs: {
//						'.select-button-group-button': {
//							'data-tooltip': '横线',
//							'data-tooltip-position': 'top'
//						}
//					}
//				}, 
				{
					value: 'underline',
					content: '<span style="text-decoration: underline">U</span>',
					attrs: {
						'.select-button-group-button': {
							'data-tooltip': '下划线',
							'data-tooltip-position': 'top'
						}
					}
				}, {
					value: 'italic',
					content: '<span style="font-style: italic">I</span>',
					attrs: {
						'.select-button-group-button': {
							'data-tooltip': '斜杠',
							'data-tooltip-position': 'top'
						}
					}
				}, {
					value: 'bold',
					content: '<span style="font-weight: bold">B</span>',
					attrs: {
						'.select-button-group-button': {
							'data-tooltip': '加粗',
							'data-tooltip-position': 'top'
						}
					}
				}]
			}, {
				type: 'undo',
				name: 'undo',
				group: 'undo-redo',
				theme: 'modern',
				attrs: {
					button: {
						'data-tooltip': '撤销',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, {
				type: 'redo',
				name: 'redo',
				group: 'undo-redo',
				theme: 'modern',
				attrs: {
					button: {
						'data-tooltip': '恢复',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, 
			
			{
                type: 'button',
                //name: 'tojson',
                name: 'clear',
                group: 'clear',
                theme:'modern',
                attrs: {
                    button: {
                        id: 'btn-clear',
                        'data-tooltip': '清除',
                        'data-tooltip-position': 'top',
                        'data-tooltip-position-selector': '.toolbar-container'
                    }
                }
           },
			{
				type: 'button',
				name: 'svg',
				group: 'export',
				theme: 'modern',
				text: 'SVG',
				attrs: {
					button: {
						id: 'btn-svg',
						'data-tooltip': 'SVG格式打开',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, {
				type: 'button',
				name: 'png',
				group: 'export',
				theme: 'modern',
				text: 'PNG',
				attrs: {
					button: {
						id: 'btn-png',
						'data-tooltip': 'PNG格式打开',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, {
				type: 'button',
				name: 'print',
				group: 'print',
				theme: 'modern',
				attrs: {
					button: {
						id: 'btn-print',
						'data-tooltip': '打印',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, {
				type: 'zoom-to-fit',
				name: 'zoom-to-fit',
				theme: 'modern',
				group: 'zoom',
				attrs: {
					button: {
						'data-tooltip': '视图大小',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, {
				type: 'zoom-out',
				name: 'zoom-out',
				theme: 'modern',
				group: 'zoom',
				attrs: {
					button: {
						'data-tooltip': '缩小',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			},
			//          {
			//              type: 'label',
			//              name: 'zoom-slider-label',
			//              group: 'zoom',
			//              text: 'Zoom:'
			//          },
			{
				type: 'zoom-slider',
				name: 'zoom-slider',
				theme: 'modern',
				group: 'zoom'
			}, {
				type: 'zoom-in',
				name: 'zoom-in',
				theme: 'modern',
				group: 'zoom',
				attrs: {
					button: {
						'data-tooltip': '放大',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}, 
//			{
//				type: 'separator',
//				group: 'grid'
//			},
//						{  
//				type: 'button',
//				name: 'connector',    
//				group: 'connector',
//				theme: 'modern',
//				attrs: {
//					button: {
//						id: 'btn-clear',
//						'data-tooltip': '连接符',
//						'data-tooltip-position': 'top',
//						'data-tooltip-position-selector': '.toolbar-container'
//					}
//				}
//			},
			{
				type: 'separator',
				group: 'clear'
			},
			{
				type: 'button',
				name: 'layout',
				//              name: 'clear',
				group: 'thumbnail',
				theme: 'modern',
				attrs: {
					button: {
						id: 'btn-thumbnail',
						'data-tooltip': '缩略图',
						'data-tooltip-position': 'top',
						'data-tooltip-position-selector': '.toolbar-container'
					}
				}
			}
		]
	};

	if(window.self === window.top) {
		App.config.toolbar.tools.push({
			type: 'button',
			theme: 'modern',
			name: 'fullscreen',
			group: 'fullscreen',
			attrs: {
				button: {
					id: 'btn-fullscreen',
					'data-tooltip': '全屏',
					'data-tooltip-position': 'top',
					'data-tooltip-position-selector': '.toolbar-container'
				}
			}
		});
	}
})();