function Perceptron(noInputs, learningRate) {
  this.noInputs = noInputs;
  this.lr = learningRate;
  this.weights = new Array(this.noInputs+1)
  this.pluscount = 0;
  this.minuscount = 0;
  for(let i = 0; i <= this.noInputs; i++){
    this.weights[i] = random();
  }

  this.train = function(input_array, answer){
    let guess = this.predict(input_array);
    let error = answer - guess;
    for(let i = 0; i < this.weights.length-1; i++){
      this.weights[i] += input_array[i] * error * this.lr;
    }
    this.weights[this.noInputs] += error*this.lr;
    if(error != 0){
      this.pluscount += error > 0 ? 1 : 0;
      this.minuscount += error > 0 ? 0 : 1;
    }
  }

  this.feedForward = function(input_array){
    if(input_array.length + 1 == this.weights.length){
      let sum = 0;
      for(let i = 0; i < input_array.length; i++){
        sum += input_array[i]*this.weights[i];
      }
      sum += this.weights[noInputs];
      return sum;
    }
  }
  let sign = function(val){
    return val > 0 ? 1 : val < 0 ? -1 : 0;
  }

  this.predict = function(input_array){
    let prediction;
    prediction = sign(this.feedForward(input_array));
    if(prediction != 0){
      this.pluscount += prediction > 0 ? 1 : 0;
      this.minuscount += prediction > 0 ? 0 : 1;
    }

    return prediction;
  }
}
