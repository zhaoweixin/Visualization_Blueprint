<template lang="html">

  <div class="parentx-static">

    <vs-sidebar static-position default-index="1" color="primary" class="sidebarx" spacer v-model="active">

    <div class="header-sidebar" slot="header">
        <vs-upload action="http://localhost:3000/api/changeavatar" @on-success="" class="dark"/>
    </div>

    <vs-divider icon="format_list_numbered" position="left" >
        User
    </vs-divider>
    
    <vs-button type="flat" v-for = "item in listdata" class="vsbutt">{{item.name}}</vs-button>
    
    <vs-divider icon="palette" position="left">
        User
    </vs-divider>

    <vs-select
      class="selectExample"
      label="Join function"
      v-model="select1"
    >
    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options1" />

    </vs-select>
    <vs-select
      placeholder=" "
      max-selected="2"
      multiple
      autocomplete
      class="selectExample"
      label="DataList"
      v-model="select2"
    >
    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in options2" />
    </vs-select>

    <vs-divider icon="cached" position="left">
        User
    </vs-divider>
    <vs-button color="success" type="flat" icon="done" class="vsbutt">Generation</vs-button>
    
    </vs-sidebar>
  </div>

</template>

<script>
import DataManager from "../DataManager"
export default {
  data:()=>({
    active:false,
    select1:0,
    select2:[],
    options1:[
        {text:' ',value:0},
        {text:'Left Join',value:1},
        {text:'Right Join',value:2},
        {text:'Inner Join',value:3},
        {text:'Outer Join',value:4}
    ],
    options2:[{text: 'Square', value: 1},
        {text: 'Rectangle', value: 2},
        {text: 'Rombo', value: 3},
        {text: 'Romboid', value: 4},
        {text: 'Trapeze', value: 5}
    ],
    listdata:[]
  }),
    created: function() { 
        this.initData()
    },
    methods:{
        initData(){
            DataManager.getDataInfo().then(response => {
                let re = []
                response.data.forEach( (d, i) => {
                    let obj = {'name': d.name}
                    obj["checked"] = false
                    obj["ind"] = i + 1
                    re.push(obj)
                })
                this.listdata = re
                console.log(this.listdata)
                //this.$store.commit('getFilesListData', {data: re})
            })
        },
        test(t){
            console.log(t)
            return t
        }
    },
    watch:{
        select1:{
            handler: function(val, oldVal){
                console.log(val, oldVal)
            }
        }
    }
    

}
</script>

<style lang="stylus">
.parentx-static
  overflow hidden
  height 1080px
  position relative

.vs-sidebar--background
    background rgba(0,0,0,0) !important
    z-index 0

.vs-upload--button-upload
    display none !important

.vs-select--options
    z-index 100000 !important

.con-select
    padding-left 25% !important

.vs-select--label
    padding-left 10% !important 
    font-size 1rem !important 

.vsbutt
    width 100% !important

.header-sidebar
  display flex
  align-items center
  justify-content center
  flex-direction column
  width 100%
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
</style>