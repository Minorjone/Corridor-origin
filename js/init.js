/*******************************初始化界面和交互********************************/
//包括如下内容：
//1.获取canvas对象
//2.canvas鼠标操作
//3.canvas键盘输入获取
//4.canvas默认文字居中样式
//5.游戏背景绘制动画
var canvas = document.getElementById('canvas'),
    context= canvas.getContext('2d'),
    offScreenCanvas = document.getElementById('canvas1'),
    offScreenContext = canvas1.getContext('2d'),
    log_bg_img = new Image(),
    opacity = 0,
    OP_STEP = 0.08,
    lastUpdate = 0,
    INTERVAL = 50;

//登陆背景重绘
function log_bg_repaint(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(log_bg_img, 0, 0, canvas.width, canvas.height);
}

//登陆背景淡入函数
function log_bg_fadein(){
    var time = +new Date();
    context.globalAlpha=opacity;
    log_bg_repaint();
    if(time-lastUpdate>INTERVAL){
        opacity += OP_STEP;
        context.globalAlpha=opacity;
        lastUpdate=time;
    }
    if(opacity<1)
        requestNextAnimationFrame(log_bg_fadein);
    else{
        lastUpdate=0;
        opacity=1;
        log_pic_flyin();
    }
}

//登陆背景淡出函数
function log_bg_fadeout(){
    var time=+new Date();
    context.globalAlpha=opacity;
    log_bg_repaint();
    if(time-lastUpdate>INTERVAL){
        opacity-=OP_STEP;
        context.globalAlpha=opacity;
        lastUpdate=time;
    }
    if(opacity>0)
        requestNextAnimationFrame(log_bg_fadeout);
    else{
        lastUpdate=0;
        opacity=0;
        //info_box.style.display="block";
        $("#info_box").fadeIn();
        play_board_fadein();
    }
}

//canvas单击事件注册
canvas.onclick=function(e){
    var loc=windowToCanvas(e.clientX, e.clientY);
    e.preventDefault();
    onclick(loc);
}

//canvas悬停事件注册
canvas.onmousemove = function (e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    mousemove(loc);
}

//登录图片加载完成事件注册
log_bg_img.onload = function (e) {
    log_bg_fadein();
}

//键盘监听事件注册
canvas.addEventListener('keydown', player_input, true);// key event - use DOM element as object
canvas.focus();  
window.addEventListener('keydown', player_input, true);// key event - use window as object

//4.初始化块
context.textAlign='middle';
context.textBaseline='center';