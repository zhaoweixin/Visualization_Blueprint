<template lang="html">
    <div id="datapreviewer">
        <vs-row vs-h="8" >
            <vs-row vs-h="4">
                <!--数据连接信息栏-->
                <vs-avatar icon="grid_on" />
                <h3 style="margin: auto">DataName</h3>
            </vs-row>
            <!-- <Data-list-viewer :tableMsg="state.tablemsg"/> -->
        </vs-row>
        
        
    </div>
</template>
<script>
import * as d3 from 'd3'
import * as path from 'path'
import Vue from 'vue'
import DataManager from '../DataManager'
//import DataListViewer from './DataListViewer'
let che = []
export default{
    name: 'DataPreviewer',
    data: function(){
        return {}
    },
    computed:{
        checkBoxesList () {
            return this.$store.state.checkboxes
        }
    },
    watch:{
        // checkBoxesList (val, oldVal) {
        //     this.updateCheckBoxes(val)
        //     this.isShowdraggableMenuInit(val)
        // },
        select1(val){
        }
    },
    components: {
        //DataListViewer
    },
    methods: {
        getImgUrl(pet) {
            var images = require.context('../../assets/', false, /\.svg$/)
            return images('./' + pet)
        },
        controlPanelInit(id){
            let that = this,
                container = d3.select('#' + id)
            this.chartResize(id, window.innerWidth * 0.875, window.innerHeight * 0.65 * 0.33)
        },
        
        
    }
}
</script>
<style>
</style>