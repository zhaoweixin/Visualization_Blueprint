<template>
    
    <div >
        <NavBar></NavBar>
        <!-- <vs-row > -->
            <vs-col vs-w="1.5" vs-h="12" style="box-shadow: 1px 1px 20px rgba(0,0,0, 0.1)">
                <SideBar></SideBar>
                <!--
                <data-list-bar/>
                <data-previewer/>-->
            </vs-col>
            
            <vs-col vs-w="10" vs-h="12" style="margin-left:1.5%;">
                <DataTable></DataTable>
                <DataPreview></DataPreview>
                <!--
                <data-preview-table/>
                <data-list-viewer /> 
                -->

            </vs-col>
        <!-- </vs-row> -->
    </div> 
</template>
<script>

import DataListBar from '../../common/DataListBar/DataListBar'
import DataPreviewer from '../../common/DataPreviewer/DataPreviewer'
import DataListViewer from '../../common/DataPreviewer/DataListViewer'
import DataPreviewTable from '../../common/DataPreviewer/DataPreviewTable'
import NavBar from "../../common/NavBar/NavBar"
import SideBar from "../../common/Vtwo/SideBar"
import DataTable from "../../common/Vtwo/DataTable"
import DataPreview from "../../common/Vtwo/DataPreview"

export default{
    name: 'homepage',
    components: {
        DataListBar,
        DataPreviewer,
        DataListViewer,
        DataPreviewTable,
        NavBar,
        SideBar,
        DataTable,
        DataPreview
    },
    created(){
        //this.openFullScreen()
    },
    methods:{
        openFullScreen: function(){
            //el-icon-loading
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 1)'
            });
            setTimeout(() => {
                loading.close();
            }, 2000);
        }
    }

}
</script>

<style>
</style>