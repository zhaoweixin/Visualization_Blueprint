<template>

<div id="blue-editor">
    <NavBar></NavBar>
    
    <div class='toolbar' style='position:absolute;top:45px;right:2%'>
      <vs-button v-on:click="graphPreview" class='tool_button' radius color="#1473e6" type="filled" icon="view_quilt"></vs-button>
      <vs-button v-on:click="cleanPanel" class='tool_button' radius color="#1473e6" type="filled" icon="delete"></vs-button>
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
                  <vs-button type="line" @click="initTable(data.name)">{{buttonName}}</vs-button>
                  <span style="color:white;padding:5px;float:right;font-size:15px">Length: {{data.length}}</span>
                  <vs-divider style="margin:3px"></vs-divider>
                  <div :key="index" v-for="(dim, index) in data.dimensions">
                    <vs-list-item>
                      <h3 style="float:left;color:white">{{dim.name}}</h3>
                       <vs-select style="float:left;width:80%" v-model="dim.type">
                        <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in dataTypes" />
                      </vs-select>
                        <vs-avatar style="float:right;margin:0px;margin-left:10px; background:rgb(167,189,255)" :color="dim.color" text="+" v-on:click="createNewComponent(data.name, dim)"/>
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
                    <vs-button style="width:80%; justify-content: left; margin-left:10%" color="rgb(167,189,255)" type="filled"  v-on:click="createNewComponent(meta)" icon="add_circle">{{meta}}</vs-button>
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

        <vs-row v-if="!isTable" id="preview_container" vs-w="12">
          <!--该列放置生成图-->
          <vs-col vs-type="flex" vs-align="center" vs-w="12">
            <div>
              <div style="padding-left: 15px; padding-top: 10px" :key="index" v-for="(meta, index) in viewerbuttonbox.button">
                <vs-button color="primary" type="border" v-bind:id="meta.id" :style="{display: meta.style}" v-on:click="generateChart(meta.id, meta)">{{meta.content}}</vs-button>
              </div>
          </div>
            <div  id='canvas'></div>
          </vs-col>
        </vs-row>
        <vs-row v-if="isTable" vs-w="12">
          <vs-col vs-type="flex" vs-align="center" vs-w="12">
            <data-preview-table :tabledata="tableData"></data-preview-table>   
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
    <vs-popup fullscreen title="Preview" :active.sync="popupActivo4">
      <TemplateA v-if="A" ref='msg-A'></TemplateA>
      <TemplateB v-if="B" ref='msg-B'></TemplateB>
      <AutoPage></AutoPage>
    </vs-popup>

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
import VegaModel from "../../common/BlueComponents/vegaModel";
import viewerbutton from "../../assets/vsbuttonbox.json";
import { keys } from 'd3';
import TemplateA from "../ViewLayouts/TemplateA"
import TemplateB from "../ViewLayouts/TemplateB"
import NavBar from "../../common/NavBar/NavBar"
import BlueprintLine from "../../common/BlueComponents/BlueprintLine"
import DataPreviewTable from '../../common/DataPreviewer/DataPreviewTable'
//import AutoPage from "../AutoBoard/AutoPage";

export default {
  name: "blue-editor",
  data() {
    return {
      buttonName:"Preview",
      dataList: [], //data candidates list
      componentTypes: blueComponentTypes, // components' types of blueprint
      modelConfig: modelConfig, //configuration detail of each component model
      dataTypes: config.typesPrefab, //Store all the data type which supported by vega-lite
      viewerbuttonbox:viewerbutton, //store/init the viewer review button
      container: "", //canvas to drawing blueprint
      selectedData: {}, //The dimensions in dataset which been selected by user
      dataComponent: {}, //The exsiting components in canvas (used to check the exsiting)
      blueComponents: [], //The exsiting components in canvas (used to store the exsiting)
      blueLines: [], //Store the connections between component which connected by curve
      mouseAction: "", //mouse action label which used to change the mouse action state
      drawingLine: "", //The line which is being darwing by user
      contextData: "", //Shows which dataset which is using in blueprint
      dataConnection:{}, //unknown function
      loadedDatasets:{}, //accroding datacomponent to loaded datasets
      blueComponentsTypeCount:{}, //store the count of component according to different type
      blueLinesName:[], // store the links between components
      blueComponentNameList:[], //the index made of componentid
      exstingPorts:[], //all of the component port in blueprint
      vegaObjectObj:{}, //vegaobject is used to generate graph throgh
      viewerData:{}, //store the data in different viewer
      layoutObj:{}, //store the vegaobject in different viewer
      viewerlayout: {}, //layout is the preset typesetting
      popupActivo4: false,
      layoutIdName:{}, //{"layout-0": "Template A"}
      layoutlist: ["A", "B"],
      A: false,
      B: false,
      tableData:null,
      isTable:false
    }
  },
  components:{
      TemplateA,
      TemplateB,
      DataPreviewTable,
      NavBar
  },
  methods: {

    //Intialized the blueprint canvas
    chartInit(container, props) {
      let that = this;
      let bluecomponentscountInit = function(that){
        //init blue componets counts
        for(const key in that.componentTypes){
          if(!that.blueComponentsTypeCount.hasOwnProperty(key)){
            that.blueComponentsTypeCount[key] = 0
          }
        }
      }

      for (let key in props) {
        this.data[key] = props[key];
      }
      this.container = d3.select("#editorborad");
      this.container.append("g").attr("id", "grid_layer");
      this.chartResize(window.innerWidth * 0.825, window.innerHeight * 0.6);
      bluecomponentscountInit(that)
      setTimeout(function(){
        that.notifications({'title':'Congratulations', 'text': 'drag and click to start your amazing work~', 'color': 'rgb(31,116,225)'})
      }, 3000)
    },

    //Resize the canvas after window's size has been updated
    chartResize(innerWidth, innerHeight) {
      let that = this
      let height = innerHeight > innerWidth * 2 ? innerWidth * 2 : innerHeight;
      let width = innerWidth;
      this.width = width;
      this.height = height;

      let drawGrids = function(that){
        //Darwing the grids line in canvas which help user the recognize the canvas and components        
        let lineData = [];
        for (let i = 10; i < that.width; i += 20) {
          lineData.push({ x1: i, y1: 0, x2: i, y2: that.height });
        }

        for (let i = 10; i < that.height; i += 20) {
          lineData.push({ x1: 0, y1: i, x2: that.width, y2: i });
        }

        if (that.container != "") {
          that.container
            .select("#grid_layer")
            .selectAll("*")
            .remove();

          that.container
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
      }

      d3.select("#editorborad")
        .attr("width", this.width)
        .attr("height", this.height);

      drawGrids(that);
    },

    //create a new component to canvas which need a component type and a unique name
    createNewComponent(){
      let that = this,
        property = null,
        _com = null;
      //func
      const addLineEvent = function(that, com){
        //darwing the connection line accroding to the mouse real-time position
        that.container.on("mousemove", function(d) {
          if (
            that.mouseAction == "drawing_line" &&
            that.drawingLine.getConnectInfo()["target"] == ""
          ) {
            let coordinates = d3.mouse(this);
            that.drawingLine.dynamicGenerateCurveLine(coordinates);
            that.drawingLine.findNearestPoint(coordinates, that.exstingPorts);
          }
        });
      }
      const addClickEvent2Circle = function(that, com){
        //boundind the click event to the circles which represent the ports in component
        //after click the circle, there will new a line in canvas
        com.getAllCircles().on("click", function(d) {
          let params = com.getParmas()
          let x = d.parentX + d.x;
          let y = d.parentY + d.y;
          let sourceid = params.id
          let line = (that.drawingLine = new BlueprintLine(
            that.container,
            params.name,
            [x, y],
            d,
            sourceid
          ));
          that.blueLines.push(line);
          that.mouseAction = "drawing_line";
          
          let allPorts = [];

          that.blueComponents.forEach(function(component,i) {
            //let ports = component.getAllPorts();
            let parmas = component.getParmas()
            let _inPorts = parmas["inPorts"]
            let _outPorts = parmas["outPorts"]
            let _id = parmas["id"]
            if (d.type == "in") {
              _outPorts.forEach(function(k) {
                //k.parent = component.id
                k.id = _id
                allPorts.push(k);
              });
            } else {
              _inPorts.forEach(function(k) {
                //k.parent = component.id
                k.id = _id
                allPorts.push(k);
              });
            }
          });

          that.exstingPorts = []
          that.exstingPorts = allPorts
          //line.setExstingPorts(allPorts);
          addLineEvent(that, com)
        });
      }
      const constructproperty = function(that, property, name){
        let obj = JSON.parse(JSON.stringify(property))
        
        //according to this.blueComponentsTypeCount construct id and add 1
        //make inports outports full
        //make sure that the viewer name equal to button content
        obj["fill"] = that.componentTypes[obj.type].color;
        obj["name"] = name;
        obj['id'] = obj.type + '-' + that.blueComponentsTypeCount[obj.type];
        obj['x'] = 300 * Math.random() + 100;
        obj['y'] = 300 * Math.random() + 100;

        for(let i=0; i<obj.inPorts.length; i++){
          obj.inPorts[i]["parentX"] = obj['x'];
          obj.inPorts[i]["parentY"] = obj['y'];
          obj.inPorts[i]["parent"] = obj['name'];
          obj.inPorts[i]["parentid"] = obj['id'];
        }
        if(obj.type != "Layout"){
          //layout do not have layout
          for(let i=0; i<obj.outPorts.length; i++){
            obj.outPorts[i]["parentX"] = obj['x'];
            obj.outPorts[i]["parentY"] = obj['y'];
            obj.outPorts[i]["parent"] = obj['name'];
            obj.outPorts[i]["parentid"] = obj['id'];
          }
        }
        if(obj.type == "Viewer"){
          let propertiesname = 'Viewer-' + that.blueComponentsTypeCount[obj.type];
          //create tab
          
          that.viewerbuttonbox.button.every(function(d,i){
            if(d['style'] == 'none'){
              d['style'] = 'block';
              d['content'] = propertiesname;
              obj["name"] = propertiesname; 
              return false
            }else{
              return true
            }
          })
        }
        if(obj.type == "Layout"){
          that.layoutIdName[obj.id] = {}
          that.layoutIdName[obj.id]["name"] = obj.name
          that.layoutIdName[obj.id]["ref"] = "msg" + "-" + obj.name.split(" ")[1]
        }
        that.blueComponentsTypeCount[obj.type] = that.blueComponentsTypeCount[obj.type] + 1
        _com = new BlueComponent(that.container, obj);
        that.blueComponents.push(_com);
        addClickEvent2Circle(that, _com);
      }
      const dimensionSelected = function(that, source, dim){
        dim.checked = !dim.checked;
        if (dim.checked == true) dim.color = "#808080";
        else dim.color = "#202020";

        //forced update datalist to re-rendering
        let origin = that.dataList;
        that.dataList = [];
        that.dataList = origin;

        if (that.selectedData[source] != undefined) {
          //如果存在该数据源
          if (that.selectedData[source][dim.name] != undefined) {
            //如果存在该数据源该属性
            that.selectedData[source][dim.name] = "0";
          } else {
            //如果存在该数据源不存在该属性
            that.selectedData[source][dim.name] = "1";
            that.dataComponent[source].addPort("out", {
              name: dim.name,
              text: dim.name,
              dimension_type: dim.type,
              type: "out",
              attr: "field"
            });
            addClickEvent2Circle(that, that.dataComponent[source]);
          }
        } else {
          //如果不存在该数据源 则初始化组件
          that.selectedData[source] = {}; //记录该数据源记录该数据源
          that.selectedData[source][dim.name] = "1";

          let properties = that.modelConfig["Table"];
          properties["outPorts"] = [
            {
              name: dim.name,
              text: dim.name,
              dimension_type: dim.type,
              type: "out",
              attr: "field"
            }
          ];
          properties["fill"] = "#F6BB42";
          properties["name"] = source;
          properties["id"] = source;
          properties['x'] = 300 * Math.random() + 100;
          properties['y'] = 300 * Math.random() + 100;
          

          let _com = new BlueComponent(that.container, properties);
          that.dataComponent[source] = _com;
          addClickEvent2Circle(that, _com);
          that.blueComponents.push(_com);

          if (!(source in that.loadedDatasets)){
            dataHelper.getDataDetail(source).then(function(response) {
              //that.vegaObject.setData(response.data.data.values);
              that.loadedDatasets[source] = response.data.data.values
            });
          }
        }
      }

      //logic
      //init generate property
      if(arguments.length == 1){
        //create function component
        let _name = arguments[0]
        constructproperty(that, that.modelConfig[_name], _name)
      } else if(arguments.length == 2){
        //create or add data component
        dimensionSelected(that, arguments[0], arguments[1])
      }
    },

    //generate chart
    generateChart(id, meta){
      let result = this.vegaObjectObj[meta["content"]].getOutputForced();
      //Show the result in bottom canvas via vage compilier
      vegaEmbed("#canvas", result, { theme: "default" });
      this.notifications({"title":result.title.text, "text": "Generate success~", "color": 'rgb(31,116,225)'})
    },
    //store litte function
    
    storeFunc(){
      
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
        if (id == this.blueComponents[i].getId()) {
          return this.blueComponents[i];
        }
      }
    },
    initTable(name){
      dataHelper.getDataDetail(name).then(res=>{
        // console.log(res.data.data.values)
        this.tableData = res.data.data.values
        this.$store.state.tableData = res.data.data.values
        this.isTable = !this.isTable
        if(this.buttonName==='Preview')
          this.buttonName = 'CloseTable'
        else
          this.buttonName = 'Preview'
      })
    },
    
    ///////////////////////////////
    // Add dimension to context data from candicate dataset
    // IF the component is exsit:
    //     Add a port to the component
    // ELSE
    //     Add a new component contain this port
    ////////////////////////////////

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
    catchConnect(connect){
      // catch ConnectInfo
      let that = this
      let interval = function(){
        let i = 0;
        let intr = setInterval(function() {
          let conInfo = connect.getConnectInfo()
          if (conInfo.targetId != ""){
            clearInterval(intr);
            that.buildBlueGraph(connect)
          }
        }, 500)
      }
      interval()
    }
    ,
    buildBlueGraph(con){
      let that = this
      let connect = con.getConnectInfo()
      let _source = connect.source
      let _target = connect.target
      let componentGraph = new Array() //two dimensional matrix of storage blueprint connection logic

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
          that.layoutObj[_target["id"]][_target["text"]] = JSON.parse(JSON.stringify(that.vegaObjectObj[_source["parentid"]]))

        }else{
          if(that.layoutObj[_target["id"]][_target["text"]] == undefined){

            that.layoutObj[_target["id"]][_target["text"]] = ""
            that.layoutObj[_target["id"]][_target["text"]] = JSON.parse(JSON.stringify(that.vegaObjectObj[_source["parentid"]]))
          }
        }
      }
      //每增加一条边就更新
      //首先处理componentIndex

      let linkname = connect.sourceId + "_" + connect.targetId
      let addId = [connect.sourceId, connect.targetId]
      addId.forEach(function(d){
        if(that.blueComponentNameList.indexOf(d) == -1){
          that.blueComponentNameList.push(d)
        }
      })
      //存入link
      if(this.blueLinesName.indexOf(linkname) == -1){
        this.blueLinesName.push(linkname)
      }
      //建立根据componentIndex覆盖更新二维数组
      this.blueComponentNameList.forEach(function(d, i){
        componentGraph[i] = new Array()
      })
      //graph init
      for(let i=0; i<this.blueComponentNameList.length; i++){
        for(let j=0; j<this.blueComponentNameList.length; j++){
          componentGraph[i][j] = 0
        }
      }
      for(let i=0; i<this.blueLinesName.length; i++){
        let indexsource = this.blueComponentNameList.indexOf(String(this.blueLinesName[i]).split('_')[0])
        let indextarget = this.blueComponentNameList.indexOf(String(this.blueLinesName[i]).split('_')[1])
        componentGraph[indexsource][indextarget] = 1
      }
      
      //获取view组件
      let viewerDict = {}
      let viewerList = []
      let viewerTreeLink = {}

      for(let i=0 ;i<this.blueComponentNameList.length; i++){
        if(this.blueComponentNameList[i] != ""){
          if(this.getComponentById(this.blueComponentNameList[i]).getType() == "Viewer"){
          if(!viewerDict.hasOwnProperty( this.blueComponentNameList[i] )){
            viewerDict[this.blueComponentNameList[i]] = i
            viewerList.push(this.blueComponentNameList[i])
            }
          }
        }
      }
      //根据view组件建立vegaObjectObj 若有新view则增加 若没有则删除/ 先执行删除 再增加/ 遍历两遍
      Object.keys(that.vegaObjectObj).forEach(function(d){
        if(viewerList.indexOf(d) == -1){
          //如果在viewerlist中没有该viewer,则该viewer已被删除,需从vegaObjectObj中去掉键值对
          delete that.vegaObjectObj[d]
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
        for(let k=0; k<that.blueComponentNameList.length; k++){
          if(componentGraph[k][j] == 1){
            let _source = that.blueComponentNameList[k] //id
            let _target = that.blueComponentNameList[j] //id
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
              if(that.viewerData[d] == undefined){
                that.viewerData[d] = []
                that.viewerData[d].push(com)
                let _loadedData = that.loadedDatasets[com]
                that.vegaObjectObj[d].setData(_loadedData)
              }
              else{
                if(that.viewerData[d].indexOf(com) == -1){
                  that.viewerData[d].push(com)
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
      for(let i=0; i<that.blueLines.length; i++){
        let lineInfo = that.blueLines[i].getConnectInfo()
        let _name = lineInfo.sourceId + '_' + lineInfo.targetId
        if(!(_name in connectionsDict)){
          connectionsDict[_name] = []
          connectionsDict[_name].push(lineInfo)
        }else{
          connectionsDict[_name].push(lineInfo)
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
           that.layoutObj[_targetid][_targettext] = JSON.parse(JSON.stringify(that.vegaObjectObj[d]))
         })
       })
    },
    notifications(message){
      this.$vs.notify({
        title:message.title,
        text:message.text,
        color:message.color,
        position:'bottom-right'
      })
    },
    graphPreview(){
      //check which layout
      //only allowed to exist one layout in blueEditor
      let that = this
      let key = Object.keys(that.layoutObj)
      if(key.length == 0){
        //alert notice that user should choose one layout
        that.notifications({'title':'Notice', 'text': 'Please select a layout', 'color': 'danger'})
      } else if(key.length == 1){
        that.layoutlist.forEach(function(d){
          if(d == that.layoutIdName[key[0]]["name"].split(" ")[1]){
            that[d] = true
            let _ref = that.layoutIdName[key[0]]["ref"]
            
            //owing to vue life circle, when the first click, the that.$refs[_ref] haven't loaded
            //when the second click, the that.$refs[_ref] have loaded
            if(that.$refs[_ref] != undefined){
              that.$refs[_ref].getModularInfo({"config": that.layoutObj[key[0]], "layoutname": key[0]})
              that.popupActivo4=!that.popupActivo4
            }
          }else{
            that[d] = false
          }
        })
      } else if(key.length == 2){
        that.notifications({'title':'Notice', 'text': 'Please choose one layout. You have now chosen two layouts.', 'color': 'danger'})
      }
    },
    remove(com){
      //find line connected with removedComponent
      //Cancellation bluecomponent and blueline methods: = null / delete in array
      //delete related variable
      let that = this,
        comid = com.getId(),
        comtype = com.getType()

      //first removeGraph bluecomponent
      com.removeGraph()
      //second find connected blueline/ removed graph/ delete in array
      for(let i=0; i<that.blueLines.length; i++){
        let lineinfo = that.blueLines[i].getConnectInfo()
        let _source = lineinfo.sourceId,
            _target = lineinfo.targetId,
            linkname = _source + "_" + _target

        if(comid == _source || comid == _target){
          that.blueLines[i].forceRemove();
          that.blueLines[i] = null;
          that.blueLines.splice(i, 1);
          i--;

          let index = that.blueLinesName.indexOf(linkname)
          that.blueLinesName.splice(index, 1)
        }
      }
      
      //third delete component in array
      for(let i=0; i<this.blueComponents.length; i++){
        if(comid == this.blueComponents[i].getId()){
          this.blueComponents[i] = null;
          this.blueComponents.splice(i, 1);
          
          break;
        }
      }
      
      //remove ports
      for(let i=0; i<that.exstingPorts.length; i++){
        if(comid == that.exstingPorts[i].parentid){
          this.exstingPorts.splice(i, 1);
        }
      }
      
      if(comtype == "Data"){
        delete that.selectedData[comid]
        delete that.dataComponent[comid]
      }else if(comtype == "Viewer"){
        let index = comid.split("-")[1]
        that.viewerbuttonbox.button[index]["content"] = "button" + index
        that.viewerbuttonbox.button[index]["style"] = "none"
        that.blueComponentsTypeCount[comtype] = that.blueComponentsTypeCount[comtype] + 1
      }
      that.blueComponentsTypeCount[comtype] = that.blueComponentsTypeCount[comtype] - 1
      // if exist viewer, "delete" remove button
      if(that.blueComponentNameList.length > 0){
        that.blueComponentNameList.splice(that.blueComponentNameList.indexOf(comid), 1)
      }
    },
    cleanPanel(){
      let that = this
      if(this.blueComponents.length == 0){
        this.notifications({'title':'Notice', 'text': 'There are no components here.', 'color': 'danger'})
        return;
      }
      //make sure remove all of the bluecomponents
      this.blueComponents.forEach(function(d,i){
        that.remove(d)
      })
      if(that.blueComponents[0] != null){
        this.remove(that.blueComponents[0]);
      }
      
      this.selectedData = {};
      this.dataComponent = {};
      this.blueComponents = [];
      this.blueLines = [];
      this.mouseAction = "";
      this.drawingLine = "";
      this.contextData = "";
      this.dataConnection = {};
      this.blueLinesName = [];
      this.blueComponentNameList = [];
      this.exstingPorts = [];
      this.vegaObjectObj = {};
      this.viewerData = {};
      this.layoutObj = {};
      this.viewerlayout = {};
      for(let key in this.blueComponentsTypeCount){
        this.blueComponentsTypeCount[key] = 0
      }
      this.notifications({'title':'Notice', 'text': 'clean panel success~', 'color': 'rgb(31,116,225)'})
    }
  
  },
  watch: {
    //Monitor the positon's change of component
    blueComponents: {
      handler(curVal, oldVal) {
        let that = this
        if(curVal.length == oldVal.length){
          for (let i = 0; i < this.blueComponents.length; i++){
            if(this.blueComponents[i].isDelete){
              that.remove(this.blueComponents[i])
              break;
            }
            
            let curEle = curVal[i];
            let preEle = oldVal[i];
            //Obtain the newest postion of each component
            let curPos = curEle.getPos();
            let prePos = preEle.getPos();

            if(this.blueLines.length > 0){
              this.blueLines.forEach(function(line, i){
                //寻找与组件相关的blueLines
                let connectInfo = line.getConnectInfo()
                if(connectInfo.sourceId == curEle.getId() || connectInfo.targetId == curEle.getId()){
                  line.parentPosUpdated(
                    curPos.dx, //delta of horizon postion
                    curPos.dy, //delta of vertical position
                    curEle.inPorts,
                    curEle.outPorts,
                    curEle.id
                  )
                }
                curEle.resetDeltaPos();
                preEle.resetDeltaPos();
              })
            }
          }
        }
      },
      deep: true
    },

    //Monitor the bluelines' length, if length increased, the new connection will be parsed
    blueLines: {
      handler(curVal, oldVal) {
        if(curVal.length != 0){
          let tailNo = curVal.length - 1;
          this.catchConnect(curVal[tailNo])
        }
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
    // dataHelper.getDataDetail('cars').then(res=>{
    //   console.log(res)
    // })
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
    dataHelper.getAllData().then(response => {
      console.log(response)
    })
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