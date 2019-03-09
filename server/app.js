const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message'),
       isRealString=require('../helpers/validation'),
       {Users}=require('../helpers/users');

var   app=express(),
      server=http.createServer(app),//behind the scenes it gets called once you call app.listen()
      io=socketIO(server),
      users=new Users();
      io.on('connection',(socket)=>{
      	console.log('new user connected!');
        socket.on('join',(params,callback)=>{
             if(!isRealString(params.name)||!isRealString(params.room)){
                return callback('name and room required!');
             }
             socket.join(params.room);
             users.removeUser(socket.id);
             users.addUser(socket.id,params.name,params.room);
             io.to(params.room).emit('updatedUserList',users.getUsersList(params.room))
              socket.emit('newMessage',generateMessage('Admin','welcome'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined!`));
           callback();
        });
      	socket.on('createMessage',(message,callback)=>{
      	  var user=users.getUser(socket.id);
          if(user&&isRealString(message.text)){ 
          io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
        }
          callback('acknowledgement from server!');
      });
        socket.on('disconnect',()=>{
          var user=users.removeUser(socket.id);
          if(user){
           socket.to(user.room).emit('updatedUserList',users.getUsersList(user.room));
           socket.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`))
          }
      	});
      	socket.on('createLocationMessage',(coords)=>{
            var user=users.getUser(socket.id);
            if(user){
      	    io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.lat,coords.lon))
            } 
      	})
      });

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
});