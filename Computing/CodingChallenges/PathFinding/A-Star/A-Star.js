let nodes = [];
let cols = 100;
let rows = 100;
let w;
let h;
let Speed = 1;

let openSet = [];
let closedSet = [];
let current;

let start;
let end;
let n = 0;
let done = false;

let tol = 0;

function setup(){
  createCanvas(400, 400);
  frameRate(120);
  let params = getURLParams();
  if(params.Tol){
    tol = params.Tol;
  }
  if(params.Size){
    cols = params.Size;
    rows = params.Size;
  }
  if(params.Speed){
    Speed = params.Speed;
  }
  w = width/cols;
  h = height/rows;

  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      nodes[Index(x, y)] = new Node(x, y, ((random(1) < .3) ? true : false ));
    }
  }
  start = nodes[0];
  start.wall = false;
  end   = nodes[Index(cols-1, rows-1)];
  end.wall = false;
  for(let x = 0; x < cols-1; x++){
    for(let y = 0; y < rows-1; y++){
      nodes[Index(x, y)].h = heuristic(nodes[Index(x, y)]);
    }
  }
  start.g = 0;
  start.f = start.g+start.h;
  start.inOpenSet = true;
  openSet.push(start);

}

function draw(){
  background(255);
  for(let i = 0; i < nodes.length; i++){
    nodes[i].draw();
  }
  // nodes[n].draw();
  // n++;
  for(let s = 0; s < Speed; s++){
    aStar();
    if(done){
      break;
    }
  }

}

function Index(x, y){
  return x + y*cols;
}

function removeFromArray(array, element){
  for(let i = array.length-1; i >= 0; i--){
    if(array[i] == element){
      array.splice(i, 1);
    }
  }
  return array;
}

function aStar(){
  //find the node in the open set with the lowest cost;
  let bestIndex = 0;
  let best = undefined;
  for(let i = 0; i < openSet.length; i++){
    if(openSet[i].f < openSet[bestIndex].f){
      bestIndex = i;
    }
  }
  best = openSet[bestIndex];
  //add its neighbors to the open set if they are not a wall
  let neighbors = best.getNeighbors();
  for(let i = 0; i < neighbors.length; i++){
    if(neighbors[i].inOpenSet){
      if(neighbors[i].g > best.g + dist(neighbors[i].x, neighbors[i].y, best.x, best.y)){
        openSet = removeFromArray(openSet, neighbors[i]);
        neighbors[i].g = best.g + dist(neighbors[i].x, neighbors[i].y, best.x, best.y);
        neighbors[i].f = neighbors[i].g + neighbors[i].h;
        neighbors[i].previous = best;
        openSet.push(neighbors[i]);
        neighbors[i].inOpenSet = true;
      }
    }else if(!neighbors[i].inClosedSet){
      neighbors[i].g = best.g + dist(neighbors[i].x, neighbors[i].y, best.x, best.y);
      neighbors[i].f = neighbors[i].g + neighbors[i].h;
      neighbors[i].previous = best;
      openSet.push(neighbors[i]);
      neighbors[i].inOpenSet = true;
    }
  }


  //add it to the closed set
  best.inOpenSet = false;
  openSet = removeFromArray(openSet, best);
  best.inClosedSet = true;
  closedSet.push(best);
  best.draw(true);
  if(best.x == end.x && best.y == end.y){
    noLoop();
    done=true;
    console.log("Done!");
    background(255);
    for(let i = 0; i < nodes.length; i++){
      nodes[i].draw();
    }
    best.draw(true);
  }

}
