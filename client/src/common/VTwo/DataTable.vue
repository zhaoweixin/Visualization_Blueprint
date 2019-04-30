<template lang="html">
  <div v-if="hasTable">
    <el-table :data="tr" style="width: 100%">
      <el-table-column prop="item.name" label="item.name" sortable v-for="(item, indexth) in th"></el-table-column>
    </el-table>
    <!--<vs-table v-model="selected" pagination max-items="10" search :data="tr">
    <vs-table max-items="10" pagination search :data="tr">
      <template slot="header">
        <h3>
          {{tableName}}
        </h3>
      </template>
      <template slot="thead">
        <vs-th :key="indexth" sort-key="item.sortkey" v-for="(item, indexth) in th">{{item.name}}</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr_item, indextr) in data">
            <vs-td :key="Math.random()*100 + indexth" :data="tr_item[item['sortkey']]" v-for="(item, indexth) in th">{{tr_item[item['sortkey']]}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
    -->
  </div>
</template>

<script>
import dataManager from "../DataManager.js"
export default {
  data:()=>({
    trWidth: "25%",
    tableData:{},
    hasTable: false,
    th:[],
    tr:[]
  }),
  watch:{
    tableName: function(val, oldVal){
      console.log("update datatable to", val)
      this.initTable()
    }
  },
  computed:{
    tableName(){
      return this.$store.state.currentTable
    }
  },
  created(){
    this.initTable()
  },
  mounted() {
    let that = this
    //that.initTdStyle()
  },
  methods: {
    initTdStyle(){
      const that = this
      this.trWidth = getPercent(1, that.th.length)
      const td = document.getElementsByClassName("td vs-table--td")
      for(let i=0; i < td.length; i++){
        td[i].setAttribute("width", this.trWidth)
      }
      const tr = document.getElementsByClassName("col-0 col")
      for(let i=0; i < tr.length; i++){
        tr[i].setAttribute("width", this.trWidth)
      }
      function getPercent(num ,total){
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
          return "-";
        }
        return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
      }
    },
    initTable(){
      const that = this
      const req = async function(){
        const response = await dataManager.getData(that.tableName)
        that.th = response.data.th
        console.log(that.th)
        that.tr = response.data.tr
        console.log(that.tr)
        that.hasTable = true
        setTimeout(function(){
          that.initTdStyle()
        }, 300)
      }
      req()
    }
  }
}
</script>
<style>
</style>