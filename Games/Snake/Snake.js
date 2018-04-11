function Snake(x, y, len){
  this.x = x;
  this.y = y;
  this.length = len;
  this.direction;

  this.tail = []

  this.update = function(){
    let temp = {x:this.x, y:this.y};
    switch(direction){
      case UP_ARROW:
        this.y--;
        break;
      case DOWN_ARROW:
        this.y++;
        break;
      case LEFT_ARROW:
        this.x--;
        break;
      case RIGHT_ARROW:
        this.x++;
        break;
    }
    if(this.x == food.x && this.y == food.y){
      this.grow();
    }

    for(let i = this.length - 1; i >= 1; i--){
      this.tail[i] = this.tail[i-1];
    }
    this.tail[0] = temp;
    if(this.x < 0 || this.y < 0){
      gameOver();
    }
    if(this.x >= cols || this.y >= rows){
      gameOver();
    }

    for(let i = 0; i < this.tail.length; i++){
      if(this.tail[i].x == this.x && this.tail[i].y == this.y){
        gameOver();
      }
    }
    this.draw();
  }
  this.grow = function(){
    frameRate(frameRate()*1.07);
    newFood();
    this.length++;
    length++;

  }
  this.changeDirection = function(dir){
    this.direcion = dir;
  }
  this.draw = function(){
    noStroke();
    fill(0);
    rect(this.x*w, this.y*w, w, w);
    fill(63);
    for(let i = 0; i < this.tail.length; i++){
      fill(0, 0, 0, map(i+0.5, 0, this.tail.length, 255, 16));
      rect(this.tail[i].x*w, this.tail[i].y*w, w, w);
    }
  }
}
