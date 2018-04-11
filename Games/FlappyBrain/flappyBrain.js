let backgrnd;
let brain;
let posx = 0;
let speed = 2;
let brainPos = 0;
let brainVel = 0;
let currentLevel = 0;
const LEVEL_SPACING = 400;
const GAP = 200;
const PIPE_WIDTH = 50;
let leveldist = 1000;
let score;
let canhit = false;

function setup(){
  backgrnd = loadImage('background.png');
  brain = loadImage('brain.png');
  createCanvas(600, 600);
  brain.resize(60, 0);
  setTimeout(1000, () => brain.resize(60, 0));
  noiseSeed(floor(random()*1000));
  score = createP('Score : '+currentLevel);

}

function draw(){
  background(0);
  image(backgrnd, -posx, 0);
  if(backgrnd.width - posx < width){
    image(backgrnd, backgrnd.width - posx, 0);
  }
  if(posx > backgrnd.width){
    posx -= backgrnd.width;
  }

  posx+= speed;
  let scaled = 0.3;
  push();
  scale(0.3, 0.3);
  image(brain, 100, 600-brainPos/scaled)
  pop();
  brainVel -= 0.35;
  brainVel *= 0.97;
  brainPos += brainVel;
  if(brainPos - brain.height*scaled*3 < -600){
    brainVel = 0;
    brainPos = brain.height*scaled*3 -600;
  }

  //draw the pipes, generated using perlin noise
  noStroke();
  fill(0, 255, 0);
  for(let i = 0; i < 3; i++){
    let topPipeLength = noise((currentLevel+i)* 200)*(height-GAP);
    let bottomPipeLength = height - topPipeLength - GAP;
    rect(leveldist + i*LEVEL_SPACING, 0,PIPE_WIDTH, topPipeLength);
    rect(leveldist + i*LEVEL_SPACING, height, PIPE_WIDTH, -bottomPipeLength);
  }

  leveldist -= speed;
  if(leveldist <= -PIPE_WIDTH){
    leveldist += LEVEL_SPACING;
    currentLevel++;
  }

  score.html('Score : '+currentLevel);

}

function keyPressed(){
  if(key == ' '){
    brainVel += 12;
  }
}

function mousePressed(){
  // if(mouseIsPressed){
  //   brainVel += 12;
  // }
}
function touchStarted(){
  brainVel += 12;
}
function touchEnded(){}

function reset(){


}

class Pipe{
  constructor(gap, height){
    this.gap = gap;
    this.height = height;
  }
}
