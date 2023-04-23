exports.playOthello = (req, res, q) => {
    let username = q.query.username;
    let cell = q.query.cell;
    let gameId = q.query.id;
    if (cell && gameId) {
      cell = parseInt(cell);
      gameId = parseInt(gameId);
      if (isNaN(cell) || isNaN(gameId)) {
        res.end("");
        return;
      }
  
      st.query('SELECT player_1 , player_2 , cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,cell14,cell15,cell16,cell17,cell18,cell19,cell20,cell21,cell22,cell23,cell24,cell25,cell26,cell27,cell28,cell29,cell30,cell31,cell32,cell33,cell34,cell35,cell36,cell37,cell38,cell39,cell40,cell41,cell42,cell43,cell44,cell45,cell46,cell47,cell48,cell49,cell50,cell51,cell52,cell53,cell54,cell55,cell56,cell57,cell58,cell59,cell60,cell61,cell62,cell63,cell64 FROM games WHERE id=? AND game_active=1', [gameId], (result, err) => {
        if (err) {
          res.end("");
          return;
        }
        if (result.length == 1) {
          let player_1 = result[0].player_1;
          let player_2 = result[0].player_2;
          if (player_1 == username || player_2 == username) {
            let BorW = player_1 == username ? 1 : 2;
            let board = [result[0].cell1, result[0].cell2, result[0].cell3, result[0].cell4, result[0].cell5, result[0].cell6, result[0].cell7, result[0].cell8, result[0].cell9, result[0].cell10, result[0].cell11, result[0].cell12, result[0].cell13, result[0].cell14, result[0].cell15, result[0].cell16, result[0].cell17, result[0].cell18, result[0].cell19, result[0].cell20, result[0].cell21, result[0].cell22, result[0].cell23, result[0].cell24, result[0].cell25, result[0].cell26, result[0].cell27, result[0].cell28, result[0].cell29, result[0].cell30, result[0].cell31, result[0].cell32, result[0].cell33, result[0].cell34, result[0].cell35, result[0].cell36, result[0].cell37, result[0].cell38, result[0].cell39, result[0].cell40, result[0].cell41, result[0].cell42, result[0].cell43, result[0].cell44, result[0].cell45, result[0].cell46, result[0].cell47, result[0].cell48, result[0].cell49, result[0].cell50, result[0].cell51, result[0].cell52, result[0].cell53, result[0].cell54, result[0].cell55, result[0].cell56, result[0].cell57, result[0].cell58, result[0].cell59, result[0].cell60, result[0].cell61, result[0].cell62, result[0].cell63, result[0].cell64];
            let countB = 0;
            for (let i = 0; i < 64; i++) {
              if (board[i] != 0) countB++;
            }
            let isBturn = countB % 2 == 0;
            if (board[cell] == 0 && ((isBturn && BorW == 1) || (!isBturn && BorW == 2))) {
                validDirections = ot.getValidDirections(board, cell, BorW); // Add this line to get valid directions.
                if(validDirections.length > 0){
              st.query("UPDATE games SET cell" + (cell + 1) + "=" + BorW + " WHERE id=?", [gameId], (result, err) => {
                if (err) {
                  res.end("");
                  return;
                }
                for (let direction of validDirections) {
                    ot.flipDiscs(board, cell, direction, BorW, false);
                  }
                  
                let validMove = ot.validMoves(board, 3 - BorW);
                let scoreBlack = 0;
                let scoreWhite = 0;
                let winner = ot.getWinner(player_1, player_2, scoreBlack, scoreWhite);
                if (winner == "draw") {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ winner: null }));
                } else if (winner == BorW) {
                  let winnerName = BorW == 1 ? player_1 : player_2;
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ winner: winnerName }));
                } else {
                  let winnerName = BorW == 1 ? player_2 : player_1;
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ winner: winnerName }));
  
                }
              });
            }
            } else {
  
            }
          }
        } else {
  
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end();
      return;
    }
  };