//This function takes in a board, an index representing the location of the spot being played,
// an integer representing the current player (1 for black, 2 for white), 
//and a boolean flag indicating whether to check only or actually flip discs.
// It determines whether the current move would result in any discs being flipped,and if so,
//it either flips the discs (if checkOnly is false) or simply returns true (if checkOnly is true).
exports.flipDiscs = (board, index, isBorW, checkOnly) => {
  const opponentPlayer = isBorW === 1 ? 2 : 1;
  const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  let flipped = false;

  for (let direction of directions) {
    let currentIndex = index + direction;
    let flipList = [];

    while (board[currentIndex] === opponentPlayer) {
      flipList.push(currentIndex);
      currentIndex += direction;
    }

    if (flipList.length > 0 && board[currentIndex] === isBorW) {
      if (!checkOnly) {
        for (let flipIndex of flipList) {
          board[flipIndex] = isBorW;
        }
        board[index] = isBorW;
      }
      flipped = true;
    }
  }

  return flipped;
};


//This function takes in a board, an index representing the location of the spot being played, 
//and an integer representing the current player (1 for black, 2 for white).
// It checks whether the spot is empty and whether playing there would result in any discs being flipped,
// and returns a boolean indicating whether the move is valid.
exports.canClickSpot = (board, index, currentPlayer) => {
  return board[index] === 0 && exports.flipDiscs(board, index, currentPlayer, true);
};

//This function takes in a board, an index representing the location of the spot being played, 
//and an integer representing the current player (1 for black, 2 for white). 
//It sets the chosen spot on the board to the current player, 
//and then calls exports.flipDiscs to flip any necessary discs.
exports.makeMove = (board, cell, BorW) => {
  const currentPlayer = BorW;
  board[cell] = currentPlayer;
  exports.flipDiscs(board, cell, currentPlayer, false);
  return board;
};

//This function takes in a board and an integer representing the current player (1 for black, 2 for white).
// It returns an array of all valid moves for the current player (i.e. all spots that are empty and where playing there would result in at least one disc being flipped).
exports.validMoves = (board, currentPlayer) => {
  const validMoves = [];
  for (let i = 0; i < 64; i++) {
    if (exports.canClickSpot(board, i, currentPlayer)) {
      validMoves.push(i);
    }
  }
  return validMoves;
};

//This function takes in a board and the usernames of the two players.
// It determines the winner of the game based on the final score of the board (i.e. the number of black discs minus the number of white discs). 
//If the score is tied, it returns 'draw'.
exports.getWinner = (board, player1, player2) => {
  let scoreBlack = 0;
  let scoreWhite = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] == 1) scoreBlack++;
    if (board[i] == 2) scoreWhite++;
  }

  let scoreDifference = scoreBlack - scoreWhite;

  if (scoreDifference === 0) {
    return 'draw';
  } else if (scoreDifference > 0) {
    return player1;
  } else {
    return player2;
  }
};

//This function takes in a board and checks whether the game is over. It does this by checking whether both players have any valid moves remaining.
// If neither player has any valid moves, the game is over.
exports.isGameOver = (board) => {
  const player1Moves = exports.validMoves(board, 1);
  const player2Moves = exports.validMoves(board, 2);

  if (player1Moves.length === 0 && player2Moves.length === 0) {
    return true;
  } else {
    return false;
  }
}

