//随机产生物体、物体更新和主人公的js
//主人公共有上下左右四种移动方式
// z , x , c , v , spacebar 五种行为
// 

//主人公行为函数
function player_act(ID){
    k=objects.length;
    if(k>0){
        while(k--){//判断主人公前一位置是否有物体
            if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65){
                index=k;
            }
        }
        if(index>=0){//若有
            if(ID === 90 || ID === 72){// Z , H 抓小偷
                catch_thief(index);
            }
            else if(ID === 88 || ID === 74){// X , J 拾取钱包
                pickup_bag(index);
            }
            else if(ID === 86 || ID === 76){// V , L 护送老人、小孩
                help_old(index);
            }
            else if(ID === 32){// 空格 和邻居对话
                say_hello(index);
            }
            else if(ID === 67 || ID === 75){// C , K 把钱包交给警察
                bag_hand_in(index);
            }
        }
    }
}

//主人公移动、行为函数
function player_behave(){//每秒调用一次,处理玩家每秒内输入的最后一次移动和有效行为输入,在draw_me调用完参数重置
    player_act(act_keycode);//行为优先
    if(move_lock==0)
        player_move(move_keycode);
    move_flag=1;//重置移动标志
    turn_flag=0;//重置绕道标志
    move_lock=0;//重置移动锁定标志
}

//主人公移动函数
function player_move(ID){//W S A D ↑ ↓ ← →
    i=(me_y+65)/65;
    j=(me_y-300)/205;
    if(ID === 38 || ID === 87){// W and ↑
        if(me_y == 0){//到达终点
            if(level<3){
                me_y=y_end;
                objects.splice(0,objects.length);
                for(var i=0;i<12;i++){
                    for(var j=0;j<3;j++){
                        obj_position[i][j]=0;
                    }
                }
                level++;
            }
            else
                game_over();
        }
        else{
            k=objects.length;
            while(k--){//判断主人公前一位置是否有物体
                if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65){
                    objects[k].font=0;
                    move_flag=0;
                }
            }
            if(move_flag) {
                me_y-=step_y;
                obj_position[i][j]=0;
                obj_position[i-1][j]=1;
            }
        }
    }
    else if(ID === 39 || ID === 68){// D and →
        if(me_x != 710){
            k=objects.length;
            while(k--){//判断主人公右位置是否有物体
                if((objects[k].y1)==me_y&&(me_x-objects[k].x1)===-205&&objects[k].font==0){
                    move_flag=0;
                }
            }
            if(move_flag){
                obj_position[i][j]=0;
                obj_position[i][j+1]=1;
                me_x+=step_x;
            }
        }
        else
            move_flag=0;
    }
    else if(ID === 40 || ID === 83){// S and ↓
        if(me_y<=585){
            k=objects.length;
            while(k--){//判断主人公前一位置是否有非钱包物体
                if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65&&objects[k].id!=8){
                    objects[k].font=1;
                }
            }
            obj_position[i][j]=0;
            obj_position[i+1][j]=1;
            me_y+=step_y;
        }
        else
            move_flag=0;
    }
    else if(ID === 37 || ID === 65){// A and ←
        if(me_x != 300){
            k=objects.length;
            while(k--){//判断主人公左位置是否有物体
                if((objects[k].y1)==me_y&&(me_x-objects[k].x1)==205&&objects[k].font==0){
                    move_flag=0;
                }
            }
            if(move_flag){
                obj_position[i][j]=0;
                obj_position[i][j-1]=1;
                me_x-=step_x;
            }
        }
        else
            move_flag=0;
    }
}

//普通物体和主人公相遇判断函数
function normal_meeting_judge(x,y,k){//x,y为物体的位置信息,k为物体数组下标,更新物体的font属性
    if(x===me_x&&(me_y-y)===65){//玩家移动后和物体相对
        if(x==300&&(move_keycode === 37 || move_keycode === 65)){//在最左边一列按←
            objects[k].font=0;
        }
        else if(x===710&&(move_keycode === 39 || move_keycode === 68))//在最右边一列按→
            objects[k].font=0;
        else if(move_keycode === 0 || move_keycode === 87 || move_keycode === 38)//不操作或者按上
            objects[k].font=0;
        else if(move_keycode === 37 || move_keycode === 65)//物体向下玩家在旁边一列向左
            objects[k].font=0;
        else if(move_keycode === 39 || move_keycode === 68)//物体向下玩家在旁边一列向右
            objects[k].font=0;
        else if((objects[k].id!=1&&objects[k].id!=2)||objects[k].getIn==0)
            objects[k].font=1;
    }
    else if((objects[k].id!=1&&objects[k].id!=2)||objects[k].getIn==0)
        objects[k].font=1;
}

//物体的绕道函数   玩家先移动后物体再更新移动
function around_way(){
    i=objects.length;
    while(i--){//i在后
        j=objects.length;
        while(j--){//j在前
            if(i!=j&&objects[i].x1===objects[j].x1&&(objects[i].y1-objects[j].y1)===0&&objects[j].font===0){//若同一列有两个物体临近且前一个物体不前进,则绕道
                a=(objects[i].y1+65)/65;
                b=(objects[i].x1-300)/205;
                objects[i].font=0;  //             
                if(objects[i].x1===300){//在最左边一列
                    if(obj_position[a+1][b+1]===0){//右前方为空
                        objects[i].font=1;
                        turn_flag=2;
                        objects[i].x1+=step_x;
                    }
                }
                else if(objects[i].x1===505){//在中间一列
                    if(obj_position[a+1][b-1]===0){//左前方为空
                        objects[i].font=1;
                        turn_flag=1;
                        objects[i].x1-=step_x;
                    }
                    else if(obj_position[a+1][b+1]===0){//右前方为空
                        objects[i].font=1;
                        turn_flag=2;
                        objects[i].x1+=step_x;
                    }
                }
                else{
                    if(obj_position[a+1][b-1]===0){//左前方为空
                        objects[i].font=1;
                        turn_flag=1;
                        objects[i].x1-=step_x;
                    }
                }
            }
        }
    }
}

//新绕道函数
function around_way1(k){
    h=objects.length;
    while(h--){
        if(h!=k&&(objects[h].y1==(objects[k].y1+step_y))&&(objects[h].x1-objects[k].x1)===0){
            if(objects[h].font===0){//物体前方有不前进的物体   再考虑前面是挡道邻居的情况
                if(objects[k].x1===300){//物体在左侧
                    i=objects.length;
                    if(me_x==(objects[k].x1+step_x)&&me_y==(objects[k].y1+step_y)){//主人公在物体右前方
                        objects[k].font=0;
                    }
                    else{
                        objects[k].x1+=step_x;
                        objects[k].font=1;
                        turn_flag=2;
                        while(i--){
                            if(objects[i].x1===(objects[k].x1+step_x)&&objects[i].y1===objects[k].y1){//物体右方有物体
                                if(objects[i].font===1){//物体前进
                                    objects[k].font=0;
                                    objects[k].x1-=step_x;
                                    turn_flag=3;
                                }
                            }
                        }
                        if(turn_flag!=3){
                            j=objects.length;
                            while(j--){
                                if(objects[j].x1===(objects[h].x1+step_x)&&objects[j].y1===objects[h].y1){//物体右前方有物体
                                    if(objects[j].font===0){//物体不前进
                                        console.log(1);
                                        objects[k].font=0;
                                        objects[k].x1-=step_x;
                                        turn_flag=0;
                                    }
                                }
                            }
                        }
                        else turn_flag=0;
                    }
                }
                else if(objects[k].x1===505){//物体在中间
                    i=objects.length;
                    if(me_x==(objects[k].x1-step_x)&&me_y==(objects[k].y1+step_y)){//主人公在物体左前方
                        objects[k].font=0;
                    }
                    else{
                        objects[k].x1-=step_x;
                        turn_flag=1;
                        objects[k].font=1;
                        while(i--){
                            if(objects[i].x1===(objects[k].x1-step_x)&&objects[i].y1===objects[k].y1){//物体左方有物体
                                if(objects[i].font===1){//物体前进
                                    objects[k].font=0;
                                    objects[k].x1+=step_x;
                                    turn_flag=3;
                                }
                            }
                        }
                        if(turn_flag!=3){
                            i=objects.length;
                            while(i--){
                                if(objects[i].x1===(objects[h].x1-step_x)&&objects[i].y1===objects[h].y1){//物体左前方有物体
                                    if(objects[i].font===0){//物体不前进
                                        objects[k].font=0;
                                        objects[k].x1+=step_x;
                                        turn_flag=0;
                                    }
                                }
                            }
                        }
                        else
                            turn_flag=0;
                    }
                    if(turn_flag==0){//左绕失败,进入右绕
                        i=objects.length;
                        if(me_x==(objects[k].x1+step_x)&&me_y==(objects[k].y1+step_y)){//主人公在物体右前方
                            objects[k].font=0;
                        }
                        else{
                            objects[k].x1+=step_x;
                            objects[k].font=1;
                            turn_flag=2;
                            while(i--){
                                if(objects[i].x1===(objects[k].x1+step_x)&&objects[i].y1===objects[k].y1){//物体右方有物体
                                    if(objects[i].font===1){//物体前进
                                        objects[k].font=0;
                                        objects[k].x1-=step_x;
                                        turn_flag=3;
                                    }
                                }
                            }
                            if(turn_flag!=3){
                                i=objects.length;
                                while(i--){
                                    if(objects[i].x1===(objects[k].x1+step_x)&&objects[i].y1===(objects[k].y1+step_y)){//物体右前方有物体
                                        if(objects[i].font===0){//物体不前进
                                            objects[k].font=0;
                                            objects[k].x1-=step_x;
                                            turn_flag=0;
                                        }
                                    }
                                }
                            }
                            else turn_flag=0;
                        }
                    }
                }
                else if(objects[k].x1===710){//物体在右边
                    i=objects.length;
                    if(me_x==(objects[k].x1-step_x)&&me_y==(objects[k].y1+step_y)){//主人公在物体右前方
                        objects[k].font=0;
                    }
                    else{
                        objects[k].x1-=step_x;
                        objects[k].font=1;
                        turn_flag=1;
                        while(i--){
                            if(objects[i].x1===(objects[k].x1-step_x)&&objects[i].y1===objects[k].y1){//物体左方有物体
                                if(objects[i].font===1){//物体前进
                                    objects[k].font=0;
                                    objects[k].x1+=step_x;
                                    turn_flag=3;
                                }
                            }
                        }
                        if(turn_flag!=3){
                            i=objects.length;
                            while(i--){
                                if(objects[i].x1===(objects[h].x1-step_x)&&objects[i].y1===objects[h].y1){//物体左前方有物体
                                    if(objects[i].font===0){//物体不前进
                                        objects[k].font=0;
                                        objects[k].x1+=step_x;
                                        turn_flag=0;
                                    }
                                }
                            }
                        }
                        else turn_flag=0;
                    }
                }
            }
        }
    }
}
//扶老人、小孩行为
function help_old(k){
    if(objects[k].id===4||objects[k].id===5){
        if(obj_position[10][(me_x-300)/205]===0)
            me_y=650;
        else
            me_y=585;
        if(scoreArray[0].score<6)
            scoreArray[0].score+=2;
        if(scoreArray[0].score>6)
            scoreArray[0].score=6;
        str=in_fop.innerHTML;
        if(objects[k].id===4)
            in_fop.innerHTML="提示:</br>"+"尊老爱幼!</br>仁分数加2!</br>"+str;
        else 
            in_fop.innerHTML="提示:</br>"+"尊老爱幼!</br>仁分数加2!</br>"+str;
        objects.splice(k,1);
        a=(objects[k].y1+65)/65;
        b=(objects[k].x1-300)/205;
        obj_position[a][b]=0;
        move_lock=1;
    }
}

//捡包行为
function pickup_bag(k){
    if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65){
        if(objects[k].id==8){//是钱包
            objects.splice(k,1);
            bag_num--;
            bag_have++;
            str=in_fop.innerHTML;
            in_fop.innerHTML="提示:</br>"+"捡到钱包!</br>"+str;
            move_lock=1;
        }
    }
}

//抓小偷行为
function catch_thief(k){
    if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65){
        if(objects[k].id===7){//是小偷
            if(handcuffs_num>0){
                objects.splice(k,1);
                handcuffs_num--;
                if(scoreArray[3].score<6)
                    scoreArray[3].score+=2;
                if(scoreArray[3].score>6)
                    scoreArray[3].score=6;
                if(scoreArray[1].score<6)
                    scoreArray[1].score+=2;
                if(scoreArray[1].score>6)
                    scoreArray[1].score=6;
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"智取小偷!</br>义、智分数加2!</br>"+str;
            }
            else{
                if(scoreArray[3].score>1)
                    scoreArray[3].score--;
                if(scoreArray[1].score<6)
                    scoreArray[1].score++;
                objects.splice(k,1);
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"小偷逃走!</br>义分数加1!<br>智分数减1!</br>"+str;
            }
            move_lock=1;
        }
    }
}

//把钱包交给警察行为
function bag_hand_in(k){
    if(objects[k].x1==me_x&&(me_y-objects[k].y1)==65){
        if(objects[k].id===6){//是警察
            if(bag_have>0){//有钱包
                handcuffs_num++;
                bag_have--;
                if(scoreArray[4].score<6)
                    scoreArray[4].score+=2; //信的分数
                if(scoreArray[4].score>6)
                    scoreArray[4].score=6;
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"拾金不昧,获得手铐!</br>信分数加2!</br>"+str;
            }
            else{
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"没有捡到钱包!</br>"+str;
            }
            move_lock=1;
        }
    }
}

//邻居1、2加一个getIn属性表示是否进入挡道状态
//如果主人公往左移动成功且物体左位置没有物体及左上位置没有向下移动的物体则物体x=主人公x
//往右同理

//邻居挡道行为
function getIn_way(k){    
    if(move_flag===1){
        i=(objects[k].y1+65)/65;
        j=(objects[k].x1-300)/205;
        obj_position[i][j]=0;
        if(objects[k].x1!=me_x){
            if((move_keycode === 37 || move_keycode === 65)){//主人公往左且邻居左侧无物体
                if(obj_position[i][j-1]==0){
                    objects[k].x1=me_x;
                    objects[k].font=0;
                }
                else{ 
                    objects[k].font=1;
                    objects[k].getIn=0;
                }
            }
            else if((move_keycode === 39 || move_keycode === 68)){//主人公往右且邻居右侧无物体
                if(obj_position[i][j+1]==0){
                    objects[k].x1=me_x;
                    objects[k].font=0;
                }
                else{ 
                    objects[k].font=1;
                    objects[k].getIn=0;
                }
            }
        }
        i=(objects[k].y1+65)/65;
        j=(objects[k].x1-300)/205;
        obj_position[i][j]=1;

    }
}

//如果邻居左前方(优先)无不前进物体,左方没有前进物体，则邻居向左前移动
//右前同理

//和邻居打招呼行为
function say_hello(k){
    if((objects[k].id==1||objects[k].id==2)&&objects[k].getIn==1){
        a=(objects[k].y1+65)/65;
        b=(objects[k].x1-300)/205;
        objects[k].font=0;
        if(objects[k].x1===300){//在最左边一列
            hello_flag=1;
            h=objects.length;
            while(h--){
                if(h!=k&&objects[h].y1==objects[k].y1&&(objects[h].x1-objects[k].x1)===step_x){//物体右方没有前进的物体
                    if(objects[h].font===1)
                        hello_flag=0;
                }
            }
            h=objects.length;
            while(h--){
                if(h!=k&&(objects[h].y1-objects[k].y1)===step_y&&(objects[h].x1-objects[k].x1)===step_x){//物体右前方有不前进的物体
                    if(objects[h].font===0)
                        hello_flag=0;
                }
            }
            if(hello_flag==1){//成功右绕
                objects[k].font=1;
                turn_flag=2;
                move_lock=1;
                objects[k].getIn=0;
                if(scoreArray[2].score<=5)
                    scoreArray[2].score++;
                objects[k].x1+=step_x;
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"礼貌问好!</br>礼分数加1!</br>"+str;
            }
        }
        else if(objects[k].x1===505){//在中间一列
            hello_flag=1;
            h=objects.length;
            while(h--){
                if(h!=k&&objects[h].y1==objects[k].y1&&(objects[h].x1-objects[k].x1)===-step_x){//物体左方没有前进的物体
                    if(objects[h].font===1)
                        hello_flag=0;
                }
            }
            h=objects.length;
            while(h--){
                if(h!=k&&(objects[h].y1-objects[k].y1)===step_y&&(objects[h].x1-objects[k].x1)===-step_x){//物体左前方没有前进的物体
                    if(objects[h].font===0)
                        hello_flag=0;
                }
            }
            if(hello_flag==1){//成功左绕
                objects[k].font=1;
                turn_flag=2;
                hello_flag=1;
                move_lock=1;
                objects[k].x1-=step_x;
                objects[k].getIn=0;
                if(scoreArray[2].score<=5)
                    scoreArray[2].score++;
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"礼貌问好!</br>礼分数加1!</br>"+str;
            }
            else{//判断右绕
                hello_flag=1;
                h=objects.length;
                while(h--){
                    if(h!=k&&objects[h].y1==objects[k].y1&&(objects[h].x1-objects[k].x1)===step_x){//物体右方没有前进的物体
                        if(objects[h].font===1)
                            hello_flag=0;
                    }
                }
                h=objects.length;
                while(h--){
                    if(h!=k&&(objects[h].y1-objects[k].y1)===step_y&&(objects[h].x1-objects[k].x1)===step_x){//物体右前方没有前进的物体
                        if(objects[h].font===0)
                            hello_flag=0;
                    }
                }
                if(hello_flag==1){//成功右绕
                    objects[k].font=1;
                    turn_flag=2;
                    hello_flag=1;
                    move_lock=1;
                    objects[k].x1+=step_x;
                    objects[k].getIn=0;
                    if(scoreArray[2].score<=5)
                        scoreArray[2].score++;
                    str=in_fop.innerHTML;
                    in_fop.innerHTML="提示:</br>"+"礼貌问好!</br>礼分数加1!</br>"+str;
                }
            }
        }
        else{//最右边一列
            hello_flag=1;
            h=objects.length;
            while(h--){
                if(h!=k&&objects[h].y1==objects[k].y1&&(objects[h].x1-objects[k].x1)===-step_x){//物体左方没有前进的物体
                    if(objects[h].font===1)
                        hello_flag=0;
                }
            }
            h=objects.length;
            while(h--){
                if(h!=k&&(objects[h].y1-objects[k].y1)===step_y&&(objects[h].x1-objects[k].x1)===-step_x){//物体左前方有不前进的物体
                    if(objects[h].font===0)
                        hello_flag=0;
                }
            }
            if(hello_flag==1){//成功左绕
                objects[k].font=1;
                turn_flag=1;
                move_lock=1;
                objects[k].getIn=0;
                if(scoreArray[2].score<=5)
                    scoreArray[2].score++;
                objects[k].x1-=step_x;
                str=in_fop.innerHTML;
                in_fop.innerHTML="提示:</br>"+"礼貌问好!</br>礼分数加1!</br>"+str;
            }
        }
    }
}

