<template>
  <div class="home">
    <div class="aaa">点击我生成组件</div>
  </div>
</template>

<style scoped lang="less">
  .aaa {
    position: absolute;
    top: 120px;
    left: 400px;
    padding: 8px 24px;
    border: 1px solid rgba(0, 0, 0, .5);
    cursor: pointer;
    border-radius: 4px;
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

export default defineComponent({
  name: 'Home',
  components: {
  }
})
</script>
