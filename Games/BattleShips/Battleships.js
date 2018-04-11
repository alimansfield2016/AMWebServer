let rows = 10;
let cols = 10;
let w;
let h;
let tiles;


function setup(){
  createCanvas(400, 400);

  tiles = new Array(rows*cols);
  w = floor(width / cols);
  h = floor(height / rows);
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      tiles[Index(i, j)] = new Tile(i, j);
    }
  }

}

function draw(){
  background(127);



  for(let i = 0; i < tiles.length; i++){
    tiles[i].show();
  }

}

function mousePressed(){
  tiles[Index(floor(mouseX/w), floor(mouseY/h))].shows = true;
}

function Index(x, y) {
  return  x + y * cols;
}
