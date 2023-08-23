<template>
  <div class="album">
    <div class="container">
      <div class="main">
        <div class="cover">
          <div class="albumImg">
            <el-image :src="albumDetail.picUrl+'?param=260y260'"></el-image>
          </div>
          <div class="albumInfo">
            <div class="title">
              {{ albumDetail.name }}
              <span>#{{ albumDetail.type }}</span>
            </div>
            <div class="singer">
              歌手：
              <div class="allAuthor" v-for="(author,index) in albumDetail.artists" :key="author.id">
                {{ index==0?author.name:'/'+author.name }}
              </div>
            </div>
            <div class="publishTime">
              发行时间：{{ formartDate(albumDetail.publishTime,'yyyy-MM-dd') }}
            </div>
            <div class="publishCompany">
              发行公司：{{ albumDetail.company }}
            </div>
            <div class="description" v-if="albumDetail.description">
              <h5>
                歌单简介
                <el-popover
                  placement="right-end"
                  :width="600"
                  trigger="hover"
                  :content="albumDetail.description"
                >
                  <template #reference>
                    <el-icon class="desIcon"><ArrowDown /></el-icon>
                  </template>
                </el-popover>
              </h5>
              <span>
                {{ albumDetail.description }}
              </span>
            </div>
          </div>
        </div>
        <div class="song">
          <div class="listHeader">
            <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
            <span class="play-all" @click="playAll"><el-icon size="20px"><VideoPlay /></el-icon> 播放全部</span>
            <span :class="['collect', dynamic.isSub ? 'active' : '']"><el-icon :class="dynamic.isSub?'collectIcon':''" size="20px"><Star /></el-icon> {{ dynamic.isSub ? '已收藏' : '收藏'}}</span>
          </div>
          <div class="songList">
            <Songlist :tableSongList="tableSongList"></SongList>
          </div>
        </div>
        <div class="comments">
          <CommentsList :commentsId="id" :type="type"></CommentsList>
        </div>
      </div>
      <div class="aside">
        <div class="otherAlbum">
          <div class="otherTitle" v-if="albumDetail.artists">
            {{ albumDetail.artists[0].name }}的其他专辑
          </div>
          <div class="otherMain">
            <div class="otherItem" v-for="(item,index) in otherAlbum" :key="item.id" @click="selectOtherAlbum(item.id)">
              <el-image class="otherAlbumImg" :src="item.picUrl+'?param=60y60'"></el-image>
              <div class="otherAlbumInfo">
                <div class="otherAlbumName">
                  {{ item.name }}
                </div>
                <div class="otherAlbumTime">
                  {{ formartDate(item.publishTime,'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue"
import http from "../../api/http";
import Songlist from "../../components/songlist.vue";
import {
  Star,
  VideoPlay,
  ArrowDown
} from '@element-plus/icons-vue'
import { formartDate } from "../../utils/util";
import { useRoute, useRouter } from "vue-router";
import CommentsList from "../../components/CommentsList.vue";
import { usePlayerStore } from "../../stores/player";
const route = useRoute()
const router = useRouter()
const id = route.params.id
// const singerId = ref(0)
const albumDetail = ref([])//专辑信息
const dynamic = ref([])//专辑动态信息，如是否收藏,收藏数,评论数,分享数
const otherAlbum = ref([])//该歌手其他专辑
const tableSongList = ref([])
const total = ref(0)
const type = ref('album')
const playerStore = usePlayerStore()
const lycData = ref('')
const getAllArtists=(artists)=>{
    let allArtist = ' '
    artists.map(item=>{
        allArtist += item.name+' '
    })
    return allArtist
}
const getLyric=async (lycId)=>{
    await http.get(`/lyric?id=${lycId}`)
    .then(res => {
        lycData.value  = res.data.lrc.lyric
    })   
    
}
const addList=async (item)=>{
    await getLyric(item.id)
    const addList={
        artist:getAllArtists(item.ar),
        name:item.name,
        url:`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        cover:item.al.picUrl,
        lrc:lycData.value
    }
    playerStore.SongList = addList
    playerStore.isAdd = true

}
const playAll=()=>{
  playerStore.isPlaying = false
  playerStore.isRevolve = false
  // console.log(tableSongList.value)
  tableSongList.value.map(item=>{
    addList(item)
  })
  playerStore.isPlaying = true
  playerStore.isRevolve = false
}
const selectOtherAlbum=(id)=>{
  router.push({path:`/home/album/${id}`})
}
const getOtherAlbum=(singerId)=>{
  http.get(`/artist/album?id=${singerId}&limit=5`)
  .then(res=>{
    otherAlbum.value = res.data.hotAlbums
  })
}
const getAlbumDetail=()=>{
  http.get(`/album?id=${id}`)
  .then(res=>{
    albumDetail.value = res.data.album
    tableSongList.value = res.data.songs
    total.value = res.data.songs.length
    getOtherAlbum(albumDetail.value.artists[0].id)
  })
}
const getDynamic=()=>{
  http.get(`/album/detail/dynamic?id=${id}`)
  .then(res=>{
    dynamic.value = res.data
  })
}
onMounted(() => {
  getAlbumDetail()
  getDynamic()

})
</script>

<style lang="scss" scoped>
.desIcon{
  cursor: pointer;
}
.album{
  margin-top: 90px;
  .container{
    display: flex;
    .main{
      flex: 72%;
      .cover{
        display: flex;
        .albumImg{
          width: 260px;
          height: 260px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          z-index: 2;
          margin-right: 50px;
        }
        .albumInfo{
          flex: 1;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
          .title{
            font-size: 24px;
            font-weight: bold;
            padding-bottom: 10px;
            span{
              font-size:16px ;
              font-weight: normal;
              color: orange;
            }
          }
          .singer{
            font-size: 14px;
            display: flex;
            color: gray;
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient:inherit;
            .allAuthor{
              
              color: black;

            }
          }
          .publishTime{
            font-size: 14px;
            color: gray;
          }
          .publishCompany{
            font-size: 14px;
            color: gray;
          }
          .description{
            width: 90%;
            padding-top: 25px;
            h5{
              font-size: 14px;
              font-weight: bold;
            }
            span{
              padding-top: 5px;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

        }
      }
      .song{
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 20px 27px #0000000d;
        margin-top: 20px;
        .listHeader{
          display: flex;
          padding: 30px 0 10px 10px;
          h4{
            flex: 1;
            font-size: 20px;
            line-height: 40px;
            color: black;
            font-weight: bold;
          }
          em{
            padding-left: 10px;
            font-size: 12px;
            font-style: normal;
            color: gray;
          }
          span{
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 40px;
            padding: 5px 20px;
            cursor: pointer;
          }
          .play-all{
            color: #fff;
            background: orange;
            margin:0 15px;
          }
          .collect{
            background: #f0f0f0;
            margin-right: 10px;
          }

        }
        // .songList{

        // }
      }
      // .comments{

      // }
    }
    
    .aside{
      flex: 28%;
      margin-left: 20px;
      .otherAlbum{
        padding-left: 20px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 20px 27px #0000000d;
        padding-bottom: 10px;
        padding-top: 10px;
        .otherTitle{
          padding-top: 10px;
          font-size: 16px;
          line-height: 24px;
          font-weight: bold;

        }
        .otherTitle:before{
          content: '';
          display: inline-block;
          width: 5px;
          height: 18px;
          margin: 3px 5px 0 0;
          border-radius: 2px;
          background: orange;
          vertical-align: top;
        }
        .otherMain{
          .otherItem{
            display: flex;
            padding: 12px 0;
            .otherAlbumImg{
              width: 60px;
              height: 60px;
              border-radius: 5px;
              overflow: hidden;
              cursor: pointer;
            }
            .otherAlbumInfo{
              padding-left: 10px;
              .otherAlbumName{
                font-size: 14px;
                font-weight: bold;
                padding-bottom: 12px;
                cursor: pointer;
              }
              .otherAlbumTime{
                font-size: 12px;
                color: gray;

              }
            }
          }
        }
      }
    }
  }
}
</style>
