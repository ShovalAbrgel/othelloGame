let st = require('./server_tools');
let ot = require('./othelloGame');

//This function handles user authentication
function checkUsernameAndPassword(q) {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    return false;
  }
  return true;
}

//This function handles user registration
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

//This function handles user login and authentication
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

//This function handles a request to enter a lobby in a multiplayer game.
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

//This function is responsible for starting a game between two players. 
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


//function getGameId is an API endpoint that retrieves the id of a game that is currently active and involves the specified user
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

//function getStatus is also an API endpoint that retrieves the status of a game with the specified id.
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

      const validMoves = ot.validMoves(board, currentPlayerNumber);

      //if the user allow to click
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
      };

      //The canClickArray property contains an array of boolean values indicating whether the user can make a move on the corresponding cell on the board. 

      //The blackScore and whiteScore properties contain the scores of the two players

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
      //The response is returned as a JSON object.
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(gameStatus));
    }

  });
};
//This function handles a player move in a game of Othello (also known as Reversi) by updating the game board in the database and checking if the game is over.
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
    let player_1;
    let player_2;
    st.query('SELECT player_1 , player_2 , cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,cell14,cell15,cell16,cell17,cell18,cell19,cell20,cell21,cell22,cell23,cell24,cell25,cell26,cell27,cell28,cell29,cell30,cell31,cell32,cell33,cell34,cell35,cell36,cell37,cell38,cell39,cell40,cell41,cell42,cell43,cell44,cell45,cell46,cell47,cell48,cell49,cell50,cell51,cell52,cell53,cell54,cell55,cell56,cell57,cell58,cell59,cell60,cell61,cell62,cell63,cell64 FROM games WHERE id=? AND game_active=1', [gameId], (result, err) => {
      if (err) {
        res.end("");
        return;
      }
      if (result.length == 1) {
        player_1 = result[0].player_1;
        player_2 = result[0].player_2;
        if (player_1 == username || player_2 == username) {
          //Determine whether the player making the request is player_1 or player_2
          let BorW = player_1 == username ? 1 : 2;
          // Extract the board data from the database result and parse it as an array of integers
          let board = [result[0].cell1, result[0].cell2, result[0].cell3, result[0].cell4, result[0].cell5, result[0].cell6, result[0].cell7, result[0].cell8, result[0].cell9, result[0].cell10, result[0].cell11, result[0].cell12, result[0].cell13, result[0].cell14, result[0].cell15, result[0].cell16, result[0].cell17, result[0].cell18, result[0].cell19, result[0].cell20, result[0].cell21, result[0].cell22, result[0].cell23, result[0].cell24, result[0].cell25, result[0].cell26, result[0].cell27, result[0].cell28, result[0].cell29, result[0].cell30, result[0].cell31, result[0].cell32, result[0].cell33, result[0].cell34, result[0].cell35, result[0].cell36, result[0].cell37, result[0].cell38, result[0].cell39, result[0].cell40, result[0].cell41, result[0].cell42, result[0].cell43, result[0].cell44, result[0].cell45, result[0].cell46, result[0].cell47, result[0].cell48, result[0].cell49, result[0].cell50, result[0].cell51, result[0].cell52, result[0].cell53, result[0].cell54, result[0].cell55, result[0].cell56, result[0].cell57, result[0].cell58, result[0].cell59, result[0].cell60, result[0].cell61, result[0].cell62, result[0].cell63, result[0].cell64];
          // Create a new board by making the requested move
          let newBoard = board;
          if (board[cell] == 0) {
            let newBoard = ot.makeMove(board, cell, BorW);
            //Update the game board in the database with the new board state
            st.query('UPDATE games SET cell1=?, cell2=?, cell3=?, cell4=?, cell5=?, cell6=?, cell7=?, cell8=?, cell9=?, cell10=?, cell11=?, cell12=?, cell13=?, cell14=?, cell15=?, cell16=?, cell17=?, cell18=?, cell19=?, cell20=?, cell21=?, cell22=?, cell23=?, cell24=?, cell25=?, cell26=?, cell27=?, cell28=?, cell29=?, cell30=?, cell31=?, cell32=?, cell33=?, cell34=?, cell35=?, cell36=?, cell37=?, cell38=?, cell39=?, cell40=?, cell41=?, cell42=?, cell43=?, cell44=?, cell45=?, cell46=?, cell47=?, cell48=?, cell49=?, cell50=?, cell51=?, cell52=?, cell53=?, cell54=?, cell55=?, cell56=?, cell57=?, cell58=?, cell59=?, cell60=?, cell61=?, cell62=?, cell63=?, cell64=? WHERE id=?', newBoard.concat([gameId]), (result, err) => { // i used concat here to combine the elements of newBoard array with the gameId value into a single array.
              if (err) {
                res.end("");
                return;
              }
              //Respond with the updated board state
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newBoard));

            });
          }
          //If the move is not valid, return an empty response
          if (!ot.validMoves(board, cell, BorW)) {
            res.end("");
            return;
          }
          //Check whether the game is over
          let gameover = ot.isGameOver(newBoard);
          if (gameover) {
            let numBlack = 0;
            let numWhite = 0;
            for (let i = 0; i < 64; i++) {
              if (board[i] == 1) numBlack++;
              if (board[i] == 2) numWhite++;
            }
            let scoreBlack = numBlack > numWhite ? numBlack : 0;
            let scoreWhite = numWhite > numBlack ? numWhite : 0;

            let winner = scoreBlack > scoreWhite ? player_1 : player_2;
            if (scoreBlack == scoreWhite) {
              winner = "draw";
            }
            st.query("UPDATE games SET game_active=0, winner=? WHERE id=?", [winner, gameId], (result, err) => {
              if (err) {
                console.log(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error executing SQL query');
                return;
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(winner));
            });
          }
          //Determine whether it is black's or white's turn
          let countB = 0;
          for (let i = 0; i < 64; i++) {
            if (board[i] != 0) countB++;
          }
          let isBturn = countB % 2 == 0;
          if (board[cell] == 0 && ((isBturn && BorW == 1) || (!isBturn && BorW == 2))) {
            console.log(board);
            st.query("UPDATE games SET cell" + (cell + 1) + "=" + BorW + " WHERE id=?", [gameId], (result, err) => {
              if (err) {
                console.log("Error updating game board: ", err);
                res.end("");
                return;
              } else {
                console.log("Game board updated successfully!");
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("ok");
              }
            });
          } else {
            //If the move is not valid or it is not the player's turn, return an empty response
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("");
          }
        }//If the move is not valid or it is not the player's turn, return an empty response
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("");
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
};

//This function is responsible for handling the request to leave a game
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


//This function validates a user's credentials by querying a database to check if there is a user with the specified username and password. It takes in three parameters: username, password, and callback.
function validateUser(username, password, callback) {
  st.query("SELECT COUNT(*) AS count FROM users WHERE username=? AND BINARY password=?", [username, password], (result, err) => {
    if (err) {
      callback(false);
      return;
    }
    callback(result[0].count == 1);
  });
}










