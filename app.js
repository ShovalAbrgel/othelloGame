let http = require('http');
let url = require('url');
let mysql = require('mysql');
let st = require('./server_tools');
let api = require('./api_functions');


const apiFunctions = {
    '/signup' : api.signup,
    '/login' : api.login,
    '/lobby' : api.lobby,
    '/start_game' : api.startgame,
    '/leave_game' : api.leaveGame,
    '/get_game_id' : api.getGameId,
    '/get_game_status' : api.getStatus,
    '/play_othello' : api.playOthello,
};

http.createServer((req,res)=>{
   let q = url.parse(req.url,true);
   let path = q.pathname;
   if(path.startsWith('/api')){
    path = path.substring(4);
    if(!apiFunctions[path]){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('no such action');
        return;
    }
    apiFunctions[path](req,res,q);

   }else{
    st.serveStaticFile(path,res);
   }

}).listen(3000 , ()=>{
    console.log('server started on port 3000');
});


