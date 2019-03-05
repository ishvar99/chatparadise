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
           from:'Ishan',
           text:'hey',
           createdAt:'10:40 PM'
      	})
      	socket.on('createMessage',(message)=>{
            console.log(message);
      	})
      	socket.on('disconnect',()=>{
      		console.log("user disconnected!")
      	})
      })
app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Server is up on ${port}!`)
})