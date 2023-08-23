import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', () => {
  const isLogin = ref(false)//是否已经登录
  const centerDialogVisible = ref(false)
  const isScan = ref(false)//是否扫码
  const userId = ref(0)

  return { isLogin,centerDialogVisible,userId }
})
