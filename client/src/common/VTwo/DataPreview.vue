<template>
    <div>
        <div class="chartWindow" v-loading="loading">
            <div class="chartWindow-item" v-for="(item, index) in chartInfo" :offset="index > 0 ? 0.2 : 0">
                <div class="manu-card">
                <div class="manu-card-header">
                    <div class="clearfix">
                        <span style="font-size:20px; margin-left:45%">{{item.name}}</span>
                    </div>
                </div>
                <div class="manu-card-body">
                    <div :id="dynamicId(index)"></div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dataManager from "../DataManager.js"
import vegaEmbed from "vega-embed";
export default {
    data(){
        return{
            chartInfo:[],
            idList:[],
            drawData:[],
            drawDataObj:{},
            loading: true
        }
    },
    watch:{
        tableName: function(val, oldVal){
            console.log("loading..")
            this.loading = true
            this.initEle()
            this.drawChart()
        }
    },
    computed:{
        tableName(){
            return this.$store.state.currentTable
        }
    },
    created(){
        this.initEle()
    },
    mounted(){
        this.drawChart()
    },
    methods:{
        dynamicId(index){
            return this.idList[index]
        },
        initEle(){
            let that = this
            let req = async function(){
                let response = await dataManager.getDrawDataInfo(that.tableName)
                that.idList = []
                for(let i=0 ;i<+response.data.length; i++){
                    let id = "pic-" + i
                    that.idList.push(id)
                }
                that.chartInfo = []
                that.chartInfo = [...that.chartInfo, ...response.data.attr]
            }
            req()
        },
        drawChart(){
            let that = this
            let drawQuantitative = function(data, index){
                let title = that.tableName + "-" + data.name
                let id = "#pic-" + index
                let vegaObj = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
                    "description": title,
                    "width": 300,
                    "height": 250,
                    "data": {
                        "values": data.value,
                    },
                    "layer": [
                        {
                        "mark": "line",
                        "encoding": {
                            "x": {"field": "x", "type": "quantitative"},
                            "y": {"field": "ly", "type": "quantitative"},
                            "color": {"value": "#333"}
                            }
                        },
                        {
                        "mark": "point",
                        "encoding": {
                            "x": {"field": "x","type": "quantitative"},
                            "y": {"field": "cy", "type": "quantitative"}
                            }
                        }
                    ]
                }
                vegaEmbed(id, vegaObj, {theme: "default"});
            }
            let drawOrdinal = function(data, index){
                let title = that.tableName + "-" + data.name
                let id = "#pic-" + index
                let drawdata = data.value.length <= 15 ? data.value : data.value.slice(0, 15)
                let vegaObj = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
                    "description": title,
                    "width": 300,
                    "height": 250,
                    "data": {
                        "values": drawdata,
                    },
                    "transform": [
                        {
                        "window": [{
                            "op": "rank",
                            "as": "rank"
                        }],
                        "sort": [{ "field": "count", "order": "descending" }]
                        }
                    ],
                    "mark": "bar",
                    "encoding": {
                        "x": {
                            "field": "count",
                            "type": "quantitative"
                        },
                        "y": {
                            "field": "value",
                            "type": "nominal",
                            "sort": {"field": "count", "op": "average", "order":"descending"}
                        }
                    }
                }
                vegaEmbed(id, vegaObj, {theme: "default"});
            }
            let drawTemporal = function(data, index){

            }
            let req = async function(){
                
                if(that.tableName in that.drawDataObj){
                    that.drawData = that.drawDataObj[that.tableName]
                } else {
                    let response = await dataManager.getDrawData(that.tableName)
                    that.drawData = response.data
                    that.drawDataObj[that.tableName] = response.data
                }
                
                that.drawData.forEach((d,i) => {
                    switch(d.type){
                        case "quantitative":
                            drawQuantitative(d,i)
                            break;
                        case "ordinal":
                            drawOrdinal(d,i)
                            break;
                        case "temporal":
                            drawOrdinal(d,i)
                            break;
                    }
                    that.loading = false
                })
            }
            
            req()
        }
    }
}
</script>
<style>

.manu-card{
    box-shadow: 0 2px 12px 0 rgba(0,0,0, 0.1);
    border-radius: 4px;
    overflow: hidden;
}
.manu-card-header{
    padding: 9px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing:border-box
}
.manu-card-body{
    padding: 20px
}

.chartWindow{
    display:flex; 
    margin-top:15px; 
    overflow-x:auto
}

.chartWindow-item{
    padding-left:5px; 
    padding-right:50px; 
    height:400px; 
    flex: 0 0 400px;
}
</style>


