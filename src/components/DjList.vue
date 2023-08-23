<template>
    <div class="dj">
        <div v-for="(item,index) in djList" :key="item.id" class="djitem">
            <div class="djImg">
                <el-image :src="item.picUrl + '?param=120y120'"></el-image>
            </div>
            <div class="djInfo">
                <div class="djName">
                    <el-icon><Film /></el-icon>
                    <p>{{ item.name }}</p>
                </div>
                <div class="rcmdtext">
                    {{ item.rcmdtext }}
                </div>
                <div class="djCount">
                    <span>共{{item.programCount}}期</span><span>订阅{{formartNum(item.subCount)}}次</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive,onMounted } from 'vue'
import http from '../api/http';
import { formartNum } from '../utils/util'
import {
    Film
} from '@element-plus/icons-vue'
const djList = ref([])
const getDjList = () => {
    http.get('/dj/hot?limit=6')
    .then(res=>{
        djList.value = res.data.djRadios
    })
    // console.log(djList)
}
onMounted(()=>{
    getDjList()
})
</script>

<style lang="scss" scoped>
.dj{
   
    flex-wrap: wrap;
    font-size: 0;
    margin-right: -20px;
    .djitem{
        display: inline-flex;
        width: 50%;
        margin-bottom: 20px;
        .djImg{
            width: 100px;
            height: 100px;
            border-radius: 4px;
            overflow: hidden;
        }
        .djInfo{
            flex: 1;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            padding:0 5px;
            margin:0px 20px;
            border-bottom: 1px solid #eee;
            .djName{
                display: flex;
                font-size: 18px;
                font-weight: bold;
                color: #040404;
                p{
                    padding-left: 8px;
                    line-height: 20px;
                }

            }
            .rcmdtext{
                font-size: 14px;
                color: gray;

            }
            .djCount{
                display: flex;
                font-size: 12px;
                color: gray;
                justify-content:space-between;

            }
        }
    }
}
</style>
