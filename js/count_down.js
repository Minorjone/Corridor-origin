var count_down_time_min=9,
    count_down_time_sec=0,
    count_down_time,
    time_x=59,
    time_y=681;

//倒计时函数
function time_countdown(){
    if(flag_game){//游戏运行
        draw_game_background();
        create_objects();
        //position_reset();
        player_behave();
        objects_update();
        draw_objects();
        draw_me();
        count_down_time_sec--;
        if(count_down_time_sec<0){
            count_down_time_sec=9;
            count_down_time_min--;
        }
        if(count_down_time_min<0&&count_down_time_sec==9){
            count_down_time_min=9;
            count_down_time_sec=0;
            if(typeof(sto)!='undefined') clearTimeout(sto);
            game_over();
            return 0;
        }
        sto=setTimeout(time_countdown,1000);
    }
    else{
        count_down_time_min=9;
        count_down_time_sec=0;
    }
}

//倒计时绘制
function draw_time_countdown(){
    context.save();
    context.fillStyle='red';
    context.font='8em DIGITAL-Regular';
    context.fillText(count_down_time_min,time_x,time_y);
    context.fillText(count_down_time_sec,time_x+context.measureText(count_down_time_sec).width,time_y);
    context.restore();
}