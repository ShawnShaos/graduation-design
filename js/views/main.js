var App = window.App || {};

(function(_, joint) {

	'use strict';

	App.MainView = joint.mvc.View.extend({

		className: 'app',

		events: {
			'focus input[type="range"]': function(evt) {
				evt.target.blur();
			}
		},

		init: function() {

			this.initializePaper(); //初始化画板
			this.initialzeHighlight(); //高亮
			this.initializeStencil(); //左侧选择图元框
			this.initializeSelection(); //多选
			this.initializeHaloAndInspector(); //图形自由变换和属性选择器

			this.initializeNavigator();
			this.initializeToolbar(); //快捷工具条
			this.initializeKeyboardShortcuts(); //键盘快捷方式
			this.initializeTooltips(); //工具提示
			this.initializeInlineTextEditor(); //文字编辑
			this.initializeAjax(); //触发ajax及与服务器交互部分
			this.initializeParameter; //动态修改参数

			this.menu(); //顶部菜单栏目
			this.otherMenu(); //其他按钮
			//	this.test(); // 测试部分
			//			this.loadExample(); //导入测试
		},
		//初始化画板
		initializePaper: function() {
			var graph = this.graph = new joint.dia.Graph;

			var paper = this.paper = new joint.dia.Paper({
				//      el: $('#paper').css('width', 800),
				width: 700,
				height: 500,
				gridSize:10,
				drawGrid: true,
				model: graph,
				defaultLink: new joint.dia.Link({ //设置线的风格
					markup: [
						'<path class="connection" stroke="black" stroke-width="2" d="M 0 0 0 0"/>',
						'<path class="marker-source" fill="black" stroke="black" d="M 0 0 0 0"/>',
						'<path class="marker-target" fill="black" stroke="black" d="M 0 0 0 0"/>',
						'<path class="connection-wrap" d="M 0 0 0 0"/>',
						'<g class="marker-vertices"/>',
						'<g class="marker-arrowheads"/>'
					].join(''),
					router: {
						name: 'manhattan' //折线
					},
					connector: {
						name: 'rounded'
					}, //折线部分有一定弧度
				}),
				linkPinning: false, //限制线条从出发必须连接
				snapLinks: { //连线捕捉
					radius: 20
				},
				interactive: { //线条不可折叠
					vertexAdd: false
				},
				//				validateConnection: function(vs, ms, vt, mt, e, vl) {
				//
				//					if(e === 'target') { //最后接触到的端点是目标端点
				//
				//						// target requires an input port to connect
				//						//不是磁铁端口或者    返回false，不允许连接
				//						//  if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;
				//
				//						// check whether the port is being already used
				//						var portUsed = _.find(this.model.getLinks(), function(link) {
				//
				//							return(link.id !== vl.model.id &&
				//								link.get('target').id === vt.model.id &&
				//								link.get('target').port === mt.getAttribute('port'));
				//						});
				//
				//						return !portUsed;
				//
				//					} else { // e === 'source'
				//
				//						// source requires an output port to connect
				//						return ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0;
				//					}
				//				}

			});

			this.commandManager = new joint.dia.CommandManager({
				graph: graph
			});

			//			paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
			//			paper.on('cell:mousewheel', this.onMousewheel, this);

			var snaplines = this.snaplines = new joint.ui.Snaplines({
				theme: 'material',
				paper: paper,
				distance: 3
			})
			var paperScroller = this.paperScroller = new joint.ui.PaperScroller({
				paper: paper,
				autoResizePaper: true,
				padding: 30
			});

			$('#paper').append(paperScroller.el);
			paperScroller.render().center();
//			$('#paper').hide();
			//			this.graph.on('change:position', function(cell) { //当移动图元到连接线上的时候，自己弯折连接线
			//
			//				if(_.contains(obstacles, cell)) paper.findViewByModel(link).update();
			//			});
			//			var c = new joint.shapes.basic.Circle({
			//				position: {
			//					x: 350,
			//					y: 200
			//				},
			//				size: {
			//					width: 80,
			//					height: 80
			//				},
			//				attrs: {
			//					text: {
			//						text: 'Me too.',
			//						fill: '#4b4a67',
			//						'font-size': 18,
			//						'font-family': 'Montserrat'
			//					},
			//					//          circle: {
			//					//              fill: '#fe854f', stroke: 'none'
			//					//          }
			//				}
			//			});
			//			graph.addCell(c);

			//			paper.on('link:pointerdown', function(linkView, evt) {
			//				joint.ui.Halo.clear(linkView.paper);
			//				// 如果移动连接线则不会显示工具条
			//				var vel = V(evt.target);
			//				var coordinates = {
			//					x: evt.offsetX,
			//					y: evt.offsetY,
			//					width: 20,
			//					height: 20
			//				};
			//
			//				if(!vel.hasClass('marker-arrowhead') && !vel.findParentByClass('marker-vertices', linkView.el)) {
			//					createHalo(linkView, evt, coordinates);
			//				}
			//			});

			//实时保存
			//graph.on('change', function(cell) {
			//	var sendData = { Graph: JSON.stringify(this.graph.toJSON()) };
			//	$.ajax({
			//		url: 'saveGraph', //保存可二次编辑的json信息
			//		type: 'post',
			//		data: sendData,
			//		success: function(data) {
			//			console.log(data);
			//		},
			//		error: function(xhr, status, error) {
			//
			//		}
			//	});
			//},this);

		},

		//高亮
		initialzeHighlight: function() {
			this.paper.on('blank:pointerdown', function(cellView) {
				if(cell_view != null) {
					cell_view.unhighlight();
					cell_view = null;
				};
			});
			this.graph.on('change:size', function(cell) { //改变大小的时候重新绘制高亮区域
				var cellView = this.paper.findViewByModel(cell);
				cellView.unhighlight();
				cellView.highlight();
			}, this);
			this.graph.on('change:angle', function(cell) { //改变大小的时候重新绘制高亮区域
				var cellView = this.paper.findViewByModel(cell);
				cellView.unhighlight();
				cellView.highlight();
			}, this);

		},

		//左侧选择图元框
		initializeStencil: function() {
			var stencil = this.stencil = new joint.ui.Stencil({
				paper: this.paperScroller,
				snaplines: this.snaplines,
				scaleClones: true,

				groups: App.config.stencil.groups,
				dropAnimation: true, //返回动画
				groupsToggleButtons: true,
				search: {
					'*': ['type', 'attrs/text/text', 'attrs/.label/text'],
					'org.Member': ['attrs/.rank/text', 'attrs/.name/text']
				},
				label: "图元选择框",
				//layout:true,
				layout: {
					rowHeight: 70,
					resizeToFit: false, //显示定义时的大小
				},

				paperPadding: 5,
				dragStartClone: function(cell) {
					return cell.clone().removeAttr('./data-tooltip');
				}
			});

			$('#stencil-container').append(stencil.el);

			stencil.render().load(App.config.stencil.shapes);
		},

		initializeNavigator: function() {
			//			var nav = new joint.ui.Navigator({
			//				paperScroller: this.paperScroller,
			//				width: 200,
			//				height: 200,
			//				padding: 10,
			//				zoomOptions: {
			//					max: 2,
			//					min: 0.2
			//				}
			//			});
			//			nav.$el.appendTo('#navigator');
			//			nav.render();
		},

		//多选
		initializeSelection: function() {
			this.clipboard = new joint.ui.Clipboard();
			this.selection = new joint.ui.Selection({
				theme: 'material',
				paper: this.paper
			});

			this.paper.on('blank:pointerdown', function(evt, x, y) {

				if(this.keyboard.isActive('shift', evt)) {
					this.selection.startSelecting(evt);
				} else {
					this.selection.cancelSelection();
					this.paperScroller.startPanning(evt, x, y);
				}

			}, this);

			this.paper.on('cell:pointerdown', function(elementView, evt) {

				if(this.keyboard.isActive('ctrl meta', evt)) {
					this.selection.collection.add(elementView.model);
				}

			}, this);

			this.selection.on('selection-box:pointerdown', function(elementView, evt) {

				if(this.keyboard.isActive('ctrl meta', evt)) {
					this.selection.collection.remove(elementView.model);
				}

			}, this);
		},

		//图形自由变换和属性选择器
		initializeHaloAndInspector: function() {
			this.paper.on('cell:pointerdown', function(cellView) { //单击图元
				this.highlightAndHaloCommon(cellView);
			}, this);

			this.paper.on('link:pointerdown', function(cellView, evt) {
				joint.ui.Halo.clear(cellView.paper);
				// display no halo if user drags either source or target.
				var vel = V(evt.target);
				var coordinates = {
					x: evt.offsetX,
					y: evt.offsetY,
					width: 20,
					height: 20
				};

				if(!vel.hasClass('marker-arrowhead') && !vel.findParentByClass('marker-vertices', cellView.el)) {
					var cell = cellView.model;

					var options = {
						theme: 'modern',
						cellView: cellView,
						bbox: coordinates, //盒子的位置
						rotateAngleGrid: 2,
						type: {
							'link': 'toolbar'
						}[cell.get('type')],
					};
					var halo = new joint.ui.Halo(options);
					halo.removeHandle('direction');
					halo.render();
				}
			});
			//右键
			this.paper.on('cell:contextmenu', function(cellView, evt) { //图元右键单击事件
				var cell = cellView.model;

				getOBJ_CD = cell.toJSON().id;
				getOBJ_CD = getOBJ_CD.substring(0, 8) + getOBJ_CD.substring(9, 13) + getOBJ_CD.substring(14, 18) + getOBJ_CD.substring(19, 23) + getOBJ_CD.substring(24, 36);
				//alert(getOBJ_CD);
				if(cell.isElement()) {

					var id = cell.toJSON().id;
					//					var textModel = cell.toJSON().attrs.text.text; //文本

					// 编辑内容（属性）
					var inspector = new joint.ui.Inspector({
						theme: 'modern',
						cellView: cellView,
						live: false, //不立即更新
						inputs: {
							'id': {
								type: 'text',
								label: '图元ID',
								index: 1,
							},

							'modelText': {
								type: 'text',
								label: '图元名称',
								index: 2,
							}
							//,
							//'equipmentId': {
							//	type: 'text',
							//	label: '设备ID',
							//	index: 3
							//},
							//'equipmentName': {
							//	type: 'text',
							//	label: '设备名称',
							//	index: 4
							//}
						}
					});

					var dialog = new joint.ui.Dialog({
						theme: 'modern',
						type: 'info',
						width: 350,
						title: '设备属性',
						closeButton: true,

						content: inspector.render().$el,
						//												content: '<form action="" method="get">' +
						//													'<label>图元名称:</label><br/>' +
						//													'<input type="text" name="id" value="' + id + '"/><br/>' +
						//													'<label>设备id:</label><br/>' +
						//													'<input type="text" name="textModel" value="' + textModel + '"/><br/>' +
						//													'</form>',
						buttons: [{
							content: '取消',
							action: 'cancel'
						}, {
							content: '确定',
							action: 'apply'
						}]
					});
					//<a data-toggle="modal"  data-target="#TandDevice" href="#">测试</a>
					dialog.on({
						'action:cancel': function() {
							inspector.remove();
							dialog.close();
						},
						'action:apply': function() {
							var cellId = cell.get("id"); //图元id
							//var cellName = cell.get("attrs").text.text; //图元名称
							//var cellNAME =  cell.get("modelText");//
							//var cellNAME = cell_view.model.toJSON().modelText;
							var cellNAME = $(".joint-dialog input[type=text]").eq(1).val();
							//alert(cellNAME);
							var epId = cell.get("equipmentId"); //设备id
							var epName = cell.get("equipmentName"); //设备名称
							//var sendDate = '{"cellId":"' + cellName + '","PEL_NM":"' + cellName + '"}';

							//右键弹出框确定后的ajax。传递图元名称和设备名称
							$.ajax({
								url: 'updatehob', //增加的url
								type: 'post',
								data: {
									OBJ_CD: cellId.substring(0, 8) + cellId.substring(9, 13) + cellId.substring(14, 18) + cellId.substring(19, 23) + cellId.substring(24, 36),
									//PEL_NM:cell_view.model.toJSON().modelText
									PEL_NM: cellNAME
								},
								success: function(data) {
									$('#devices').datagrid('reload');
									selectobj();
									inspector.updateCell();
									inspector.remove();
									dialog.close();
								},
								error: function(xhr, status, error) {}
							});
						}
					});
					dialog.open();
				}
			});
		},

		//工具提示
		initializeTooltips: function() {
			new joint.ui.Tooltip({
				theme: 'material',
				rootTarget: document.body,
				target: '[data-tooltip]',
				direction: 'auto',
				padding: 10
			});
		},

		//键盘快捷方式
		initializeKeyboardShortcuts: function() {
			this.keyboard = new joint.ui.Keyboard();
			this.keyboard.on({

				'ctrl+c': function() { //复制快捷键		

					this.clipboard.copyElements(this.selection.collection, this.graph);
				},

				'ctrl+v': function() { //粘贴快捷键

					var pastedCells = this.clipboard.pasteCells(this.graph, {
						translate: {
							dx: 20,
							dy: 20
						},
						useLocalStorage: true
					});

					var elements = _.filter(pastedCells, function(cell) {
						return cell.isElement();
					});

					this.selection.collection.reset(elements);
				},

				'ctrl+x shift+delete': function() { //剪切
					this.clipboard.cutElements(this.selection.collection, this.graph);
				},

				'delete backspace': function(evt) { //删除
					evt.preventDefault();
					this.graph.removeCells(this.selection.collection.toArray());
				},

				'ctrl+z': function() { //撤销
					this.commandManager.undo();
					this.selection.cancelSelection();
				},

				'ctrl+y': function() { //恢复
					this.commandManager.redo();
					this.selection.cancelSelection();
				},

				'ctrl+a': function() { //全选
					this.selection.collection.reset(this.graph.getElements());
				},

				'ctrl+plus': function(evt) { //画板扩大
					evt.preventDefault();
					this.paperScroller.zoom(0.2, {
						max: 5,
						grid: 0.2
					});
				},

				'ctrl+minus': function(evt) { //画板缩小
					evt.preventDefault();
					this.paperScroller.zoom(-0.2, {
						min: 0.2,
						grid: 0.2
					});
				},

				'keydown:shift': function(evt) {
					this.paperScroller.setCursor('crosshair');
				},

				'keyup:shift': function() {
					this.paperScroller.setCursor('default');
				}

			}, this);
		},

		//快捷工具条
		initializeToolbar: function() {
			var toolbar = this.toolbar = new joint.ui.Toolbar({
				groups: App.config.toolbar.groups,
				tools: App.config.toolbar.tools,
				references: {
					paperScroller: this.paperScroller,
					commandManager: this.commandManager
				}
			});
			toolbar.on({
				'layout:pointerclick': _.bind(this.thumbnailView, this),
				'tojson:pointerclick': _.bind(this.toJSON, this),
				'svg:pointerclick': _.bind(this.openAsSVG, this),
				'png:pointerclick': _.bind(this.openAsPNG, this),
				'fullscreen:pointerclick': _.bind(joint.util.toggleFullScreen, joint.util, document.body),
				'clear:pointerclick': _.bind(this.graph.clear, this.graph),
				'print:pointerclick': _.bind(this.paper.print, this.paper),
				//'connector:pointerclick': _.bind(this.addConnector, this),
				'textStyle:option:select': _.bind(this.textStyle, this),
				'fontsize:option:select': _.bind(this.fontsize, this),
				'fontFamily:option:select': _.bind(this.fontFamily, this)
			});
			toolbar.$el.appendTo('#toolbar');
			toolbar.render();
			//			var s = new joint.ui.SelectBox();
			//			s = toolbar.getWidgetByName('fontsize');
			//			console.log(toolbar.getWidgets());
		},

		////////////////////////////////////////////////////////////////////////////////////////工具栏函数
		//字体
		fontFamily: function(option, index, opt) { //字体
			if(opt && opt.ui) {
				this.setCurrentAnnotation(option.value, undefined, undefined);
				joint.ui.TextEditor.setCaret({
					silent: true
				});
			}
		},
		//字体大小
		fontsize: function(option, index, opt) {
			if(opt && opt.ui) {
				this.setCurrentAnnotation(undefined, option.content, undefined);
				joint.ui.TextEditor.setCaret({
					silent: true
				});
			}
		},
		//字体风格，下划线，粗体和斜体
		textStyle: function(selection, index, opt) {
			var arrays = [];
			for(var i = 0; i < selection.length; i++)
				arrays.push(selection[i].value);
			if(opt && opt.ui) {
				this.setCurrentAnnotation(undefined, undefined, arrays);
				joint.ui.TextEditor.setCaret({
					silent: true
				});
			}
			arrays = null; //释放变量
		},

		openAsSVG: function() {

			this.paper.toSVG(function(svg) {
				new joint.ui.Lightbox({
					title: '(点击右键另存为SVG格式)',
					image: 'data:image/svg+xml,' + encodeURIComponent(svg)
				}).open();
			}, {
				preserveDimensions: true,
				convertImagesToDataUris: true
			});
		},

		openAsPNG: function() {

			this.paper.toPNG(function(dataURL) {
				new joint.ui.Lightbox({
					title: '(点击右键另存为PNG格式)',
					image: dataURL
				}).open();
			}, {
				padding: 10
			});
		},

		//保存为json格式
		toJSON: function() {

			var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
			var windowName = _.uniqueId('json_output');
			var jsonWindow = window.open('', windowName, windowFeatures);

			var model = this.graph.toJSON().cells;
			var length = model.length;

			var modelJSON = '{"model":[';
			var linkJSON = '{"link":[';
			for(var i = 0; i < length; i++) {
				if(model[i].type == 'link') {

					linkJSON += '{"source":"' + model[i].source.id + '","target":"' + model[i].target.id + '"},';
				} else {

					//	modelJSON += '{"type":"' + model[i].source.id + '","target":"' + model[i].target.id + '"},';
				}

			}
			linkJSON = linkJSON.substr(0, linkJSON.length - 1) + ']}';
			modelJSON = modelJSON.substr(0, modelJSON.length - 1) + ']}';

			//			var a = {
			//				"a": [{
			//					'type': 'ss',
			//					'id': '123'
			//				}]
			//			};
			//			var b = {
			//				"link": [{
			//					'type': 'ss',
			//					'id': '123'
			//				}, {
			//					'type': 'ss',
			//					'id': '123'
			//				}]
			//			};
			//			var c = $.extend({}, a, b);
			//			console.log(JSON.stringify(c));
			//			console.log(model);
			jsonWindow.document.write(JSON.stringify(this.graph.toJSON()));

			//			//2017/3/2测试用
			//			var sendData = { Graph: JSON.stringify(this.graph.toJSON()) };
			//			$.ajax({
			//				url: 'saveGraph', //保存二次编辑的json
			//				type: 'post',
			//				data: sendData,
			//				success: function(data) {
			//					console.log(data);
			//				},
			//				error: function(xhr, status, error) {
			//
			//				}
			//			});
			//			console.log(this.graph.toJSON().cells.length);

			//			console.log(this.graph.toJSON().cells[i].modelType);
			//			var sendJson = {};
			//			var res = [];
			//			var json = {};
			//			for(var i = 0; i < toJson.length; i++) {
			//				if(!json[toJson[i].modelType]) {
			//					res.push(toJson[i].modelType);
			//					json[toJson[i].modelType] = 1;
			//				}
			//			}
			//			for(var i = 0; i < res.length; i++) {
			//				sendJson[res[i]] = {};
			//				for(var j = 0; j < toJson.length; j++) {
			//					if(toJson[j].modeltype == res[i]) {
			//						var id = toJson.id;
			//						var property = {};
			//						for(var key in toJson.modify) {
			//							property[key] = toJson.modify[key];
			//						}
			//							console.log(property);
			//					}
			//				}
			//			}
			//			var json = {};
			//			for(var i = 0; i < this.graph.toJSON().cells.length; i++) {
			//					json[this.graph.toJSON().cells[i]]='s';
			//			}
			//			console.log(res);
			//return res;   //不重复的图元名称
			//			for(var i = 0; i < res.length; i++) {
			//				for(var j = 0; j < this.graph.toJSON().cells.length; j++) {
			//						if(this.graph.toJSON().cells[j].modelType ==  res[i])
			//						
			//				}
			//			}
		},
		//////////////////////////////////////////////////////////////////////////////////////////

		//文字编辑
		initializeInlineTextEditor: function() {

			//双击鼠标时
			this.paper.on('cell:pointerdblclick', function(cellView, evt) {

				var editor = joint.ui.TextEditor.edit(evt.target, {
					annotateUrls: true,
					cellView: cellView,
					annotationsProperty: 'attrs/text/annotations',
					textProperty: 'attrs/text/text' //文字属性

					//textProperty: cellView.model.isLink() ? 'labels/0/attrs/text/text' : 'attrs/text/text'
				});
				if(editor) {
					editor.on('caret:change', updateToolbar); //改变文字时更新快捷小部件
					editor.on('select:changed', updateToolbar); //更改对应小部件的时候变化文字
				}
			});

			//单击空白部分！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！当一个图元为选中状态时，完成文字编辑后单击空白，该图元还为选中状态或者是未选中状态？
			this.paper.on('blank:pointerdown', function(cellView, evt) {
				joint.ui.TextEditor.close();
			});

			//根据文字多少自动更新文本框大小
			this.graph.on({
				'change:attrs': _.bind(this.autosize, this)
			});
		},

		//根据文字自动调整图元大小
		autosize: function(element) {

			var view = this.paper.findViewByModel(element);
			view.unhighlight();
			var text = view.$('text')[0];

			var bbox = V(text).bbox(true);

			element.resize(bbox.width, bbox.height);
		},

		//加载例子（测试部分
		loadExample: function(prj_ID) {
			var graph = this.graph;
			$.ajax({
				url: 'getGraph', //保存可二次编辑的json信息
				type: 'post',
				data: {
					PRJ_CD: PRJ_CD
				},
				success: function(data) {

					if(data != null || data != undefined || data != '') {

						graph.fromJSON(JSON.parse(data));
					}
				},
				error: function(xhr, status, error) {

				}
			});

		},

		//更新快捷栏文字部分功能
		//		updateToolbar: function() {
		//			var attrs = joint.ui.TextEditor.getSelectionAttrs([defaultAnnotation].concat(joint.ui.TextEditor.findAnnotationsInSelection()));
		//
		//			if(attrs.fill) {
		//				textColor.selectByValue(attrs.fill);
		//			} else {
		//				textColor.select(-1);
		//			}
		//			if(attrs['font-size']) {
		//				fontSize.selectByValue(attrs['font-size'] + 'px');
		//			} else {
		//				fontSize.select(-1);
		//			}
		//			if(attrs['font-family']) {
		//				fontFamily.selectByValue(attrs['font-family']);
		//			} else {
		//				fontFamily.select(-1);
		//			}
		//			textStyle.deselect();
		//			if(_.isUndefined(attrs['font-weight'])) {
		//				textStyle.fontWeightUndefined = true;
		//			}
		//			if(_.isUndefined(attrs['text-decoration'])) {
		//				textStyle.textDecorationUndefined = true;
		//			}
		//			if(_.isUndefined(attrs['font-style'])) {
		//				textStyle.fontStyleUndefined = true;
		//
		//			} else {
		//				if(attrs['font-weight'] === 'bold') textStyle.selectByValue('bold');
		//				if(attrs['text-decoration'] === 'underline') textStyle.selectByValue('underline');
		//				if(attrs['font-style'] === 'italic') textStyle.selectByValue('italic');
		//			}
		//		},

		//根据快捷键改变文字属性
		setCurrentAnnotation: function(_fontFamily, _fontSize, _textStyle) {

			console.log(_fontFamily);
			//      var _textStyle = textStyle.getSelectionValue();
			//      var _textColor = textColor.getSelectionValue();
			//      var _fontSize = fontSize.getSelectionValue();
			//      var _fontFamily = fontFamily.getSelectionValue();
			//
			var defaultAnnotation = { //默认的属性
				attrs: {
					'font-size': 15,
					'font-weight': 'normal',
					'text-decoration': 'none',
					'font-style': 'normal',
					'font-family': 'Helvetica'
				}
			};

			var attrs = _.clone(defaultAnnotation.attrs);
			console.log(attrs);
			if(_.isUndefined(_fontSize)) {
				delete attrs['font-size'];
			} else {
				attrs['font-size'] = parseInt(_fontSize, 10);
			}
			if(_.isUndefined(_fontFamily)) {
				delete attrs['font-family'];
			} else {

				attrs['font-family'] = _fontFamily;
			}
			//      if (_.isUndefined(_textColor)) {
			//          delete attrs['fill'];
			//      } else {
			//          attrs['fill'] = _textColor;
			//      }
			//
			if(_.contains(_textStyle, 'bold')) {
				attrs['font-weight'] = 'bold';
			}
			if(_.contains(_textStyle, 'italic')) {
				attrs['font-style'] = 'italic';
			}
			if(_.contains(_textStyle, 'underline')) {
				attrs['text-decoration'] = 'underline';
			}
			//
			//      //textStyle.fontWeightUndefined = false;
			//      //textStyle.fontStyleUndefined = false;
			//      //textStyle.textDecorationUndefined = false;
			//
			//      // If some text is selected and the user changes an attribute via the toolbar,apply this change on the selected text.Otherwise, set the current annotation so that the very next insert will use it for the inserted text. 
			//   
			var selectionLength = joint.ui.TextEditor.getSelectionLength();
			var range = joint.ui.TextEditor.getSelectionRange();

			if(selectionLength > 0) {
				var newAnnotation = {
					start: range.start,
					end: range.end,
					attrs: attrs
				};
				var annotations = joint.ui.TextEditor.getAnnotations() || [];
				joint.ui.TextEditor.applyAnnotations(annotations.concat(newAnnotation));
			} else {
				joint.ui.TextEditor.setCurrentAnnotation(attrs);
			}
		},

		menu: function() {
			var graph = this.graph;
			var paperScroller = this.paperScroller;
			var paper = this.paper;

			var commandManager = new joint.dia.CommandManager({
				graph: graph
			});
			$("#undo").click(function() { //后退
				//alert('后退？');
				commandManager.undo();
			});
			$("#redo").click(function() { //前进
				commandManager.redo();
			});

			$('#zoom-in').on('click', function() { //缩小
				paperScroller.zoom(0.2, {
					max: 4
				});
			});
			$('#zoom-out').on('click', function() { //放大
				paperScroller.zoom(-0.2, {
					min: 0.2
				});
			});

			$('#zoom50').on('click', function() {

				paperScroller.zoomToFit();
			});

			var flag = 0;
			$('#showGrid').on('click', function() {
				if(flag == 0) {
					paper.setGridSize(10);
					$('#showGrid').html('<i class="icon-th"></i>&nbsp;&nbsp;关闭网格');
					flag = 1;
				} else {
					paper.setGridSize(1);
					$('#showGrid').html('<i class="icon-th"></i>&nbsp;&nbsp;显示网格');
					flag = 0;
				}
			}); //显示网格

			$('#clearGrid').on('click', function() { //视图重置

				graph.clear();
			});

			//保存菜单
			$('#save').on('click', function() {
				//				var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
				//				var windowName = _.uniqueId('json_output');
				//				var jsonWindow = window.open('', windowName, windowFeatures);
				//				jsonWindow.document.write(JSON.stringify(graph.toJSON()));
				var sendData = {
					PRJ_CD: PRJ_CD,
					Graph: JSON.stringify(graph.toJSON())
				};
				$.ajax({
					url: 'saveGraph', //保存可二次编辑的json信息
					type: 'post',
					data: sendData,
					success: function(data) {
						console.log(data);
						$.messager.show({
							title: '提示',
							msg: '工程图保存成功！'
						})
					},
					error: function(xhr, status, error) {

					}
				});
			});

			//剪切菜单
			var clipboard = this.clipboard;
			var selection = this.selection;
			$('#cut').on('click', function() {
				clipboard.cutElements(selection.collection, graph);
			});

			//复制菜单
			$('#copy').on('click', function() {
				clipboard.copyElements(selection.collection, graph);
			});

			//粘贴菜单
			$('#paste').on('click', function() {
				var pastedCells = clipboard.pasteCells(graph, {
					translate: {
						dx: 20,
						dy: 20
					},
					useLocalStorage: true
				});

				var elements = _.filter(pastedCells, function(cell) {
					return cell.isElement();
				});

				selection.collection.reset(elements);
			});

			//全选菜单
			$('#checkAll').on('click', function() {
				selection.collection.reset(graph.getElements());
			});

			//删除
			$('#delete').on('click', function(evt) {
				evt.preventDefault();
				graph.removeCells(selection.collection.toArray());
			});

			//点击计算按钮时
			$('#checkform').on('click', function() {
				var toJson = graph.toJSON().cells;
				console.log(toJson);
				var pipe = [], //管道 
					culvert = [], //涵洞
					node = [], // 节点 
					coffer = [], //
					ctwell = [], //
					elbow = [], //
					flow = [], //
					hydturbine = [], //
					insump = [], //
					mhprrp = [], //
					piezometer = [], //
					outpool = [], //
					overflow = [], //
					surgetank = [], //
					valve_a = [], //
					valve_b = [], //
					valve_f = [], //
					valve_n = [], //
					valve_o = [], //
					was_p = [], //
					was_c = [], //
					bleeder = [], //
					wds = [], //
					wiust = []; //
				console.log(document.getElementById('SIM_DATA_TYPE').value);
				if(document.getElementById('SIM_DATA_TYPE').value == 0) { //离线计算模式下
					for(var i = 0; i < toJson.length; i++) {
						var temp = {};
						temp['OBJ_CD'] = toJson[i].id;
						temp['property'] = {};
						for(var key in toJson[i].modify) {
							temp['property'][key] = toJson[i].modify[key].value;
						}
						switch(toJson[i].modelType) {
							case 'pipe':
								pipe.push(temp);
								break;
							case 'culvert':
								culvert.push(temp);
								break;
							case 'node':
								node.push(temp);
								break;
							case 'coffer':
								coffer.push(temp);
								break;
							case 'ctwell':
								ctwell.push(temp);
								break;
							case 'elbow':
								elbow.push(temp);
								break;
							case 'flow':
								flow.push(temp);
								break;
							case 'hydturbine':
								hydturbine.push(temp);
								break;
							case 'insump':
								insump.push(temp);
								break;
							case 'mhprrp':
								mhprrps.push(temp);
								break;
							case 'piezometer':
								piezometer.push(temp);
								break;
							case 'outpool':
								outpool.push(temp);
								break;
							case 'overflow':
								overflow.push(temp);
								break;
							case 'surgetank':
								surgetank.push(temp);
								break;
							case 'valve_a':
								valve_a.push(temp);
								break;
							case 'valve_b':
								valve_b.push(temp);
								break;
							case 'valve_f':
								valve_f.push(temp);
								break;
							case 'valve_n':
								valve_n.push(temp);
								break;
							case 'was_p':
								was_p.push(temp);
								break;
							case 'was_c':
								was_c.push(temp);
								break;
							case 'bleeder':
								bleeder.push(temp);
								break;
							case 'wds':
								wds.push(temp);
								break;
							case 'wiust':
								wiust.push(temp);
								break;
						}
					}
				}
				var send = {};
				send['pipe'] = pipe;
				send['culvert'] = culvert;
				send['node'] = node;
				send['coffer'] = coffer;
				send['ctwell'] = ctwell;
				send['elbow'] = elbow;
				send['hydturbine'] = hydturbine;
				send['insump'] = insump;
				send['mhprrp'] = mhprrp;
				send['piezometer'] = piezometer;
				send['outpool'] = outpool;
				send['overflow'] = overflow;
				send['surgetank'] = surgetank;
				send['valve_a'] = valve_a;
				send['valve_b'] = valve_b;
				send['valve_f'] = valve_f;
				send['valve_n'] = valve_n;
				send['valve_o'] = valve_o;
				send['was_p'] = was_p;
				send['was_c'] = was_c;
				send['bleeder'] = bleeder;
				send['wds'] = wds;
				send['wiust'] = wiust;

				var condition = {};
				condition['SIM_CAL_TYPE'] = document.getElementById('SIM_CAL_TYPE').value; // 水力模式，长度为一个字符，约束（0:恒定,1:非恒定）
				condition['SIM_DATA_TYPE'] = document.getElementById('SIM_DATA_TYPE').value; // 数据来源，长度为一个字符，约束（0:离线,1:在线）
				condition['SIM_TIME_LEN'] = document.getElementById('SIM_TIME_LEN').value; // 仿真总时长，保留小数点后3位
				condition['SIM_TIME_STEP'] = document.getElementById('SIM_TIME_STEP').value; // 仿真时间步长,保留小数点后3位
				condition['SIM_START_STR'] = document.getElementById('SIM_START_STR').value; // 存储开始时间,保留小数点后3位
				condition['SIM_STEP_NUM'] = document.getElementById('SIM_STEP_NUM').value; // 存储步长数

				send['condition'] = condition;
				console.log(send);
				//				$.ajax({
				//					url: '', //计算时的url
				//					type: 'GET',
				//					data: send,
				//					success: function(data) {
				//
				//					},
				//					error: function(xhr, status, error) {
				//
				//					}
				//				});
			});
		},

		otherMenu: function() {

			//属性，结果，仿真参数
			$("#data-type-one").bind({ change: this.property }); //绑定下面的函数

			//在线离线按钮
			$("#dataonline").bind({ click: this.property }); //绑定下面的函数

			// 离线下 提交属性！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！未分在线或者离线情况下的提交属性（注意加判断）
			$('#valueT').on('click', function(evt) {
				if(document.getElementById('data-type-two').checked) {
					//alert('提交的为在线属性');
				}; //true为在线,false为离线
				if(!document.getElementById('data-type-two').checked) {
					//alert('提交的为离线属性');
					var form = document.getElementById("property");
					var tagElements = form.getElementsByTagName('input');

					//第一个input隐藏了设备名和设备id
					//				var type = tagElements[0].name; //设备类型
					//				var Did = tagElements[0].value; //属性id
					//	var data = '{"type":"' + type + '","Did":"' + Did + '","property":[';
					//				var data = '{"property":[';
					//				for(var j = 0; j < tagElements.length; j++) {
					//					var name = tagElements[j].name; //属性的名称（英文）
					//					var value = tagElements[j].value; //输入的值
					//					data += '{"":"' + name + '","":"' + value + '"},';
					//				}
					//				data = data.substr(0, data.length - 1) + ']}';
					//				var sendData= JSON.parse(data);

					//				console.log(sendData);
					//
					//				$.ajax({
					//					url: '', //提交属性时的url
					//					type: 'GET',
					//					data: sendData,
					//					success: function(data) {
					//
					//					},
					//					error: function(xhr, status, error) {
					//
					//					}
					//				});

					var propertyNew = cell_view.model.toJSON().property;
					for(var j = 0; j < tagElements.length; j++) {
						var value = tagElements[j].value; //输入的值
						if(propertyNew.modify[j] != undefined) {
							propertyNew.modify[j].value = value;
						}
					}
					cell_view.model.prop('property', propertyNew);
				}
			});

			//重置属性！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需要绑定其他函数吗？
			$("#resetT").bind({ click: this.property }); //绑定下面的函数

		},

		//已选中图元时，转换在线离线时触发
		property: function() {
			if($('#data-type-one').children('option:selected').val() == 0) {
				if(cell_view != null && cell_view.model.get('type') != 'basic.Text') {
					if(document.getElementById('data-type-two').checked) { //在线模式下
						Remove();
						var cellId = cell_view.model.toJSON().id; //图元id
						var type = cell_view.model.toJSON().modelType; //图元类型
						var sendData = { PRJ_TYPE: type, OBJ_CD: cellId.substring(0, 8) + cellId.substring(9, 13) + cellId.substring(14, 18) + cellId.substring(19, 23) + cellId.substring(24, 36) };
						$.ajax({
							type: 'post',
							url: 'matchOrNot',
							data: {
								OBJ_CD: cellId.substring(0, 8) + cellId.substring(9, 13) + cellId.substring(14, 18) + cellId.substring(19, 23) + cellId.substring(24, 36),
							},
							beforeSend: function() {},
							success: function(data) {
								if(data) {
									document.getElementById("valueT").disabled = "true";
									$.ajax({
										type: 'post',
										url: 'getRealdata',
										data: sendData,
										beforeSend: function() {},
										success: function(data) {
											Remove();
											for(var i = 0; i < data.modify.length; i++) {
												if(data.modify[i].unit) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%">' + data.modify[i].name + '</label>' +
														'<input name="' + data.modify[i].Ename + '"type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
														'<span class="input-group-addon" style="width: 5%">' + data.modify[i].unit + '</span>' +
														'</div>');
												}
												if(!data.modify[i].unit) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
														'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
														'<span class="input-group-addon" style="width: 5%"></span>' +
														'</div>');
												}
											}

											for(var i = 0; i < data.modifyLine.length; i++) {
												$("#property").append('<div class="input-group">' +
													'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
													'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
													'<span class="input-group-addon" style="width: 5%">' +
													'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline(' + i + ')">' +
													'Go!' +
													'</button>' +
													'</span>' +
													'</div>');
											}
										},
									})
								} //当前有匹配到一个设备
								if(!data) {
									document.getElementById("valueT").disabled = undefined;
									$.ajax({
										type: 'post',
										url: 'getRealdata',
										data: sendData,
										beforeSend: function() {},
										success: function(data) {
											Remove();
											for(var i = 0; i < data.modify.length; i++) {
												if(data.modify[i].unit) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%">' + data.modify[i].name + '</label>' +
														'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
														'<span class="input-group-addon" style="width: 5%">' + data.modify[i].unit + '</span>' +
														'</div>');
												}
												if(!data.modify[i].unit) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
														'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
														'<span class="input-group-addon" style="width: 5%"></span>' +
														'</div>');
												}
											}

											for(var i = 0; i < data.modifyLine.length; i++) {
												$("#property").append('<div class="input-group">' +
													'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
													'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
													'<span class="input-group-addon" style="width: 5%">' +
													'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
													'Go!' +
													'</button>' +
													'</span>' +
													'</div>');
											}
										},
									})
								} //当前未匹配到一个设备
							},
							error: function(errorMsg) {
//								$.messager.alert({
//									title: '提示',
//									msg: '仿真数据请求失败！',
//								})
							}
						});
					} //在线模式下
					else { //离线属性，从图元中获得设备属性
						Remove();
						var data = cell_view.model.toJSON().property; //属性json
						for(var i in data.modify) {

							var unit = '';
							if(data.modify[i].unit != undefined)
								unit = data.modify[i].unit;

							var value = '';
							if(data.modify[i].value != undefined)
								value = data.modify[i].value;

							$("#property").append('<div class="input-group">' +
								'<label class="input-group-addon" for="first" style="width: 5%">' + data.modify[i].name + '</label>' +
								'<input type="text" class="form-control" id="first" value="' + value + '">' +
								'<span class="input-group-addon" style="width: 5%">' + unit + '</span>' +
								'</div>');

						}
						for(var i in data.modifyLine) {
							//$("#property").append('<div class="input-group">' +
							//	'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
							//	'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + '" >' +
							//	'<span class="input-group-addon" style="width: 5%">' +
							//	'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline(' + i + ')">' +
							//	'Go!' +
							//	'</button>' +
							//	'</span>' +
							//	'</div>');

							$("#property").append('<div class="input-group">' +
								'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
								'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
								'<span class="input-group-addon" style="width: 5%">' +
								'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
								'Go!' +
								'</button>' +
								'</span>' +
								'</div>');
						}
					} //离线模式
				} //当前已有图元被选中下
			}; //获得属性
		},

		initializeAjax: function() {

			var paper = this.paper

			//新增图元时！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需更行对象表，及其选中对象
			this.graph.on('add', function(cell) {
				var cellView = paper.findViewByModel(cell);
				if(cell.isElement() && cell.get('type') != 'basic.Text') {
					Remove();
					getOBJ_CD = cell.toJSON().id;
					getOBJ_CD = getOBJ_CD.substring(0, 8) + getOBJ_CD.substring(9, 13) + getOBJ_CD.substring(14, 18) + getOBJ_CD.substring(19, 23) + getOBJ_CD.substring(24, 36);
					getPRJ_TYPE = cell.toJSON().modelType;
					this.highlightAndHaloCommon(cellView);
					var id = cell.id;
					var type = cell.toJSON().modelType;
					var cellName = cell.toJSON().modelText; //图元名称
					var sendData = { PRJ_CD: PRJ_CD, PRJ_TYPE: type, OBJ_CD: id, PEL_NM: cellName };
					$.ajax({
						url: 'tempdb/addDevice.json', //增加的url
						type: 'get',
						data: sendData,
						success: function(data) {
							console.log(data);
							if(data != null || data != undefined || data != '') {
								cell.prop('property', data); //先将属性插入图元中1
								if(document.getElementById('data-type-one').value == 0) { //属性界面
									if(document.getElementById('data-type-two').checked) { //在线模式下
										for(var i = 0; i < data.modify.length; i++) {
											if(data.modify[i].unit) {
												$("#property").append('<div class="input-group">' +
													'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%">' + data.modify[i].name + '</label>' +
													'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
													'<span class="input-group-addon" style="width: 5%">' + data.modify[i].unit + '</span>' +
													'</div>');
											}
											if(!data.modify[i].unit) {
												$("#property").append('<div class="input-group">' +
													'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
													'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
													'<span class="input-group-addon" style="width: 5%"></span>' +
													'</div>');
											}
										}
										for(var i = 0; i < data.modifyLine.length; i++) {
											$("#property").append('<div class="input-group">' +
												'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
												'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
												'<span class="input-group-addon" style="width: 5%">' +
												'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
												'Go!' +
												'</button>' +
												'</span>' +
												'</div>');
										}
									}; //在线属性
									if(!document.getElementById('data-type-two').checked) {
										$('#valueT').removeAttr("disabled");
										var data = cell.toJSON().property; //属性json
										for(var i in data.modify) {
											var unit = '';
											if(data.modify[i].unit != undefined)
												unit = data.modify[i].unit;

											var value = '';
											if(data.modify[i].value != undefined)
												value = data.modify[i].value;
											$("#property").append('<div class="input-group">' +
												'<label class="input-group-addon" for="first" style="width: 5%">' + data.modify[i].name + '</label>' +
												'<input type="text" class="form-control" id="first"  value="' + value + '">' +
												'<span class="input-group-addon" style="width: 5%">' + unit + '</span>' +
												'</div>');

										}
										for(var i in data.modifyLine) {
											//$("#property").append('<div class="input-group">' +
											//	'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
											//	'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + '" >' +
											//	'<span class="input-group-addon" style="width: 5%">' +
											//	'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline(' + i + ')">' +
											//	'Go!' +
											//	'</button>' +
											//	'</span>' +
											//	'</div>');

											$("#property").append('<div class="input-group">' +
												'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
												'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
												'<span class="input-group-addon" style="width: 5%">' +
												'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
												'Go!' +
												'</button>' +
												'</span>' +
												'</div>');
										}
									}; //离线属性
								}; //属性栏放置东西------应该判断一下是在线或者离线
								if(document.getElementById('data-type-one').value == 1 || document.getElementById('data-type-one').value == 2) {}; //清空属性输入栏
								$('#devices').datagrid('reload');
							}
						},
						error: function(xhr, status, error) {}
					});
				}
				//				else if(cell.isLink()) {
				//					var sourceId = cell.toJSON().source.id; //源cellId					
				//					var sourcePortId = cell.toJSON().source.port;//源端点id
				//					var sourceView = this.paper.findViewByModel(sourceId); //源图元视图
				//					var sourcePortModel = sourceView.model.getPort(sourcePortId); //端点视图
				//					
				//					
				//					var targetId = cell.toJSON().target.id;  
				//					console.log(targetId);
				//					var targetPortId = cell.toJSON().target.port;  
				////					var targetView = this.paper.findViewByModel(targetId); 
				////					var targetPortModel = targetView.model.getPort(targetPortId); 
				//						
				//					console.log(sourcePortModel.group);
				//					
				//					var sendDate = { source_CD: sourceId, target_CD: targetId };
				//					console.log(sendDate);
				//					$.ajax({
				//						url: 'saveTopology', //新增连线时的处理的url
				//						type: 'post',
				//						data: sendDate,
				//						success: function(data) {
				//							console.log(data);
				//						},
				//						error: function(xhr, status, error) {
				//
				//						}
				//					});
				//				}

			}, this);

			//新增连接线时，传递源端点和目的端点
			this.paper.on('link:connect', function(cellView) {

				var sourceId = cellView.model.toJSON().source.id; //源cellId						
				var sourceView = this.paper.findViewByModel(sourceId); //源图元视图
				var sourceDir = '';

				if(sourceView.model.get('modelType') != 'node') {
					
					var sourcePortId = cellView.model.toJSON().source.port; //源端点id
					var sourcePortModel = sourceView.model.getPort(sourcePortId); //端点视图
					sourceDir = sourcePortModel.group[0];
				}

				var targetId = cellView.model.toJSON().target.id;
				var targetView = this.paper.findViewByModel(targetId);
				var targetDir = '';

				if(targetView.model.get('modelType') != 'node') {
					
					var targetPortId = cellView.model.toJSON().target.port;
					var targetPortModel = targetView.model.getPort(targetPortId);
					targetDir = targetPortModel.group[0];
				}
				
				
                var sendDate = { source_CD: sourceId + '+' + sourceDir, target_CD: targetId+'+'+ targetDir};

				console.log(sendDate);

				$.ajax({
					url: 'saveTopology', //新增连线时的处理的url
					type: 'post',
					data: sendDate,
					success: function(data) {
						console.log(data);
					},
					error: function(xhr, status, error) {

					}
				});
			}, this);

			//单击图元时处理的函数！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需选中对象表的记录
			this.paper.on('cell:pointerdown', function(cellView) {
				var cell = cellView.model;
				if(cell.isElement() && cell.get('type') != 'basic.Text') {
					getOBJ_CD = cell.toJSON().id;
					getOBJ_CD = getOBJ_CD.substring(0, 8) + getOBJ_CD.substring(9, 13) + getOBJ_CD.substring(14, 18) + getOBJ_CD.substring(19, 23) + getOBJ_CD.substring(24, 36);
					getPRJ_TYPE = cell.toJSON().modelType;
					selectobj();
					//！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需要更新对象表标记
					if(document.getElementById('data-type-one').value == 0) {
						selectzero();
						Remove(); //清空属性下的数据
						if(document.getElementById('data-type-two').checked) { //在线模式下
							var cellId = cell.id; //图元id
							var type = cell.toJSON().modelType;
							var sendData = { PRJ_TYPE: type, OBJ_CD: cellId.substring(0, 8) + cellId.substring(9, 13) + cellId.substring(14, 18) + cellId.substring(19, 23) + cellId.substring(24, 36), };
							$.ajax({
								type: 'post',
								url: 'matchOrNot',
								data: {
									OBJ_CD: cellId.substring(0, 8) + cellId.substring(9, 13) + cellId.substring(14, 18) + cellId.substring(19, 23) + cellId.substring(24, 36),
								},
								beforeSend: function() {},
								success: function(data) {
									if(data) {
										document.getElementById("valueT").disabled = "true";
										$.ajax({
											type: 'post',
											url: 'getRealdata',
											data: sendData,
											beforeSend: function() {},
											success: function(data) {
												Remove();
												for(var i = 0; i < data.modify.length; i++) {
													if(data.modify[i].unit) {
														$("#property").append('<div class="input-group">' +
															'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%">' + data.modify[i].name + '</label>' +
															'<input name="' + data.modify[i].Ename + '"type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
															'<span class="input-group-addon" style="width: 5%">' + data.modify[i].unit + '</span>' +
															'</div>');
													}
													if(!data.modify[i].unit) {
														$("#property").append('<div class="input-group">' +
															'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
															'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '" placeholder="' + data.modify[i].value + '" disabled="true">' +
															'<span class="input-group-addon" style="width: 5%"></span>' +
															'</div>');
													}
												}

												for(var i = 0; i < data.modifyLine.length; i++) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
														'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
														'<span class="input-group-addon" style="width: 5%">' +
														'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline(' + i + ')">' +
														'Go!' +
														'</button>' +
														'</span>' +
														'</div>');
												}
											},
										})
									} //当前有匹配到一个设备
									if(!data) {
										document.getElementById("valueT").disabled = undefined;
										$.ajax({
											type: 'post',
											url: 'getRealdata',
											data: sendData,
											beforeSend: function() {},
											success: function(data) {
												Remove();
												for(var i = 0; i < data.modify.length; i++) {
													if(data.modify[i].unit) {
														$("#property").append('<div class="input-group">' +
															'<label class="input-group-addon" for="property_data' + i + '" style="width: 5%">' + data.modify[i].name + '</label>' +
															'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
															'<span class="input-group-addon" style="width: 5%">' + data.modify[i].unit + '</span>' +
															'</div>');
													}
													if(!data.modify[i].unit) {
														$("#property").append('<div class="input-group">' +
															'<label class="input-group-addon" for="property_data' + i + '"style="width: 5%">' + data.modify[i].name + '</label>' +
															'<input name="' + data.modify[i].Ename + '" type="text" class="form-control" id="property_data' + i + '">' +
															'<span class="input-group-addon" style="width: 5%"></span>' +
															'</div>');
													}
												}

												for(var i = 0; i < data.modifyLine.length; i++) {
													$("#property").append('<div class="input-group">' +
														'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
														'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
														'<span class="input-group-addon" style="width: 5%">' +
														'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
														'Go!' +
														'</button>' +
														'</span>' +
														'</div>');
												}
											},
										})
									} //当前未匹配到一个设备
								},
								error: function(errorMsg) {
//									$.messager.alert({
//										title: '提示',
//										msg: '仿真数据请求失败！',
//									})
								}
							});
						} else { //离线模式
							Remove();
							$('#valueT').removeAttr("disabled");
							var data = cell.toJSON().property; //属性json
							for(var i in data.modify) {
								var unit = '';
								if(data.modify[i].unit != undefined)
									unit = data.modify[i].unit;

								var value = '';
								if(data.modify[i].value != undefined)
									value = data.modify[i].value;
								$("#property").append('<div class="input-group">' +
									'<label class="input-group-addon" for="first" style="width: 5%">' + data.modify[i].name + '</label>' +
									'<input type="text" class="form-control" id="first"  value="' + value + '">' +
									'<span class="input-group-addon" style="width: 5%">' + unit + '</span>' +
									'</div>');

							}
							for(var i in data.modifyLine) {
								//$("#property").append('<div class="input-group">' +
								//	'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
								//	'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + '" >' +
								//	'<span class="input-group-addon" style="width: 5%">' +
								//	'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getenddataline(' + i + ')">' +
								//	'Go!' +
								//	'</button>' +
								//	'</span>' +
								//	'</div>');

								$("#property").append('<div class="input-group">' +
									'<label class="input-group-addon" for="property_line' + i + '" style="width: 5%">' + data.modifyLine[i].name + '</label>' +
									'<input type="text" class="form-control" id="property_line' + i + '" placeholder="' + data.modifyLine[i].Ename + '" disabled="true">' +
									'<span class="input-group-addon" style="width: 5%">' +
									'<button  type="button" data-toggle="modal" data-target="#onecomLine" onclick="getonlinedataline_Submit(' + i + ')">' +
									'Go!' +
									'</button>' +
									'</span>' +
									'</div>');
							}
						}
					} //获得属性
					if(document.getElementById('data-type-one').value == 1) {
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
					if(document.getElementById('data-type-one').value == 2) {
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
				};
				if(cell.isElement() && cell.get('type') == 'basic.Text') {
					getOBJ_CD = undefined;
					getPRJ_TYPE = undefined;
				}
			}, this);

			//点击空白！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需清空对象表选中状态
			this.paper.on('blank:pointerdown', function(cellView) {
				if(cell_view != null) {
					cell_view.unhighlight();
					cell_view = null;
				} //去除高亮
				getOBJ_CD = undefined;
				getPRJ_TYPE = undefined;
				Remove();
				$('#devices').datagrid('unselectAll'); //清空对象表的选中状态
			});

			//删除图元的时候处理的函数！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！需更新对象表，及清空选中状态
			this.graph.on('remove', function(cell) {

				if(cell.isElement() && PRJ_CD != "-1") {
					var id = cell.id;
					console.log(id);
					var type = cell.toJSON().modelType;
					var sendDate = { OBJ_CD: id };
					$.ajax({
						url: 'deleteDevice', //删除的url
						type: 'post',
						data: sendDate,
						success: function(data) {
							console.log(data);
							//全局变量设置为空
							getOBJ_CD = undefined;
							getPRJ_TYPE = undefined;
							Remove();
							$('#devices').datagrid('reload'); //刷新对象表
							$('#devices').datagrid('unselectAll'); //清空对象表的选中状态
						},
						error: function(xhr, status, error) {

						}
					});
					id = null;
					type = null;
				};
				if(cell.isLink() && PRJ_CD != "-1") {
					var source = cell.toJSON().source.id;
					var target = cell.toJSON().target.id;
					var sendDate = { source_CD: source, target_CD: target };
					console.log(sendDate);
					$.ajax({
						url: 'deleteTopology', //删除连线时的处理的url
						type: 'post',
						data: sendDate,
						success: function(data) {
							console.log(data);
						},
						error: function(xhr, status, error) {}
					});
				}
			});

		},

		//通用高亮与快捷工具
		highlightAndHaloCommon: function(cellView) {
			var cell = cellView.model;
			//console.log(cell.get('type')=='basic.Text');

			if(cell.isElement()) { //只高亮图元

				if(cell_view != null) {
					cell_view.unhighlight();
					cellView.highlight();
					cell_view = cellView;

				} else {
					cellView.highlight();
					cell_view = cellView;
				};
			}

			if(!this.selection.collection.contains(cell)) {

				if(cell.isElement()) {
					joint.ui.FreeTransform.clear(this.paper); //清除自由变换工具

					switch(cell.get('modelType')) {

						case 'node':
							{
								var halo = this.halo = new joint.ui.Halo({
									theme: 'material',
									cellView: cellView,
									type: 'toolbar',
									handles: App.config.halo.connector_handles
								}).render();
							}
							break;
						case 'pipe':
						case 'culvert':
							{

								new joint.ui.FreeTransform({
									cellView: cellView,
									preserveAspectRatio: false, //为true的时候，保留宽高比
									allowRotation: false, //不允许旋转
									allowOrthcellViewogonalResize: true, //为flase时，不会出现上下左右四个点即只显示四个角
									minHeight: 20,
									maxHeight: 20,
									minWidth: 60
								}).render();
							}

						default:
							{
								var halo = this.halo = new joint.ui.Halo({
									theme: 'material',
									cellView: cellView,
									type: 'toolbar',
									handles: App.config.halo.common_handles
								}).render();
							}
					}

					this.selection.collection.reset([]); //取消所有选中的元素
					this.selection.collection.add(cell, { //添加当前元素
						silent: true
					});
				}
			}
		},

		thumbnailView: function() {
			console.log(this.dialog);
			if(this.dialog != undefined)
				this.dialog.close();

			var nav = new joint.ui.Navigator({
				paperScroller: this.paperScroller,
				width: 300,
				height: 225,
				padding: 5,
				zoomOptions: {
					max: 2,
					min: 0.1
				}
			});
			nav.$el.appendTo('#paper');
			nav.render();

			var dialog = this.dialog = new joint.ui.Dialog({
				//				theme: 'material',
				id: 's',
				modal: false,
				width: 327,
				type: 'info',
				draggable: true,
				title: '缩略图',
				content: nav.$el,
			});
			dialog.open();
		},
	});
})(_, joint);