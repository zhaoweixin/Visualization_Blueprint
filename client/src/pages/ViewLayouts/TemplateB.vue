<template>
    <div class="layout">
        <div class="header">
            <div class="left">
                <div id="chartA"></div>
            </div>
            <div class="right">
                <div class="A">
                    <div id="chartB"></div>
                </div>
                <div class="B">
                    <div id="chartC"></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div id="chartD"></div>
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
            chartStyle:{"chartA":{"width": 980,"height": 680},
                    "chartB":{"width": 600,"height": 300},
                    "chartC":{"width": 600,"height": 290},
                    "chartD":{"width": 1700,"height": 200}
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
.layout{
    width: 1800px;
    margin: 0 auto;
    height: 1000px;
    position: relative;
}
.header{
    height: 75%;
    width:  1800px;
    overflow: hidden;
    margin:10px;
}
.left{
    width: 60%;
    height: 100%;
    float: left;
    
}
.right{
    width: 40%;
    height: 100%;
    float: left;
}
.A{
    height: 50%;
    margin-left:10px;
    margin-bottom:10px;
    
}
.B{
    height: 50% ;
    margin-left:10px;

}

.footer{
     height: 25%;
    margin:10px;
}
</style>
<style media="screen">
    .vega-actions a {
        margin-right: 5px;
    }
</style>