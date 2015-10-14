
module.exports = function (io) {
  var connectedUsers = [];

  io.sockets.on('connection', function (socket) {
  	console.log('connected::::::::::::::::::::::::::::::::::'+socket.id);
    socket.on('message', function (data) {
      if(data.to == 'group'){
        socket.broadcast.emit('message',data);
      }else{
        io.sockets.in(data.to).emit('message', data);
      }
    });

    socket.on('join', function(data){
      if(data.username && connectedUsers.indexOf(data.username) == -1){
        connectedUsers.push(data.username);
      }
      data.connectedUsers = connectedUsers;
      //send to all users including sender
      console.log(connectedUsers);
      io.emit('newUser',data);
      socket.nickName = data.username;
      socket.join(data.username);
    });

    socket.on('logout', function(data){
      connectedUsers.splice(connectedUsers.indexOf(data.username), 1);
        var user = {};
       user.connectedUsers = connectedUsers;
       console.log('Disconnect:'+connectedUsers);
        socket.broadcast.emit('newUser',user);
    });

    socket.on('disconnect', function(data){
      /*console.log('Disconnect:'+socket.nickName);
      connectedUsers.splice(connectedUsers.indexOf(socket.nickName), 1);
        var user = {};
       user.connectedUsers = connectedUsers;
       console.log('Disconnect:'+connectedUsers);
        io.emit('newUser',user);*/
    });
  });
};



//Notes
/*
// sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');

*/