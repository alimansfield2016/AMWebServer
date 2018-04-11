let noItems = 100;
let Speed = 1;
let items = [];
let groups = [];

let Pairing = true;
let Merging = false;
let Merge1;
let Merge2;
let MergeGroup;

let J = 0;
let N = 0;
let P = 0;

let Comparisons = 0;
let Swaps = 0;



function setup(){

  let params = getURLParams();
  if(params.Count){
    noItems = params.Count;
  }
  if(params.Speed){
    Speed = params.Speed;
  }
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  for(let i = 0; i < noItems; i++){
    items[i] = new Item(i, false);
  }
  shuffleItems();

  //break the list down into pairs
  breakDownItems();

  //have a part of the draw loop sort each pairs

  //then have another part of the draw loop merge the blocks together



  }

  function draw(){
    background(255);
    unGroupItems();
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
  //merge sort

  for(let s = 0; s < Speed; s++){


    if(Pairing){
      if(J >= groups.length){
        J = -1;
        Pairing = false;
      }
      else if(groups[J].length < 2){}
      else if(groups[J][0].val > groups[J][1].val){
        SwapGroups(J, 0, 1);
        Swaps++;
      }
      else{
        Comparisons++;
      }
      J++;
    }
    else{
      if(Merging){
        if(Merge1.length == 0){
          //put the rest of Merging2 into MergeGroup
          for(let i = 0; i < Merge2.length; i++){
            MergeGroup.push(Merge2[i]);
            Comparisons ++;
          }
          Merging = false;
        }else if(Merge2.length == 0){
          //put the rest of Merging1 into MergeGroup
          for(let i = 0; i < Merge1.length; i++){
            MergeGroup.push(Merge1[i]);
            Comparisons ++;
          }
          Merging = false;
        }
        else{
          //whichever of the two index[0] values is lower is added to mergeGroup;
          Comparisons++;
          if(Merge1[0].val < Merge2[0].val){
            MergeGroup.push(Merge1[0]);
            Merge1.splice(0, 1);
          }else{
            MergeGroup.push(Merge2[0]);
            Merge2.splice(0, 1);
            Swaps++;
          }
          groups[N  ] = MergeGroup;
          groups[N+1] = concat(Merge1, Merge2);

        }
    if(!Merging){
      groups.splice(N+1, 1);
      if(groups.length == 1){
        Speed = -1;
        break;
      }
      N++;
      if(N >= groups.length-1){
        N=0;
        P++;
        console.log(P);    }
      }
    }else{
        MergeGroup = [];
        Merge1 = groups[N  ];
        Merge2 = groups[N+1];
        Merging = true;


        }
    }
  }
  if(Speed == 0){
    noLoop();
  }
  if(Speed == -1){
    Speed = 0;
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

function SwapGroups(i, index1, index2){
  temp = groups[i][index1];
  groups[i][index1] = groups[i][index2];
  groups[i][index2] = temp;
}

function breakDownItems(){
  for(let i = 0; i < items.length; i+=2){
    if(i == items.length-1){
      groups[i/2] = [items[i]];
    }else{
      groups[i/2] = [items[i], items[i+1]];
    }
  }
}

function unGroupItems(){
let l = 0;
  for(let i = 0; i < groups.length; i++){
    for(let k = 0; k < groups[i].length; k++){
      items[l] = groups[i][k];
      l++;
    }
  }
}
