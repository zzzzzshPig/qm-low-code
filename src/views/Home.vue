<template>
  <div class="home">
    <div class="aaa" @click="clickTest">点击我生成组件</div>

    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<style scoped lang="less">
  .aaa {
    width: 120px;
    margin: 120px 0 0 300px;
    padding: 8px 24px;
    border: 1px solid rgba(0, 0, 0, .5);
    cursor: pointer;
    border-radius: 4px;
  }
</style>

<script lang="ts">
import { defineComponent, createApp, ref, reactive, h } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

const classId = 0

export default defineComponent({
  name: 'Home',

  setup () {
    const canvas = ref<HTMLDivElement>()

    return {
      canvas,
      clickTest () {
        if (!canvas.value) return

        const container = document.createElement('div')
        const props = reactive({ msg: '123' })

        setTimeout(() => {
          props.msg = '456'
        }, 1000)

        container.className = `_container_class_${classId}`
        createApp({
          render () {
            return h(HelloWorld, props)
          }
        }).mount(container)
        canvas.value.appendChild(container)
      }
    }
  }
})
</script>
