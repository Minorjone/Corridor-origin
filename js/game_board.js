//1.公共变量声明
var playboard=new Image(),
    stairs=new Image(),
    stairs1=new Image(),
    stairs2=new Image(),
    child=new Image(),
    bagdroper=new Image(),
    neighbor1=new Image(),
    neighbor2=new Image(),
    old=new Image(),
    police=new Image(),
    thief=new Image(),
    me=new Image(),
    me_back=new Image(),
    bag=new Image(),
    handcuffs=new Image(),
    progress_bar=new Image(),
    progress_bar1=new Image(),
    back=new Image(),
    prize=new Image(),
    firstPrize=new Image(),
    secondPrize=new Image(),
    thirdPrize=new Image(),
    lastPrize=new Image(),
    help_button=new Image(),
    explain1=new Image(),
    explain2=new Image(),
    explain3=new Image(),
    explain4=new Image(),
    explain5=new Image(),
    explain6=new Image(),
    result,
    str1=["仁:","义:","礼:","智:","信:"],
    total_score=0,
    flag_game=0,//游戏开始表示
    level=1,//表示关卡数
    score_x=62,//分数进度条初始位置
    score_step_x=29;//每增加一分分数移动距离

//楼道相关横坐标
var stairs_area=[{
    x_1:260,//楼梯第一个点
    x_2:458,//楼梯第二个点
    x_3:657,//楼梯第三个点
    x_4:855,//楼梯第四个点
    x1:359, //楼梯第一列中点
    x2:557, //楼梯第二列中点
    x3:756  //楼梯第三列中点
}];

//分数的y坐标
var score_y=[{
    y:182    //仁
},{
    y:236    //义
},{
    y:293    //礼
},{
    y:349    //智
},{
    y:404    //信
}],
//后退图标
back_area={
    x1:20,
    y1:20,
    x2:70,
    y2:70
},
help_area={
    x1:20,
    y1:20,
    x2:75,
    y2:70
};

var objects=[];//用来存放楼道上所除主人公外的所有物体

//2.函数定义块

//游戏界面淡入函数
function play_board_fadein(){
    var time=+new Date();
    context.globalAlpha=opacity;
    draw_game_background();
    if(time-lastUpdate>INTERVAL){
        opacity+=OP_STEP;
        context.globalAlpha=opacity;
        lastUpdate=time;
    }
    if(opacity<1)
        requestNextAnimationFrame(play_board_fadein);
    else{
        lastUpdate=0;
        opacity=1;
        flag_game=1;
        time_countdown(); //游戏动画的实现过程，详见count_down.js
    }
}

//重绘游戏界面
function draw_game_background(){
    context.clearRect(0,0,canvas.width,canvas.height);
    draw_score();
    context.drawImage(playboard,0,0,playboard.width,playboard.height);
    //所在楼梯阶数
    if(level===1)
        context.drawImage(stairs,-10,70,stairs.width,stairs.height);
    else if(level===2)
        context.drawImage(stairs1,-10,70,stairs1.width,stairs1.height);
    else if(level===3)
        context.drawImage(stairs2,-10,70,stairs2.width,stairs2.height);
    draw_num();
    context.drawImage(bag,910,97,70,70);
    context.drawImage(handcuffs,898,242,96,60);
    draw_time_countdown();//在淡入的过程中，没有计时，是为了防止淡入时没有计时器而淡入结束后突然出现的过渡
}

//头像名字绘制
function draw_Icon(){
    context.drawImage(me,265,300,165,165);
    context.save();
    context.font="1.5em 微软雅黑";
    x=350-context.measureText(username).width/2;
    context.fillText(username,x,500);
    context.restore();
}

//绘制道具数量
function draw_num(){
    context.save()
    context.fillStyle="black";
    context.font="1.1em arial";
    context.fillText(bag_have,976,172);
    context.fillText(handcuffs_num,978,315);
    context.restore();
}

//分数进度绘制
function draw_score(){
var s_x,s_y;
    for(i=0;i<=4;i++){
        s_x=score_x;
        for(j=0;j<scoreArray[i].score;j++){
            context.drawImage(progress_bar,s_x,score_y[i].y,29,25);
            s_x+=score_step_x;
        }
    }
}

//奖状背景淡入函数
function log_bg_fadein1(){
    var time=+new Date();
    context.globalAlpha=opacity;
    log_bg_repaint();
    if(time-lastUpdate>INTERVAL){
        opacity+=OP_STEP;
        context.globalAlpha=opacity;
        lastUpdate=time;
    }
    if(opacity<1)
        requestNextAnimationFrame(log_bg_fadein1);
    else{
        lastUpdate=0;
        opacity=1;
        score_board_flyin();
    }
}

//奖状进入
function score_board_flyin(){
    log_bg_repaint();
    context.drawImage(prize,prize_x1,prize_y1,800,580);
    if(prize_y1<prize_fly_area.y2){
        prize_y1+=67.4;
        requestNextAnimationFrame(score_board_flyin);
    }
    else{
        show_score_flag=1;
        draw_prize();
    }
}

//奖状退出
function score_board_flyout(){
    log_bg_repaint();
    context.drawImage(prize,prize_x1,prize_y1,800,580);
    if(prize_y1>prize_fly_area.y1){
        prize_y1-=67.4;
        requestNextAnimationFrame(score_board_flyout);
    }
    else{
        log_pic_flyin();
    }
}

//游戏结束
function game_over(){
    flag_game=0;//退出游戏运行状态
    k=objects.length;
    objects.splice(0,k);//清空objects数组
    pls.value="";//重置用户名输入框
    me_x=505;//重置主人公位置
    me_y=650;
    if(bag_have)
        scoreArray[4].score=scoreArray[4].score-bag_have;
    if(scoreArray[4].score<1)
        scoreArray[4].score=1;
    bag_num=0;
    bag_have=0;
    handcuffs_num=0;
    info_box.style.display="none";
    in_fop.innerHTML="";//清空游戏提示框
    opacity=0;
    level=1;
    for(var i=0;i<12;i++){
        for(var j=0;j<3;j++){
            obj_position[i][j]=0;
        }
    }
    log_bg_fadein1();
}

//分数评定
function get_result(){
    for(i=0;i<5;i++){
        if(scoreArray[i].score>=3)
            total_score++;
    }
    if(total_score<3)
        result=lastPrize;
    else if(total_score==3)
        result=thirdPrize;
    else if(total_score==4)
        result=secondPrize;
    else if(total_score==5)
        result=firstPrize;
}

//绘制奖状
function draw_prize(){
var c_x=485,
    c_y=300,
    step_c_y;
    draw_Icon();
    context.save();
    back_Icon();
    context.font="1.5em 微软雅黑";
    for(i=0;i<5;i++){
        c_x=485
        context.fillText(str1[i],c_x-10,c_y+21);
        for(j=0;j<scoreArray[i].score;j++){
            context.drawImage(progress_bar1,c_x+38,c_y,29,25);
            c_x+=score_step_x;
        }
        str=scoreArray[i].score+"分";
        x=730-context.measureText(str).width/2;
        context.fillText(str,x,c_y+21);
        c_y+=50;
    }
    context.restore();
    get_result();
    context.drawImage(result,525,465,310,200);
}

//绘制后退图标
function back_Icon(){
    context.drawImage(back,20,20,50,50);
}

//绘制帮助按钮
function help_Icon() {
    context.drawImage(help_button,20,20,55,50);
}

//3.事件注册块

//4.初始化块
playboard.src="images/playboard.png";
stairs.src="images/stairs.png";
child.src="images/characters/child.png";
bagdroper.src="images/characters/bagdroper.png";
neighbor1.src="images/characters/neighbor1.png";
neighbor2.src="images/characters/neighbor2.png";
old.src="images/characters/old.png";
police.src="images/characters/police.png";
thief.src="images/characters/thief.png";
me.src="images/characters/me.png";
me_back.src="images/characters/me_back.png";
bag.src="images/tools/bag.png";
handcuffs.src="images/tools/handcuffs.png";
progress_bar.src="images/progress_bar.png";
back.src="images/back.png";
stairs1.src="images/stairs1.png";
stairs2.src="images/stairs2.png";
prize.src="images/prize/prize.jpg";
firstPrize.src="images/prize/first.png";
secondPrize.src="images/prize/second.png";
thirdPrize.src="images/prize/third.png";
lastPrize.src="images/prize/last.png";
progress_bar1.src="images/progress_bar1.png";
help_button.src="images/help_button.png";
explain1.src="images/explain/explain1.png";
explain2.src="images/explain/explain2.png";
explain3.src="images/explain/explain3.png";
explain4.src="images/explain/explain4.png";
explain5.src="images/explain/explain5.png";
explain6.src="images/explain/explain6.png";