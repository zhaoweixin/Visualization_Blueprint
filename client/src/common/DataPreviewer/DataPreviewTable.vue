<template>
   <div id="bigContainner" :style="containnerStyles">
   <Table stripe :columns="state.coldata" :data="state.listdata"  id="table"></Table>
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
            toShow:false,
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
                        "id": 43252,
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
                                            console.log(params)
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
                                            this.remove(params.index)
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
        }
    },
    methods:{
        remove(index){
            this.state.listdata.splice(index,1)
            console.log(this.state.listdata)
        },
        handleEdit (row) {
            this.$set(row, '$isEdit', true)             
        }, 
        handleSave (row) {
            this.$set(row, '$isEdit', false)
        },
        // changeOfContainner(){
           
        // },
        unchangeData(){
            this.toShow = false
            this.defIdToEdit = null
            this.editMessage = {}
        },
        changeData(){
            for(let i=0;i<this.state.listdata.length;i++){
                if (this.defIdToEdit == this.state.listdata[i].id){
                    //this.state.listdata[i] = this.editMessage
                    this.state.listdata.splice(i,1,this.editMessage)
                    console.log("success")
                    console.log(this.state.listdata)
                }
            }
            this.toShow = false

        },
        handleEdits(index){
            //console.log(index)
            for(let i=0;i<this.state.listdata.length;i++){
                if((index) == this.state.listdata[i].id)
                {
                    this.defIdToEdit = index;
                    this.editMessage = Object.assign({},this.state.listdata[i])//this.state.listdata[i];
                    this.toShow = true;
                    
                    //console.log(this.editMessage)
                }
            }
             //d3.select("#bigContainner").attr("background-color","red")
             this.containnerStyles.backgroundColor = 'red';
        }
    },
    created:function(){
        //console.log(typeof(this.state.listdata))
        //为iview构建一个用于填充表的对象数组
        let data = this.state.listdata;
        let templatedata = data[0];
        // for(let index in data){
        //     console.log(data[index]);
        // }
        //console.log(templatedata)
        for(let index in templatedata){
            //console.log(index);
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
            // obj.editable = true
            // obj.render = function(h,params){
            //     for(let key in params.row){
            //     if(params.row.$isEdit){
                    
            //         return h('input',{
            //             domProps:{
            //                 value:params.row.key
            //             },
            //             on :{
            //                 input:function(event){
            //                     params.row.key = event.target.value
            //                 }
            //             }
            //         });
            //     }else{
            //         return h('div',params.row.key);
            //     }
            //     }
            // //     console.log(params);
            // //     console.log(h)
            //  }
            this.state.coldata.splice(flag,0,obj)
            flag = flag + 1
        }
        //let that = this
        // let actionObj = {}
        // actionObj.title = "Action"
        // actionObj.key = 'action'
        // actionObj.fixed = 'right'
        // actionObj.render = function(h,params,that){
        //     return h('div',[
        //         h('Button',{
        //             props:{
        //                 type:'text',
        //                 size:'small'
        //             },
        //             on: {
                        
        //                 click:()=>{
        //                 //console.log(params)
        //                 this.remove(params.index)
        //                 // window.clickId = params.row.id
        //                 }
        //             }
        //         },'Delete'),
        //         h('Button', {
        //             props: {
        //                 type: 'text',
        //                 size: 'small'
        //              }
        //         }, 'Edit')
            // ])
        
        
        //this.state.coldata.push(actionObj)
        console.log(this.state.coldata)
    },
    mounted:function(){
        if(this.state.listdata.length>=20){
            d3.select("#table").attr("height","800")
            console.log(">")
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
</style>

