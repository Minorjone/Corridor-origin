//canvas内鼠标坐标转换
function windowToCanvas(canvas, x, y) {
  const bbox = canvas.getBoundingClientRect();
  return { x: x - bbox.left,
    y: y - bbox.top   };
}