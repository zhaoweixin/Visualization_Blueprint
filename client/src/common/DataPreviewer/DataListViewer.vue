<template>
    <div>
        <vs-row vs-h="2">
                <!--数据列表功能区-->
        </vs-row>
            <vs-row vs-h="10">
                <!--数据列表查看区-->
                <vs-table search :data="state.listdata"  max-items="10" pagination>
                    <template slot="header">
                        <h3> Users </h3>
                    </template>
                    
                    <template slot="thead" v-for="(item, index) in state.sortKey">
                        <vs-th sort-key="item"> {{item}} </vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <template v-for="(item, index) in state.sortKey">
                                <vs-td :data="data[indextr][item]">{{data[indextr][item]}} </vs-td>
                            </template>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-row>
    </div>
</template>

<script>
import Vue from 'vue'
import DataManager from '../DataManager'
export default{
    name:'DataListViewer',
    data: function(){
        return {
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
                sortKey:['email', 'username', 'id']
            },
        }
    },
    props: ['tableMsg'],
    watch: {
        tableMsg: function(val){
            this.generateTable()
        }
    },
    methods: {
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
    mounted () {}
}
</script>
<style>
</style>