<template>
    <div class="guide">
      <div class="header">
        <div class="left">
          <div class="data-logo">
            <i class="iconfont icon-shujuku actived" @click="onClick(0)"></i>
          </div>
          <i 
            class="iconfont icon-xuxianxiejiantou arrow-up"
            :class="[0 === this.currentStep ? 'active' : '', 0 < this.currentStep ? 'actived': '']"
          ></i>
          <i 
            class="iconfont icon-xuxianxiejiantou arrow-down"
            :class="[2 === this.currentStep ? 'active' : '', 2 < this.currentStep ? 'actived': '']"
          ></i>
        </div>
        <div class="right">
          <div class="right-up">
            <i 
              class="iconfont icon-tubiao_ditu map"
              :class="[0 === this.currentStep ? 'active' : '', 0 < this.currentStep ? 'actived': '']"
              @click="onClick(0)"
            ></i>
            <i 
              class="iconfont icon-zititubiaoxiugai-"
              :class="[1 === this.currentStep ? 'active' : '', 1 < this.currentStep ? 'actived': '']"
            ></i>
            <i 
              class="iconfont icon-zititubiaoxiugai-"
              :class="[1 === this.currentStep ? 'active' : '', 1 < this.currentStep ? 'actived': '']"
            ></i>
           
             <i 
              class="iconfont icon-transform transform"
              :class="[1 === this.currentStep ? 'active' : '', 1 < this.currentStep ? 'actived': '']"
              @click="onClick(1)"
            ></i>
          </div>
          <div class="right-down">
            <i 
              class="iconfont icon-barchart chart"
              :class="[2 === this.currentStep ? 'active' : '', 2 < this.currentStep ? 'actived': '']"
              @click="onClick(2)"
            ></i>
            <i 
              class="iconfont icon-zititubiaoxiugai-"
              :class="[3 === this.currentStep ? 'active' : '', 3 < this.currentStep ? 'actived': '']"
              
            ></i>
            <i 
              class="iconfont icon-zititubiaoxiugai-"
              :class="[3 === this.currentStep ? 'active' : '', 3 < this.currentStep ? 'actived': '']"
            ></i>
            
            <i 
              class="iconfont icon-transform transform"
              :class="[3 === this.currentStep ? 'active' : '', 3 < this.currentStep ? 'actived': '']"
              @click="onClick(3)"
            ></i>
          </div>
        </div>
      </div>
      <div class="content">
        <h4 style="text-align:center;padding:5px 0;" v-show="this.currentStep===0">向导 -- 地图推荐</h4>
        <h4 style="text-align:center;padding:5px 0;" v-show="this.currentStep===1">向导 -- 逻辑（map）推荐</h4>
        <h4 style="text-align:center;padding:5px 0;" v-show="this.currentStep===2">向导 -- 图表推荐</h4>
        <h4 style="text-align:center;padding:5px 0;" v-show="this.currentStep===3">向导 -- 逻辑（chart）推荐</h4>
        <ul class="content-text">
          <li v-for="item in this.container" :key="item">
              <div v-if="typeof item === 'object'">
                <div v-for="(subitem, subkey) in item">
                <i class="iconfont icon-duihao" style="font-size:10px; color:#819ffb"></i>
                <span>{{subkey}} 的推荐逻辑操作:</span>  
                <span v-for=" i in subitem">{{i}} </span>
                </div>
              </div>
              <div v-else>
                <i class="iconfont icon-duihao" style="font-size:10px; color:#819ffb" :class="[]"></i>
                <span>推荐图表 {{item}}</span> 
              </div>
          </li>
        </ul>
        <h3 v-if="this.currentStep===4" style="text-align:center;">完成！！！</h3>
        <div class="button-group">
            <button :class="[this.currentStep === 0 ? 'disabled' : '']" @click="buttonClick('back')">回退</button>
            <button v-if="this.currentStep < 4 " :class="[this.currentStep >= 4 ? 'disabled' : '']" @click="buttonClick('continue')">继续</button>
            <button v-if="this.currentStep >=4 " @click="buttonClick('over')">restart</button>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "guide2",
  data() {
    return {
      step: ["transform1", "map", "transform2", "chart"],
      currentStep: 0,
      guideData: {
        map: {
          heatmap: ["xxx"],
          line: ["111","xxx"],
          ponit: ["sort", "yyy"]
        },
        chart: {
          line: ["sort", "filter"],
          scatterplot: ["sx", "xs"]
        }
      }
    };
  },
  computed: {
    container() {
      if(this.currentStep === 1 ){
        const newData = []
        const currentData = this.guideData.map;
        for(const key in currentData){
          if(currentData[key].length){
            newData.push({[key]: [...currentData[key]]})
          }
        }
        return newData
      }else if(this.currentStep === 0){
        const newData = []
        const currentData = this.guideData.map;
        for(const key in currentData){
          newData.push(key)
        }
        return newData
      }else if(this.currentStep === 3){
        const newData = []
        const currentData = this.guideData.chart;
        for(const key in currentData){
          if(currentData[key].length){
            newData.push({[key]: [...currentData[key]]})
          }
        }
        return newData

      }else if(this.currentStep === 2){
        const newData = []
        const currentData = this.guideData.chart;
        for(const key in currentData){
          newData.push(key)
        }
        return newData
      }
      
    }
  },
  methods: {
    onClick(index) {
      this.currentStep = index;
    },
    buttonClick(type) {
      console.log;
      if (type === "continue") {
        this.currentStep += 1;
      } else if (type === "back") {
        this.currentStep -= 1;
      } else if (type === "over") {
        // alert("over");
        this.currentStep = 0;
      }
    }
  }
};
</script>



<style scoped>
.iconfont {
  font-size: 26px;
}
.guide {
  width: 99%;
  height: 100%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
}

.header {
  height: 80px;
  display: flex;
  border-bottom: 2px dashed #ccc;
}
.left {
  flex: 1;
  position: relative;
}

.data-logo {
  position: absolute;
  left: 40%;
  top: 30%;
}
.arrow-up {
  position: absolute;
  left: 70%;
  top: 10%;
  transform: rotate(10deg);
}
.arrow-down {
  font-size: 26px;
  position: absolute;
  left: 70%;
  top: 40%;
  transform: rotate(68deg);
}
.right {
  flex: 2;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
}
.right-up {
  flex: 1;
}
.right-down {
  flex: 1;
}

.content {
  height: 120px;
  position: relative;
}
.button-group {
  position: absolute;
  bottom: 5px;
  right: 5px;
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
.icon-shujuku:hover,
.map:hover,
.chart:hover,
.transform:hover {
  cursor: pointer;
}
.active {
  color: hotpink;
}
.actived {
  color: #819ffb;
}
.disabled {
  pointer-events: none;
  color: black;
  background: #ccc;
}

li{
  list-style: none;
  padding-left: 30px;
  padding-top: 5px;
}

</style>
