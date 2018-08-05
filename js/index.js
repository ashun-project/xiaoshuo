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
let params = window.location.search.split('?');
let defaultUrl = '';
if (params && params.length > 1) defaultUrl = params[1];
getHtml(defaultUrl);

function getHtml(url) {
    ajax({  
        type: "get",
          url: "/api" + url,
          beforeSend: function () {},
            //some js code 
        success: function (msg) {
            let reTag = /<script(?:.|\s)*?<\/script>|<iframe(?:.|\s)*?<\/iframe>/ig;
            let nav = /<nav class="nav-primary"(?:.|\s)*?<\/nav>/g;
            let body = /<main class="content"(?:.|\s)*?<\/main>/g;
            let result1 = nav.exec(msg);
            let result2 = body.exec(msg);
            let html = '';
            let bodyer = document.getElementById('bodyer');
            document.documentElement.scrollTop=document.body.scrollTop=0;
            if (result1 && result1[0] && result2 && result2[0]) {
                html = (result1[0] + result2[0]).replace(reTag,'');
            }
            bodyer.innerHTML = html;
            setTimeout(() => {
                reset(bodyer);
            }, 30);
        },
        error: function () {    
            alert('获取资源失败，请切换其它资源');
            window.location.href = 'http://xjb520.com';
        }
    })
}
// 去除元素
function reset(dem) {
    // 过滤元素下载链接
    let divEles = dem.children;
    let imgs = dem.querySelectorAll('img');
    let getA = dem.querySelectorAll('a');

    if (divEles && divEles.length) {
        // 去除a链接
        for (var i = 0; i < getA.length; i++) {
            let href = getA[i].getAttribute('href');
            if (href.indexOf('http:') > -1 && href.indexOf('http://hhhbook.com') <= -1) {
                getA[i].parentNode.removeChild(getA[i]);
            } else {
                getA[i].setAttribute('my-data', href.replace('http://hhhbook.com', ''));
                getA[i].removeAttribute('href');
            }
        }
        // 添加完整的图片路径
        for (var i = 0; i < imgs.length; i++) {
            let src = imgs[i].getAttribute('src');
            if (src.indexOf('http') === -1) {
                imgs[i].setAttribute('src', '//hhhbook.com/' + src);
            }
            if (src.indexOf('.gif') > -1) {
                imgs[i].parentNode.removeChild(imgs[i]);
            }
        }
        getClike();
    } else {
        reset(dem);
    }
}

// 注册事件
function getClike() {
    let content = document.querySelectorAll('.bodyer a');
    let article = document.querySelectorAll('.bodyer article');
    // 判断是不是手机端
    let ua = navigator.userAgent;
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    let isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    let isAndroid = ua.match(/(Android)\s+([\d.]+)/);
    let isMobile = isIphone || isAndroid;
    successContent(content);
    successContent(article, true);
    

    function successContent(list, wrap) {
        for (let i = 0; i < list.length; i++) {
            list[i].onclick = function (event) {
                let hrf = decodeURIComponent(this.getAttribute('my-data'));
                let type = setType(this.parentNode);
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
        let num = 0;
        let type = '1';
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