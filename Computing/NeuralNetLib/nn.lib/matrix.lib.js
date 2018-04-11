class Matrix{
  constructor(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.matrix = new Array(rows);
    for(let i = 0; i < this.matrix.length; i++){
      this.matrix[i] = new Array(cols).fill(1);
    }
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.')
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.matrix[i][k] * b.matrix[k][j];
        }
        return sum;
      });
  }

  multiply(matrix){
    if(matrix instanceof Matrix){
      //matrix multiplication here
      if(this.cols != matrix.rows) {
        throw new Error("Matrices cannot be multiplied")
      }else{
        return Matrix.multiply(this, matrix);
      }
    }else if(typeof(matrix) == "number"){
      let m = new Matrix(this.rows, this.cols);
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          m.matrix[i][j] = matrix*this.matrix[i][j];
        }
      }
      return m;
    }
  }

  haddamard(matrix){
    if(matrix instanceof Matrix){
      if(this.cols == matrix.cols && this.rows == matrix.rows){
        //matrices are compatible
        let m = new Matrix(this.rows, this.cols);
        for(let i = 0; i < this.rows; i++){
          for(let j = 0; j < this.cols; j++){
            m.matrix[i][j] = this.matrix[i][j]*matrix.matrix[i][j];
          }
        }
        return m;
      }else{
        throw new Error("Matrices are not compatible")
      }
    }
  }

  add(matrix){
    if(matrix instanceof Matrix){
      if(matrix.rows == this.rows && matrix.cols == this.cols){
        this.map((x, i, j) => x + matrix.matrix[i][j]);
      }else{
        throw new Error(["Matrices must be of the same size"])
      }
    }else if(typeof(matrix) == 'number'){
      this.map(x => x + matrix);
    }
  }
  subtract(matrix){
    if(matrix instanceof Matrix){
      if(matrix.rows == this.rows && matrix.cols == this.cols){
        this.map((x, i, j) => x - matrix.matrix[i][j]);
      }else{
        throw new Error(["Matrices must be of the same size"])
      }
    }else if(typeof(matrix) == 'number'){
      this.map(x => x - matrix);
    }
  }

  transpose(){
    let m = new Matrix(this.cols, this.rows);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        m.matrix[j][i] = this.matrix[i][j];
      }
    }
    return m;
  }
  static transpose(matrix){
    let m = new Matrix(matrix.cols, matrix.rows);
    for(let i = 0; i < matrix.rows; i++){
      for(let j = 0; j < matrix.cols; j++){
        m.matrix[j][i] = matrix.matrix[i][j];
      }
    }
    return m;
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.matrix[i][j];
        this.matrix[i][j] = func(val, i, j);
      }
    }
    return this;
  }
  static map(matrix, func){
    let m = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let val = m.matrix[i][j];
        m.matrix[i][j] = func(val, i, j);
      }
    }
    return m;
  }


  toArray(){
    if(this.cols == 1 || this.rows == 1){
      let result = [];
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          result[i+j] = this.matrix[i][j];
        }
      }
      return result;
    }else{
      return this.matrix;
    }
  }

  static fromArray(arr){
    let m = new Matrix(arr.length, 1);
    for(let i = 0; i < arr.length; i++){
      m.matrix[i][0] = arr[i];
    }
    return m;
  }





}
