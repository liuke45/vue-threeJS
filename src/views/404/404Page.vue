<script setup lang="ts">
import { ROUTES_NAMES } from '@/router/constants'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.replace({ name: ROUTES_NAMES.THREE.BASE })
}
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <el-empty description="404">
      <el-button @click="goToHome">back to home</el-button>
    </el-empty>
  </div>
</template>
