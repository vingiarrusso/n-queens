// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function(){

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (typeof params == "undefined" || params == null) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function(){
      return _(_.range(this.get('n'))).map(function(rowIndex){
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex){
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex){
      //console.log(rowIndex,colIndex, colIndex - rowIndex);
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex){
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function(){
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex){
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function(){
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex){
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
    hasRowConflictAt: function(rowIndex){
      var row = this.get(rowIndex);
      var count = 0;
      for( var i=0; i<row.length; i++){
        count += row[i];
      }
     return count > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function(){
      
      var size = this.get('n');
      for( var i=0; i<size; i++){
        if(this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    // 
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex){
      
      var column = this.get(colIndex);
      var count = 0;

      for(var j = 0; j < column.length; j++) {
        count += this.get(j)[colIndex];
      }

      return count > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function(){
      
      var size = this.get('n');
      for(var i = 0; i < size; i++) {
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    // 
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow){
      var column = majorDiagonalColumnIndexAtFirstRow;
      var index = column;
      var counter = 0;
      var size = this.get('n');
      //if(column === 3) return counter > 1;
      if(column<0){
        column = Math.abs(column);
        index = column+1;
        for( var i =0; i< size -index + 1; i++){
          counter += this.get(column)[i];
          column++;
        }
      } else {
        for(var j = 0; j < size - index; j++ ) {
          counter += this.get(j)[column];
          column++;
        }
      }
      return counter > 1;

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function(){
      var size = this.get('n');
      for(var i = -2; i < size; i++){
        if(this.hasMajorDiagonalConflictAt(i)){
          return true;
        }
      }

      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    // 
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow){
      var size = this.get('n');
      var col = minorDiagonalColumnIndexAtFirstRow;
      var row = 0;
      var counter = 0;
      if(col === 0) {
        return false;
      }
      if(col >= size -1) {
        row = col - size + 1;
        col = size - 1;
      }

      for(var i = row; i < size; i++) {
        if(col >= 0) {
          counter+= this.get(i)[col];
          col--;
        }
      }

      return counter > 1;

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function(){
      var size = this.get('n');
      for(var i = 0; i <= size + 1; i++) {
        if(this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n){
    return _(_.range(n)).map(function(){
      return _(_.range(n)).map(function(){
        return 0;
      });
    });
  };

}());
