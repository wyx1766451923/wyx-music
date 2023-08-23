<template>
  <div class="comments">
    <div class="header">
        <h2>评论 <span>共{{ total }}条评论</span></h2>
    </div>
    <div class="publishComments">
        <div class="commentsTextarea">
            <el-input
                :show-word-limit="true"
                v-model="textarea"
                :rows="4"
                type="textarea"
                placeholder="请发表精彩的评论吧~"
                maxlength="140"
                resize="none"
            />
        </div>
        <div class="publishFooter">
            <el-button type="primary" color="orange" @click="subComment">评论</el-button>
        </div>
    </div>
    <div class="userComments">
        <div v-if="total>0">
            <!-- 有评论 -->
            <div class="commentItem" v-for="(item,index) in comments" :key="item.user.userId+index">
                <div class="userAvatar">
                    <el-image :src="item.user.avatarUrl+'?param=30y30'"></el-image>
                </div>
                <div class="commentInfo">
                    <div class="username">
                        {{ item.user.nickname }}
                    </div>
                    <div class="commentContent">
                        {{ item.content }}
                    </div>
                    <!-- 评论回复 v-if="item.beReplied.length" -->
                    <div class="commentReply"  v-for="replyItem in item.beReplied" :key="replyItem.beRepliedCommentId">
                        {{ replyItem.user.nickname }}:{{ replyItem.content }}
                    </div>
                    <div class="commentFooter">
                        <div class="publishTime">
                            {{ formatMsgTime(item.time) }}
                        </div>
                        <div class="replyAndCount">
                            <div class="likedcount">({{ item.likedCount }})</div>
                            <el-icon class="replyIcon"><ChatDotSquare /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noComments" v-else>
            当前没有评论哦，快来发送评论吧~
        </div>
        <div v-if="!hasMore" class="hasMore">
            没有更多评论了哦，快来发送评论吧~
        </div>
    </div>
    <div class="pagination">
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"     
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
        />
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import {
    ChatDotSquare
} from '@element-plus/icons-vue'
import http from "../api/http";
import { formatMsgTime } from "../utils/util";
const textarea = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)
const comments = ref([])
const offset = ref(0)
const hasMore = ref(true)
const props = defineProps({
    commentsId:String,
    type:String

})//id为获取评论id，type为获取平路那类型，如歌曲评论，mv评论等等
const handleCurrentChange=(val)=>{

    console.log(val)
    currentPage.value = val
    offset.value = (currentPage.value-1) * 10
    // getAlbumComments()
    selectType()

}
const subComment=()=>{
    console.log("发布评论")
}
const selectType=()=>{
    switch(props.type){
        case 'album':getAlbumComments();break;//专辑评论
        case 'mv':getMvComments();break;
        case 'song':getSongComments();break;
    }
}
const getSongComments=()=>{
    http.get(`/comment/music?limit=10&offset=${offset.value}&id=${props.commentsId}`)
    .then(res=>{
        comments.value = res.data.comments
        total.value = res.data.total
        hasMore.value = res.data.more
    })
}
const getMvComments=()=>{
    http.get(`/comment/mv?limit=10&offset=${offset.value}&id=${props.commentsId}`)
    .then(res=>{
        comments.value = res.data.comments
        total.value = res.data.total
        hasMore.value = res.data.more
    })
}
const getAlbumComments=()=>{//专辑评论
    http.get(`/comment/album?limit=10&offset=${offset.value}&id=${props.commentsId}`)
    .then(res=>{
        comments.value = res.data.comments
        total.value = res.data.total
        hasMore.value = res.data.more
    })
}
onMounted(()=>{
    selectType()
})
</script>

<style lang="scss" scoped>
.noComments{
    height: 100px;
    text-align: center;
    color: gray;
}
.hasMore{
    height: 60px;
    text-align: center;
    color: gray;
    padding-top: 20px;
}
.comments{
    margin-top: 30px;
    .header{
        h2{
            font-size: 24px;
            font-weight: bold;
            span{
                font-size: 14px;
                padding-left:10px;
            }
        }
    }
    .publishComments{
        // .commentsTextarea{

        // }
        .publishFooter{
            padding-top: 15px;
        }
    }
    .userComments{
        margin-top: 20px;
        padding-left: 10px;
        .commentItem{
            display: flex;
            background: white;
            margin-bottom:20px ;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
            padding: 20px 0 20px 20px;
            .userAvatar{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;
                vertical-align: top;
                flex-shrink: 0;

            }
            .commentInfo{
                flex: 1;
                padding-left: 20px;
                .username{
                    font-size: 14px;
                    color: gray;
                }
                .commentContent{
                    padding-top: 8px;

                }
                .commentReply{
                    background: rgb(237, 236, 236);
                    padding: 10px;
                    margin-right: 15px;
                    border-radius: 12px;

                }
                .commentFooter{
                    display: flex;
                    justify-content: space-between;
                    padding-top: 10px;
                    .publishTime{
                        font-size: 14px;
                        color: gray;

                    }
                    .replyAndCount{
                        display: flex;
                        padding-right: 20px;
                        color: gray;
                        .likedcount{
                            padding-right: 20px;
                            cursor: pointer;

                        }
                        .replyIcon{
                            font-size: 20px;
                            padding: 5px 0 0 0;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
}
</style>
