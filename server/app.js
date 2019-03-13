const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message'),
       {generateLinkMessage}=require('../helpers/message'),
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
             users.users.forEach((user)=>{
               if(user.name==params.name)
                return callback('username taken!!')
             })
             if(params.room!='room1'&&params.room!='room2'&&params.room!='room3')
              return callback('This room is not yet activated!')
             socket.join(params.room);
             users.removeUser(socket.id);
             users.addUser(socket.id,params.name,params.room);
             io.to(params.room).emit('updatedUserList',users.getUsersList(params.room))
              socket.emit('newMessage',generateMessage('Admin','welcome'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined!`));
           callback();
           person.find({}).sort({createdBy:1})
        .then((persons)=>{
             console.log(persons)
             socket.emit('loadMessages',persons);
        });
        });
      	socket.on('createMessage',(message,callback)=>{
      	  var user=users.getUser(socket.id);
          if(user&&isRealString(message.text)){
            var body={
              id:user.id,
              name:user.name,
              room:user.room,
              message:message.text,
              createdAt:new Date().getTime(),
              isLink:false
            }
          person.create(body)
          .then((person)=>{
             io.to(person.room).emit('newMessage',generateMessage(person.name,person.message))
             callback('acknowledgement from server!');
          },(err)=>{
            console.log(err);
          }) 
        }
      });
        socket.on('createLinkMessage',(message)=>{
             var user=users.getUser(socket.id);
             var body={
              id:user.id,
              name:user.name,
              room:user.room,
              message:message.text,
              createdAt:new Date().getTime(),
              isLink:true
            }
             if(user){
              person.create(body)
              .then((person)=>{
                console.log(person)
               io.to(person.room).emit('newLinkMessage',generateLinkMessage(person.name,person.message))
              },(err)=>{
                 console.log(err);
              })      
             }
        })
        socket.on('disconnect',()=>{
          var user=users.removeUser(socket.id);
          if(user){
           socket.to(user.room).emit('updatedUserList',users.getUsersList(user.room));
           socket.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`))
          }
      	});
      	socket.on('createLocationMessage',(coords)=>{
            var user=users.getUser(socket.id);
            var locationObj=generateLocationMessage(person.name,coords.lat,coords.lon);
            var body={
              id:user.id,
              name:user.name,
              room:user.room,
              url:locationObj.url,
              createdAt:new Date().getTime(),
              isLink:false
            }
            if(user){
              person.create(body)
              .then((person)=>{
                io.to(person.room).emit('newLocationMessage',locationObj);
              })  	    
            } 
      	})
      });
app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
});
