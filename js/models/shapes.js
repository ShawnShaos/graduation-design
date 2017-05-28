(function(joint) {

	'use strict';

	joint.shapes.app = joint.shapes.app || {};

	joint.shapes.app.Connector = joint.shapes.basic.Circle.extend({
		defaults: _.defaultsDeep({
			type: "app.Connector",
			modelType:'node',
		}, joint.shapes.basic.Circle.prototype.defaults)
	});
	//�ܵ�
	joint.shapes.app.pipe = joint.shapes.basic.Generic.extend({
		markup: [
			'<g class="rotatable">', //����ת��
			'<g class="scalable">', //�ɱ仯��С
			'<polyline points="0,0 0,80 0,60 60,60 60,80 60,0 60,20 0,20" style="fill:white;stroke:#000000;stroke-width:1"/>',
			'</g>',
			'</g>'
		].join(''),
		portMarkup: '<circle class="port-body"/>',

		defaults: joint.util.deepSupplement({
			type: 'app.pipe',
			modelType: 'pipe',
			modelText: '管道',
			attrs: {
				'.': {
					magnet: !1,
					'data-tooltip': '管道',
					'data-tooltip-position': 'left',
					'data-tooltip-position-selector': '.joint-stencil'
				},

				text: {
					text: '管道',
				}
			},
			ports: {
				groups: {
					'out': { //�Ҷ˵�
						position: {
							name: 'absolute',
							args: {
								x: '100%',
								y: '50%'
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

					'in': { //��˵�
						position: {
							name: 'absolute',
							args: {
								x: '0%',
								y: '50%'
							}
						},
						attrs: {
							circle: {
								fill: 'red',
								stroke: 'red',
								'stroke-width': 2,
								r: 3,
								magnet: true
							}
						}
					},

				},

				items: [{
					group: ['out']
				}, {
					group: ['in']
				}],
			},

		}, joint.shapes.basic.Generic.prototype.defaults)
	});

	joint.shapes.app.culvert = joint.shapes.app.pipe.extend({

		markup: [
			'<g class="rotatable">', //����ת��
			'<g class="scalable">', //�ɱ仯��С
			'<polyline points="0,0 0,80 5,60 55,60 60,80 60,0 55,20 5,20 0,0 0,20 60,20 60,30 0,30 0,50 60,50 60,60 0,60" style="fill:white;stroke:#000000;stroke-width:1"/>',
			'</g>',
			'</g>'
		].join(''),

		defaults: _.defaultsDeep({

			type: 'app.culvert',
			modelType: 'culvert',
			modelText: '涵洞',
			attrs: {
				'.': {
					magnet: !1,
					'data-tooltip': '涵洞',
					'data-tooltip-position': 'left',
					'data-tooltip-position-selector': '.joint-stencil'
				},

				text: {
					text: '涵洞'
				}
			}
		}, joint.shapes.app.pipe.prototype.defaults)
	});

})(joint);