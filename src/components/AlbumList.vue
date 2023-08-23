<template>
    <div class="album">
        <div v-for="(item) in props.albumListInfo" class="albuminfo" :key="item.id" @click="selectAlbum(item.id)">
            <div class="albumimg">
                <el-image style="width: 100%; height: 100%;border-radius: 10px;" :src="item.picUrl + '?param=120y120'"
                    fit="cover" />
            </div>
            <div class="albumname">
                <div class="album-type">{{ item.type }}</div>
                <div class="album-name" v-if="item.name">{{ item.name }}</div>
                <div class="artist-name" v-if="item.artist">{{ item.artist.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router"
const props = defineProps(['albumListInfo'])
const router = useRouter()
const selectAlbum=(id)=>{
    router.push({path:`/home/album/${id}`})
}
</script>

<style lang="scss" scoped>
.album{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    padding-bottom: 20px;
    margin: 0 -10px;
    .albuminfo{
        display: flex;
        flex: 25%;
        max-width: calc(100% / 4 - 20px);
        margin: 20px 10px 0;
        border-radius: 4px;
        background: #f0f0f0;
        
        .albumimg{
            display: block;
            position: relative;
            flex: 2;
            max-width: 120px;
            max-height: 120px;
            z-index: 2;
        }
        .albumimg:after {
            // display: inline-block;
            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            right: -20px;
            width: 100%;
            height: 100%;
            background: url('/img/disc.png') no-repeat;
            background-size: contain;
            transition: all .8s linear;
        }
        .albumimg:hover:after{
            right: -20px;
            transform-origin:center 45%;
            transform: rotate(360deg);
        }
        .albumname{
            position: relative;
            flex: 3;
            margin-left: 40px;
            overflow: hidden;
            .artist-name{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .album-type{
                position: absolute;
                top: 10px;
                right: -30px;
                width: 100px;
                line-height: 24px;
                font-size: 12px;
                transform: rotate(45deg);
                text-align: center;
                color: #fff;
                background-color: orange;
            }
            .album-name{
                padding: 16% 15px 10px 0px;
                font-size: 1em;
                color: #0c0c0c;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
            }
            .album-name:hover{
                color:orange;
            }
            .item.artist{
                font-size: 0.9em;
                color: #504f4e;
            }
        }
    }
}
</style>
