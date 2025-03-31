<script setup lang="ts">
import { reqOneDayWord } from '@/apis/modules/test'
import { onMounted, ref } from 'vue'
const oneDayWord = ref<string>('')
onMounted(async () => {
  const res = await reqOneDayWord()
  oneDayWord.value = res.msg || ''
})
</script>
<template>
  <div
    class="flex h-full items-center justify-between border-b border-solid border-gray-200 p-3"
  >
    <span>{{ oneDayWord }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
