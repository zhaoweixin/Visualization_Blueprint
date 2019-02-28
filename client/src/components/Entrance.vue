<template>
    <div>
        <body-left/>
        <body-middle/>
        <body-bottom/>
    </div> 
</template>
<script>
import BodyLeft from '../commons/Entrance/BodyLeft'
import BodyMiddle from '../commons/Entrance/BodyMiddle'
import BodyBottom from '../commons/Entrance/BodyBottom'
export default{
    name: 'entrance',
    components: {
        BodyLeft,
        BodyMiddle,
        BodyBottom
    }
}
</script>

<style>
</style>