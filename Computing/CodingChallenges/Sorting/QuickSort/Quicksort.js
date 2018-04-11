let noItems = 100;
let Speed = 1;
let items = [];

let pivoting;
let Pivot;
let Checked;
let sorting = true;
let pivotMax;
let pivotMin;

let Comparisons = 0;
let Swaps = 0;




function setup(){
  let Params = getURLParams()
  frameRate(120);
  if(Params.Count){
    noItems = Params.Count;
  }
  if(Params.Speed){
    Speed = Params.Speed;
  }
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  for(let i = 0; i < noItems; i++){
    items[i] = new Item(i, false);
  }
  shuffleItems();

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
      strokeWeight(100/noItems);
    }
    fill(int((items[i].val/noItems)*255), 255, 255);
    rect(i*barWidth , windowHeight, barWidth, -height);
  }

for(let s = 0; s < Speed; s++){
  if(sorting){
    if(pivoting){
      if(Checked <= pivotMax){
        if(items[Checked].val < items[Pivot].val){
          insert(Pivot, Checked);
          Pivot++;
          Swaps++;
        }
        Comparisons++;
      }else{
        pivoting = false;
      }

      Checked++;
    }else{ //find the next gap in the sorted stuff
      let found = false;
      pivotMax = noItems-1;
      for(let i = 0; i < noItems; i++){
        if(!found){
          if(!items[i].sorted){
            found = true;
            pivotMin = i;
          }
        }else{
          if(items[i].sorted){
            pivotMax = i-1;
            break;
          }
        }
      }
      if(!found){
        Speed = -1
        break;
      }
      Pivot = pivotMin;
      items[Pivot].sorted = true;
      Checked = pivotMin+1;
      pivoting = true;
    }



  }else{
    noLoop();
  }
}
if(Speed == 0){
  noLoop();
}
if(Speed < 0){
  Speed++;
}


noStroke();
textSize(16);
fill(0, 0, 0);
text('Comparisons : ' + Comparisons, 10, 30);
text('Swaps : '+Swaps, 10, 60);
push();
stroke(0);
strokeWeight(2);
noFill();
rect(10, 70, 60, 30);
pop();
text('Back', 10, 90);
}

function shuffleItems(){ //perform fisher yeates shuffle
  let temp;
  let rand;
  for(let i = 0; i < noItems; i++){
    rand = floor(random(noItems));
    Swap(i, rand);
  }
}

function insert(index1, index2){
  let temp;
  let temp2;
  temp = items[index2];
  for(let i = index1; i < index2; i++){
    Swap(i, index2);
  }
}


function Swap(index1, index2){
  temp = items[index1];
  items[index1] = items[index2];
  items[index2] = temp;
}
