<template>
<vs-navbar class="nabarx" color='rgb(50, 60, 90)'>
      <vs-button class="nav_opener" type="flat" icon="menu"></vs-button>

      <vs-navbar-title style="color:white">
        OpenVIS 
      </vs-navbar-title>
      <vs-spacer></vs-spacer>

      <vs-navbar-item index="0" style="color:white">
        <a href="http://localhost:8080/home">Home</a>
      </vs-navbar-item> 
      <vs-navbar-item index="1" style="color:white">
        <a href="http://localhost:8080/blue">Editor</a>
      </vs-navbar-item>
</vs-navbar>
</template>
<script>
    export default{

        name:"NavBar",
        data: function(){
          return{}
        }
    }
</script>
<style>
</style>