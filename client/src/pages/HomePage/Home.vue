<template>
    <div>
        <vs-col vs-w="1.5" vs-h="12">
            <data-list-bar/>
        </vs-col>
        <vs-col vs-w="10.5" vs-h="12">
            <data-previewer/>
        </vs-col>
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