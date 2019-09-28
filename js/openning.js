//1.公共变量声明
var log_glasspane = document.getElementById ('username_input'),
    pls = document.getElementById ('pls'),
    info_box=document.getElementById ('info_box'),
    in_fop=document.getElementById ('in_fop'),
    log_x1=-10,
    log_y1=-577,
    log_pic=new Image(),//输入框
    log_pic_active=new Image(),//输入框按钮选中时
    prize_x1=112,
    prize_y1=-580,
    help_index=0,
    help_flag=0,//判断是否显示帮助页面，0：不显示，1：显示
    show_score_flag=0,//判断是否显示成绩展示页面，0：不显示，1：显示
    log_pic_flag=0;//判断文本框是否显示，0：不显示，1：显示
    
    
var username;

var log_fly_area={
    x1:-10,
    y1:-577,
    x2:-10,
    y2:-70
},
//奖状位置
prize_fly_area={
    x1:112,
    y1:-580,
    x2:112,
    y2:92
},
start_button_area={
    x1:400,
    y1:456,
    x2:602,
    y2:525
},
left_arrow={
    x1:134,
    y1:367,
    x2:184,
    y2:411
},
right_arrow={
    x1:840,
    y1:365,
    x2:895,
    y2:411
};

//2.函数定义块

//登陆文本框进入
function log_pic_flyin(){
    log_bg_repaint();
    context.drawImage(log_pic,log_x1,log_y1,log_pic.width,log_pic.height);
    if(log_y1<log_fly_area.y2){
        log_y1+=50.7;
        requestNextAnimationFrame(log_pic_flyin);
    }
    else{
        log_pic_flag=1;
        log_glasspane.style.display="block";
        pls.focus();
        if(help_flag==0)
            help_Icon();
    }
}

//登陆文本框退出
function log_pic_flyout(){
    log_bg_repaint();
    context.drawImage(log_pic,log_x1,log_y1,log_pic.width,log_pic.height);
    if(log_y1>log_fly_area.y1){
        log_y1-=50.7;
        requestNextAnimationFrame(log_pic_flyout);
    }
    else{
        log_bg_fadeout();
        for(var i=0;i<5;i++){
            scoreArray[i].score=1;
        }
    }
}

//登陆按钮单击
function log_button_click(x,y){
    if(x>start_button_area.x1&&x<start_button_area.x2&&y>start_button_area.y1&&y<start_button_area.y2)
        check_usr(pls);//用户名输入检测
}

//input键盘Enter事件
function log_btn_click(){
    check_usr(pls);
}

//文本提示数输出
function drawText(string){
    context.save();
    context.fillStyle='red';
    context.fillText(string,400,400);
    console.log(string);
    context.restore();
}

//登录按钮悬停变化
function log_button_change(x,y){
    if(x>start_button_area.x1&&x<start_button_area.x2&&y>start_button_area.y1&&y<start_button_area.y2){
        log_bg_repaint();
        context.drawImage(log_pic_active,log_x1,log_y1,log_pic_active.width,log_pic_active.height);
    }
    else{
        log_bg_repaint();
        context.drawImage(log_pic,log_x1,log_y1,log_pic.width,log_pic.height);
    }
}

//单击帮助按钮
function help_click(x,y){
    if(x>help_area.x1&&x<help_area.x2&&y>help_area.y1&&y<help_area.y2){
        help_flag=1;
        log_glasspane.style.display="none";
        draw_help(help_index);
    }
}

//绘制帮助页面
function draw_help(index){
    log_bg_repaint();
    back_Icon();
    if(index==0)
        context.drawImage(explain1,112,94);
    else if(index==1)
        context.drawImage(explain2,112,94);
    else if(index==2)
        context.drawImage(explain3,112,94);
    else if(index==3)
        context.drawImage(explain4,112,94);
    else if(index==4)
        context.drawImage(explain5,112,94);
    else if(index==5)
        context.drawImage(explain6,112,94);
}

//单击下一页或上一页
function help_next(x,y){
    if(help_index!=5){
        if(x>right_arrow.x1&&x<right_arrow.x2&&y>right_arrow.y1&&y<right_arrow.y2){
            help_index++;
            draw_help(help_index);
        }
    }
    if(help_index!=0){
        if(x>left_arrow.x1&&x<left_arrow.x2&&y>left_arrow.y1&&y<left_arrow.y2){
            help_index--;
            draw_help(help_index);
        }
    }
}

//单击返回重玩按钮
function back_click(x,y){
    if(x>back_area.x1&&x<back_area.x2&&y>back_area.y1&&y<back_area.y2){
        //从游戏结束页面重回游戏开始处
        if(help_flag==0){
            score_board_flyout();
            total_score=0;
            show_score_flag=0;
        }
        //从帮助页面重回游戏开始处
        else{
            help_flag=0;
            help_index=0;
            log_y1=-577;
            log_pic_flyin();
        }
    }
}

//canvas的鼠标单击函数
function onclick(loc){
    if(log_pic_flag==1&&help_flag==0){
        log_button_click(loc.x,loc.y);
        help_click(loc.x,loc.y);
    }
    else if(help_flag==1){
        back_click(loc.x,loc.y);
        help_next(loc.x,loc.y);
    }
    else if(show_score_flag==1){
        back_click(loc.x,loc.y);
    }
}

//canvas的鼠标悬停函数
function mousemove(loc){
    if(log_pic_flag==1&&help_flag==0){
        log_button_change(loc.x,loc.y);
        help_Icon();
    }
}

//3.事件注册块

log_pic.src="images/login1.png";
log_pic_active.src="images/login2.png";