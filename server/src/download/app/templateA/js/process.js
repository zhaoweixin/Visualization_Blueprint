var app = new Vue({
	el: '#autoboard',
	data() {
		return {
			items: [],
			ModularInfo: {},
			chartStyle: {
				"chartA": {
					"width": 828,
					"height": 390
				},
				"chartB": {
					"width": 828,
					"height": 390
				},
				"chartC": {
					"width": 828,
					"height": 390
				},
				"chartD": {
					"width": 828,
					"height": 390
				}
			},
			layoutObj: {}
		}
	},
	mounted() {
		this._init()
	},
	props: ["layout"],
	methods: {
		_init() {
			let that = this
			d3.json("config.json", function(err, data) {
				const layoutName = Object.keys(data)[0]
				that.getModularInfo({
					"config": data[layoutName],
					"layoutname": layoutName
				})
			})
		},
		getModularInfo(m) {
			let that = this
			this.layoutObj = JSON.parse(JSON.stringify(m))
			//this.calculateChartWH()
			//this.setBackgroundColor()
			this.adaptWidthHeight()
			this.generateGraph()

		},
		adaptWidthHeight() {
			//this.layoutObj.[chartA].data.height/width
			let that = this
			let chartList = Object.keys(that.chartStyle)
			chartList.forEach(function(d) {
				if(that.layoutObj["config"][d] != undefined) {
					//用vega model 自带的set方法
					that.layoutObj["config"][d]["data"]["height"] = that.chartStyle[d]["height"]
					that.layoutObj["config"][d]["data"]["width"] = that.chartStyle[d]["width"]
					let _layer = that.layoutObj["config"][d]["data"]["layer"]
					//console.log("_layer", _layer)
					_layer.forEach(function(v) {
						v.height = that.chartStyle[d]["height"]
						v.width = that.chartStyle[d]["width"]
					})
				}
			})
		},
		generateGraph() {
			let that = this
			let charts = Object.keys(that.layoutObj["config"])
			charts.forEach(function(d) {
				vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
			})
		}
	}
})