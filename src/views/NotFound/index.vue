<template>
  <div class="notfound">
    <el-result
        icon="warning"
        title="404提示"
        sub-title="你找的页面走丢了"
      >
        <template #extra>
            <el-button type="warning" plain @click="back">回到首页</el-button>
        </template>
      </el-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const back=()=>{
    router.push({path:'/home/index'})
}
</script>

<style lang="scss" scoped>
</style>
