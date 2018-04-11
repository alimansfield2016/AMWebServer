class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

  }

  contains(point){
    return(
      point.x >= this.x - this.w &&
      point.y >= this.y - this.h &&
      point.x <  this.x + this.w &&
      point.y <  this.y + this.h
    )
  }

  intersects(rect){
    if(rect.x + rect.w > this.x - this.w && rect.x - rect.w < this.x + this.w){
      //the minimum x of rect is less than the max x of this
      //and
      //the maximum x of rect is greater than the min x of techniques
      if(rect.y + rect.h > this.y - this.h && rect.y - rect.h < this.y + this.h){
        //the minimum y of rect is less than the max y of this
        //and
        //the maximum y of rect is greater than the min y of techniques
        return true;
      }


    }
  }
}

class QuadTree {
  constructor(boundary, n = 3) {
    this.boundary = boundary
    this.capacity = n;

    this.divided = false;
    this.points = [];
  }

  subdivide(){
    this.divided = true;
    let w2 = this.boundary.w/2;
    let h2 = this.boundary.h/2;
    let x = this.boundary.x;
    let y = this.boundary.y;
    this.ne = new QuadTree(new Rectangle(x + w2, y - h2, w2, h2), this.capacity)
    this.nw = new QuadTree(new Rectangle(x - w2, y - h2, w2, h2), this.capacity)
    this.se = new QuadTree(new Rectangle(x + w2, y + h2, w2, h2), this.capacity)
    this.sw = new QuadTree(new Rectangle(x - w2, y + h2, w2, h2), this.capacity)



    for(let p of this.points){
      // this.ne.insert(p);
      // this.nw.insert(p);
      // this.se.insert(p);
      // this.sw.insert(p);
      this.insert(p);
    }
    this.points = [];

  }

  insert(point){
    if(!this.boundary.contains(point)){
      return false;
    }
    if(this.divided){
    }else if(this.points.length <  this.capacity){
      this.points.push(point);
      return true;
    }else{
      this.subdivide();
    }
    this.ne.insert(point);
    this.nw.insert(point);
    this.se.insert(point);
    this.sw.insert(point);
  }

  query(region, points){
    if(!points){
      points = [];
    }if(this.boundary.intersects(region)){
      if(this.divided){
        points.concat(this.ne.query(region, points));
        points.concat(this.nw.query(region, points));
        points.concat(this.se.query(region, points));
        points.concat(this.sw.query(region, points));
      }else{
        for(let p of this.points){
          if(region.contains(p)){
            points.push(p);
          }
        }
      }
    }
    return points;
  }
}
