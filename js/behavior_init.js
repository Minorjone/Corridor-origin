var obj_position=new Array();//11*3的二维数组声明
    for(var i=0;i<12;i++){
        obj_position[i]=new Array();
        for(var j=0;j<3;j++){
            obj_position[i][j]=0;
        }
    }

var rand_col,//随机列数
    begin_x=300,//初始x位置
    step_x=205,//每次移动x轴的距离
    step_y=65,//每次移动y轴的距离
    temp_x1,//产生新物体的左上坐标和长宽
    temp_y1=0,
    temp_width=110,
    temp_height=110,
    y_start=0,
    y_end=650,
    i,j,k,
    str,
    check_flag=0,
    hello_flag=0,
    around_flag=1,//绕道flag
    move_lock=0,//如果执行行为,则置为1锁定主人公的移动
    index,//存放主人公面前物体的下面
    move_flag=1,//主人公移动标志 1移动 0不移动
    turn_flag=0,//绕道标志  0不绕 1左绕 2右绕
    move_keycode=0,//存放移动指令
    act_keycode=0,//存放行为指令
    me_x=505,//主人公的坐标
    me_y=650;

var scoreArray=[{
    name:"仁",
    score:1    //仁的分数
},{
    name:"义",
    score:1    //义的分数
},{
    name:"礼",
    score:1    //礼的分数
},{
    name:"智",
    score:1    //智的分数
},{
    name:"信",
    score:1    //信的分数
}];


//用来确定产生物体初始位置的函数
function random_column(){
    rand_col=Math.ceil(Math.random()*3);//产生1-3的随机数
    if(rand_col==1){
        temp_x1=300;
        temp_y1=-65;
    }
    else if(rand_col==2){
        temp_x1=505;
        temp_y1=-65;
    }
    else if(rand_col==3){
        temp_x1=710;
        temp_y1=-65;
    }
}

//物体产生控制函数
function create_objects(){
    count_down_time=count_down_time_sec+count_down_time_min*10;//剩余时间
    if(count_down_time==24||count_down_time==48||count_down_time==63||count_down_time==9){//出现4次警察
        temp_id=6;
        temp_img=police;
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1});
    }
    else if(count_down_time==15||count_down_time==42||count_down_time==57){//出现3次小偷
        temp_id=7;
        temp_img=thief;
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1});
    }
    else{//全程
        if(count_down_time%3==0)
            create_character1();
    }
}

//物体绘制函数
function draw_objects(){
    k=objects.length;
    draw_game_background();//重绘游戏界面
    while(k--){
        if(objects[k].y1!=-65){
            if(objects[k].id!=8)
                context.drawImage(objects[k].Img,objects[k].x1,objects[k].y1,objects[k].width,objects[k].height);
            //绘制的是钱包
            else
                context.drawImage(objects[k].Img,objects[k].x1-15,objects[k].y1+65,objects[k].width,objects[k].height);
        }
    }
}

//物体更新函数
function objects_update(){
    k=objects.length;
    while(k--){
        if(objects[k].id!=8){//对非钱包物体进行前进、绕道判断
            normal_meeting_judge(objects[k].x1,objects[k].y1,k);
            around_way1(k);
        }
        if(objects[k].id===3&&objects[k].y1>step_y&&objects[k].y1<y_end/2&&objects[k].bagdrop===0&&objects[k].font===1)// 是掉包邻居且在1/10到1/2内,还未掉过包
            drop_bag(k);
        if((objects[k].id===1||objects[k].id===2)&&objects[k].getIn===1)//玩家前面有挡道的邻居1、2
            getIn_way(k);
        if(objects[k].y1<y_end&&objects[k].font===1&&objects[k].id!=8){//在两个判断后物体仍然前进
            i=(objects[k].y1+65)/65;
            j=(objects[k].x1-300)/205;
            if(turn_flag==0){//未绕道
                obj_position[i][j]=0;
                obj_position[i+1][j]=1;
            }
            else if(turn_flag==1){//左绕道
                obj_position[i][j+1]=0;
                obj_position[i+1][j]=1;
            }
            else if(turn_flag==2){//右绕道
                obj_position[i][j-1]=0;
                obj_position[i+1][j]=1;
            }
            objects[k].y1+=step_y;//向下65像素
        }
        else if(objects[k].y1===650&&objects[k].id!=8){
            i=(objects[k].y1+65)/65;
            j=(objects[k].x1-300)/205;
            obj_position[i][j]=0;
            objects.splice(k,1);
        }
        else if(objects[k].font===0){
            i=(objects[k].y1+65)/65;
            j=(objects[k].x1-300)/205;
            obj_position[i][j]=1;
        }
        if(objects[k].x1==me_x&&objects[k].y1==me_y-65&&objects[k].id!=8){
            if(objects[k].id===1||objects[k].id===2){//邻居1、2在玩家前面且没打招呼
               if(hello_flag==0){
                    objects[k].font=0;
                    objects[k].getIn=1;
                }
                else{
                    objects[k].getIn=0;
                    objects[k].font=1;
                }
            }
        }
        hello_flag=0;
    }
}

//绘制主人公函数
function draw_me(){
    context.drawImage(me_back,me_x,me_y,110,110);
    move_keycode=0;
    act_keycode=0;
}

//主人公的输入控制函数
function player_input(e){//键盘输入事件响应函数
    var keyID = e.keyCode ? e.keyCode :e.which;
    if(flag_game==1){
        if(keyID === 38 || keyID === 87 || keyID === 39 || keyID === 68 || // up arrow and W , right arrow and D
         keyID === 40 || keyID === 83 || keyID === 37 || keyID === 65){ // down arrow and S , left arrow and A
            move_keycode=keyID;
            e.preventDefault();
        }
        else if(keyID === 90 || keyID === 88 || keyID === 67 || keyID === 86 || keyID === 72 || keyID === 74 || keyID === 75 || keyID === 76 || keyID === 32){ // Z, X, C, V, H, J, K, L, spacebar
            act_keycode=keyID;
            e.preventDefault();
        }
    }
}

function position_reset () {
    for(var i=0;i<12;i++){
        for(var j=0;j<3;j++){
            obj_position[i][j]=0;
        }
    }
    k=objects.length;
    while(k--){
        i=(objects[k].y1+65)/65;
        j=(objects[k].x1-300)/205;
        obj_position[i][j]=1;
    }
}