<template>
  <div>
    <div class="guide-container">
        <div class="guide1">
            <div class="data actived">
              <i class="iconfont icon-shujuku"></i>
            </div>
            <div 
                class="arrow-map" 
                :class="[0 === this.currentStep ? 'active' : '', 0 < this.currentStep ? 'actived': '']"
                >
              <i class="iconfont icon-zititubiaoxiugai-"></i>
            </div>
            <div 
                 class="map"
                :class="[0 === this.currentStep ? 'active' : '' , 0 < this.currentStep ? 'actived': '']"
                @click="onClick(0)"
                >
              <i class="iconfont icon-tubiao_ditu"></i>
            </div>
            <div class="arrow-chart" :class="[1 === this.currentStep ? 'active' : '', 1 < this.currentStep ? 'actived': '']">
              <i class="iconfont icon-zititubiaoxiugai-"></i>
            </div>
            <div 
                class="chart" 
                :class="[1 === this.currentStep ? 'active' : '', 1 < this.currentStep ? 'actived': '']"
                @click="onClick(1)"
                >
              <i class="iconfont icon-barchart"></i>
            </div>
            <div 
                class="arrow-transform" 
                :class="[2 === this.currentStep ? 'active' : '', 2 < this.currentStep ? 'actived': '']"
                
                >
              <i class="iconfont icon-zititubiaoxiugai-"></i>
            </div>
            <div 
                class="transform" 
                :class="[2 === this.currentStep ? 'active' : '', 2 < this.currentStep ? 'actived': '']"
                @click="onClick(2)"
                >
              <i class="iconfont icon-transform"></i>
            </div>
        </div>
        <div class="container">
            <ul v-for="item in this.container" :key="item">
              <li>
                <i class="iconfont icon-duihao"></i>
                <span class="circle"></span>
                <span class="">请选择 -- {{item}}</span>
                <input type="checkbox" :value="item" @change="change($event,item)">
              </li>
            </ul>
            <h3 v-show="this.currentStep >=3">完成！！！</h3>
            <div class="buttonGroup">
              <button :class="[this.currentStep === 0 ? 'disabled' : '']" @click="buttonClick('back')">回退</button>
              <button v-if="this.currentStep < 3 " :class="[this.currentStep >= 3 ? 'disabled' : '']" @click="buttonClick('countine')">继续</button>
              <button v-if="this.currentStep >=3 " @click="buttonClick('over')">完成</button>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "guide",
  data() {
    return {
      guideData: {
        map: {
          point: 1,
          heatmap: 0,
          line: 1,
          area: 0
        },
        chart: {
          lineChart: 0,
          barChart: 0,
          scatterPlot: 1
        },
        transform: {
          filterX: 0,
          filterY: 0,
          sortX: 0,
          sortY: 0,
          aggregateX: 1,
          aggregateY: 1
        }
      },
      operateData: {
        map: {
          point: 0,
          heatmap: 0,
          line: 0,
          area: 0
        },
        chart: {
          lineChart: 0,
          barChart: 0,
          scatterPlot: 0
        },
        transform: {
          filterX: 0,
          filterY: 0,
          sortX: 0,
          sortY: 0,
          aggregateX: 0,
          aggregateY: 0
        }
      },
      step: ["map", "chart", "transform", 'finish'],
      currentStep: 0
    };
  },
  computed: {
    container() {
      const currentStep = this.step[this.currentStep];
      const currentData = this.guideData[currentStep];
      const newData = [];
      for (const key in currentData) {
        if (currentData[key] === 1) {
          newData.push(key);
        }
      }
      return newData;
    }
  },
  methods: {
    change(e, operate){
      // console.log(e.target.checked, operate, this.operateData['map'][operate]);
      if(operate in this.operateData['map']){
        this.operateData['map'][operate] = e.target.checked
      }else if(operate in this.operateData['chart']){
        this.operateData['chart'][operate] = e.target.checked
      }else if(operate in this.operateData['transform']){
        this.operateData['transform'][operate] = e.target.checked
      }
      // this.operateData['map'][item] && this.operateData['map'][item] = e.target.checked ;
      console.log(this.operateData)

    },
    onClick(index) {
      this.currentStep = index;
    },
    buttonClick(type) {
      console.log
      if (type === "countine") {
        this.currentStep += 1;
      } else if (type === "back") {
        this.currentStep -= 1;
      } else if (type === "over"){
         this.currentStep = 0
      }
    }
  }
};
</script>



<style scoped>
.guide-container {
  width: 300px;
}
.guide1 {
  display: flex;
  justify-content: space-around;
}
.container {
  position: relative;
  border: 1px solid gray;
  min-height: 100px;
  border-radius: 10px;
}
.active {
  color: hotpink;
}
.actived {
  color: skyblue;
}
.map:hover,
.chart:hover,
.transform:hover {
  cursor: pointer;
}
li {
  display: flex;
  list-style: none;
  padding: 5px 50px;
  align-items: center;
}
.circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: gray;
  border-radius: 50%;
}
span {
  margin: 5px 10px;
}
input {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  cursor: pointer;
}
button {
  background: #819ffb;
  color: white;
  border: none;
  width: 35px;
  height: 25px;
  cursor: pointer;
}
button:active {
  background: #eee;
  color: #819ffb;
  cursor: pointer;
}
.buttonGroup {
  position: absolute;
  bottom: 0;
  right: 5px;
}
.disabled {
  pointer-events: none;
  color: black;
  background: #ccc;
}
h3{
  text-align: center;
  margin: 25px auto;
}
</style>
