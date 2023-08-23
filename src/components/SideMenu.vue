<template>
  <el-menu
        :default-active="router.currentRoute.value.fullPath"
        class="el-menu-vertical-demo"
        :router="true"
      >
      <div class="logo">
        <el-image style="width: 150px; height: 100px" src="/img/logo.jpg" fit="scale-down" />
      </div>
      <el-menu-item index="/home/index">
          <el-icon><House /></el-icon>
          <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/home/musicCharts">
          <el-icon><Histogram /></el-icon>
          <span>排行榜</span>
      </el-menu-item>
      <el-menu-item index="/home/playlist">
          <el-icon><Headset /></el-icon>
          <span>歌单</span>
      </el-menu-item>
      <el-menu-item index="/home/musicVideo">
          <el-icon><VideoCamera /></el-icon>
          <span>MV</span>
      </el-menu-item>
      <el-menu-item index="/home/singer">
          <el-icon><UserFilled /></el-icon>
          <span>歌手</span>
      </el-menu-item>
      <el-menu-item index="/home/myMusic">
          <el-icon><icon-menu /></el-icon>
          <span>我的音乐</span>
        </el-menu-item>
      </el-menu>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {ref,onMounted} from 'vue'
import {
  Menu as IconMenu,
  House,
  VideoCamera,
  Histogram,
  Headset,
  UserFilled
} from '@element-plus/icons-vue'
// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath)
// }
const router = useRouter()

</script>

<style lang="scss" scoped>
.logo{
    text-align: center;
}
.el-menu {
	border-right:0!important;
    height: 100%;
    background-color: #FAFAFA!important;
}
.el-menu-item{
    border-radius: 10px;
    margin-left: 40px;
    margin-right: 20px;
    // justify-content: center;
    .el-icon{
        width: 30px;
        padding: 2px;
        border-radius: 10px;
        font-size: 30px;
        background-color: white;
        box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
    }
}
.is-active{
    background-color:white;
    box-shadow: 0 20px 27px #0000000d;
    .el-icon{
        background-color: orange;
    }
    .el-icon svg{
        color: white;
    }
    span{
        color: black;
    }
}
</style>
