let noItems = 100;
let Speed = 1;
let items = []
let Framerate = 30;

let inserting = false;
let j = 1;
let n = 0;
let m = 0;
let dir = 1;

let Comparisons = 0;
let Swaps = 0;



function setup(){
  let params = getURLParams();
  if(params.Count){
    noItems = params.Count;
  }
  if(params.Speed){
    if(params.Speed < 1){
      Framerate += params.Speed;
    }else{
      Speed = params.Speed;
    }
  }
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  for(let i = 0; i < noItems; i++){
    items[i] = new Item(i, false);
  }
  frameRate(Framerate);
  shuffleItems();


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
        strokeWeight(100/noItems);
      }
      fill(int((items[i].val/noItems)*255), 255, 255);
      rect(i*barWidth , windowHeight, barWidth, -height);
    }


    //Insertion Sort
    for(let s = 0; s < Speed; s++){
      if(inserting){
        n = n/2;
        m += n*dir;
        if(n < 1){
          (items[j].val > items[int(m)].val) ? insert(int(m)+1, j) : insert(int(m), j);
          // if(items[j].val > items[n].val){
          //   insert(j, n+1)
          // }else{
          //   insert(j, n);
          // }
          inserting = false;
          items[j].comparing = false;
          items[int(m)].comparing = false
          Comparisons++;
          Swaps++;
          j++;

        }else{
          dir = items[j].val > items[int(m)].val ? 1 : -1;
          Comparisons++;
        }


      }else{//get the next piece to insert;

        n = j;
        m = 0;
        dir = 1;
        inserting = true;

      }

      noStroke();
      textSize(16);
      fill(0, 0, 0);
      text('Comparisons : ' + Comparisons, 10, 30);
      text('Inserts : '+Swaps, 10, 60);





    }
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
  let temp = items[index1];
  items[index1] = items[index2];
  items[index2] = temp;
}
