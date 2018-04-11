let workers = [];
let noWorkers = 2;

let resX = 480;
let resY = 360;
let row = 0;
let rows = [];


let minX;
let minY;
let maxX;
let maxY;

let iters = 255;

let pressed = false;
let pressedX;
let pressedY;
let releasedX;
let releasedY;

let imgType;

let aspect;

function setup(){
  createCanvas(resX, resY);
  aspect = resX / resY;
  maxX = new BigNumber(2);
  minX = new BigNumber(-2);
  maxY = new BigNumber(2/aspect);
  minY = new BigNumber(-2/aspect);

  // for(let i = 0; i < resY; i++){
  //   renderedRows[i] = -1;
  //   unRenderedRows[i] = i;
  // }

  // frameRate(15);
  imgType = createImage();
  // startWorkers();

}

function draw(){
  background(127);
  for(let i = 0; i < resY; i++){
    if(typeof(rows[i]) == typeof(imgType)){
      image(rows[i], 0, i);
    }
  }
  if(pressed){
    push();
      strokeWeight(4);
      stroke(255);
      noFill();
      let width = -1*(pressedX - mouseX);
      let height = -1*(pressedY - mouseY);
      (abs(width/height) > aspect) ? height = abs(width/aspect)*sign(height) : width = abs(height*aspect)*sign(width);
      rect(pressedX, pressedY, width, height);
    pop();
  }
  if(row == 0){
    rows = [];
  }
  if(row < resY){
    noLoop();
    setTimeout(drawRow, 100);
  }else{
    noLoop();
    setTimeout(loop, 100);
  }
}

function drawRow(){
  let img = createImage(resX, 1);
  img.loadPixels();

  let y = minY.plus((maxY.minus(minY).dividedBy(resY).multipliedBy(row)));
  for(let i = 0; i < resX; i++){
    let n = 0;
    let x = minX.plus((maxX.minus(minX).dividedBy(resX).multipliedBy(i)));
    let a = new BigNumber(0);
    let b = new BigNumber(0);
    while(a.pow(2).plus(b.pow(2).lt(4)) && n < iters){
      a = a.pow(2).minus(b.pow(2)).plus(x);
      b = a.multipliedBy(b).multipliedBy(2).plus(y);
      n++;
    }
    let color = n == iters ? color(0) : huetoRGB((2*n)%360);
    let index = 4*i;
    img.pixels[index + 0] = red(color);
    img.pixels[index + 1] = green(color);
    img.pixels[index + 2] = blue(color);
    img.pixels[index + 3] = 255;
  }
  img.updatePixels()


  row++;
  loop();
}

function reScale(){
    // if(renderedRows.length == 0){
    let diffX = maxX.minus(minX);
    let diffY = maxY.minus(minY);

    let newX0 = minX.plus(diffX.multipliedBy((pressedX/width).toPrecision(15)));
    let newX1 = minX.plus(diffX.multipliedBy((releasedX/width).toPrecision(15)));
    let newY0 = minY.plus(diffY.multipliedBy((pressedY/width).toPrecision(15)));
    let newY1 = minY.plus(diffY.multipliedBy((releasedY/width).toPrecision(15)));
    console.log(newX0.toString());
    console.log(newX1.toString());
    console.log(newY0.toString());
    console.log(newY1.toString());
    minX = newX1.gt(newX0) ? newX0 : newX1;
    maxX = newX1.lt(newX0) ? newX0 : newX1;
    minY = newX1.gt(newX0) ? newX0 : newX1;
    maxY = newX1.lt(newX0) ? newX0 : newX1;
    // startWorkers();
    // unRenderedRows = [];
    // for(let i = 0; i < resY; i++){
    //   unRenderedRows[i] = i;
    // }
  // }
  loop();
  row = 0;
}

function mouseReleased(){
  let width = -1*(pressedX - mouseX);
  let height = -1*(pressedY - mouseY);
  (abs(width/height) > aspect) ? height = abs(width/aspect)*sign(height) : width = abs(height*aspect)*sign(width);
  releasedX = pressedX + width;
  releasedY = pressedY + height;
  if(!(mouseX > resX || mouseY > resY) && pressed && !(pressedX == releasedX && pressedY == releasedY)){
    reScale();
  }
  pressed = false;
}

function mousePressed(){
  if(!(mouseX > resX || mouseY > resY)){
    pressed = true;
    pressedX = mouseX;
    pressedY = mouseY;
  }
}




function sign(val){
  return val > 0 ? 1 : val < 0 ? -1 : 0;
}



function startWorkers(){
  for(let i = 0; i < noWorkers; i++){
    workers[i] = new Worker("worker.js");
    workerJob(workers[i]);
    workers[i].onmessage = function(event){
      let data = event.data;
      let row = data.row;
      renderedRows[row] = data.img;
    }
  }
}

function workerJob(worker){
  if(unRenderedRows.length > 0){
    let n;
    n = random(unRenderedRows);
    unRenderedRows.splice(unRenderedRows.indexOf(n), 1);
    worker.postMessage({
      IMG : createImage(resX, 1),
      COLS : resX,
      STARTX : minX,
      ENDX : maxX,
      Y : minY.plus(maxY.minus(minY).multipliedBy((n/resY).toPrecision(15)).toPrecision(15)),
      ROW : n
    });
    renderedRows[i] = true;
  }else{
    worker.terminate();
    worker = undefined;
  }
}

function stopWorkers(){
  for(let i = 0; i < workers.length; i++){
    workers[i].terminate();
    workers[i] = undefined;
  }
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
