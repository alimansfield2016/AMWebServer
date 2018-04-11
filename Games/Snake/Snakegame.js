let cols = 25;
let rows = 25;
let w;

let snake;
let food;

let direction;
let length = 0;
let score;
let prevScore;

function setup(){
  createCanvas(800,800);
  w = width/cols;
  score = createP();
  prevScore = createP();
  gameOver();
  direcion = RIGHT_ARROW;
}

function draw(){
  background(255);
  fill(255);
  // strokeWeight(2);
  noStroke();
  stroke(0);
  // for(let i = 0; i < cols; i++){
  //   for(let j = 0; j < rows; j++){
  //     rect(i*w, j*w, w, w);
  //   }
  // }
  rect(0, 0, width-1, height-1);
  fill(255, 0, 0);
  rect(food.x*w, food.y*w, w, w);
  snake.update();
  score.html("Score : " + snake.length);
}

function gameOver(){
  //start new game;
  prevScore.html("Previous Score : " + length);
  frameRate(5);
  snake = new Snake(floor(cols/2), floor(rows/2), 1);
  length = 1;
  newFood();
}

function newFood(){
  food = {x : floor(random(cols)) , y : floor(random(rows))};
}

function keyPressed(){
switch(keyCode){
  case UP_ARROW:
    snake.changeDirection(keyCode);
    direction = keyCode;
    break;
  case DOWN_ARROW:
    snake.changeDirection(keyCode);
    direction = keyCode;
    break;
  case LEFT_ARROW:
    snake.changeDirection(keyCode);
    direction = keyCode;
    break;
  case RIGHT_ARROW:
    snake.changeDirection(keyCode);
    direction = keyCode;
    break;
  }
  if(key == ' '){
    snake.grow();
  }
}
