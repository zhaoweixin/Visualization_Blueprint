<template>
   <div id="bigContainner" :style="containnerStyles">
    <Input prefix="ios-search" clearable style="width:auto" id="searchInput" placeholder="Search..." v-model="searchx"/>
   <Table stripe :height="heightDefault" :columns="state.coldata" :data="datax"  id="table"></Table>
   <!-- <edit-bar :message="editMessage" v-show="toShow"></edit-bar> -->
   <div v-show="toShow" id="EditContainner" style="background-color: #cde6c7">
       <template  v-for="(item,index) in editMessage">
           <span class="spans" style="width:100px">{{index}}</span>
           <Input class="inputs" style="width:50%" clearable v-model="editMessage[index]" placeholder="editMessage[index]"></Input>
           <br />
           <br />
       </template>
       <Button type="default" @click="unchangeData()">取消</Button>
       <Button  type="success" @click="changeData()">保存</Button>
       <br>

   </div>
   </div>
</template>
<script>
import Vue from 'vue'
import editBar from './editBar'
import DataManager from '../DataManager'
import * as d3 from "d3"
import { stack } from 'd3';
import { constant } from 'vega';
export default {
    name:'DataPreviewTable',
    components:{
        editBar
    },
    data:function(){
        return {
            editMessage:{},
            searchx:null,
            toShow:false,
            datax:[],
            heightDefault:null,
            containnerStyles:{},
            defIdToEdit:null,
            state:{
                listdata:[
                    {
                        "id": 1,
                        "name": "Leanne Graham",
                        "username": "Bret",
                        "email": "Sincere@april.biz",
                        "website": "hildegard.org",
                    },
                    {
                        "id": 2,
                        "name": "Ervin Howell",
                        "username": "Antonette",
                        "email": "Shanna@melissa.tv",
                        "website": "anastasia.net",
                    },
                    {
                        "id": 3,
                        "name": "Clementine Bauch",
                        "username": "Samantha",
                        "email": "Nathan@yesenia.net",
                        "website": "ramiro.info",
                    },
                    {
                        "id": 54,
                        "name": "Clementine Bauch",
                        "username": "Samantha",
                        "email": "Nathan@yesenia.net",
                        "website": "ramiro.info",
                    },
                    {
                        "id": 3564,
                        "name": "Clementine Bauch",
                        "username": "Samantha",
                        "email": "Nathan@yesenia.net",
                        "website": "ramiro.info",
                    },
                   
                    {
                        "id": 4,
                        "name": "Patricia Lebsack",
                        "username": "Karianne",
                        "email": "Julianne.OConner@kory.org",
                        "website": "kale.biz",
                    },
                    {
                        "id": 5,
                        "name": "Chelsey Dietrich",
                        "username": "Kamren",
                        "email": "Lucio_Hettinger@annie.ca",
                        "website": "demarco.info",
                    },
                    {
                        "id": 6,
                        "name": "Mrs. Dennis Schulist",
                        "username": "Leopoldo_Corkery",
                        "email": "Karley_Dach@jasper.info",
                        "website": "ola.org",
                    },
                    {
                        "id": 7,
                        "name": "Kurtis Weissnat",
                        "username": "Elwyn.Skiles",
                        "email": "Telly.Hoeger@billy.biz",
                        "website": "elvis.io",
                    },
                    {
                        "id": 8,
                        "name": "Nicholas Runolfsdottir V",
                        "username": "Maxime_Nienow",
                        "email": "Sherwood@rosamond.me",
                        "website": "jacynthe.com",
                    },
                    {
                        "id": 9,
                        "name": "Glenna Reichert",
                        "username": "Delphine",
                        "email": "Chaim_McDermott@dana.io",
                        "website": "conrad.com",
                    },
                    {
                        "id": 10,
                        "name": "Clementina DuBuque",
                        "username": "Moriah.Stanton",
                        "email": "Rey.Padberg@karina.biz",
                        "website": "ambrose.net",
                    },
                    {
                        "id": 42352,
                        "name": "Ervin Howell",
                        "username": "Antonette",
                        "email": "Shanna@melissa.tv",
                        "website": "anastasia.net",
                    },
                    {
                        "id": 54362,
                        "name": "Ervin Howell",
                        "username": "Antonette",
                        "email": "Shanna@melissa.tv",
                        "website": "anastasia.net",
                    },
                    
                    {
                        "id": 23,
                        "name": "Ervin Howell",
                        "username": "Antonette",
                        "email": "Shanna@melissa.tv",
                        "website": "anastasia.net",
                    }
                ],
                coldata:[{
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEdits(params.row.id)
                                        }
                                    }
                                }, "Edit"),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }]
            },
            
        }
    },
    props: ['tableMsg'],
    watch: {
        tableMsg: function(val){
            this.generateTable()
        },
        searchx(){
            this.loadData()
        }
    },
    methods:{
        remove(index){
            for(let i=0;i<this.state.listdata.length;i++){
                if (index == this.state.listdata[i].id){
                    this.state.listdata.splice(i,1)
                }
            }
            if(this.searchx){
                for(let i=0;i<this.datax.length;i++){
                    if (index == this.datax[i].id){
                        this.datax.splice(i,1) 
                    }
                }
            }
        },
        loadData(){
            if(!this.searchx)  this.datax = this.state.listdata
            else this.datax = this.getItemsSearch()
        },
        getItemsSearch(){
            let dataBase = this.state.listdata
            let filterx = dataBase.filter((tr)=>{
                let values = this.getValues(tr).toString().toLowerCase()
                return values.indexOf(this.searchx.toLowerCase()) != -1
            })
            let items = []
            filterx.forEach((item, index) => {                
                items.push(item)              
            })
            return items
        },
        getValues(obj) {
            let valuesx = Object.values(obj)
            let strings = []
            function getStrings (obj) {
                if(Array.isArray(obj)) {
                strings = [...strings,...obj]
                obj.forEach((item) => {
                    getStrings(item)
                })
                } else if (typeof obj == 'object' && obj != null) {
                let subObj = Object.values(obj)
                strings = [...strings,...subObj]
                getStrings(subObj)
                }
            }
            getStrings(valuesx)
            strings = strings.filter(item => typeof item == 'string' || typeof item == 'number')
            return valuesx
        },
        getStrings(obj, valuesx) {
            let stringsx = Object.values(obj)
            valuesx.forEach((item) => {
                if (item && typeof item == 'object') {
                valuesx = [...valuesx,...Object.values(item)]
                }
            })
            return stringsx
        },
        unchangeData(){
            this.toShow = false
            this.defIdToEdit = null
            this.editMessage = {}
        },
        changeData(){
            for(let i=0;i<this.state.listdata.length;i++){
                if (this.defIdToEdit == this.state.listdata[i].id){
                    this.state.listdata.splice(i,1,this.editMessage)
                }
            }
            if(this.searchx){
                for(let i=0;i<this.datax.length;i++){
                if (this.defIdToEdit == this.datax[i].id){
                    this.datax.splice(i,1,this.editMessage)
                }
            }
            }
            this.toShow = false

        },
        handleEdits(index){
            for(let i=0;i<this.state.listdata.length;i++){
                if((index) == this.state.listdata[i].id)
                {
                    this.defIdToEdit = index;
                    this.editMessage = Object.assign({},this.state.listdata[i])//this.state.listdata[i];
                    this.toShow = true;
                }
            }
        }
    },
    created:function(){
        //console.log(typeof(this.state.listdata))
        //为iview构建一个用于填充表的对象数组
        //this.datax = this.state.listdata;
        this.loadData();
        let data = this.state.listdata;
        let templatedata = data[0];
        for(let index in templatedata){
            let obj = {};
            let flag = 0;
            let str = ''
            for(let i = 0;i < index.length;i++){
                if(i===0){
                    str = str + index[i].toUpperCase()
                }else{
                    str = str + index[i].toLowerCase()
                }
            }
            obj.title = str;
            obj.key = index;
            obj.sortable = 'true'
            this.state.coldata.splice(flag,0,obj)
            flag = flag + 1
        }
        if(this.datax.length>=20){
            this.heightDefault = 800
        }
    },
    mounted:function(){
        if(this.state.listdata.length>=20){
            d3.select("#table").attr("height","800")
            
        }
    }
}
</script>
<style>
#EditContainner{
    position: fixed;

    width: 40%;
    padding: 25px;
    top:50%;
    left:50%;
    z-index: 100;
    text-align: center;
    border-radius: 5px;
    /* border-style: solid; */
    transform: translate(-50%,-100%)
}
.spans{
    position: fixed;
    left: 10%;

}
.inputs{
    position: fixed;
    left: 30%;
}
#searchInput{
    position: relative;
    /* //left: 80%; */
    /* //left: -18px; */
    /* padding: 5px 10px */
}
</style>

