<template lang="html">
    <div id="datapreviewer">
        <vs-row vs-h="8" >
            <vs-row vs-h="4">
                <!--数据连接信息栏-->
                <vs-avatar icon="grid_on" />
                <h3 style="margin: auto">DataName</h3>
            </vs-row>
            <Data-list-viewer :tableMsg="state.tablemsg"/>
        </vs-row>
        
        
    </div>
</template>
<script>
import * as d3 from 'd3'
import * as path from 'path'
import Vue from 'vue'
import DataManager from '../DataManager'
import DataListViewer from './DataListViewer'
let che = []
export default{
    name: 'DataPreviewer',
    data: function(){
        return {
            state:{
                storeBox:[],
                tabsPosition:[
                    {
                        'isoccupy': false,
                        'left': 200,
                        'id': null,
                        'position': 'left'
                    },
                    {
                        'isoccupy': false,
                        'left': 350,
                        'id': null,
                        'position': 'right'
                    }
                ],
                labels:{
                    'left': null,
                    'right': null
                },
                attrList:{
                    'left':[],
                    'right':[]
                },
                attrLeftSelect:0,
                attrRightSelect:0,
                tablemsg:{
                    'value': null
                }
            },
            id:'DataOperater',
            dataTabs: {'count': 0, datalist: []},
            svgtodos: [
                {
                    id: 1,
                    route: "left-join.svg",
                    type: "left-join"
                },
                {
                    id: 2,
                    route: "right-join.svg",
                    type: "right-join"
                },
                {
                    id: 3,
                    route: "inner-join.svg",
                    type: "inner-join"
                },
                {
                    id: 4,
                    route: "full-join.svg",
                    type: "full-join"
                }
            ], //drag box svg icon
        }
    },
    computed:{
        checkBoxesList () {
            return this.$store.state.checkboxes
        }
    },
    watch:{
        checkBoxesList (val, oldVal) {
            this.updateCheckBoxes(val)
            this.isShowdraggableMenuInit(val)
        },
        select1(val){
        }
    },
    components: {
        DataListViewer
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
        
        delDataTabs(dataName){
            if(this.dataTabs.count <= 0) return;
            let dataIndex = this.dataTabs.datalist.indexOf(dataName),
                divId = 'div_' + dataName
            
            //删除位置字典内tab id
            this.state.tabsPosition.forEach(d => {
                if(d.id == divId){
                    d.isoccupy = false
                    d.id = null
                }
            })

            let tab = d3.select('#' + divId)
                tab.transition().duration(300).style('opacity', 1)
                tab.remove()

            if(dataIndex > -1){
                this.dataTabs.count --
                this.dataTabs.datalist.splice(dataIndex, 1)
            }
            
        },
        updateCheckBoxes: function(val) {
            //find diff(add, del) val
            let _val = [...val],
                _oldVal = [...this.state.storeBox]
            if(val.length > _oldVal.length){
                //add Data
                let toAddTab = _val.pop()
                this.addDataTabs(toAddTab)
            } else if (_val.length < _oldVal.length){
                //delete Data
                let toDelTab = _oldVal.filter(x => !_val.includes(x))[0]
                this.delDataTabs(toDelTab)
            }
            this.$set(this.state, 'storeBox', [...val])
        },
        isShowdraggableMenuInit(val){
            let len = val.length
            if(len < 2){
                d3.select('#draggableMenu').transition().duration(500).style('opacity', 0)
            } else if(len == 2){
                d3.select('#draggableMenu').transition().duration(500).style('opacity', 1)
            }
        },
        clickClosedraggableMenu(){
            d3.select('#draggableMenu').transition().duration(500).style('opacity', 0)
        },
        generateData(joinType){
            //init variation
            let leftName = this.state.labels.left,
                rightName = this.state.labels.right,
                leftAttr = this.state.attrLeftSelect,
                rightAttr = this.state.attrRightSelect
            
            //post joinType {dataName_1: leftName, dataName_2: rightName, column: leftAttr}
            let val = [
                        {
                            "test1.id": "2",
                            "test1.name": "John",
                            "test2.id": "2",
                            "test2.name": "John",
                            "test2.position": "2"
                        },
                        {
                            "test1.id": "3",
                            "test1.name": "Matt",
                            "test2.id": "3",
                            "test2.name": "Matt",
                            "test2.position": "2"
                        }
                    ]

            this.state.tablemsg = {'value': val}
            //dispatch wait animation
            //
        }
    },
    mounted() {
        this.controlPanelInit(this.id)
        this.draggableMenuInit()
        window.addEventListener("resize", () => {
            this.chartResize(this.id, window.innerWidth * 0.875, window.innerHeight * 0.65 * 0.33);
        });
    }
}
</script>
<style>
</style>