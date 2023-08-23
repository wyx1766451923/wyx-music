<template>
  <div class="search">
    <div class="header">
        <div class="searchType">
            <div class="typeItem" :class="selectIndex == index?'active':''" v-for="(item,index) in searchType" :key="item.value" @click="selectType(item.value,index)">
                {{ item.label }}
            </div>
        </div>
    </div>
    <div class="main">
        <div class="songs" v-if="selectIndex==0">
            <Songlist :tableSongList="tableSongList"></Songlist>
        </div>
        <div class="albums" v-if="selectIndex==1">
            <AlbumList :albumListInfo="albumListInfo"></AlbumList>
        </div>
        <div class="singers" v-if="selectIndex==2">
            <SingerList :singerList="singerInfo"></SingerList>
        </div>
        <div class="playlists" v-if="selectIndex==3">
            <PlayList :hotListInfo="hotListInfo"></PlayList>
        </div>
    </div>
    <div class="footer" v-if="selectIndex!=0">
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"     
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
        />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '../../api/http';
import Songlist from '../../components/songlist.vue';
import AlbumList from '../../components/AlbumList.vue';
import PlayList from '../../components/PlayList.vue';

import {SEARCH_TYPE} from '../../utils/songs'
import SingerList from '../../components/SingerList.vue';
const route = useRoute()
const router = useRouter()
const keyValue = route.params.keyValue
const searchType = SEARCH_TYPE
const selectIndex = ref(0)
const tableSongList = ref([])//单曲
const albumListInfo = ref([])//专辑
const searchData = ref([])//搜索数据
const singerInfo = ref([])//歌手
const hotListInfo = ref([])//歌单
const offset = ref(0)
const currentPage = ref(1)
const pageSize = ref(24)
const total = ref(100)
const handleCurrentChange = (val) => {
    offset.value = (val-1)*24
    getTableSongList()

}
const selectType= async (value,index)=>{
    currentPage.value = 1
    selectIndex.value = index
    await getTableSongList()
    // if(value==1){
    //     tableSongList.value = searchData.value.songs

    // }else if(value==10){
    //     albumListInfo.value = searchData.value.albums

    // }else if(value==100){
    //     singerInfo.value = searchData.value.artists

    // }else{
    //     hotListInfo.value = searchData.value.playlists

    // }


}
const getTableSongList=async ()=>{
    // console.log(searchType[selectIndex.value].value)
   await http.get(`/cloudsearch?keywords=${keyValue}&type=${searchType[selectIndex.value].value}&limit=24&offset=${offset.value}`)
    .then(res=>{
        searchData.value = res.data.result
        if(selectIndex.value==0){
            tableSongList.value = searchData.value.songs
            total.value = searchData.value.songCount
        }else if(selectIndex.value==1){
            albumListInfo.value = searchData.value.albums
            total.value = searchData.value.albumCount
        }else if(selectIndex.value==2){
            singerInfo.value = searchData.value.artists
            total.value = searchData.value.artistCount
        }else{
            hotListInfo.value = searchData.value.playlists
            total.value = searchData.value.playlistCount
        }
    })
}
onMounted(() => {
    getTableSongList()
})
</script>

<style lang="scss" scoped>
.search{
    background: white;
    margin: 60px 40px 0 40px;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    .header{
        height: 50px;
        .searchType{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            
            .active{
                background: orange!important;
                color: white;
            }
            .typeItem{
                background: rgb(228, 227, 227);
                margin: 0 25px;
                padding: 10px 20px;
                border-radius: 12px;
                cursor: pointer;

            }
        }
    }
    .main{
        overflow: hidden;
        .songs{
            width: 100%;
            position: relative;
            left: 150px;
        }
    }
    .footer{

    }
}
</style>
