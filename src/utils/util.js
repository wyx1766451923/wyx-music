
    // 数字过万的处理
const formartNum = (val)=> {
    let num = 0
    if (val > 9999) {
        num = Math.round(val / 10000 * 10) / 10 + '万'
    } else {
        num = val
    }

    return num
}
//日期处理
const formartDate = (originVal, fmt) => {
    const dt = new Date(originVal)
    const opt = {
        yyyy: dt.getFullYear(),
        MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
        dd: (dt.getDate() + '').padStart(2, '0'),
        HH: (dt.getHours() + '').padStart(2, '0'),
        mm: (dt.getMinutes() + '').padStart(2, '0'),
        ss: (dt.getSeconds() + '').padStart(2, '0')
    }

    for (const k in opt) {
        const ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
            fmt = fmt.replace(ret[1], opt[k])
        }
    }

    return fmt
}
//歌曲时间处理
const formatSongTime = (duration = 0) => {
    duration = duration >= 0 ? duration / 1000 : 0;
    const m = (Math.floor(duration / 60) + '').padStart(2, '0')
    const s = (Math.floor(duration % 60) + '').padStart(2, '0')
    return `${m}:${s}`
}
// 评论时间格式化处理
const formatMsgTime = (duration) => {
    let result = ''
    const NOW = new Date()
    const PAST = new Date(duration)

    // 判断是当天的时间 显示格式 10：30
    if (NOW.toDateString() === PAST.toDateString()) {
        result = formartDate(duration, 'HH:mm')
    // 时间为当年 显示月日 时间戳
    } else if (PAST.getFullYear() === NOW.getFullYear()) {
        result = formartDate(duration, 'MM月dd日 HH:mm')
    } else {
        result = formartDate(duration, 'yyyy年MM月dd日')
    }

    return result
}
export {
    formartNum,
    formartDate,
    formatSongTime,
    formatMsgTime
}