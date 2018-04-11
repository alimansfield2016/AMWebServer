function Node(x, y, wall){
  this.x = x;
  this.y = y;
  this.wall = wall;
  this.inOpenSet = false;
  this.inClosedSet = false;
  this.index = Index(this.x, this.y);
  this.previous = undefined;

  this.f;
  this.g;
  this.h = 0;//heuristic(this);

  this.draw = function(current){
    if(this.wall){

      push();
        strokeWeight((w+h)/3);
        stroke(0);
        fill(0);
        translate(w/2, h/2);
        let yg0 = this.y > 0 ? true : false;
        let xlm = this.x < cols-1 ? true : false;
        let ylm = this.y < rows-1 ? true : false;
        let ind;
        point(this.x*w, this.y*h);
        if(yg0){
          ind = Index(this.x, this.y-1);
          if(nodes[ind].wall){
            line(this.x*w, this.y*h, nodes[ind].x*w, nodes[ind].y*h);
          }
          ind = Index(this.x+1, this.y-1);
          if(xlm){
            if(nodes[this.index - cols +1].wall){
              line(this.x*w, this.y*h, nodes[ind].x*w, nodes[ind].y*h);
            }
          }
        }
        if(xlm){
          ind = Index(this.x+1, this.y);
          if(nodes[ind].wall){
            line(this.x*w, this.y*h, nodes[ind].x*w, nodes[ind].y*h);
          }
          ind = Index(this.x+1, this.y+1);
          if(ylm){
            if(nodes[ind].wall){
              line(this.x*w, this.y*h, nodes[ind].x*w, nodes[ind].y*h);
            }
          }

        }
      pop();
      /*
      stroke(0);
      //strokeWeight(w/2);
      noStroke();
      fill(0)
      ellipse(this.x*w + w/2, this.y*h + h/2, w, h)
      */
    }
    else if(current){
      push();
        translate(w/2, h/2);
        stroke(0, 0, 255);
        strokeWeight((h+w)/6);
        noFill();
        beginShape();
        // this.drawPrev();
        let temp = this;
        vertex(temp.x*w, temp.y*h);
        while(temp.previous){
          temp = temp.previous;
          vertex(temp.x*w, temp.y*h);
        }
        endShape()
      pop();


    }
    if(this.inOpenSet){
      push()
      fill(0, 255, 0);
      noStroke();
      ellipse((this.x+0.5)*w, (this.y+0.5)*h, w/1.5, h/1.5);
      pop();
    }else if(this.inClosedSet){
      push()
      fill(255, 0, 0);
      noStroke();
      ellipse((this.x+0.5)*w, (this.y+0.5)*h, w/1.5, h/1.5);
      pop();
    }
  }


  this.drawPrev = function(){
    vertex(this.x*w, this.y*h);
    if(this.previous){
      this.previous.drawPrev();
    }
  }

  this.getNeighbors = function(){
    let neighbors = [];
    let yg0 = this.y > 0 ? true : false
    let xg0 = this.x > 0 ? true : false
    let ylm = this.y < rows-1 ? true : false
    let xlm = this.x < cols-1 ? true : false
    let ind;
    if( xg0 && yg0 ){
      ind = Index(this.x-1, this.y-1);
      if(!nodes[ind].wall && !(nodes[Index(this.x-1, this.y)].wall && nodes[Index(this.x, this.y-1)])){
        neighbors.push(nodes[ind])
      }
    }
    if(        yg0 ){
      ind = Index(this.x, this.y-1);
      if(!nodes[ind].wall){
        neighbors.push(nodes[ind])
      }
    }
    if( xlm && yg0 ){
      ind = Index(this.x+1, this.y-1);
      if(!nodes[ind].wall && !(nodes[Index(this.x+1, this.y)].wall && nodes[Index(this.x, this.y-1)])){
        neighbors.push(nodes[ind])
      }
    }
    if( xg0        ){
      ind = Index(this.x-1, this.y);
      if(!nodes[ind].wall){
        neighbors.push(nodes[ind])
      }
    }
    if( xlm        ){
      ind = Index(this.x+1, this.y);
      if(!nodes[ind].wall){
        neighbors.push(nodes[ind])
      }
    }
    if( xg0 && ylm ){
      ind = Index(this.x-1, this.y+1);
      if(!nodes[ind].wall && !(nodes[Index(this.x-1, this.y)].wall && nodes[Index(this.x, this.y+1)])){
        neighbors.push(nodes[ind])
      }
    }
    if(        ylm ){
      ind = Index(this.x, this.y+1);
      if(!nodes[ind].wall){
        neighbors.push(nodes[ind])
      }
    }
    if( xlm && ylm ){
      ind = Index(this.x+1, this.y+1);
      if(!nodes[ind].wall && !(nodes[Index(this.x+1, this.y)].wall && nodes[Index(this.x, this.y+1)].wall)){
        neighbors.push(nodes[ind])
      }
    }
    return neighbors;
  }

}

function heuristic(node){
  //Different versions of heuristics will be commented out for different use
  //Euclidian distance
  // return pow((1+tol/100),dist(node.x, node.y, end.x, end.y));
  return (1+tol/100)*dist(node.x, node.y, end.x, end.y);

  //manhattan distance
  //return abs(this.x*w - end.x*w) + abs(this.y*h - end.y*h);

  //similar to manhattan
  //return max(abs(this.x*w - end.x*w), abs(this.y*h - end.y*h))

}
