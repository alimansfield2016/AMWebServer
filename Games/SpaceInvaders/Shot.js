function Shot(xVel){
  this.x = (myCannon.x+6)*s+xVel;
  this.y = (myCannon.y-1)*s;
  this.yVel = -1;
  this.xVel = 0;//xVel/4;

  this.update = function(){
    this.x += this.xVel*5;
    this.y += this.yVel*5;
    this.draw();
    //check to see if it has collided with anything




    let x = floor(this.x / s);
    let y = floor(this.y / s);
    if(y < 0 || x < 0 || x > width){
      shots.splice(shots.indexOf(this), 1);
    }
  }

  this.draw = function(){
    push();
      strokeWeight(3);
      stroke(g);
      line(this.x, this.y, this.x - this.xVel, this.y+2*s);
    pop();
  }
}
