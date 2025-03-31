<script setup lang="ts">
import { ThreeManager } from '@/libs/ThreeManager/ThreeManager'
import { RefreshLeft, FullScreen } from '@element-plus/icons-vue'
const threeManager = ThreeManager.getInstance()

const TOOL_BAR_MAP = [
  {
    icon: RefreshLeft,
    tooltip: '重置场景',
    onClick: () => threeManager.resetScene(),
  },
  {
    icon: FullScreen,
    tooltip: '全屏',
    onClick: () => threeManager.toggleFullScreen(),
  },
]
</script>

<template>
  <div class="absolute right-2 top-2 flex cursor-pointer gap-2 rounded-lg bg-white p-1.5">
    <el-tooltip v-for="item in TOOL_BAR_MAP" :key="item.tooltip" :content="item.tooltip">
      <div class="h-5 rounded-md p-0.5 hover:bg-gray-100" @click="item.onClick">
        <el-icon size="18">
          <component :is="item.icon" />
        </el-icon>
      </div>
    </el-tooltip>
  </div>
</template>
