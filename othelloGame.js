exports.flipDiscs = (board, index, direction, currentPlayer, checkOnly) => {
  const opponentPlayer = currentPlayer === 1 ? 2 : 1;
  let currentIndex = index + direction;
  let flipped = false;
  let valid = false;

  const isValidIndex = (currentIndex, direction) => {
    const rowDiff = Math.abs(Math.floor(currentIndex / 8) - Math.floor((currentIndex - direction) / 8));
    const colDiff = Math.abs((currentIndex % 8) - ((currentIndex - direction) % 8));
    return rowDiff <= 1 && colDiff <= 1;
  };

  while (isValidIndex(currentIndex, direction) && board[currentIndex] === opponentPlayer) {
    currentIndex += direction;
    if (board[currentIndex] === currentPlayer) {
      valid = true;
      flipped = true;
      break;
    }
  }

  if (flipped && !checkOnly) {
    currentIndex = index + direction;
    while (isValidIndex(currentIndex, direction) && board[currentIndex] === opponentPlayer) {
      board[currentIndex] = currentPlayer;
      currentIndex += direction;
    }
  }

  return valid;
};


exports.canClickSpot = (board, index, currentPlayer) => {
  const directions = [
    -9, -8, -7, // Up-left, Up, Up-right
    -1, 1, // Left, Right
    7, 8, 9 // Down-left, Down, Down-right
  ];

  for (let direction of directions) {
    if (exports.flipDiscs(board, index, direction, currentPlayer, true)) {
      return true;
    }
  }
  return false;
};

exports.validMoves = (board, cell, currentPlayer) => {
  const validMoves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const index = i * 8 + j;
      if (board[index] === 0) {
        const isValidMove = exports.canClickSpot(board, index, currentPlayer);
        if (isValidMove) {
          validMoves.push(index);
        }
      }
    }
  }
  return validMoves;
};


exports.getWinner = (board, player1, player2) => {
  let scoreBlack = 0;
  let scoreWhite = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] == 1) scoreBlack++;
    if (board[i] == 2) scoreWhite++;
  }

  if (scoreBlack === scoreWhite) {
    return 'draw';
  } else if (scoreBlack > scoreWhite) {
    return player1;
  } else {
    return player2;
  }
};
