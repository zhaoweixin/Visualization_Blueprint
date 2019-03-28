<template>
    <div class="containner">
        
    </div>
</template>
<script>
import Vue from 'vue'
import * as d3 from "d3"
export default {
    name:'editBar',
    props:['editMessage'],
    data:function(){
        return {

        }
    },
    methods:{

    },
    watch:{
        editMessage:function(newval,oldval){
            console.log(newval);
        }
    }

}
</script>
<style>
.containner{
    background-color:red ;
    height: 200px;
    width: 320px;
}
</style>

