<template>
<div class="selectType">
  <span>向导选择</span>
  <el-select v-model="value" placeholder="请选择一个向导">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</div>

</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        }
      ],
    },
  },
  data() {
    return {
      value: ""
    };
  }
}; 
</script>
<style scoped>
  .selectType {
    border-bottom: 2px solid #ccc;
    width: 100%;
    padding-top: 12px;
  }
  span {
    margin: 0 10px;
  }
</style>
