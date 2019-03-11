const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message'),
       isRealString=require('../helpers/validation'),
       db=require('../database/db'),
       {Users}=require('../helpers/users'),
       person=require('../models/users'),
       moment =require('moment')
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
             if(params.room!='room1'&&params.room!='room2'&&params.room!='room3')
              return callback('This room is not yet activated!')
             var body={id:socket.id,name:params.name,room:params.room,gender:params.gender}
             person.create(body).
             then((user)=>{
             console.log(user);
                  socket.join(user.room);
             users.removeUser(socket.id);
             users.addUser(socket.id,user.name,user.room);
             io.to(user.room).emit('updatedUserList',users.getUsersList(user.room))
              socket.emit('newMessage',generateMessage('Admin','welcome'))
        socket.broadcast.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has joined!`));
           callback();
             })
             .catch((err)=>{
              return callback('username taken!');
             })
            
        });
      	socket.on('createMessage',(message,callback)=>{
      	  var user=users.getUser(socket.id);
          if(user&&isRealString(message.text)){ 
              person.findOne({name:user.name}).then((user)=>{
              user.messages.push({text:message.text});
              user.save();
          },(err)=>{
            console.log(err);
          })
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
