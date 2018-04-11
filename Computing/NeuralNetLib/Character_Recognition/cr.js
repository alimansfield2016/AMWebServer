let clear;

let imgSize;
let imgIndex;
let labelIndex;
let trainingImages;
let trainingLabels;
let testingImages;
let testingLabels;

let epochs;

let nn;

let guesses;
let accuracy;

function preload(){
  trainingImages = loadBytes('train-images.idx3-ubyte');
  trainingLabels = loadBytes('train-labels.idx1-ubyte');
  testingImages = loadBytes('t10k-images.idx3-ubyte');
  testingLabels = loadBytes('t10k-labels.idx1-ubyte');
  imgSize = 28;

  trainingImageIndex = 16;
  trainingLabelIndex = 8;
  testingImageIndex = 16;
  testingLabelIndex = 8;

  //buttons

  let button;
  button = select("#clear_canvas");
  button.mousePressed(() => background(255));

  button = select("#train_epoch");
  button.mousePressed(train);

  button = select("#test_epoch");
  button.mousePressed(test);

  button = select("#guess_canvas");
  button.mousePressed(guess);

  button = select("#save_nn");
  button.mousePressed(saveNN);

  button = select("#load_nn");
  button.mousePressed(() => loadJSON('nn.json', loadNN));

  button = select("#train_20");;
  button.mousePressed( () => {for(let i = 0; i < 20; i++){train()}});

  button = select("#train_50");;
  button.mousePressed( () => {for(let i = 0; i < 50; i++){train()}});

  button = select("#train_100");;
  button.mousePressed( () => {for(let i = 0; i < 100; i++){train()}});

  //loadJSON('nn.json', loadNN)
}

function setup(){
  createCanvas(280, 280);
  background(255);

  if(!nn){
    nn = new NeuralNetwork(784, 2, [500, 300], 10);
  }
  epochs = createP();
  epochs.html('Epochs Trained : ' + nn.epochs);
  Accuracy = createP().html('Accuracy : ' + (0) + '%');
  guesses = createP().html('Guess : Probability');
}

function draw(){

  stroke(0);
  strokeWeight(24);
  if(mouseIsPressed){
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function train(){
  for(let i = 0; i < 600; i++){
    let index = floor(random(60000));
    let arr = [];
    for(let j = 0; j < imgSize*imgSize; j++){
      arr[j] = trainingImages.bytes[784*index + j + 16]/255;
      // trainingImageIndex++;
      // if(trainingImageIndex > 47040015){
        // trainingImageIndex = 16;
      // }
    }
    let target = new Array(10).fill().map(() => 0);
    target[trainingLabels.bytes[index + 8]] = 1;
    // trainingLabelIndex++;
    // if(trainingLabelIndex > 60007){
    //   trainingImageIndex = 8;
    // }
    nn.train(arr, target);
    epochs.html('Epochs Trained : ' + nn.epochs + '<br>' + 'Epoch Training : ' + (i/6).toPrecision(4) + '%')
  }
  nn.epochs++;


  epochs.html('Epochs Trained : ' + nn.epochs);

}

function test(){
  let correct = 0;
  for(let i = 0; i < 100; i++){
    let index = floor(random(10000));
    let arr = new Array(imgSize*imgSize);
    for(let j = 0; j < imgSize*imgSize; j++){
      arr[j] = testingImages.bytes[784*index + j + 16]/255;
      // testingImageIndex++;
      // if(testingImageIndex > 7840015){
        // testingImageIndex = 16;
      // }
    }
    let target = testingLabels.bytes[index + 8];
    let result = nn.predict(arr);
    // let sum = result.reduce((acc, x) => acc + x , 0);
    // result.map(x => x / sum);
    let mostLikely = result.reduce((acc, val, ind, me) => val > me[acc] ? ind : acc , 0);
    // testingLabelIndex++;
    // if(testingLabelIndex > 10007){
    //   testingImageIndex = 8;
    // }

    if(target == mostLikely){
      correct++;
    }
  }

Accuracy.html('Accuracy : ' + (correct) + '%');
}

function guess(){
  let img = get();
  img.resize(28, 0);
  let arr = new Array(img.width * img.height);
  let c;
  let prediction;

  img.loadPixels();
  for(let i = 0; i < arr.length; i++){
    c = img.pixels[4*i    ];
    arr[i] = 1- (c/255);

  }

  img.updatePixels();
  let result = nn.predict(arr);
  // let sum = result.reduce((acc, x) => acc + x , 0);
  // result.map(x => x / sum);
  let sum = result.reduce((acc, x) => acc + x , 0);

  prediction = result.reduce((acc, val, ind, me) => val > me[acc] ? ind : acc , 0);
  let prob = result[prediction]/sum
  let sorted = new Array(10);
  for(let i = 0; i < 10; i++){
    sorted[i] = {prob:result[i]/sum, ind:i};
  }
  sorted = sorted.sort((x, y) => y.prob-x.prob);
  guesses.html('Guess : Probability', false);
  for(let i = 0; i < 10; i++){
    guesses.html('<br>  ' + sorted[i].ind + '  : ' + (sorted[i].prob*100).toPrecision(4) + '%' , true);
  }
}

function saveNN(){
  let nnjson = nn.serialize();
  saveJSON(nnjson, 'nn.json');
}
function loadNN(nnjson){
  nn = NeuralNetwork.deserialize(nnjson);
  epochs_trained = nn.epochs;
  epochs.html('Epochs Trained : ' + nn.epochs);
}
