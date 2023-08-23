<template>
  <div class="singer">
    <div class="singer-container">
      <div class="singer-main">
        <div class="singer-item" v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="50">
          <template v-for="item in singerList" :key="item.id">
            <SingerItem :item="item"></SingerItem>
          </template>
          
        </div>
        <div v-if="busy" v-loading="loading" class="loading"></div>
      </div>
      <div class="singer-aside">
        <el-affix :offset="140">
          <div class="asideMenu">
            <div class="singer-filter">
              <div class="filter-item">
                <div v-for="(item,index) in singerInitial" :key="index" class="itemIndex" :class="initial==item.value?'active':''" @click="selectInitialType(item)" >{{ item.name }}</div>
              </div>
              <div class="filter-item">
                <div v-for="(item,index) in singerArea" class="itemIndex" :key="index" :class="area==item.id?'active':''" @click="selectAreaType(item)" >{{ item.name }}</div>
              </div>
              <div class="filter-item">
                <div v-for="(item,index) in singerType" class="itemIndex" :key="index" :class="type==item.id?'active':''" @click="selectTypeType(item)" >{{ item.name }}</div>
              </div>
            </div>
          </div>
        </el-affix>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import http from '../../api/http';
import SingerItem from '../../components/SingerItem.vue';
import {SINGER_AREA,SINGER_TYPE,SINGER_INITIAL } from '../../utils/songs'
const singerList = ref([])
const singerArea = SINGER_AREA
const singerType = SINGER_TYPE
const singerInitial = SINGER_INITIAL
const offset = ref(0)
const type = ref(-1)
const area = ref(-1)
const initial = ref(-1)
const busy = ref(false)
const loading = ref(false)
const loadMore=()=>{
  loading.value = true
  busy.value = true
  offset.value++;
  http.get(`/artist/list?limit=30&offset=${offset.value}&type=${type.value}&area=${area.value}&initial=${initial.value}`)
  .then(res=>{
    const data = res.data.artists
    singerList.value = [...singerList.value,...data]
    busy.value=false
    loading.value =false
  })
}
const selectInitialType=(item)=>{
  initial.value = item.value
  offset.value = 0
  getItem()
}
const selectAreaType=(item)=>{
  area.value = item.id
  offset.value = 0
  getItem()
}
const selectTypeType=(item)=>{
  type.value = item.id
  offset.value = 0
  getItem()
}
const getItem=()=>{
  http.get(`/artist/list?limit=30&offset=${offset.value}&type=${type.value}&area=${area.value}&initial=${initial.value}`)
  .then(res=>{
    singerList.value = res.data.artists
  })
}
onMounted(() => {
  getItem()
})
</script>

<style lang="scss" scoped>
.loading{
  height: 100px;
}
.el-affix{
  width: 350px;
  height: 300px;
}
.singer{
  .singer-container{
    display: flex;
    .singer-main{
      flex: 1;
      .singer-item{
        margin-top:100px ;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }
    .singer-aside{
      .asideMenu{
        padding: 20px 20px 1px;
        margin-bottom: 25px;
        margin-left: 10px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        .singer-filter{
          .filter-item{
            padding-bottom: 20px;
            .itemIndex{
              display: inline-block;
              padding: 2px 10px;
              font-size: 14px;
              line-height: 28px;
              margin-right: 6px;
              cursor: pointer;
              border-radius: 3px;
            }
             .active{
              background: orange;
              color: white;
             }
          }
        }
      }
    }
  }
}
</style>
