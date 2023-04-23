let st = require('./server_tools');
let ot = require('./othelloGame');

function checkUsernameAndPassword(q) {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    return false;
  }
  return true;
}

exports.signup = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  st.query("INSERT INTO users(username,password) VALUES (?,?)", [username, password], (result, err) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("taken");
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("ok");
  });
};


exports.login = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  validateUser(username, password, (isValid) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(isValid ? "ok" : "invalid");
  });
};

exports.lobby = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  st.query("UPDATE users SET lobby=? WHERE username=? AND NOT lobby=-1", [Date.now(), username], (result, err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error executing SQL query');
      return;
    }
    st.query("SELECT username FROM users WHERE ? - lobby < 2000", [Date.now()], (result, err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error executing SQL query');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  });
};

exports.startgame = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  let partner = q.query.partner;
  if (!partner) return;
  st.query("UPDATE users SET lobby=-1 WHERE username IN (?,?) AND ?-lobby<30000", [username, partner, Date.now()], (result, err) => {
    if (err) {
      console.log(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error executing SQL query');
      return;
    }
    if (result.affectedRows == 2) {
      st.query("INSERT INTO games(player_1,player_2,currentPlayer, gameTurn) VALUES (?,?,?,?)", [username, partner, username, 1], (result, err) => {
        if (err) {
          //add something
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("ok");
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("error");
    }
  });
};



exports.getGameId = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  st.query("SELECT id FROM games WHERE (player_1=? OR player_2=?) AND game_active=1", [username, username], (result, err) => {
    if (err) {
      res.end("");
      return;
    }
    if (result.length >= 1) {
      let gameId = result[0].id;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(gameId + "");
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("-1");
    }

  });

};





exports.getStatus = (req, res, q) => {
  let username = q.query.username;
  let gameId = q.query.id;
  if (!gameId) return;
  st.query("SELECT player_1 , player_2 , game_active , gameTurn,currentPlayer ,cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,cell14,cell15,cell16,cell17,cell18,cell19,cell20,cell21,cell22,cell23,cell24,cell25,cell26,cell27,cell28,cell29,cell30,cell31,cell32,cell33,cell34,cell35,cell36,cell37,cell38,cell39,cell40,cell41,cell42,cell43,cell44,cell45,cell46,cell47,cell48,cell49,cell50,cell51,cell52,cell53,cell54,cell55,cell56,cell57,cell58,cell59,cell60,cell61,cell62,cell63,cell64 FROM games WHERE id=? AND (player_1=? OR player_2=?)", [gameId, username, username], (result, err) => {
    if (err) {
      res.end("");
      return;
    }

    if (result.length == 1) {
      let board = [result[0].cell1, result[0].cell2, result[0].cell3, result[0].cell4, result[0].cell5, result[0].cell6, result[0].cell7, result[0].cell8, result[0].cell9, result[0].cell10, result[0].cell11, result[0].cell12, result[0].cell13, result[0].cell14, result[0].cell15, result[0].cell16, result[0].cell17, result[0].cell18, result[0].cell19, result[0].cell20, result[0].cell21, result[0].cell22, result[0].cell23, result[0].cell24, result[0].cell25, result[0].cell26, result[0].cell27, result[0].cell28, result[0].cell29, result[0].cell30, result[0].cell31, result[0].cell32, result[0].cell33, result[0].cell34, result[0].cell35, result[0].cell36, result[0].cell37, result[0].cell38, result[0].cell39, result[0].cell40, result[0].cell41, result[0].cell42, result[0].cell43, result[0].cell44, result[0].cell45, result[0].cell46, result[0].cell47, result[0].cell48, result[0].cell49, result[0].cell50, result[0].cell51, result[0].cell52, result[0].cell53, result[0].cell54, result[0].cell55, result[0].cell56, result[0].cell57, result[0].cell58, result[0].cell59, result[0].cell60, result[0].cell61, result[0].cell62, result[0].cell63, result[0].cell64];
      let currentPlayer = result[0].gameTurn == 1 ? result[0].player_1 : result[0].player_2;

      let rowIndex = 1; // 0-based index for the second row
      let columnIndex = 2; // 0-based index for the third column
      let index = rowIndex * 8 + columnIndex;

      const playerMapping = {
        [result[0].player_1]: 1,
        [result[0].player_2]: 2
      };

      // Replace 'playerName' with the actual name of the current player
      const currentPlayerNumber = playerMapping[currentPlayer];

      // Now you can pass 'currentPlayerNumber' to the functions
      const validMoves = ot.validMoves(board, currentPlayerNumber);


      let canClickArray = validMoves.map(move => {
        const rowIndex = Math.floor(move / 8);
        const columnIndex = move % 8;
        return ot.canClickSpot(board, move, currentPlayerNumber);
      });



      let gameStatus = {
        id: gameId,
        player_1: result[0].player_1,
        player_2: result[0].player_2,
        game_active: result[0].game_active[0] == 1,
        board: board,
        gameTurn: result[0].gameTurn,
        currentPlayer: currentPlayer,
        blackScore: 0,
        whiteScore: 0,
        canClickArray: canClickArray,
        validMoves: validMoves
      };

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let cell = result[0]['cell' + i + j];
          if (cell === 1) {
            gameStatus.blackScore++;
          } else if (cell === 2) {
            gameStatus.whiteScore++;
          }

        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(gameStatus));
    }

  });
};


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
            st.query("UPDATE games SET cell" + (cell + 1) + "=" + BorW + " WHERE id=?", [gameId], (result, err) => {
              if (err) {
                res.end("");
                return;
              }
              const validMove = ot.validMoves(board, cell, BorW);
              if(validMove.length === 0){
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "No valid moves available. Turn passed." }));
              }else{
                let winner = ot.getWinner(board, player_1, player_2);

                if (winner !== null) {
                  st.query("UPDATE games SET game_active=0 WHERE id=?", [gameId], (result, err) => {
                    if (err) {
                      res.end("");
                      return;
                    }
          
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ winner: winner }));
                    return;
                  });
                } else {
                  st.query("UPDATE games SET current_player=? WHERE id=?", [isBturn ? player_1 : player_2, gameId], (result, err) => {
                    if (err) {
                      res.end("");
                      return;
                    }
          
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ board: board, currentPlayer: isBturn ? player_1 : player_2, validMoves: validMove }));
                    return;
                  });
                }
              }
              });
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



exports.leaveGame = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!checkUsernameAndPassword(q)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  st.query("SELECT id,player_1,player_2 FROM games WHERE (player_1=? OR player_2=?) AND game_active=1", [username, username], (result, err) => {
    if (err) {
      //not now

      return;
    }
    if (result.length >= 1) {
      let gameId = result[0].id;
      let partner;
      if (result[0].player_1 == username) {
        partner = result[0].player_2;
      } else {
        partner = result[0].player_1;
      }


      st.query("UPDATE games SET game_active=0 WHERE id=? AND game_active=1", [gameId], (result, err) => {
        if (err) {
          //not now

          return;
        }
        if (result.affectedRows == 1) {
          st.query("UPDATE users SET lobby=0 WHERE username IN (?,?)", [username, partner], (result, err) => {
            if (err) {
              //not now

              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("ok");
          });
        } else if (result.affectedRows == 0) {
          st.query("UPDATE users SET lobby=0 WHERE username = ?", [username], (result, err) => {
            if (err) {
              //not now

              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("ok");
          });
        }


      });

    }
  });
};



function validateUser(username, password, callback) {
  st.query("SELECT COUNT(*) AS count FROM users WHERE username=? AND BINARY password=?", [username, password], (result, err) => {
    if (err) {
      callback(false);
      return;
    }
    callback(result[0].count == 1);
  });
}










