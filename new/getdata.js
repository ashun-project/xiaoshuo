var request = require("request");
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
var mysql = require('mysql');
var dtNum = 0;
var arr = [];
var listType = [
    {name: 'renqi', url: '/post/category/%E4%BA%BA%E5%A6%BB%E7%86%9F%E5%A5%B3', num: 2},//58
    {name: 'luanlun', url: '/post/category/%E5%AE%B6%E5%BA%AD%E4%BA%82%E5%80%AB', num: 2},//119
    {name: 'qiangbao', url: '/post/category/%E5%BC%B7%E6%9A%B4%E8%99%90%E5%BE%85', num: 2},//42
    {name: 'xiaoyuan', url: '/post/category/%E6%A0%A1%E5%9C%92%E5%B8%AB%E7%94%9F', num: 2},//50
    {name: 'gudian', url: '/post/category/%E6%AD%A6%E4%BF%A0%E7%A7%91%E5%B9%BB', num: 2},//30
    {name: 'dongman', url: '/post/category/%E5%8B%95%E6%BC%AB%E6%94%B9%E7%B7%A8', num: 2},//31
    {name: 'mingxin', url: '/post/category/%E5%90%8D%E4%BA%BA%E6%98%8E%E6%98%9F', num: 2},//25
    {name:'dushi', url: '/post/category/%E9%83%BD%E5%B8%82%E7%94%9F%E6%B4%BB', num: 2},//46
    {name:'gushi', url: '/post/category/%E7%B6%93%E9%A9%97%E6%95%85%E4%BA%8B', num: 2},//23
    {name:'linglei', url: '/post/category/%E5%8F%A6%E9%A1%9E%E5%85%B6%E5%AE%83', num: 2},//23
    {name:'zishi', url: '/post/category/%E6%80%A7%E7%9F%A5%E8%AD%98', num: 2}//23
];
var typeNum = 0;
var num = listType[typeNum].num;
var ip = [
    '14.192.76.22',
    '27.54.72.21',
    '27.224.0.14',
    '36.0.32.19',
    '36.37.40.21',
    '36.96.0.11',
    '39.0.0.24',
    '39.0.128.17',
    '40.0.255.24',
    '40.251.227.24',
    '42.0.8.21',
    '42.1.48.21',
    '42.1.56.22',
    '42.62.128.19',
    '42.80.0.15',
    '42.83.64.20',
    '42.96.96.21',
    '42.99.112.22',
    '42.99.120.21',
    '42.100.0.14',
    '42.157.128.20',
    '42.187.96.20',
    '42.194.64.18',
    '42.248.0.13',
    '43.224.212.22',
    '43.225.236.22',
    '43.226.32.19',
    '43.241.88.21',
    '43.242.64.22',
    '43.247.152.22',
    '45.116.208.24',
    '45.120.243.24'
];
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'xiaosho'
});

var poolVip = mysql.createPool({
    host: '103.104.104.81',
    user: 'root',
    password: 'ashun666',
    port: '3306',
    database: 'user'
});

function jtpy(){
    return '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';
}
function ftpy(){
    return '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';
}
//功能：繁体字符转为简体字符；
function t2s(cc){
    var str='',ss=jtpy(),tt=ftpy();
    for(var i=0;i<cc.length;i++){
        var c = cc.charAt(i);
        if(c.charCodeAt(0)>10000&&tt.indexOf(c)!=-1){
            str+=ss.charAt(tt.indexOf(c));
        } else {
            str+=c;
        };
    }
    return str;
}

function getAjax(url) {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            gzip: true,
            encoding: null,
            headers: {
                "X-Forwarded-For": ip[Math.floor(Math.random()*ip.length)] || '42.194.64.18',
                'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'referer': 'http://www.h528.com/post/category/%e6%80%a7%e7%9f%a5%e8%ad%98',
            }
        };
        request(options, function (error, response, body) {
            try {
                if (error) throw error;
                var buf = iconv.decode(body, 'UTF-8');//获取内容进行转码
                var buf2 = t2s(buf);
                $ = cheerio.load(buf2);
                resolve();
            } catch (e) {
                console.log(e)
                reject(e);
            }
        })
    });
}

function getList () {
    var url = 'http://www.h528.com'+ listType[typeNum].url + (num ? '/page/'+ num : '');
    getAjax(url).then(function (){
        var li = $('#content .post');
        var time = '';
        var title = '';
        var url = '';
        var txt  = '123';
        for (var i = 0; i < li.length; i++) {
            time = new Date().getTime()+i;
            title = $(li[i]).find('table h3 a').text();
            url = $(li[i]).find('table h3 a').attr('href');
            arr.push([time, url, title, txt]);
        }
        if (num > 1) {
            console.log('current page is========', num);
            num--;
            getList();
        } else {
            if (arr.length) {
                var nArr = JSON.parse(JSON.stringify(arr));
                arr = [];
                dtNum = 0;
                listArr(nArr);
            }
        }
    }, function () {
        getList();
    });
}

function listArr (newArr) {
    if (dtNum < newArr.length) {
        var sql = 'select * from '+ listType[typeNum].name +' where url =' + '"' + newArr[dtNum][1] +'"';
        pool.getConnection(function (err, conn) {
            if (err) console.log("detail ==> " + err);
            conn.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log('[newArr-error] - ', err.message);
                    conn.release();
                    dtNum++;
                    listArr(newArr);
                } else {
                    if (rows.length) {
                        // console.log(rows);
                        dtNum++;
                        conn.release();
                        listArr(newArr);
                    } else {
                        var sql = "INSERT INTO "+ listType[typeNum].name +"(createTime, url, title, cont) VALUES (?,?,?,?)";
                        conn.query(sql, newArr[dtNum], function (err, rows, fields) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                dtNum++;
                                listArr(newArr);
                            } else {
                                dtNum++;
                                listArr(newArr);
                            }
                            conn.release();
                        });
                    }
                }
            });
        });
    } else {
        console.log('get list end=', newArr.length);
        getDetail();
    }
}

function getDetail() {
    var sql = 'select * from '+ listType[typeNum].name +' order by createTime desc limit 0,60';
    // var sql = 'select * from '+ listType[typeNum].name;
    pool.getConnection(function (err, conn) {
        if (err) console.log("detail ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                dtNum = 0;
                getDetail([]);
            } else {
                if (rows.length) {
                    dtNum = 0;
                    detailList(rows);
                }
            }
            conn.release();
        });
    });
}

function detailList (list) {
    if (dtNum === list.length) {
        console.log('end--', dtNum, 'current-time--', new Date().getTime());
        typeNum++;
        if (typeNum === listType.length) {
            var date = new Date();
            var timeS = new Date(date.getFullYear() +'-' + (date.getMonth()+1) + '-' + date.getDate() + ' 23:00:00').getTime();
            getUser();
            setTimeout(function () {
                typeNum = 0;
                num = listType[typeNum].num;
                getList();
            }, timeS - date.getTime() + (2*60*60*1000)); // 凌晨一点更新重新调  
        } else {
            num = listType[typeNum].num;
            getList();
        }
    } else {
        var sql = 'select * from detail where url ="' + list[dtNum].url +'" and type = "'+ listType[typeNum].name +'"';
        pool.getConnection(function (err, conn) {
            if (err) console.log(listType[typeNum].name+"detail ==> " + err);
            conn.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log('[chear ERROR] - ', err.message);
                    dtNum++;
                    conn.release();
                    detailList(list);
                } else {
                    if (rows.length) {
                        dtNum++;
                        conn.release();
                        detailList(list);
                    } else {
                        getAjax(list[dtNum].url).then(function () {
                            var listP = $('.post .entry');
                            $('img', listP).each(function() {
                                $(this).remove();
                            });
                            $('a', listP).attr('href', 'javascript:void(0);');
                            $('table', listP).remove();
                            $('center', listP).remove();
                            $('.postmetadata', listP).remove();
                            var sql = "INSERT INTO detail(createTime,url,title,cont,type) VALUES (?,?,?,?,?)";
                            var txtdetal = t2s($(listP).html());
                            conn.query(sql, [list[dtNum].createTime, list[dtNum].url, list[dtNum].title, txtdetal, list[dtNum].type], function (err, rows, fields) {
                                if (err) {
                                    console.log('[SELECT ERROR] - ', err.message);
                                }else{
                                    console.log('add number'+dtNum+'data success');
                                }
                                conn.release();
                            });
                            dtNum++;
                            detailList(list);
                        }, function () {
                            detailList(list);
                        });
                    }
                }
            });
        }); 
    }
}

function getUser () {  
    var sql = 'select * from list';
    poolVip.getConnection(function (err, conn) {
        if (err) console.log("detail ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (!err) {
                if (rows.length) {
                    var arr = [];
                    for(var i = 0; i  < rows.length; i++) {
                        arr.push([
                            rows[i].userName || '', 
                            rows[i].password || '',
                            rows[i].startDate || '', 
                            rows[i].endDate || '',
                            rows[i].total || '',
                            rows[i].type || '',
                            rows[i].balance || '',
                            rows[i].auth || ''
                        ]);
                    }
                    deUp(arr)
                }
            } 
            conn.release();
        });
    });
}
function deUp (rows) {
    var sqlDe = 'DELETE FROM user_list';
    var sqlIn = "INSERT INTO user_list(userName, password, startDate, endDate, total, type, balance, auth) VALUES ?";
    pool.getConnection(function (err, conn) {
        if (err) console.log("detail ==> " + err);
        conn.query(sqlDe, function (err, result, fields) {
            if (err) {
                console.log('user-lsit', err);
                conn.release();
            } else {
                conn.query(sqlIn, [rows], function (err, result2, fields) {
                    if (err) console.log('user-lsit2', 123);
                    conn.release();
                });
            }
        });
    });
}

function getRepeat () {
    var sql = "select * from list where title in (select title from list group by title having count(title)>1)";
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (err) console.log('[chear ERROR] - ', err.message);
            console.log(rows, '=======');
            conn.release();
        });
    });
}
function deleteNot() {
    var sql = 'SELECT list.* FROM list LEFT JOIN defDetail ON list.createTime = defDetail.createTime WHERE defDetail.createTime is null';
    var delSql = 'DELETE list FROM list LEFT JOIN defDetail ON list.createTime = defDetail.createTime WHERE defDetail.createTime is null';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (err) console.log('[chear ERROR] - ', err.message);
            console.log(rows.length, '=======');
            conn.release();
        })
    });
}
// deleteNot()
getList();