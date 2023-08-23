<template>
   <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id"  type="index" label="序号" width="60">
        <template #default="scope">
            <div class="indexOrPlayIcon">
                <div class="indexAdd">
                    {{ (currentPage-1)* pageSize + scope.$index + 1 }}
                </div>
                <el-icon class="el-play" @click="playing(scope.row)"><VideoPlay /></el-icon>

            </div>
        </template>
    </el-table-column>
    <el-table-column prop="name" label="歌曲" width="200">
        <template #default="scope">
            <div class="songAndIcon">
                <div class="song">
                    {{ scope.row.name }}
                </div>
                <div class="songIcon">
                    <!-- y拥有mv -->
                    <i v-if="scope.row.mv!=0" class="iconfont icon-MV mvIcon" @click="enterMv(scope.row)"></i>
                    <!-- vip -->
                    <i v-if="scope.row.fee==1" class="iconfont icon-vip vipIcon"></i>
                </div>
            </div>
        </template>
    </el-table-column>
    <el-table-column label="歌手" width="220">
        <template #default="scope">
            <div class="singer">
                <div v-for="(item,index) in scope.row.ar" :key="item.id">
                    {{ index == 0? item.name:'/'+item.name}}
                </div>
            </div>
        </template>
    </el-table-column>
    <el-table-column prop="" label="专辑" width="160">
        <template #default="scope">
            <div class="album">
               {{ scope.row.al.name }}
            </div>
        </template>
    </el-table-column>
    <el-table-column label="时长" width="80">
        <template #default="scope">
            <div class="timeAndIcon">
                <div class="songTime">
                    {{ formatSongTime(scope.row.dt) }}
                </div>
                <div class="addListAndCollection">
                    <el-icon class="addListIcon" title="添加到列表" @click="addList(scope.row)"><FolderAdd /></el-icon>
                    <el-icon class="collectionIcon" title="添加到收藏"><Star /></el-icon>
                </div>
            </div>
        </template>
    </el-table-column>
  </el-table>
  <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"     
      background
      layout="prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  
</template>

<script setup>
// 表格需要自定义
import {ref, onMounted,defineProps,watch, nextTick} from 'vue'
import http from '../api/http';
import { formatSongTime } from '../utils/util';
import '../assets/iconfont/iconfont.css'
import {
  Star,
  VideoPlay,
  FolderAdd
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '../stores/player';
import { useRouter } from 'vue-router';
const tableData = ref([])
const router = useRouter()
const currentPage = ref(1)
const total = ref(100)
const pageSize = ref(20)
const lycData = ref('')
const playerStore = usePlayerStore()
const props = defineProps(['tableSongList'])
const enterMv=(item)=>{
    router.push({path:`/home/musicVideo/detail/${item.mv}`})
}
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
    ElMessage({
        message: '添加成功',
        type: 'success',
    })
}
const playing=async (item)=>{
    playerStore.isPlaying=false
    playerStore.isRevolve=false
    console.log(item)
    await getLyric(item.id)
    const audio={
        artist:getAllArtists(item.ar),
        name:item.name,
        url:`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        cover:item.al.picUrl,
        lrc:lycData.value
    }
    playerStore.audio = audio
    playerStore.isPlaying=true
    playerStore.isRevolve=false
}
watch(()=>props.tableSongList, (newValue, oldValue) => {
    currentPage.value = 1
    getTableData()
});
const getTableData = () =>{
    total.value = props.tableSongList.length
    tableData.value = props.tableSongList.slice((currentPage.value-1)*pageSize.value,currentPage.value*pageSize.value)

}

const handleSizeChange = (val) => {
//   console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
    getTableData()
}
onMounted(() => {
    getTableData()
})
</script>

<style lang="scss" scoped>
.album{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.songAndIcon{
    display: flex;
    .song{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .songIcon{
        position: relative;

        left: 5px;
        .mvIcon{
            font-size: 24px;
            margin-left: 5px;
        }
        .vipIcon{
            font-size: 24px;
            margin-left: 8px;
            color: red;
        }
        .mvIcon:hover{
            color: orange;
            cursor: pointer;
        }
    }
}
.el-table{
    color:black;
}
.singer{
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.timeAndIcon{
    display: flex;
    .addListAndCollection{
        display: none;
        position: absolute;
        top: 5px;
        font-size: 24px;
        .addListIcon{
            margin-right: 10px;
        }
    }
}
.indexOrPlayIcon{
    display: flex;
    .el-play{
        position: absolute;
        font-size: 26px;
        top: 8px;
        left: 8px;
        display: none;
    }
    
}
.el-table__row:hover{
    .el-play{
        display: flex;
        cursor: pointer;
    }
    .el-play:hover{
        color: orange;
    }
    .indexAdd{
        display: none;
    }
    .addListAndCollection{
        display: flex;
    }
    .songTime{
        display: none;
    }
    .collectionIcon:hover{
        color: orange;
        cursor: pointer;
    }
    .addListIcon:hover{
        color: orange;
        cursor: pointer;
    }
}
</style>
