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
  var board = new Board({n: n});

  var findSolutions = function(row) {
    // Base case
    if (row === n) {
      console.log('Single solution for ' + n + ' rooks:');
      console.log(board.rows().join('\n'));
      return board.rows();
    }

    // Recurse case
    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if ( !board.hasAnyRooksConflicts() ) {
        return findSolutions(row + 1);
      }
      board.togglePiece(row, i);
    }
  };

  return findSolutions(0);
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme

  var board = new Board({n: n});

  var findSolutions = function(row) {
    // Base case
    if (row === n) {
      solutionCount++;
      return;
    }

    // Recurse case
    for ( var i = 0; i < n; i++ ) {
      board.togglePiece(row, i);
      if ( !board.hasAnyRooksConflicts() ) {
        findSolutions(row + 1);
      }
      board.togglePiece(row, i);
    }
  };

  findSolutions(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.findSolutions = function(row, n, board, validator, callback) {

  if (row === n) {
    callback();
    return;
  }

  for (var i = 0; i < n; i++) {
    board.togglePiece(row, i);

    if (!board[validator]()) {
      findSolutions(row + 1, n, board, validator, callback);
    }

    board.togglePiece(row, i);
  }

};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution = board.rows();

  findSolutions(0, n, board, 'hasAnyQueensConflicts', function() {
    solution = _.map(board.rows(), function(row) {
      return row.slice();
    });
  });

  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme

  var board = new Board({n: n});

  var findSolutions = function(row) {
    // Base case
    if (row === n) {
      solutionCount++;
      return;
    }

    // Recurse case
    for ( var i = 0; i < n; i++ ) {
      board.togglePiece(row, i);
      if ( !board.hasAnyQueensConflicts() ) {
        findSolutions(row + 1);
      }
      board.togglePiece(row, i);
    }
  };

  findSolutions(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
