<template>
  <div class="playlist">
    <div class="filter">
      <div class="filterItem" v-for="(item,index) in categories" :key="index">
        <div class="filterTitle">
          {{ item.name }}
        </div>
        <div class="filterBox">
          <div class="boxItem" :class="curType==boxItem.name?'active':''" v-for="(boxItem,boxIndex) in item.sub.slice(0,8)" :key="boxItem.name" @click="selectCurType(boxItem)">
            {{ boxItem.name }}
          </div>
          <el-popover
            placement="bottom"
            :width="'auto'"
            trigger="click"
          >
            <template #reference>
              <div class="boxItem" v-if="item.sub.length > 9">更多<el-icon><ArrowDown /></el-icon>
              </div>             
            </template>
            <div class="filter-drop">
              <div class="boxItem" :class="curType==boxItem.name?'active':''" v-for="(boxItem,boxIndex) in item.sub.slice(9)" :key="boxItem.name" @click="selectCurType(boxItem)">
                {{ boxItem.name }}
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="listHead">
        <div>{{ curType }}<em v-if="curType != allList.name" class="typeClose" @click="closed"><el-icon><Close /></el-icon></em></div>
        <div class="orderType">
          <span :class="order == 'hot'?'active':''" @click="selectOrderType('hot')">热门</span>
          <span :class="order == 'new'?'active':''" @click="selectOrderType('new')">最新</span>
        </div>
      </div>
      <div class="listAblum" v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="50">
        <div v-if="listInfo.length==0">
          <el-empty description="暂无最新歌单" />
        </div>
        <div v-else>
          <PlayList :hotListInfo="listInfo"></PlayList>
        </div>
        <div v-if="busy" v-loading="loading" class="loading"></div>
      </div>
      <!-- vue无限滚动vue-infinite-scroll插件 -->
    </div>
  </div>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import http from '../../api/http';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowDown,
  Close
} from '@element-plus/icons-vue'
import PlayList from '../../components/PlayList.vue';
const categories = ref([])
const sub = ref()
const allList = ref({})
const curType = ref('')
const order = ref('hot')
const offset = ref(0)
const router = useRouter()
const listInfo = ref([])
const busy = ref(false)
const loading = ref(false)

const loadMore=()=>{
  loading.value = true
  busy.value = true
  offset.value++;
  http.get(`/top/playlist?limit=48&order=${order.value}&offset=${offset.value}&cat=${curType.value}`)
  .then(res=>{
    const data = res.data.playlists
    listInfo.value = [...listInfo.value,...data]
    busy.value=false
    loading.value =false
  })
}
const getListInfo=()=>{
  http.get(`/top/playlist?limit=48&order=${order.value}&offset=${offset.value}&cat=${curType.value}`)
  .then(res=>{
     
    listInfo.value = res.data.playlists
    busy.value=false
    loading.value =false
  })
}
const closed=()=>{
  curType.value = '全部歌单'
  offset.value = 0
  getListInfo()
}
const selectOrderType=(type)=>{
  order.value = type
  offset.value = 0
  getListInfo()
}
const selectCurType=(boxItem)=>{
  curType.value = boxItem.name
  offset.value = 0
  getListInfo()
}
const getCatlist=()=>{
  http.get('/playlist/catlist')
  .then(res=>{
    sub.value = res.data.sub
    allList.value = res.data.all
    curType.value = res.data.all.name 
    for(const i in res.data.categories){
      const params = {name:res.data.categories[i]}
      params.sub = sub.value.filter(item=>{
        return item.category == i
      })
      categories.value.push(params)
    }
    // console.log(categories.value)
  })
}
onMounted(() => {
  getCatlist()
  getListInfo()
})
</script>
<style lang="scss">
.el-popper{
  .filter-drop{
    display: flex;
    .boxItem{
      padding: 2px 10px;
      cursor: pointer;  
    }
  }
}
</style>
<style lang="scss" scoped>
.loading{
  height: 100px;
}
.active::after {
  content: '';
  width: 50%;
  height: 1px;
  display: block;
  border-bottom: 3px solid orange;
}
.playlist{
  padding-top: 80px;
  .filter{
    display: flex;
    height: 150px;
    padding: 20px;
    margin-bottom: 25px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    .filterItem:first-of-type{
      border-left: none;
    }
    .filterItem{
      flex: 1;
      border-left: 1px solid #f1eded;
      padding-left: 35px;
      .filterTitle{
        font-weight: bold;
        margin-bottom: 5px;
      }
      .filterBox{
        
        .boxItem{
          display: inline-block;
          padding: 3px 0;
          width: calc(100% / 3);
          font-size:14px;
          cursor: pointer;
        }
        .filter-drop{
          display: flex;
          // .boxItem{

          // }
        }
        
      }
    }
  }
  .list{
    .listHead{
      display: flex;
      padding: 15px 0;
      padding-left: 6px;
      font-size: 24px;
      color: black;
      font-weight: bold;
      .typeClose{
        cursor: pointer;
        font-size: 16px;
        position: relative;
        top: -6px;
        left: 5px;
      }
      .orderType{
        font-weight: normal;
        display: flex;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        span{
          padding: 0 15px;
        }
      }
    }
    .listAblum{
      padding: 5px 5px;
    }
  }
}
</style>
