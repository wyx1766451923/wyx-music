<template>
  <div class="rank">
    <div class="container">
      <div class="main">
        <div class="cover">
          <div class="coverImg">
            <el-image :src="rankList.coverImgUrl +'?param=250y250'"></el-image>
          </div>
          <div class="coverInfo">
            <div class="coverInfoHeader">
              {{ rankList.name }} <span>({{ formartDate(rankList.updateTime,'MM月dd日') }}更新)</span>
            </div>
            <div class="coverInfoAuthor" v-if="rankList.creator">
              <el-image :src="rankList.creator.avatarUrl+'?param=40y40'" class="coverAvatar"></el-image>
              <div class="authorName">
                {{ rankList.creator.nickname }}
              </div>
              <div class="authorDate">
                {{ formartDate(rankList.createTime,'yyyy-MM-dd') }}
              </div>
            </div>
            <div class="coverInfoDigital">
              <div class="playcount">
                <el-icon><Headset /></el-icon>
                {{ formartNum(rankList.playCount) }}次
              </div>
              <div class="collection">
                <el-icon><Star /></el-icon>
                {{ formartNum(rankList.subscribedCount) }}
              </div>
              <div class="comments">
                <el-icon><ChatDotRound /></el-icon>
                {{ formartNum(rankList.commentCount) }}
              </div>
            </div>
            <div class="coverDesc">
              <h5>歌单简介</h5>
              <span>{{ rankList.description }}</span>
            </div>
          </div>
        </div>
        <div class="song">
          <div class="listHeader">
            <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
            <span class="play-all" @click="playAll()"><el-icon size="20px"><VideoPlay /></el-icon> 播放全部</span>
            <span :class="['collect', rankList.subscribed ? 'active' : '']"><el-icon :class="rankList.subscribed?'collectIcon':''" size="20px"><Star /></el-icon> {{ rankList.subscribed ? '已收藏' : '收藏'}}</span>
          </div>
          <div class="songList">
            <SongList :tableSongList="tableSongList"></SongList>
          </div>
        </div>
      </div>
      <div class="aside">
        <div class="asideMenu">
          <div v-for="(item,index) in rankType" :key="index" :class="item.type == menuType?'rankActive':''" class="ranktype" @click="handleSelectMenu(item.type)" >
            {{ item.name }}
          </div>
        </div>
        <div class="type">
          <div class="typeitem" v-for="(item) in selectType" :key="item.id"  :class="item.id==typeItemId?'typeActive':''" @click="handleSelectItem(item)">
            <div class="typeInfo">
              <div class="typeTitle">
                {{ item.name }}
              </div>
              <div class="typeTime">
                {{ item.updateFrequency }}
              </div>
            </div>
            <div class="typeImg">
              <el-image :src="item.coverImgUrl+'?param=50y50'"></el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import http from '../../api/http';
import { formartDate, formartNum } from '../../utils/util';
import SongList from '../../components/SongList.vue'
import {
  Headset,
  Star,
  ChatDotRound,
  VideoPlay
} from '@element-plus/icons-vue'
import { RANK_TYPE } from '../../utils/songs';
import { usePlayerStore } from '../../stores/player';
const rankList = ref([])
const total = ref(0)
const rankType = RANK_TYPE
const menuType = ref('Top')
const AllList = ref([])
const TopList = ref([])
const CloudSongList = ref([])
const OtherList = ref([])
const selectType = ref([])
const typeItemId = ref(19723756)
const tableSongList = ref([])//用于父子传值
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
const handleSelectItem = (item) =>{
  // console.log(item)
  typeItemId.value = item.id
  getRankList()
}
const handleSelectMenu = (type) =>{
  menuType.value = type
  
  if(type=='Top'){
    selectType.value = TopList.value
  }else if(type=='CloudSong'){
    selectType.value = CloudSongList.value
  }else{
    selectType.value = OtherList.value
  }
  typeItemId.value = selectType.value[0].id
  getRankList()
}
const getAllList = () =>{
  http.get('/toplist/detail')
  .then(res=>{
    AllList.value = res.data.list
    TopList.value = AllList.value.filter(item=>{
      return item.ToplistType
    })
    CloudSongList.value = AllList.value.filter(item=>{
      return !item.ToplistType && item.name.indexOf('云音乐') >= 0
    })
    OtherList.value = AllList.value.filter(item=>{
      return !item.ToplistType && item.name.indexOf('云音乐') < 0
    })
    selectType.value = TopList.value
  })


}
const getRankList=()=>{
  http.get(`/playlist/detail?id=${typeItemId.value}`)
  .then(res=>{
    rankList.value = res.data.playlist
    total.value = rankList.value.tracks.length
    tableSongList.value = res.data.playlist.tracks
  })
}
onMounted(() => {
  getRankList()
  getAllList()
})
</script>

<style lang="scss" scoped>
.active{
  background: orange;
}
.collectIcon{
  color: red;
}
.rank{
  margin-top: 40px;
  .container{
    display: flex;
    padding: 40px 0 0 0;
    .main{
      flex: 1;
      padding-bottom: 45px;
      .cover{
        display: flex;
        .coverImg{
          width: 250px;
          height: 250px;
          border-radius:10px ;
          overflow: hidden;
          box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
          // flex-shrink: 0;
        }
        .coverInfo{
          flex: 1;
          padding: 20px;
          margin-left: 20px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 20px 27px #0000000d;
          .coverInfoHeader{
            font-size: 24px;
            font-weight: bold;
            // line-height: 34px;
            span{
              font-size: 14px;
              font-weight: normal;
              color: gray;
              padding-left: 5px;
            }
          }
          .coverInfoAuthor{
            display: flex;
            
            align-items: center;
            .coverAvatar{
              width: 32px;
              height: 32px;
              border-radius: 50%;
            }
            .authorName{
              padding:15px 10px;
              color: black;
              
            }
            .authorDate{
              font-size: 14px;
              color:gray
            }
          }
          .coverInfoDigital{
            display: flex;
            font-size: 14px;
            color: gray;
            .playcount{
              padding-left: 5px;
            }
            .collection{
              padding: 0 15px;
            }
            // .comments{

            // }
          }
          .coverDesc{
            padding-top: 20px;
            padding-left: 5px;
            h5{
              padding-bottom: 5px;
              font-size: 14px;
              color: black;
              font-weight: bold;
            }
            span{
              font-size: 14px;
              color: gray;
              line-height: 24px;
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
    }
    .aside{
      width: 450px;
      padding-bottom: 25px;
      flex-shrink: 0;
      padding-left: 20px;
      .asideMenu{
        display: flex;
        margin: 0 -10px 20px;
        .ranktype{
          flex: 1;
          padding: 20px;
          margin: 0 10px;
          text-align: center;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 27px #0000000d;
          cursor: pointer;
          overflow: hidden;
          transition: color .2s ease-in;
        }
        .rankActive{
          background: orange;
          color: white;
          transition: color .2s ease-in;

        }
      }
      .type{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 -10px;
        .typeitem{
          display: flex;
          justify-content: space-between;
          width: calc(50% - 20px);
          padding: 10px 10px;
          margin: 0 10px 10px 10px;
          border-radius: 12px;
          box-shadow: 0 20px 27px #0000000d;
          cursor: pointer;
          opacity: .8;
          background: white;
          .typeInfo{
            flex: 1;
            width: calc(100% - 50px);
            .typeTitle{
              display: inline-block;
              width: 100%;
              font-size: 14px;
              color: black;
              font-weight: bold;
              line-height: 30px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .typeTime{
              font-size: 12px;
              line-height: 12px;
              color: gray;
            }
          }

          .typeImg{
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            border-radius:10px ;
            overflow: hidden;
            box-shadow: 0 4px 6px rgb(104, 103, 103);
          }
        }
        .typeActive{
          opacity: 1;
          background: linear-gradient(135deg,  #ffffff 20%,#ffb08e 100%);
        }
      }
    }
  }
}
</style>
