let blobs = new Array(1200);
let perceptron;
let res = 640;
let m, c;
let eq;
let perceq;

function setup(){
  createCanvas(res, res);
  perceptron = new Perceptron(2, 0.005);
  let angle = random(180);

  m = atan(angle);
  c = random(-20, 20);
  for(let i = 0; i < blobs.length; i++){
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let obj = {
      x : x,
      y : y,
      above : (y > m*x + c) ? 1 : -1
    }
    blobs[i] = obj;
  }
  frameRate(15);
  eq = createP();
  perceq = createP();
  eq.html("Y = " + m + "X + " + c + "<br>");
}

function draw(){
  background(255);
  translate(width/2, height/2);
  stroke(0);
  strokeWeight(3);
  for(let i = 0; i < blobs.length; i++){
    let blob = blobs[i];
    let prediction = perceptron.predict([blob.x, blob.y])
    let colour = prediction == blob.above ? color(0, 255, 0) : color(255, 0, 0);
    fill(colour);
    ellipse(blob.x, blob.y, 8, 8);
    // perceptron.train([blob.x, blob.y], blob.above);
  }
  // for(let i = 0; i < 10000; i++){
  //   let blob = random(blobs);
  //   perceptron.train([blob.x, blob.y], blob.above);
  // }
  // console.log("trained");
  //y - 3x - 2 = 0;

  let pw0 = perceptron.weights[0];
  let pw1 = perceptron.weights[1];
  let pw2 = perceptron.weights[2];
  let y_200 = (-res/2)*(-pw0)/pw1 - pw2/pw1;
  let y200  = ( res/2)*(-pw0)/pw1 - pw2/pw1;
  line((-res/2), y_200, (res/2), y200);
  stroke(0, 0, 255);
  line(-res/2, (-res/2)*m + c, res/2, res/2*m + c);

  for(let i = 0; i < 50; i++){
    let blob = random(blobs);
    perceptron.train([blob.x, blob.y], blob.above);
  }

  perceptron.lr *= 0.9995
  perceq.html("Perceptron equation<br>Y = "  + ((-pw0)/pw1).toPrecision(3) + "X + " + (- pw2/pw1).toPrecision(3));
}
