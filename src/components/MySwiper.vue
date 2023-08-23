<template>
  <swiper
    :modules="modules"
    :slides-per-view="4"
    :space-between="50"
    autoplay
    :pagination="{ clickable: true }"
    
    class="banner_wrap"
  >
  <swiper-slide v-for="item of bannerList" :key="item.imageUrl">
    <el-image :src="item.imageUrl" :alt="item.typeTitle" class="banner_img" @click="selectPath(item)">
    </el-image>
  </swiper-slide>

  </swiper>
</template>
<script setup>
  // import Swiper core and required modules
  import {  Pagination, A11y ,Autoplay} from 'swiper/modules';
  import { ref, reactive,onMounted /* nextTick  onBeforeUpdate*/ } from 'vue';
  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import http from '../api/http.js'

  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
import { useRouter } from 'vue-router';
const router = useRouter()

  // Import Swiper styles

  // const onSwiper = (swiper) => {
  //   console.log(swiper);
  // };
  // const onSlideChange = () => {
  //   console.log('slide change');
  // };
  const  modules = [ Pagination, A11y,Autoplay]
  const bannerList = ref([])
  const selectPath = (item)=>{
    switch(item.targetType){
      case 1:router.push({path:`/home/song/${item.targetId}`});break;//单曲
      case 10:router.push({path:`/home/album/${item.targetId}`});break;//专辑
      case 1000:router.push({path:`/home/playlist/detail/${item.targetId}`});break;//歌单
      case 1004:router.push({path:`/home/musicVideo/detail//${item.targetId}`});break;//mv
      case 3000:window.open(item.url);break;//数字专辑
    }

  }
  const getBannerList =()=>{
    http.get('/banner?type=0')
    .then(res=>{
      bannerList.value = res.data.banners
    })
    // console.log(bannerList)
  }
  onMounted(() => {
    getBannerList()
  })
</script>
<style lang="scss" scoped>
.banner_wrap {
    position: relative;
    padding: 40px 0;
    font-size: 0;

    .banner_img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        cursor: pointer;
    }

}
</style>