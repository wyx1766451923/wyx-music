<template>
  <div class="search">
    <el-select
        class="select"
        v-model="keyValue"
        clearable
        size="large"
        filterable
        remote

        :fit-input-width="true"
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
        loading-text="正在搜索中..."
        @focus="handleFocus"
        @clear="handleClear"
        @keyup.enter="enterHandler"
    >
      <el-option-group
        v-for="(list,index) in suggestInfo"
        :key="listType[list.label]+index"
        :label="listType[list.label]"
      >
        <el-option
            v-for="(item,index) in list.info"
            :key="index"
            :label="item.name"
            :value="list.label + item.name"
            class="item"
            @click="selectSearch(item,list.label)"
        >
            {{item.name}}
            <template v-if="list.label === 'songs'">
                -  <span class="artists" v-for="(artist, artistIndex) in item.artists" :key="artistIndex">{{(artistIndex !== 0 ? ' / ' : '') + artist.name}}</span>
            </template>
            <template v-else-if="list.label === 'albums'">
                -  <span class="artists">{{item.artist.name}}</span>
            </template>
        </el-option>
        </el-option-group>
    </el-select> 
  </div>
</template>

<script setup>
import {ref,onMounted} from "vue"
import { useRouter } from "vue-router";
import http from "../../api/http";
import {LIST_TYPE} from '../../utils/songs'
const keyValue = ref('')
const loading = ref(false)
const listType = LIST_TYPE
const router = useRouter()
const suggestInfo = ref([])
const hotList = ref([])
const enterHandler=()=>{
    console.log(keyValue.value)
    router.push({name:'search',params:{keyValue:keyValue.value}})
}
const selectSearch=(item,type)=>{
    console.log(item,type)
    switch(type){
        case 'songs':router.push({path:`/home/song/${item.id}`});break;
        case 'albums':router.push({path:`/home/album/${item.id}`});break;
        case 'playlists':router.push({path:`/home/playlist/detail/${item.id}`});break;
        case 'artists':router.push({path:`/home/${item.id}`});break;
        
    }
}
const getSuggestInfo = ()=>{
    http.get(`/search/suggest?keywords=${keyValue.value}`)
    .then(res=>{
        if(res.data.result.order){
            suggestInfo.value = res.data.result.order.map(item=>{
                return {
                    label:item,
                    info:res.data.result[item]
                }
            })
        }
        loading.value = false
    })
}
// const getHot=()=>{ //热搜榜
//     http.get(`/search/hot`)
//     .then(res=>{
//     })
// }
const remoteMethod=(query)=>{
    keyValue.value = query
    if(keyValue.value){
        loading.value = true
        suggestInfo.value = []
        getSuggestInfo()
        // console.log(suggestInfo.value)
    }
}
const handleFocus=()=>{
    // if(keyValue.value){
    //     loading.value = true
    //     suggestInfo.value = []
    //     getSuggestInfo()
    // }
}
const handleClear=()=>{
    suggestInfo.value = []
}

onMounted(() => {
    
})
</script>

<style lang="scss" scoped>
.search{
    width: 100%;
    height: 0px;
    display: flex;
    justify-content: right;
    padding-top: 30px;
    
    .select{
        
    }
}

</style>
