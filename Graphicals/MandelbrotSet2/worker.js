//code to run
let go = false;
let columns;
let row;
let startX;
let endX;
let valY;
let rowIMG;
let iters;
render();

function render(){
  if(!go){
    setTimeout(render, 100);
    return;
  }
  rowIMG.loadPixels();
  let y = valY;
  let diffX = endX.minus(startX);
  for(let i = 0; i < columns; i++){
    let n = 0;
    let x = startX.plus(diffX.multipliedBy(i));
    let a = new BigNumber(0);
    let b = new BigNumber(0);
    while(a.power(2).plus(b.power(2).lt(4)) && n < iters){
      a = a.power(2).minus(b.power(2)).plus(x);
      b = a.multipliedBy(b).multiplyBy(2).plus(y);
      n++;
    }
    let color = n == iters ? color(0) : huetoRGB((2*n)%360);
    let index = 4*i;
    rowIMG.pixels[index + 0] = red(color);
    rowIMG.pixels[index + 1] = green(color);
    rowIMG.pixels[index + 2] = blue(color);
    rowIMG.pixels[index + 3] = 255;

  }

  rowImg.updatePixels();

  postMessage({
    row : row,
    img : rowIMG
  })

  go = false;
}

function onmessage(eventData){
  let data = eventData.data;
  columns = data.COLS;
  rowIMG = data.IMG;
  startX = data.STARTX;
  endX = data.ENDX;
  row = data.ROW;
  iters = data.ITERS;
  go = true;
}

function huetoRGB(hue){
  let r;
  let g;
  let b;
  let h = hue;
  let t1 = 255;
  let t2 = 0;
  let t3 = 255*(h%60)/60;

       if(h < 60 ) {r = t1; b = t2; g = t2 + t3; }
  else if(h < 120) {g = t1; b = t2; r = t1 - t3; }
  else if(h < 180) {g = t1; r = t2; b = t2 + t3; }
  else if(h < 240) {b = t1; r = t2; g = t1 - t3; }
  else if(h < 300) {b = t1; g = t2; r = t2 + t3; }
  else if(h < 360) {r = t1; g = t2; b = t1 - t3; }
  return color(r, g, b);
}
