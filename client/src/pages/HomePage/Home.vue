<template>
    <div>
        <!-- <vs-row > -->
            <vs-col vs-w="2.5" vs-h="12">
                <data-list-bar/>
                <data-previewer/>
            </vs-col>
            <vs-col vs-w="9.5" vs-h="12">
                <data-preview-table/>
            </vs-col>
        <!-- </vs-row> -->
      
        
    </div> 
</template>
<script>
import DataListBar from '../../common/DataListBar/DataListBar'
import DataPreviewer from '../../common/DataPreviewer/DataPreviewer'
import DataListViewer from '../../common/DataPreviewer/DataListViewer'
import DataPreviewTable from '../../common/DataPreviewer/DataPreviewTable'
export default{
    name: 'homepage',
    components: {
        DataListBar,
        DataPreviewer,
        DataListViewer,
        DataPreviewTable
    }
}
</script>

<style>
</style>