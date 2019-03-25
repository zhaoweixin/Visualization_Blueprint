<template>
    <div>
        <!-- <vs-row > -->
            <vs-col vs-w="2.5" vs-h="12">
                <data-list-bar/>
            
            </vs-col>
            <vs-col vs-w="9.5" vs-h="12">
                <data-previewer/>
            </vs-col>
        <!-- </vs-row> -->
      
        
    </div> 
</template>
<script>
import DataListBar from '../../common/DataListBar/DataListBar'
import DataPreviewer from '../../common/DataPreviewer/DataPreviewer'
export default{
    name: 'homepage',
    components: {
        DataListBar,
        DataPreviewer
    }
}
</script>

<style>
</style>