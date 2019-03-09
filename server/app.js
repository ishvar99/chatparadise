const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message'),
       isRealString=require('../helpers/validation'),
       {Users}=require('../public/users');

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
      		console.log(message);
          io.emit('newMessage',generateMessage(message.from,message.text))
          callback('acknowledgement from server!');
      });
        socket.on('disconnect',()=>{
          console.log(socket.id);
      		var user=users.removeUser(socket.id);
          socket.to(user.room).emit('updatedUserList',users.getUsersList(user.room));
          socket.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`))
      	});
      	socket.on('createLocationMessage',(coords)=>{
      	    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.lat,coords.lon)) 
      	})
      });

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
});