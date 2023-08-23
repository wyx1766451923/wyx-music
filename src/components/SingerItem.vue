<template>
  <div class="item">
    <div class="singerImg">
        <el-image :src="props.item.picUrl+ '?param=120y120'"></el-image>
    </div>
    <div class="singerInfo">
        <div class="info-header">
            <div class="singerName">
                {{ props.item.name }}
            </div>
            <el-icon class="collectIcon"><Star /></el-icon>
        </div>
        <div class="info-digital">
            <div class="singerAlbums">
                <div>专辑</div>{{ props.item.albumSize }}
            </div>
            <div class="singerSongs">
                <div>单曲</div>{{ props.item.musicSize }}
            </div>
            <div class="singerFans">
                <div>粉丝</div>{{ formartNum(props.item.fansCount) }}
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import {
    Star
} from '@element-plus/icons-vue'
import { formartNum } from '../utils/util';
const props = defineProps(['item'])
</script>

<style lang="scss" scoped>
.item{
    position: relative;
    display: flex;
    background: white;
    width: calc(100% / 3 - 20px);
    padding: 10px 0;
    margin: 20px 0 0 10px;
    border-radius: 8px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    transition: all .3s ease-in-out;
    .singerImg{
        width: 100px;
        height: 100px;
        border-radius: 12px;
        overflow: hidden;
        flex-shrink: 0;
        transition: all .3s ease-in-out;
        cursor: pointer;
    }
    .singerInfo{
        flex: 1;
        padding: 0 10px 0 15px;
        .info-header{
            display: flex;
            
            .singerName{
                white-space: nowrap;
                max-width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 18px;
                color: black;
                font-weight: 600;
                cursor: pointer;
            }
            .collectIcon{
                font-size: 18px;
                position: absolute;
                top: 12px;
                right: 10px;
                cursor: pointer;
            }
        }
        .info-digital{
            display: flex;
            padding-top: 15px;
            font-size: 12px;
            .singerAlbums{
                padding-right: 10px;
            }
            .singerSongs{
                padding-right: 10px;
            }
            .singerFans{
                padding-right: 10px;
            }
        }
    }
}
.item:hover{
    border-radius: 60px 12px 12px 60px;
    transition: all .3s ease-in-out;
    background: linear-gradient(to right,  #ffffff 20%,orange 100%);
    .singerImg{
        border-radius: 50%;
        margin-left: 5px;
        transition: all .3s ease-in-out;
    }
}
</style>
