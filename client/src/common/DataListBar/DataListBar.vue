<template>
    <div>
        <vs-row vs-justify="space-around" vs-h="2">
            <vs-col vs-type="flex" vs-justify="left" vs-align="top">
                <vs-upload action="http://localhost:3000/api/changeavatar" @on-success="successUpload" class="dark"/>
            </vs-col>
        </vs-row>
        <vs-row vs-justify="space-around" vs-h="10">
            <vs-list style="font-size: 8px">
                <vs-list-header title="Files"></vs-list-header>
                <div :key= "index" v-for= "(item, index) in listdata">
                    <vs-list-item :title="item.title">
                        <vs-checkbox :id="item.title" :vs-value="item.title" v-model="checkedNames" color="warning" icon="attach_file"/>
                    </vs-list-item>
                </div>
                <p>{{ checkedNames }}</p>
            </vs-list>
        </vs-row>
    </div>
</template>
<script>
import DataManager from '../DataManager'
export default{
    name: 'OperatePart',
    data: function() {
        return {
            listdata:[],
            checkedNames: []
        }
    },
    created: function() { 
        this.initData()
    },
    watch: {
        checkedNames: {
            handler: function(val, oldVal){
                this.datalistProcess(val, oldVal)
            },
            deep: true
        },
    },
    computed: {
    },
    methods:{
        successUpload(event){
            let img = event.target.files[0];
            let size = img.size;
            let Form = new FormData();
            Form.append('avatar', img, this.avatar_name);
            API.successUpload(Form)
            .then((response) => {
                console.log('this is response' + response)
            })
            .catch((error) => {
                console.log('this is the:' + error)
            })
            this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
        },
        greet(){
            
        },
        initData(){
            DataManager.getDataInfo().then(response => {
                let re = []
                response.data.forEach( (d, i) => {
                    let obj = {'title': d.name}
                    obj['checked'] = false
                    re.push(obj)
                })
                this.listdata = re
                console.log(this.listdata)
                this.$store.commit('getFilesListData', {data: re})
            })
        },
        datalistProcess(val, oldVal){
            if(val.length > 2){
                //max checkboxes are 2
                this.checkedNames.pop()
            } else {
                if(val.length > oldVal.length){
                    //add checkbox
                    let arr = [...val],
                        newCheckbox = arr.pop()
                    this.$store.commit('addListdata', newCheckbox)
                } else {
                    //delete checkbox
                    let arr = [...oldVal],
                        diff = arr.filter(x => !val.includes(x))
                    this.$store.commit('removeListdata', diff[0])
                }
            }
        }
    }
}
</script>
<style>
</style>