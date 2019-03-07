const express=require('express'),
      socketIO=require('socket.io'),
      http=require('http'),
      path=require('path'),
      publicPath=path.join(__dirname,'../public'),
      port=process.env.PORT||3000,
      {generateMessage}=require('../helpers/message'),
       {generateLocationMessage}=require('../helpers/message');
var   app=express(),
      server=http.createServer(app),//behind the scenes it gets called once you call app.listen()
      io=socketIO(server);
      io.on('connection',(socket)=>{
      	console.log('new user connected!');
      	socket.emit('newMessage',generateMessage('Admin','welcome'))
      	socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined!'))
      	socket.on('createMessage',(message,callback)=>{
      		console.log(message)
          io.emit('newMessage',generateMessage(message.from,message.text))
          callback('acknowledgement from server!');
      });
        socket.on('disconnect',()=>{
      		console.log("user disconnected!")
      	});
      	socket.on('createLocationMessage',(coords)=>{
      	    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.lat,coords.lon)) 
      	})
      });

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
});