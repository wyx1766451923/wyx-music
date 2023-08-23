<template>
  <div class="container">
    <div class="main">
        <div class="song">
            <div class="songLeft">
                <div class="songInfo">
                    <div class="songHeader">
                        <div class="songName">
                            {{ songDetail.name }}
                        </div>
                        <div class="songArtists">
                            <div class="allArtists" v-for="(artist,index) in songDetail.ar" :key="artist.id">
                                {{ index==0?artist.name:'/'+ artist.name}}
                            </div>
                        </div>
                        <div class="songAlbum" v-if="songDetail.al">
                            专辑：<span>{{ songDetail.al.name }}</span>
                        </div>
                        <div class="publishTime" v-if="songDetail.publishTime!=0">
                            发行时间：<span>{{ formartDate(songDetail.publishTime,'yyyy年MM月dd日') }}</span>
                        </div>
                    </div>
                    <div class="songFooter">
                        <span @click.stop="playing()">
                            <el-icon v-if="playerStore.isRevolve==false"><VideoPlay /></el-icon>
                            <el-icon v-if="playerStore.isRevolve==true"><VideoPause /></el-icon>
                            {{playerStore.isRevolve == true?'正在播放':'立即播放'}}
                        </span>
                        <span><el-icon><Star /></el-icon>收藏</span>
                        <span @click="scrollToComment"><el-icon><ChatDotSquare /></el-icon>评论</span>
                    </div>
                </div>
                <div class="relatedSong">
                    <h3 class="title">相似歌曲</h3>
                    <div class="relatedMain">
                        <div class="relatedItem" v-for="(item,index) in relatedSongs" :key="item.id">
                            <div class="relatedSongInfo">
                                <div class="relatedSongName" @click="selectRelatedSong(item.id)">
                                    {{ item.name }}
                                </div>
                                <div class="relatedSongArtist">
                                    <div class="relatedAllArtists" v-for="(artist,artistIndex) in item.artists">
                                        {{ artistIndex==0?artist.name:'/'+artist.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="relatedSongOperate">
                                <div class="onPlay" @click="playRelatedSong(item)">
                                    <el-icon v-if="true" class="relatedPlay"><VideoPlay /></el-icon>
                                    <el-icon v-else><VideoPause /></el-icon>
                                </div>
                                <el-icon class="listIcon" @click="addRelatedSong(item)"><List /></el-icon>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="songLyric">
                <h5>歌词</h5>
                <Lyric :lyricId="id" :currentTime="currentTime"></Lyric>
            </div>
        </div>
        <div class="songComments" ref="jumpComments">
            <CommentsList :commentsId="id" :type="type"></CommentsList>
        </div>
    </div>
    <div class="aside">
        <div class="Player">
            <div class="PlayerImg" :class="playerStore.isRevolve == true?'active':''" @click.stop="playing()">
                <img src="/img/stylus.png" alt="播放" class="stylus">
                <el-image :src="songDetail.al.picUrl+'?param=190y190'" v-if="songDetail.al" class="alImg"></el-image>
            </div>
        </div>
        <div class="includePlaylist">
            <h3 class="title">包含这首歌的歌单</h3>
            <div class="playlistMain">
                <div class="playlistItem" v-for="(item,index) in relatedPlaylist" :key="item.id" @click="selectIncludePlaylist(item.id)">
                    <div class="playlistImg">
                        <el-image :src="item.coverImgUrl+'?param=60y60'"></el-image>
                    </div>
                    <div class="playlistInfo">
                        <div class="playlistName">
                            {{ item.name }}
                        </div>
                        <div class="playlistAuthor">
                            By.{{ item.creator.nickname }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <!-- <Myaplayer :audio="audio"></Myaplayer> -->
</template>

<script setup>
import {ref, onMounted, reactive, watch, inject, nextTick} from "vue"
import { useRoute, useRouter } from "vue-router";
import http from "../../api/http";
import { formartDate } from "../../utils/util";
import {
    VideoPlay,
    Star,
    ChatDotSquare,
    VideoPause,
    List
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Lyric from "../../components/Lyric.vue";
import CommentsList from "../../components/CommentsList.vue";
import { usePlayerStore } from "../../stores/player";
const currentTime = ref(0)
const route = useRoute()
const router = useRouter()
const id = route.params.id
const songDetail = ref([])
const relatedSongs = ref([])
const relatedPlaylist = ref([])
const type = ref('song')
var timer = ' '
const lycData = ref('')
const jumpComments=ref(null)
const playerStore = usePlayerStore()
const audio = reactive({
    artist:' ',
    name:'',
    url:`https://music.163.com/song/media/outer/url?id=${id}.mp3`,
    cover:'',
    lrc:''

})

const playRelatedSong=(item)=>{
    // playerStore.isPlaying=false
    // playerStore.isDestroy=true
    playerStore.isRevolve = false
    router.push({path:`/home/song/${item.id}`})

}
const getRelatedAllArtists=(artists)=>{
    let allArtist = ' '
    artists.map(item=>{
        allArtist += item.name+' '
    })
    return allArtist
}
const getRelatedLyric=async (lycId)=>{
    await http.get(`/lyric?id=${lycId}`)
    .then(res => {
        lycData.value  = res.data.lrc.lyric
    })   
    
}
const addRelatedSong=async (item)=>{

    await getRelatedLyric(item.id)
    const addListAudio={
        artist:getRelatedAllArtists(item.artists),
        name:item.name,
        url:`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        cover:item.album.blurPicUrl,
        lrc:lycData.value
    }
    // handlePlay.value.addList(addListAudio)
    playerStore.SongList = addListAudio
    playerStore.isAdd = true
    ElMessage({
        message: '添加成功',
        type: 'success',
    })
}
const scrollToComment=()=>{
    jumpComments.value.scrollIntoView(true)
}


const playing=()=>{
    if(playerStore.isCommonUrl == false){//当前播放歌曲是否无歌曲信息页面相同，若不是
        if(playerStore.audio == audio){//是否是跳转到列表歌曲其他曲(此时store存储的页面歌曲信息，所以store存储信息与页面信息相同)，则进行状态该表，使此时页面信息重新载入播放器并播放
            setTimeout(()=>{
                playerStore.isUpdateAudio = true

            },0)
        }else{//若是一个新的歌曲，则将新歌曲载入播放器播放
            playerStore.audio = audio
        }
        setTimeout(()=>{//保持播放和歌曲相应详情页面播放状态保持一致，这里是停止上一曲播放，

            playerStore.isPlaying = false
            playerStore.isRevolve = false

            },0)

        setTimeout(()=>{//这里开始这一曲播放
            playerStore.isPlaying = true
            playerStore.isRevolve = true

        },10)
    }else{//当前播放歌曲，与信息页面相同，点击时只需该表播放状态为暂停或播放，不需要载入新数据
        playerStore.isPlaying =  !playerStore.isPlaying
        playerStore.isRevolve = !playerStore.isRevolve        
    }
}
watch(()=>playerStore.isPlaying,(newVal,oldVal)=>{
    if(newVal==true){
        timer = window.setInterval(() => {
            currentTime.value = playerStore.currentTime
        }, 100);
    }else{
        window.clearInterval(timer)
    }
})
const selectIncludePlaylist=(includePlaylistId)=>{
    router.push({path:`/home/playlist/detail/${includePlaylistId}`})
}
const selectRelatedSong=(relatedId)=>{
    router.push({path:`/home/song/${relatedId}`})
}
const getRelatedPlaylist=()=>{
    http.get(`/simi/playlist?id=${id}`)
    .then(res=>{
        relatedPlaylist.value = res.data.playlists
    })
}
const getRelatedSongs = ()=>{
    http.get(`/simi/song?id=${id}`)
    .then(res=>{
        relatedSongs.value = res.data.songs
    })
}
const getLyrics=()=>{
    http.get(`/lyric?id=${id}`)
    .then(res => {
        audio.lrc = res.data.lrc.lyric
    })
}
const getsongDetail = ()=>{
    http.get(`/song/detail?ids=${id}`)
    .then(res=>{
        songDetail.value = res.data.songs[0]
        songDetail.value.ar.map(item=>{
            audio.artist += item.name+' '  
        })
        audio.name = songDetail.value.name
        audio.cover = songDetail.value.al.picUrl
    })
}
const sendSongInfo=async()=>{
    await getsongDetail()
    await getRelatedSongs()
    await getRelatedPlaylist()
    await getLyrics()
    // playerStore.audio = audio


}
onMounted(()=>{
    
    sendSongInfo()
    

})

</script>

<style lang="scss" scoped>

.title{
    font-size: 16px;
    font-weight: bold;
}
.title:before{
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    margin: 3px 5px 0 0;
    border-radius: 2px;
    background: orange;
    vertical-align: top;
}
.container{
    margin-top: 65px;
    display: flex;
    .main{
        flex: 70%;
        .song{
            display: flex;
            .songLeft{
                flex: 1;
                .songInfo{
                    padding: 20px 20px;
                    background-color: white;
                    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                    border-radius: 10px;
                    .songHeader{
                        width: 100%;
                        .songName{
                            width: 100%;
                            overflow : hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                            font-size: 30px;
                            font-weight: bold;
                        }
                        .songArtists{
                            padding-top: 10px;
                            display: flex;
                            font-size: 18px;
                            color: gray;
                            font-weight: normal;
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            // .allArtists{

                            // }
                        }
                        .songAlbum{
                            padding-top: 10px;
                            font-size: 14px;
                            color: gray;
                            span{
                                color: black;
                            }
                        }
                        .publishTime{
                            font-size: 14px;
                            color: gray;
                            span{
                                color: black;
                            }
                        }
                    }
                    .songFooter{
                        padding-top: 80px;
                        padding-left: 20px;
                        
                        span{
                            display: inline-block;
                            margin-right: 20px;
                            padding: 6px 10px;
                            border-radius: 16px;
                            background: rgb(234, 232, 232);
                            cursor: pointer;
                            .el-icon{
                                position: relative;
                                top: 4px;
                                font-size: 18px;
                            }
                        }
                        span:first-of-type{
                            background: orange;
                            color: white;
                        }
                    }
                }
                .relatedSong{
                    margin-top: 20px;
                    padding: 20px 20px;
                    background-color: white;
                    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                    border-radius: 10px;
                    .relatedMain{
                        padding-top: 5px;
                        .relatedItem:last-of-type{
                            border: none;
                        }
                        .relatedItem{
                            padding: 5px 0;
                            border-bottom: 1px solid rgb(241, 241, 241);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .relatedSongInfo{
                                font-size: 12px;
                                .relatedSongName{
                                    color: black;
                                    cursor: pointer;
                                }
                                .relatedSongArtist{
                                    display: flex;
                                    color: gray;
                                    padding-top: 2px;
                                    width: 100%;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    // text-overflow: ellipsis;
                                    // .relatedAllArtists{

                                    // }
                                }
                            }
                            .relatedSongOperate{
                                display: flex;
                                font-size: 18px;
                                color:gray;

                                .onPlay{
                                    position: relative;
                                    top: -2px;
                                    margin-right: 12px;
                                    cursor: pointer;
                                    .relatedPlay:hover{
                                        color: orange;
                                    }
                                }
                                .listIcon{
                                    cursor: pointer;
                                }
                                .listIcon:hover{
                                    color: orange;
                                }
                            }
                        }
                    }
                }
            }
            .songLyric{
                h5{
                    font-size: 14px;
                    text-align: center;
                    font-weight: bold;
                    padding-bottom: 5px;
                }
                flex: 1;
                padding: 20px;
                background-color: white;
                box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                border-radius: 10px;
                margin: 0 25px;
            }
        }
        .songComments{
            margin-right: 20px;
        }
    }
    .aside{
        flex: 30%;
        .Player{
            padding: 20px;
            background-color: white;
            box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
            border-radius: 10px;
            .active{
                .stylus{
                    transform: rotateZ(0deg);
                }
                .alImg{
                    animation-play-state: running;
                }
            }
            .PlayerImg{
                // flex-shrink: 0;
                position: relative;

                width: 260px;
                height: 260px;
                margin-left: 30px;
                background: url('/img/disc.png') no-repeat;
                background-size: contain;
                cursor: pointer;
            }
            .stylus{
                position:absolute;
                top: 0;
                right: 0;
                transition: all .3s ;
                transform-origin: 25px 6px;
                transform: rotateZ(-25deg);
            }
            .alImg{
                width: 190px;
                height: 190px;
                border-radius: 50%;
                position: relative;
                left: 35px;
                top: 35px;
                animation: playSong 10s linear infinite;
                animation-play-state: paused;
            }
        }
        .includePlaylist{
            margin-top: 20px;
            padding: 20px;
            background-color: white;
            box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
            border-radius: 10px;
            .playlistMain{
                padding: 20px 0 0 0;
                margin-bottom: -9px;
                .playlistItem{
                    display: flex;
                    padding-bottom: 15px;
                    .playlistImg{
                        width: 60px;
                        height: 60px;
                        border-radius: 10px;
                        overflow: hidden;
                        cursor: pointer;
                    }
                    .playlistInfo{
                        font-size: 14px;
                        padding-left: 10px;
                        .playlistName{
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            padding-bottom: 15px;
                            cursor: pointer;
                        }
                        .playlistAuthor{
                            font-size: 12px;
                            color: gray;

                        }
                    }
                }
            }
        }
    }
}
@keyframes playSong{
    0%{
        transform: rotate(10deg)
    }
    100%{
        transform: rotate(370deg)
    }
}
</style>
