// 可以考虑将这个js升级成产生所有人物的js
// 产生一个随机id，特定id对应特定人物，这样可以避免同时产生多个
//邻居1、2 掉包邻居3 小孩4 老人5 警察6 小偷7 包8
//邻居123、小孩、老人设不同权重表现出现概率
//邻居1、2各30%，掉包邻居20%，小孩10%，老人10%
//存储形式{id:  , x1:   , y1:   , x2:   , y2:   }

//实现思路：将所有物体都放到数组中，每个物体都有特别的id，通过id判断物体类型
//每秒刷新一次画布，用update函数将数组中所有物体的位置改变，用drawobject绘制
//楼梯可以看作一个3*11的二维数组，将有物体的位置置为1
//对玩家的键盘输入做限制，每秒只取玩家键入的最后一个方向键
//同时对玩家的键盘输入分类判断，输入↑时要求上一行位置的数组不为1输入才有效

//写一个总的控制物体产生的函数，对邻居、小孩、最后阶段的警察小偷做分类控制

var rand_id,
    temp_id,
    temp_img,
    rand_num,
    bag_num=0,//控制同时掉落的钱包数
    bag_have=0,//拥有钱包数
    handcuffs_num=0;//拥有的手铐数
//随机产生邻居函数
function create_character1(){
    rand_id=Math.ceil(Math.random()*12);//产生1-10的随机数
    random_column();//随机列
    if(rand_id<=4){// 邻居1
        temp_id=1;
        temp_img=neighbor1;
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1,getIn:0});
    }
    else if(rand_id<=8){// 邻居2
        temp_id=2;
        temp_img=neighbor2;
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1,getIn:0});
    }
    else if(rand_id<=10){// 掉包邻居  其bagdrop属性用来表示是否已经掉包
        temp_id=3;
        temp_img=bagdroper;
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1,bagdrop:0});
    }
    else if(rand_id==11){// 小孩
        temp_id=4;
        temp_img=child;
    }
    else if(rand_id==12){// 老人
        temp_id=5;
        temp_img=old;
    }
    if(temp_id>3)
        objects.push({id:temp_id, Img:temp_img, x1:temp_x1, y1:temp_y1, width:temp_width, height:temp_height,font:1});
}

//掉包邻居随机掉包函数
function drop_bag(k){
    rand_num=Math.ceil(Math.random()*10);
    if(rand_num<=5&&bag_num<1&&bag_have<=3){//二分之一概率掉包
        objects.push({id:8, Img:bag, x1:objects[k].x1, y1:objects[k].y1, width:60, height:60,font:0});
        bag_num++;
        objects[k].bagdrop=1;
    }

}