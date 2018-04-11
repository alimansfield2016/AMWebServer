let noItems = 100;
let Speed = 1;
let items = [];

let j = 0;
let start = 0;
let Sorting = true;
let n = 0;

let Comparisons = 0;
let Swaps = 0;


function setup(){
  createCanvas(windowWidth, windowHeight);
  let params = getURLParams();
  if(params.Count || params.Speed){
    history.pushState(null, '', getURL());
  }
  if(params.Count){
    noItems = params.Count;
  }
  if(params.Speed){
    Speed = params.Speed;
  }
  colorMode(HSB);
  for(let i = 0; i < noItems; i++){
    items[i] = new Item(i, false);
  }
  shuffleItems();


  //BubbleSort();
}

function draw(){
  background(255);
let barWidth = (windowWidth/noItems);
  for(let i = 0; i < noItems; i++){
    let height = map(items[i].val, 0, noItems, 0,  windowHeight);
    if(!items[i].comparing){
      stroke(255);
      noStroke();
    }else{
      stroke(0);
      strokeWeight(1);
    }
    fill(int((items[i].val/noItems)*255), 255, 255);
    rect(i*barWidth, windowHeight, barWidth-1, -height);
  }

  //Shuttle Sort

  if(j < noItems-1){
    Comparisons++;
    if(items[j].val > items[j+1].val){
      Swaps++;
      Swap(j, j+1);
      j--;
    }else{
      n++;
      j=n;
    }
    if(j < 0){
      n++;
      j=n;
    }
  }
  else{
    noLoop();
  }
  noStroke();
  textSize(16);
  fill(0, 0, 0);
  text('Comparisons : ' + Comparisons, 10, 30);
  text('Swaps : '+Swaps, 10, 60);

}

function shuffleItems(){ //perform fisher yeates shuffle
  let temp;
  let rand;
  for(let i = 0; i < noItems; i++){
    rand = floor(random(noItems));
    Swap(i, rand);
  }
}

function Swap(index1, index2){
  temp = items[index1];
  items[index1] = items[index2];
  items[index2] = temp;

}

function resizeWindow(){
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
