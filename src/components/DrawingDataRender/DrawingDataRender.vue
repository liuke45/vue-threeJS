<template>
  <div id="2d-view" ref="view2d" class="view-show-area"></div>
</template>

<script setup lang="ts">
// import Viewer from '@/lib/cool/viewer/Viewer'

import { ref } from 'vue'
const view2d = ref()
// function initThree () {
//   viewer = new Viewer('2d-view', { stats: isDevEnv, canvasCss: { position: 'relative', zIndex: 0 } })
//   rawPosition.value = viewer.worldSpaceP

//   // 初始化
//   new CadLoader(viewer)
// }
</script>
<style scoped>
.view-show-area {
  height: 100%;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  flex: 1;
  position: relative;
}
</style>
