let myCannon;
let aliens = [];

let rows = 200;
let cols = 200;

let g;
let t;
let w;
let s;

let cannon;
let shots = [];

function setup(){
  createCanvas(800, 800);
  frameRate(60);
  g = color(0, 255, 0, 255);
  t = color(0, 0, 0, 0);
  w = color(255);
  s = width/cols;
  myCannon = new Cannon();
  cannon = [[t, t, t, t, t, g, g, t, t, t, t, t],
                [t, t, t, t, g, g, g, g, t, t, t, t],
                [t, t, t, t, g, g, g, g, t, t, t, t],
                [t, g, g, g, g, g, g, g, g, g, g, t],
                [g, g, g, g, g, g, g, g, g, g, g, g],
                [g, g, g, g, g, g, g, g, g, g, g, g]];

}

function draw(){
  background(0);
  if(keyIsDown(RIGHT_ARROW)){
    myCannon.x++;
    myCannon.x = myCannon.x >= cols-12 ? cols-12 : myCannon.x;
  }
  if(keyIsDown(LEFT_ARROW)){
    myCannon.x--;
    myCannon.x = myCannon.x <        0 ?       0 : myCannon.x;
  }





  myCannon.draw();

  for(let i = 0; i < shots.length; i++){
    shots[i].update();
  }
}

function keyPressed(){
  if(key == ' '){
    shots.push(new Shot((keyIsDown(RIGHT_ARROW) ? 1 : 0 ) + (keyIsDown(LEFT_ARROW) ? -1 : 0 )))
  }
}
