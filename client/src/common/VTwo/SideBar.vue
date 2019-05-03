<template lang="html">

  <div class="parentx-static">

    <vs-sidebar static-position default-index="1" color="primary" class="sidebarx" spacer v-model="active">

    <div class="header-sidebar" slot="header">
        <vs-upload action="http://localhost:3000/api/changeavatar" @on-success="uploaded" class="dark"/>
    </div>

    <vs-divider icon="format_list_numbered" position="left" >
        User
    </vs-divider>
    
    <vs-button v-bind:key="index" type="flat" v-for= "(item, index) in listdata" class="vsbutt" v-on:click="updateDataTable(item.name)">{{item.name}}</vs-button>
    
    <vs-divider icon="palette" position="left">
        User
    </vs-divider>


    <el-select v-model="joinSelect" clearable placeholder="Join function">
    <el-option
      v-for="(item, index) in joinOpt"
      :key="item.index"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>

    </vs-select>

    <el-select v-model="attrSelect" placeholder="selection" multiple collapse-tags>
    <el-option-group
      v-for="group in attrdata"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-option-group>
    </el-select>

    <vs-divider icon="cached" position="left">
        User
    </vs-divider>
    <vs-button color="success" type="flat" icon="done" class="vsbutt" v-on:click="joinFunc()">Generation</vs-button>
    
    </vs-sidebar>
  </div>

</template>

<script>
import DataManager from "../DataManager"
export default {
  data:()=>({
    active:false,
    joinSelect:'',
    attrSelect:[],
    joinOpt:[
        {label:'Left Join',value:"Left"},
        {label:'Right Join',value:"Right"},
        {label:'Inner Join',value:"Inner"},
        {label:'Outer Join',value:"Outer"}
    ],
    listdata:[],
    attrdata:[]
  }),
    created: function() {
        this.initData()
    },
    methods:{
        initData(){
            const that = this;
            (async function(){
                const response = await DataManager.getDataInfo()
                const re = []
                const re1 = []
                response.data.forEach((d, i) => {
                    //construct listdata
                    const obj = {'name': d.name}
                    re.push(obj)
                    //construct attrdata
                    const obj1 = {"label": d.name, "options":[]}
                    const dimension = d.dimensions
                    dimension.forEach((v) => {
                        const val = d.name + "-" + v.name
                        obj1.options.push({"value": val, "label": v.name})
                    })
                    re1.push(obj1)
                })

                that.listdata = [...that.listdata, ...re]
                that.attrdata = [...that.attrdata, ...re1]
            })()
        },
        updateDataTable(tableName){
            console.log(tableName)
            this.$store.commit("updateTable", tableName)
        },
        uploaded(res){
            const content = JSON.parse(res.currentTarget.response)
            const obj = [{
                "name": content["name"]
            }]
            this.listdata = [...this.listdata, ...obj]
        },
        joinFunc(){
            const that = this
            //fault tolerant
            if(!this.joinSelect){
                this.notifications({"title":"Notice", "text": "Please choose a data update method", "color": 'danger'})
                return;
            }
            if(this.attrSelect.length < 2){
                //notification
                this.notifications({"title":"Notice", "text": "Please select two attributes for data operation", "color": 'danger'})
                return;
            }
            const dataName_1 = this.attrSelect[0].split("-")[0]
            const dataName_2 = this.attrSelect[1].split("-")[0]
            const dataAttr_1 = this.attrSelect[0].split("-")[1]
            const dataAttr_2 = this.attrSelect[1].split("-")[1]
            
            if(dataName_1 == dataName_2){
                //same datatable
                this.notifications({"title":"Notice", "text": "Please select two different data tables", "color": 'danger'})
                return;
            }
            const send = {
                "dataName_1": dataName_1,
                "dataName_2": dataName_2,
                "column_1": dataAttr_1,
                "column_2": dataAttr_2,
                "joinWay": this.joinSelect
            }
            const req = async function(send){
                const response = await DataManager.joinFunc(send)
                const obj = [{
                    "name": response.data
                }]
                that.listdata = [...that.listdata, ...obj]
            }
            req(send)
        },
        notifications(message){
            this.$vs.notify({
            title:message.title,
            text:message.text,
            color:message.color,
            position:'bottom-right'
        })
    }
    },
    watch:{
    }
    

}
</script>

<style lang="stylus">
.parentx-static
  overflow hidden
  height 1080px
  position relative

.el-select-dropdown
    z-index 99999 !important

.vs-sidebar--background
    background rgba(0,0,0,0) !important
    z-index 0

.vs-upload--button-upload
    display none !important

.vs-select--options
    z-index 100000 !important

.vsbutt
    width 100% !important

.header-sidebar
  display flex
  align-items center
  justify-content center
  flex-direction column
  h4
    display flex
    align-items center
    justify-content center
    width 100%
    > button
      margin-left 10px
.footer-sidebar
  display flex
  align-items center
  justify-content space-between
  width 100%
  > button
      border 0px solid rgba(0,0,0,0) !important
      border-left 1px solid rgba(0,0,0,.07) !important
      border-radius 0px !important

.el-select {
    padding-left: 20% !important 
    width: 85% !important
}
.vs-sidebar--background{
    width: 0 !important 
    height: 0 !important
    
}
.vs-sidebar{
    z-index: 1 !important
}
</style>