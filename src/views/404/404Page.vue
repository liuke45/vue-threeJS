<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.back()
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <el-empty description="404">
      <el-button @click="goToHome">back to home</el-button>
    </el-empty>
  </div>
</template>
