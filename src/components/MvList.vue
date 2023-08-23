<template>
    <div class="mv">
        <!-- 重复数据id报错，key用id+index组合 -->
        <div v-for="(item, index) in props.newMvList" :key="'' + item.id + index" class="mvItem" @click="selectMV(item.id)">
            <div class="mvImg">
                <el-icon class="mv_el-icon">
                    <VideoPlay />
                </el-icon>
                <el-image style="width: 100%;height: 100%;" :src="item.cover" fit="cover" />
            </div>
            <div class="mvInfo">
                <div class="mvName">{{ item.name }}</div>
                <div class="mvAuthor">{{ item.artistName }}</div>
                <div class="mvPlaycount"><el-icon>
                        <VideoCamera />
                    </el-icon>{{ formartNum(item.playCount) }}</div>
                <!-- <div class="mvPublishTime"></div> -->
            </div>
        </div>
    </div>
</template>

<script setup>

import { formartNum } from '../utils/util';
import {
    VideoPlay,
    VideoCamera
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter()
const props = defineProps(['newMvList'])
const selectMV=(id)=>{
    router.push({path:`/home/musicVideo/detail/${id}`})
}
</script>

<style lang="scss" scoped>
    .mv{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: left;
        margin: 0 -10px;
        .mvItem{
            max-width: calc(100% / 6 - 20px);
            margin: 20px 10px 0;
            .mvImg{
                width: 100%;
                height: 130px;
                position: relative;
                overflow: hidden;
                border-radius: 10px;
                .el-image{
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
</style>
