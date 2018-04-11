let nn;
let trainingData = [
  {
    data : [0, 0],
    answer : [0]
  },
  {
    data : [1, 0],
    answer : [1]
  },
  {
    data : [0, 1],
    answer : [1]
  },
  {
    data : [1, 1],
    answer : [0]
  }
]

function setup(){
  nn = new NeuralNetwork(2, 16, 1);
  createCanvas(400, 400);

}

function draw(){
  background(0);
  for(let i = 0; i < 10000; i++){
    let data = random(trainingData);
    nn.train(data.data, data.answer);
  }

  loadPixels()
  let cols = width;
  let rows = height;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      let y = nn.predict(inputs)[0] * 255;
      // noStroke();
      // fill(y * 255);
      // rect(i * resolution, j * resolution, resolution, resolution);
      var d = pixelDensity();
      for (let k = 0; k < d; k++) {
        for (let l = 0; l < d; l++) {
          // loop over
          idx = 4 * ((j * d + l) * width * d + (i * d + k));
          pixels[idx] = y;
          pixels[idx+1] = y;
          pixels[idx+2] = y;
          pixels[idx+3] = 255;
        }
      }    }
  }
  updatePixels();


  // for(let x = 0; x < width/20; x++){
  //   for(let y = 0; y < height/20; y++){
  //     noStroke();
  //     let val = nn.feedForward([x/(width/20), y/(height/20)]);
  //     fill(val*255);
  //     rect(20*x, 20*y, 20, 20);
  //   }
  // }
  // strokeWeight(4);
  // stroke(0);
  // rect(0,0,width, height);
  if(frameCount > 120){
    noLoop();
    createP().html("Finished");
  }

}
