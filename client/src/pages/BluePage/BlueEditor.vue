<template>
  <div id="blue-editor">
    <NavBar></NavBar>

    <div class="toolbar" style="position: absolute; top: 45px; right: 2%">
      <vs-button
        v-on:click="graphPreview"
        class="tool_button"
        radius
        color="#1473e6"
        type="filled"
        icon="view_quilt"
      ></vs-button>
      <vs-button
        v-on:click="cleanPanel"
        class="tool_button"
        radius
        color="#1473e6"
        type="filled"
        icon="autorenew"
      ></vs-button>
      <vs-button
        v-on:click="cleanChart"
        class="tool_button"
        radius
        color="#1473e6"
        type="filled"
        icon="delete"
      ></vs-button>
      <vs-button
        v-on:click="downloadSetting"
        class="tool_button"
        radius
        color="#1473e6"
        type="filled"
        icon="cloud_download"
      ></vs-button>
    </div>
    <vs-row style="height: 1075px">
      <!--整个高度为10-->

      <vs-col
        id="data_list_container"
        vs-justify="left"
        vs-align="top"
        vs-w="2"
        style="
          max-height: 1080px;
          overflow-y: scroll;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        "
      >
        <!--该列放置数据和操作-->
        <!--数据列-->

        <vs-divider border-style="solid" color="dark">DATALIST AREA</vs-divider>
        <vs-row vs-h="5" style="display: block">
          <div id="data_list">
            <vs-collapse
              accordion
              :key="index"
              v-for="(data, index) in dataList"
            >
              <vs-collapse-item
                style="background: rgb(142, 170, 255); border-radius: 10px"
              >
                <div
                  slot="header"
                  style="
                    color: white;
                    border-left: white solid 2px;
                    padding-left: 10px;
                    font-size: 15px;
                  "
                >
                  {{ data.name }}
                </div>

                <vs-button type="line" @click="initTable(data.name)">{{
                    buttonName
                  }}
                </vs-button>
                <span
                  style="
                    color: white;
                    padding: 5px;
                    float: right;
                    font-size: 15px;
                  "
                >Length: {{ data.length }}</span
                >

                <vs-divider style="margin: 3px"></vs-divider>

                <div :key="index" v-for="(dim, index) in data.dimensions">
                  <vs-list-item>
                    <h3 style="float: left; color: white">{{ dim.name }}</h3>
                    <vs-select
                      style="float: left; width: 80%"
                      v-model="dim.type"
                    >
                      <vs-select-item
                        :key="index"
                        :value="item.value"
                        :text="item.text"
                        v-for="(item, index) in dataTypes"
                      />
                    </vs-select>
                    <vs-avatar
                      style="
                        float: right;
                        margin: 0px;
                        margin-left: 10px;
                        background: rgb(167, 189, 255);
                      "
                      :color="dim.color"
                      text="+"
                      v-on:click="createNewComponent(data.name, dim)"
                    />
                  </vs-list-item>
                </div>
              </vs-collapse-item>
            </vs-collapse>
          </div>
        </vs-row>
        <!--功能列-->
        <vs-divider border-style="solid" color="dark">FUNCTION AREA</vs-divider>
        <vs-row vs-h="5">
          <div id="editor">
            <vs-collapse
              accordion
              :key="item.name"
              v-for="item in componentTypes"
            >
              <vs-collapse-item
                style="background: rgb(142, 170, 255); border-radius: 10px"
              >
                <div
                  slot="header"
                  style="
                    color: white;
                    border-left: white solid 2px;
                    padding-left: 10px;
                    font-size: 15px;
                  "
                >
                  {{ item.name }}
                </div>
                <vs-list :key="index" v-for="(meta, index) in item.childrens">
                  <vs-button
                    style="width: 80%; justify-content: left; margin-left: 10%"
                    color="rgb(167,189,255)"
                    type="filled"
                    v-on:click="createNewComponent(meta)"
                    icon="add_circle"
                  >{{ meta }}
                  </vs-button
                  >
                  <vs-divider></vs-divider>
                </vs-list>
              </vs-collapse-item>
            </vs-collapse>
          </div>
        </vs-row>
      </vs-col>

      <vs-col vs-w="10">
        <vs-row>
          <!--该列放置蓝图-->
          <vs-col
            vs-align="center"
            vs-w="12"
            style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
          >
            <div id="preview" style="background: rgba(0, 0, 0, 0.05)">
              <svg id="editorborad"></svg>
            </div>
          </vs-col>
        </vs-row>

        <vs-row
          v-if="!isTable"
          id="preview_container"
          vs-w="12"
          style="display: flex; padding: 20px 20px 20px 20px; height: 38%"
        >
          <vs-col vs-w="4" vs-align="center"
                  style="display: flex; flex-direction:column; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); justify-content:space-around;">
            <vs-row style="flex:1">
              <selectType />
            </vs-row>
            <vs-row style="flex: 3">
              <Guide2/>
            </vs-row>
            <vs-row style="flex-direction: column; flex: 1; position: relative;">
              <my-rate style="flex: 2" :score="2" textHtml="向导推荐评分：" disabled/>
              <my-rate style="flex: 2;" :score.sync="curScore" :textHtml="'用户评分：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'" />
              <button @click="handleSubmit" style="width: 40px; position: absolute; right: 10px; bottom: 10px;" :class="curScore === 0 ? 'button-disabled': ''">提交</button>
            </vs-row>
          </vs-col>
          <!--该列放置生成图-->
          <vs-col
            vs-type="flex"
            vs-align="center"
            vs-w="8"
            style="display: flex; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
          >
            <div style="padding: 0 15px 0 15px; height: 80%">
              <div
                style="padding-top: 10px"
                :key="index"
                v-for="(meta, index) in viewerbuttonbox"
              >
                <vs-button
                  color="primary"
                  type="border"
                  v-bind:id="meta.id"
                  :style="{ display: meta.style }"
                  v-on:click="generateChart(meta.id, meta)"
                >{{ meta.content }}
                </vs-button
                >
              </div>
            </div>
            <div
              style="height: 85%; border-right: 1px solid rgba(0, 0, 0, 0.2)"
            ></div>
            <div
              id="canvas"
              style="display: flex; with: 100%; padding-left: 20px"
            ></div>
            <AppMap></AppMap>
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
      <TemplateA v-if="A" ref="msg-A"></TemplateA>
      <TemplateB v-if="B" ref="msg-B"></TemplateB>
      <AutoPage></AutoPage>
    </vs-popup>
  </div>
</template>
<script>
import AppMap from "./AppMap";
// import store from "../../store/index"
import vegaEmbed from "vega-embed";
import config from "../../assets/config.json";
import $ from "jquery";
import dataHelper from "../../common/Helper/dataHelper";
import dataManager from "../../common/DataManager";
import caculator_modules from "../../common/Helper/caculator_modules";
import processor_modules from "../../common/Helper/processer_modules";
import BlueComponent from "../../common/BlueComponents/BlueComponent";
import * as d3 from "d3";
import blueComponentTypes from "../../assets/blueComponentTypes.json";
import modelConfig from "../../assets/modelConfig.json";
import VegaModel from "../../common/BlueComponents/vegaModel";
import viewerbutton from "../../assets/vsbuttonbox.json";
import {keys} from "d3";
import TemplateA from "../ViewLayouts/TemplateA";
import TemplateB from "../ViewLayouts/TemplateB";
import NavBar from "../../common/NavBar/NavBar";
import BlueprintLine from "../../common/BlueComponents/BlueprintLine";
import DataPreviewTable from "../../common/DataPreviewer/DataPreviewTable";
import Guide from "./Guide";
import Guide2 from "./Guide2";
//import AutoPage from "../AutoBoard/AutoPage";
import myRate from './Star'
import selectType from './SelectType'
export default {
  name: "blue-editor",
  data() {
    return {
      buttonName: "Preview",
      dataList: [], //data candidates list
      componentTypes: blueComponentTypes, // components' types of blueprint
      modelConfig: modelConfig, //configuration detail of each component model
      dataTypes: config.typesPrefab, //Store all the data type which supported by vega-lite
      viewerbuttonbox: viewerbutton, //store/init the viewer review button
      container: "", //canvas to drawing blueprint
      selectedData: {}, //The dimensions in dataset which been selected by user
      dataComponent: {}, //The exsiting components in canvas (used to check the exsiting)
      blueComponents: [], //The exsiting components in canvas (used to store the exsiting)
      blueLines: [], //Store the connections between component which connected by curve
      mouseAction: "", //mouse action label which used to change the mouse action state
      drawingLine: "", //The line which is being darwing by user
      contextData: "", //Shows which dataset which is using in blueprint
      dataConnection: {}, //unknown function
      loadedDatasets: {}, //accroding datacomponent to loaded datasets
      blueComponentsTypeCount: {}, //store the count of component according to different type
      blueLinesName: [], // store the links between components
      blueComponentNameList: [], //the index made of componentid
      exstingPorts: [], //all of the component port in blueprint
      vegaObjectObj: {}, //vegaobject is used to generate graph throgh
      chartData: {}, //store the data in different chart
      comChartCount: {}, // chart count -> distinguish chart
      chartLayout: {}, //layout is the preset typesetting
      chartLayoutObj: {}, //更新chartLayoutObj 用于存储layout-port-config
      popupActivo4: false,
      layoutIdName: {}, //{"layout-0": "Template A"}
      layoutlist: ["A", "B"],
      A: false,
      B: false,
      tableData: null,
      isTable: false,
      model_config_text: "", // store configuration of chart
      calculatorDict: {},
      blueLinesDelSignal: false, //true has been delete
      lastBlueLines: [],
      lineColor: {
        Chart: "#967ADC",
        Caculator: "#37BC9B",
        Layout: "#37BC22",
        Data: "#F6BB42",
      },
      mapchart: {
        HeatMap: "HeatMap",
        StraightLineMap: "StraightLineMap",
        ScatterMap: "ScatterMap",
        TrackMap: "TrackMap",
        AreaMap: "AreaMap",
        BezierCurveMap: "BezierCurveMap",
      },
      filetersdata: {
        data: "",
        selection: "",
      },
      Aggregationdata: {
        data: "",
        selection: "",
      },
      oldoprationSourec:'',
      oldoprationdata:null,
      oldoprationSourecID:null,
      lastopration:null,
      lastname:null,
      lastencoding:null,
      curScore: 0
    };
  },
  components: {
    TemplateA,
    TemplateB,
    DataPreviewTable,
    NavBar,
    Guide,
    Guide2,
    AppMap,
    myRate,
    selectType
  },
  created() {
    //
    this.openFullScreen();
  },
  methods: {
    handleSubmit(){
      console.log(this.curScore)
    },
    creatAggregation(dom) {
      let that = this;
      d3.select(dom).select("rect").attr("height", 120);
      let w = d3.select(dom).select("rect").attr("width");
      let h = d3.select(dom).select("rect").attr("height");
      let margin = {top: 80, bottom: 5, left: 10, right: 10};
      let g = d3.select(dom).append("g").attr("class", "_Aggregation");
      g.selectAll("circle")
        .data([1, 2, 3])
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
          return 20 + ((w - margin.left - margin.right) / 3) * i;
        })
        .attr("cy", 110)
        .attr("r", 6)
        .attr("fill", "white")
        .attr("value", function (d) {
          return d;
        })
        .on("click", function () {
          let arrg = ["Sum", "Count", "Avg"];
          let value = d3.select(this).attr("value");
          that.Aggregationdata.data = arrg[value - 1];
          d3.select("._Aggregation")
            .selectAll("circle")
            .attr("fill", function (d) {
              if (d != value) return "white";
              else {
                return "red";
              }
            });
        });
      d3.select(dom)
        .selectAll("T_Aggregation")
        .data(["Sum", "Count", "Avg"])
        .enter()
        .append("text")
        .attr("class", "T_Aggregation")
        .attr("alignment-baseline", "central")
        .attr("x", function (d, i) {
          return 26 + ((w - margin.left - margin.right) / 3) * i;
        })
        .attr("y", 110)
        .attr("fill", "white")
        .attr("font-size", "14")
        .text(function (d) {
          return d;
        });
    },
    createSolider(dom, datas, targers) {
      let datarange = [];
      let min = 9999999,
        max = 0;

      if (d3.select(dom).select(".labelleft")._parents[0] != null) {
        console.log("err");
        return;
      }
      if (datas[0] == undefined || isNaN(Number(datas[0][targers]))) {
        console.log("err2");
        return;
      }
      for (var i = 0; i < datas.length; i++) {
        if (Number(datas[i][targers]) > max) {
          max = Number(datas[i][targers]);
        }
        if (Number(datas[i][targers]) < min) {
          min = Number(datas[i][targers]);
        }
      }
      datarange[0] = min;
      datarange[1] = max;

      d3.select(dom).select("rect").attr("height", 120);
      let w = d3.select(dom).select("rect").attr("width");
      let h = d3.select(dom).select("rect").attr("height");

      let margin = {top: 80, bottom: 5, left: 10, right: 10};
      let width = w - margin.left - margin.right;
      let height = h - margin.top - margin.bottom;
      let x = d3
        .scaleLinear()
        .domain(datarange) // data space
        .range([0, width]); // display space
      let g = d3
        .select(dom)
        .append("g")
        .attr("transform", "translate(10,80)")
        .attr("class", "filter_solider");
      let labelL = g
        .append("text")
        .attr("class", "labelleft")
        .attr("x", 0)
        .attr("y", height + 5);
      let labelR = g
        .append("text")
        .attr("class", "labelright")
        .attr("x", 0)
        .attr("y", height + 5);
      let brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("brush", function () {
          let s = d3.event.selection;
          // update and move labels
          labelL.attr("x", s[0]).text(x.invert(s[0]).toFixed(2));
          labelR.attr("x", s[1]).text(x.invert(s[1]).toFixed(2));
          // move brush handles
          handle.attr("display", null).attr("transform", function (d, i) {
            return "translate(" + [s[i], -height / 4] + ")";
          });
          // update view
          // if the view should only be updated after brushing is over,
          // move these two lines into the on('end') part below
          d3.select(dom).node().value = s.map(function (d) {
            var temp = x.invert(d);
            return +temp.toFixed(2);
          });
          d3.select(dom).node().dispatchEvent(new CustomEvent("input"));
        });
      // append brush to g
      let gBrush = g.append("g").attr("class", "brush").call(brush);

      // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
      let brushResizePath = function (d) {
        let e = +(d.type == "e"),
          x = e ? 1 : -1,
          y = height / 2;
        return (
          "M" +
          0.5 * x +
          "," +
          y +
          "A6,6 0 0 " +
          e +
          " " +
          6.5 * x +
          "," +
          (y + 6) +
          "V" +
          (2 * y - 6) +
          "A6,6 0 0 " +
          e +
          " " +
          0.5 * x +
          "," +
          2 * y +
          "Z" +
          "M" +
          2.5 * x +
          "," +
          (y + 8) +
          "V" +
          (2 * y - 8) +
          "M" +
          4.5 * x +
          "," +
          (y + 8) +
          "V" +
          (2 * y - 8)
        );
      };

      let handle = gBrush
        .selectAll(".handle--custom")
        .data([{type: "w"}, {type: "e"}])
        .enter()
        .append("path")
        .attr("class", "handle--custom")
        .attr("stroke", "#000")
        .attr("fill", "#eee")
        .attr("cursor", "ew-resize")
        .attr("d", brushResizePath);

      // override default behaviour - clicking outside of the selected area
      // will select a small piece there rather than deselecting everything
      // https://bl.ocks.org/mbostock/6498000
      gBrush
        .selectAll(".overlay")
        .each(function (d) {
          d.type = "selection";
        })
        .on("mousedown touchstart", brushcentered);

      function brushcentered() {
        let dx = x(1) - x(0), // Use a fixed width when recentering.
          cx = d3.mouse(this)[0],
          x0 = cx - dx / 2,
          x1 = cx + dx / 2;
        d3.select(this.parentNode).call(
          brush.move,
          x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]
        );
      }

      // select entire range
      gBrush.call(brush.move, datarange.map(x));
    },

    //Intialized the blueprint canvas
    chartInit(container, props) {
      let that = this;
      let bluecomponentscountInit = function (that) {
        //init blue componets counts
        for (const key in that.componentTypes) {
          if (key == "Chart") {
            that.componentTypes[key]["childrens"].forEach((d, i) => {
              if (!that.comChartCount.hasOwnProperty(d)) {
                that.comChartCount[d] = 0;
              }
            });
          }
          if (!that.blueComponentsTypeCount.hasOwnProperty(key)) {
            that.blueComponentsTypeCount[key] = 0;
          }
        }
      };

      for (let key in props) {
        this.data[key] = props[key];
      }
      this.container = d3.select("#editorborad");
      this.container.append("g").attr("id", "grid_layer");
      this.chartResize(window.innerWidth * 0.825, window.innerHeight * 0.6);
      bluecomponentscountInit(that);
      this.containerListener();
      setTimeout(function () {
        that.notifications({
          title: "Congratulations",
          text: "drag and click to start your amazing work~",
          color: "rgb(31,116,225)",
        });
      }, 3000);
    },
    //container listener
    containerListener() {
      //distinguish click and dblclick
      let that = this;

      function clickcancel() {
        var event = d3.dispatch("click", "dblclick");

        function cc(selection) {
          var down,
            tolerance = 5,
            last,
            wait = null;

          // euclidean distance
          function dist(a, b) {
            return Math.sqrt(
              Math.pow(a[0] - b[0], 2),
              Math.pow(a[1] - b[1], 2)
            );
          }

          selection.on("mousedown", function () {
            down = d3.mouse(document.body);
            last = +new Date();
          });
          selection.on("mouseup", function () {
            if (dist(down, d3.mouse(document.body)) > tolerance) {
              return;
            } else {
              if (wait) {
                window.clearTimeout(wait);
                wait = null;
                event.call("dblclick", this, d3.event);
                //event.dblclick(d3.event);
              } else {
                wait = window.setTimeout(
                  (function (e) {
                    return function () {
                      event.call("click", this, e);
                      //event.click(e);
                      wait = null;
                    };
                  })(d3.event),
                  300
                );
              }
            }
          });
        }

        let rebind = function (target, source) {
          var i = 1,
            n = arguments.length,
            method;
          while (++i < n)
            target[(method = arguments[i])] = d3_rebind(
              target,
              source,
              source[method]
            );
          return target;
        };

        function d3_rebind(target, source, method) {
          return function () {
            var value = method.apply(source, arguments);
            return value === source ? target : value;
          };
        }

        return rebind(cc, event, "on");
      }

      function deleteSingleLine() {
        that.drawingLine.remove();
        that.blueLines.pop();
        that.drawingLine = "";
        that.mouseAction == "";
        that.container.on("mousemove", null);
      }

      let cc = clickcancel();
      d3.select("#editorborad").call(cc);

      cc.on("click", function (d) {});
      cc.on("dblclick", function (d) {
        if (that.mouseAction == "drawing_line" && that.drawingLine != "") {
          deleteSingleLine();
        }
      });
    },
    //Resize the canvas after window's size has been updated
    chartResize(innerWidth, innerHeight) {
      let that = this;
      let height = innerHeight > innerWidth * 2 ? innerWidth * 2 : innerHeight;
      let width = innerWidth;
      this.width = width;
      this.height = height;

      let drawGrids = function (that) {
        //Darwing the grids line in canvas which help user the recognize the canvas and components
        let lineData = [];
        for (let i = 10; i < that.width; i += 20) {
          lineData.push({x1: i, y1: 0, x2: i, y2: that.height});
        }

        for (let i = 10; i < that.height; i += 20) {
          lineData.push({x1: 0, y1: i, x2: that.width, y2: i});
        }

        if (that.container != "") {
          that.container.select("#grid_layer").selectAll("*").remove();

          that.container
            .select("#grid_layer")
            .selectAll(".grid_lines")
            .data(lineData)
            .enter()
            .append("line")
            .attr("x1", (d) => d.x1)
            .attr("x2", (d) => d.x2)
            .attr("y1", (d) => d.y1)
            .attr("y2", (d) => d.y2)
            .attr("stroke", "#00000030");
        }
      };

      d3.select("#editorborad")
        .attr("width", this.width)
        .attr("height", this.height);

      drawGrids(that);
    },

    //create a new component to canvas which need a component type and a unique name
    createNewComponent() {
      let that = this,
        property = null,
        _com = null;
      //func
      const addLineEvent = function (that, com) {
        //darwing the connection line accroding to the mouse real-time position
        that.container.on("mousemove", function (d) {
          if (
            that.mouseAction == "drawing_line" &&
            that.drawingLine.getConnectInfo()["target"] == ""
          ) {
            let coordinates = d3.mouse(this);

            that.drawingLine.dynamicGenerateCurveLine(coordinates);
            that.drawingLine.findNearestPoint(coordinates, that.exstingPorts);
          }
        });
      };
      const addClickEvent2Circle = function (that, com) {
        //boundind the click event to the circles which represent the ports in component
        //after click the circle, there will new a line in canvas
        com.getAllCircles().on("click", function (d) {
          let coverType = com.getType(),
            coverColor = that.lineColor[coverType],
            params = com.getParmas(),
            x = d.parentX + d.x,
            y = d.parentY + d.y,
            sourceid = params.id;
          let line = (that.drawingLine = new BlueprintLine(
            that.container,
            params.name,
            [x, y],
            d,
            sourceid,
            coverColor
          ));
          that.blueLines.push(line);
          that.mouseAction = "drawing_line";

          let allPorts = [];

          that.blueComponents.forEach(function (component, i) {
            //let ports = component.getAllPorts();
            let parmas = component.getParmas();
            let _inPorts = parmas["inPorts"];
            let _outPorts = parmas["outPorts"];
            let _id = parmas["id"];
            if (d.type == "in") {
              _outPorts.forEach(function (k) {
                //k.parent = component.id
                k.id = _id;
                allPorts.push(k);
              });
            } else {
              _inPorts.forEach(function (k) {
                //k.parent = component.id
                k.id = _id;
                allPorts.push(k);
              });
            }
          });

          that.exstingPorts = [];
          that.exstingPorts = allPorts;
          //line.setExstingPorts(allPorts);
          addLineEvent(that, com);
        });
      };
      const constructproperty = function (that, property, name) {
        // console.log(property)
        let obj = JSON.parse(JSON.stringify(property));
        //according to this.blueComponentsTypeCount construct id and add 1
        //make inports outports full
        //make sure that the viewer name equal to button content
        obj["fill"] = that.componentTypes[obj.type].color;
        if (that.mapchart[obj.maker] != null) {
          //mapchart color
          obj["fill"] = "#3256FF";
        }
        obj["name"] = name;
        obj["id"] = obj.type + "-" + that.blueComponentsTypeCount[obj.type];
        obj["x"] = 300 * Math.random() + 100;
        obj["y"] = 300 * Math.random() + 100;

        for (let i = 0; i < obj.inPorts.length; i++) {
          obj.inPorts[i]["parentX"] = obj["x"];
          obj.inPorts[i]["parentY"] = obj["y"];
          obj.inPorts[i]["parent"] = obj["name"];
          obj.inPorts[i]["parentid"] = obj["id"];
        }
        if (obj.type != "Layout") {
          //layout do not have layout
          for (let i = 0; i < obj.outPorts.length; i++) {
            obj.outPorts[i]["parentX"] = obj["x"];
            obj.outPorts[i]["parentY"] = obj["y"];
            obj.outPorts[i]["parent"] = obj["name"];
            obj.outPorts[i]["parentid"] = obj["id"];
          }
        }
        if (obj.type == "Layout") {
          that.layoutIdName[obj.id] = {};
          that.layoutIdName[obj.id]["name"] = obj.name;
          that.layoutIdName[obj.id]["ref"] =
            "msg" + "-" + obj.name.split(" ")[1];
        }
        if (obj.type == "Chart") {
          let propertiesname = obj.name + "-" + that.comChartCount[obj.name];
          that.comChartCount[obj.name] = that.comChartCount[obj.name] + 1;

          that.viewerbuttonbox.every(function (d, i) {
            if (d["style"] == "none") {
              d["style"] = "block";
              d["content"] = propertiesname;
              obj["name"] = propertiesname;
              d["id"] = obj["id"];
              return false;
            } else {
              return true;
            }
          });
        }
        that.blueComponentsTypeCount[obj.type] =
          that.blueComponentsTypeCount[obj.type] + 1;

        //test
        console.log(that.container);
        console.log(obj);

        _com = new BlueComponent(that.container, obj);
        console.log(_com.container._groups[0][0]);

        that.blueComponents.push(_com);
        addClickEvent2Circle(that, _com);
        // d3.select().select("rect").attr("height",120)
        if (_com.name == "Filters") {
          that.filetersdata["selection"] = _com.container._groups[0][0];
        }
        if (_com.name == "Aggregation") {
          that.Aggregationdata["selection"] = _com.container._groups[0][0];
          that.creatAggregation(that.Aggregationdata.selection);
        }
      };
      const dimensionSelected = function (that, source, dim) {
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
            console.log(dim);
          } else {
            //如果存在该数据源不存在该属性

            that.selectedData[source][dim.name] = "1";
            that.dataComponent[source].addPort("out", {
              name: dim.name,
              text: dim.name,
              dimension_type: dim.type,
              type: "out",
              attr: "field",
            });
            addClickEvent2Circle(that, that.dataComponent[source]);
          }
        } else {
          //如果不存在该数据源 则初始化组件
          that.selectedData[source] = {}; //记录该数据源记录该数据源
          that.selectedData[source][dim.name] = "1";

          let properties = that.modelConfig["Table"];
          console.log(properties);
          properties["outPorts"] = [
            {
              name: dim.name,
              text: dim.name,
              dimension_type: dim.type,
              type: "out",
              attr: "field",
            },
          ];
          properties["fill"] = "#F6BB42";
          properties["name"] = source;
          properties["id"] = source;
          properties["x"] = 300 * Math.random() + 100;
          properties["y"] = 300 * Math.random() + 100;

          let _com = new BlueComponent(that.container, properties);
          that.dataComponent[source] = _com;
          addClickEvent2Circle(that, _com);
          that.blueComponents.push(_com);

          if (!(source in that.loadedDatasets)) {
            dataHelper.getDataDetail(source).then(function (response) {
              //that.vegaObject.setData(response.data.data.values);
              that.loadedDatasets[source] = response.data.data.values;
            });
          }
        }
      };

      //logic
      //init generate property
      if (arguments.length == 1) {
        //create function component
        let _name = arguments[0];
        constructproperty(that, that.modelConfig[_name], _name);
      } else if (arguments.length == 2) {
        //create or add data component
        dimensionSelected(that, arguments[0], arguments[1]);
      }
    },

    //generate chart
    generateChart(id, meta) {
      let that = this;
      let result = this.vegaObjectObj[meta["id"]].getOutputForced();
      //Show the result in bottom canvas via vage compilier
      console.log(111)
      console.log(result);
      console.log(result.style);

      if (that.mapchart[result.layer[0].mark] != null){
        that.$store.commit("mapdata", {
          maptype: result.layer[0].mark,
          encoding: result.layer[0].encoding,
          data: result.data.values,
        });
         this.notifications({
          title: result.title.text,
          text: "Generate success~",
          color: "rgb(31,116,225)",
        });
      }
      else {
        vegaEmbed("#canvas", result, {theme: "default"});
        this.notifications({
          title: result.title.text,
          text: "Generate success~",
          color: "rgb(31,116,225)",
        });
      }
    },

    //find the component by the component's name
    getComponentByName(name) {
      //by id
      for (let i = 0; i < this.blueComponents.length; i++) {
        if (name == this.blueComponents[i].name) {
          return this.blueComponents[i];
        }
      }
    },
    getComponentById(id) {
      //by id
      for (let i = 0; i < this.blueComponents.length; i++) {
        if (id == this.blueComponents[i].getId()) {
          return this.blueComponents[i];
        }
      }
    },
    initTable(name) {
      dataHelper.getDataDetail(name).then((res) => {
        // console.log(res.data.data.values)
        this.tableData = res.data.data.values;
        this.$store.state.tableData = res.data.data.values;
        this.isTable = !this.isTable;
        if (this.buttonName === "Preview") this.buttonName = "CloseTable";
        else this.buttonName = "Preview";
      });
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
      
      console.log(source, target);
      source["targetname"] = target.name;
      source["parentname"] = target.parent;
       
      // The case of source attribution is 「FIELD」 and target is 「ENCODING」
      if ((source.attr == "field" && target.attr == "encoding")) {
        //console.log(source.dimension_type, source.name, target.name)
        //that.calculator[source["id"]] -> sum_miles_per_gallon_cylinders
        let metaName = "",
          metaType = "";
        if (source.parentid != undefined) {
          if (source.parentid.split("-")[0] == "Chart")
            console.log(target.name);
          if (source.parentid.split("-")[0] == "Calculator") {
            metaName = that.calculatorDict[source["id"]];
            metaType = "quantitative";
          } else {
            metaName = source.name;
            metaType = source.dimension_type;
          }
        } else {
          metaName = source.name;
          metaType = source.dimension_type;
        }

        let meta = {
          name: metaName, // source.name
          key: target.name,
          type: metaType, //source.dimension_type,
        };

        let maker = that.modelConfig[target.parent].maker;
        console.log("setEncoding", meta);

        that.vegaObjectObj[vegaObjKey].setEncoding(target.parent, meta);
        that.vegaObjectObj[vegaObjKey].setMark(target.parent, maker);
      }
     
      // The case of source attribution is 「FIELD」 and target is 「OPERATOR」
      if (source.attr == "field" && target.attr == "operator") {
        // if(that.lastopration!=null&&target.parent!=that.lastopration)return
        caculator_modules.setOperator(source);

        if (caculator_modules.operatorsSetted()) {
          let result = {};

          if (target.parent == "Sum")
            result = caculator_modules.sum(
              that.vegaObjectObj[vegaObjKey].getData()
            );
          else if (target.parent == "Reduce")
            result = caculator_modules.reduce(
              that.vegaObjectObj[vegaObjKey].getData()
            );
          else if (target.parent == "Multi")
            result = caculator_modules.multiple(that.vegaObjectObj[vegaObjKey].getData());
            else if(target.parent=="Sort")
            result=caculator_modules.Sorts(that.vegaObjectObj[vegaObjKey].getData());
            else if(target.parent=="Aggregation")
            result=caculator_modules.Aggregations(that.Aggregationdata.data,that.vegaObjectObj[vegaObjKey].getData());
            else if(target.parent=="Filters")
            result=caculator_modules.Filters(that.filetersdata.selection,that.vegaObjectObj[vegaObjKey].getData());
            else if(target.parent=="Features")
            {
              if(that.oldoprationdata!=null){
                result=caculator_modules.features(that.oldoprationdata);
                that.oldoprationdata=result.data
                that.lastname=result.name
              }else{
                result=caculator_modules.features(that.vegaObjectObj[vegaObjKey].getData());
              }
            }
                
          console.log(result)
          let newData = result.data,
            newName = result.name;

          if (!target.id in that.calculatorDict) {
            that.calculatorDict[target["id"]] = newName;
          }

          that.vegaObjectObj[vegaObjKey].setData(newData);
          caculator_modules.resetOperators();

          let _com = that.getComponentByName(target.parent);
          console.log(_com)
          _com.setFieldName(newName);
          console.log(newName)
          console.log(vegaObjKey)
          console.log(that.vegaObjectObj[vegaObjKey])
          if(that.lastopration!=null&&that.lastencoding!=null){
           that.vegaObjectObj[vegaObjKey].setData(that.oldoprationdata);
            that.vegaObjectObj[vegaObjKey].layers[that.lastencoding.charttype].encoding[that.lastencoding.chartaxis]={'field':that.lastname,'type':"quantitative",'sort':null}
          }
         
        }
      
      }

      // The case of source attribution is 「FIELD」 and target is 「CONNECTOR」

      if (source.attr == "field" && target.attr == "connector") {
        if (this.loadedDatasets[source.parent] == undefined) {
          await dataHelper
            .getDataDetail(source.parent)
            .then(function (response) {
              that.loadedDatasets[source.parent] = response.data.data.values;
            });
        }

        if (this.dataConnection[source.parent] == undefined) {
          this.dataConnection[source.parent] = {
            data: this.loadedDatasets[source.parent],
            dataName: source.parent,
            dim: source.name,
          };
          let connectionNames = d3.keys(this.dataConnection);
          if (connectionNames.length == 2) {
            let data1 = this.dataConnection[connectionNames[0]];
            let data2 = this.dataConnection[connectionNames[1]];

            if (target.parent == "Left Join") {
              let newData = dataHelper.leftJoin(data1, data2);
              that.vegaObjectObj[vegaObjKey].setData(newData);

              let _com1 = this.getComponentByName(connectionNames[0]);
              let _com2 = this.getComponentByName(connectionNames[1]);

              _com1.addDataName2Ports();
              _com2.addDataName2Ports();

              this.contextData = this.contextData + "." + source.parent;
            } else if (target.parent == "Right Join") {
              let newData = dataHelper.rightJoin(data1, data2);
              that.vegaObjectObj[vegaObjKey].setData(newData);

              let _com1 = this.getComponentByName(connectionNames[0]);
              let _com2 = this.getComponentByName(connectionNames[1]);

              _com1.addDataName2Ports();
              _com2.addDataName2Ports();

              this.contextData = this.contextData + "." + source.parent;
            } else if (target.parent == "Inner Join") {
              let newData = dataHelper.innerJoin(data1, data2);
              that.vegaObjectObj[vegaObjKey].setData(newData);

              let _com1 = this.getComponentByName(connectionNames[0]);
              let _com2 = this.getComponentByName(connectionNames[1]);

              _com1.addDataName2Ports();
              _com2.addDataName2Ports();

              this.contextData = this.contextData + "." + source.parent;
            } else {
              let newData = dataHelper.outerJoin(data1, data2);
              that.vegaObjectObj[vegaObjKey].setData(newData);

              let _com1 = this.getComponentByName(connectionNames[0]);
              let _com2 = this.getComponentByName(connectionNames[1]);

              _com1.addDataName2Ports();
              _com2.addDataName2Ports();

              this.contextData = this.contextData + "." + source.parent;
            }
          } else if (d3.keys(this.dataConnection).length > 2) {
            this.dataConnection[source.parent] = {};
            this.dataConnection[source.parent] = {
              data: this.loadedDatasets[source.parent],
              dataName: source.parent,
              dim: source.name,
            };
          }
        }
      }

      // The case of source attribution is 「FIELD」 and target is PROCESSOR
      if (source.attr == "field" && target.attr == "processor") {
        let sourcePortName = source.name;
        let index = null;

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
            type: source.dimension_type,
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
    catchConnect(option) {
      // catch ConnectInfo
      let that = this;
      let interval = function (con) {
        let i = 0;
        let intr = setInterval(function () {
          let conInfo = con.getConnectInfo();
          if (conInfo.targetId != "") {
            clearInterval(intr);
            that.buildBlueGraph(con);
          }
        }, 500);
      };
      let emptyItems = function () {
        that.chartLayout = {};
        that.chartLayoutObj = {};
        that.blueComponentNameList = [];
        that.vegaObjectObj = {};
        that.chartData = {};
      };
      let removeDeltedLine = function () {
        let savedLine = [];
        that.blueLines.forEach(function (d, i) {
          if (d.getConnectInfo().isDeleted == false) {
            savedLine.push(d);
          }
        });
        that.blueLines = savedLine;
      };
      if (option == "add") {
        let tailNo = that.blueLines.length - 1;
        interval(that.blueLines[tailNo]);
      } else if (option == "delete") {
        //delete removed blueprint line
        that.blueLinesDelSignal = true;
        removeDeltedLine();
      } else if (option == "afterdelete") {
        //empty the bluegraph map
        //buildBlueGraph
        emptyItems();
        that.blueLines.forEach(function (d, i) {
          interval(d);
        });
      } else if (option == "empty") {
        //empty the bluegraph map
        emptyItems();
      }
    },
    

    async testT(source, target, data){
       let that = this;
      let result =[];
      source["targetname"] = target.name;
      source["parentname"] = target.parent;
      caculator_modules.setOperator(source);
       if (caculator_modules.operatorsSetted()) {
          

          if (target.parent == "Sum")
            result = caculator_modules.sum(
              data
            );
          else if (target.parent == "Reduce")
            result = caculator_modules.reduce(
             data
            );
          else if (target.parent == "Multi")
            result = caculator_modules.multiple(data);
            else if(target.parent=="Sort")
            result=caculator_modules.Sorts(data);
            else if(target.parent=="Aggregation")
            result=caculator_modules.Aggregations(that.Aggregationdata.data,data);
            else if(target.parent=="Filters")
            result=caculator_modules.Filters(that.filetersdata.selection,data);
            else if(target.parent=="Features")
                result=caculator_modules.features(data);
         that.oldoprationdata=result.data
        
          // let newData = result.data,
          //   newName = result.name;

          // if (!target.id in that.calculatorDict) {
          //   that.calculatorDict[target["id"]] = newName;
          // }

          // that.vegaObjectObj[vegaObjKey].setData(newData);
          // caculator_modules.resetOperators();

          // let _com = that.getComponentByName(target.parent);
          // _com.setFieldName(newName);
        }
       
    },


    
    buildBlueGraph(con) {
      let that = this;
      let connect = con.getConnectInfo();
      let _source = connect.source;
      let _target = connect.target;
      let componentGraph = new Array();
      //two dimensional matrix of storage blueprint connection logic

      //更新that.chartlayoutObj viewer- layout-0_chartA parentid + "_" + text
      if (_target.attr == "Layout") {
        //建立索引 用于更新layout-port
        if (that.chartLayout[_source["parentid"]] == undefined) {
          that.chartLayout[_source["parentid"]] = [];
          let _name = _target.id + "_" + _target.text;
          that.chartLayout[_source["parentid"]].push(_name);
        } else {
          let _name = _target.id + "_" + _target.text;
          that.chartLayout[_source["parentid"]].push(_name);
        }

        //更新chartLayoutObj 用于存储layout-port-config
        if (that.chartLayoutObj[_target["id"]] == undefined) {
          that.chartLayoutObj[_target["id"]] = {};

          that.chartLayoutObj[_target["id"]][_target["text"]] = "";
          that.chartLayoutObj[_target["id"]][_target["text"]] = JSON.parse(
            JSON.stringify(that.vegaObjectObj[_source["parentid"]])
          );
        } else {
          if (
            that.chartLayoutObj[_target["id"]][_target["text"]] == undefined
          ) {
            that.chartLayoutObj[_target["id"]][_target["text"]] = "";
            that.chartLayoutObj[_target["id"]][_target["text"]] = JSON.parse(
              JSON.stringify(that.vegaObjectObj[_source["parentid"]])
            );
          }
        }
      }
     
      if (connect.target.parent == "Filters") {
        console.log("fileters");

        that.createSolider(
          this.filetersdata.selection,
          this.loadedDatasets[connect.sourceId],
          connect.source.name
        );
      }
      
      
      //每增加一条边就更新
      //首先处理componentIndex

      let linkname = connect.sourceId + "_" + connect.targetId;
      let addId = [connect.sourceId, connect.targetId];
      addId.forEach(function (d) {
        if (that.blueComponentNameList.indexOf(d) == -1) {
          that.blueComponentNameList.push(d);
        }
      });
      //存入link
      if (this.blueLinesName.indexOf(linkname) == -1) {
        this.blueLinesName.push(linkname);
      }
      //建立根据componentIndex覆盖更新二维数组
      this.blueComponentNameList.forEach(function (d, i) {
        componentGraph[i] = new Array();
      });
      //graph init
      console.log(this.blueComponentNameList);
      for (let i = 0; i < this.blueComponentNameList.length; i++) {
        for (let j = 0; j < this.blueComponentNameList.length; j++) {
          componentGraph[i][j] = 0;
        }
      }
      for (let i = 0; i < this.blueLinesName.length; i++) {
        let indexsource = this.blueComponentNameList.indexOf(
          String(this.blueLinesName[i]).split("_")[0]
        );
        let indextarget = this.blueComponentNameList.indexOf(
          String(this.blueLinesName[i]).split("_")[1]
        );

        componentGraph[indexsource][indextarget] = 1;
      }


      console.log(_source);
      console.log(this.loadedDatasets);
      console.log(connect);
      console.log(this.blueLinesName)
      console.log(componentGraph)
      if(connect['source'].parentid==undefined&&connect['target'].parentid.split("-")[0] === "Caculator"){
        that.oldoprationSourec=connect['source']
        that.oldoprationSourecID=connect['sourceId']
      }
      if(connect['source'].parentid!=undefined&&connect['source'].parentid!=undefined)
      {
        console.log(connect['source'].parentid.split("-"),connect['target'].parentid.split("-"))
        console.log(connect['source'].parentid.split("-")[0] == "Caculator",connect['target'].parentid.split("-")[0] === "Caculator")
        if((connect['source'].parentid.split("-")[0] == "Caculator"&&connect['target'].parentid.split("-")[0] == "Caculator"))
           {
             that.lastopration=connect['target'].parent
             console.log(that.oldoprationSourec)
             that.testT(that.oldoprationSourec,connect['source'],this.loadedDatasets[that.oldoprationSourecID])
             console.log(that.oldoprationdata)
            }
      }
      if(that.lastopration!=null&&connect['source'].parentid!=undefined)
      {
        if((connect['source'].parentid.split("-")[0] == "Caculator"&&connect['target'].parentid.split("-")[0] == "Chart"))
           {
             that.lastencoding={'charttype':connect['target'].parent,'chartaxis':connect['target'].name}  
             console.log(that.lastencoding)
          }
      }


      //获取chart组件
      let chartDict = {};
      let chartList = [];
      let chartTreeLink = {};

      for (let i = 0; i < this.blueComponentNameList.length; i++) {
        if (this.blueComponentNameList[i] != "") {
          if (
            this.getComponentById(this.blueComponentNameList[i]).getType() ==
            "Chart"
          ) {
            if (!chartDict.hasOwnProperty(this.blueComponentNameList[i])) {
              chartDict[this.blueComponentNameList[i]] = i;
              chartList.push(this.blueComponentNameList[i]);
            }
          }
        }
      }

      //根据view组件建立vegaObjectObj 若有新view则增加 若没有则删除/ 先执行删除 再增加/ 遍历两遍
      Object.keys(that.vegaObjectObj).forEach(function (d) {
        if (chartList.indexOf(d) == -1) {
          //如果在chartlist中没有该chart,则该chart已被删除,需从vegaObjectObj中去掉键值对
          delete that.vegaObjectObj[d];
        }
        
      });
      chartList.forEach(function (d) {
        if (!(d in that.vegaObjectObj)) {
          //不存在则新建vegaobject
          let _height = window.innerHeight * 0.3;
          // 改为07 =》0.4
          let _width = window.innerWidth * 0.42;
          //1300 300
          const preview_container = document.getElementById("preview_container")
          // console.log("#######preview_container#######", preview_container)
          // console.log(preview_container.style)
          // console.log(preview_container.innerWidth)
          //1350 350
          that.vegaObjectObj[d] = new VegaModel(
            parseInt(_height),
            parseInt(_width),
            d
          );
        }
      });

      //根据chart组件进行遍历 获取有相连关系的组件
      for (let i = 0; i < chartList.length; i++) {
        chartTreeLink[chartList[i]] = [];
        searchlink(chartDict[chartList[i]]);

        function searchlink(j) {
          for (let k = 0; k < that.blueComponentNameList.length; k++) {
            if (componentGraph[k][j] == 1) {
              let _source = that.blueComponentNameList[k]; //id
              let _target = that.blueComponentNameList[j]; //id
              //将相连的组件存起来 或者 直接遍历两个相连组件间的边
              let _st = _source + "_" + _target;
              chartTreeLink[chartList[i]].push(_st);
              searchlink(k);
            }
          }
          return;
        }
      }

      let chartTreeLinkKeys = Object.keys(chartTreeLink);
      chartTreeLinkKeys.forEach(function (d) {
        let linkList = chartTreeLink[d];

        linkList.forEach(function (value) {
          let componentlist = value.split("_");
          for (let i = 0; i < componentlist.length; i++) {
            let com = componentlist[i];
            if (that.getComponentById(com).type == "Data") {
              if (that.chartData[d] == undefined) {
                that.chartData[d] = [];
                that.chartData[d].push(com);
                let _loadedData = that.loadedDatasets[com];
                that.vegaObjectObj[d].setData(_loadedData);
              } else {
                if (that.chartData[d].indexOf(com) == -1) {
                  that.chartData[d].push(com);
                  let _loadedData = that.loadedDatasets[com];
                  that.vegaObjectObj[d].setData(_loadedData);
                }
              }
            }
          }
        });
      });

      let connectionsDict = {};

      for (let i = 0; i < that.blueLines.length; i++) {
        let lineInfo = that.blueLines[i].getConnectInfo();
        let _name = lineInfo.sourceId + "_" + lineInfo.targetId;
        if (!(_name in connectionsDict)) {
          connectionsDict[_name] = [];
          connectionsDict[_name].push(lineInfo);
        } else {
          connectionsDict[_name].push(lineInfo);
        }
      }
      //根据chart分组新建object 需要#list
      //this.vegaObject = new VegaModel(parseInt(this.height / 2.3), parseInt(this.width * 1.1), "Test")
      //vegaEmbed("#canvas", result, { theme: "default" });
      for (let i = 0; i < chartList.length; i++) {
        let _chart = chartList[i];
        let _componentLink = chartTreeLink[_chart];

        for (let j = 0; j < _componentLink.length; j++) {
          //component-component
          let _name = _componentLink[j];
          let _connections = connectionsDict[_name];
          console.log(_connections);
          for (let k = 0; k < _connections.length; k++) {
            //component port - component port
            let _vegaObject = that.vegaObjectObj[_chart];
            let _sourcelink = _connections[k].source;
            let _targetlink = _connections[k].target;
            console.log(_targetlink, _sourcelink, connectionsDict);

            that.setVegaConfig(_sourcelink, _targetlink, _chart);
          }
        }
      }
      //vegaobject内存在sum/reduce等操作的数据啦 现在要做的就是把它对应起来
      //更新layout/chart/vegamodel
      let chartLayoutKeys = Object.keys(that.chartLayout);
      chartLayoutKeys.forEach(function (d) {
        that.chartLayout[d].forEach(function (v) {
          let _targetid = v.split("_")[0];
          let _targettext = v.split("_")[1];
          that.chartLayoutObj[_targetid][_targettext] = JSON.parse(
            JSON.stringify(that.vegaObjectObj[d])
          );
        });
      });
    },
    notifications(message) {
      this.$vs.notify({
        title: message.title,
        text: message.text,
        color: message.color,
        position: "bottom-right",
      });
    },
    graphPreview() {
      //check which layout
      //only allowed to exist one layout in blueEditor
      let that = this;
      let key = Object.keys(that.chartLayoutObj);
      console.log(key)
      if (key.length == 0) {
        //alert notice that user should choose one layout
        that.notifications({
          title: "Notice",
          text: "Please select a layout",
          color: "danger",
        });
      console.log(that.layoutlist)
        console.log(that.chartLayoutObj)
      } else if (key.length == 1) {
        
        that.layoutlist.forEach(function (d) {
          if (d == that.layoutIdName[key[0]]["name"].split(" ")[1]) {
            that[d] = true;
            let _ref = that.layoutIdName[key[0]]["ref"];

            //owing to vue life circle, when the first click, the that.$refs[_ref] haven't loaded
            //when the second click, the that.$refs[_ref] have loaded
            if (that.$refs[_ref] != undefined) {
              that.$refs[_ref].getModularInfo({
                config: that.chartLayoutObj[key[0]],
                layoutname: key[0],
              });
              that.model_config_text = JSON.parse(
                JSON.stringify(that.chartLayoutObj)
              );
              that.popupActivo4 = !that.popupActivo4;
            }
          } else {
            that[d] = false;
          }
        });
      } else if (key.length == 2) {
        that.notifications({
          title: "Notice",
          text: "Please choose one layout. You have now chosen two layouts.",
          color: "danger",
        });
      }
    },
    remove(com) {
      //find line connected with removedComponent
      //Cancellation bluecomponent and blueline methods: = null / delete in array
      //delete related variable
      let that = this,
        comid = com.getId(),
        comtype = com.getType();

      //first removeGraph bluecomponent
      com.removeGraph();
      //second find connected blueline/ removed graph/ delete in array
      for (let i = 0; i < that.blueLines.length; i++) {
        let lineinfo = that.blueLines[i].getConnectInfo();
        let _source = lineinfo.sourceId,
          _target = lineinfo.targetId,
          linkname = _source + "_" + _target;

        if (comid == _source || comid == _target) {
          that.blueLines[i].remove();
          that.blueLines[i] = null;
          that.blueLines.splice(i, 1);
          i--;

          let index = that.blueLinesName.indexOf(linkname);
          that.blueLinesName.splice(index, 1);
        }
      }

      //third delete component in array
      for (let i = 0; i < this.blueComponents.length; i++) {
        if (comid == this.blueComponents[i].getId()) {
          this.blueComponents[i] = null;
          this.blueComponents.splice(i, 1);

          break;
        }
      }

      //remove ports
      for (let i = 0; i < that.exstingPorts.length; i++) {
        if (comid == that.exstingPorts[i].parentid) {
          this.exstingPorts.splice(i, 1);
        }
      }

      if (comtype == "Data") {
        delete that.selectedData[comid];
        delete that.dataComponent[comid];
      } else if (comtype == "Viewer" || comtype == "Chart") {
        let index = comid.split("-")[1];
        that.viewerbuttonbox[index]["content"] = "button" + index;
        that.viewerbuttonbox[index]["style"] = "none";
        that.viewerbuttonbox[index]["id"] = "";
        that.blueComponentsTypeCount[comtype] =
          that.blueComponentsTypeCount[comtype] + 1;
      }
      that.blueComponentsTypeCount[comtype] =
        that.blueComponentsTypeCount[comtype] - 1;
      // if exist viewer, "delete" remove button
      if (that.blueComponentNameList.length > 0) {
        that.blueComponentNameList.splice(
          that.blueComponentNameList.indexOf(comid),
          1
        );
      }
    },
    cleanChart() {
      try {
        document.getElementById("canvas").innerHTML = "";
      } catch (err) {
        console.log(err);
      }
    },
    cleanPanel() {
      let that = this;
      if (this.blueComponents.length == 0) {
        this.notifications({
          title: "Notice",
          text: "There are no components here.",
          color: "danger",
        });
        return;
      }
      //clean draw panel
      this.cleanChart();
      //make sure remove all of the bluecomponents
      this.blueComponents.forEach(function (d, i) {
        that.remove(d);
      });
      if (that.blueComponents[0] != null) {
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
      this.chartData = {};
      this.chartLayout = {};
      this.chartLayoutObj = {};
      for (let key in this.comChartCount) {
        this.comChartCount[key] = 0;
      }
      for (let key in this.blueComponentsTypeCount) {
        this.blueComponentsTypeCount[key] = 0;
      }
      this.notifications({
        title: "Notice",
        text: "clean panel success~",
        color: "rgb(31,116,225)",
      });
    },
    openFullScreen: function () {
      //el-icon-loading
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 1)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    downloadSetting: function () {
      let that = this;
      let req = async function () {
        let key = Object.keys(that.chartLayoutObj);
        if (key.length == 0) {
          that.notifications({
            title: "Notice",
            text: "Please connect a layout",
            color: "danger",
          });
        } else if (key.length == 1) {
          let template = key[0];
          let obj = {
            "Layout-0": "templateA",
            "Layout-1": "templateB",
          };

          let config = {
            data: that.model_config_text,
            template: obj[template],
          };
          //{"config": that.chartLayoutObj[key[0]], "layoutname": key[0]}
          const res = await dataManager.downloadSetting(config);
        }
      };
      req();
    },
  },
  watch: {
    //Monitor the positon's change of component
    blueComponents: {
      handler(curVal, oldVal) {
        // console.log(curVal)
        let that = this;
        if (curVal.length == oldVal.length) {
          for (let i = 0; i < this.blueComponents.length; i++) {
            if (this.blueComponents[i].isDelete) {
              that.remove(this.blueComponents[i]);
              break;
            }

            let curEle = curVal[i];
            let preEle = oldVal[i];
            //Obtain the newest postion of each component
            let curPos = curEle.getPos();
            let prePos = preEle.getPos();

            if (this.blueLines.length > 0) {
              this.blueLines.forEach(function (line, i) {
                //寻找与组件相关的blueLines
                let connectInfo = line.getConnectInfo();
                if (
                  connectInfo.sourceId == curEle.getId() ||
                  connectInfo.targetId == curEle.getId()
                ) {
                  line.parentPosUpdated(
                    curPos.dx, //delta of horizon postion
                    curPos.dy, //delta of vertical position
                    curEle.inPorts,
                    curEle.outPorts,
                    curEle.id
                  );
                }
                curEle.resetDeltaPos();
                preEle.resetDeltaPos();
              });
            }
          }
        }
      },
      deep: true,
    },

    //Monitor the bluelines' length, if length increased, the new connection will be parsed
    blueLines: {
      handler(curVal, oldVal) {
        let that = this;
        if (that.blueLinesDelSignal == true) {
          // deleted blueprint line has been removed
          // update bluegraph map using option 'afterdelete'
          // turn blueLinesDelSignal to false
          that.blueLinesDelSignal = false;
          that.catchConnect("afterdelete");
          that.lastBlueLines = [];
          curVal.forEach((d) => {
            that.lastBlueLines.push(d);
          });
        } else if (that.blueLinesDelSignal == false) {
          if (curVal.length > that.lastBlueLines.length && curVal.length != 0) {
            //add line
            that.catchConnect("add");
          }
          if (curVal.length < that.lastBlueLines.length) {
            //delete line
            if (curVal.length == 0) {
              // empty relative items
              this.catchConnect("empty");
            } else {
              this.catchConnect("delete");
            }
          }
          that.lastBlueLines = [];
          curVal.forEach((d) => {
            that.lastBlueLines.push(d);
          });
        }
      },
    },
  },
  mounted() {
    let that = this;
    this.chartInit("#preview");

    //Set the init setting of textarea
    d3.selectAll("textarea").style("color", "grey").style("font-size", "16px");

    //Add a listener for window's resize
    window.addEventListener("resize", () => {
      this.chartResize(window.innerWidth * 0.825, window.innerHeight * 0.6);
    });
    // dataHelper.getDataDetail('cars').then(res=>{
    //   console.log(res)
    // })
    //Get the data candidates from server
    dataHelper.getDataList().then((response) => {
      this.dataList = response.data;

      this.dataList.forEach(function (data) {
        data.dimensions.forEach(function (d) {
          d["checked"] = false;
          d["color"] = "#202020";
        });
      });
    });
    dataHelper.getAllData().then((response) => {});
    //Global control the animation of line or others
    setInterval(function () {
      that.blueLines.forEach(function (line) {
        line.animate();
      });

      that.blueComponents.forEach(function (com) {
        //com.animate();
      });
    }, 20);
    setInterval(function () {
      if (that.blueLines.length) {
        let templength = that.blueLines.length;
        for (let i = 0; i < templength; i++) {
          if (that.blueLines[i].getConnectInfo().isDeleted == "true") {
            that.blueLines.splice(i, 1);
            templength = templength - 1;
            console.log(true);
          }
        }
      }
    }, 1500);
  },
};
</script>
<style scoped>
.filter_solider rect.selection {
  stroke: none;
  fill: steelblue;
  fill-opacity: 0.6;
}
button {
  background: #819ffb;
  color: white;
  border: none;
  width: 35px;
  height: 25px;
  cursor: pointer;
  border-radius: 5px;
}
button:active {
  background: #eee;
  color: #819ffb;
  cursor: pointer;
}
.button-disabled {
  pointer-events: none;
  color: black;
  background: #ccc;
}
</style>
<style lang="stylus" scoped>
@import '../Styles/editor';
</style>
