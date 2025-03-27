<script setup lang="ts">
import { reqOneDayWord } from '@/apis/modules/test'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const oneDayWord = ref<string>('')
const goToTest = () => {
  router.push('/test')
}

const testClick = async () => {
  const res = await reqOneDayWord()
  oneDayWord.value = res.msg || ''
}
testClick()
</script>
<template>
  <div>{{ oneDayWord }}</div>
  <el-button @click="goToTest">go to test</el-button>
  <el-button @click="testClick">每日一言</el-button>
</template>

<style scoped></style>
