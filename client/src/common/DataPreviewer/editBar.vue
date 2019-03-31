<template>
    <Input placeholder="Search..."
        v-model="searchx"
        @on-change="handleSearch"
        prefix="ios-search"
    />
</template>
<script>
import Vue from 'vue'
import * as d3 from "d3"
export default {
    name:'editBar',
    props:['tableData'],
    data:function(){
        return {
            searchx:null,
            tableDataClone:[]
        }
    },
    methods:{
        search:function(data,argumentObj){
            let res = data;
            let dataClone = data;
            for(let argu in argumentObj){
                if(argumentObj[argu].length>0){
                    res=dataClone.filter(d=>{
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res
                }
            }
            return res
        },
        handleSearch:function(){
            
        }
    },
    watch:{
        tableData:function(newval){
            //console.log(newval);
            if(newval.length > 0&& this.tableDataClone.length === 0){
                this.tableDataClone = newval
            }
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

