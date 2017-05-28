var App = App || {};
App.config = App.config || {};

(function() {

	'use strict';

	App.config.halo = {

		common_handles: [{
			name: 'remove',
			position: 'nw',
			events: {
				pointerdown: 'removeElement'
			},
			attrs: {
				'.handle': {
					'data-tooltip-class-name': 'small',
					'data-tooltip': '删除',
					'data-tooltip-position': 'right',
					'data-tooltip-padding': 15
				}
			}
		}, 
		 {
                name: 'rotate',
                position: 'sw',
                events: { pointerdown: 'startRotating', pointermove: 'doRotate', pointerup: 'stopBatch' },
                attrs: {
                    '.handle': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': '旋转',
                        'data-tooltip-position': 'right',
                        'data-tooltip-padding': 15
                    }
                }
           },
		{
			name: 'clone',
			position: 'se',
			events: {
				pointerdown: 'startCloning',
				pointermove: 'doClone',
				pointerup: 'stopCloning'
			},
			attrs: {
				'.handle': {
					'data-tooltip-class-name': 'small',
					'data-tooltip': '复制',
					'data-tooltip-position': 'right',
					'data-tooltip-padding': 15
				}
			}
		}, {
			name: 'unlink',
			position: 'w',
			events: {
				pointerdown: 'unlinkElement'
			},
			attrs: {
				'.handle': {
					'data-tooltip-class-name': 'small',
					'data-tooltip': '清除连接线',
					'data-tooltip-position': 'right',
					'data-tooltip-padding': 15
				}
			}
		}, ],
		connector_handles: [{   //连接符的快捷环绕工具条
			name: 'remove',
			position: 'nw',
			events: {
				pointerdown: 'removeElement'
			},
			attrs: {
				'.handle': {
					'data-tooltip-class-name': 'small',
					'data-tooltip': '删除',
					'data-tooltip-position': 'right',
					'data-tooltip-padding': 15
				}
			}
		}, {
			name: 'clone',
			position: 'se',
			events: {
				pointerdown: 'startCloning',
				pointermove: 'doClone',
				pointerup: 'stopCloning'
			},
			attrs: {
				'.handle': {
					'data-tooltip-class-name': 'small',
					'data-tooltip': '复制',
					'data-tooltip-position': 'right',
					'data-tooltip-padding': 15
				}
			}
		},
		 {
                name: 'link',
                position: 'e',
                events: { pointerdown: 'startLinking', pointermove: 'doLink', pointerup: 'stopLinking' },
                attrs: {
                    '.handle': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': '连接线',
                        'data-tooltip-position': 'left',
                        'data-tooltip-padding': 1
                    }
                }
            },
		]

	};

})();