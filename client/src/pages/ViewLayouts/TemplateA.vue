<template>
    <div class="layout">
        <div class="header">
            System Preview
        </div>
        <div class="mutiItem">
            <div class="left">
                <div id=" t1">
                    <div id="chartA"></div>
                </div>
                <div id="t2">
                    <div id="chartB"></div>
                </div>
            </div>
            <div class="right">
                <div id="t3">
                    <div id="chartC"></div>
                </div>
                <div id='t4'>
                    <div id="chartD"></div>
                </div>
            </div>
            <!--图表 4-->
        </div>
    </div>
</template>

<script>
//import chartA from ''//引用图表一
//import chartB from //引用图表二
//import chartC from //引用图标三
//import chartD from //引用图表四

import vegaEmbed from "vega-embed";
import * as d3 from "d3";

export default{
    data() {
        return {
            ModularInfo:{},
            chartStyle:{"chartA":{"width": 750,"height": 380},
                    "chartB":{"width": 750,"height": 380},
                    "chartC":{"width": 750,"height": 380},
                    "chartD":{"width": 750,"height": 380}
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
    watch:{
        layout:{
            handler(curval){
                console.log(curval)
            },
            deep: true            
        }
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
    height: 5%;
    background:#20283F;
    padding-left:50%;
    padding-top:0.5%;
    font-size: 20px;
    color:white;
    border-radius:5px;
}
.mutiItem{
    height: 95%;
    background-color: #242E47;
}
.left{
    width: 50%;
    height: 95%;
    float: left;
}
.right{
    width: 50%;
    height: 95%;
    float: left;
}
#chartA,#chartB,#chartC,#chartD{
    height: 47.5% ;
    padding-top: 2%;
    padding-left: 1%;
    opacity: 0.6;
    border-radius: 3px;
}

</style>
<style media="screen">
    /* Add space between Vega-Embed links  */
    .vega-actions a {
        margin-right: 5px;
    }
</style>





