/*******************************登录用户名检测错误提示框********************************/

function sAlert(str){
  var msgw,msgh,bordercolor;
  msgw=300;//提示窗口的宽度
  msgh=150;//提示窗口的高度
  bordercolor="blue";//提示窗口的边框颜色
  titlecolor="blue";//提示窗口的标题颜色
            
  var sWidth,sHeight;
  sWidth=1024;
  //sHeight=document.body.offsetHeight;
  sHeight = 768;
  
  //提示框背景遮罩
  var bgObj=document.createElement("div");
  bgObj.setAttribute('id','bgDiv');
  bgObj.style.position="absolute";
  bgObj.style.top="0";
  // bgObj.style.background="#777";
  bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
  bgObj.style.opacity="0.6";
  bgObj.style.left="0";
  bgObj.style.width=sWidth + "px";
  bgObj.style.height=sHeight + "px";
  document.body.appendChild(bgObj);

  //提示框主体
  var msgObj=document.createElement("div")
  msgObj.setAttribute("id","msgDiv");
  msgObj.setAttribute("align","center");
  msgObj.style.borderRadius="10px";
  msgObj.style.position="absolute";
  msgObj.style.background="white";
  msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
  msgObj.style.border="1px solid " + bordercolor;
  msgObj.style.width=msgw + "px";
  msgObj.style.height=msgh + "px";
  msgObj.style.top=(document.documentElement.scrollTop + (sHeight-msgh)/2) + "px";
  msgObj.style.left=(sWidth-msgw)/2 + "px";

  //提示框“关闭”标题
  var title=document.createElement("h4");
  title.setAttribute("id","msgTitle");
  title.setAttribute("align","right");
  title.style.margin="0";
  title.style.borderRadius="8px 8px 0 0";
  title.style.padding="5px 10px 5px 0";
  title.style.background=bordercolor;
  title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
  title.style.opacity="0.75";
  title.style.border="1px solid " + bordercolor;
  title.style.height="18px";
  title.style.font="15px 微软雅黑, Geneva, Arial, Helvetica, sans-serif";
  title.style.color="white";
  title.style.cursor="pointer";
  title.innerHTML="关闭";

  //关闭标题点击事件
  title.onclick=function(){
    alert_flag=0;
    document.body.removeChild(bgObj);
    document.getElementById("msgDiv").removeChild(title);
    document.body.removeChild(msgObj);
    pls.value="";
    pls.focus();
  }
  document.body.appendChild(msgObj);
  document.getElementById("msgDiv").appendChild(title);
  var txt=document.createElement("p");
  txt.style.margin="1.6em 0";
  txt.style.font="20px 微软雅黑";
  txt.setAttribute("id","msgTxt");
  txt.style.cursor="default";
  txt.innerHTML=str;
  document.getElementById("msgDiv").appendChild(txt);
}
