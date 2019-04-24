<template>
    
    <div>
        <NavBar></NavBar>
        <!-- <vs-row > -->
            
            <vs-col vs-w="1.5" vs-h="12">
                <SideBar></SideBar>
                <!--
                <data-list-bar/>
                <data-previewer/>-->
            </vs-col>
            <vs-col vs-w="10" vs-h="12" style="margin: 0.5%">
                <DataTable></DataTable>
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

export default{
    name: 'homepage',
    components: {
        DataListBar,
        DataPreviewer,
        DataListViewer,
        DataPreviewTable,
        NavBar,
        SideBar,
        DataTable
    }
}
</script>

<style>
</style>