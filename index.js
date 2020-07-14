import { log_bg_img } from './js/constants'
import { windowToCanvas } from './js/utils'
var canvas = document.getElementById('canvas'),
  context= canvas.getContext('2d'),
  offScreenCanvas = document.getElementById('canvas1'),
  offScreenContext = canvas1.getContext('2d');

//登录图片加载完成事件注册
log_bg_img.onload = () => {
  log_bg_fadein();
}

//canvas事件注册
canvas.onclick = (e) => {
  var loc = windowToCanvas(canvas, e.clientX, e.clientY);
  e.preventDefault();
  onclick(loc);
}
canvas.onmousemove = (e) => {
  var loc = windowToCanvas(canvas, e.clientX, e.clientY);
  mousemove(loc);
}
canvas.addEventListener('keydown', player_input, true);// key event - use DOM element as object
canvas.focus();  
window.addEventListener('keydown', player_input, true);// key event - use window as object

//4.初始化块
context.textAlign='middle';
context.textBaseline='center';