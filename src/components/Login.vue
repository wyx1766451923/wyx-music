<template>
    <div class="login" @click="handleLogin" v-if="loginStore.isLogin == false">
        您还未登录，点击登录
    </div>
    <div class="userInfo" v-else>
      <div class="avatar">
        <el-image :src="userInfo.avatar"></el-image>
      </div>
      <div class="username">
        {{ userInfo.nickname }}
      </div>
      <div class="logout" @click="handlelogout">
        退出登录
      </div>
    </div>
    <el-dialog
      v-model="loginStore.centerDialogVisible"
      title="请扫描二维码登录"
      width="30%"
      align-center
    >
      <div  class="logo">
        <el-image src="/img/logo.jpg"></el-image>
      </div>
      <template #footer>
        <div class="nologin">
          <div class="qrcode">
            <qrcode-vue :value="qrCodeInfo" size:300  ></qrcode-vue>
          </div>
          <div class="info">
            请使用<span @click="toDownload">网易云音乐app</span>扫码登录
          </div>
        </div>
        <!-- <div class="isScan">

        </div> -->
      </template>
    </el-dialog>
  </template>

<script setup>
import { onMounted, onUpdated, reactive, ref, watch } from 'vue'
import http from '../api/http';
import QrcodeVue from 'qrcode.vue'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '../stores/login'
const loginStore = useLoginStore()
const loginKey = ref('')
const qrCodeInfo = ref('')
let userInfo = reactive({
  userId:0,
  avatar:'',
  nickname:'',
})
let timer = ''
const handlelogout=()=>{
  http.get(`/logout`)
  .then(res=>{
    if(res.data.code==200){
      ElMessage({
        message: '退出成功',
        type: 'success',
      })
      localStorage.removeItem('cookie')
      loginStore.isLogin = false
    }
  })
}
const toDownload=()=>{
  window.open('https://music.163.com/#/download')
}
const handleLogin=()=>{
  loginStore.centerDialogVisible = true
}
const getLoginKey = ()=>{
    http.get(`/login/qr/key?timestamp=${Date.now()}`)
    .then(res=>{
        loginKey.value = res.data.data.unikey
        getQrCodeInfo()
    })
}
const getQrCodeInfo=()=>{
    http.get(`/login/qr/create?key=${loginKey.value}&timestamp=${Date.now()}`)
    .then(res=>{
        qrCodeInfo.value = res.data.data.qrurl
        checkStatus()
    })
}
const checkStatus= async ()=>{
  const cookie = localStorage.getItem('cookie')
  if(cookie){
    loginStore.isLogin = true
    getLoginStatus(cookie)
  }else{
    timer = window.setInterval(async () => {
      await http.post(`/login/qr/check?timestamp=${Date.now()}`,
      {
        key:loginKey.value,
        noCookie:true
      })
      .then(res=>{
        // console.log(res.data.code)
        // data = res.data
        if(res.data.code==800){
          ElMessage({
            message: '二维码已过期，请重新获取',
            type: 'warning',
          })
          window.clearInterval(timer)
        }
        if(res.data.code==803){
        loginStore.isLogin = true
        window.clearInterval(timer)
        ElMessage({
          message: '授权登陆成功',
          type: 'success',
        })
        getLoginStatus(res.data.cookie)
        localStorage.setItem('cookie',res.data.cookie)
        loginStore.centerDialogVisible = false
      }
      })
    }, 3000);
  }


  // return data
}
const getLoginStatus= async (cookie='')=>{
  
  await http.post(`/login/status?timestamp=${Date.now()}`,
  {
    cookie:cookie
  })
  .then(res=>{
    userInfo.userId = res.data.data.profile.userId
    loginStore.userId = userInfo.userId
    console.log(loginStore.userId)
    userInfo.avatar = res.data.data.profile.avatarUrl
    userInfo.nickname = res.data.data.profile.nickname    
  })
}
// const login=()=>{
//   const cookie = localStorage.getItem('cookie')
//   getLoginStatus(cookie)
//   timer = window.setInterval(async () => {
//   const statusRes = await checkStatus()
//   console.log(statusRes.code)
//   if(statusRes.code==800){
//     ElMessage({
//       message: '二维码已过期，请重新获取',
//       type: 'warning',
//     })
//     window.clearInterval(timer)
//   }
//   if(statusRes.code==803){
//     window.clearInterval(timer)
//     ElMessage({
//       message: '授权登陆成功',
//       type: 'success',
//     })
//     await getLoginStatus(statusRes.cookie)
//     localStorage.setItem('cookie',statusRes.cookie)
//     console.log(1111)
//   }
// }, 3000);
// }
onMounted(()=>{
    getLoginKey()
})
</script>

<style lang="scss" scoped>
.info{
  margin: 10px 0;
  text-align: center;
  span{
    color: orange;
    cursor: pointer;
  }
}
.qrcode{
  text-align: center;
}
.login{
    padding-left: 20px;
    color: gray;
    cursor: pointer;

}
.login:active{
    color: orange;
}
.logo{
    text-align: center;
}
.userInfo{
  display: flex;
  margin-left: 20px;
  .avatar{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  .username{
    font-size: 16px;
    padding-left: 20px;
    padding-top: 10px;

  }
  .logout{
    font-size: 14px;
    color: gray;
    padding-left: 20px;
    padding-top: 10px;

  }
  .logout:hover{
    color: orange;
    cursor: pointer;
  }
}
</style>
