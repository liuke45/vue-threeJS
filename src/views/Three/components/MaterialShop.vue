<script setup lang="ts">
import { materialMap } from '../constants/materialMap'
import { ref } from 'vue'

const activeName = ref(materialMap.basic.title)
</script>

<template>
  <div class="material-shop">
    <el-scrollbar max-height="100%">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          v-for="(item, index) in materialMap"
          :key="index"
          :title="item.title"
          :name="item.title"
        >
          <div class="grid grid-cols-2 gap-2.5 p-2">
            <div
              v-for="material in item.materials"
              :key="material.name"
              class="material-item group"
              @click="() => material.creator()"
            >
              <div
                class="flex w-full flex-1 items-center justify-center rounded-md border border-gray-100 bg-gray-100"
              >
                <img
                  draggable="false"
                  class="h-1/2 w-1/2 transition-all duration-300 group-hover:scale-150"
                  :src="material.img"
                  alt=""
                />
              </div>
              <div class="text-xs group-hover:text-blue-400">{{ material.name }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.material-shop {
  @apply h-full w-80 min-w-44 rounded-lg bg-[#f5f5f5] p-2;

  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
}

:deep(.el-collapse) {
  border-top: 0;
  border-bottom: 0;
  @apply h-full;
}

:deep(.el-collapse-item:last-of-type .el-collapse-item__header) {
  border-bottom: 0;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

.material-item {
  @apply select-none;
  @apply flex h-32 min-w-20 flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-gray-100 bg-white p-1;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-[4px_4px_10px_#bdbdbd,_-4px_-4px_10px_#ffffff];
  @apply active:scale-95 active:shadow-[4px_4px_10px_#bdbdbd,_-4px_-4px_10px_#ffffff];
}
</style>
