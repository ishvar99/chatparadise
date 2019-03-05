const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000;
var   app=express(),
      server=http.createServer(app),//behind the scenes it gets called once you call app.listen()
      io=socketIO(server);
      io.on('connection',(socket)=>{
      	console.log('new user connected!');
      	socket.emit('newMessage',{
      	    from:'admin',                          
      	    text:'welcome,to chatroom'
      	})
      	socket.broadcast.emit('newMessage',{
      		from:'admin',
      		text:'new user joined the chatroom'
      	})
      	socket.on('createMessage',(message)=>{
          io.emit('newMessage',{
             from:message.from,
             text:message.text,
             createdAt:new Date().getTime()
          })
      	})
      	socket.on('disconnect',()=>{
      		console.log("user disconnected!")
      	})
      })
app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
})