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



window.findNRooksSolution = function(n) {
  var solution = [];
  var board = new Board({n: n});

  for (var row = 0; row < n; row++) {
    board.get(row).forEach((square, col) => {
      board.togglePiece(row, col);
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(row, col);
      }
    });
    solution.push(board.get(row));
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, maxRunTime = 0) {
  var solution = [];
  var board = new Board({n: n});

  if (maxRunTime >= n) {
    return solution;
  }

  for (var row = 0; row < n; row++) {
    if (row === 0) {
      board.togglePiece(0, maxRunTime);
    } else {
      board.get(row).forEach((square, col) => {
        board.togglePiece(row, col);
        if (board.hasAnyQueensConflicts()) {
          board.togglePiece(row, col);
        }
      });
    }
    solution.push(board.get(row));
  }

  var numPieces = _.reduce(board.rows(), function(memo, row) {
    return memo + _.reduce(row, function(memo, col) {
      return memo + col;
    }, 0);
  }, 0);

  console.log(maxRunTime, numPieces, n);

  if (numPieces === n) {
    console.log('SOLUTION BOARD');
    console.log(solution.join('\n'));

    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    return solution;
  }

  maxRunTime = maxRunTime + 1;
  return findNQueensSolution(n, maxRunTime);


};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
