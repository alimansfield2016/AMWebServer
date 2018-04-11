const MouseBoxSize = 20;
const NumberPoints = 1000;
let quadTree;
let points = [];
let mouseBox;


function setup(){
  createCanvas(400, 400);
  let bounds = new Rectangle(width/2, height/2, width/2, height/2);
  quadTree = new QuadTree(bounds);
  let i = 0;
  while(i < NumberPoints){
    let x = randomGaussian(width/2, width/8);
    let y = randomGaussian(height/2, height/8);
    let prob = noise(x, y);
    let r = random();
    if(r < prob){
      let p = new Point(x, y);
      quadTree.insert(p);
      i++;
    }
  }
}

function draw(){
  background(63);
  if(mouseIsPressed){
    quadTree.insert(new Point(mouseX, mouseY));
  }
  // console.log(frameRate());
  quadTree.show();
  quadTree.showPoints();
  let x = mouseX;
  let y = mouseY;
  rectMode(CENTER);
  noFill();
  stroke(200, 0, 0);
  strokeWeight(1);
  rect(x, y, MouseBoxSize*2, MouseBoxSize*2);

  if(mouseX != pmouseX || mouseY != pmouseY){
    mouseBox = new Rectangle(x, y, MouseBoxSize, MouseBoxSize);
    points = quadTree.query(mouseBox);
  }
  console.log(points.length);
  strokeWeight(4);
  stroke(0, 255, 0);
  for(let p of points){
      point(p.x, p.y);
  }
}

// function mousePressed(){
//   quadTree.insert(new Point(mouseX, mouseY));
// }

QuadTree.prototype.show = function () {
  //1. draw its own box
  stroke(127)
  strokeWeight(1);
  noFill();
  rectMode(CENTER);
  rect(this.boundary.x-1/2, this.boundary.y-1/2, this.boundary.w*2, this.boundary.h*2);

  //2. show its children
  if(this.divided){
    this.ne.show();
    this.nw.show();
    this.se.show();
    this.sw.show();
  }

};
QuadTree.prototype.showPoints = function () {
  strokeWeight(2);
  stroke(0);
  if(!this.divided){
    for(let p of this.points){
      point(p.x, p.y);
    }
  }else{
    this.ne.showPoints();
    this.nw.showPoints();
    this.se.showPoints();
    this.sw.showPoints();
  }
};
