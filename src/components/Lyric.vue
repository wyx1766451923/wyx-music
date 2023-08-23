<template>
  
  <div class="main">
    <div class="lyricItem" v-if="songLyric.length" :style="transform()">
      <div :class="[isCurrentLyric(item,index)]"  v-for="(item, index) in songLyric" v-if="songLyric.length" :key="index">
        {{ item.lyric }}
      </div>
      <!-- <div v-else class="lyric-empty">
        <p>歌词加载中......</p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import http from "../api/http";
import { usePlayerStore } from "../stores/player";
const songLyric = ref([])
const indexTrans = ref(0)
const curTime = ref(0) 
const playerStore = usePlayerStore()
const props = defineProps({
  lyricId:String,
  currentTime:Number
})
const transform=()=>{
  if(indexTrans.value > 11 && playerStore.isRevolve == true){   
    return `transform: translateY(-${23 * (indexTrans.value - 11)}px)`
  }else{
    return `transform: translateY(0)`
  }
}
watch(() => props.currentTime, (newVal, oldVal) => {
    // 无歌词的时候 不做动画滚动
  if (!songLyric.value.length) {
    return
  }
  indexTrans.value = getCurIndex(Math.ceil(newVal))
});
const getCurIndex=(time)=>{
  for(let i=0;i<songLyric.value.length;i++){
    if(time<=songLyric.value[i].time){
      return i
    }
  }
  return songLyric.value.length
}
const isCurrentLyric=(item,index)=>{
  let next = index+1
  return playerStore.isRevolve == true && props.currentTime <=(  (songLyric.value[next]?.time) ) && props.currentTime >item.time ?'active':''
}
const getSongLyric = () => {
  http.get(`/lyric?id=${props.lyricId}`)
    .then(res => {
      let arr = res.data.lrc.lyric.split('\n')

      for (let i = 0; i < arr.length; i++) {
        let temp_row = arr[i]
        let temp_arr = temp_row.split(']')//将歌词和时间分开

        let temp_text = temp_arr.pop()

        temp_arr.forEach(item => {
          let obj = []
          let time_arr = item.substring(1, item.length - 1).split(':')//分割'['和':'
          let time = parseInt((time_arr[0]) * 60 + Math.ceil(time_arr[1]))
          //将时间分秒转化为秒，方便后续运用
          //Math.ceil() 函数总是四舍五入并返回大于等于给定数字的最小整数。

          obj.time = time
          obj.lyric = temp_text

          songLyric.value.push(obj)
        });

      }
    })
  songLyric.value.sort(sortRule)
  // console.log(songLyric)

}
const sortRule = (a, b) => { //设置一下排序规则,歌词会有重复，按照时间排序
  return a.time - b.time;
}
onMounted(() => {
  getSongLyric()
})
</script>

<style lang="scss" scoped>
.active{
  color: red;
}
.main {
  height: 530px;
  overflow-y: auto;
  transition: all 1.5s ease-in-out;
  .lyricItem {
    transform: translateY(0);
    transition: transform 1.5s ease-in-out;
    text-align: center;
    // .currentLyric {

    // }
  }
}
.main::-webkit-scrollbar{
  display: none;
}
</style>
