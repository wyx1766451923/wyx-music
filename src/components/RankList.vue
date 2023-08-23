<template>
  <div class="wrapper">
    <div v-for="item in topList" :key="item.id" class="topList_item">
        <div class="topTitle">
            <div class="topListName">{{ item.name }}</div>
            <h5 class="topListUpdate">
                最近更新：{{ formartDate(item.updateTime, 'MM月dd日') }}<span>（{{item.updateFrequency}}）</span>
            </h5>
        </div>
        <div class="toplist_wrapper">
            <div v-for="(songItem,index) in songList[item.id] " :key="songItem.id" class="songitem">
                <div class="songImg">
                    <el-image :src="songItem.al.picUrl + '?param=120y120'"></el-image>
                </div>
                <div class="songInfo">
                    <div class="song_title" @click="selctSong(songItem.id)">
                        {{ songItem.name }}
                    </div>
                    <div class="song_author">
                        <div v-for="(author,authorIndex) in songItem.ar" :key="authorIndex" class="song_authot_item">
                            {{ authorIndex!=0?'/' + author.name : author.name }}
                        </div>
                    </div>
                </div>
                <div class="songoperate">
                    <el-icon title="添加到列表" @click="addList(songItem)" class="addlistIcon"><List /></el-icon>
                    <el-icon title="添加到收藏" class="collectIcon"><FolderChecked /></el-icon>
                </div>                
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { formartDate } from '../utils/util'
import {ref, reactive, onMounted } from 'vue'
import http from '../api/http'
import {
    List,
    FolderChecked
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { usePlayerStore } from '../stores/player';
const router = useRouter()
const topList = ref([])
const songList = ref([])
const playerStore = usePlayerStore()
const lycData = ref('')
//添加播放列表
const getLyric=async (id)=>{
    await http.get(`/lyric?id=${id}`)
    .then(res => {
        lycData.value = res.data.lrc.lyric
        
    })
}
const getAllArtists = (artists)=>{
    let allArtist = ' '
    artists.map(item=>{
        allArtist += item.name+' '
    })
    return allArtist
}
const addList = async (item)=>{
    await getLyric(item.id)
    const addSongList = reactive({
        artist:getAllArtists(item.ar),
        name:item.name,
        url:`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        cover:item.al.picUrl,
        lrc:lycData.value
    })
    playerStore.SongList = addSongList
    playerStore.isAdd = true
    ElMessage({
        message: '添加成功',
        type: 'success',
    })
}
const selctSong=(id)=>{
    // playerStore.isDestroy = true
    // playerStore.isPlaying = false
    // playerStore.isRevolve == false
    router.push({path:`/home/song/${id}`})

}
const getTopList = () =>{
    http.get('/toplist')
    .then(res=>{
        topList.value = res.data.list.slice(0,4)
        // console.log(res.data.list.slice(0,4))
        getSongList()
    })
   
    
}
const getSongList = () =>{
    topList.value.forEach(async item=>{
        http.get(`/playlist/detail?id=${item.id}`)
        .then(res=>{
            songList.value[item.id] = res.data.playlist.tracks.slice(0,6)
        })
    })
    // console.log(songList)
}
onMounted(()=>{
    getTopList()
})
</script>

<style lang="scss" scoped>
.collectIcon :hover{
    color: orange;
}
.addlistIcon:hover{
    color: orange;
}
.el-icon{
    font-size: 16px;
}
.wrapper {
    display: flex;
    justify-content: space-between;
    margin: 20px -10px;
    .topList_item{
        position: relative;
        flex: 1;
        margin: 0 10px;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        background: #fff;
        .topTitle{
            .topListName{
                font-size: 22px;
                line-height: 30px;
                font-weight: 700;
                padding-bottom: 10px;
            }
            .topListUpdate{
                line-height: 18px;
                font-weight: 300;
                color: gray;
            }
        }
        .toplist_wrapper{
            padding-top: 30px;
            .songitem:hover{
                cursor: pointer;
                .song_title{
                    transform: translate(15px, 0);
                    transition: all .3s ease-in;
                }
                .songoperate{
                    width: 80px;
                    transition: all .3s ease-in;
                }
            }
            .songitem{
                // position: relative;
                display: flex;
                padding-bottom:20px ;
                .songImg{
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    margin-right: 20px;
                    box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
                    overflow: hidden;
                }
                .songInfo{
                    flex: 1;
                    .song_title{
                        line-height: 24px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding-bottom: 5px;
                        font-size: 14px;
                        // transition: all .3s ease-in;
                    }

                    .song_author{
                        height: 20px;
                        width: 150px;
                        font-size: 12px;
                        display: flex;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;         
                    }
                }
                .songoperate{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 0;
                    line-height: 48px;
                    transition: all .3s ease-in;
                    overflow: hidden;
                }
                
            }

        }
    }
}
</style>
