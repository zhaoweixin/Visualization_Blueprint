<template lang="html">
  <div v-if="hasTable" style="box-shadow: 1px 1px 20px rgba(0,0,0, 0.1); border: 1px solid #EBEEF5">
    <!--tabletitle-->
    <template>
        <h1 style="padding-left: 50%; padding-bottom:0.5%; padding-top:0.5%">
          {{tableName}}
        </h1>
    </template>
    <!--endtabletitle-->

     <!--table-->
    <el-table v-loading="loading" :data="tr.slice((currentPage-1) * pagesize, currentPage*pagesize)"  
      show-overflow-tooltip="true" 
      align="center" 
      border>
      <template v-for="(col, indexth) in th">
        <el-table-column
          :prop="col.name"
          :label="col.name"
          sortable
          align="center"
          >
        </el-table-column>
      </template>
    </el-table>
    <template>
      <div style="text-align: center;margin-top: 1%; margin-bottom: 1%;">
      <el-pagination 
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size= "pagesize"
        layout="total, prev, pager, next, jumper"
        :total="tr.length">
      </el-pagination>
      </div>
    </template>
     <!--endtable-->
  </div>
</template>

<script>
import dataManager from "../DataManager.js"
export default {
  data:()=>({
    trWidth: "25%",
    hasTable: false,
    th:[],
    tr:[],
    tableData:{},
    currentPage: 1,
    pagesize: 10,
    loading:true
  }),
  watch:{
    tableName: function(val, oldVal){
      this.loading = true
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
  },
  methods: {
    initTable(){
      const that = this
      const req = async function(){
        if(that.tableName in that.tableData){
          that.th = JSON.parse(JSON.stringify(that.tableData[that.tableName]["th"]))
          that.tr = JSON.parse(JSON.stringify(that.tableData[that.tableName]["tr"]))
          console.log(that.th, that.tr)
          console.log('get')
        } else {
          const response = await dataManager.getData(that.tableName)
          that.th = response.data.th
          that.tr = response.data.tr
          that.tableData[that.tableName] = {}
          that.tableData[that.tableName]["th"] = response.data.th
          that.tableData[that.tableName]["tr"] = response.data.tr
        }
        that.hasTable = true
        that.loading = false
      }
      console.log("upload to ", this.tableName)
      req()
    },
    handleSizeChange: function (size) {
        this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
    }
  }
}
</script>
<style>
</style>