<template>
  <el-carousel class='artist' height="340px" :interval="8000" arrow="never" indicator-position="outside">
    <el-carousel-item v-for="(list,listindex) in artistList" :key="listindex" class="boxitem">
      <div v-for="(item,index) in list" :key="item.id" class="artistitem">
        <div class="artistImg">
            <el-image :src="item.picUrl + '?param=100y100'"></el-image>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import {ref, reactive,onMounted } from 'vue'
import http from '../api/http';

const artistList = ref([])
const getArtistList = () =>{
    http.get('/top/artists?offset=0&limit=36')
    .then(res=>{
        let index = 0
        while(index < res.data.artists.length){
            artistList.value.push(res.data.artists.slice(index, index += 12))
        }
    })
    // console.log(artistList)
}
onMounted(()=>{
    getArtistList()
})
</script>

<style lang="scss" scoped>
.artist{
    height: 360px;
    .boxitem{
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: space-between;
        .artistitem{
            border-radius: 4px;
            overflow: hidden;
        }
    }
}
</style>
