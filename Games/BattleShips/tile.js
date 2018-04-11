function Tile(x, y){
  this.x = x;
  this.y = y;
  this.shows = false;
  this.ship;

  this.show = function(){
    push();
    stroke(255);
    strokeWeight(1);
    fill(0, 150, 200);
    if(!this.shows){
      fill(0);
    }
    if(this.ship){
      fill(200, 0, 0);
    }
    rect(this.x*w, this.y*w, w, w);
    pop();
  }

}
