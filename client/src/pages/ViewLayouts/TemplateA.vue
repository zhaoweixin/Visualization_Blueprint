<template>
    <div class="layout">
        <div class="header">
            System Preview
        </div>
        <div class="mutiItem">
            <div class="left">
                <div id="t1">
                    <div id="chartA">
                    </div>
                </div>
                
            </div>
            <div class="right">
                <div id="t3">
                    <div id="chartB"></div>
                </div>
               <div id="t2">
                    <div id="chartC"></div>
                </div>
            </div>
            <!--图表 4-->
        </div>
    </div>
</template>

<script>

import vegaEmbed from "vega-embed";
import * as d3 from "d3";
import AppMapx from "../BluePage/AppMapx";

export default{
    data() {
        return {
            ModularInfo:{},
            chartStyle:{"chartA":{"width": 1325,"height": 780},
                    "chartB":{"width": 331,"height": 390},
                    "chartC":{"width": 331,"height": 390}
                   
                    },
            layoutObj:{}
        }
    },
    props:["layout"],
    components: {
        AppMapx
        //图表组件
        //chartA,
        //chartB,
        //chartC,
        //chartD
    },
    watch:{
        layout:{
            handler(curval){
                console.log(curval)
            },
            deep: true
        }
    },
    mounted(){

        document.getElementById('chartA').appendChild(document.createElement(AppMapx))
    },
    methods:{
        getModularInfo(m){
            let that = this
            this.layoutObj = JSON.parse(JSON.stringify(m))
            console.log(this.layoutObj)
            //this.calculateChartWH()
            //this.setBackgroundColor()
            this.adaptWidthHeight()
            this.generateGraph()

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

        },
        setBackgroundColor(){
            let that = this
            for(let key in that.layoutObj["config"]){
                //key chartA chartB
                that.layoutObj["config"][key]["data"]["background"] = "#242E47"
            }
        },
        setAxisColor(){
            let that = this
            for(let key in that.layoutObj["layers"]){
                //key chartA chartB
                if(that.layoutObj["layers"][key]["encoding"]["x"]){
                    if(!that.layoutObj["layers"][key]["encoding"]["x"]["axis"]){
                        that.layoutObj["layers"][key]["encoding"]["x"]["axis"] = {
                            "domainColor" : "white",
                            "labelColor": "white",
                            "tickColor": "white",
                            "titleColor": "white",
                            "gridColor": "white"
                        }
                    }
                }
                if(that.layoutObj["layers"][key]["encoding"]["y"]){
                    if(!that.layoutObj["layers"][key]["encoding"]["y"]["axis"]){
                        that.layoutObj["layers"][key]["encoding"]["y"]["axis"] = {
                            "domainColor" : "white",
                            "labelColor": "white",
                            "tickColor": "white",
                            "titleColor": "white",
                            "gridColor": "white"
                        }
                    }
                }
            }
        },
        setHeaderColor(){

        },
        generateGraph(){
            let that = this
            let charts = Object.keys(that.layoutObj["config"])
            charts.forEach(function(d){
                vegaEmbed("#" + d, that.layoutObj["config"][d]["data"])
            })
        }
    }

}

</script>
<style type="text/css">

.layout{
    width: 1800px;
    margin: 0 auto;
    height: 1000px;
    background-color: #171C30;
    border-radius:5px
}
.header{
	padding: 0.5% 0 0.5% 2%;
    font-size: 25px;
    color:white;
    border-radius:5px;
}
.mutiItem{
    height: 95%;
    background-color: white;
}
.left{
    width: 80%;
    height: 100%;
    float: left;
}
.right{
    width: 20%;
    height: 100%;
    float: left;
}
#chartA,#chartB,#chartC{
    height: 100% ;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

#t2,#t3{
	height:46%;
	width:96%;
	padding:2%
}
#t1{
    height:100%;
	width:96%;
	padding:2%
}

</style>
<style media="screen">
    /* Add space between Vega-Embed links  */
    .vega-actions a {
        margin-right: 5px;
    }
</style>





