
<template>
<vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
      <div slot="title" style="">
        <vs-navbar-title style="color:white;">
        OpenVIS 
        </vs-navbar-title>
      </div>
      
      <vs-spacer></vs-spacer>

      <vs-navbar-item index="0" style="color:white; padding-right:5px">
        <a href="http://localhost:8080/home">Home</a>
      </vs-navbar-item> 
      <vs-navbar-item index="1" style="color:white; padding-right:5px">
        <a href="http://localhost:8080/blue">Editor</a>
      </vs-navbar-item>
</vs-navbar>
</template>
<script>
    export default{

        name:"NavBar",
        data: function(){
          return{
          }
        }
    }
</script>
<style>
li{
  margin: 0.1% !important
}
</style>
