// 过滤元素下载链接
var divEles = document.getElementById('data-detail');
var toubiao = document.getElementById('toubiao');
if (toubiao) {
    toubiao.parentNode.removeChild(toubiao);
}
let img = divEles.getElementsByTagName('img');
for (let i = 0, len = img.length; i < len; i++) {
    let src = img[i].getAttribute('file');
    if (src) {
        let src2 = src.replace('https:', '');
        img[i].setAttribute('src', src2);
    }
}
var txt = '';
eachList(divEles.children);
function eachList(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].firstChild) {
            txt = data[i].firstChild.nodeValue || '';
        } else {
            txt = data[i].innerText || '';
        };
        if (txt.indexOf('下载次数') > -1) {
            var ev = data[i].parentNode;
            var child = ev.getElementsByTagName('a');
            var hf = '';
            var cla = '';
            for (var j = 0; j < child.length; j++) {
                hf = child[j].getAttribute('href');
                cla = child[j].getAttribute('class') || '';
                if (hf.indexOf('forum.php?mod') > -1 && cla.indexOf('xw1') < 0) {
                    ev.parentNode.removeChild(ev);
                    console.log(235345)
                };
            };
        };
        if (data[i].getAttribute('onmouseover')) data[i].removeAttribute('onmouseover');
        if (data[i].getAttribute('onclick')) data[i].removeAttribute('onclick');
        if (data[i].getAttribute('title') === '帖子模式') {
            data[i].parentNode.removeChild(data[i]);
        }
        if (data[i] && data[i].getAttribute('src') && data[i].getAttribute('src').indexOf('wifi588.net') > -1) {
            data[i].parentNode.removeChild(data[i]);
        }
        if (txt.indexOf('您的回复是我发帖的动力，感谢欣赏！') > -1 || txt.indexOf('点击下载720p视频') > -1) {
            data[i].parentNode.removeChild(data[i]);
        }
        if (data[i]) {
            var childList = data[i].children;
            eachList(childList);
        }

    };
};

// 去除a链接
let a = divEles.getElementsByTagName('a');
for (let i = 0, len = a.length; i < len; i++) {
    a[i].setAttribute('href', '###');
}

var videoObject = {
    container: '#video', //容器的ID或className
    variable: 'player',//播放函数名称
    flashplayer: true,
    poster: '/static/img/ashun.png',//封面图片
    video: document.getElementById('video-url').value
    // video: [//视频地址列表形式
    //     [video, 'video/mp4', '中文标清', 0],
    //     [video, 'video/mp4', '中文高清', 0],
    //     [video, 'video/mp4', '英文高清', 10],
    //     [video, 'video/mp4', '英文超清', 0],
    // ]
};
var player = new ckplayer(videoObject);