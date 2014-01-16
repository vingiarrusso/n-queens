/*           _                    
   ___  ___ | |_   _____ _ __ ___ 
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n){
  var N = n;
  var solution = [];
  var board = new Board({n:n});

  var recurse = function(row,col,n) {
    if(n===1){
      for(var i=0; i<N; i++){
        solution.push(board.get(i));
      }
    } else{
      board.togglePiece(row,col);
      recurse(row+1,col+1,n-1);
    }
  };
  if(n===1){
    return [1];
  }

  recurse(0,0,n);
  return solution;
};




window.countNRooksSolutions = function(n){
  var solutionCount = 0;
  var board = new Board({n:n});
  // var recurse = function factorial(n){
  //   if (n <= 1) return 1;
  //   return n*factorial(n-1);
  // };
  var recurse = function(board, n){
    if(n <= 1){
      solutionCount++;
      return;
    }
    for( var i=0; i<board.get(0).length; i++){
      board.togglePiece(0,i);
      recurse(new Board({n:n-1}),n-1);
    }
  };
  recurse(board, n);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n){
  //var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n){
  //var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
