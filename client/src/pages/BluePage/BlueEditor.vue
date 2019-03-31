<template>

<div id="blue-editor">

    <vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
      <vs-button class="nav_opener" type="flat" icon="menu"></vs-button>

      <vs-navbar-title style="color:white">
        OpenVIS 
      </vs-navbar-title>

      <vs-spacer></vs-spacer>

      <vs-navbar-item index="0" style="color:white">
        <a href="#">Home</a>
      </vs-navbar-item> 
      <vs-navbar-item index="1" style="color:white">
        <a href="#">News</a>
      </vs-navbar-item>
      <vs-navbar-item index="2" style="color:white">
        <a href="#">Update</a>
      </vs-navbar-item>
    </vs-navbar>

    <div class='toolbar' style='position:absolute;top:45px;right:2%'>
      <vs-button class='tool_button' radius color="#1473e6" type="filled" icon="delete"></vs-button>
      <vs-button class='tool_button' radius color="#1473e6" type="filled" icon="timeline"></vs-button>
      <vs-button class='tool_button' radius color="#1473e6" type="filled" icon="view_quilt"></vs-button>
    </div>
    <vs-row style="height:1080px">
      <!--整个高度为10-->

      <vs-col id='data_list_container' vs-justify="left" vs-align="top" vs-w="2" style="max-height:1080px;overflow-y:scroll">
        <!--该列放置数据和操作-->
        <!--数据列-->

        <vs-divider border-style="solid" color="dark" >DATALIST AREA</vs-divider>
        <vs-row vs-h="5" style="display:block">
            
            <div id='data_list'>
              <vs-collapse accordion :key="index" v-for="(data, index) in dataList">
                <vs-collapse-item style="background:rgb(142,170,255); border-radius:10px">
                  <div slot="header" style="color:white; border-left:white solid 2px; padding-left:10px; font-size:15px">
                    {{data.name}}
                  </div>
                  <span style="color:white;padding:5px;float:right;font-size:15px">Length: {{data.length}}</span>
                  <vs-divider style="margin:3px"></vs-divider>
                  <div :key="index" v-for="(dim, index) in data.dimensions">
                    <vs-list-item>
                      <h3 style="float:left;color:white">{{dim.name}}</h3>
                       <vs-select style="float:left;width:80%" v-model="dim.type">
                        <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in dataTypes" />
                      </vs-select>
                        <vs-avatar style="float:right;margin:0px;margin-left:10px; background:rgb(167,189,255)" :color="dim.color" text="+" v-on:click="dimensionSelected(data.name, dim)"/>
                    </vs-list-item>
                  </div>
                </vs-collapse-item>
              </vs-collapse >
            </div>
        </vs-row>
        <!--功能列-->
        <vs-divider border-style="solid" color="dark" >FUNCTION AREA</vs-divider>
        <vs-row vs-h="5">
            <div id='editor'>
              <vs-collapse accordion :key="item.name" v-for="item in componentTypes">
                <vs-collapse-item style="background:rgb(142,170,255); border-radius:10px">
                  <div slot="header" style="color:white; border-left:white solid 2px; padding-left:10px; font-size:15px">
                    {{item.name}}
                  </div>
                  <vs-list :key="index" v-for="(meta, index) in item.childrens">
                    <vs-button style="width:80%; justify-content: left; margin-left:10%" color="rgb(167,189,255)" type="filled"  v-on:click="createNewComponent(item.name, meta)" icon="add_circle">{{meta}}</vs-button>
                    <vs-divider></vs-divider>
                  </vs-list>
                </vs-collapse-item>
              </vs-collapse >
            </div>
        </vs-row>

      </vs-col>
      

      <vs-col vs-w="10">
        
        <vs-row>
          <!--该列放置蓝图-->
          <vs-col vs-align="center" vs-w="12">
            <div id='preview' style="background:rgba(0,0,0,0.05)"><svg id ='editorborad'></svg></div>
          </vs-col>
        </vs-row>

        <vs-row id="preview_container" vs-w="12">
          <!--该列放置生成图-->
          <vs-col vs-type="flex" vs-align="center" vs-w="12">
            <div>
              <div style="padding-left: 15px; padding-top: 10px" :key="index" v-for="(meta, index) in vsbuttonbox.button">
                <vs-button color="primary" type="border" v-bind:id="meta.id" :style="{display: meta.style}" v-on:click="generateChart(meta.id, meta)">{{meta.content}}</vs-button>
              </div>
          </div>

            <div id='canvas'></div>
          </vs-col>
          
        </vs-row>

      </vs-col>

    </vs-row>

</div>

</template>
<script>
import vegaEmbed from "vega-embed";
import config from "../../assets/config.json";
import $ from "jquery";
import dataHelper from "../../common/Helper/dataHelper";
import caculator_modules from "../../common/Helper/caculator_modules";
import processor_modules from "../../common/Helper/processer_modules";
import BlueComponent from "../../common/BlueComponents/BlueComponent";
import * as d3 from "d3";
import blueComponentTypes from "../../assets/blueComponentTypes.json";
import modelConfig from "../../assets/modelConfig.json";
import BlueprintLine from "../../common/BlueComponents/BlueprintLine";
import VegaModel from "../../common/BlueComponents/vegaModel";
import vsbutton from "../../assets/vsbuttonbox.json";
import Transjson from "../../assets/transJson.json"
import { keys } from 'd3';


export default {
  name: "blue-editor",
  data() {
    return {
      dataList: [], //data candidates list
      componentTypes: blueComponentTypes, // components' types of blueprint
      container: "", //canvas to drawing blueprint
      modelConfig: modelConfig, //configuration detail of each component model
      selectedData: {}, //The dimensions in dataset which been selected by user
      dataComponent: {}, //The exsiting components in canvas (used to check the exsiting)
      blueComponents: [], //The exsiting components in canvas (used to store the exsiting)
      blueLines: [], //The exsiting line in canvas which connected to any component
      connections: [], //Store the connections between component which connected by curve
      mouseAction: "", //mouse action label which used to change the mouse action state
      drawingLine: "", //The line which is being darwing by user
      vegaObject: '', //The vege model configuration
      contextData: "", //Shows which dataset which is using in blueprint
      dataTypes: config.typesPrefab, //Store all the data type which supported by vega-lite
      model_config_text: "", //The text which translated by vega-lite model
      dataConnection:{},
      loadedDatasets:{},
      vsbuttonbox:vsbutton,
      viewer:{
        'count':0,
        "list":[]
      },
      blueComponentsCount:{},
      transjson: Transjson,
      componentLink:[],
      componentIndex:[],
      componentGraph:"",
      exstingPorts:[],
      vegaObjectObj:{},
      viewerDataTree:{},
      layoutObj:{},
      viewerlayout: {}
    };
  },
  methods: {

    //Intialized the blueprint canvas
    chartInit(container, props) {
      let that = this;

      for (let key in props) {
        this.data[key] = props[key];
      }
      this.container = d3.select("#editorborad");
      this.container.append("g").attr("id", "grid_layer");
      this.chartResize(window.innerWidth * 0.825, window.innerHeight * 0.6);
      this.bluecomponentscountInit()
      //this.vegaObject = new VegaModel(parseInt(this.height / 2.3), parseInt(this.width * 1.1), "Test")
    },

    //Darwing the grids line in canvas which help user the recognize the canvas and components
    drawGrids() {
      let lineData = [];

      for (let i = 10; i < this.width; i += 20) {
        lineData.push({ x1: i, y1: 0, x2: i, y2: this.height });
      }

      for (let i = 10; i < this.height; i += 20) {
        lineData.push({ x1: 0, y1: i, x2: this.width, y2: i });
      }

      if (this.container != "") {
        this.container
          .select("#grid_layer")
          .selectAll("*")
          .remove();

        this.container
          .select("#grid_layer")
          .selectAll(".grid_lines")
          .data(lineData)
          .enter()
          .append("line")
          .attr("x1", d => d.x1)
          .attr("x2", d => d.x2)
          .attr("y1", d => d.y1)
          .attr("y2", d => d.y2)
          .attr("stroke", "#00000030");
      }
    },

    //Resize the canvas after window's size has been updated
    chartResize(innerWidth, innerHeight) {
      let height = innerHeight > innerWidth * 2 ? innerWidth * 2 : innerHeight;
      let width = innerWidth;
      this.width = width;
      this.height = height;

      d3.select("#editorborad")
        .attr("width", this.width)
        .attr("height", this.height);

      this.drawGrids();
    },

    //init blue componets counts
    bluecomponentscountInit(){
      for(const key in this.componentTypes){
        if(!this.blueComponentsCount.hasOwnProperty(key)){
          this.blueComponentsCount[key] = 0
        }
      }
    },
    //create a new component to canvas which need a component type and a unique name
    createNewComponent(group, name) {
      //init generate properties
      let properties = this.modelConfig[name];
      properties["fill"] = this.componentTypes[group].color;
      properties["name"] = name;
      //according to this.blueComponentsCount construct id and add 1
      properties['id'] = properties.type + '-' + this.blueComponentsCount[properties.type]
      this.blueComponentsCount[properties.type] = this.blueComponentsCount[properties.type] + 1
      

      //make sure that the viewer name equal to button content
      if(group == "Viewer"){

        let propertiesname = 'Viewer-' + this.viewer.count

        //update viewer set
        this.viewer.count = this.viewer.count + 1
        this.viewer.list.push(propertiesname)
        
        //create tab
        this.vsbuttonbox.button.every(function(d,i){
          if(d['style'] == 'none'){

            d['style'] = 'block'
            d['content'] = propertiesname
            properties["name"] = propertiesname; 
            return false

          }else{
            return true
          }
        })

      }
      
      let _com = new BlueComponent(this.container, properties);
      this.addClickEvent2Circle(_com);
      this.blueComponents.push(_com);
      //if create viewer, create tab

    },
    //generate chart
    generateChart(id, meta){
      let result = this.vegaObjectObj[meta["content"]].getOutputForced();
      //Show the result in bottom canvas via vage compilier
      vegaEmbed("#canvas", result, { theme: "default" });      
    },

    //find the component by the component's name
    getComponentByName(name) { //by id
      for (let i = 0; i < this.blueComponents.length; i++) {
        if (name == this.blueComponents[i].name) {
          return this.blueComponents[i];
        }
      }
    },
    getComponentById(id) { //by id
      for (let i = 0; i < this.blueComponents.length; i++) {
        if (id == this.blueComponents[i].id) {
          return this.blueComponents[i];
        }
      }
    },

    //boundind the click event to the circles which represent the ports in component
    addClickEvent2Circle(com) {
      let that = this;
      //darwing the connection line accroding to the mouse real-time position
      this.container.on("mousemove", function(d) {
        if (
          that.mouseAction == "drawing_line" &&
          that.drawingLine.targetPort == ""
        ) {
          let coordinates = d3.mouse(this);
          that.drawingLine.dynamicGenerateCurveLine(coordinates);
          that.drawingLine.findNearestPoint(coordinates, that.exstingPorts);

        }
      });
      
      //after click the circle, there will new a line in canvas
      
      com.getAllCircles().on("click", function(d) {
        let x = d.parentX + d.x;
        let y = d.parentY + d.y;
        let sourceid = com.id

        let line = (that.drawingLine = new BlueprintLine(
          that.container,
          com.name,
          [x, y],
          d,
          sourceid
        ));
        
        that.blueLines.push(line);
        that.mouseAction = "drawing_line";
        
        let allPorts = [];

        that.blueComponents.forEach(function(component,i) {
          let ports = component.getAllPorts();
          if (d.type == "in") {
            ports["outPorts"].forEach(function(k) {
              
              //k.parent = component.id
              k.id = component.id
              allPorts.push(k);
            });
          } else {
            ports["inPorts"].forEach(function(k) {
              //k.parent = component.id
              k.id = component.id
              allPorts.push(k);
            });
          }
        });

        that.exstingPorts = new Array()
        that.exstingPorts = allPorts
        
        //line.setExstingPorts(allPorts);
      });
      
    },

    ///////////////////////////////
    // Add dimension to context data from candicate dataset
    // IF the component is exsit:
    //     Add a port to the component
    // ELSE
    //     Add a new component contain this port
    ////////////////////////////////

    //data component
    dimensionSelected(source, dim) {
      dim.checked = !dim.checked;

      let that = this

      if (dim.checked == true) dim.color = "#808080";
      else dim.color = "#202020";

      //forced update datalist to re-rendering
      let origin = this.dataList;
      this.dataList = [];
      this.dataList = origin;

      if (this.selectedData[source] != undefined) {
        //如果存在该数据源
        if (this.selectedData[source][dim.name] != undefined) {
          //如果存在该数据源该属性
          this.selectedData[source][dim.name] = "0";
        } else {
          //如果存在该数据源不存在该属性
          this.selectedData[source][dim.name] = "1";
          this.dataComponent[source].addPort("out", {
            name: dim.name,
            text: dim.name,
            dimension_type: dim.type,
            type: "out",
            attr: "field"
          });
          this.addClickEvent2Circle(this.dataComponent[source]);
        }
      } else {
        //如果不存在该数据源 则初始化组件
        this.selectedData[source] = {}; //记录该数据源
        this.selectedData[source][dim.name] = "1";

        let properties = this.modelConfig["Table"];
        properties["outPorts"] = [
          {
            name: dim.name,
            text: dim.name,
            dimension_type: dim.type,
            type: "out",
            attr: "field"
          }
        ];
        properties["name"] = source;
        properties["id"] = source;
        
        let _com = new BlueComponent(this.container, properties);
        this.dataComponent[source] = _com;
        this.addClickEvent2Circle(_com);
        this.blueComponents.push(_com);

        if (!(source in this.loadedDatasets)){

          dataHelper.getDataDetail(source).then(function(response) {
            //that.vegaObject.setData(response.data.data.values);
            that.loadedDatasets[source] = response.data.data.values
          });
        }
      }
    },

    //The configurariton change rules
    async setVegaConfig(source, target, vegaObjKey) {
      let that = this;
      // The case of source attribution is 「FIELD」 and target is 「ENCODING」
      if (source.attr == "field" && target.attr == "encoding") {
        let meta = {
          name: source.name,
          key: target.name,
          type: source.dimension_type
        };
        let maker = that.modelConfig[target.parent].maker;

        that.vegaObjectObj[vegaObjKey].setEncoding(target.parent, meta);
        that.vegaObjectObj[vegaObjKey].setMark(target.parent, maker);
      }

      // The case of source attribution is 「FIELD」 and target is 「OPERATOR」
      if (source.attr == "field" && target.attr == "operator") {
        caculator_modules.setOperator(source.name);

        if (caculator_modules.operatorsSetted()) {
          let result = {};

          if (target.parent == "Sum")
            result = caculator_modules.sum(that.vegaObjectObj[vegaObjKey].getData());
          else if (target.parent == "Reduce")
            result = caculator_modules.reduce(that.vegaObjectObj[vegaObjKey].getData());
          else if (target.parent == "Multi")
            result = caculator_modules.multiple(that.vegaObjectObj[vegaObjKey].getData());

          let newData = result.data,
            newName = result.name;
          that.vegaObjectObj[vegaObjKey].setData(newData);
          caculator_modules.resetOperators();
          let _com = getComponentByName(target.parent);
          _com.setFieldName(newName);
        }
      }

      // The case of source attribution is 「FIELD」 and target is 「CONNECTOR」

      if (source.attr == "field" && target.attr == "connector") {

        if(this.loadedDatasets[source.parent] == undefined){
          
          await dataHelper.getDataDetail(source.parent).then(function(response) {

            that.loadedDatasets[source.parent] = response.data.data.values
          });
          
        }

        if (this.dataConnection[source.parent] == undefined){

          this.dataConnection[source.parent] = {'data': this.loadedDatasets[source.parent], 'dataName':source.parent, 'dim':source.name}

          let connectionNames = d3.keys(this.dataConnection);

          if (connectionNames.length == 2){

            let data1 = this.dataConnection[connectionNames[0]];
            let data2 = this.dataConnection[connectionNames[1]];

            if(target.parent == 'Left Join'){
              let newData = dataHelper.leftJoin(data1, data2)
              that.vegaObjectObj[vegaObjKey].setData(newData)

              let _com1 = this.getComponentByName(connectionNames[0])
              let _com2 = this.getComponentByName(connectionNames[1])

              _com1.addDataName2Ports()
              _com2.addDataName2Ports()

              this.contextData = this.contextData + '.' + source.parent

            }
            else if (target.parent == 'Right Join'){

              let newData = dataHelper.rightJoin(data1, data2)
              that.vegaObjectObj[vegaObjKey].setData(newData)

              let _com1 = this.getComponentByName(connectionNames[0])
              let _com2 = this.getComponentByName(connectionNames[1])

              _com1.addDataName2Ports()
              _com2.addDataName2Ports()

              this.contextData = this.contextData + '.' + source.parent

            }
            else if (target.parent == 'Inner Join'){

              let newData = dataHelper.innerJoin(data1, data2)
              that.vegaObjectObj[vegaObjKey].setData(newData)

              let _com1 = this.getComponentByName(connectionNames[0])
              let _com2 = this.getComponentByName(connectionNames[1])

              _com1.addDataName2Ports()
              _com2.addDataName2Ports()

              this.contextData = this.contextData + '.' + source.parent

            }
            else{

              let newData = dataHelper.outerJoin(data1, data2)
              that.vegaObjectObj[vegaObjKey].setData(newData)

              let _com1 = this.getComponentByName(connectionNames[0])
              let _com2 = this.getComponentByName(connectionNames[1])

              _com1.addDataName2Ports()
              _com2.addDataName2Ports()

              this.contextData = this.contextData + '.' + source.parent
          
            }
          }
          else if(d3.keys(this.dataConnection).length > 2){
            
            this.dataConnection[source.parent] = {}
            this.dataConnection[source.parent] = {'data': this.loadedDatasets[source.parent], 'dataName':source.parent, 'dim':source.name}
          }
         
        }

      }

      // The case of source attribution is 「FIELD」 and target is PROCESSOR
      if (source.attr == "field" && target.attr == "processor") {
        console.log("source target", source, target)
        let sourcePortName = source.name;


        if (target.parent == "Filter") {
          this.getComponentByName(target.parent).showDataPreview(

            this.loadedDatasets[this.contextData],
            sourcePortName
          );

          let _com = this.getComponentByName(target.parent);

          _com.setFieldName(source.name);
        } else if (target.parent == "Log") {
          let result = caculator_modules.log(
            this.vegaObjectObj[vegaObjKey].getData(),
            sourcePortName,
            "e"
          );

          this.vegaObjectObj[vegaObjKey].setData(result.data);
          let _com = this.getComponentByName(target.parent);
          _com.setFieldName(result.name);
        }
      }

      // The case of source attribution is 「PROCESSOR」 and target is 「ENCODING」
      if (source.attr == "processor" && target.attr == "encoding") {
        if (source.parent == "Filter") {
          let meta = {
            name: source.name,
            key: target.name,
            type: source.dimension_type
          };

          let ret = this.getComponentByName(
            source.parent
          ).getFilterRangeAndDim();

          let range = ret.range;
          let dimPreview = ret.dim;
          let result = processor_modules.filter(
            this.vegaObjectObj[vegaObjKey].getData(),
            range,
            dimPreview
          );

          this.vegaObjectObj[vegaObjKey].setData(result.data);
          let maker = this.modelConfig[target.parent].maker;

          this.vegaObjectObj[vegaObjKey].setEncoding(target.parent, meta);
          this.vegaObjectObj[vegaObjKey].setMark(target.parent, maker);
        }
      }
    },

    //If a new connection is built, the vega-lite configuration will be update
    connectionParse(connect) {
      let that = this;

      //If there is none vegaObject created, new one
    
      let source = connect.source;
      let target = connect.target;
      let dataNameDict = {};
      that.dataList.forEach(function(d) {
        dataNameDict[d.name] = 1; 
      });

      if (source.parent in dataNameDict 
      && source.parent != this.contextData 
      && this.contextData.split('.').length < 2) {

        this.contextData = source.parent;
        that.setVegaConfig(source, target);
    
      } else {
        that.setVegaConfig(source, target);
      }

      //let result = this.vegaObjectObj[vegaObjKey].getOutputForced();
      //Show the result in bottom canvas via vage compilier
      //vegaEmbed("#canvas", result, { theme: "default" });
    },
    connectionRemove(connect){
      
    },
    buildBlueGraph(connect){
      let that = this
      let _source = connect.source
      let _target = connect.target

      //更新that.layoutObj viewer- layout-0_chartA parentid + "_" + text
      
      if(_target.attr == "Layout"){
        //建立索引 用于更新layout-port
        if(that.viewerlayout[_source["parentid"]] == undefined){
          that.viewerlayout[_source["parentid"]] = []
          let _name = _target.id + "_" + _target.text
          that.viewerlayout[_source["parentid"]].push(_name)
        }else{
          let _name = _target.id + "_" + _target.text
          that.viewerlayout[_source["parentid"]].push(_name)
        }

        //更新layoutObj 用于存储layout-port- config
        if(that.layoutObj[_target["id"]] == undefined){
          that.layoutObj[_target["id"]] = {}

          that.layoutObj[_target["id"]][_target["text"]] = ""
          that.layoutObj[_target["id"]][_target["text"]] = that.vegaObjectObj[_source["parentid"]]

        }else{
          if(that.layoutObj[_target["id"]][_target["text"]] == undefined){

            that.layoutObj[_target["id"]][_target["text"]] = ""
            that.layoutObj[_target["id"]][_target["text"]] = that.vegaObjectObj[_source["parentid"]]

          }
        }
      }
      //每增加一条边就更新
      //首先处理componentIndex

      let linkname = connect.sourceId + "_" + connect.targetId
      let addId = [connect.sourceId, connect.targetId]
      addId.forEach(function(d){
        if(that.componentIndex.indexOf(d) == -1){
          that.componentIndex.push(d)
        }
      })
      //存入link
      if(this.componentLink.indexOf(linkname) == -1){
        this.componentLink.push(linkname)
      }
      //建立根据componentIndex覆盖更新二维数组
      this.componentGraph = new Array()
      this.componentIndex.forEach(function(d, i){
        that.componentGraph[i] = new Array()
      })
      //graph init
      for(let i=0; i<this.componentIndex.length; i++){
        for(let j=0; j<this.componentIndex.length; j++){
          this.componentGraph[i][j] = 0
        }
      }
      for(let i=0; i<this.componentLink.length; i++){
        let indexsource = this.componentIndex.indexOf(String(this.componentLink[i]).split('_')[0])
        let indextarget = this.componentIndex.indexOf(String(this.componentLink[i]).split('_')[1])
        this.componentGraph[indexsource][indextarget] = 1
      }
      
      //获取view组件
      let viewerDict = {}
      let viewerList = []
      let viewerTreeLink = {}

      for(let i=0 ;i<this.componentIndex.length; i++){
        if(this.getComponentById(this.componentIndex[i]).type == "Viewer"){
          if(!viewerDict.hasOwnProperty( this.componentIndex[i] )){
            viewerDict[this.componentIndex[i]] = i
            viewerList.push(this.componentIndex[i])
          }
        }
      }
      //根据view组件建立vegaObjectObj 若有新view则增加 若没有则删除/ 先执行删除 再增加/ 遍历两遍
      Object.keys(that.vegaObjectObj).forEach(function(d){
        if(viewerList.indexOf(d) == -1){
          //如果在viewerlist中没有该viewer,则该viewer已被删除,需从vegaObjectObj中去掉键值对
          delete vegaObjectObj[d]
        }
      })
      viewerList.forEach(function(d){
        if(!(d in that.vegaObjectObj)){
          //不存在则新建vegaobject
          let _height = window.innerHeight * 0.3
          let _width = window.innerWidth * 0.68
          that.vegaObjectObj[d] = new VegaModel(parseInt(_height), parseInt(_width), d)
        }
      })
      
      
      //根据view组件进行遍历 获取有相连关系的组件
      for(let i=0; i<viewerList.length; i++){
        viewerTreeLink[viewerList[i]] = []
        searchlink(viewerDict[viewerList[i]])

        function searchlink(j){
        for(let k=0; k<that.componentIndex.length; k++){
          if(that.componentGraph[k][j] == 1){
            let _source = that.componentIndex[k] //id
            let _target = that.componentIndex[j] //id
            //将相连的组件存起来 或者 直接遍历两个相连组件间的边
            let _st = _source + "_" + _target
            viewerTreeLink[viewerList[i]].push(_st)
            searchlink(k)
            }
          }
          return;
        }
      }

      //绑定数据
      //搜索viewer相关的数据组件进行setdata
      //构建data component 根据是否新增数据而setdata
      //找出新增加的组件 根据新增加的组件在viewer树中的位置 判断是否需要setdata
      //建立viewer data tree
      
      let viewerTreeLinkKeys = Object.keys(viewerTreeLink)
      viewerTreeLinkKeys.forEach(function(d){
        let linkList = viewerTreeLink[d]

        linkList.forEach(function(value){
          let componentlist = value.split("_")
          for(let i=0; i<componentlist.length; i++){
            let com = componentlist[i]
            if(that.getComponentById(com).type == "Data"){
              if(that.viewerDataTree[d] == undefined){
                that.viewerDataTree[d] = []
                that.viewerDataTree[d].push(com)
                let _loadedData = that.loadedDatasets[com]
                that.vegaObjectObj[d].setData(_loadedData)
              }
              else{
                if(that.viewerDataTree[d].indexOf(com) == -1){
                  that.viewerDataTree[d].push(com)
                  let _loadedData = that.loadedDatasets[com]
                  that.vegaObjectObj[d].setData(_loadedData)
                }
              }
            }
          }

        })
      })


      //构建component connections dict
      
      let connectionsDict = {}
      for(let i=0; i<that.connections.length; i++){
        let _name = that.connections[i].sourceId + '_' + that.connections[i].targetId
        if(!(_name in connectionsDict)){
          connectionsDict[_name] = []
          connectionsDict[_name].push(that.connections[i])
        }else{
          connectionsDict[_name].push(that.connections[i])
        }
      }
      //根据view分组新建object 需要#list
      //this.vegaObject = new VegaModel(parseInt(this.height / 2.3), parseInt(this.width * 1.1), "Test")
      //vegaEmbed("#canvas", result, { theme: "default" });
      for(let i=0; i<viewerList.length; i++){
        let _viewer = viewerList[i]
        let _componentLink = viewerTreeLink[_viewer]

        for(let j=0; j<_componentLink.length; j++){
          //component-component
          let _name = _componentLink[j]
          let _connections = connectionsDict[_name]

          for(let k=0; k<_connections.length; k++){
            //component port - component port
            let _vegaObject = that.vegaObjectObj[_viewer]
            let _sourcelink = _connections[k].source
            let _targetlink = _connections[k].target
            that.setVegaConfig(_sourcelink, _targetlink, _viewer)
          }
        }
      }
    
      //更新layout/chart/vegamodel
       let _viewerlayoutKeys = Object.keys(that.viewerlayout)
       _viewerlayoutKeys.forEach(function(d){
         that.viewerlayout[d].forEach(function(v){
           let _targetid = v.split("_")[0]
           let _targettext = v.split("_")[1]
           that.layoutObj[_targetid][_targettext] = that.vegaObjectObj[d]
         })
       })       
    },
    dynamicvstab(){

    }
  
  },
  watch: {
    //Monitor the positon's change of component
    blueComponents: {
      handler(curVal, oldVal) {
        let that = this

        if (curVal.length == oldVal.length) {
          for (let i = 0; i < this.blueComponents.length; i++) {
            if(this.blueComponents[i].isDelete){

              //console.log(this.blueLines)

              let filterID = this.blueLines.filter(function(line, j){

                if(line.remove(that.blueComponents[i].name)){

                  that.connections.splice(j,1)

                  return true
                }

                return false
              })

              filterID.forEach(d => {

                this.blueLines.splice(d,1)
              })

              //console.log(this.blueLines)

              this.blueComponents.splice(i,1)
              break;
            }

            let curEle = curVal[i];
            let preEle = oldVal[i];

            //Obtain the newest postion of each component
            let curPos = curEle.getPos();
            let prePos = preEle.getPos();

            //Update all the line postion via the above positions
            this.blueLines.forEach(function(line,i) {
              let _targetcomponent = that.getComponentById(line.targetId)
              let _sourcecomponent = that.getComponentById(line.sourceId)
              if(_targetcomponent.id == curEle.id || _sourcecomponent.id == curEle.id){
                line.parentPosUpdated(
                  curPos.dx, //delta of horizon postion
                  curPos.dy, //delta of vertical position
                  curEle.inPorts,
                  curEle.outPorts
                );
              }
              //Reset all the delta postion
              curEle.resetDeltaPos();
              preEle.resetDeltaPos();
            });
          }
        }
      },
      deep: true
    },

    //Monitor the bluelines' length, if length increased, the new connection will be parsed
    blueLines: {
      handler(curVal, oldVal) {
        if (this.connections.length < curVal.length) {
          let tailNo = curVal.length - 1;
          if (curVal[tailNo].targetPort != "") {
            this.connections.push({
              source: curVal[tailNo].sourcePort,
              target: curVal[tailNo].targetPort,
              sourceId: curVal[tailNo].sourceId,
              targetId: curVal[tailNo].targetId
            });
            /*
            this.connectionParse({
                source: curVal[tailNo].sourcePort,
                target: curVal[tailNo].targetPort
            });
           */ 
          }
        }

        /*if(this.connections.length == curVal.length){
          for (let i = 0; i < this.blueLines.length; i++) {
             if(this.blueLines[i].isDelete){
              this.blueLines.splice(i,1)

              break;
            }
          }
        }*/
      },
      deep: true
    },

    //Monitor the connections' change
    connections: {

      handler(curVal, oldVal) {
        //if (oldVal.length != curVal.length) {'
        let tailNo = curVal.length - 1;
        this.buildBlueGraph(curVal[tailNo])
        let that = this

          /*
          this.vegaObject.reset()

          this.connections.forEach(function(conn){

            that.connectionParse(conn)
          })
          */

          //let result = this.vegaObject.getOutputForced();
          //vegaEmbed("#canvas", result, { theme: "dark" });

        //}
      },
      deep:false
    },

    //Monitor the vegaObject, if it updated, the model configuration text will be updated
    vegaObject: {
      handler(curVal, oldVal) {
        this.model_config_text = JSON.stringify(
          this.vegaObject.getConfig(),
          null,
          4
        );
      },
      deep: true
    }
  },
  mounted() {
    let that = this;
    this.chartInit("#preview");

    //Set the init setting of textarea
    d3.selectAll("textarea")
      .style("color", "grey")
      .style("font-size", "16px");

    //Add a listener for window's resize
    window.addEventListener("resize", () => {
      this.chartResize(window.innerWidth * 0.825, window.innerHeight * 0.6);
    });

    //Get the data candidates from server
    dataHelper.getDataList().then(response => {
      this.dataList = response.data;

      this.dataList.forEach(function(data) {
        data.dimensions.forEach(function(d) {
          d["checked"] = false;
          d["color"] = "#202020";
        });
      });
    });

    //Global control the animation of line or others
    setInterval(function() {
      that.blueLines.forEach(function(line) {
        line.animate();
      });

      that.blueComponents.forEach(function(com) {
        //com.animate();
      });
    }, 20);
  }
};
</script>

<style lang="stylus" scoped>
@import '../Styles/editor';
</style>