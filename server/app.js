const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message'),
       {generateLinkMessage}=require('../helpers/message'),
       {generateImageMessage}=require('../helpers/message'),
       isRealString=require('../helpers/validation'),
       db=require('../database/db'),
       {Users}=require('../helpers/users'),
       Message=require('../models/message'),
       bodyParser=require('body-parser'),
       moment =require('moment'),
       passport=require('passport'),
       localStrategy=require('passport-local'),
       passportLocalMongoose=require('passport-local-mongoose');
var   app=express(),
      server=http.createServer(app),//behind the scenes it gets called once you call app.listen()
      io=socketIO(server),
      users=new Users();
      // app.get("/*",(req,res)=>{
      //   res.sendFile(path.join(__dirname,'../public/maintainance.html'))
      // });
      function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
          return next();
        }
        return res.redirect('back')
      }
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
             if(params.room!='lovebites')
              return callback('This room is not yet activated!')
             socket.join(params.room);
             users.removeUser(socket.id);
             users.addUser(socket.id,params.name,params.room,params.avatar,params.gender);
             io.to(params.room).emit('updatedUserList',users.getUsersList(params.room))
              socket.emit('newAdminMessage',generateMessage('Admin','welcome','Admin'))
        socket.broadcast.to(params.room).emit('newAdminMessage',generateMessage('Admin',`${params.name} has joined!`,'Admin'));
           callback();
           Message.find({}).sort({createdBy:1})
        .then((messages)=>{
             socket.emit('loadMessages',messages);
        });
        });
      	socket.on('createMessage',(message,callback)=>{
      	  var user=users.getUser(socket.id);
          if(user&&isRealString(message.text)){
            var body={
              id:user.id,
              name:user.name,
              room:user.room,
              gender:user.gender,
              message:message.text,
              createdAt:new Date().getTime(),
              avatar: user.avatar,
              isLink:false
            }
          Message.create(body)
          .then((message)=>{
             io.to(message.room).emit('newMessage',generateMessage(message.name,message.message,message.avatar,message.gender));
             socket.broadcast.to(message.room).emit('notificationSound');
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
              gender:user.gender,
              message:message.text,
              avatar:user.avatar,
              createdAt:new Date().getTime(),
              isLink:true
            }
             if(user){
              Message.create(body)
              .then((message)=>{
               io.to(message.room).emit('newLinkMessage',generateLinkMessage(message.name,message.message,message.avatar,message.gender));
               socket.broadcast.to(message.room).emit('notificationSound');
              },(err)=>{
                 console.log(err);
              })      
             }
        })
        socket.on('createAdminMessage',(message)=>{
           var user=users.getUser(socket.id);
             var body={
              id:user.id,
              name:'Admin',
              room:user.room,
              message:message.text,
              avatar:'Admin',
              createdAt:new Date().getTime(),
              isLink:false
            }
            if(user){
              Message.create(body)
              .then((message)=>{
               io.to(message.room).emit('newAdminMessage',generateMessage('Admin',message.message,message.avatar));
               socket.broadcast.to(message.room).emit('notificationSound');
              },(err)=>{
                 console.log(err);
              })      
             }
        })
        socket.on('disconnect',()=>{
          console.log("disconnect")
          var user=users.removeUser(socket.id);
          if(user){
           socket.to(user.room).emit('updatedUserList',users.getUsersList(user.room));
           socket.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`))
          }
      	});
        socket.on('createImageMessage',(image)=>{
          var user=users.getUser(socket.id);
             var body={
              id:user.id,
              name:user.name,
              room:user.room,
              gender:user.gender,
              avatar:user.avatar,
              imageURL:image,
              createdAt:new Date().getTime(),
              isLink:false
            }
             if(user){
              Message.create(body)
              .then((message)=>{
                io.to(user.room).emit('newImageMessage',generateImageMessage(message.name,message.imageURL,message.avatar,message.gender));
                socket.broadcast.to(message.room).emit('notificationSound');
              },(err)=>{
                 console.log(err);
              })      
             }
            });
      	socket.on('createLocationMessage',(coords)=>{
            var user=users.getUser(socket.id);
            var locationObj=generateLocationMessage(user.name,coords.lat,coords.lon,user.avatar,user.gender);
            var body={
              id:user.id,
              name:user.name,
              room:user.room,
              gender:user.gender,
              url:locationObj.url,
              createdAt:new Date().getTime(),
              isLink:false,
              avatar:user.avatar
            }
            if(user){
              Message.create(body)
              .then((message)=>{
                io.to(message.room).emit('newLocationMessage',locationObj,message.avatar,message.gender);
                socket.broadcast.to(message.room).emit('notificationSound');
              })  	    
            } 
      	});

      });
      app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
});
