<!--存放系统的预览窗口-->
<template>
  <div class="centerx">
    <vs-button @click="popupActivo4=true" color="rgb(142,170,255)" type="filled" style="width:25%; justify-content: right; float:right;margin-right:15%;margin-top: 400px;">Preview</vs-button>
    <vs-popup fullscreen title="Preview" :active.sync="popupActivo4">
      <ViewLayout></ViewLayout>
    </vs-popup>
  </div>
</template>
import xxx form ''
<script>
import ViewLayout from "../ViewLayouts/ViewLayout"
//import Tdata from "../../assets/table.json"
    export default {
      data(){
        return{
          popupActivo4:false,

        }
      },
      components:{
        ViewLayout
      }
    }

</script>

<style>

</style>
