<template>
  <div class="hot_p_list">
            <div  v-for="(item) in props.hotListInfo" class="hotinfo" :key="item.id" @click="selectAlbum(item.id)">
                <div class="hotimg">
                    <el-image style="width: 100%; height: 100%;border-radius: 10px;" :src="item.coverImgUrl" fit="cover" />
                    <span class="playCount"><el-icon size="1.5em" style="position: relative;top: 5px;"><Service /></el-icon><em>{{formartNum(item.playCount)}}</em> / {{item.trackCount + '首'}}</span>
                </div>
                <div class="hotname">
                    {{ item.name }}
                </div>
                <div class="tags" v-if="item.tags && item.tags.length>0" >
                    <div class="tagsItem" v-for="(tagsItem,index) in item.tags" :key="index">
                        #{{ tagsItem }}
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
import {ref, reactive,onMounted,defineProps } from 'vue'
import { formartNum } from '../utils/util'
import {
    Service
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const props = defineProps(['hotListInfo'])
const router = useRouter()
const selectAlbum=(id)=>{
    router.push({path:`/home/playlist/detail/${id}`})
}
</script>

<style lang="scss" scoped>
.hot_p_list{
    display: flex;
    flex-wrap: wrap;
}
.hotinfo{
    width: calc(100% / 6);
    display: flex;
    flex-direction: column;
    padding: 20px 40px 20px 0;
    box-sizing: border-box;
    cursor: pointer;
    .tags{
        display: flex;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .tagsItem{
            font-size: 12px;
            padding-top: 5px;
            padding-right: 5px;
            color: orange;
            
        }
    }
    .hotimg{
        width: 90%;
        height: 90%;
        // padding: 15px;
        z-index: 2;
        position: relative;

    }
    .hotimg:after {
        border: 1px solid #C4C4C4;
        border-radius: 5px;
        content: "";
        position: absolute;
        bottom: 6%;
        left: 0px;
        right: -10px;
        background: #D9D9D9;
        height: 90%;
        z-index: -1;
        transition: all .4s linear;
        
    }
    .hotimg:hover:after {
        border: 1px solid #C4C4C4;
        content: "";
        position: absolute;
        bottom: 6%;
        left: 0px;
        right: -14px;
        background: #ff960080;
        height: 90%;
        z-index: -1;
        
    }
    .hotimg:before {
        border: 1px solid #D6D6D6;
        border-radius: 4px;
        content: "";
        position: absolute;
        
        bottom: 11%;
        left: 0px;
        right: -18px;
        background: #D9D9D9;
        height: 80%;
        z-index: -2;
        transition: all .4s linear;
    }
    .hotimg:hover:before {
        border: 1px solid #C4C4C4;
        content: "";
        position: absolute;
        bottom: 11%;
        left: 0px;
        right: -22px;
        background: #ff960080;
        height: 80%;
        z-index: -2;
        
    }
    .hotname{
        width: 100%;
        height: 50px;
        line-height: 20px;
        font-size: 16px;
        display: -webkit-box;
        /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
        -webkit-box-orient:vertical;
        /*要显示的行数*/
        -webkit-line-clamp:2;
        /* 溢出部分隐藏 */
        overflow:hidden;
    }
    .playCount{
        position: absolute;
        top: 2px;
        right: 3px;
        z-index: 3;
        font-size: 12px;
        color: white;
    }
}
</style>
