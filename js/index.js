function ajax() {  
    var ajaxData = {    
        type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function () {},
            success: arguments[0].success || function () {},
            error: arguments[0].error || function () {}  
    }; 
    ajaxData.beforeSend(); 
    var xhr = createxmlHttpRequest();   
    xhr.responseType = ajaxData.dataType;  
    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);   
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);   
    xhr.send(convertData(ajaxData.data));   
    xhr.onreadystatechange = function () {     
        if (xhr.readyState == 4) {       
            if (xhr.status == 200) {
                ajaxData.success(xhr.response);      
            } else {        
                ajaxData.error();      
            }     
        }  
    } 
};
function createxmlHttpRequest() {   
    if (window.ActiveXObject) {     
        return new ActiveXObject("Microsoft.XMLHTTP");   
    } else if (window.XMLHttpRequest) {     
        return new XMLHttpRequest();   
    } 
}; 
function convertData(data) {  
    if (typeof data === 'object') {    
        var convertResult = "";     
        for (var c in data) {       
            convertResult += c + "=" + data[c] + "&";     
        }     
        convertResult = convertResult.substring(0, convertResult.length - 1);   
        return convertResult;  
    } else {    
        return data;  
    }
};

// 内容
// 判断是不是手机端
var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
var isAndroid = ua.match(/(Android)\s+([\d.]+)/);
var isMobile = isIphone || isAndroid;
var params = window.location.search.split('?');
var defaultUrl = '';
var bodyer = document.getElementById('bodyer');
var mySpare = document.getElementById('my-spare');
if (params && params.length > 1) defaultUrl = params[1];
getHtml(defaultUrl);

function getHtml(url) {
    ajax({  
        type: "get",
          url: "/api" + url,
          beforeSend: function () {},
            //some js code 
        success: function (msg) {
            var reTag = /<link(?:.|\s)*?>|<script(?:.|\s)*?<\/script>|<iframe(?:.|\s)*?<\/iframe>/ig;
            document.documentElement.scrollTop=document.body.scrollTop=0;
            mySpare.innerHTML = msg.replace(reTag,'');
            setTimeout(function() {
                reset();
            }, 30);
        },
        error: function () {    
            alert('获取资源失败，请切换其它资源');
            window.location.href = 'http://xjb520.com';
        }
    })
}
// 去除元素
function reset() {
    // 过滤元素下载链接
    var divEles = mySpare.children;
    var imgs = mySpare.querySelectorAll('img');
    var getA = mySpare.querySelectorAll('a');

    if (divEles && divEles.length) {
        // 去除a链接
        for (var i = 0; i < getA.length; i++) {
            var href = getA[i].getAttribute('href');
            if (href.indexOf('http:') > -1 && href.indexOf('http://hhhbook.com') <= -1) {
                getA[i].parentNode.removeChild(getA[i]);
            } else {
                getA[i].setAttribute('my-data', href.replace('http://hhhbook.com', ''));
                getA[i].removeAttribute('href');
            }
        }
        // 添加完整的图片路径
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getAttribute('src');
            if (src.indexOf('http') === -1) {
                imgs[i].setAttribute('src', '//hhhbook.com/' + src);
            }
            if (src.indexOf('.gif') > -1) {
                imgs[i].parentNode.removeChild(imgs[i]);
            }
        }
        
        var nav = mySpare.querySelector('nav.nav-primary');
        var body = mySpare.querySelector('main.content');
        bodyer.innerHTML = '';
        bodyer.appendChild(nav);
        bodyer.appendChild(body);
        mySpare.parentNode.removeChild(mySpare);
        getClike();
    } else {
        reset();
    }
}

// 注册事件
function getClike() {
    var content = document.querySelectorAll('.bodyer a');
    var article = document.querySelectorAll('.bodyer article');
    successContent(content);
    successContent(article, true);
    

    function successContent(list, wrap) {
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = function (event) {
                var hrf = decodeURIComponent(this.getAttribute('my-data'));
                var type = setType(this.parentNode);
                if (wrap) {
                    hrf = decodeURIComponent(this.getElementsByTagName('a')[0].getAttribute('my-data'));
                }
                if (type === '1' && !wrap) {
                    if (hrf === '/') {
                        window.location.href = hrf;
                    } else {
                        window.location.href = '/?'+hrf;
                    }
                } else {
                    if (isMobile) {
                        window.location.href = '/detail.html?' + hrf;
                    } else {
                        window.open('/detail.html?' + hrf);
                    }
                }
                event.cancelBubble = true;
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }
    // 循环10次获取父元素    
    function setType (parent){
        var num = 0;
        var type = '1';
        getParent(parent);

        function getParent(p) {
            if (p.nodeName !== 'ARTICLE') {
                if(num >= 10 || !p.parentNode) return;
                num++;
                getParent(p.parentNode);
            } else {
                type = '2';
            }
        }
        return type;
    }
}