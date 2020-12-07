
<!--评分-->
<template>
  <div class="rate" :class="{'disabled':disabled}">
    <span class="text" v-html="textHtml"></span>
    <i
      v-for="i in 5"
      class="iconfont"
      @click="disabled ? '' : setScore(i)"
      :class="[{'disabled':disabled}, getClass(i)]">
    </i>
  </div>
</template>

<script>
export default {
  name: 'MyRate',
  props: {
    score: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textHtml: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
    }
  },
  methods: {
    getClass(i) {
      return i <= this.score ? 'icon-star' : 'icon-emptyStar'
    },
    setScore(i) {
      this.$emit('update:score', i);//使用`.sync`修饰符，对score 进行“双向绑定
    }
  }
}
</script>

<style scoped>
.iconfont {
  display: inline-block;
  margin-left: 5px;
  font-size: 20px;
}
.text {
  margin-left: 10px;
}
.icon-star {
  color: #f4cd17;
}
.iconfont:not(.disabled):hover{
  transform: scale(1.4);
  transition: .3s;
  cursor: pointer;
}

</style>
