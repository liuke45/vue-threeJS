<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { ThreeManager } from '@/libs/ThreeManager/ThreeManager'
import ToolBar from './components/ToolBar.vue'
import MaterialShop from './components/MaterialShop.vue'
const containerRef = ref<HTMLDivElement>()
const threeManager = ThreeManager.getInstance()

onMounted(() => {
  if (containerRef.value) {
    // 初始化 Three.js 管理器
    // threeManager.initialize(containerRef.value)
    // 创建一个示例立方体
    // const cube = threeManager.createCube(1, 0xfef4e8)
    // threeManager.addMesh(cube)
  }
})

onBeforeUnmount(() => {
  threeManager.dispose()
})
</script>

<template>
  <div class="relative flex h-full w-full gap-2">
    <ToolBar />
    <MaterialShop />
    <div ref="containerRef" class="h-full flex-1 overflow-hidden rounded-lg"></div>
  </div>
</template>
