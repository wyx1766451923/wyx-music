<template>
  <div class="mv">
    <div class="mv-container">
      <div class="mv-main">
        <div class="wrapper" v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="50">
          <div v-if="!myList">
            <el-empty description="暂无MV" />
          </div>
          <div v-else>
            <MvList :newMvList="myList"></MvList>
          </div>
          <div v-if="busy" v-loading="loading" class="loading"></div>
        </div>
      </div>
      <div class="mv-aside">
        <el-affix :offset="140">
          <div class="asideMenu">
            <h3 class="aside-title">排序</h3>
            <div class="filter-main">
              <div v-for="(item, index) in mvOrder" class="filter-item" :class="index == orderIndex ? 'active' : ''" :key="index" @click="selectAsideType(item,'order', index)">{{ item }}</div>
            </div>
            <h3 class="aside-title">区域</h3>
            <div class="filter-main">
              <div v-for="(item, index) in mvArea" class="filter-item" :class="index == areaIndex ? 'active' : ''" :key="index" @click="selectAsideType(item,'area', index)">{{ item }}</div>
            </div>
            <h3 class="aside-title">类型</h3>
            <div class="filter-main">
              <div v-for="(item, index) in mvType" class="filter-item" :class="index == typeIndex ? 'active' : ''" :key="index" @click="selectAsideType(item,'type', index)">{{ item }}</div>
            </div>
          </div>
        </el-affix>
      </div>
    </div>
  </div>
</template>

<script setup>
import MvList from "../../components/MvList.vue";
import { ref, onMounted } from 'vue'
import http from "../../api/http";
import { MV_ORDER, MV_AREA, MV_TYPE } from '../../utils/songs'
const mvOrder = MV_ORDER
const mvArea = MV_AREA
const mvType = MV_TYPE
const myList = ref([])
const area = ref('全部')
const type = ref('全部')
const order = ref('上升最快')
const offset = ref('0')
const orderIndex = ref(0)
const areaIndex = ref(0)
const typeIndex = ref(0)
const busy = ref(false)
const loading = ref(false)
const loadMore=()=>{
  loading.value = true
  busy.value = true
  offset.value++;
  http.get(`/mv/all?area=${area.value}&type=${type.value}&limit=30&offset=${offset.value}&order=${order.value}`)
    .then(res => {
      const data = res.data.data
      myList.value = [...myList.value,...data]
      busy.value=false
      loading.value =false
    })
}
const selectAsideType=(item,title, index)=>{
  if(title=='order'){
    orderIndex.value = index
    order.value = item
    offset.value = 0
    getMvList()
  }else if(title=='area'){
    areaIndex.value = index
    area.value = item
    offset.value = 0    
    getMvList()
  }else if(title=='type'){
    typeIndex.value = index
    type.value = item
    offset.value = 0
    getMvList()
  }
}
const getMvList = () => {
  http.get(`/mv/all?area=${area.value}&type=${type.value}&limit=30&offset=${offset.value}&order=${order.value}`)
    .then(res => {
      myList.value = res.data.data
      busy.value=false
      loading.value =false
    })
}
onMounted(() => {
  getMvList()
})
</script>
<style lang="scss" scoped>
.loading{
  height: 100px;
}
.el-affix{
  width: 350px;
  height: 250px;
}
.mv{
  .mv-container{
    display: flex;
    margin-top: 100px;
    .mv-main{
      flex: 1;
      // .wrapper{

      // }
    }
    .mv-aside{
      .asideMenu{
        padding: 20px 0px 15px 20px;
        background: white;
        margin-left: 20px;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        .aside-title{
          font-size: 18px;
          color: black;
          font-weight: bold;
          padding-bottom: 5px;
        }
        .filter-main{
          display: flex;
          .filter-item{
            font-size: 14px;
            margin-right: 12px;
            text-align: center;
            margin-bottom: 10px;
            cursor: pointer;           
          }
        }
        .active{
          border-bottom:2px solid orange ;
        }
      }
      
    }
  }
}
</style>
