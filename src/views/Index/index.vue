<template>
    <div class="index">
        <MySwiper></MySwiper>
        <div class="hot-list">
            <div class="h_title">
                <h2>热门推荐</h2>
                <div v-for="(item,index) in hotListTags" class="tags" :class="index == hotselectindex? 'active' : '' " :key="item.id" @click="handleTag(item.name,index)">{{ item.name }}</div>
            </div>
            <div class="wrapper">
                <PlayList :hotListInfo="hotListInfo"></PlayList>
            </div>
        </div>
        <div class="album-list">
            <div class="h_title">
                <h2>新碟上架</h2>
                <div v-for="(item,index) in getNewSongType" class="tags" :class="index == discselectindex? 'active' : '' " :key="item.typeId" @click="handleAlbumTag(item.typeArea,index)">{{ item.typeName }}</div>
            </div>
            <div class="wrapper">
                <AlbumList :albumListInfo="albumListInfo"></AlbumList>
            </div>
        </div>
        <div class="top-list">
            <RankList></RankList>
        </div>
        <div class="mv-list">
            <div class="h_title">
                <h2>最新MV</h2>
                <div v-for="(item,index) in mvArea" :key="index" class="tags" :class="index==mvIndex?'active':''" @click="handleMvTag(item,index)">
                    {{ item }}
                </div>
            </div>
            <div class="wrapper">
                <MvList :newMvList="newMvList"></MvList>
            </div>
        </div>
        <div class="dj_and_artists">
            <div class="dj-list">
                <div class="h_title">
                    <h2>热门电台</h2>
                </div>
                <DjList></DjList>
            </div>
            <div class="artist-list">
                <div class="h_title">
                    <h2>热门歌手</h2>
                </div>
                <ArtistList></ArtistList>
            </div>
        </div>
    </div>
    

</template>

<script setup>
import MySwiper from '../../components/MySwiper.vue';
import {ref, reactive,onMounted } from 'vue'
import http from '../../api/http';
import { formartNum } from '../../utils/util.js'
import { newSongType } from '../../utils/songs'
import RankList from '../../components/RankList.vue';
import { MV_AREA } from '../../utils/songs';
import DjList from '../../components/DjList.vue';
import ArtistList from '../../components/ArtistList.vue';
import PlayList from '../../components/PlayList.vue';
import MvList from '../../components/MvList.vue'
import AlbumList from '../../components/AlbumList.vue';

const hotListTags = ref([])

const hotselectindex = ref(0)
const mvIndex = ref(0)
const discselectindex = ref(0)
const getNewSongType = newSongType()
const albumListInfo = ref([])
const newMvList = ref([])
const mvArea = MV_AREA;
const hotListInfo = ref([])
const getHotListInfo = () =>{
    http.get('/top/playlist?limit=6&order=hot&cat=华语')
    .then(res=>{
        hotListInfo.value = res.data.playlists
    })
}
const getHotListTags = () =>{
    http.get('/playlist/hot')
    .then(res=>{
        hotListTags.value = res.data.tags
    })
    // console.log(hotListTags)
}
const getNewMvList=()=>{
    http.get('/mv/first?limit=12')
    .then(res=>{
        newMvList.value = res.data.data
    })
    console.log(newMvList)
}
const handleMvTag=(item,index)=>{
    mvIndex.value = index;
    if(item=="全部"){
        getNewMvList()
    }else{
        http.get(`/mv/first?limit=12&area=${item}`)
        .then(res=>{
            newMvList.value = res.data.data
        })
    }
}
const getAlbumListInfo=()=>{
    http.get('/top/album?offset=0&limit=12&area=ALL')
    .then(res=>{
        albumListInfo.value = res.data.weekData.slice(0,12)//除开ALL是weekdata，其余的都是monthdata
    })
}

const handleTag=(name,index)=>{
    
    hotselectindex.value = index
    
    http.get(`/top/playlist?limit=6&order=hot&cat=${name}`)
    .then(res=>{
        hotListInfo.value = res.data.playlists
    })
}
const handleAlbumTag=(typeArea,index)=>{
    discselectindex.value = index
    if(typeArea == 'ALL'){
        getAlbumListInfo()
    }
    else{
        http.get(`/top/album?offset=0&limit=12&area=${typeArea}`)
        .then(res=>{
            albumListInfo.value = res.data.monthData.slice(0,12)//除开ALL是weekdata，其余的都是monthdata
         })
    }
    
}
onMounted(()=>{
    getHotListTags()
    getHotListInfo()
    getAlbumListInfo()
    getNewMvList()
})
</script>

<style lang="scss" scoped>
.index{
    margin-top: 40px;
}
.dj_and_artists {
    display: flex;
}
.dj-list{
    flex: 1;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 27px #0000000d;
    cursor: pointer;
    margin-top: 25px;
    padding: 0 10px;
    margin-right: 20px;
}
.artist-list{
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 27px #0000000d;
    cursor: pointer;
    margin-top: 25px;
    padding: 0 10px;
    width: 480px;
}
.mv-list{
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 27px #0000000d;
    cursor: pointer;
    margin-top: 25px;
    padding: 0 10px;

}


.album-list{
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 27px #0000000d;
    cursor: pointer;
    margin-top: 25px;
    padding: 0 10px;
}
.active{
    text-align: center;
}
.active::after {
  content: '';
  width: 50%;
  height: 1px;
  display: block;
  margin: 0 auto;
  border-bottom: 3px solid orange;
  padding: 1px;
}
.hot-list{
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 20px 27px #0000000d;
    cursor: pointer;
    margin-top: 20px;
    padding:0 10px;
}
.h_title{
    display: flex;
    h2{
        padding-top:6px ;
        padding-left: 5px;
    }
    .tags{
        text-align: center;
        padding-top: 15px;
        flex: 1;
    }
}

    
</style>
