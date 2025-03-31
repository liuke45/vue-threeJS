<script setup lang="ts">
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutLeftMenu from '@/components/layout/LayoutLeftMenu.vue'
</script>
<template>
  <div class="h-full overflow-hidden">
    <el-container>
      <el-header>
        <LayoutHeader />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <LayoutLeftMenu />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped></style>
