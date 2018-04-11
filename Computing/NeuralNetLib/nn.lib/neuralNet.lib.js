// Other techniques for learning

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }

}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  // TODO: document what a, b, c are
  constructor(a, b, c, d) {
    this.epochs = 0;
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.output_nodes = a.output_nodes;

      this.number_hidden_layers = a.number_hidden_layers;
      this.hidden_nodes_layers = new Array(a.number_hidden_layers).fill().map((x, i) => a.hidden_nodes_layers[i]);


      this.weights = new Array(a.weights.length).fill().map((x, i) => a.weights[i].copy());
      this.biases = new Array(a.biases.length).fill().map((x, i) => a.biases[i].copy());

      this.epochs = a.epochs;
    } else {
      this.input_nodes = a;
      this.output_nodes = d == undefined ? c : d;

      this.number_hidden_layers = d != undefined ? b : 1;
      let layers = new Array(this.number_hidden_layers).fill().map((x, i) => d == undefined ? b instanceof Array ? b[i] : b : c instanceof Array ? c[i] : c);
      this.hidden_nodes_layers = layers;

      this.weights = new Array(this.number_hidden_layers + 1);
      for(let i = 0; i < this.weights.length; i++){
        let rows;
        let cols;
        if(i == 0){
          cols = this.input_nodes;
          rows = this.hidden_nodes_layers[i];
        }else if(i == this.weights.length-1){
          rows = this.output_nodes;
          cols = this.hidden_nodes_layers[i-1];
        }else{
          rows = this.hidden_nodes_layers[i];
          cols = this.hidden_nodes_layers[i-1];
        }
        this.weights[i] = new Matrix(rows, cols);
        this.weights[i].randomize();
      }

      this.biases = new Array(this.number_hidden_layers + 1);
      for(let i  = 0; i < this.biases.length; i++){
        this.biases[i] = new Matrix(i == this.number_hidden_layers ? this.output_nodes : this.hidden_nodes_layers[i] , 1);
      }


    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {
    let hidden_layers = new Array(this.number_hidden_layers).fill();
    let inputs = Matrix.fromArray(input_array);
    let outputs;
    let iters = this.number_hidden_layers + 1;

    // Generating the Hidden Outputs
    for(let i = 0; i < iters; i++){
      let inp = i == 0 ? inputs : hidden_layers[i-1];
      // let layer = i == iters-1 ? outputs : hidden_layers[i];
      let layer = Matrix.multiply(this.weights[i], inp);

      layer.add(this.biases[i]);
      // activation function!
      layer.map(this.activation_function.func);
      if(i == iters-1){
        outputs = layer;
      }else{
        hidden_layers[i] = layer;
      }
    }
    // Sending back to the caller!
    return outputs.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    let hidden_layers = new Array(this.number_hidden_layers).fill();
    let inputs = Matrix.fromArray(input_array);
    let outputs;
    let iters = this.number_hidden_layers + 1;

    // Generating the Hidden Outputs
    for(let i = 0; i < iters; i++){
      let inp = i == 0 ? inputs : hidden_layers[i-1];
      // let layer = i == iters-1 ? outputs : hidden_layers[i];
      let layer = Matrix.multiply(this.weights[i], inp);

      layer.add(this.biases[i]);
      // activation function!
      layer.map(this.activation_function.func);
      if(i == iters-1){
        outputs = layer;
      }else{
        hidden_layers[i] = layer;
      }
    }

    //--------------------------------------------------------------------//


    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let prev_error = Matrix.subtract(targets, outputs);


    //-----------------------------------------------------------------//


    // Calculate gradient
    for(let i = this.weights.length-1; i >= 0; i--){
      let gradients = Matrix.map(outputs, this.activation_function.dfunc);
      gradients.multiply(prev_error);
      gradients.multiply(this.learning_rate);


      // Calculate deltas
      let hidden_T =  i != 0 ? Matrix.transpose(hidden_layers[i-1]) : Matrix.transpose(inputs);
      let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

      // Adjust the weights by deltas
      this.weights[i].add(weight_ho_deltas);
      // Adjust the bias by its deltas (which is just the gradients)
      this.biases[i].add(gradients);




      //--------------------------------------------------------------------//


      if(i != 0){
        // Calculate the hidden layer errors
        let who_t = Matrix.transpose(this.weights[i]);
        prev_error= Matrix.multiply(who_t, prev_error);
        outputs = hidden_layers[i-1];
      }
    }


    //-----------------------------------------------------------------//

  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.number_hidden_layers, data.hidden_nodes_layers, data.output_nodes);
    let len = data.number_hidden_layers + 1;
    nn.weights = new Array(len);
    nn.biases = new Array(len);
    for(let i = 0; i < nn.weights.length; i++){
      nn.weights[i] = Matrix.deserialize(data.weights[i]);
      nn.biases[i] = Matrix.deserialize(data.biases[i]);
    }
    nn.learning_rate = data.learning_rate;
    nn.epochs = data.epochs;
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  mutate(rate, maxChange) {//change is percentage normalised
    function mutate(val) {
      if (Math.random() < rate) {
        if(maxChange){
          return val*(2*(Math.random()-0.5)*maxChange + 1)
        }else{
          return Math.random() * 1000 - 1;
        }
      } else {
        return val;
      }
    }
    for(let weight in this.weights){
      weight.map(mutate);
    }
    for(let bias in this.biases){
      bias.map(mutate);
    }
  }



}
