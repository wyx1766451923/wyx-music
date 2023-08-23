<template>
  <div class="myInfo" v-if="loginStore.isLogin">
    <div class="container">
      <div class="header"  v-if="myInfo.profile">
        <div class="left">
          <div class="avatar">
            <el-image :src="myInfo.profile.avatarUrl"></el-image>
          </div>
          <div class="nameInfo">
            <div class="nickname">
              {{ myInfo.profile.nickname }}
            </div>
            <div class="point">
              <span>{{ myInfo.profile.follows }} 关注 </span><span> {{myInfo.profile.followeds}}粉丝 </span><span> Lv.{{ myInfo.level }} </span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">基本信息</div>
          <div class="createTime">
            村龄：{{new Date().getFullYear() - Number(formartDate(myInfo.profile.createTime,'yyyy'))}}年（{{ formartDate(myInfo.profile.createTime,'yyyy年MM月') }}注册）
          </div>
          <div class="gender">
            性别：{{myInfo.profile.gender==1?'男':'女'}}
          </div>
        </div>

      </div>
      <div class="main">
        <div class="createPlaylist">
          <div class="palyListTitle">
            创建的歌单（{{createPlaylist.length}}个）
          </div>
          <PlayList :hotListInfo="createPlaylist"></PlayList>
        </div>
        <div class="collectPlaylist">
          <div class="palyListTitle">
            收藏的歌单（{{collectPlaylist.length}}）
          </div>
          <PlayList :hotListInfo="collectPlaylist"></PlayList>
        </div>
      </div>
    </div>
  </div>
  <div class="noLogin" v-else>
    <el-empty>
      <el-button type="primary" @click="handlelogin">登录</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import {ref,onMounted} from "vue"
import http from "../../api/http";
import { useLoginStore } from "../../stores/login";
import { formartDate } from "../../utils/util";
import PlayList from '../../components/PlayList.vue'
const loginStore = useLoginStore()
const myInfo = ref({})
const createPlaylist = ref([])
const collectPlaylist = ref([])
const handlelogin=()=>{
  loginStore.centerDialogVisible = true
}
const getMyInfo = ()=>{
  http.get(`/user/detail?uid=${loginStore.userId}`)
  .then(res=>{
    myInfo.value = res.data
  })
}
const getPlaylist=()=>{
  http.get(`/user/playlist?uid=${loginStore.userId}`)
  .then(res=>{
    const data = res.data.playlist
    let data1=[]
    let data2 = []
    data.map(item=>{
      if(item.creator.userId == loginStore.userId ){
        data1.push(item)
      }else{
        data2.push(item)
      }

    })
    createPlaylist.value = data1
    collectPlaylist.value = data2
  })
}
onMounted(()=>{
  getMyInfo()
  getPlaylist()
})
</script>

<style lang="scss" scoped>
.myInfo{
 
  .container{
    .header{
      display: flex;
      
      .left{
        flex: 70%;
        background: white;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 10%);
        margin-right: 20px;
        display: flex;
        background: linear-gradient(to right,  #ffffff 30%,orange 100%);
        .avatar{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;

        }
        .nameInfo{
          padding: 25px 0 0 30px;
          .nickname{
            font-size: 16px;
            padding-bottom: 10px;
          }
          .point{
            font-size: 14px;
            span{
              padding: 0 8px;
            }
          }
        }

      }
      .right{
        flex: 30%;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 10%);
        margin: 0 20px 0 10px;
        .title{
          font-size: 20px;
          font-weight: bold;
        }
        .createTime{
          padding-top: 20px;
          font-size: 16px;

        }
        .gender{
          padding-top: 5px;
          font-size: 16px;

        }
      }
      

    }
    .main{
      margin-top: 20px;
      .palyListTitle{
        font-size: 16px;
        font-weight: bold;
        padding-top: 5px;
      }
      .createPlaylist{
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 10%);
        margin: 10px 0 20px 0;
      }
      .collectPlaylist{
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 10%);
      }
    }
  }
}
</style>
