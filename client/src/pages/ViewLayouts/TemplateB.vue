<template>
    <div class="layout">
			<div class="header">
				<div>System Preview</div>
			</div>

			<div class="main">
				<div class="left">
					<div class="t1">
						<div id="chartA"></div>
					</div>
				</div>
				<div class="right">
					<div class="t2">
						<div id="chartB"></div>
					</div>
					<div class="t3">
						<div id="chartC"></div>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="t4">
					<div id="chartD"></div>
				</div>
			</div>
		</div>
</template>

<script>
import vegaEmbed from "vega-embed";
import * as d3 from "d3";

export default{
    data() {
        return {
            ModularInfo:{},
            chartStyle:{"chartA":{"width": 1030,"height": 720},
                    "chartB":{"width": 660,"height": 340},
                    "chartC":{"width": 660,"height": 340},
                    "chartD":{"width": 1720,"height": 200}
                    },
            layoutObj:{}
        }
    },
    props:["layout"],
    components: {
        //图表组件
        //chartA,
        //chartB,
        //chartC,
        //chartD
    },
    mounted(){
    },
    methods:{
        getModularInfo(m){
            let that = this
            this.layoutObj = JSON.parse(JSON.stringify(m))
            this.adaptWidthHeight()
            
        },
        adaptWidthHeight(){
            //this.layoutObj.[chartA].data.height/width
            let that = this
            let chartList = Object.keys(that.chartStyle)

            chartList.forEach(function(d){
                if(that.layoutObj["config"][d] != undefined){
                    //用vega model 自带的set方法
                    that.layoutObj["config"][d]["data"]["height"] = that.chartStyle[d]["height"]
                    that.layoutObj["config"][d]["data"]["width"] = that.chartStyle[d]["width"]
                    let _layer = that.layoutObj["config"][d]["data"]["layer"]
                    //console.log("_layer", _layer)
                    _layer.forEach(function(v){
                        v.height = that.chartStyle[d]["height"]
                        v.width = that.chartStyle[d]["width"]
                    })
                }
            })
            
            this.generateGraph()  
        },
        generateGraph(){
            let that = this
            let charts = Object.keys(that.layoutObj["config"])
            charts.forEach(function(d){
                vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
            })
            //vegaEmbed("#chartD",);
        }
    }
    
}
</script>
<style type="text/css">
.layout {
		width: 1800px;
		margin: 0 auto;
		height: 1000px;
		position: relative;
	}
	
	.header {
		padding: 0.5% 0 0.5% 2%;
		font-size: 25px;
		color: white;
		border-radius: 5px;
		background: #171C30;
	}
	
	.main {
		height: 75%;
		width: 100%;
		overflow: hidden;
	}
	
	.footer {
		height: 25%;
	}
	
	.left {
		width: 60%;
		height: 100%;
		float: left;
	}
	
	.right {
		width: 40%;
		height: 100%;
		float: left;
	}
	
	.t1 {
		height: 100%;
		width: 98%;
		padding: 1%
	}
	
	.t2,
	.t3 {
		height: 50%;
		width: 96%;
		padding: 2%
	}
	
	.t4 {
		height: 98%;
		width: 98%;
		padding: 1%
	}
	
	#chartA,
	#chartB,
	#chartC,
	#chartD {
		height: 100%;
		border-radius: 3px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .3);
	}
</style>
<style media="screen">
    .vega-actions a {
        margin-right: 5px;
    }
</style>