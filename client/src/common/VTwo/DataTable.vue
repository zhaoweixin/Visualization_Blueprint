<template lang="html">
  <div>
    <vs-table v-model="selected" pagination max-items="3" search :data="tr">
      <template slot="header">
        <h3>
          Users
        </h3>
      </template>

      <template slot="thead">
          <vs-th :key="indexth" sort-key="item.sortkey" v-for="(item, indexth) in th">{{item.name}}</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr_item, indextr) in tr">
            <vs-td :data="tr_item[item['sortkey']]" v-for="(item) in th">{{tr_item[item['sortkey']]}}</vs-td>
        </vs-tr>
      </template>

    </vs-table>

  </div>
</template>

<script>
import dataHelper from "../DataManager.js"
export default {
  data:()=>({
    trWidth: "25%",
    tableName: "barley"
  }),
  watch:{
  },
  computed:{
    th: function() {
      return this.waitTable("th")
    },
    tr () {
      return this.waitTable("tr")
    }
  },
  created(){
    //this.initData()
    /*
    dataHelper.getData("barley").then(response => {
      this.th = response.data["th"]
      this.tr = response.data["tr"]
    });
    */
  },
  mounted() {
    let that = this
    that.initTdStyle()
  },
  methods: {
    initData(){
      let that = this
    },
    initTdStyle(){
      if(this.th.length == 0 || this.th.length == undefined) return;
      this.trWidth = getPercent(1, this.th.length)

      let td = document.getElementsByClassName("td vs-table--td")
      for(let i=0; i < td.length; i++){
        td[i].setAttribute("width", this.trWidth)
      }
      
      let tr = document.getElementsByClassName("col-0 col")
      for(let i=0; i < tr.length; i++){
        tr[i].setAttribute("width", this.trWidth)
      }

      function getPercent(num ,total){
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
          return "-";
        }
        return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
      }
    },
    sleep(delay){
      var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
          console.log(111)
          continue;
        }
    },
    waitTable(type){
        this.sleep(700)
        const tn = this.tableName
        console.log(this.$store.state.filesData, tn, type)
        return this.$store.state.filesData[tn][type]
      }
  }
}
</script>
<style>
</style>