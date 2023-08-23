<template>
    <div id="aplayer"></div>
</template>
   
<script setup>
import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import {ref,reactive, onMounted, watch, nextTick, provide, toRaw} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '../stores/player';
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const currentUrl = ref('')
//列表切换图片歌词状态不变，需要修改，在播放时切换页面，再次播放会频繁切换播放状态
let audio={ 
    artist:'Y.Z.H/李晨曦Chrisulous',
    name:'插叙人生（Montage）',
    url:'https://music.163.com/song/media/outer/url?id=2071177415.mp3',
    cover:'https://p2.music.126.net/KrsOhbsXgsVtFi0C2w320g==/109951168823736894.jpg',
    lrc:`[00:00.000] 作词 : Y.Z.H/李晨曦Chrisulous\n[00:01.000] 作曲 : Y.Z.H/李晨曦Chrisulous\n[00:02.000] \n[00:03.000] 作词：Y.Z.H / 李晨曦Chrisulous\n[00:04.000] 作曲：Y.Z.H / 李晨曦Chrisulous\n[00:05.000] 混音:70\n[00:06.000] 母带:70\n[00:07.000] 封面设计: 何治岐\n[00:08.000] 出品：网易飓风X网易音乐人\n[00:09.000] 营销：网易飓风\n[00:13.339]\t采样自电影——《重庆森林》\n[00:32.617]\tY.Z.H：\n[00:33.085]\t我们〖都哭着问世 又笑来人间〗\n[00:35.346]\t在这之前低头脚下曾是天\n[00:37.430]\t然后带着关于爱恨生死的疑惑\n[00:39.634]\t【都又哭笑着来问人世间】\n[00:41.758]\t〖不停奔着 他会跑向东〗\n[00:43.587]\t陪伴他的只有吹他身上的风\n[00:45.683]\t只为能见明天太阳在早上升\n[00:47.755]\t【他不会停跑 奔向着东】\n[00:49.769]\t〖再归来仍是少年〗就连花也说了谢\n[00:52.011]\t最难熬的永远会在破晓的前夜\n[00:53.859]\t可“明”天没有太阳〖见“去日会多个月”〗\n[00:55.932]\t【“再见”“归去”“来日”仍会是多少个年月】\n[00:58.051]\t〖想了想梦里 他借梦还乡〗\n[01:00.204]\t无数个夜晚与月共寒窗 等雁过南方\n[01:03.187]\t〖夜来风霜 吹寒冻雨〗\n[01:04.539]\t梅花被雨浇落却剩残香\n[01:06.344]\t〖当等雨的花又到落梅季〗\n[01:08.468]\t【当又等到雨落的梅花季】\n[01:10.555]\t〖他也想着家 谁不想回去？〗\n[01:12.450]\t【他谁也不想 想着回家去】\n[01:14.412]\t喜欢看一些书 也玩玩写作\n[01:16.602]\t写一叶知秋 也写寒蝉雪落\n[01:18.698]\t他的生活【虽然说难过也难过】\n[01:20.861]\t〖虽说过难 然难也过〗\n[01:22.947]\t路遥知马力 也难免会生困意\n[01:24.977]\t就算没有太阳 天只剩阴郁\n[01:27.026]\t〖也渐渐的变清 心随高远风更净〗\n[01:28.956]\t【心也随渐高渐远的风变更清净】\n[01:31.585]\t〖望那夜空 盼着晚星〗\n[01:32.649]\t他看的目不转睛 少年是那满月清风\n[01:35.571]\t风吹尘土还未染衣 却不觉已泪满襟\n[01:37.933]\t【盼望着那晚夜星空】\n[01:39.666]\t〖那一颗星点的光 让整晚带点微亮〗\n[01:41.700]\t忘记了曾死在谎言里的爱显悲壮\n[01:43.892]\t夜里赶路就不怕前路飞霜降\n[01:45.947]\t【那让一整颗晚星带点点的微光亮】\n[01:48.106]\t〖又一夜的哼着 像阵晚风唱歌〗\n[01:50.251]\t它告诉你要有胆冲上坡\n[01:52.467]\t它像灯但又比灯亮得多\n[01:54.476]\t【又像一阵夜晚的风哼唱着歌】\n[01:56.411]\t李晨曦Chrisulous：\n[01:56.904]\tWhen I look back, I've written a wonderful life of myself\n[02:00.421]\t（当我回头看，尽是我书写哦我那精彩的人生篇章）\n[02:01.079]\tHappy or sad, it doesn't matter I've done everything well\n[02:04.789]\t（悲或喜已经无所谓了，因为我走好了我的每一步）\n[02:05.111]\tI know this world is complicated\n[02:06.813]\t（深知这个世界的复杂）\n[02:07.114]\tUnder water I'mma suffocated\n[02:08.907]\t（一度被窒息感包裹）\n[02:09.182]\tOpportunity I've been waste it\n[02:11.236]\t（也几度没抓住机会）\n[02:11.493]\tIt's not the time yet no because I'm lazy yeah\n[02:14.325]\t（是时机未成熟罢了）\n[02:15.134]\t我一个人熬过了多少痛苦的夜\n[02:19.111]\t我插叙的人生总伴随着不理解\n[02:23.162]\t把嘶哑的怒吼当成欢声笑语写\n[02:27.053]\t背对着雪崩也不会把心中火扑灭\n[02:29.183]\tY.Z.H：\n[02:29.411]\t时间它〖左右着前后 拉扯向往〗\n[02:31.564]\t渐渐变成了他的妄想\n[02:33.322]\t被现实【左拉右扯着向前往后】\n[02:35.627]\t逃不出去的生活像网\n[02:37.469]\t谎言如潮水般吞向了他\n[02:39.521]\t揭穿他就像揭他身上的疤\n[02:41.539]\t〖可说假都真了 他的话能忘吗？〗\n[02:43.620]\t【可他说的假话都能真忘了吗？】\n[02:45.707]\t〖想起痛可入肠 后举杯饮酒愁〗\n[02:47.838]\t硬是把自己喝得呕吐投降\n[02:49.819]\t他也没有停下 酒又往瓶口流\n[02:51.731]\t【后想举起杯痛饮 可酒入愁肠】\n[02:53.995]\t〖可能那半活的心 难把一生过顺意〗\n[02:56.092]\t【他想借了梦想还梦乡里】\n[02:57.845]\t【可难能把那一半生活过的顺心意】\n[03:00.211]\t【夜吹来寒风冻霜雨】\n[03:02.251]\t〖却不愁细雨 剪断如丝〗\n[03:04.316]\t他立在原地像一支笔\n[03:06.362]\t剪断了年少 也剪断无知\n[03:08.443]\t【却剪不断愁如细丝雨】\n[03:10.436]\t〖但愁未断却又曲终人散〗\n[03:12.566]\t剩他一人那就与风成伴\n[03:14.675]\t抬头看夜空挂一轮月\n[03:16.690]\t【但又愁曲未终断 …】\n`

}

let timer = ''
const getCurrentUrl=()=>{
    return `https://music.163.com/song/media/outer/url?id=${route.path.substring(route.path.lastIndexOf('/')+1,route.path.length)}.mp3`
}
watch(()=>playerStore.audio,()=>{
    audio = {...toRaw(playerStore.audio)}
    // console.log('player Audio更新')
    // if(playerStore.isPlaying==true){//修改
    //     console.log('playerStore.audio触发true')
    //     playerStore.isRevolve = true
    // }else{
    //     playerStore.isRevolve = false
    //     console.log('playerStore.audio触发false')
    // }
    addMyAudio()
    

},{
    deep:true
})
watch(()=>playerStore.isUpdateAudio,(newVal,oldVal)=>{
    if(newVal==true){
        audio = {...toRaw(playerStore.audio)}
        // console.log('player Audio更新1')
    // if(playerStore.isPlaying==true){//修改
    //     console.log('playerStore.audio触发true')
    //     playerStore.isRevolve = true
    // }else{
    //     playerStore.isRevolve = false
    //     console.log('playerStore.audio触发false')
    // }
        addMyAudio()
        playerStore.isUpdateAudio = false
    }else{
        // console.log('layerStore.isUpdateAudio为false')
        // console.log(playerStore.audio)
    }
    

})
const emits = defineEmits(['player'])

var ap;
const addMyAudio=()=> {
	ap = new APlayer({

	    container: document.getElementById("aplayer"),
	    audio: audio,
        lrcType: 1,
        fixed: true,
        mutex:true
	})
    ap.setMode('normal')
    ap.on('play',()=>{
        // console.log('我正在被触发：playerPlay')
        // console.log(getUrl()==getCurrentUrl())
        if(getUrl()!=getCurrentUrl()){
            // console.log('ap.on(play)触发false')
            playerStore.isCommonUrl = false
            playerStore.isRevolve=false
        }else{
            playerStore.isCommonUrl = true
            playerStore.isRevolve = true
            // console.log('ap.on(play)触发true')
        }

        // playerStore.isPlaying = true

        
    })
    
    ap.on('pause',()=>{
        // console.log('我正在被触发：playerPause')
        // playerStore.isPlaying =false
        playerStore.isRevolve = false
        
    })


}
watch(()=>route.path,()=>{
    if(getUrl()!=getCurrentUrl()){
        playerStore.isCommonUrl = false
        playerStore.isRevolve=false
        // console.log('route触发false')
    }else{
        playerStore.isCommonUrl = true
        playerStore.isRevolve = true
        // console.log('route触发true')
    }
})
watch(()=>playerStore.isDestroy,(newVal,oldVal)=>{
    if(newVal==true){
        destroyPlayer()
        playerStore.isDestroy=false
    }
})
watch(()=>playerStore.isPlaying,(newVal,oldVal)=>{
    // console.log('isplaying变化了，新值是：'+newVal+',旧值是'+oldVal)
    if(newVal==true){
        isPlay()
        // console.log('音乐开始播放')
        timer = window.setInterval(() => {
            playerStore.currentTime = getCurrentTime()
        }, 100 );
    }else{
        isPause()
        // console.log('音乐暂停播放')
        window.clearInterval(timer)
    }
})
watch(()=>playerStore.isAdd,(newVal,oldVal)=>{
    if(newVal==true){
        let addobj = {...toRaw(playerStore.SongList)}
        addList(addobj)
        playerStore.isAdd = false
    }
    


})
// watch(()=> ap.on('play',()=>{}),()=>{
//     console.log('play被触发了')
// })
const isPlay= ()=>{

    ap.play()
}

const isPause=()=>{
    ap.pause()
}
const getUrl = ()=>{
    return ap.audio.currentSrc
}
const getCurrentTime=()=>{
    return ap.audio.currentTime
}

const addList=(arry)=>{
    ap.list.add(arry)
}
const destroyPlayer=()=>{
    ap.destroy()
}
onMounted(()=>{
    addMyAudio()
    getCurrentUrl()
})
</script>
   
<style lang='scss'>
.aplayer-list{
    margin-bottom: 100px!important;
}
.aplayer-played{
    background: orange!important;
}
.aplayer-music{
    padding-left: 5px;
}
.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar{
    top: -56px;
    height: 4px;
}
.aplayer.aplayer-fixed {
    max-width: 100vw;
}
.aplayer.aplayer-fixed .aplayer-body {
    max-width: calc(100% - 20px)!important;
    height: 100px;
}
.aplayer .aplayer-pic {
    height: 100px;
    width: 100px;
}

.aplayer.aplayer-fixed .aplayer-lrc {
    bottom: 40px;
    z-index: 100;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
    height: 66px;
}
</style>