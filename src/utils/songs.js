//新歌上架类型
const newSongType = () =>{
    const new_song_type = [
        {typeName:'全部',typeId:'0',typeArea:'ALL'},
        {typeName:'华语',typeId:'7',typeArea:'ZH'},
        {typeName:'欧美',typeId:'96',typeArea:'EA'},
        {typeName:'日本',typeId:'8',typeArea:'KR'},
        {typeName:'韩国',typeId:'16',typeArea:'JP'},
    ]
    return new_song_type
}
const MV_AREA = ['全部', '内地', '港台', '欧美', '日本', '韩国'];
const MV_TYPE = ['全部', '官方版', '原生', '现场版', '网易出品'];
const MV_ORDER = ['上升最快','最热','最新']
const RANK_TYPE = [
    {name:'TOP榜',type:'Top'},
    {name:'云音乐榜',type:'CloudSong'},
    {name:'其他榜',type:'Other'}
]
const LIST_TYPE =  {
    songs: '单曲',
    artists: '歌手',
    albums: '专辑',
    playlists: '歌单'
}
const SEARCH_TYPE=[
    {label:'单曲',value:1},
    {label:'专辑',value:10},
    {label:'歌手',value:100},
    {label:'歌单',value:1000}
]


const SINGER_AREA = [{ name: '全部', id: -1 }, { name: '华语', id: 7 }, { name: '欧美', id: 96 }, { name: '日本', id: 8 }, { name: '韩国', id: 16 }, { name: '其他', id: 0 }];
const SINGER_TYPE = [{ name: '全部', id: -1 }, { name: '男歌手', id: 1 }, { name: '女歌手', id: 2 }, { name: '乐队', id: 3 }];
const SINGER_INITIAL = [{name: '热门', value: -1},{name: 'A', value: 'a'},{name: 'B', value: 'b'},{name: 'C', value: 'c'},{name: 'D', value: 'd'},{name: 'E', value: 'e'},{name: 'F', value: 'f'},{name: 'G', value:'g'},{name: 'H', value: 'h'},{name: 'I', value: 'i'},{name: 'J', value: 'j'},{name: 'K', value: 'k'},{name: 'L', value: 'l'},{name: 'M', value: 'm'},{name: 'N', value: 'n'},{name: 'O', value: 'o'},{name: 'P', value: 'p'},{name: 'Q', value: 'q'},{name: 'R', value: 'r'},{name: 'S', value: 's'},{name: 'T', value: 't'},{name: 'U', value: 'u'},{name: 'V', value: 'v'},{name: 'W', value: 'w'},{name: 'X', value: 'x'},{name: 'Y', value: 'y'},{name: 'Z', value: 'z'},{name: '#', value: 0}]
export {
    newSongType,
    MV_AREA,
    RANK_TYPE,
    MV_TYPE,
    MV_ORDER,
    SINGER_AREA,
    SINGER_TYPE,
    SINGER_INITIAL,
    LIST_TYPE,
    SEARCH_TYPE
}