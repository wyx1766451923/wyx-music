<template>
  <div class="mvDetail">
    <div class="container">
        <div class="main">
            <div class="mvHeader">
                <div class="mvName">
                    {{ mvDetail.name }}
                </div>
                <div class="mvArtists">
                    <div class="allArtists" v-for="(item,index) in mvDetail.artists" :key="item.id">
                        {{ index==0?item.name:'/'+item.name }}
                    </div>
                </div>
            </div>
            <div class="videoMain">
                <!-- vue3视频组件vue3-video-play -->
                <videoPlay 
                    width="100%" 
                    height="100%"
                    :autoPlay="false"
                    :poster="videoOptions.poster"
                    :src="videoOptions.src" 
                    />
                    
            </div>
            <div class="mvComment">
                <CommentsList :commentsId="id" :type="type"></CommentsList>
            </div>
        </div>
        <div class="aside">
            <div class="mvInfo">
                <h3 class="title">
                    MV简介
                    <el-popover
                        placement="left-start"
                        :width="450"
                        trigger="hover"
                        :content="mvDetail.desc"
                        v-if="mvDetail.desc"
                        >
                        <template #reference>
                            <el-icon class="desIcon"><ArrowDown /></el-icon>
                        </template>
                    </el-popover>
                </h3>
                <div class="mvPublishTime">
                    发布时间：{{ mvDetail.publishTime }}
                </div>
                <div class="mvPlayCount">
                    播放量：{{formartNum(mvDetail.playCount)}}
                </div>
                <div class="mvDesc">
                    {{ mvDetail.desc?mvDetail.desc:'暂无简介' }}
                    
                </div>
            </div>
            <div class="relatedMv">
                <div class="title relatedTitle">相似MV</div>
                <div class="relatedMain">
                    <div class="mvItem" v-for="(item,index) in relatedMv" :key="item.id" @click="selectRelatedMv(item.id)">
                        <div class="mvImg">
                            <el-icon class="mv_el-icon">
                                <VideoPlay />
                            </el-icon>
                            <el-image :src="item.cover" />
                        </div>
                        <div class="mvInfo">
                            <div class="mvName">{{ item.name }}</div>
                            <div class="mvAuthor">{{ item.artistName }}</div>
                            <div class="mvPlaycount">
                                <el-icon>
                                    <VideoCamera />
                                </el-icon>
                                {{ formartNum(item.playCount) }}
                            </div>
                            <!-- <div class="mvPublishTime"></div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted } from 'vue';

import videoPlay from 'vue3-video-play' // 引入组件 
import 'vue3-video-play/dist/style.css' // 引入css 
import {
    VideoPlay,
    VideoCamera,
    ArrowDown
} from '@element-plus/icons-vue'
import http from '../../api/http';
import CommentsList from '../../components/CommentsList.vue';
import { formartNum } from '../../utils/util';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const id = route.params.id
const type = ref('mv')
const mvDetail = ref([])
const relatedMv = ref([])
const selectRelatedMv=(relatedId)=>{
    router.push({path:`/home/musicVideo/detail/${relatedId}`})
}
const videoOptions = reactive({
  src: '', //视频源
  poster: '', //封面
})

const getRelatedMv=()=>{
    http.get(`/simi/mv?mvid=${id}`)
    .then(res=>{
        relatedMv.value = res.data.mvs
    })
}
const getMvDetail=()=>{
    http.get(`/mv/detail?mvid=${id}`)
    .then(res=>{
        mvDetail.value = res.data.data
        videoOptions.poster=res.data.cover
    })
}
const getMvUrl=()=>{
    http.get(`/mv/url?id=${id}`)
    .then(res=>{
        videoOptions.src=res.data.data.url
    })
}
onMounted(() => {
    getMvUrl()
    getMvDetail()
    getRelatedMv()
})
</script>

<style lang="scss" scoped>
.mvDetail{
    margin-top: 100px;
    .container{
        display: flex;
        .main{
            flex: 1;
            .mvHeader{
                display: flex;
                .mvName{
                    font-size: 24px;
                    

                }
                .mvArtists{
                    font-size: 14px;
                    display: flex;
                    padding: 10px 0 0 20px  ;
                }
            }
            .videoMain{
                padding: 10px 15px 0 0 ;
                height: 500px;
            }
            .mvComment{
                margin-right:20px ;
            }
        }
        .aside{
            width: 28%;
            .title{
                font-size: 16px;
                font-weight: bold;

            }
            .title:before {
                content: '';
                display: inline-block;
                width: 5px;
                height: 18px;
                margin: 3px 5px 0 0;
                border-radius: 2px;
                background: orange;
                vertical-align: top;
            }
            .mvInfo{
                border-radius:10px ;
                overflow: hidden;
                box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                padding: 20px;
                .mvPublishTime{
                    padding-top: 8px;
                    font-size: 14px;
                    color: gray;
                }
                .mvPlayCount{
                    font-size: 14px;
                    color: gray;
                }
                .mvDesc{
                    font-size: 14px;
                    padding-top: 8px;
                    color: black;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;

                }
            }
            .relatedMv{
                .relatedTitle{
                    background: white;
                    padding: 20px;
                    border-radius:10px ;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                    margin: 10px 0 10px 0 ;
                }
                .relatedMain{
                    
                    .mvItem{    
                        border-radius:10px ;
                        overflow: hidden;
                        background: white;
                        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
                        padding: 10px; 
                        margin-bottom: 10px;
                                        
                        .mvImg{
                            width: 300px;
                            height: 170px;
                            position: relative;
                            overflow: hidden;
                            border-radius: 10px;
                            cursor: pointer;
                            .el-image{
                                height: 100%;
                                width: 100%;
                                transition: all .4s linear;
                            }
                            .mv_el-icon{
                                position: absolute;
                                top: calc(50% - 20px);
                                left: calc(50% - 25px);
                                text-align: center;
                                z-index: 3;
                                font-size: 50px;
                                color: #fff;
                                opacity: 0;
                                transform: scale(.5);
                                transition: all .4s linear;
                                text-shadow: 2px 2px 10px #000;
                            }

                        }
                        .mvInfo{
                            padding: 10px 0;
                            .mvName{
                                font-size: 14px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                cursor: pointer;
                            }
                            .mvAuthor{
                                font-size: 14px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                color: gray;
                            }
                            .mvPlaycount{
                                font-size: 16px;
                                color: gray;
                                padding-top: 5px;

                            }
                        }
                    }
                    .mvItem:hover{
                        .el-image{
                            transform: scale(1.1);
                        }
                        .mv_el-icon{
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                }
            }
        }
    }
}
</style>
