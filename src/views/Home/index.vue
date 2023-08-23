<template>
  <div class="common-layout">
    <el-container style="height: 100%;">
      <el-aside width="280px">
        <side-menu></side-menu>
      </el-aside>
      <el-main>
        <Search></Search>
        <Login></Login>
        <RouterView :key="route.path"/>
      </el-main>
    </el-container>
    <Myaplayer :audio="audio" ></Myaplayer>
  </div>
  
</template>

<script setup>
import SideMenu from '../../components/SideMenu.vue';
import { RouterView, useRoute} from 'vue-router'
import Myaplayer from '../../components/Myaplayer.vue';
import Search from '../Serach/index.vue'
const route = useRoute()
import { usePlayerStore } from '../../stores/player'
import { onMounted, reactive, ref } from 'vue';
import Login from '../../components/Login.vue';
// RouterView绑定key解决相同页面参数不同页面不刷新问题
const playerStore = usePlayerStore()
const audio = reactive({
    artist:' ',
    name:'',
    url:'',
    cover:'',
    lrc:''

})
onMounted(()=>{
  // console.log(playerStore.isPlaying)
})
</script>

<style lang="scss" scoped>

.common-layout{
    position: absolute;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
}

.el-main{
  background-color: #FAFAFA;
}
</style>
