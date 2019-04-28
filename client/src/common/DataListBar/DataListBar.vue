<template>
    <div>
        <vs-row vs-justify="space-around" vs-h="2">
            <vs-col vs-type="flex" vs-justify="left" vs-align="top">
                <vs-upload action="http://localhost:3000/api/changeavatar" @on-success="successUpload" class="dark"/>
            </vs-col>
        </vs-row>
        <vs-row vs-justify="space-around" vs-h="10">
            <vs-list style="font-size: 8px">
                <vs-list-header title="Files"></vs-list-header>
                <div :key= "index" v-for= "(item, index) in listdata">
                    <vs-list-item :title="item.title">
                        <vs-checkbox :id="item.title" :vs-value="item.title" v-model="checkedNames" color="warning" icon="attach_file"/>
                    </vs-list-item>
                </div>
                <p>{{ checkedNames }}</p>
            </vs-list>
        </vs-row>
        <vs-row vs-h="8">
            
            <vs-row vs-h="8">
                <div id="testdiv" style="position:absolute" :data="checkBoxesList"></div>
                <div id="draggableMenu" style="font-size: 8px; position:absolute; left:1%; top:55%; width: 300px; height: 150px; background-color: rgba(200, 200, 200, 0.2); opacity:0;">
                    <div style="float: left; width:260px; height:30px; text-align:left; ">
                        <p style="padding: 12px">Connect</p>
                    </div>
                    <div style="float: left; width:40px; height:20px;">
                        <vs-button color="rgb(128,128,128)" type="flat" icon="clear" style="padding: auto" v-on:click="clickClosedraggableMenu()"></vs-button>
                    </div>
                    
                    <div :key="index" v-for = "(todo, index) in svgtodos">
                        <div style="float: left; width:75px; height:60px; padding-top: 10px">
                            <img :src = "getImgUrl(todo.route)"  style="float: left; width:75px; height:30px;">
                            <vs-button col
                            or="rgb(128,128,128)" type="flat" style="float: left; width:75px; height:30px; padding-top: 5px;" v-on:click="generateData(todo.type)">{{ todo.type }}</vs-button>
                        </div>
                    </div>
                    
                    <div style="float: left; width:300px; padding-top:10px">
                        <div style="float: left; width:150px;">
                            <vs-select color="rgb(128,128,128)" :label="state.labels.left" v-model="state.attrLeftSelect" style="float: left; width:150px;">
                                <vs-select-item :key= "index" :value="item.value" :text="item.text" v-for= "(item,index) in state.attrList.left" />
                            </vs-select>
                        </div>
                        
                        <div style="float: left; width:150px;">
                            <vs-select color="rgb(128,128,128)" :label="state.labels.right" v-model="state.attrRightSelect" style="float: left; width:150px;">
                                <vs-select-item :key = "index" :value="item.value" :text="item.text" v-for= "(item,index) in state.attrList.right" />
                            </vs-select>
                        </div>
                    </div>
                    
                </div>
            </vs-row>
        </vs-row>
    </div>
</template>
<script>
import * as d3 from 'd3'
import * as path from 'path'
import Vue from 'vue'

import DataManager from '../DataManager'
export default{
    name: 'OperatePart',
    data: function() {
        return {
            listdata:[],
            ratio : 100,
            checkedNames: [],
            state:{
                storeBox:[],
                tabsPosition:[
                    {
                        'isoccupy': false,
                        'left': 50,
                        'id': null,
                        'position': 'left'
                    },
                    {
                        'isoccupy': false,
                        'left': 200,
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
    created: function() { 
        this.initData()
    },
    watch: {
        checkedNames: {
            handler: function(val, oldVal){
                this.datalistProcess(val, oldVal)
            },
            deep: true
        },
        checkBoxesList (val, oldVal) {
            this.updateCheckBoxes(val)
            this.isShowdraggableMenuInit(val)
        },
        select1(val){
        }
    },
    computed: {
        checkBoxesList () {
            return this.$store.state.checkboxes
        }
    },
    methods:{
        successUpload(event){
            let img = event.target.files[0];
            let size = img.size;
            let Form = new FormData();
            Form.append('avatar', img, this.avatar_name);
            API.successUpload(Form)
            .then((response) => {
                console.log('this is response' + response)
            })
            .catch((error) => {
                console.log('this is the:' + error)
            })
            this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
        },
        greet(){
            
        },
        getRatio(){
            var ratio = 0,
            screen = window.screen,
            ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        }
        else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }
        }
        else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }

        if (ratio) {
            ratio = Math.round(ratio * 100);
        }
        return ratio;
        },
        initData(){
            const that = this;
            (async function(){
                const response = await DataManager.getDataInfo()
                let re = []
                response.data.forEach( (d, i) => {
                    let obj = {'title': d.name}
                    obj['checked'] = false
                    re.push(obj)
                })
                that.listdata = [...that.listdata, ...re]
            })()

            /*
            DataManager.getDataInfo().then(response => {
                let re = []
                response.data.forEach( (d, i) => {
                    let obj = {'title': d.name}
                    obj['checked'] = false
                    re.push(obj)
                })
                this.listdata = re
                console.log(this.listdata)
            })
            */
        },
        datalistProcess(val, oldVal){
            if(val.length > 2){
                //max checkboxes are 2
                this.checkedNames.pop()
            } else {
                if(val.length > oldVal.length){
                    //add checkbox
                    let arr = [...val],
                        newCheckbox = arr.pop()
                    this.$store.commit('addListdata', newCheckbox)
                } else {
                    //delete checkbox
                    let arr = [...oldVal],
                        diff = arr.filter(x => !val.includes(x))
                    this.$store.commit('removeListdata', diff[0])
                }
            }
        },
        getImgUrl(pet) {
            var images = require.context('../../assets/', false, /\.svg$/)
            return images('./' + pet)
        },
        controlPanelInit(id){
            let that = this,
                container = d3.select('#' + id)
            this.chartResize(id, window.innerWidth * 0.875, window.innerHeight * 0.65 * 0.33)
        },
        chartResize(id, innerWidth, innerHeight){
            let height = innerHeight > innerWidth * 2 ? innerWidth * 2 : innerHeight,
                width = innerWidth;
            d3.select('#' + id).attr('width', width).attr('height', height).style('fill', "steelblue")
        },
        draggableMenuInit(){
            let rectDrag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
            let rect = d3.select('#draggableMenu')
                .call(rectDrag)

            let button = d3.select('#testbutton')
                .on('click', function(){
                })

            function dragstarted(d){
            }
            function dragged(d){
                d3.select(this)
                    .style("left", function(){
                        let re = parseInt(d3.select(this).style('left')) + d3.event.dx
                        return re + 'px'
                    })
                    .style("top", function(){
                        let re = parseInt(d3.select(this).style('top')) + d3.event.dy
                        return re + 'px'
                    });
            }
            function dragended(d){
            }
        },
        addDataTabs(dataName){
            const that = this;
            if(this.dataTabs.count >= 2) return;

            let top = 50,
                left = null,
                width = 100,
                height = 25,
                divId = 'div_' + dataName,
                randomColor = d3.scaleOrdinal(d3.schemeCategory10),
                position = null
            
            //通过tab位置字典获取tab left位置 并设置id
            for(let i=0; i<this.state.tabsPosition.length; i++){
                let d = this.state.tabsPosition[i]
                if(d.isoccupy == false){
                    left = d.left
                    d.isoccupy = true
                    d.id = divId
                    position = d.position
                    break;
                }
            }

            let div = d3.select('#testdiv')
            let addtab = div.append('div')
                    .attr('id', divId)
                    .style('top', top + 'px')
                    .style('left', left + 'px')
                    .style('width', width + 'px')
                    .style('height', height + 'px')
                    .style('background-color', 'rgb(235,235,235)')
                    .style('position', 'absolute')
                    .style('border-left', function(){
                        return '5px solid ' + randomColor(Math.floor(Math.random() * 10))
                    })
                    .text(dataName)
                    .style('padding-top', '4px')
                    .style('font-size', '.8rem')

                addtab.style('opacity', 0)
                addtab.transition().duration(300).style('opacity', 1)

            if(this.dataTabs.datalist.indexOf(dataName) == -1){
                this.dataTabs.count ++ 
                this.dataTabs.datalist.push(dataName)
            }

            (async function(dataName){
                const response = await DataManager.getFileAttrList(dataName)
                const re = []
                response.data.forEach((d, i) => {
                    re.push({'text': d.name, 'value': d.name})
                })
                //new draggable data attr list
                that.$set(that.state['attrList'], position, re)
                //new draggable data title
                that.$set(that.state['labels'], position, dataName)
            })(dataName)
            
            /*
            DataManager.getFileAttrList(dataName).then(function(response) {
                let re = []
                response.data.forEach((d, i) => {
                    re.push({'text': d.name, 'value': d.name})
                })

                //new draggable data attr list
                that.$set(that.state['attrList'], position, re)
                //new draggable data title
                that.$set(that.state['labels'], position, dataName)
            })
            */
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