<template>
  <div class="detail">
    <div class="container">
      <div class="main">
        <div class="cover">
          <div class="coverImg">
            <el-image :src=" playListInfo.coverImgUrl+'?param=250y250'"></el-image>
          </div>
          <div class="coverInfo">
            <div class="coverInfoHeader">
              <div class="coverTitle">
                {{ playListInfo.name }}
              </div>
              <div class="collectAuthor">
                <div class="collectAuthorAvatar">

                </div>
              </div>
            </div>
            <div class="authorAndTags">
              <div class="author" v-if="playListInfo.creator">
                <el-image :src="playListInfo.creator.avatarUrl+'?param=40y40'" class="coverAvatar"></el-image>
                <div class="authorName">
                    {{ playListInfo.creator.nickname }}
                </div>
                <div class="authorDate">
                    {{ formartDate(playListInfo.createTime,'yyyy-MM-dd') }}
                </div>
              </div>
              <div class="tags">
                <div v-for="(tagsItem,tagsIndex) in playListInfo.tags" :key="tagsIndex" class="tagsItem">
                  #{{ tagsItem }}
                </div>
              </div>
            </div>
            <div class="coverInfoDigital">
              <div class="playcount">
                <el-icon class="digitalIcon"><Headset /></el-icon>
                {{ formartNum(playListInfo.playCount) }}次
              </div>
              <div class="collection">
                <el-icon class="digitalIcon"><Star /></el-icon>
                {{ formartNum(playListInfo.subscribedCount) }}
              </div>
              <div class="comments">
                <el-icon class="digitalIcon"><ChatDotRound /></el-icon>
                {{ formartNum(playListInfo.commentCount) }}
              </div>
            </div>
            <div class="coverDesc">
              <h5>
                歌单简介
                <el-popover
                  placement="top-start"
                  :width="450"
                  trigger="hover"
                  :content="playListInfo.description"
                >
                  <template #reference>
                    <el-icon class="desIcon"><ArrowDown /></el-icon>
                  </template>
                </el-popover>

              </h5>
              <span>
                {{ playListInfo.description }}
                
              </span>
              
            </div>
          </div>
        </div>
        <div class="song">
          <div class="listHeader">
            <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
            <span class="play-all" @click="playAll"><el-icon size="20px"><VideoPlay /></el-icon> 播放全部</span>
            <span :class="['collect', playListInfo.subscribed ? 'active' : '']"><el-icon :class="playListInfo.subscribed?'collectIcon':''" size="20px"><Star /></el-icon> {{ playListInfo.subscribed ? '已收藏' : '收藏'}}</span>
          </div>
          <div class="songList">
            <SongList :tableSongList="tableSongList"></SongList>
            <!-- <div class="showAllSongsList" v-if="!isLogin">
              <span @click="loginDialog" v-if="loginStore.isLogin==false">登录后查看全部歌曲</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="aside">
        <div class="relatedPlaylists">
            <h3 class="asideTitle">相关歌单推荐</h3>
            <div class="asideMain relatedMain">
                <div class="relatedItem" v-for="(item,index) in relatedPlayList" :key="item.id" @click="selectRelatedPlayList(item.id)">
                    <div class="relatedPlaylistsImg">
                        <el-image :src="item.coverImgUrl+'?param=60y60'"></el-image>
                    </div>
                    <div class="relatedInfo">
                        <div class="relatedName">
                          {{ item.name }}
                        </div>
                        <div class="relatedAuthor">
                          by. {{ item.creator.nickname }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="playlistComments">
            <h3 class="asideTitle">歌单评论</h3>
            <div class="asideMain commentMain" v-infinite-scroll="loadMore" infinite-scroll-distance="20" :infinite-scroll-disabled="disabled" style="overflow: auto">
                <div class="commentItem" v-for="(item,index) in commentList" ::key="item.commentId">
                    <div class="commentImg">
                        <el-image :src="item.user.avatarUrl+'?param=40y40'"></el-image>
                    </div>
                    <div class="commentInfo">
                        <div class="commentNameAndDate">
                           <div class="commentUsername">
                            {{ item.user.nickname }}
                           </div>
                           <div class="commentDate">
                            {{ formatMsgTime(item.time)}}
                           </div>
                        </div>
                        <div class="comments">
                          {{ item.content }}
                        </div>
                    </div>
                </div>
                <div v-if="!disabled" v-loading="loading" class="loading"></div>
                <div v-else class="noData">
                  没有更多评论了
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { formartDate, formartNum, formatMsgTime } from '../../utils/util'
import http from '../../api/http'
import SongList from '../../components/songlist.vue'
import {
  Headset,
  Star,
  ChatDotRound,
  VideoPlay,
  ArrowDown
} from '@element-plus/icons-vue'
import { usePlayerStore } from '../../stores/player';
import { useLoginStore } from '../../stores/login';
const route = useRoute()
const router = useRouter()
// const isLogin = false//登录才能获取完整歌单
const total = ref(0)
const id = route.params.id
const tableSongList = ref([])
const playListInfo = ref([])
const relatedPlayList = ref([])
const commentList = ref([])
const offset = ref(0)
const disabled = ref(true)
const loading = ref(true)
const playerStore = usePlayerStore()
const lycData = ref('')
const loginStore = useLoginStore()
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

const loadMore=()=>{
  loading.value = true
  offset.value+=10;
  http.get(`/comment/playlist?offset=${offset.value}&limit=10&id=${id}`)
  .then(res=>{
    disabled.value = !res.data.more
    loading.value = false
    const data = res.data.comments
    commentList.value = [...commentList.value,...data]
  })
}
const loginDialog=()=>{//登录框
  loginStore.centerDialogVisible = true

}
const selectRelatedPlayList=(relatedId)=>{
  router.push({path:`/home/playlist/detail/${relatedId}`})

}
const getCommentList=()=>{
  http.get(`/comment/playlist?offset=${offset.value}&limit=10&id=${id}`)
  .then(res=>{
    offset.value = 0
    disabled.value = !res.data.more
    loading.value = false
    
    commentList.value = res.data.comments
  })
}
const getRelatedPlayList=()=>{
  http.get(`/related/playlist?id=${id}`)
  .then(res=>{
    relatedPlayList.value = res.data.playlists
  })
}
const getPlayListInfo=()=>{
  http.get(`/playlist/detail?id=${id}`)
  .then(res=>{
    playListInfo.value = res.data.playlist
    total.value = playListInfo.value.tracks.length
    tableSongList.value = res.data.playlist.tracks

  })
}
 onMounted(()=>{
  
  getPlayListInfo()
  getRelatedPlayList()
  getCommentList()
  
})
</script>

<style lang="scss" scoped>
.noData{
  height: 50px;
  text-align: center;
  padding-top: 10px;
  font-size: 16px;
  color: rgb(188, 187, 187);
}
.loading{
  height: 100px;
}
::-webkit-scrollbar {
     display: none; 
  }
.showAllSongsList{
  text-align: center;
  padding-bottom: 20px;
  span{
    padding: 10px 10px;
    background: orange;
    border-radius: 12px;
    cursor: pointer;
  }
}
.desIcon{
  cursor: pointer;
}
.collectIcon{
  color: red;
}
.detail{
  margin-top: 70px;
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
          width: 550px;
          flex: 1;
          padding: 20px;
          margin-left: 20px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 20px 27px #0000000d;

          .coverInfoHeader{
            display: flex;
            justify-content: space-between;
            align-items: center;
            // line-height: 34px;
            .coverTitle{
              flex: 1;
              font-size: 24px;
              font-weight: bold;
              line-height: 34px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .collectAuthor{
              width: 200px;
              text-align: right;
              // .collectAuthorAvatar{

              // }
            }
           
          }
          .authorAndTags{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .author{
              display: flex;
              .coverAvatar{
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-top: 10px;
              }
              .authorName{
                padding:18px 10px 15px 10px;
                color: black;
              }
              .authorDate{
                font-size: 14px;
                color:gray;
                padding: 20px 0 0 10px;
              }

            }
            .tags{
              display: flex;
              font-size: 12px;
              color: orange;
              .tagsItem{
                margin-right: 5px;
              }
            }
          }
          .coverInfoDigital{
            display: flex;
            font-size: 14px;
            color: gray;
            .digitalIcon{
              font-size: 16px;
            }
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
            padding-top: 25px;
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
      margin-left: 20px;
      // .asideMain{

      // }
      .relatedPlaylists{
        padding: 20px;
        margin-bottom: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        .asideTitle{
          font-size: 16px;
          line-height: 24px;
          font-weight: bold;
        }
        .asideTitle:before {
            content: '';
            display: inline-block;
            width: 5px;
            height: 18px;
            margin: 3px 5px 0 0;
            border-radius: 2px;
            background: orange;
            vertical-align: top;
        }
        .relatedMain{
          .relatedItem{
            display: flex;
            padding: 10px 0;
            .relatedPlaylistsImg{
              width: 60px;
              height: 60px;
              border-radius: 4px;              
              overflow: hidden;
              cursor: pointer;
            }
            .relatedInfo{
              flex: 1;
              padding-left: 10px;
              .relatedName{
                width: 90%;
                font-size: 14px;
                line-height: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
              }
              .relatedAuthor{
                font-size: 12px;
                color: gray;
                margin-top: 20px;
              }
            }
          }
        }

      }

    }
    .playlistComments{
      padding: 20px;
      margin-bottom: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
      .asideTitle{
          font-size: 16px;
          line-height: 24px;
          font-weight: bold;
        }
        .asideTitle:before {
            content: '';
            display: inline-block;
            width: 5px;
            height: 18px;
            margin: 3px 5px 0 0;
            border-radius: 2px;
            background: orange;
            vertical-align: top;
        }
        .commentMain{
          height: 730px;
          .commentItem{
            display: flex;
            padding: 10px 0;
            .commentImg{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              overflow: hidden;

            }
            .commentInfo{
              flex: 1;
              padding-left: 10px;
              .commentNameAndDate{
                display: flex;
                .commentUsername{
                  padding-right: 10px;
                  font-size: 14px;
                  font-weight: bold;
                }
                .commentDate{
                  padding-top: 2px;
                  font-size: 12px;
                  color: gray;

                }
              }
            }
            .comments{
              font-size: 12px;
              color: #666;
              padding: 3px 5px;
              background-color: rgb(234, 231, 231);
              border-radius: 5px;
              margin: 2px 0 0 2px;
            }
          }
        }
    }
  }
}
</style>
