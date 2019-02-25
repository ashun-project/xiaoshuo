var express = require('express');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var router = express.Router();
var num = 0;  
var videoList = [];      
var menu = [
    {url: '/', name: '首页'},
    {url: '/list/renqi.html', name: '人妻熟女'},
    {url: '/list/luanlun.html', name: '家庭乱伦'},
    {url: '/list/qiangbao.html', name: '强奸孽待'},
    {url: '/list/xiaoyuan.html', name: '校园春色'},
    {url: '/list/gudian.html', name: '古典武侠'},
    {url: '/list/dongman.html', name: '卡通动漫'},
    {url: '/list/mingxin.html', name: '名人明星'},
    {url: '/list/dushi.html', name: '都市言情'},
    {url: '/list/gushi.html', name: '经验故事'},
    {url: '/list/linglei.html', name: '另类小说'},
    {url: '/list/zishi.html', name: '性知识'}
]
var getIp = function (req) {
    var ip = req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    num = num + 1;
    return ip;
};

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'xiaosho'
});

// var poolVip = mysql.createPool({
//     host: '103.104.104.81',
//     user: 'root',
//     password: 'ashun666',
//     port: '3306',
//     database: 'vip'
// });
function suiji () {
    poolVip.getConnection(function (err, conn) {
        var limit = Math.floor(Math.random()*200) + ',' + 20;
        var sql = "select * from list limit " + limit;
        if (!err) {
            conn.query(sql, function (err, result) {
                if (result) {
                    videoList = result;
                }
                conn.release();
            })
        }
    });
}
// suiji();
// setInterval(suiji, 2*60*60*1000); //

// 首页
router.get('/', function (req, res) {
    var sql = 'select a.* from (select * from dushi order by createTime desc limit 6) a union all select b.* from (select * from qiangbao order by createTime desc limit 6) b union all select c.* from (select * from gushi order by createTime desc limit 6) c union all select d.* from (select * from mingxin order by createTime desc limit 6) d';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL-index ==> " + err);
        conn.query(sql, function (err, result) {
            var slic = Math.floor(Math.random()*17);
            var listObj = {
                pageTitle: '言情小说吧',
                pageKeyword: '言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
                pageDescrition: '欢迎阅读, 言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
                host: 'http://'+req.headers['host'],
                menu: menu,
                videoList: videoList.slice(slic, slic+4),
                result: ''
            }
            if (err) {
                res.render('index', listObj);
            } else {
                var obj = {
                    dushi: [],
                    qiangbao: [],
                    gushi: [],
                    mingxin:[]
                }
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i].type)
                    obj[result[i].type].push(result[i]);
                }
                arr = [
                    {type: 'dushi', list: obj.dushi, name: '都市言情'},
                    {type: 'qiangbao', list: obj.qiangbao, name: '强奸孽待'},
                    {type: 'gushi', list: obj.gushi, name: '经验故事'},
                    {type: 'mingxin', list: obj.mingxin, name: '名人明星'}
                ];
                listObj.result = arr;
                res.render('index', listObj);
            }
            conn.release();
        });
    })
})

// 获取列表
router.get('/list/:type', function getList (req, res) {
    var typeU = req.params.type || '';
    var params = typeU.split('.');
    var type = params[0].split('_');
    var search = req.url.split('search=');
    var slic = Math.floor(Math.random()*17);
    var listObj = {
        pageTitle: type[0]+'列表-言情小说吧',
        pageKeyword: '言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        pageDescrition: '欢迎阅读, 言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        host: 'http://'+req.headers['host'],
        menu: menu,
        type: type[0],
        videoList: videoList.slice(slic, slic+3),
        result: []
    }
    if (params.length < 2) {
        res.render('list', listObj);
        return;
    } 
    var numL = Number(type[1]) || 1;
    var limit = ((numL - 1) * 20) + ',' + 20;
    var sql = 'SELECT * FROM ' + type[0] + ' order by createTime desc limit ' + limit;
    var count = 'SELECT COUNT(*) FROM ' + type[0];
    if (search[1]) {
        sql = 'SELECT * FROM ' + type[0] + ' where title like "' +'%'+ decodeURI(search[1]) +'%'+ '" order by createTime desc limit ' + limit;
        count = 'SELECT COUNT(*) FROM ' + type[0] + ' where title like "' +'%'+ decodeURI(search[1]) +'%'+ '"';
    }
    if (type[0] == 'wumavideo' || type[0] == 'zipaivideo' || type[0] == 'sanjivideo') {
        console.log(req.headers['host']+req.url,  '===url')
    }
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL-list ==> " + err); 
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] -list ', err.message);
                res.render('list', listObj);
                conn.release();
            } else {
                conn.query(count, function (err, total) {
                    if (err) {
                        res.render('list', listObj);
                    } else {
                        listObj.result = result;
                        listObj.page = getPage(Number(total[0]['COUNT(*)']), numL, type[0], search[1]);
                        res.render('list', listObj);
                    }
                    conn.release();
                });
            }
        });
    })
})
function getPage(total, currentPage, type, pSearch) {
    var totalPage = 0;//总页数
    var pageSize = 20;//每页显示行数
    var pageUrl = '/list/' + type;
    var pageSearch = pSearch? '?search=' + pSearch : '';
    //总共分几页
    if(total/pageSize > parseInt(total/pageSize)){
        totalPage=parseInt(total/pageSize)+1;
    }else{
        totalPage=parseInt(total/pageSize);
    }
    var tempStr = "<span>共"+totalPage+"页</span>";
    if(currentPage>1){
        tempStr += "<a href="+ pageUrl + '.html' + pageSearch + ">首页</a>";
        tempStr += "<a href="+ pageUrl + '_' + (currentPage-1) + '.html' + pageSearch +">上一页</a>"
    }else{
        tempStr += "<span class='btn'>首页</span>";
        tempStr += "<span class='btn'>上一页</span>";
    }

    if (currentPage > 5 && currentPage < (totalPage -5)) {
        for(var pageIndex= currentPage - 5; pageIndex<currentPage+5;pageIndex++){
            tempStr += "<a class='"+ (pageIndex=== currentPage? 'active' : '') +"' href="+ pageUrl + '_' + pageIndex + '.html' + pageSearch +">"+ pageIndex +"</a>";
        }
    } else if (currentPage > (totalPage -5) && totalPage >= 10){
        for(var pageIndex= (totalPage - 9); pageIndex < totalPage+1;pageIndex++){
            tempStr += "<a class='"+ (pageIndex=== currentPage? 'active' : '') +"' href="+ pageUrl + '_' + pageIndex + '.html' + pageSearch +">"+ pageIndex +"</a>";
        }
    } else if (currentPage <= 5 && totalPage > 10) {
        for(var pageIndex= 1; pageIndex <= 10;pageIndex++){
            tempStr += "<a class='"+ (pageIndex=== currentPage? 'active' : '') +"' href="+ pageUrl + '_' + pageIndex + '.html' + pageSearch +">"+ pageIndex +"</a>";
        }
    } else {
        for(var pageIndex= 1; pageIndex <= totalPage;pageIndex++){
            tempStr += "<a class='"+ (pageIndex=== currentPage? 'active' : '') +"' href="+ pageUrl + '_' + pageIndex + '.html' + pageSearch +">"+ pageIndex +"</a>";
        }
    }

    if(currentPage<totalPage){
        tempStr += "<a href="+ pageUrl + '_' + (currentPage+1) + '.html' + pageSearch +">下一页</a>";
        tempStr += "<a href="+ pageUrl + '_' + totalPage + '.html' + pageSearch +">尾页</a>";
    }else{
        tempStr += "<span class='btn'>下一页</span>";
        tempStr += "<span class='btn'>尾页</span>";
    }

    return tempStr;
}

// 视频详情
router.get('/detail/:type/:id', function (req, res) {
    var id = req.params.id || '';
    var sql = 'SELECT * FROM detail WHERE createTime = "'+ id.replace('.html', '') + '"';
    var listObj = {
        pageTitle: '没找到数据-言情小说吧',
        pageKeyword: '言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        pageDescrition: '欢迎阅读, 言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        host: 'http://'+req.headers['host'],
        menu: menu,
        type: req.params.type,
        result: ''
    }
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> detail" + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - detail', err.message);
                res.render('detail', listObj);
            } else {
                if (result[0]) {
                    var slic = Math.floor(Math.random()*17);
                    var video = videoList.slice(slic, slic+3);
                    var sp = result[0].cont.split('</p>');
                    var len = sp.length;
                    var insi = Math.floor(Math.random()*len);
                    var cont = '<p>'
                    var ht = '';
                    for (var i = 0; i < video.length; i++) {
                        cont += '<a target="_blank" href="http://llh8.me/detail/'+video[i].createTime+'" title="'+video[i].title+'"><img src="'+video[i].img+'" alt="'+video[i].title+'"><br>'+video[i].title+'</a>'
                    }
                    for(var j = 0; j < len; j++) {
                        if (j === insi) {
                            ht += sp[j] +'</p>' + cont + '</p>';
                        } else {
                            ht += sp[j] +'</p>';
                        }
                    }
                    result[0].cont = ht;
                    listObj.result = result[0];
                    listObj.pageTitle = result[0].title;
                    res.render('detail', listObj);
                } else{
                    res.render('detail', listObj);
                }
            }
            conn.release();
        });
    })
})


router.get('*', function (req, res, next) {
    var listObj = {
        pageTitle: '言情小说吧404页面',
        pageKeyword: '言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        pageDescrition: '欢迎阅读, 言情小说吧/人妻熟女小说吧,家庭乱伦小说吧, 强奸孽待小说吧, 校园春色小说吧, 古典武侠小说吧, 卡通动漫小说吧, 名人明星小说吧, 都市言情小说吧, 经验故事小说吧 ,另类小说小说吧, 性知识小说吧,各种小说有你想要哦',
        host: 'http://'+req.headers['host']
    }
    res.status(404);
    res.render('404', listObj);
});

module.exports = router;
