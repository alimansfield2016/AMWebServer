let noItems = 100;
let items = [];

let j = 0;
let start = 0;
let end = noItems-1;
let Sorting = true;
let DirectionUp = true;
let lastSwap = -1;

let Comparisons = 0;
let Swaps = 0;


function setup(){
  createCanvas(windowWidth, windowHeight);
  let params = getURLParams();
  if(params.Count){
    noItems = params.Count;
    end = noItems-1;
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
    if(!items[i].sorted){
      stroke(255);
      noStroke();
    }else{
      stroke(0);
      strokeWeight(1);
    }
    fill(int((items[i].val/noItems)*255), 255, 255);
    rect(i*barWidth, windowHeight, barWidth-1, -height);
  }
  if(Sorting){
    if(!DirectionUp){
      if(j < (start)){
        items[start].comparing = false;
        items[start+1].comparing = false;
        items[start +2].comparing = false;
        start = lastSwap;
        j = start;
        DirectionUp = true;
        if(end-start <= 1){
          Sorting = false;
          noLoop();
        }
      }
      else{
        Comparisons++;
        if(items[j].val > items[j+1].val){
          Swap(j, j+1);
          lastSwap = j;
          Swaps++;
        }
        if(j-1 >= 0){
          items[j].comparing = true;
        }
        items[j+1].comparing = true;
        if(j+2 < noItems){
          items[j+2].comparing = false
        }
        j--
      }
    }
    else{
      if(j >= end){
        items[end-2].comparing = false;
        items[end-1].comparing = false;
        items[end].comparing = false;

        end = lastSwap;
        j = end;
        DirectionUp = false;
        if(end-start <= 1){
          Sorting = false;
          noLoop();
        }
      }
      else{
        Comparisons++;
        if(items[j].val > items[j+1].val){
          Swap(j, j+1);
          lastSwap = j;
          Swaps++;
        }
        if(j-1 >= 0){
          items[j-1].comparing = false;
        }
        items[j].comparing = true;
        if(j+1 < noItems){
          items[j+1].comparing = true
        }
        j++
      }
    }
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
