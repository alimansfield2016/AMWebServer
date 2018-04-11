

function setup(){
createCanvas(400, 100);
background(200);

  for(let i = 0; i < 10; i++){
    createDiv('')
    for(let i = 0; i < 4; i++){
      let b = createButton('b1');
      b.attribute('class', 'calc_b');
    }
  }
}
