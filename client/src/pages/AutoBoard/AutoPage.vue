<template lang="html">
    <div class="autoboard">
        <div class="flex-container column">
            <div class="item one" @click="clickChart('1')" style="transform: translate(-22.4%, -33.5%) scale(0.33)">
                <div class="one"></div>
                <!--视图1-->
            </div>
            <div class="item two" @click="clickChart('2')" style="transform: translate(-22.4%, 0.5%) scale(0.33)">
                <div class="two"></div>
                <!--视图2-->
            </div>
            <div class="item three" @click="clickChart('3')" style="transform: translate(-22.4%, 34.5%) scale(0.33)">
                <div class="three"></div>
                <!--视图3-->
            </div>
            <div class="item four active" @click="clickChart('4')" style="transform: translate(43.7%, 0) scale(1)">
                <div class="four"></div>
                <!--视图4-->
            </div>
        </div>
    </div>
</template>
<script>
// import 视图的json文件
export default {
    data() {
        return {
            items: []
        }
    },
    mounted() {
        this._init()
    },
    methods: {
        _reszie() {
            this.$root.charts.forEach((mychart) => {
                mychart.reszie()
            });
        },
        _init() {
            this.items = document.querySelectorAll('.flex-container .item')
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].dataset.order = i + 1;
            }
        },
        clickChart(chartIndex) {
            let activeItem = document.querySelector('.flex-container .active')
            let activeIndex = activeItem.dataset.order
            let clickItem = this.items[chartIndex - 1]
            if (activeIndex === chartIndex) {
                return
            }
            activeItem.classList.remove('active')
            clickItem.classList.add('active')
            this._setStyle(clickItem, activeItem)
        },
        _setStyle(el1, el2) {
            let transform1 = el1.style.transform
            let transform2 = el2.style.transform
            el1.style.transform = transform2
            el2.style.transform = transform1

        }
    },
    components: {

    }
}
</script>
<style lang="stylus" scoped>
*
  box-sizing: border-box;
.one,.two,.three,.four
  height 100%!important
  width 100%!important
  background rgba(36, 46, 71, 0.5)
.item
    padding: 0px;
    margin: 0px;
    width: 68%;
    height: 100%;
    position absolute
    transform scale(0.33)
    text-align: center;
    transition:all 0.8s;
    background rgba(36, 46, 71, 0.5)
.autoboard
    position relative
    width 100%
    height 100%
    margin:0px;
    padding:0px;
    padding-top 5%
    background-color #171C30
    background-size 100% 100%
.flex-container.column
    position relative
    height: 90%;
    width: 90%;
    overflow: hidden;
    margin:  0 auto 100px auto;
    box-sizing: content-box;
.active
    height 100%
    width: 69%;
    margin-left: 10px;
    line-height: 300px;
</style>
