<template>
    <div class="layout">
        <div class="header">
            头部内容
        </div>
        <div class="mutiItem">
            <div class="left">
                <div class="item_one">
                    <p id="t1"></p>
                </div>
                <div class="item_two">
                    <p id="t2"></p>
                </div>
                <div class="item_three">
                    <p id="t3"></p>
                </div>
            </div>
            <div id='item_four'>
                <p id="t4"></p>
            </div>
            <!--图表 4-->
        </div>
    </div>
</template>

<script>
//import item_one from ''//引用图表一
//import item_two from //引用图表二
//import item_three from //引用图标三
//import item_four from //引用图表四

import vegaEmbed from "vega-embed";
import tableData from "../../assets/table.json";
import t1 from "../../assets/t1.json";

export default{
    data() {
        return {
        }
    },
    methods: {
        //在这里实现功能
        showtables(){
            var tablejson = tableData;
            var tD1 = t1;
            vegaEmbed("#item_four",tablejson);
            vegaEmbed("#t1",tD1);
            vegaEmbed("#t2",tD1);
            vegaEmbed("#t3",tD1);

        }
    },
    components: {
        //图表组件
        //item_one,
        //item_two,
        //item_three,
        //item_four
    },
    mounted(){
        this.showtables();
    }
    
}

</script>
<style type="text/css">

.layout{
    width: 100%;
    margin: 0 auto;
    height: 1080px;
}
.header{
    height: 12.5%;
    background:deepskyblue;
}
.mutiItem{
    height: 77.5%;
    background: orange;
}
.left{
    width: 35%;
    height: 100%;
    float: left;
}
.item_one,.item_two,.item_three{
    height: 33.333333333% ;
}
.item_one{
    background: lightcoral;
}
.item_two{
    background: lightslategray;
}
.item_three{
    background: lightblue;
}
item_four{
    width: 65%;
    height: 100%;
    float: left;
    background: lightsalmon;
}
</style>
<style media="screen">
    /* Add space between Vega-Embed links  */
    .vega-actions a {
        margin-right: 5px;
    }
</style>





