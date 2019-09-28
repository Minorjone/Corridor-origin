/*******************************登录用户名检测********************************/

var alert_flag=0;//弹框标志
function check_usr(obj){
    var objvalue = obj.value;
    //var b=/^[a-zA-Z\d]\w{2,10}[a-zA-Z\d]$/; // /^[\u4e00-\u9fa5|\w]{2,14}$/ 汉字匹配正则表达式
    // var b=/^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{3,9}$/;
    // if(objvalue==""){
    //     alert_flag=1;
    //     sAlert("用户名不能为空");
    // }
    // else if (!b.test(objvalue)){
    //     alert_flag=1;
        // sAlert("用户名只能由至少4个的英文字母、数字或下划线组成");
    // }
    // else{
    //     log_bg_repaint();
    //     context.drawImage(log_pic_active,log_x1,log_y1,log_pic_active.width,log_pic_active.height);
    //     username=pls.value;
    //     log_pic_flag=0;
    //     log_glasspane.style.display="none";
    //     log_pic_flyout();
    // }
    var partten = /[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d]/;
    if(objvalue==""){
        alert_flag=1;
        sAlert("用户名不能为空");
    }
    else{
        for(var i=0;i<objvalue.length;i++){
            var ck = objvalue.charAt(i);
            var result = partten.test(ck);
            if(result==false)break;
        }
        if(result){
            log_bg_repaint();
            context.drawImage(log_pic_active,log_x1,log_y1,log_pic_active.width,log_pic_active.height);
            username=pls.value;
            log_pic_flag=0;//获取到输入后，不显示输入框
            log_glasspane.style.display="none";
            log_pic_flyout();
        }
        else{
             alert_flag=1;
             sAlert('含有非法字符');
        }
    }
}