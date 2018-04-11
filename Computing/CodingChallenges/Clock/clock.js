let size;

function setup(){
  //size(20, 20);
  //fullscreen(true);
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  size = Math.min(width, height);
}

function draw(){
  background(0);
  translate(width/2, height/2);
  push();
    stroke(255, 255, 0);
    strokeWeight(11);
    rotate(((hour())*360/12));
    line(0, 0, 0, -size/4);
  pop();
  push();
    stroke(0, 255, 255);
    strokeWeight(8);
    rotate((minute()*6));
    line(0, 0, 0, -size/3);
  pop();
  push();
    stroke(255, 0, 255);
    strokeWeight(5);
    rotate((second()*6));
    line(0, 0, 0, -size/2.2);
    strokeWeight(12);
    point(0, 0);
  pop();
  noLoop();
  setTimeout(loop, 1000-millis()%1000);
}

function mousePressed(){
  //fullscreen(!fullscreen());
  if(!fullscreen()){
    fullscreen(true);
    noCursor();
    resizeCanvas(displayWidth, displayHeight);
    size = Math.min(width, height);
  }
  else {
    fullscreen(false);
    cursor();
    resizeCanvas(windowWidth, windowHeight);
    size = Math.min(width, height);
  }
}

function windowResized(){
  if(!fullscreen()){
    resizeCanvas(windowWidth, windowHeight-1);
  }else   resizeCanvas(windowWidth-40, windowHeight-40);
  size = Math.min(width, height);

}
