function Cannon(){
  this.x = floor((cols-12)/2);
  this.y = rows-10;
  this.lives = 3;

  this.shoot = function(){


  }

  this.draw = function(){
    noStroke();
    for(let i = 0; i < cannon.length; i++){
      for(let j = 0; j < cannon[i].length; j++){
        fill(cannon[i][j]);
        rect((this.x + j)*s, (this.y + i)*s, s, s);
      }
    }
  }
}
