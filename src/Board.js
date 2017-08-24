// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      let hasConflict = this.get(rowIndex).reduce((a, b) => a + b);

      return hasConflict > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      let bSize = this.get('n');

      for (var i = 0; i < bSize; i ++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let bSize = this.get('n');
      let colArr = [];

      for (var i = 0; i < bSize; i++) {
        colArr.push(this.get(i)[colIndex]);
      }

      let hasConflict = colArr.reduce((a, b) => a + b);

      return hasConflict > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let bSize = this.get('n');

      for (var i = 0; i < bSize; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }

      return false;
    },

    buildBufferBoard: function() {
      let bufferSize = this.get('n') * 2;
      let boardL = [];
      let boardR = [];
      let buffer = new Array(this.get('n')).fill(0);

      for (var i = 0; i < this.get('n'); i++) {
        boardL.push(buffer.concat(this.get(i)));
        boardR.push(this.get(i).concat(buffer));
      }

      this.set('bufferBoardL', boardL);
      this.set('bufferBoardR', boardR);
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, board) {
      let bSize = board.length;
      let diagArr = [];
      let current = majorDiagonalColumnIndexAtFirstRow;

      for (var row = 0; row < bSize; row++) {
        let val = board[row][current];
        if (val !== undefined) {
          diagArr.push(val);
        }
        current++;
      }
      let hasConflict = diagArr.reduce((a, b) => a + b);

      return hasConflict > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let bufferSize = this.get('n') * 2;

      // if (!this.get('bufferBoardL')) {
      //   this.buildBufferBoard();
      // }
      // let board = this.get('bufferBoardL');

      let board = [];
      let buffer = new Array(this.get('n')).fill(0);

      for (var i = 0; i < this.get('n'); i++) {
        board.push(buffer.concat(this.get(i)));
      }

      for (var i = 0; i < bufferSize; i++) {
        if (this.hasMajorDiagonalConflictAt(i, board)) {
          return true;
        }
      }

      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, board) {
      let bSize = board.length;
      let diagArr = [];
      let current = minorDiagonalColumnIndexAtFirstRow;

      for (var row = 0; row < bSize; row++) {
        let val = board[row][current];
        if (val !== undefined) {
          diagArr.push(val);
        }
        current--;
      }

      let hasConflict = diagArr.reduce((a, b) => a + b);

      return hasConflict > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let bufferSize = this.get('n') * 2;

      // if (!this.get('bufferBoardR')) {
      //   this.buildBufferBoard();
      // }
      // let board = this.get('bufferBoardR');

      let board = [];
      let buffer = new Array(this.get('n')).fill(0);

      for (var i = 0; i < this.get('n'); i++) {
        board.push(this.get(i).concat(buffer));
      }

      for (var i = 0; i < bufferSize; i++) {
        if (this.hasMinorDiagonalConflictAt(i, board)) {
          return true;
        }
      }

      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
