<template lang="html">
  <div v-if="hasTable">
    <!--tabletitle-->
    <template>
        <h1 style="padding-left: 50%; padding-bottom:1%">
          {{tableName}}
        </h1>
    </template>
    <!--endtabletitle-->

     <!--table-->
    <el-table :data="tr.slice((currentPage-1) * pagesize, currentPage*pagesize)"  
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
      <div style="text-align: center;margin-top: 30px;">
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
    pagesize: 10
  }),
  watch:{
    tableName: function(val, oldVal){
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
        const response = await dataManager.getData(that.tableName)
        that.th = response.data.th
        that.tr = response.data.tr
        that.hasTable = true
      }
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