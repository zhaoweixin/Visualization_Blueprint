<template>
    
        <!-- <vs-row vs-h="2"> -->
                <!--数据列表功能区-->
        <!-- </vs-row>
            <vs-row vs-h="10">
                <!--数据列表查看区-->
            <vs-row vs-w="12" vs-h="12">
                <vs-table search :data="state.listdata" style="width:100% height:100%" max-items="10"  stripe pagination>
                    <template slot="header">
                        <h2> Users </h2>
                    </template>
                    
                    <template slot="thead">
                        <template  v-for="(item, index) in state.nameKey">
                            <vs-th :sort-key="item" width="350"> {{item}} </vs-th>
                        </template>
                        <vs-th>操作</vs-th>
                    </template>
                            
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <template v-for="(item) in state.nameKey">
                                <vs-td :data="data[indextr][item]" width = "350">{{data[indextr][item]}}
                                    <template slot="edit">
                                        <vs-input v-model="data[indextr][item]" class="inputx" placeholder="item"/>
                                    </template>
                                </vs-td>
                            </template>
                            <vs-button color="warning" type="line"  :key="indextr" @click="delectit(tr.id)">delete</vs-button>
                            <!-- <vs-button color="primary" type="line"  :key="indextr" @click="fixit(tr.id)">fix</vs-button> -->
                        </vs-tr>
                    </template>
                     
                </vs-table>
                <!-- <template v-show="show" v-for="(tr,trindex) in data[0]">
                    <vs-alert :title="title(trindex)" color="rgb(231, 154, 23)" active="true">
                        {{wenzi(trindex)}}
                    </vs-alert>
                </template> -->
            </vs-row>
    
</template>

<script>
import Vue from 'vue'
import DataManager from '../DataManager'
import * as d3 from "d3"
export default{
    name:'DataListViewer',
    data: function(){
        return {
            state:{
                listdata:[
                    {
                        "id":1,
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
                        "email": "Nathan@yesenia.netfewfewewewewewewewewewewewewewewewewewewewewewew",
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
                    }
                ],
                sortKey:['email', 'username', 'id','操作'],
                nameKey:['email', 'username', 'id']
            },
            show:false,
            clickId:-1
        }
    },
    props: ['tableMsg'],
    watch: {
        tableMsg: function(val){
            this.generateTable()
        }
    },
    methods: {
        delectit(id){
            //let toDelect = d3.select('#'+id)
            console.log(id)
            let that = this
            //let intId = parseInt(id)
            for(let i=0;i<that.state.listdata.length;i++){
                if((id) == that.state.listdata[i].id){
                    
                    that.state.listdata.splice(i,1)
                }
            }
            console.log(that.state.listdata);
            //toDelect.remove();
        },
        // fixit(id){
        //     this.show = true;
        //     this.clickId = parseInt(id);
        // },
        generateTable: function(){
            let listdata = [
                {
                    "test1.id": "2",
                    "test1.name": "John",
                    "test2.id": "2",
                    "test2.name": "John",
                    "test2.position": "2"
                },
                {
                    "test1.id": "3",
                    "test1.name": "Matt",
                    "test2.id": "3",
                    "test2.name": "Matt",
                    "test2.position": "2"
                }
            ]
            let sortKey = ["test1.id", "test1.name", "test2.id", "test2.name", "test2.position"]

            this.$set(this.state, 'sortKey', sortKey)
            this.$set(this.state, 'listdata', listdata)
        }
    },
    computed:{
        // title:function(trindex){

        // },
        // wenzi:function(trindex){

        // }
        sortKeys:function(item,index){
            if(index===this.state.sortKey.length)
            return "null"
            else return item
            
            
        }
    },
    mounted () {}
}
</script>
<style>

</style>