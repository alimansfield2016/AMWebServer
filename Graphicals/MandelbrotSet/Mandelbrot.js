let minX = -2;
let maxX = 2;

let minY = -2;
let maxY = 2;

let maxIterations = 64;
let iterSlider;
let loading;

let pd;

let lastN = 0;

let palete = [];

function setup(){
  pd = pixelDensity();
  // pd = 1;
  let params = getURLParams();
  let wh = params.Size? params.Size : 200;
  createCanvas(wh, wh);
  loading = createP();
  iterSlider = createInput(100);
}

function draw(){
  // for(let i = 0; i < maxIterations - floor(lastN / 1.05); i++){
  //   // palete[i] = huetoRGB(map(i, 0, maxIterations, 0, 359));
  //   palete[i] = huetoRGB((4*i)%360);
  // }
  // palete[maxIterations - floor(lastN / 1.05)] = color(0);
  // palete[maxIterations - lastN] = color(0);
  maxIterations = iterSlider.value();
  loading.html("<br>Iterations : " + maxIterations);

  loadPixels();
  let minN = maxIterations;
  for(let x = 0; x < width; x++){
    for(let y = 0; y < height; y++){
      // let index = 4*(x + y*width) * pd;
      let pa = map(x, 0, width, minX, maxX);
      let pb = map(y, 0, height, minY, maxY);
      let a = 0;
      let b = 0;
      let n = 0;
      let c;

      while(n < maxIterations && (a*a + b*b < 4)){
        let aa = a*a - b*b;
        let bb = 2*a*b;
        a = aa+pa;
        b = bb+pb;
        n++;
      }
      if(n < minN){minN = n}

      // if(n == maxIterations){
      //   c = color(0);
      // }else{
      //   c = color(map(n, 0, maxIterations, 0, 340), 255, 255);
      // }
      c =  n == maxIterations ? color(0) : huetoRGB((2*n)%360);



      // colorMode(RGB);
      for (var i = 0; i < pd; i++) {
        for (var j = 0; j < pd; j++) {
          // loop over
          let index = 4 * ((y * pd + j) * width * pd + (x * pd + i));
          // pixels[idx  ] = r;
          // pixels[idx+1] = g;
          // pixels[idx+2] = b;
          // pixels[idx+3] = a;
          pixels[index  ] = red(c);
          pixels[index+1] = green(c);
          pixels[index+2] = blue(c);
          pixels[index+3] = 255;

        }
      }
    }
  }



  updatePixels();
  noLoop();
  lastN = minN;
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

// function mouseWheel(event){
//   x = map(mouseX, 0, width, minX, maxX);
//   y = map(mouseY, 0, height, minY, maxY);
//   // minX = x - (x - minX) * (event.delta > 0 ? 0.9 : 1/0.9);
//   // maxX = x - (x - maxX) * (event.delta > 0 ? 0.9 : 1/0.9);
//   // minY = y - (y - minY) * (event.delta > 0 ? 0.9 : 1/0.9);
//   // maxY = y - (y - maxY) * (event.delta > 0 ? 0.9 : 1/0.9);
//   minX = x - (x - minX) * (event.delta > 0 ? event.delta/500000 : -500000/event.delta);
//   maxX = x - (x - maxX) * (event.delta > 0 ? event.delta/500000 : -500000/event.delta);
//   minY = y - (y - minY) * (event.delta > 0 ? event.delta/500000 : -500000/event.delta);
//   maxY = y - (y - maxY) * (event.delta > 0 ? event.delta/500000 : -500000/event.delta);
//   redraw();
// }

function keyPressed(){
  let changeY = (maxY - minY)/25;
  let changeX = (maxX - minX)/25;
  let update = true;
  switch (keyCode) {
    case UP_ARROW:
      maxY -= changeY;
      minY -= changeY;
      break;
    case DOWN_ARROW:
      maxY += changeY;
      minY += changeY;
      break;
    case RIGHT_ARROW:
      maxX += changeX;
      minX += changeX;
      break;
    case LEFT_ARROW:
      maxX -= changeX;
      minX -= changeX;
      break;
      case 189:
        maxX += changeX;
        minX -= changeX;
        maxY += changeY;
        minY -= changeY;
        break;
      case 187:
        minX += changeX;
        maxX -= changeX;
        minY += changeY;
        maxY -= changeY;
        break;
      case ENTER:
        break;
      default:
        update = false;

  }
  update ? redraw() : null ;
}
